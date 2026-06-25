import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

// ===== API CONFIG =====
const RAW_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";
const ORIGIN = RAW_BASE.replace(/\/api\/?$/, "");
const API_URL = `${ORIGIN}/api`;

function resolveImage(path: string | null | undefined): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${ORIGIN}/${path.replace(/^\/+/, "")}`;
}

// ===== PAGE META =====
const pageMeta: Record<string, {
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  // how to filter from /api/staffs
  filter: { type: "category+subcategory"; category: string; subcategory: string }
         | { type: "position"; keyword: string };
}> = {
  "director": {
    title: "Director",
    subtitle: "Executive Leadership",
    icon: "fa-landmark",
    description: "The Director provides strategic academic and administrative leadership for University College of Jaffna, operating under the University of Jaffna to uphold institutional excellence.",
    filter: { type: "category+subcategory", category: "director", subcategory: "current" },
  },
  "former-director": {
    title: "Former Directors",
    subtitle: "Legacy of Leadership",
    icon: "fa-history",
    description: "We honour the former Directors whose vision and dedication have shaped University College of Jaffna into the institution it is today.",
    filter: { type: "category+subcategory", category: "director", subcategory: "former" },
  },
  "assistant-director": {
    title: "Assistant Director",
    subtitle: "Deputy Academic Leadership",
    icon: "fa-user-tie",
    description: "The Assistant Director supports the Director in overseeing academic programmes, faculty coordination, and institutional development initiatives.",
    filter: { type: "position", keyword: "Assistant Director" },
  },
  "assistant-registrar": {
    title: "Assistant Registrar",
    subtitle: "Administrative Support",
    icon: "fa-pen-nib",
    description: "The Assistant Registrar assists in managing student records, admissions, examinations, and official institutional correspondence.",
    filter: { type: "position", keyword: "Assistant Registrar" },
  },
  "assistant-bursar": {
    title: "Assistant Bursar",
    subtitle: "Financial Operations",
    icon: "fa-coins",
    description: "The Assistant Bursar supports the financial operations of University College of Jaffna, including fee collection, payroll coordination, and financial reporting.",
    filter: { type: "position", keyword: "Assistant Bursar" },
  },
};

// ===== TYPES =====
type Staff = {
  id: number;
  slug: string;
  name: string;
  position: string;
  category: string;
  subcategory: string;
  photo: string | null;
  email: string | null;
  phone: string | null;
  office: string | null;
  linkedin: string | null;
  research_gate: string | null;
  google_scholar: string | null;
  joined_date: string | null;
  departments: { id: number; name: string; short_code: string }[];
};

async function fetchPeople(slug: string): Promise<Staff[]> {
  const meta = pageMeta[slug];
  if (!meta) return [];

  try {
    const res = await fetch(`${API_URL}/staffs?per_page=200`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    const all: Staff[] = json?.data?.staffs?.data ?? [];

    if (meta.filter.type === "category+subcategory") {
      const { category, subcategory } = meta.filter;
      return all.filter(
        (s) => s.category === category && s.subcategory === subcategory
      );
    }

    // position keyword match
    const { keyword } = meta.filter;
    return all.filter((s) => s.position.toLowerCase().includes(keyword.toLowerCase()));
  } catch {
    return [];
  }
}

export default async function PeoplesSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = pageMeta[slug];
  if (!meta) notFound();

  const people = await fetchPeople(slug);

  return (
    <>
      {/* ════ HERO ════ */}
      <div className="relative bg-[#0a1628] text-white py-20 px-6 text-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(232,93,20,0.4) 1.5px, transparent 1.5px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 70% 50%, rgba(232,93,20,0.08) 0%, transparent 60%)",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-[#e85d14] text-sm font-semibold uppercase tracking-widest mb-4">
            <i className={`fas ${meta.icon}`} />
            <span>UCJ People</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-[#e85d14]">{meta.title}</span>
          </h1>
          <p className="text-white/60 text-base md:text-lg leading-relaxed mb-6">
            {meta.subtitle}
          </p>
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-sm text-white/40">
            <Link href="/" className="hover:text-[#e85d14] transition-colors">Home</Link>
            <i className="fas fa-chevron-right text-xs" />
            <Link href="/about" className="hover:text-[#e85d14] transition-colors">About</Link>
            <i className="fas fa-chevron-right text-xs" />
            <span className="text-white/70">{meta.title}</span>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-16">

        {/* Description */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-7 mb-12 flex items-start gap-5">
          <div className="w-12 h-12 rounded-xl bg-[#e85d14]/10 border border-[#e85d14]/20 flex items-center justify-center shrink-0">
            <i className={`fas ${meta.icon} text-[#e85d14] text-lg`} />
          </div>
          <div>
            <h2 className="text-[#0f2a5e] font-bold text-lg mb-1">{meta.title}</h2>
            <p className="text-gray-500 text-sm leading-relaxed">{meta.description}</p>
          </div>
        </div>

        {/* People Grid */}
        {people.length > 0 ? (
          <>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-6 bg-[#e85d14] rounded-full" />
              <h3 className="text-lg font-bold text-[#0f2a5e]">{meta.title}</h3>
              <span className="ml-auto text-xs font-semibold bg-[#e85d14]/10 text-[#e85d14] px-3 py-1 rounded-full">
                {people.length} {people.length === 1 ? "Member" : "Members"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {people.map((person) => (
                <Link
                  key={person.id}
                  href={`/staff/${person.slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                >
                  {/* Photo */}
                  <div className="relative h-52 bg-gradient-to-br from-[#0a1931] to-[#122347] overflow-hidden">
                    {resolveImage(person.photo) ? (
                      <Image
                        src={resolveImage(person.photo)}
                        alt={person.name}
                        fill
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-[#e85d14]/20 border-2 border-[#e85d14]/40 flex items-center justify-center">
                          <i className="fas fa-user text-[#e85d14] text-3xl" />
                        </div>
                      </div>
                    )}
                    {/* hover overlay */}
                    <div className="absolute inset-0 bg-[#0a1628]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white text-xs font-semibold bg-[#e85d14] px-4 py-2 rounded-full">
                        View Profile
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5 text-center">
                    <h4 className="font-bold text-[#0f2a5e] text-sm mb-1 line-clamp-1">
                      {person.name}
                    </h4>
                    <p className="text-[#e85d14] text-xs font-semibold mb-3 line-clamp-1">
                      {person.position}
                    </p>

                    {/* Contact row */}
                    <div className="flex items-center justify-center gap-2">
                      {person.email && (
                        <a
                          href={`mailto:${person.email}`}
                          onClick={(e) => e.preventDefault() /* handled by parent Link */}
                          className="w-7 h-7 rounded-full bg-gray-100 hover:bg-[#e85d14] hover:text-white text-gray-500 flex items-center justify-center transition-colors text-xs"
                          title={person.email}
                        >
                          <i className="fas fa-envelope" />
                        </a>
                      )}
                      {person.phone && (
                        <a
                          href={`tel:${person.phone}`}
                          onClick={(e) => e.preventDefault()}
                          className="w-7 h-7 rounded-full bg-gray-100 hover:bg-[#e85d14] hover:text-white text-gray-500 flex items-center justify-center transition-colors text-xs"
                          title={person.phone}
                        >
                          <i className="fas fa-phone" />
                        </a>
                      )}
                      {person.linkedin && (
                        <a
                          href={person.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-7 h-7 rounded-full bg-gray-100 hover:bg-[#0077b5] hover:text-white text-gray-500 flex items-center justify-center transition-colors text-xs"
                          title="LinkedIn"
                        >
                          <i className="fab fa-linkedin-in" />
                        </a>
                      )}
                    </div>

                    {/* Dept badge */}
                    {person.departments?.[0] && (
                      <div className="mt-3">
                        <span className="text-[10px] font-bold bg-[#0f2a5e]/8 text-[#0f2a5e] border border-[#0f2a5e]/15 px-2.5 py-1 rounded-full">
                          {person.departments[0].short_code}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <i className={`fas ${meta.icon} text-gray-300 text-2xl`} />
            </div>
            <p className="text-gray-400 text-sm">No records found for this category.</p>
            <p className="text-gray-300 text-xs mt-1">Data will appear once added via the dashboard.</p>
          </div>
        )}

        {/* Back link */}
        <div className="mt-14 flex justify-center">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 border border-[#0f2a5e]/30 hover:border-[#0f2a5e] text-[#0f2a5e] px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
          >
            <i className="fas fa-arrow-left" /> Back to About
          </Link>
        </div>
      </main>
    </>
  );
}