
//BoardOfManagementPage_role_type_no_gallery.tsx


import { notFound } from "next/navigation";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

interface StaffMember {
  id: number;
  name: string;
  position?: string | null;
  role_type?: string | null;
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
}

interface GalleryItem {
  id: number;
  title: string | null;
  category: string | null;
  description: string | null;
  cover_image: string;
  year: number | null;
  month: string | null;
}

interface UnitDetail {
  id: number;
  slug: string;
  name: string;
  short_code: string;
  short_description: string;
  description: string | null;
  is_unit: boolean;
  is_engineering: boolean;
  logo: string | null;
  banner_image: string | null;
  vision: string | null;
  mission: string | null;
  staff: StaffMember[];
  courses: CourseSummary[];
  researches: unknown[];
  gallery: GalleryItem[];
}

function imageUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_BASE}/${path.replace(/^\/+/, "")}`;
}

async function getBoardOfManagement(): Promise<UnitDetail | null> {
  try {
    const res = await fetch(`${API_BASE}/api/departments/board-of-management`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.department ?? null;
  } catch {
    return null;
  }
}

export default async function BoardOfManagementPage() {
  const unit = await getBoardOfManagement();
  if (!unit) return notFound();

  const bannerUrl = imageUrl(unit.banner_image);
  const logoUrl = imageUrl(unit.logo);

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
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="mx-1.5">›</span>
            <Link href="/academic" className="hover:text-white transition-colors">
              Academic
            </Link>
            <span className="mx-1.5">›</span>
            <span className="text-white">{unit.name}</span>
          </div>

          <div className="w-[60px] h-[60px] rounded-2xl bg-white/10 text-white flex items-center justify-center text-[26px] mx-auto mb-4 overflow-hidden">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={unit.name}
                className="w-full h-full object-contain p-1"
              />
            ) : (
              <i className="fas fa-building"></i>
            )}
          </div>

          <span className="inline-block bg-white/15 text-white text-[11px] font-bold px-3 py-1 rounded-full tracking-widest uppercase mb-3">
            {unit.short_code}
          </span>

          <h1
            className="text-white font-bold"
            style={{ fontSize: "clamp(24px,4vw,38px)" }}
          >
            {unit.name}
          </h1>
          {unit.short_description && (
            <p className="text-white/70 text-[14px] max-w-[500px] mx-auto mt-3 leading-[1.6]">
              {unit.short_description}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-[1300px] mx-auto px-6 py-16">
        {/* Overview */}
        <div className="bg-white rounded-[14px] border border-[#e5eaf3] p-8 mb-6 shadow-sm">
          <div className="text-[12px] font-semibold tracking-[0.1em] uppercase text-[#2563b0] mb-3">
            Description
          </div>
          <p className="text-[#4b5563] text-[15px] leading-7">
            {unit.description ?? unit.short_description}
          </p>
          
        </div>

        {/* Vision */}
        {unit.vision && (
          <div className="bg-white rounded-[14px] border border-[#e5eaf3] p-8 mb-6 shadow-sm">
            <div className="text-[12px] font-semibold tracking-[0.1em] uppercase text-[#2563b0] mb-3">
              Vision
            </div>
            <p className="text-[#4b5563] text-[15px] leading-7">{unit.vision}</p>
          </div>
        )}

        {/* Mission */}
        {unit.mission && (
          <div className="bg-white rounded-[14px] border border-[#e5eaf3] p-8 mb-6 shadow-sm">
            <div className="text-[12px] font-semibold tracking-[0.1em] uppercase text-[#2563b0] mb-3">
              Mission
            </div>
            <p className="text-[#4b5563] text-[15px] leading-7">{unit.mission}</p>
          </div>
        )}

        {/* Staff */}
        {unit.staff && unit.staff.length > 0 && (
          <div className="bg-white rounded-[14px] border border-[#e5eaf3] p-8 mb-6 shadow-sm">
            <div className="text-[12px] font-semibold tracking-[0.1em] uppercase text-[#2563b0] mb-5">
              Staff Members
            </div>

            {/* Table (desktop / tablet) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#e5eaf3]">
                    <th className="text-left text-[11px] font-semibold tracking-wider uppercase text-[#6b7280] py-3 px-3 w-[60px]">
                      Photo
                    </th>
                    <th className="text-left text-[11px] font-semibold tracking-wider uppercase text-[#6b7280] py-3 px-3">
                      Name
                    </th>
                    <th className="text-left text-[11px] font-semibold tracking-wider uppercase text-[#6b7280] py-3 px-3">
                      Role
                    </th>
                    <th className="text-left text-[11px] font-semibold tracking-wider uppercase text-[#6b7280] py-3 px-3">
                      Email
                    </th>
                    <th className="text-left text-[11px] font-semibold tracking-wider uppercase text-[#6b7280] py-3 px-3">
                      Phone
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {unit.staff.map((s) => {
                    const photoUrl = imageUrl(s.photo ?? null);
                    return (
                      <tr
                        key={s.id}
                        className="border-b border-[#f0f4fb] hover:bg-[#f8faff] transition-colors"
                      >
                        <td className="py-3 px-3">
                          <div className="w-[40px] h-[40px] rounded-full bg-[#dbeafe] text-[#2563b0] flex items-center justify-center font-bold text-[14px] overflow-hidden">
                            {photoUrl ? (
                              <img
                                src={photoUrl}
                                alt={s.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              s.name.charAt(0).toUpperCase()
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 font-semibold text-[#1e3a5f] text-[14px]">
                          {s.name}
                        </td>
                        <td className="py-3 px-3 text-[13px] text-[#6b7280]">
                          {s.role_type ?? s.position ?? "—"}
                        </td>
                        <td className="py-3 px-3 text-[13px]">
                          {s.email ? (
                            <a
                              href={`mailto:${s.email}`}
                              className="text-[#2563b0] hover:underline"
                            >
                              {s.email}
                            </a>
                          ) : (
                            <span className="text-[#9ca3af]">—</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-[13px]">
                          {s.phone ? (
                            <a
                              href={`tel:${s.phone}`}
                              className="text-[#2563b0] hover:underline"
                            >
                              {s.phone}
                            </a>
                          ) : (
                            <span className="text-[#9ca3af]">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Stacked cards (mobile only) */}
            <div className="sm:hidden flex flex-col gap-3">
              {unit.staff.map((s) => {
                const photoUrl = imageUrl(s.photo ?? null);
                return (
                  <div
                    key={s.id}
                    className="flex items-center gap-4 p-4 rounded-xl border border-[#f0f4fb] bg-[#f8faff]"
                  >
                    <div className="w-[48px] h-[48px] rounded-full bg-[#dbeafe] text-[#2563b0] flex items-center justify-center font-bold text-[16px] shrink-0 overflow-hidden">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={s.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        s.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-[#1e3a5f] text-[14px]">
                        {s.name}
                      </div>
                      {(s.role_type || s.position) && (
                        <div className="text-[12px] font-medium text-[#2563b0]">
                          {s.role_type ?? s.position}
                        </div>
                      )}
                      {s.email && (
                        <a
                          href={`mailto:${s.email}`}
                          className="text-[12px] text-[#2563b0] hover:underline"
                        >
                          {s.email}
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Courses */}
        {unit.courses && unit.courses.length > 0 && (
          <div className="bg-white rounded-[14px] border border-[#e5eaf3] p-8 mb-6 shadow-sm">
            <div className="text-[12px] font-semibold tracking-[0.1em] uppercase text-[#2563b0] mb-5">
              Courses
            </div>
            <div className="flex flex-col gap-3">
              {unit.courses.map((c) => (
                <Link
                  key={c.id}
                  href={`/academic/courses/${c.slug}`}
                  className="flex items-center justify-between p-4 rounded-xl border border-[#e5eaf3] hover:border-[#2563b0] hover:bg-[#f8faff] transition-all group"
                >
                  <div>
                    <div className="font-medium text-[#1e3a5f] text-[14px] group-hover:text-[#2563b0]">
                      {c.title}
                    </div>
                    {c.level && (
                      <div className="text-[12px] text-[#6b7280] mt-0.5">{c.level}</div>
                    )}
                  </div>
                  <i className="fas fa-arrow-right text-[#2563b0] text-[12px] opacity-0 group-hover:opacity-100 transition-opacity"></i>
                </Link>
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