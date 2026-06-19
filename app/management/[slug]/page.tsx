import { notFound } from "next/navigation";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface ManagementDetail {
  slug: string;
  icon: string;
  title: string;
  sub: string;
  desc: string;
  overview: string;
  name?: string;
  email?: string;
  phone?: string;
}

async function getMember(slug: string): Promise<ManagementDetail | null> {
  try {
    const res = await fetch(`${API_BASE}/api/management/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data ?? data;
  } catch {
    return null;
  }
}

export default async function ManagementDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const member = await getMember(params.slug);
  if (!member) return notFound();

  return (
    <>
      <div className="relative bg-[#0a1628] text-white py-16 px-6 text-center overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-sm text-white/50 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <i className="fas fa-chevron-right text-xs" />
            <Link href="/administration" className="hover:text-white transition-colors">Administration</Link>
            <i className="fas fa-chevron-right text-xs" />
            <span className="text-white/80">{member.title}</span>
          </div>
          <div className="w-16 h-16 rounded-full bg-[#e85d14]/20 flex items-center justify-center mx-auto mb-4">
            <i className={`fas ${member.icon} text-[#e85d14] text-2xl`} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{member.title}</h1>
          <p className="text-white/60">{member.sub}</p>
        </div>
      </div>

      <main className="max-w-[800px] mx-auto px-6 py-16">
        <p className="text-gray-600 text-[15px] leading-7 mb-8">{member.overview}</p>

        {(member.email || member.phone) && (
          <div className="bg-[#f8fafc] border border-gray-100 rounded-xl p-6 flex flex-col gap-3">
            {member.email && (
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <i className="fas fa-envelope text-[#2563b0]" /> {member.email}
              </div>
            )}
            {member.phone && (
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <i className="fas fa-phone text-[#2563b0]" /> {member.phone}
              </div>
            )}
          </div>
        )}

        <Link href="/administration" className="text-[#2563b0] font-medium text-[14px] flex items-center gap-2 mt-10">
          <i className="fas fa-arrow-left text-[12px]" /> Back to Administration
        </Link>
      </main>
    </>
  );
}