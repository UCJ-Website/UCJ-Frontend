// app/academic/units/board-of-managment/page.tsx

import { notFound } from "next/navigation";
import Link from "next/link";

interface Unit {
  id: number;
  slug: string;
  name: string;
  short_code: string;
  short_description: string;
  logo: string | null;
  banner_image: string | null;
}

async function getBoardOfManagement(): Promise<Unit | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/units`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    const units: Unit[] = json?.data?.units?.data ?? [];
    return units.find((u) => u.short_code === "BOM") ?? null;
  } catch {
    return null;
  }
}

export default async function BoardOfManagementPage() {
  const unit = await getBoardOfManagement();
  if (!unit) return notFound();

  const bannerUrl = unit.banner_image
    ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${unit.banner_image}`
    : null;
  const logoUrl = unit.logo
    ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${unit.logo}`
    : null;

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
              <i className="fas fa-building"></i>
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
        <div className="bg-white rounded-[14px] border border-[#e5eaf3] p-8 mb-8 shadow-sm">
          <div className="text-[12px] font-semibold tracking-[0.1em] uppercase text-[#2563b0] mb-3">
            Overview
          </div>
          <p className="text-[#4b5563] text-[15px] leading-7">
            {unit.short_description}
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