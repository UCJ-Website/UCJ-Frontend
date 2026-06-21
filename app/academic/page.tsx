import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface Department {
  id: number;
  slug: string;
  name: string;
  short_description: string;
  description: string | null;
  logo: string | null;
  is_active: number;
}

const STATIC_UNITS = [
  {
    slug: "career-guidance",
    icon: "fa-compass",
    title: "Career Guidance Unit",
    desc: "Helps students with career planning, job placement support, and industry connections.",
    href: "/academic/units/career-guidance",
  },
  {
    slug: "staff-development",
    icon: "fa-users",
    title: "Staff Development Unit",
    desc: "Coordinates professional development, training programs, and workshops for academic staff.",
    href: "/academic/units/staff-development",
  },
];

const ENG_KEYWORDS = ["building services", "construction", "mechatronics", "farm machinery", "production"];

function getCategory(name: string): "eng" | "neng" {
  const lower = name.toLowerCase();
  return ENG_KEYWORDS.some((k) => lower.includes(k)) ? "eng" : "neng";
}

// Icon map by slug keyword
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

async function getDepartments(): Promise<Department[]> {
  try {
    const res = await fetch(`${API_BASE}/api/departments`, { cache: "no-store" });

    if (!res.ok) {
      console.error(
        `[getDepartments] API ${API_BASE}/api/departments returned ${res.status} ${res.statusText}`
      );
      return [];
    }

    const data = await res.json();
    const list = data.departments?.data ?? [];

    console.log(`[getDepartments] fetched ${list.length} departments from ${API_BASE}`);

    return list;
  } catch (err) {
    console.error(`[getDepartments] fetch to ${API_BASE}/api/departments failed:`, err);
    return [];
  }
}

function EmptyState({
  icon = "fa-circle-info",
  title = "No data found",
  desc = "Please check back later.",
}: {
  icon?: string;
  title?: string;
  desc?: string;
}) {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center py-14 px-6 bg-white rounded-[14px] border border-dashed border-[#e5eaf3]">
      <div className="w-[54px] h-[54px] rounded-full bg-[#eff6ff] text-[#2563b0] flex items-center justify-center text-[22px] mb-4">
        <i className={`fas ${icon}`}></i>
      </div>
      <div className="font-semibold text-[#0f2a5e] text-[15px] mb-1.5">{title}</div>
      <div className="text-[13px] text-[#6b7280] leading-[1.55] max-w-[360px]">{desc}</div>
    </div>
  );
}

export default async function AcademicPage() {
  const departments = await getDepartments();

  // Number(...) handles is_active coming back as 1, "1", or true from the API
  const active = departments.filter((d) => Number(d.is_active) === 1);
  const engDepts = active.filter((d) => getCategory(d.name) === "eng");
  const nengDepts = active.filter((d) => getCategory(d.name) === "neng");

  return (
    <>
      {/* Banner */}
      <div
        className="relative text-center py-20 px-6 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f2a5e 0%, #1a4a8a 60%, #2563b0 100%)" }}
      >
        <div className="relative z-10">
          <div className="text-[13px] text-white/65 mb-3">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-1.5">›</span>
            <span className="text-white">Academic</span>
          </div>
          <h1 className="text-white font-bold mb-3" style={{ fontSize: "clamp(28px,5vw,44px)" }}>
            Academic <span className="text-[#60a5fa]">Programs</span>
          </h1>
          <p className="text-white/75 text-[15px] max-w-[560px] mx-auto leading-[1.6]">
            Explore our departments, courses, and academic units at University College of Jaffna.
          </p>
        </div>
      </div>

      <main className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="text-[12px] font-semibold tracking-[0.1em] uppercase text-[#2563b0] mb-2">Faculties</div>
        <h2 className="font-bold text-[#0f2a5e] mb-8" style={{ fontSize: "clamp(22px,3vw,30px)" }}>
          Our <span className="text-[#2563b0]">Departments</span>
        </h2>

        {active.length === 0 ? (
          <EmptyState
            icon="fa-building-circle-exclamation"
            title="No departments found"
            desc="We couldn't load department information right now. Please refresh the page or check back later."
          />
        ) : (
          <>
            {/* Engineering */}
            <div className="flex items-center gap-3.5 my-8">
              <span className="bg-[#eff6ff] text-[#1d4ed8] text-[13px] font-semibold tracking-[0.06em] uppercase px-3.5 py-1 rounded-full whitespace-nowrap">
                <i className="fas fa-cogs mr-1"></i> Engineering
              </span>
              <div className="flex-1 h-px bg-[#e5eaf3]" />
            </div>
            {engDepts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
                {engDepts.map((dept) => (
                  <Link
                    key={dept.id}
                    href={`/academic/departments/${dept.slug}`}
                    className="bg-white rounded-[14px] border border-[#e5eaf3] p-6 flex flex-col gap-2.5 hover:shadow-[0_8px_28px_rgba(37,99,176,0.13)] hover:-translate-y-0.5 transition-all duration-200 no-underline text-inherit"
                  >
                    <div className="w-[46px] h-[46px] rounded-xl bg-[#eff6ff] text-[#2563b0] flex items-center justify-center text-[20px]">
                      <i className={`fas ${getIcon(dept.name)}`}></i>
                    </div>
                    <span className="inline-block bg-[#eff6ff] text-[#1d4ed8] text-[10px] font-semibold tracking-[0.06em] uppercase px-2.5 py-0.5 rounded-full w-fit">
                      Engineering
                    </span>
                    <div className="font-semibold text-[#0f2a5e] text-[15px] leading-[1.4]">{dept.name}</div>
                    <div className="text-[13px] text-[#6b7280] leading-[1.55] flex-1">{dept.short_description}</div>
                    <div className="text-[13px] font-medium text-[#2563b0] flex items-center gap-1.5 mt-1">
                      View Department <i className="fas fa-arrow-right text-[11px]"></i>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mb-10">
                <EmptyState icon="fa-cogs" title="No engineering departments found" desc="There are currently no engineering departments to display." />
              </div>
            )}

            {/* Non-Engineering */}
            <div className="flex items-center gap-3.5 my-8">
              <span className="bg-[#f0fdf4] text-[#15803d] text-[13px] font-semibold tracking-[0.06em] uppercase px-3.5 py-1 rounded-full whitespace-nowrap">
                <i className="fas fa-graduation-cap mr-1"></i> Non-Engineering
              </span>
              <div className="flex-1 h-px bg-[#e5eaf3]" />
            </div>
            {nengDepts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
                {nengDepts.map((dept) => (
                  <Link
                    key={dept.id}
                    href={`/academic/departments/${dept.slug}`}
                    className="bg-white rounded-[14px] border border-[#e5eaf3] p-6 flex flex-col gap-2.5 hover:shadow-[0_8px_28px_rgba(37,99,176,0.13)] hover:-translate-y-0.5 transition-all duration-200 no-underline text-inherit"
                  >
                    <div className="w-[46px] h-[46px] rounded-xl bg-[#f0fdf4] text-[#16a34a] flex items-center justify-center text-[20px]">
                      <i className={`fas ${getIcon(dept.name)}`}></i>
                    </div>
                    <span className="inline-block bg-[#f0fdf4] text-[#15803d] text-[10px] font-semibold tracking-[0.06em] uppercase px-2.5 py-0.5 rounded-full w-fit">
                      Non-Engineering
                    </span>
                    <div className="font-semibold text-[#0f2a5e] text-[15px] leading-[1.4]">{dept.name}</div>
                    <div className="text-[13px] text-[#6b7280] leading-[1.55] flex-1">{dept.short_description}</div>
                    <div className="text-[13px] font-medium text-[#2563b0] flex items-center gap-1.5 mt-1">
                      View Department <i className="fas fa-arrow-right text-[11px]"></i>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mb-10">
                <EmptyState icon="fa-graduation-cap" title="No non-engineering departments found" desc="There are currently no non-engineering departments to display." />
              </div>
            )}
          </>
        )}

        {/* Units — Static */}
        <div className="mt-16">
          <div className="text-[12px] font-semibold tracking-[0.1em] uppercase text-[#2563b0] mb-2">Support</div>
          <h2 className="font-bold text-[#0f2a5e] mb-6" style={{ fontSize: "clamp(22px,3vw,30px)" }}>
            Academic <span className="text-[#2563b0]">Units</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[18px]">
            {STATIC_UNITS.map((unit) => (
              <Link
                key={unit.slug}
                href={unit.href}
                className="bg-white rounded-xl border border-[#e5eaf3] p-5 flex items-start gap-4 hover:shadow-[0_6px_20px_rgba(37,99,176,0.10)] transition-all duration-200 no-underline text-inherit"
              >
                <div className="w-[42px] h-[42px] rounded-[10px] bg-[#f0f4ff] text-[#2563b0] flex items-center justify-center text-[18px] shrink-0">
                  <i className={`fas ${unit.icon}`}></i>
                </div>
                <div>
                  <div className="font-semibold text-[#0f2a5e] text-[14px] mb-1">{unit.title}</div>
                  <div className="text-[12px] text-[#6b7280] leading-[1.5]">{unit.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}