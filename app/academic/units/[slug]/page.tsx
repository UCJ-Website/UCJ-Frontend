import { notFound } from "next/navigation";
import Link from "next/link";
import GalleryDragScroll from "./GalleryDragScroll";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

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
  if (lower.includes("staff development")) return "fa-users";
  if (
    lower.includes("ojt") ||
    lower.includes("on-the-job") ||
    lower.includes("on the job")
  ) {
    return "fa-briefcase";
  }

  if (
    lower.includes("ojt") ||
    lower.includes("on-the-job") ||
    lower.includes("on the job")
  ) {
    return "fa-briefcase";
  }

  if (
    lower.includes("managment") ||
    lower.includes("management")
  ) {
    return "fa-building";
  }

  if (lower.includes("stud")) return "fa-book-open";

  return "fa-layer-group";
}

async function getDepartment(
  slug: string,
): Promise<Department | null> {
  try {
    const res = await fetch(
      `${API_BASE}/api/departments/${slug}`,
      {
        cache: "no-store",
      },
    );

    if (!res.ok) return null;

    const json = await res.json();

    return json?.data?.department ?? null;
  } catch {
    return null;
  }
}

function resolveImageUrl(path: string | null): string | null {
  if (!path) return null;

  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  return `${API_BASE}/storage/${path.replace(/^\/+/, "")}`;
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

  const isOjtUnit =
    slug === "ojt-unit" ||
    unit.short_code?.toUpperCase() === "OJT" ||
    unit.name.toLowerCase().includes("on-the-job training") ||
    unit.name.toLowerCase().includes("ojt");

  const ojtDescription =
    "The On-the-Job Training Division coordinates and facilitates in-plant and on-site training opportunities for students in government and private sector organizations. It focuses on developing practical skills, providing industry exposure and supervised workplace learning, improving employability, and ensuring the effective performance evaluation of trainees.";

  const displayDescription =
    unit.description ||
    (isOjtUnit ? ojtDescription : unit.short_description);

  const displayVision = unit.vision;

  const displayMission = unit.mission;

  const icon = getIcon(unit.name);
  const bannerUrl = resolveImageUrl(unit.banner_image);
  const logoUrl = resolveImageUrl(unit.logo);

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      {/* ===== BANNER ===== */}
      <div
        className="w-full px-6 py-12 text-center"
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
        {/* Breadcrumb */}
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

          <Link
            href="/academic/units"
            className="transition-colors hover:text-white"
          >
            Units
          </Link>

          <span className="mx-1.5">›</span>

          <span className="text-white">{unit.name}</span>
        </div>

        {/* Icon / Logo */}
        <div className="mx-auto mb-4 flex h-[60px] w-[60px] items-center justify-center overflow-hidden rounded-2xl bg-white/10 text-[26px] text-white">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={unit.name}
              className="h-full w-full object-contain p-1"
            />
          ) : (
            <i className={`fas ${icon}`} />
          )}
        </div>

        <span className="mb-3 inline-block rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white">
          {unit.short_code}
        </span>

        <h1
          className="font-bold text-white"
          style={{
            fontSize: "clamp(24px,4vw,38px)",
          }}
        >
          {unit.name}
        </h1>

        <p className="mx-auto mt-3 max-w-[600px] text-[14px] leading-[1.7] text-white/70">
          {unit.short_description}
        </p>
      </div>

      {/* ===== CONTENT ===== */}
      <main className="mx-auto w-full max-w-[1350px] px-4 py-10">
        {/* ===== DESCRIPTION ===== */}
        <div className="mb-6 rounded-[14px] border border-[#e5eaf3] bg-white p-8 shadow-sm">
          <div className="mb-3 text-[12px] font-semibold uppercase tracking-[0.1em] text-[#2563b0]">
            Description
          </div>

          <p className="text-[15px] leading-7 text-[#4b5563]">
            {displayDescription}
          </p>
        </div>

        {/* ===== VISION / MISSION ===== */}
        {(displayVision || displayMission) && (
          <div className="mb-6 grid gap-6 rounded-[14px] border border-[#e5eaf3] bg-white p-8 shadow-sm sm:grid-cols-2">
            {displayVision && (
              <div>
                <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-[#2563b0]">
                  Vision
                </div>

                <p className="text-[14px] leading-6 text-[#4b5563]">
                  {displayVision}
                </p>
              </div>
            )}

            {displayMission && (
              <div>
                <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-[#2563b0]">
                  Mission
                </div>

                <p className="text-[14px] leading-6 text-[#4b5563]">
                  {displayMission}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ===== GALLERY ===== */}
        {gallery.length > 0 && (
          <div className="mb-6 rounded-[14px] border border-[#e5eaf3] bg-white p-8 shadow-sm">
            <div className="mb-5 text-[12px] font-semibold uppercase tracking-[0.1em] text-[#2563b0]">
              <i className="fas fa-images mr-1.5" />
              Gallery
            </div>

            <GalleryDragScroll
              items={gallery}
              apiBase={API_BASE}
            />
          </div>
        )}

        {/* ===== STAFF ===== */}
        {staff.length > 0 && (
          <div className="mb-6 rounded-[14px] border border-[#e5eaf3] bg-white p-8 shadow-sm">
            <div className="mb-5 text-[12px] font-semibold uppercase tracking-[0.1em] text-[#2563b0]">
              <i className="fas fa-users mr-1.5" />
              Staff Members
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {staff.map((member) => (
                <Link
                  key={member.id}
                  href={
                    member.slug
                      ? `/staff/${member.slug}`
                      : "#"
                  }
                  className="flex items-center gap-4 rounded-xl border border-[#e5eaf3] p-4 transition-all hover:-translate-y-0.5 hover:border-[#2563b0]/30 hover:shadow-sm"
                >
                  <div className="flex h-[56px] w-[56px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#eff6ff] text-[20px] font-semibold text-[#2563b0]">
                    {member.photo ? (
                      <img
                        src={
                          resolveImageUrl(member.photo) ?? ""
                        }
                        alt={member.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      member.name.charAt(0)
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="truncate text-[14px] font-semibold text-[#0f2a5e]">
                      {member.name}
                    </div>

                    {(member.role_type ||
                      member.position) && (
                      <div className="mb-1 text-[12px] text-[#2563b0]">
                        {member.role_type ??
                          member.position}
                      </div>
                    )}

                    {member.phone && (
                      <div className="flex items-center gap-1.5 text-[12px] text-[#6b7280]">
                        <i className="fas fa-phone text-[10px]" />
                        {member.phone}
                      </div>
                    )}

                    {member.email && (
                      <div className="flex truncate items-center gap-1.5 text-[12px] text-[#6b7280]">
                        <i className="fas fa-envelope text-[10px]" />
                        {member.email}
                      </div>
                    )}

                    {member.office && (
                      <div className="flex items-center gap-1.5 text-[12px] text-[#6b7280]">
                        <i className="fas fa-map-marker-alt text-[10px]" />
                        {member.office}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <Link
          href="/academic"
          className="flex items-center gap-2 text-[14px] font-medium text-[#2563b0] transition-all hover:gap-3"
        >
          <i className="fas fa-arrow-left text-[12px]" />
          Back to Academic
        </Link>
      </main>
    </div>
  );
}