import { notFound } from "next/navigation";
import Link from "next/link";
import GalleryDragScroll from "./GalleryDragScroll";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

interface StaffMember {
  id: number;
  slug?: string;
  name: string;
  position: string | null;
  category: string;
  photo: string | null;
  email: string | null;
  phone?: string | null;
  office?: string | null;
  role_type: string | null;
}

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  description: string;
  cover_image: string;
  year: number;
  month: string;
}

interface Department {
  id: number;
  slug: string;
  name: string;
  short_code: string;
  short_description: string;
  is_unit: boolean;
  is_engineering: boolean;
  logo: string | null;
  banner_image: string | null;
  sort_order: number;
  description: string | null;
  vision: string | null;
  mission: string | null;
  staff: StaffMember[];
  courses: unknown[];
  researches: unknown[];
  gallery: GalleryItem[];
}

function getIcon(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("hrdc")) return "fa-graduation-cap";
  if (lower.includes("career")) return "fa-handshake";
  if (lower.includes("staff")) return "fa-users";
  if (lower.includes("managment") || lower.includes("management")) return "fa-building";
  if (lower.includes("stud")) return "fa-book-open";
  return "fa-layer-group";
}

async function getDepartment(slug: string): Promise<Department | null> {
  try {
    const res = await fetch(`${API_BASE}/api/departments/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.department ?? null;
  } catch {
    return null;
  }
}

// resolves whether an image path is already a full URL or needs the storage prefix
function resolveImageUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_BASE}/storage/${path}`;
}

export default async function UnitDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const unit = await getDepartment(slug);
  if (!unit) return notFound();

  const staff = unit.staff ?? [];
  const gallery = unit.gallery ?? [];

  const icon = getIcon(unit.name);
  const bannerUrl = resolveImageUrl(unit.banner_image);
  const logoUrl = resolveImageUrl(unit.logo);

  return (
    <>
      {/* Banner */}
      <div
        className="relative text-center py-16 px-6 overflow-hidden"
        style={
          bannerUrl
            ? {
                backgroundImage: `linear-gradient(135deg, rgba(15,42,94,0.88) 0%, rgba(26,74,138,0.82) 60%, rgba(37,99,176,0.80) 100%), url(${bannerUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {
                background:
                  "linear-gradient(135deg, #0f2a5e 0%, #1a4a8a 60%, #2563b0 100%)",
              }
        }
      >
        <div className="relative z-10">
          <div className="text-[13px] text-white/65 mb-3">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-1.5">›</span>
            <Link href="/academic" className="hover:text-white transition-colors">Academic</Link>
            <span className="mx-1.5">›</span>
            <span className="text-white">{unit.name}</span>
          </div>

          <div className="w-[60px] h-[60px] rounded-2xl bg-white/10 text-white flex items-center justify-center text-[26px] mx-auto mb-4 overflow-hidden">
            {logoUrl ? (
              <img src={logoUrl} alt={unit.name} className="w-full h-full object-contain p-1" />
            ) : (
              <i className={`fas ${icon}`}></i>
            )}
          </div>

          <span className="inline-block bg-white/15 text-white text-[11px] font-bold px-3 py-1 rounded-full tracking-widest uppercase mb-3">
            {unit.short_code}
          </span>

          <h1 className="text-white font-bold" style={{ fontSize: "clamp(24px,4vw,38px)" }}>
            {unit.name}
          </h1>
          <p className="text-white/70 text-[14px] max-w-[500px] mx-auto mt-3 leading-[1.6]">
            {unit.short_description}
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-[900px] mx-auto px-6 py-16">

        {/* Overview */}
        <div className="bg-white rounded-[14px] border border-[#e5eaf3] p-8 mb-6 shadow-sm">
          <div className="text-[12px] font-semibold tracking-[0.1em] uppercase text-[#2563b0] mb-3">
            Overview
          </div>
          <p className="text-[#4b5563] text-[15px] leading-7">
            {unit.description || unit.short_description}
          </p>
          <div className="mt-6 flex items-center gap-2">
            <span className="text-[12px] font-semibold text-[#6b7280] uppercase tracking-wide">
              Short Code:
            </span>
            <span className="bg-[#eff6ff] text-[#2563b0] text-[12px] font-bold px-3 py-1 rounded-full">
              {unit.short_code}
            </span>
          </div>
        </div>

        {/* Vision / Mission (only if present) */}
        {(unit.vision || unit.mission) && (
          <div className="bg-white rounded-[14px] border border-[#e5eaf3] p-8 mb-6 shadow-sm grid sm:grid-cols-2 gap-6">
            {unit.vision && (
              <div>
                <div className="text-[12px] font-semibold tracking-[0.1em] uppercase text-[#2563b0] mb-2">
                  Vision
                </div>
                <p className="text-[#4b5563] text-[14px] leading-6">{unit.vision}</p>
              </div>
            )}
            {unit.mission && (
              <div>
                <div className="text-[12px] font-semibold tracking-[0.1em] uppercase text-[#2563b0] mb-2">
                  Mission
                </div>
                <p className="text-[#4b5563] text-[14px] leading-6">{unit.mission}</p>
              </div>
            )}
          </div>
        )}

        {/* Gallery - drag-to-scroll carousel */}
        {gallery.length > 0 && (
          <div className="bg-white rounded-[14px] border border-[#e5eaf3] p-8 mb-6 shadow-sm">
            <div className="text-[12px] font-semibold tracking-[0.1em] uppercase text-[#2563b0] mb-5">
              <i className="fas fa-images mr-1.5"></i> Gallery
            </div>
            <GalleryDragScroll items={gallery} apiBase={API_BASE} />
          </div>
        )}

        {/* Staff */}
        {staff.length > 0 && (
          <div className="bg-white rounded-[14px] border border-[#e5eaf3] p-8 mb-6 shadow-sm">
            <div className="text-[12px] font-semibold tracking-[0.1em] uppercase text-[#2563b0] mb-5">
              <i className="fas fa-users mr-1.5"></i> Staff Members
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {staff.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-4 p-4 rounded-xl border border-[#e5eaf3] hover:shadow-sm transition-shadow"
                >
                  <div className="w-[56px] h-[56px] rounded-full overflow-hidden bg-[#eff6ff] text-[#2563b0] flex items-center justify-center text-[20px] font-semibold shrink-0">
                    {member.photo ? (
                      <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      member.name.charAt(0)
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="font-semibold text-[#0f2a5e] text-[14px] truncate">
                      {member.name}
                    </div>
                    {(member.role_type || member.position) && (
                      <div className="text-[12px] text-[#2563b0] mb-1">
                        {member.role_type ?? member.position}
                      </div>
                    )}
                    {member.phone && (
                      <div className="text-[12px] text-[#6b7280] flex items-center gap-1.5">
                        <i className="fas fa-phone text-[10px]"></i> {member.phone}
                      </div>
                    )}
                    {member.email && (
                      <div className="text-[12px] text-[#6b7280] flex items-center gap-1.5 truncate">
                        <i className="fas fa-envelope text-[10px]"></i> {member.email}
                      </div>
                    )}
                    {member.office && (
                      <div className="text-[12px] text-[#6b7280] flex items-center gap-1.5">
                        <i className="fas fa-map-marker-alt text-[10px]"></i> {member.office}
                      </div>
                    )}
                  </div>
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