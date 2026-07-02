import Link from "next/link";
import { notFound } from "next/navigation";
import SemestersAccordion from "../../../components/ModulesAccordion";

// .env.local may or may not already include "/api" — normalize it here.
const RAW_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";
const ORIGIN = RAW_BASE.replace(/\/api\/?$/, "");
const API_BASE = `${ORIGIN}/api`;

function resolveImage(path: string | null | undefined): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${ORIGIN}/${path.replace(/^\/+/, "")}`;
}

interface Qualification {
  id: number;
  course_id: number;
  title: string;
  description: string;
  sort_order: number;
}

interface CourseLevel {
  id: number;
  course_id: number;
  name: string;
  duration: string;
  subtitle: string;
  sort_order: number;
}

interface Subject {
  id: number;
  course_semester_id: number;
  name: string;
  sort_order: number;
}

interface Module {
  id: number;
  course_elective_group_id: number;
  name: string;
  sort_order: number;
}

interface ElectiveGroup {
  id: number;
  course_semester_id: number;
  name: string;
  sort_order: number;
  modules: Module[];
}

export interface Semester {
  id: number;
  course_id: number;
  name: string;
  sort_order: number;
  subjects: Subject[];
  elective_groups: ElectiveGroup[];
}

interface CourseDetail {
  id: number;
  department_id: number | null;
  title: string;
  short_code: string;
  slug: string;
  description: string;
  image: string | null;
  level: string;
  duration: string;
  is_main: boolean;
  is_active: boolean;
  sort_order: number;
  qualifications: Qualification[];
  levels: CourseLevel[];
  semesters: Semester[];
}

async function getCourse(slug: string): Promise<CourseDetail | null> {
  try {
    const res = await fetch(`${API_BASE}/courses/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const payload = await res.json();
    // /api/courses/{slug} -> { data: { course: {...} } }
    return payload?.data?.course ?? null;
  } catch {
    return null;
  }
}

function byOrder<T extends { sort_order: number }>(items: T[] | undefined): T[] {
  if (!items) return [];
  return [...items].sort((a, b) => a.sort_order - b.sort_order);
}

export default async function CourseDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await getCourse(slug);

  if (!course) {
    notFound();
  }

  const img = resolveImage(course.image);
  const qualifications = byOrder(course.qualifications);
  const levels = byOrder(course.levels);
  const semesters = byOrder(course.semesters).map((s) => ({
    ...s,
    subjects: byOrder(s.subjects),
    elective_groups: byOrder(s.elective_groups).map((g) => ({
      ...g,
      modules: byOrder(g.modules),
    })),
  }));

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-[#f0f2f7] border-b border-gray-200 py-3 px-6">
        <div className="max-w-[1280px] mx-auto text-[13px] text-[#607080]">
          <Link href="/" className="hover:text-[#e85d14] transition-colors">Home</Link>
          {" / "}
          <Link href="/courses" className="hover:text-[#e85d14] transition-colors">Courses</Link>
          {" / "}
          <span className="text-[#0b1730] font-medium">{course.title}</span>
        </div>
      </div>

      {/* Hero */}
      <section
        className="py-16 px-6"
        style={{ background: "linear-gradient(135deg, #0b1730 0%, #152244 60%, #1e3060 100%)" }}
      >
        <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row items-center gap-10">
          <div className="text-white max-w-[640px]">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-[12px] font-semibold px-4 py-1.5 rounded-full mb-5">
              <i className="fas fa-graduation-cap text-[#e85d14]"></i> {course.level}
            </div>
            <h1 className="font-extrabold text-white leading-tight mb-4" style={{ fontSize: "clamp(20px,2vw,35px)" }}>
              {course.title}
            </h1>
            <p className="text-white/65 text-[15px] leading-[1.75] mb-6">
              {course.description}
            </p>
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2 text-white/80 text-[13px]">
                <i className="fas fa-tag text-[#e85d14]"></i> {course.short_code}
              </div>
              <div className="flex items-center gap-2 text-white/80 text-[13px]">
                <i className="fas fa-clock text-[#e85d14]"></i> {course.duration}
              </div>
            </div>
          </div>

          {img && (
            <div className="w-full lg:w-[360px] h-[240px] rounded-2xl overflow-hidden shrink-0 border border-white/15">
              <img src={img} alt={course.title} className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </section>

      {/* Entry Qualifications */}
      {qualifications.length > 0 && (
        <section className="py-14 px-6 bg-[#f8f9fc]">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#e85d14] mb-2">Requirements</div>
            <h2 className="font-extrabold text-[#0b1730] mb-8" style={{ fontSize: "clamp(22px,2.8vw,30px)" }}>
              Entry Qualifications
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {qualifications.map((q) => (
                <div key={q.id} className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-[#e85d14] font-bold text-[14px]">
                    <i className="fas fa-check-circle"></i> {q.title}
                  </div>
                  <p className="text-[13.5px] text-[#5a6380] leading-[1.7]">{q.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Course Structure (Levels) timeline */}
      {levels.length > 0 && (
        <section className="py-14 px-6 bg-white">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#e85d14] mb-2">Programme Path</div>
            <h2 className="font-extrabold text-[#0b1730] mb-10" style={{ fontSize: "clamp(22px,2.8vw,30px)" }}>
              Course Structure
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {levels.map((lvl, i) => (
                <div key={lvl.id} className="relative bg-[#f8f9fc] rounded-2xl border border-gray-200 p-6">
                  <div className="w-9 h-9 rounded-full bg-[#e85d14] text-white flex items-center justify-center font-bold text-[14px] mb-4">
                    {i + 1}
                  </div>
                  <h3 className="text-[15px] font-bold text-[#0b1730] mb-1">{lvl.name}</h3>
                  <div className="text-[12px] text-[#e85d14] font-semibold mb-2">{lvl.duration}</div>
                  <p className="text-[13px] text-[#5a6380] leading-[1.7]">{lvl.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Semesters / Subjects / Electives */}
      {semesters.length > 0 && (
        <section className="py-14 px-6 bg-[#f8f9fc]">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#e85d14] mb-2">Curriculum</div>
            <h2 className="font-extrabold text-[#0b1730] mb-10" style={{ fontSize: "clamp(22px,2.8vw,30px)" }}>
              Modules <span className="text-[#e85d14]">Details</span>
            </h2>
            <SemestersAccordion semesters={semesters} />
          </div>
        </section>
      )}

      {/* Back link */}
      <div className="text-center py-10">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#0f2a5e] hover:text-[#e85d14] transition-colors"
        >
          <i className="fas fa-arrow-left text-[12px]"></i> Back to All Courses
        </Link>
      </div>
    </>
  );
}