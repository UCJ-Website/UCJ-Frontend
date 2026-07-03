// app/academic/departments/[slug]/page.tsx

import { notFound } from "next/navigation";
import Link from "next/link";
import DepartmentTabs from "../DepartmentTabs";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

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
  name: string;
  position?: string | null;
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
  department_id?: number | null;
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
  courses: CourseSummary[];
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

function sortStaffFormerLast(staff: StaffMember[]): StaffMember[] {
  return [...staff].sort((a, b) => {
    const aFormer = a.subcategory?.toLowerCase().includes("former") ? 1 : 0;
    const bFormer = b.subcategory?.toLowerCase().includes("former") ? 1 : 0;
    return aFormer - bFormer;
  });
}

export function imageUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_BASE}/${path.replace(/^\/+/, "")}`;
}

async function getDepartment(slug: string): Promise<DepartmentDetail | null> {
  try {
    const res = await fetch(`${API_BASE}/api/departments/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.department ?? null;
  } catch {
    return null;
  }
}

async function getDepartmentResearch(departmentId: number): Promise<Research[]> {
  try {
    const res = await fetch(
      `${API_BASE}/api/research?department_id=${departmentId}`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json?.researches?.data ?? json?.data ?? [];
  } catch {
    return [];
  }
}

async function getDepartmentCourses(departmentId: number): Promise<CourseSummary[]> {
  try {
    const res = await fetch(
      `${API_BASE}/api/courses?department_id=${departmentId}`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const json = await res.json();
    const all: CourseSummary[] = json?.data?.courses ?? [];
    // backend filter வேலை செய்யலன்னா frontend-ல filter பண்றோம்
    return all.filter((c) => c.department_id === departmentId);
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

  const [research, courses] = await Promise.all([
    getDepartmentResearch(dept.id),
    getDepartmentCourses(dept.id),
  ]);

  const isEng = dept.is_engineering;
  const categoryLabel = isEng ? "Engineering" : "Non-Engineering";
  const badgeBg = isEng
    ? "bg-[#eff6ff] text-[#1d4ed8]"
    : "bg-[#f0fdf4] text-[#15803d]";
  const icon = getIcon(dept.name);
  const bannerUrl = imageUrl(dept.banner_image);
  const sortedStaff = sortStaffFormerLast(dept.staff ?? []);

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
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="mx-1.5">›</span>
            <Link href="/academic" className="hover:text-white transition-colors">
              Academic
            </Link>
            <span className="mx-1.5">›</span>
            <span className="text-white">{dept.name}</span>
          </div>
          <div className="w-[60px] h-[60px] rounded-2xl bg-white/10 text-white flex items-center justify-center text-[26px] mx-auto mb-4">
            <i className={`fas ${icon}`}></i>
          </div>
          <span
            className={`inline-block text-[11px] font-semibold tracking-[0.06em] uppercase px-3 py-1 rounded-full mb-3 ${badgeBg}`}
          >
            {categoryLabel}
          </span>
          <h1
            className="text-white font-bold"
            style={{ fontSize: "clamp(22px,4vw,36px)" }}
          >
            {dept.name}
          </h1>
          {dept.short_description && (
            <p className="text-white/70 text-[14px] max-w-[560px] mx-auto mt-3 leading-[1.6]">
              {dept.short_description}
            </p>
          )}
        </div>
      </div>

      <main className="w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Description */}
        {dept.description && (
          <div className="bg-white rounded-[14px] border border-[#e5eaf3] p-8 mb-6">
            <div className="text-[12px] font-semibold tracking-[0.1em] uppercase text-[#2563b0] mb-3">
              Description
            </div>
            <p className="text-[#4b5563] text-[15px] leading-7">
              {dept.description}
            </p>
          </div>
        )}

        {/* Tabs Section */}
        <DepartmentTabs
          staff={sortedStaff}
          courses={courses}
          gallery={dept.gallery ?? []}
          research={research}
          apiBase={API_BASE}
        />

        <div className="mt-8">
          <Link
            href="/academic"
            className="text-[#2563b0] font-medium text-[14px] flex items-center gap-2 hover:gap-3 transition-all"
          >
            <i className="fas fa-arrow-left text-[12px]"></i> Back to Academic
          </Link>
        </div>
      </main>
    </>
  );
}