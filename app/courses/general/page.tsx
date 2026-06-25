import Link from "next/link";
import CourseImage from "./CourseImage";

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
  title: string;
  description: string;
}

interface FullCourse {
  id: number | string;
  img: string;
  imgFallback: string;
  tagLabel: string;
  name: string;
  desc: string;
  qualifications: Qualification[];
  duration?: string;
  level?: string;
  delivery?: string;
  certification?: string;
}

interface PageData {
  courses: FullCourse[];
}

function mapFullCourse(item: any): FullCourse {
  const qualifications: Qualification[] = Array.isArray(item.qualifications)
    ? item.qualifications.map((q: any) => ({
        title: q.title ?? "",
        description: q.description ?? "",
      }))
    : [];

  return {
    id: item.id,
    img: resolveImage(item.image),
    imgFallback: "fa-desktop",
    tagLabel: item.level ?? item.short_code ?? "Foundation",
    name: item.title,
    desc: item.description ?? "",
    qualifications,
    duration: item.duration ?? null,
    level: item.level ?? null,
    delivery: item.delivery_mode ?? item.delivery ?? null,
    certification: item.certification ?? null,
  };
}

async function getPageData(): Promise<PageData> {
  try {
    const res = await fetch(`${API_BASE}/courses`, { cache: "no-store" });
    if (!res.ok) throw new Error("fetch failed");
    const payload = await res.json();
    const items = payload?.data?.courses ?? [];
    const generalOnly = items.filter(
      (item: any) => !item.is_main && item.is_active
    );
    return { courses: generalOnly.map(mapFullCourse) };
  } catch {
    return { courses: [] };
  }
}

// ── Detail row used in the info grid ──────────────────────────────────────────
function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <span className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg bg-[#e85d14]/10">
        <i className={`fas ${icon} text-[#e85d14] text-[13px]`}></i>
      </span>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{label}</p>
        <p className="text-[14px] font-semibold text-[#0b1730]">{value}</p>
      </div>
    </div>
  );
}

// ── Single expanded course card ────────────────────────────────────────────────
function CourseFullCard({ course, index }: { course: FullCourse; index: number }) {
  const isEven = index % 2 === 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      {/* ── Coloured header banner ── */}
      <div
        className="relative px-8 py-8 flex flex-col gap-3"
        style={{
          background: isEven
            ? "linear-gradient(135deg, #0b1730 0%, #1a3060 100%)"
            : "linear-gradient(135deg, #1a1a2e 0%, #0b1730 100%)",
        }}
      >
        {/* dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(232,93,20,0.5) 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
          {/* Course image thumbnail */}
          {course.img && (
            <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 border-white/20">
              <CourseImage
                src={course.img}
                alt={course.name}
                fallbackIcon={course.imgFallback}
              />
            </div>
          )}
          <div className="flex flex-col gap-2">
            {/* Badge */}
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white bg-[#e85d14] px-3 py-1 rounded-full w-fit uppercase tracking-wide">
              <i className="fas fa-graduation-cap text-[10px]"></i>
              {course.tagLabel}
            </span>
            <h2 className="text-white font-extrabold text-[clamp(20px,3vw,28px)] leading-tight">
              {course.name}
            </h2>
          </div>
        </div>
      </div>

      {/* ── Body: description + qualifications + info grid ── */}
      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left / main content — spans 2 cols */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* About */}
          <div>
            <h3 className="text-[15px] font-bold text-[#0b1730] mb-2 flex items-center gap-2">
              <i className="fas fa-info-circle text-[#e85d14]"></i>
              About This Course
            </h3>
            <p className="text-[14px] text-[#5a6380] leading-[1.8]">{course.desc}</p>
          </div>

          {/* Qualifications / what you'll gain */}
          {course.qualifications.length > 0 && (
            <div>
              <h3 className="text-[15px] font-bold text-[#0b1730] mb-3 flex items-center gap-2">
                <i className="fas fa-star text-[#e85d14]"></i>
                What You Will Gain
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.qualifications.map((q, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 bg-[#f8f9fc] rounded-xl p-4 border border-gray-100"
                  >
                    <span className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full bg-[#e85d14]/15 mt-0.5">
                      <i className="fas fa-check text-[#e85d14] text-[11px]"></i>
                    </span>
                    <div>
                      <p className="text-[13px] font-bold text-[#0b1730]">{q.title}</p>
                      <p className="text-[12px] text-[#5a6380] mt-0.5 leading-[1.6]">
                        {q.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right sidebar — course info grid */}
        <div className="flex flex-col gap-4">
          <div className="bg-[#f8f9fc] rounded-2xl border border-gray-100 p-5">
            <h3 className="text-[13px] font-bold text-[#0b1730] uppercase tracking-wide mb-3 flex items-center gap-2">
              <i className="fas fa-list-ul text-[#e85d14]"></i>
              Course Info
            </h3>
            <div className="flex flex-col">
              {course.level && (
                <InfoRow icon="fa-layer-group" label="Level" value={course.level} />
              )}
              {course.duration && (
                <InfoRow icon="fa-clock" label="Duration" value={course.duration} />
              )}
              {course.delivery && (
                <InfoRow icon="fa-map-marker-alt" label="Delivery" value={course.delivery} />
              )}
              {course.certification && (
                <InfoRow icon="fa-certificate" label="Certification" value={course.certification} />
              )}
              {/* Always show these defaults if no API data */}
              {!course.level && !course.duration && !course.delivery && !course.certification && (
                <>
                  <InfoRow icon="fa-layer-group" label="Level" value="Foundation" />
                  <InfoRow icon="fa-users" label="Entry Requirement" value="None — open to all" />
                  <InfoRow icon="fa-certificate" label="Certification" value="UCJ Certified" />
                  <InfoRow icon="fa-pound-sign" label="Cost" value="Free / Fully Funded" />
                </>
              )}
            </div>
          </div>

          {/* CTA */}
          <Link
            href="/contact"
            className="flex items-center justify-center gap-2 bg-[#e85d14] hover:bg-[#c44d0e] text-white font-bold text-[14px] py-3.5 rounded-xl transition-colors"
          >
            <i className="fas fa-paper-plane text-[12px]"></i>
            Enrol Now
          </Link>
          <Link
            href="/courses"
            className="flex items-center justify-center gap-2 border border-[#0b1730]/20 hover:border-[#e85d14] text-[#0b1730] hover:text-[#e85d14] font-semibold text-[13px] py-3 rounded-xl transition-colors"
          >
            <i className="fas fa-arrow-left text-[11px]"></i>
            Back to All Courses
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default async function GeneralCoursePage() {
  const { courses } = await getPageData();

  return (
    <>
      {/* ===== HERO BANNER ===== */}
      <div
        className="relative flex flex-col items-center justify-center text-center py-10 overflow-hidden w-full"
        style={{
          background: "linear-gradient(135deg, #0b1730 0%, #1a3060 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(232,93,20,0.4) 1.5px, transparent 1.5px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative z-10 px-5">
          <div className="text-[#e85d14] text-[12px] font-bold tracking-widest uppercase mb-3">
            <i className="fas fa-book-open mr-2"></i>Foundation Programmes
          </div>
          <h1 className="text-white font-extrabold text-[clamp(32px,5vw,52px)] leading-tight mb-3">
            General{" "}
            <span className="text-[#e85d14] italic">ICT &amp; English</span>
          </h1>
          <p className="text-white/70 text-[15px] mb-5 max-w-[560px] mx-auto">
            Build your core digital literacy and language skills with our
            foundation programmes. Designed for beginners and open to all — no
            prior qualifications required.
          </p>
          <div className="text-white/50 text-[13px]">
            <Link href="/" className="hover:text-[#e85d14] transition-colors">
              Home
            </Link>
            {" / "}
            <Link href="/courses" className="hover:text-[#e85d14] transition-colors">
              Courses
            </Link>
            {" / "}
            <span className="text-[#e85d14]">Foundation Programmes</span>
          </div>
        </div>
      </div>

      {/* ===== FULL DETAILS SECTION ===== */}
      <section className="py-8 bg-[#f8f9fc]">
        <div className="w-full px-4 md:px-8 xl:px-16">
          <h2 className="text-center text-[clamp(22px,3vw,32px)] font-extrabold text-[#0b1730] mb-2">
            Course{" "}
            <span className="text-[#e85d14] italic">Details</span>
          </h2>
          <div className="w-16 h-1 bg-[#e85d14] rounded mx-auto mb-6" />

          {courses.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-16">
              No courses available at the moment.
            </p>
          ) : (
            <div className="flex flex-col gap-10">
              {courses.map((course, i) => (
                <CourseFullCard key={course.id ?? course.name} course={course} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}