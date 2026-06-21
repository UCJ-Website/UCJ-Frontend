import Link from "next/link";
import InnovationGrid from "./InnovationGrid";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface InnovationProject {
  id: number;
  title: string;
  type: string;
  authors?: string;
  description?: string;
  year?: string;
  department?: { id: number; name: string };
}

async function getProjects(): Promise<InnovationProject[]> {
  try {
    const res = await fetch(`${API_BASE}/api/research?type=project`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.researches?.data) ? data.researches.data : [];
  } catch {
    return [];
  }
}

export default async function InnovationPage() {
  const projects = await getProjects();

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
            <span className="text-white">Innovation Projects</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-[12px] font-semibold px-4 py-1.5 rounded-full mb-5">
            <i className="fas fa-lightbulb text-[#e85d14]"></i> Student &amp; Faculty Work
          </div>
          <h1 className="text-white font-bold mb-3" style={{ fontSize: "clamp(28px,5vw,44px)" }}>
            Innovation <span className="text-[#60a5fa]">Projects</span>
          </h1>
          <p className="text-white/75 text-[15px] max-w-[560px] mx-auto leading-[1.6]">
            Real-world solutions built by UCJ students and faculty across engineering,
            business, and health disciplines.
          </p>
        </div>
      </div>

      <main className="max-w-[1200px] mx-auto px-6 py-16">
        <InnovationGrid projects={projects} />
      </main>
    </>
  );
}