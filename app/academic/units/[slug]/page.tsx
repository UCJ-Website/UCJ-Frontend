import { notFound } from "next/navigation";
import Link from "next/link";

interface UnitDetail {
  slug: string;
  icon: string;
  title: string;
  desc: string;
  overview: string;
}

const STATIC_UNITS: Record<string, UnitDetail> = {
  "career-guidance": {
    slug: "career-guidance",
    icon: "fa-compass",
    title: "Career Guidance Unit",
    desc: "Helps students with career planning, job placement support, and industry connections.",
    overview:
      "The Career Guidance Unit at University College of Jaffna supports students in making informed decisions about their professional futures. The unit organises career fairs, industry visits, resume workshops, and mock interviews. It maintains strong links with local and national employers to facilitate internship and job placement opportunities for graduating students.",
  },
  "staff-development": {
    slug: "staff-development",
    icon: "fa-users",
    title: "Staff Development Unit",
    desc: "Coordinates professional development, training programs, and workshops for academic staff.",
    overview:
      "The Staff Development Unit is responsible for enhancing the professional competencies of academic and administrative staff at UCJ. It plans and delivers training workshops, seminars, and continuing education programs. The unit also coordinates external training collaborations with universities and professional bodies to ensure staff remain current with developments in their fields.",
  },
};

export default async function UnitDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const unit = STATIC_UNITS[slug];
  if (!unit) return notFound();

  return (
    <>
      {/* Banner */}
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
          <p className="text-white/70 text-[14px] max-w-[500px] mx-auto mt-3 leading-[1.6]">
            {unit.desc}
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-[900px] mx-auto px-6 py-16">
        <div className="bg-white rounded-[14px] border border-[#e5eaf3] p-8 mb-8">
          <div className="text-[12px] font-semibold tracking-[0.1em] uppercase text-[#2563b0] mb-3">
            Overview
          </div>
          <p className="text-[#4b5563] text-[15px] leading-7">{unit.overview}</p>
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