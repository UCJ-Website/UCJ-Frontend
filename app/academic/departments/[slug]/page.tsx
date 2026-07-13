// app/academic/departments/[slug]/page.tsx

import { notFound } from "next/navigation";
import Link from "next/link";
import DepartmentTabs from "../DepartmentTabs";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

interface Research {
  id: number;
  title: string;
  type?: "project" | "publication";
  authors?: string | null;
  description?: string | null;
  public_link?: string | null;
  download_link?: string | null;
  year?: string | number | null;
  month?: number | null;
}

interface StaffMember {
  id: number;
  slug?: string;
  name: string;
  position?: string | null;
  category?: string | null;
  subcategory?: string | null;
  email?: string | null;
  phone?: string | null;
  photo?: string | null;
}

interface CourseSummary {
  id: number;
  title: string;
  short_code?: string;
  slug: string;
  image?: string | null;
  level?: string;
  duration?: string;
  description?: string | null;
  department_id?: number | string | null;
}

interface GalleryItem {
  id: number;
  title: string | null;
  description: string | null;
  category: string | null;
  month: string | null;
  year: number | null;
  cover_image: string;
}

interface DepartmentCourseReference {
  id: number;
  name?: string | null;
  sort_order?: number | null;
}

interface DepartmentDetail {
  id: number;
  name: string;
  slug: string;
  short_code: string;
  short_description: string;
  description: string | null;
  logo: string | null;
  banner_image: string | null;
  vision: string | null;
  mission: string | null;
  is_engineering: boolean;
  staff: StaffMember[];
  courses: DepartmentCourseReference[];
  researches: Research[];
  gallery: GalleryItem[];
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
  if (lower.includes("cosmetology")) return "fa-spa";

  return "fa-graduation-cap";
}

function normalize(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function isFormerDirectorRecord(member: StaffMember): boolean {
  const position = normalize(member.position);
  const subcategory = normalize(member.subcategory);

  return (
    position.startsWith("former director") ||
    position.startsWith("former acting director") ||
    subcategory.startsWith("former director") ||
    subcategory.startsWith("former acting director")
  );
}

function isFormerAcademicStaff(member: StaffMember): boolean {
  return normalize(member.subcategory).includes("former academic staff");
}

function isHeadOfDepartment(member: StaffMember): boolean {
  const position = normalize(member.position);
  const subcategory = normalize(member.subcategory);

  return (
    position.includes("head of department") ||
    subcategory.includes("head of department")
  );
}

function sortDepartmentStaff(staff: StaffMember[]): StaffMember[] {
  return [...staff]
    .filter(
      (member) =>
        !isFormerDirectorRecord(member) &&
        !isFormerAcademicStaff(member),
    )
    .sort((a, b) => {
      const aHead = isHeadOfDepartment(a) ? 0 : 1;
      const bHead = isHeadOfDepartment(b) ? 0 : 1;

      if (aHead !== bHead) return aHead - bHead;

      const aAcademic =
        normalize(a.category) === "academics" ? 0 : 1;
      const bAcademic =
        normalize(b.category) === "academics" ? 0 : 1;

      if (aAcademic !== bAcademic) {
        return aAcademic - bAcademic;
      }

      return a.name.localeCompare(b.name);
    });
}

export function imageUrl(path: string | null): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;

  return `${API_BASE}/${path.replace(/^\/+/, "")}`;
}

async function getDepartment(
  slug: string,
): Promise<DepartmentDetail | null> {
  try {
    const res = await fetch(
      `${API_BASE}/api/departments/${slug}`,
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!res.ok) return null;

    const json = await res.json();

    return json?.data?.department ?? null;
  } catch {
    return null;
  }
}

async function getAllStaff(): Promise<StaffMember[]> {
  try {
    const allStaff: StaffMember[] = [];
    let page = 1;
    let lastPage = 1;

    do {
      const res = await fetch(`${API_BASE}/api/staffs?page=${page}`, {
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });

      if (!res.ok) return [];

      const json = await res.json();

      const pageStaff =
        json?.data?.staffs?.data ??
        json?.data?.staffs ??
        json?.staffs?.data ??
        json?.staffs ??
        json?.data ??
        [];

      if (Array.isArray(pageStaff)) {
        allStaff.push(...pageStaff);
      }

      lastPage =
        Number(json?.data?.staffs?.last_page) ||
        Number(json?.staffs?.last_page) ||
        Number(json?.data?.last_page) ||
        1;

      page += 1;
    } while (page <= lastPage);

    return Array.from(
      new Map(
        allStaff.map((member) => [String(member.id), member]),
      ).values(),
    );
  } catch {
    return [];
  }
}

async function getDepartmentResearch(
  departmentId: number,
): Promise<Research[]> {
  try {
    const res = await fetch(
      `${API_BASE}/api/research?department_id=${departmentId}`,
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!res.ok) return [];

    const json = await res.json();

    const rawResearch =
      json?.data?.researches?.data ??
      json?.data?.researches ??
      json?.researches?.data ??
      json?.researches ??
      json?.data ??
      [];

    return Array.isArray(rawResearch) ? rawResearch : [];
  } catch {
    return [];
  }
}

async function getAllCourses(): Promise<CourseSummary[]> {
  try {
    const allCourses: CourseSummary[] = [];
    let page = 1;
    let lastPage = 1;

    do {
      const res = await fetch(`${API_BASE}/api/courses?page=${page}`, {
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });

      if (!res.ok) return [];

      const json = await res.json();

      const pageCourses =
        json?.data?.courses?.data ??
        json?.data?.courses ??
        json?.courses?.data ??
        json?.courses ??
        json?.data ??
        [];

      if (Array.isArray(pageCourses)) {
        allCourses.push(...pageCourses);
      }

      lastPage =
        Number(json?.data?.courses?.last_page) ||
        Number(json?.courses?.last_page) ||
        Number(json?.data?.last_page) ||
        1;

      page += 1;
    } while (page <= lastPage);

    return Array.from(
      new Map(
        allCourses.map((course) => [String(course.id), course]),
      ).values(),
    );
  } catch {
    return [];
  }
}

function courseBelongsToDepartment(
  course: CourseSummary,
  departmentId: number,
  departmentShortCode: string,
): boolean {
  if (Number(course.department_id) === Number(departmentId)) {
    return true;
  }

  const code = normalize(course.short_code).replace(/[^a-z0-9]/g, "");
  const title = normalize(course.title);
  const deptCode = normalize(departmentShortCode);

  const rules: Record<string, () => boolean> = {
    bst: () =>
      code.includes("bst") ||
      title.includes("building services technology"),

    ct: () =>
      code.includes("ctt") ||
      title.includes("construction technology"),

    mt: () =>
      code.includes("mnt") ||
      title.includes("mechatronics technology"),

    fm: () =>
      code.includes("fmt") ||
      title.includes("farm machinery technology"),

    pt: () =>
      code.includes("pdt") ||
      title.includes("production technology"),

    ft: () =>
      code.includes("fot") ||
      title.includes("food technology"),

    hm: () =>
      code.includes("hpm") ||
      title.includes("hospitality management"),

    cos: () =>
      code.includes("cmt") ||
      title.includes("cosmetology"),

    ict: () =>
      code === "ict" ||
      code === "eng" ||
      code.includes("hndict") ||
      title.includes("information communication technology") ||
      title.includes("information and communication technology") ||
      title.includes("english language"),
  };

  return rules[deptCode]?.() ?? false;
}

function getCoursesForDepartment(
  allCourses: CourseSummary[],
  departmentCourseRefs: DepartmentCourseReference[],
  departmentId: number,
  departmentShortCode: string,
): CourseSummary[] {
  const courseIds = new Set(
    (departmentCourseRefs ?? []).map((course) => Number(course.id)),
  );

  return allCourses
    .filter(
      (course) =>
        courseIds.has(Number(course.id)) ||
        courseBelongsToDepartment(
          course,
          departmentId,
          departmentShortCode,
        ),
    )
    .sort((a, b) => {
      const aRef = departmentCourseRefs.find(
        (item) => Number(item.id) === Number(a.id),
      );
      const bRef = departmentCourseRefs.find(
        (item) => Number(item.id) === Number(b.id),
      );

      const aOrder =
        aRef?.sort_order != null
          ? Number(aRef.sort_order)
          : Number((a as CourseSummary & { sort_order?: number }).sort_order ?? 999);

      const bOrder =
        bRef?.sort_order != null
          ? Number(bRef.sort_order)
          : Number((b as CourseSummary & { sort_order?: number }).sort_order ?? 999);

      return aOrder - bOrder || a.title.localeCompare(b.title);
    });
}

export default async function DepartmentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dept = await getDepartment(slug);

  if (!dept) return notFound();

  const [apiResearch, allCourses, allStaff] = await Promise.all([
    getDepartmentResearch(dept.id),
    getAllCourses(),
    getAllStaff(),
  ]);

  const research =
    apiResearch.length > 0
      ? apiResearch
      : Array.isArray(dept.researches)
        ? dept.researches
        : [];

  const courses = getCoursesForDepartment(
    allCourses,
    Array.isArray(dept.courses) ? dept.courses : [],
    dept.id,
    dept.short_code,
  );

  const detailedStaffById = new Map(
    allStaff.map((member) => [String(member.id), member]),
  );

  const enrichedDepartmentStaff = (
    Array.isArray(dept.staff) ? dept.staff : []
  ).map((member) => ({
    ...member,
    ...(detailedStaffById.get(String(member.id)) ?? {}),
  }));

  const sortedStaff = sortDepartmentStaff(enrichedDepartmentStaff);

  const isEng = dept.is_engineering;
  const categoryLabel = isEng
    ? "Engineering"
    : "Non-Engineering";

  const badgeBg = isEng
    ? "bg-[#eff6ff] text-[#1d4ed8]"
    : "bg-[#f0fdf4] text-[#15803d]";

  const icon = getIcon(dept.name);
  const bannerUrl = imageUrl(dept.banner_image);

  return (
    <>
      {/* ===== BANNER ===== */}
      <div
        className="relative overflow-hidden px-6 py-16 text-center"
        style={{
          background: bannerUrl
            ? `linear-gradient(135deg,rgba(15,42,94,0.85),rgba(37,99,176,0.80)), url(${bannerUrl}) center/cover no-repeat`
            : "linear-gradient(135deg, #0f2a5e 0%, #1a4a8a 60%, #2563b0 100%)",
        }}
      >
        <div className="relative z-10">
          <div className="mb-3 text-[13px] text-white/65">
            <Link
              href="/"
              className="transition-colors hover:text-white"
            >
              Home
            </Link>

            <span className="mx-1.5">›</span>

            <Link
              href="/academic"
              className="transition-colors hover:text-white"
            >
              Academic
            </Link>

            <span className="mx-1.5">›</span>

            <span className="text-white">{dept.name}</span>
          </div>

          <div className="mx-auto mb-4 flex h-[60px] w-[60px] items-center justify-center rounded-2xl bg-white/10 text-[26px] text-white">
            <i className={`fas ${icon}`} />
          </div>

          <span
            className={`mb-3 inline-block rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] ${badgeBg}`}
          >
            {categoryLabel}
          </span>

          <h1
            className="font-bold text-white"
            style={{
              fontSize: "clamp(22px,4vw,36px)",
            }}
          >
            {dept.name}
          </h1>

          {dept.short_description && (
            <p className="mx-auto mt-3 max-w-[560px] text-[14px] leading-[1.6] text-white/70">
              {dept.short_description}
            </p>
          )}
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <main className="w-full px-4 py-10 sm:px-6 lg:px-8">
        {dept.description && (
          <div className="mb-6 rounded-[14px] border border-[#e5eaf3] bg-white p-8">
            <div className="mb-3 text-[12px] font-semibold uppercase tracking-[0.1em] text-[#2563b0]">
              Description
            </div>

            <p className="text-[15px] leading-7 text-[#4b5563]">
              {dept.description}
            </p>
          </div>
        )}

        <DepartmentTabs
          staff={sortedStaff}
          courses={courses}
          gallery={
            Array.isArray(dept.gallery)
              ? dept.gallery
              : []
          }
          research={research}
          apiBase={API_BASE}
        />

        <div className="mt-8">
          <Link
            href="/academic"
            className="flex items-center gap-2 text-[14px] font-medium text-[#2563b0] transition-all hover:gap-3"
          >
            <i className="fas fa-arrow-left text-[12px]" />
            Back to Academic
          </Link>
        </div>
      </main>
    </>
  );
}