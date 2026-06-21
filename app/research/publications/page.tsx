import Link from "next/link";
import PublicationsList from "./PublicationsList";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface Publication {
  id: number;
  title: string;
  type: "journal" | "conf" | "thesis" | "report" | "publication";
  year: string;
  authors: string;
  description: string;
  department?: { id: number; name: string };
}

async function getPublications(): Promise<Publication[]> {
  try {
    const res = await fetch(`${API_BASE}/api/research?type=publication`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.researches?.data) ? data.researches.data : [];
  } catch {
    return [];
  }
}

export default async function PublicationsPage() {
  const publications = await getPublications();

  return (
    <>
      <div
        className="relative text-center py-20 px-6 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f2a5e 0%, #1a4a8a 60%, #2563b0 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C%2Fg%3E%3C%2Fsvg%3E")`,
          }}
        />
        <div className="relative z-10">
          <div className="text-[13px] text-white/65 mb-3">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-1.5">›</span>
            <Link href="/research" className="hover:text-white transition-colors">Research</Link>
            <span className="mx-1.5">›</span>
            <span className="text-white">Publications</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-[12px] font-semibold px-4 py-1.5 rounded-full mb-5">
            <i className="fas fa-book-open text-[#e85d14]"></i> Journals &amp; Papers
          </div>
          <h1 className="text-white font-bold mb-3" style={{ fontSize: "clamp(28px,5vw,44px)" }}>
            Our <span className="text-[#60a5fa]">Publications</span>
          </h1>
          <p className="text-white/75 text-[15px] max-w-[560px] mx-auto leading-[1.6]">
            Journals, conference papers, theses, and reports produced by UCJ faculty and students.
          </p>
        </div>
      </div>

      <main className="max-w-[1200px] mx-auto px-6 py-16">
        <PublicationsList publications={publications} />
      </main>
    </>
  );
}