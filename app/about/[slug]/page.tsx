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

// Pulls a trailing "Mon YYYY - Mon YYYY" style range out of a subcategory
// string like "Head of Department (Former Acting Director / CEO, Nov 2020
// - Nov 2021)". Some former directors never got `position` set to
// "Former Director" — they only have this parenthetical note in
// `subcategory` while `position` still shows their regular title (e.g.
// "Senior Lecturer"). This lets the UI still surface *when* they served.
function extractFormerPeriod(subcategory: string | null): string | null {
  if (!subcategory) return null;
  const bracket = subcategory.match(/\(([^)]+)\)/);
  if (!bracket) return null;

  const inner = bracket[1];
  const parts = inner.split(",");
  const last = parts[parts.length - 1].trim();

  // only treat it as a "former year" if it actually looks like a date range
  return /\d/.test(last) ? last : null;
}

// ===== PAGE META =====
// IMPORTANT — confirmed from actual API data:
// Director/Former-Director records do NOT use category: "director".
// Their `category` is "non-academic" (same as other admin staff), and the
// real distinguishing field is `position` (e.g. "Former Director") or
// `subcategory` (e.g. "Former Director" — same string, used as a label).
// `position` filter on the backend is an EXACT match
// (`where('position', $position)`), so these need to equal the DB value
// character-for-character, not just contain it.
// If a "current Director" page is still empty, that's because no staff
// row exists yet with position "Director" — that's a data gap, add the
// row via the dashboard, not a frontend bug.
//
// NOTE ON "FORMER DIRECTOR": some former (acting) directors were never
// given `position: "Former Director"` in the DB — they reverted to their
// substantive academic title (e.g. "Senior Lecturer") and the only trace
// of their directorship is a parenthetical note inside `subcategory`
// (e.g. "Head of Department (Former Acting Director / CEO, Nov 2020 -
// Nov 2021)"). The exact-match `position` filter alone will miss these
// people, so fetchPeople() backfills them in for this specific page —
// see fetchAllStaffMatchingSubcategory() below.
const pageMeta: Record<string, {
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  filter: { category?: string; subcategory?: string; position?: string };
}> = {
  "director": {
    title: "Director",
    subtitle: "Executive Leadership",
    icon: "fa-landmark",
    description: "The Director provides strategic academic and administrative leadership for University College of Jaffna, operating under the University of Jaffna to uphold institutional excellence.",
    filter: { position: "Director" },
  },
  "former-director": {
    title: "Former Directors",
    subtitle: "Legacy of Leadership",
    icon: "fa-history",
    description: "We honour the former Directors whose vision and dedication have shaped University College of Jaffna into the institution it is today.",
    filter: { position: "Former Director" },
  },

  "assistant-registrar": {
    title: "Assistant Registrar",
    subtitle: "Administrative Support",
    icon: "fa-pen-nib",
    description: "The Assistant Registrar assists in managing student records, admissions, examinations, and official institutional correspondence.",
    filter: { position: "Assistant Registrar" },
  },
  "assistant-bursar": {
    title: "Assistant Bursar",
    subtitle: "Financial Operations",
    icon: "fa-coins",
    description: "The Assistant Bursar supports the financial operations of University College of Jaffna, including fee collection, payroll coordination, and financial reporting.",
    filter: { position: "Assistant Bursar" },
  },
    "assistant-librarian": {
    title: "Assistant Librarian",
    subtitle: "Deputy Academic Leadership",
    icon: "fa-user-tie",
    description: "The Assistant Librarian supports the Director in overseeing academic programmes, faculty coordination, and institutional development initiatives.",
    filter: { position: "Assistant Librarian" },
  },
};

// ===== TYPES =====
// NOTE: subcategory and several other fields can be null in the real API
// response, so they must be typed as nullable. "units" was also missing
// from the original type even though the API returns it.
type Department = { id: number; name: string; short_code: string; role_type?: string | null };
type Unit = { id: number; name: string; short_code: string; role_type?: string | null };

type Staff = {
  id: number;
  slug: string;
  name: string;
  position: string;
  category: string;
  subcategory: string | null;
  photo: string | null;
  email: string | null;
  phone: string | null;
  office: string | null;
  linkedin: string | null;
  research_gate: string | null;
  google_scholar: string | null;
  joined_date: string | null;
  departments: Department[];
  units?: Unit[];
};

// Backend only supports exact-match filtering (category / subcategory /
// position), so there's no server-side "contains" search for subcategory.
// For cases like the former-acting-director backfill, we pull a large
// page of staff and match the pattern client-side instead.
async function fetchAllStaffMatchingSubcategory(pattern: RegExp): Promise<Staff[]> {
  try {
    const res = await fetch(`${API_URL}/staffs?per_page=500`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    const all: Staff[] = json?.data?.staffs?.data ?? [];
    return all.filter((p) => p.subcategory && pattern.test(p.subcategory));
  } catch (err) {
    console.error("fetchAllStaffMatchingSubcategory failed:", err);
    return [];
  }
}

async function fetchPeople(slug: string): Promise<Staff[]> {
  const meta = pageMeta[slug];
  if (!meta) return [];

  try {
    // Build query string from the filter object so it's sent straight to
    // StaffController@index — this now matches the backend's actual
    // `where('category', $category)` / `where('subcategory', $subcategory)`
    // / `where('position', $position)` exact-match behavior exactly,
    // instead of re-implementing (and potentially mismatching) that logic
    // on the frontend.
    const qs = new URLSearchParams({ per_page: "200" });
    if (meta.filter.category) qs.set("category", meta.filter.category);
    if (meta.filter.subcategory) qs.set("subcategory", meta.filter.subcategory);
    if (meta.filter.position) qs.set("position", meta.filter.position);

    const res = await fetch(`${API_URL}/staffs?${qs.toString()}`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    const people: Staff[] = json?.data?.staffs?.data ?? [];

    // Backfill former (acting) directors whose `position` was never
    // updated to "Former Director" — see the comment on pageMeta above.
    if (slug === "former-director") {
      const extra = await fetchAllStaffMatchingSubcategory(/former\s+(acting\s+)?director/i);
      const seen = new Set(people.map((p) => p.id));
      for (const p of extra) {
        if (!seen.has(p.id)) {
          people.push(p);
          seen.add(p.id);
        }
      }
    }

    return people;
  } catch (err) {
    console.error("fetchPeople failed:", err);
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
              {people.map((person) => {
                const formerPeriod = extractFormerPeriod(person.subcategory);

                return (
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
                      <p className="text-[#e85d14] text-xs font-semibold line-clamp-1">
                        {person.position}
                      </p>

                      {/* Former-director service period, when available */}
                      {formerPeriod && (
                        <p className="text-gray-400 text-[10px] font-medium mt-1 mb-2">
                          {formerPeriod}
                        </p>
                      )}

                      {/* Contact row — these are now non-interactive indicators
                          since the card itself is one big Link (a clickable
                          <a> can't contain another clickable <a> reliably) */}
                      <div className={`flex items-center justify-center gap-2 ${formerPeriod ? "" : "mt-3"}`}>
                        {person.email && (
                          <span
                            className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs"
                            title={person.email}
                          >
                            <i className="fas fa-envelope" />
                          </span>
                        )}
                        {person.phone && (
                          <span
                            className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs"
                            title={person.phone}
                          >
                            <i className="fas fa-phone" />
                          </span>
                        )}
                        {person.linkedin && (
                          <span
                            className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs"
                            title="LinkedIn"
                          >
                            <i className="fab fa-linkedin-in" />
                          </span>
                        )}
                      </div>

                      {/* Dept / Unit badge */}
                      {(person.departments?.[0] || person.units?.[0]) && (
                        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                          {person.departments?.[0] && (
                            <span className="text-[10px] font-bold bg-[#0f2a5e]/8 text-[#0f2a5e] border border-[#0f2a5e]/15 px-2.5 py-1 rounded-full">
                              {person.departments[0].short_code}
                            </span>
                          )}
                          {person.units?.[0] && (
                            <span className="text-[10px] font-bold bg-[#e85d14]/8 text-[#e85d14] border border-[#e85d14]/15 px-2.5 py-1 rounded-full">
                              {person.units[0].short_code}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
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