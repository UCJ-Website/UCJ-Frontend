import { notFound } from "next/navigation";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface DepartmentDetail {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  description: string | null;
  logo: string | null;
  banner_image: string | null;
  vision: string | null;
  mission: string | null;
  is_active: number;
}

interface Research {
  id: number;
  title: string;
  type: "project" | "publication";
  authors: string;
  description: string;
  public_link: string | null;
  download_link: string | null;
  year: string;
  month: number;
}

interface StaffMember {
  id: number;
  name: string;
  position: string | null;
  email: string | null;
  phone: string | null;
  photo: string | null;
  department_id: number | null;
  is_active: number;
}

interface CourseSummary {
  id: number;
  department_id: number | null;
  title: string;
  short_code: string;
  slug: string;
  image: string | null;
  level: string;
  duration: string;
  is_active: boolean;
}

const ENG_KEYWORDS = ["building-services", "construction", "mechatronics", "farm-machinery", "production"];
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function getCategory(slug: string): "eng" | "neng" {
  const lower = slug.toLowerCase();
  return ENG_KEYWORDS.some((k) => lower.includes(k)) ? "eng" : "neng";
}

function getIcon(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("building")) return "fa-tools";
  if (lower.includes("construction")) return "fa-hard-hat";
  if (lower.includes("mechatronics")) return "fa-robot";
  if (lower.includes("farm")) return "fa-tractor";
  if (lower.includes("production")) return "fa-industry";
  if (lower.includes("food")) return "fa-flask";
  if (lower.includes("hospitality")) return "fa-concierge-bell";
  if (lower.includes("interdisciplinary")) return "fa-compass";
  return "fa-graduation-cap";
}

function imageUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_BASE}/${path.replace(/^\/+/, "")}`;
}

async function getDepartment(slug: string): Promise<DepartmentDetail | null> {
  try {
    const res = await fetch(`${API_BASE}/api/departments`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    const list: DepartmentDetail[] = json?.departments?.data ?? [];
    return list.find((d) => d.slug === slug) ?? null;
  } catch {
    return null;
  }
}

async function getDepartmentResearch(departmentId: number): Promise<Research[]> {
  try {
    const res = await fetch(`${API_BASE}/api/research`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    const list = json?.researches?.data ?? [];
    return list.filter((r: any) => Number(r.department_id) === departmentId);
  } catch {
    return [];
  }
}

async function getDepartmentStaff(departmentId: number): Promise<StaffMember[]> {
  try {
    const res = await fetch(`${API_BASE}/api/staffs`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    const list = json?.data?.staffs?.data ?? json?.staffs?.data ?? json?.data ?? [];
    return list.filter((s: any) => Number(s.department_id) === departmentId && s.is_active);
  } catch {
    return [];
  }
}

async function getDepartmentCourses(departmentId: number): Promise<CourseSummary[]> {
  try {
    const res = await fetch(`${API_BASE}/api/courses`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    // /api/courses -> { data: { courses: [...] } }
    const list = json?.data?.courses ?? [];
    return list.filter((c: any) => Number(c.department_id) === departmentId && c.is_active);
  } catch {
    return [];
  }
}

export default async function DepartmentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dept = await getDepartment(slug);
  if (!dept) return notFound();

  const [research, staff, courses] = await Promise.all([
    getDepartmentResearch(dept.id),
    getDepartmentStaff(dept.id),
    getDepartmentCourses(dept.id),
  ]);

  const projects = research.filter((r) => r.type === "project");
  const publications = research.filter((r) => r.type === "publication");

  const isEng = getCategory(dept.slug) === "eng";
  const categoryLabel = isEng ? "Engineering" : "Non-Engineering";
  const badgeBg = isEng ? "bg-[#eff6ff] text-[#1d4ed8]" : "bg-[#f0fdf4] text-[#15803d]";
  const iconBg = isEng ? "bg-[#eff6ff] text-[#2563b0]" : "bg-[#f0fdf4] text-[#16a34a]";
  const icon = getIcon(dept.name);
  const bannerUrl = imageUrl(dept.banner_image);

  return (
    <>
      {/* Banner */}
      <div
        className="relative text-center py-16 px-6 overflow-hidden"
        style={{
          background: bannerUrl
            ? `linear-gradient(135deg,rgba(15,42,94,0.85),rgba(37,99,176,0.80)), url(${bannerUrl}) center/cover no-repeat`
            : "linear-gradient(135deg, #0f2a5e 0%, #1a4a8a 60%, #2563b0 100%)",
        }}
      >
        <div className="relative z-10">
          <div className="text-[13px] text-white/65 mb-3">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-1.5">›</span>
            <Link href="/academic" className="hover:text-white transition-colors">Academic</Link>
            <span className="mx-1.5">›</span>
            <span className="text-white">{dept.name}</span>
          </div>
          <div className="w-[60px] h-[60px] rounded-2xl bg-white/10 text-white flex items-center justify-center text-[26px] mx-auto mb-4">
            <i className={`fas ${icon}`}></i>
          </div>
          <span className={`inline-block text-[11px] font-semibold tracking-[0.06em] uppercase px-3 py-1 rounded-full mb-3 ${badgeBg}`}>
            {categoryLabel}
          </span>
          <h1 className="text-white font-bold" style={{ fontSize: "clamp(22px,4vw,36px)" }}>
            {dept.name}
          </h1>
          {dept.short_description && (
            <p className="text-white/70 text-[14px] max-w-[560px] mx-auto mt-3 leading-[1.6]">
              {dept.short_description}
            </p>
          )}
        </div>
      </div>

      <main className="max-w-[1280px] mx-auto px-8 py-16">

        {/* Overview */}
        {dept.description && (
          <div className="bg-white rounded-[14px] border border-[#e5eaf3] p-8 mb-6">
            <div className="text-[12px] font-semibold tracking-[0.1em] uppercase text-[#2563b0] mb-3">Overview</div>
            <p className="text-[#4b5563] text-[15px] leading-7">{dept.description}</p>
          </div>
        )}

        {/* Vision & Mission */}
        {(dept.vision || dept.mission) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
            {dept.vision && (
              <div className="bg-white rounded-[14px] border border-[#e5eaf3] p-6">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-[16px] mb-3 ${iconBg}`}>
                  <i className="fas fa-eye"></i>
                </div>
                <div className="text-[12px] font-semibold tracking-[0.1em] uppercase text-[#2563b0] mb-2">Vision</div>
                <p className="text-[#4b5563] text-[14px] leading-6">{dept.vision}</p>
              </div>
            )}
            {dept.mission && (
              <div className="bg-white rounded-[14px] border border-[#e5eaf3] p-6">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-[16px] mb-3 ${iconBg}`}>
                  <i className="fas fa-bullseye"></i>
                </div>
                <div className="text-[12px] font-semibold tracking-[0.1em] uppercase text-[#2563b0] mb-2">Mission</div>
                <p className="text-[#4b5563] text-[14px] leading-6">{dept.mission}</p>
              </div>
            )}
          </div>
        )}

        {/* Courses offered by this department */}
        {courses.length > 0 && (
          <div className="bg-white rounded-[14px] border border-[#e5eaf3] p-8 mb-6">
            <div className="text-[12px] font-semibold tracking-[0.1em] uppercase text-[#2563b0] mb-5">
              <i className="fas fa-graduation-cap mr-1.5"></i> Courses Offered
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {courses.map((course) => {
                const courseImg = imageUrl(course.image);
                return (
                  <Link
                    key={course.id}
                    href={`/courses/${course.slug}`}
                    className="flex flex-col rounded-xl overflow-hidden border border-[#e5eaf3] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className="h-[130px] relative overflow-hidden bg-[#0f2a5e]">
                      {courseImg ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={courseImg} alt={course.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <i className="fas fa-graduation-cap text-3xl text-white/25"></i>
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col gap-1.5">
                      {course.short_code && (
                        <div className="text-[11px] font-bold text-[#2563b0] uppercase tracking-[0.08em]">
                          {course.short_code}
                        </div>
                      )}
                      <div className="text-[13.5px] font-semibold text-[#0f2a5e] leading-[1.45]">
                        {course.title}
                      </div>
                      <div className="text-[12px] text-[#6b7280] flex items-center gap-3 mt-1">
                        {course.level && (
                          <span className="flex items-center gap-1">
                            <i className="fas fa-layer-group text-[10px]"></i> {course.level}
                          </span>
                        )}
                        {course.duration && (
                          <span className="flex items-center gap-1">
                            <i className="fas fa-clock text-[10px]"></i> {course.duration}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Staff */}
        {staff.length > 0 && (
          <div className="bg-white rounded-[14px] border border-[#e5eaf3] p-8 mb-6">
            <div className="text-[12px] font-semibold tracking-[0.1em] uppercase text-[#2563b0] mb-5">
              <i className="fas fa-users mr-1.5"></i> Department Staff
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {staff.map((member) => {
                const photo = imageUrl(member.photo);
                return (
                  <div key={member.id} className="flex items-center gap-4 p-4 rounded-xl border border-[#e5eaf3]">
                    <div className="w-[56px] h-[56px] rounded-full overflow-hidden bg-[#eff6ff] text-[#2563b0] flex items-center justify-center text-[18px] font-semibold shrink-0">
                      {photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={photo} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        member.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-[#0f2a5e] text-[14px]">{member.name}</div>
                      {member.position && (
                        <div className="text-[12px] text-[#2563b0] mb-1">{member.position}</div>
                      )}
                      {member.phone && (
                        <div className="text-[12px] text-[#6b7280] flex items-center gap-1.5">
                          <i className="fas fa-phone text-[10px]"></i> {member.phone}
                        </div>
                      )}
                      {member.email && (
                        <div className="text-[12px] text-[#6b7280] flex items-center gap-1.5">
                          <i className="fas fa-envelope text-[10px]"></i> {member.email}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Innovation Projects */}
        {projects.length > 0 && (
          <div className="bg-white rounded-[14px] border border-[#e5eaf3] p-8 mb-6">
            <div className="text-[12px] font-semibold tracking-[0.1em] uppercase text-[#2563b0] mb-5">
              <i className="fas fa-lightbulb mr-1.5"></i> Innovation Projects
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map((item) => (
                <div key={item.id} className="border border-[#e5eaf3] rounded-xl p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="font-semibold text-[#0f2a5e] text-[14px] leading-[1.4]">{item.title}</div>
                    <span className="text-[11px] font-medium text-[#6b7280] whitespace-nowrap shrink-0">
                      {MONTH_NAMES[(item.month ?? 1) - 1]} {item.year}
                    </span>
                  </div>
                  {item.authors && (
                    <div className="text-[12px] text-[#2563b0] mb-2 flex items-center gap-1.5">
                      <i className="fas fa-users text-[10px]"></i> {item.authors}
                    </div>
                  )}
                  <p className="text-[13px] text-[#6b7280] leading-[1.55]">{item.description}</p>
                  {(item.public_link || item.download_link) && (
                    <div className="flex gap-3 mt-3">
                      {item.public_link && (
                        <a href={item.public_link} target="_blank" rel="noopener noreferrer"
                          className="text-[12px] font-medium text-[#2563b0] flex items-center gap-1.5 hover:underline">
                          <i className="fas fa-external-link-alt text-[10px]"></i> View
                        </a>
                      )}
                      {item.download_link && (
                        <a href={item.download_link} target="_blank" rel="noopener noreferrer"
                          className="text-[12px] font-medium text-[#2563b0] flex items-center gap-1.5 hover:underline">
                          <i className="fas fa-download text-[10px]"></i> Download
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Publications */}
        {publications.length > 0 && (
          <div className="bg-white rounded-[14px] border border-[#e5eaf3] p-8 mb-6">
            <div className="text-[12px] font-semibold tracking-[0.1em] uppercase text-[#2563b0] mb-5">
              <i className="fas fa-book mr-1.5"></i> Publications
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {publications.map((item) => (
                <div key={item.id} className="border border-[#e5eaf3] rounded-xl p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="font-semibold text-[#0f2a5e] text-[14px] leading-[1.4]">{item.title}</div>
                    <span className="text-[11px] font-medium text-[#6b7280] whitespace-nowrap shrink-0">
                      {MONTH_NAMES[(item.month ?? 1) - 1]} {item.year}
                    </span>
                  </div>
                  {item.authors && (
                    <div className="text-[12px] text-[#2563b0] mb-2 flex items-center gap-1.5">
                      <i className="fas fa-user-edit text-[10px]"></i> {item.authors}
                    </div>
                  )}
                  <p className="text-[13px] text-[#6b7280] leading-[1.55]">{item.description}</p>
                  {(item.public_link || item.download_link) && (
                    <div className="flex gap-3 mt-3">
                      {item.public_link && (
                        <a href={item.public_link} target="_blank" rel="noopener noreferrer"
                          className="text-[12px] font-medium text-[#2563b0] flex items-center gap-1.5 hover:underline">
                          <i className="fas fa-external-link-alt text-[10px]"></i> View
                        </a>
                      )}
                      {item.download_link && (
                        <a href={item.download_link} target="_blank" rel="noopener noreferrer"
                          className="text-[12px] font-medium text-[#2563b0] flex items-center gap-1.5 hover:underline">
                          <i className="fas fa-download text-[10px]"></i> Download
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <Link
          href="/academic"
          className="text-[#2563b0] font-medium text-[14px] flex items-center gap-2 hover:gap-3 transition-all"
        >
          <i className="fas fa-arrow-left text-[12px]"></i> Back to Academic
        </Link>
      </main>
    </>
  );
}