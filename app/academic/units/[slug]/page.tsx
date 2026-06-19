import { notFound } from "next/navigation";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface UnitDetail {
  slug: string;
  icon: string;
  title: string;
  desc: string;
  overview: string;
}

async function getUnit(slug: string): Promise<UnitDetail | null> {
  try {
    const res = await fetch(`${API_BASE}/api/units/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data ?? data;
  } catch {
    return null;
  }
}

export default async function UnitDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const unit = await getUnit(params.slug);
  if (!unit) return notFound();

  return (
    <>
      <div
        className="relative text-center py-16 px-6 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f2a5e 0%, #1a4a8a 60%, #2563b0 100%)" }}
      >
        <div className="relative z-10">
          <div className="text-[13px] text-white/65 mb-3">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-1.5">›</span>
            <Link href="/academic" className="hover:text-white transition-colors">Academic</Link>
            <span className="mx-1.5">›</span>
            <span className="text-white">{unit.title}</span>
          </div>
          <div className="w-[60px] h-[60px] rounded-2xl bg-white/10 text-white flex items-center justify-center text-[26px] mx-auto mb-4">
            <i className={`fas ${unit.icon}`}></i>
          </div>
          <h1 className="text-white font-bold" style={{ fontSize: "clamp(24px,4vw,38px)" }}>
            {unit.title}
          </h1>
        </div>
      </div>

      <main className="max-w-[900px] mx-auto px-6 py-16">
        <p className="text-[#6b7280] text-[16px] leading-7 mb-8">{unit.overview}</p>

        <Link href="/academic" className="text-[#2563b0] font-medium text-[14px] flex items-center gap-2">
          <i className="fas fa-arrow-left text-[12px]"></i> Back to Academic
        </Link>
      </main>
    </>
  );
}