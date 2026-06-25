import Link from "next/link";

// .env.local may or may not already include "/api" — normalize it here.
const RAW_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";
const ORIGIN = RAW_BASE.replace(/\/api\/?$/, "");
const API_BASE = `${ORIGIN}/api`;

const PER_PAGE = 6;

function resolveImage(path: string | null | undefined): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${ORIGIN}/${path.replace(/^\/+/, "")}`;
}

// Backend booleans sometimes come over the wire as "0"/"1" strings instead of
// real booleans. `!!"0"` is true in JS (non-empty string), which silently
// breaks any truthy check on flags like is_main / is_active. Normalize first.
function toBool(value: unknown): boolean {
  if (typeof value === "string") {
    return value === "1" || value.toLowerCase() === "true";
  }
  return Boolean(value);
}

interface Course {
  img: string;
  tag: string;
  tagLabel: string;
  name: string;
  href: string;
}

// Converts a raw backend course record into the shape this page expects
function mapCourseItem(item: any): Course {
  return {
    img: resolveImage(item.image),
    tag: "fa-graduation-cap",
    tagLabel: item.short_code ?? item.level ?? "",
    name: item.title,
    href: `/courses/${item.slug}`,
  };
}

async function getCourses(): Promise<Course[]> {
  try {
    const res = await fetch(`${API_BASE}/courses`, { cache: "no-store" });
    if (!res.ok) return [];
    const payload = await res.json();
    // /api/courses -> { data: { courses: [...] } }  (NOT paginated, plain array)
    const items = payload?.data?.courses ?? [];
    // This page only shows main HND programmes; foundation/general ones live on /courses/general
    const mainOnly = items.filter((item: any) => {
      const isMain = toBool(item.is_main);
      const isActive = item.is_active === undefined ? true : toBool(item.is_active);
      return isMain && isActive;
    });
    return mainOnly.map(mapCourseItem);
  } catch {
    return [];
  }
}

function buildPageHref(page: number): string {
  return page <= 1 ? "/courses" : `/courses?page=${page}`;
}

function Pagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  if (totalPages <= 1) return null;

  // Compact page-number window: current ± 1, plus first/last with ellipses
  const pages = new Set<number>([1, totalPages, currentPage]);
  if (currentPage - 1 > 1) pages.add(currentPage - 1);
  if (currentPage + 1 < totalPages) pages.add(currentPage + 1);
  const sorted = Array.from(pages).sort((a, b) => a - b);

  const items: (number | "ellipsis")[] = [];
  sorted.forEach((p, idx) => {
    if (idx > 0 && p - sorted[idx - 1] > 1) items.push("ellipsis");
    items.push(p);
  });

  return (
    <nav className="flex items-center justify-center gap-2 mt-12" aria-label="Courses pagination">
      {/* Prev */}
      {currentPage > 1 ? (
        <Link
          href={buildPageHref(currentPage - 1)}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-[#0b1730] hover:bg-[#e85d14] hover:text-white hover:border-[#e85d14] transition-colors"
          aria-label="Previous page"
        >
          <i className="fas fa-chevron-left text-[12px]"></i>
        </Link>
      ) : (
        <span className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-100 text-gray-300">
          <i className="fas fa-chevron-left text-[12px]"></i>
        </span>
      )}

      {/* Page numbers */}
      {items.map((item, idx) =>
        item === "ellipsis" ? (
          <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-[13px] text-gray-400">
            …
          </span>
        ) : (
          <Link
            key={item}
            href={buildPageHref(item)}
            className={`w-9 h-9 flex items-center justify-center rounded-full text-[13px] font-semibold transition-colors ${
              item === currentPage
                ? "bg-[#e85d14] text-white"
                : "border border-gray-200 text-[#0b1730] hover:bg-[#f0f2f7]"
            }`}
            aria-current={item === currentPage ? "page" : undefined}
          >
            {item}
          </Link>
        )
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={buildPageHref(currentPage + 1)}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-[#0b1730] hover:bg-[#e85d14] hover:text-white hover:border-[#e85d14] transition-colors"
          aria-label="Next page"
        >
          <i className="fas fa-chevron-right text-[12px]"></i>
        </Link>
      ) : (
        <span className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-100 text-gray-300">
          <i className="fas fa-chevron-right text-[12px]"></i>
        </span>
      )}
    </nav>
  );
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const allCourses = await getCourses();

  const resolvedParams = await searchParams;
  const totalPages = Math.max(1, Math.ceil(allCourses.length / PER_PAGE));
  const requestedPage = parseInt(resolvedParams?.page ?? "1", 10);
  const currentPage = Number.isFinite(requestedPage)
    ? Math.min(Math.max(requestedPage, 1), totalPages)
    : 1;

  const startIdx = (currentPage - 1) * PER_PAGE;
  const courses = allCourses.slice(startIdx, startIdx + PER_PAGE);

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-[#f0f2f7] border-b border-gray-200 py-3 px-6">
        <div className="max-w-[1280px] mx-auto text-[13px] text-[#607080]">
          <Link href="/" className="hover:text-[#e85d14] transition-colors">Home</Link>
          {" / "}
          <span className="text-[#0b1730] font-medium">Courses</span>
        </div>
      </div>

      {/* Hero */}
      <section
        className="py-16 px-6"
        style={{ background: "linear-gradient(135deg, #0b1730 0%, #152244 60%, #1e3060 100%)" }}
      >
        <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="text-white max-w-[560px]">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-[12px] font-semibold px-4 py-1.5 rounded-full mb-5">
              <i className="fas fa-graduation-cap text-[#e85d14]"></i> NVQ Level 5 &amp; 6
            </div>
            <h1 className="font-extrabold text-white leading-tight mb-4" style={{ fontSize: "clamp(32px,4.5vw,50px)" }}>
              Our <em className="not-italic text-[#e85d14]">Courses</em>
            </h1>
            <p className="text-white/65 text-[15px] leading-[1.75]">
              Nationally recognised diplomas designed to empower you with knowledge and skills for a successful future. All programmes are fully funded.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 shrink-0">
            {[
              { num: "7+", lbl: "HND Programmes" },
              { num: "2", lbl: "Foundation Courses" },
              { num: "100%", lbl: "Free / Funded" },
              { num: "NVQ", lbl: "Level 5 & 6" },
            ].map((s) => (
              <div key={s.lbl} className="bg-white/10 border border-white/15 rounded-xl px-6 py-4 text-center backdrop-blur-sm">
                <div className="text-[28px] font-extrabold text-[#e85d14]">{s.num}</div>
                <div className="text-white/70 text-[12px] mt-1">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HND Courses */}
      <section className="py-16 px-6 bg-[#f8f9fc]">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#e85d14] mb-2">Higher National Diplomas</div>
          <h2 className="font-extrabold text-[#0b1730] mb-2" style={{ fontSize: "clamp(24px,3vw,34px)" }}>
            All <em className="not-italic text-[#e85d14]">Courses</em>
          </h2>
          <div className="w-12 h-1 bg-[#e85d14] rounded mb-10" />

          {allCourses.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-16">No courses available.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {courses.map((course) => (
                  <Link
                    key={course.href}
                    href={course.href}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col"
                  >
                    <div className="h-[180px] overflow-hidden relative bg-[#0b1730] flex items-center justify-center">
                      {course.img ? (
                        <img
                          src={course.img}
                          alt={course.name}
                          className="w-full h-full object-cover opacity-90"
                        />
                      ) : (
                        <i className="fas fa-graduation-cap text-white/25 text-[44px]"></i>
                      )}
                    </div>
                    <div className="p-5 flex flex-col gap-3 flex-1">
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#e85d14] uppercase tracking-[0.06em]">
                        <i className={`fas ${course.tag} text-[10px]`}></i> {course.tagLabel}
                      </div>
                      <div className="text-[13.5px] font-semibold text-[#0b1730] leading-[1.5] flex-1">
                        {course.name}
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                        <span className="text-[12px] text-[#e85d14] font-semibold">Learn More</span>
                        <div className="w-8 h-8 rounded-full bg-[#e85d14] flex items-center justify-center">
                          <i className="fas fa-arrow-right text-white text-[11px]"></i>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination — only renders when there are more than PER_PAGE courses */}
              <Pagination currentPage={currentPage} totalPages={totalPages} />
            </>
          )}
        </div>
      </section>
    </>
  );
}