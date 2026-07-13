import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

const management: Record<string, {
  icon: string;
  title: string;
  subtitle: string;
  info: { label: string; value: string }[];
  description: string;
  responsibilities: string[];
  external_url: string;
  external_label: string;
  // Exact `subcategory` values to match — these are the same values the
  // /staff page's "Non Academic" sub-filter chips are built from (e.g.
  // "Finance Branch", "Administrative Branch"). Guessing via keywords on
  // `position` or a `units[].short_code` pulled unrelated staff in
  // (an English Instructor, a broken "Assistant Bursar" placeholder
  // record) because those fields don't reliably say what office someone
  // belongs to — subcategory does, so match on it exactly.
  subcategories: string[];
}> = {
  "director-office": {
    icon: "fa-landmark",
    title: "Director Office",
    subtitle: "University college of Jaffna — Strategic Leadership",
    info: [
      { label: "Department", value: "Director's Office" },
      { label: "Location", value: "No 29 Brown Road, Kokuvil East, Jaffna" },
      { label: "Office Hours", value: "Mon – Fri, 8:30 AM – 4:00 PM" },
      { label: "Contact", value: "+94 0212 217791" },
    ],
    description:
      "The Director's Office serves as the apex of academic and administrative leadership at University College of Jaffna. Operating under the University of Jaffna, the Director oversees all institutional functions — ensuring that academic programmes meet national standards, that faculty and staff are supported, and that the institution's strategic vision is effectively carried out across all departments.",
    responsibilities: [
      "Academic and institutional governance",
      "Strategic planning and development",
      "Faculty oversight and performance",
      "Policy implementation and compliance",
      "Liaison with University college of Jaffna",
      "Community and stakeholder engagement",
    ],
    external_url: "https://",
    external_label: "Visit University collge of Jaffna",
    // Director isn't a plain subcategory match — a staff member can carry
    // "Director" alongside other roles inside a ";"-separated subcategory
    // string (e.g. "Head of Department; Director"). Handled separately
    // below via isCurrentDirector()/isFormerDirector(), same logic as
    // the main /staff page.
    subcategories: [],
  },
  "admin-office": {
    icon: "fa-pen-nib",
    title: "Administration",
    subtitle: "Assistant Registrar & General Office",
    info: [
      { label: "Location", value: "Ground Floor, next to Reception" },
      { label: "Staff Pool", value: "5 Mgmt. Assistants · 1 Maint. Technician · 2 Drivers · 5 Office Aids" },
      { label: "Office Hours", value: "Mon – Fri, 8:30 AM – 4:00 PM" },
      { label: "Email", value: "info@ucj.ac.lk" },
    ],
    description:
      "The Administration division of UCJ is situated on the Ground Floor, next to the reception area, and consists of the office of the Assistant Registrar and the General Office. This division is responsible for the overall administration of the college, including General Administration, Establishment, Student Admissions & Registration, and Student Affairs. There is an ongoing need to improve administrative efficiency, strengthen staffing through recruitment and training, enhance infrastructure, and create clear promotion opportunities for administrative staff.",
    responsibilities: [
      "General administration & institutional records",
      "Establishment matters",
      "Student admissions & registration",
      "Student affairs",
      "Staff recruitment & training coordination",
      "Infrastructure and promotion-pathway improvements",
    ],
    external_url: "",
    external_label: "Visit Registrar's Office",
    subcategories: ["Administrative Branch"],
  },
  "finance": {
    icon: "fa-coins",
    title: "Finance",
    subtitle: "Assistant Bursar Office",
    info: [
      { label: "Team", value: "1 Assistant Bursar · 3 Management Assistants" },
      { label: "Standard", value: "SLPSAS Compliant" },
      { label: "Office Hours", value: "Mon – Fri, 8:30 AM – 4:00 PM" },
      { label: "Contact", value: "+94 0212 217791" },
    ],
    description:
      "The Finance division of University College of Jaffna prepares annual financial statements in compliance with Sri Lanka Public Sector Accounting Standards (SLPSAS), submits them for government audit, prepares annual budgets, manages all payments, oversees capital works, and maintains the fixed asset register. The section manages increasing budgets from 2025 to 2026, reflecting institutional growth. Future plans include implementing the Govpay system and adopting the Electronic Government Procurement (eGP) system to improve efficiency and transparency.",
    responsibilities: [
      "SLPSAS-compliant financial statements",
      "Government audit submissions",
      "Annual budget preparation",
      "Payments & capital works oversight",
      "Fixed asset register maintenance",
      "Upcoming: Govpay & eGP system adoption",
    ],
    external_url: "https://",
    external_label: "Visit Bursar's Office",
    subcategories: ["Finance Branch"],
  },
  "library": {
    icon: "fa-book-open",
    title: "Library",
    subtitle: "Assistant Librarian Office",
    info: [
      { label: "Team", value: "1 Assistant Librarian · 1 Office Assistant" },
      { label: "Collection", value: "~3,500 Books & Research Materials" },
      { label: "Office Hours", value: "Mon – Fri, 8:30 AM – 4:00 PM" },
      { label: "Status", value: "1 Management Assistant post vacant" },
    ],
    description:
      "The library serves as a central hub for learning, research, and academic support by providing access to print and digital resources, reference services, reading spaces, and technology-enabled information services. It currently maintains nearly 3,500 books, journals, and research materials, though some subject areas, infrastructure, and user support services require further improvement. The library aims to strengthen its services by expanding print and digital collections, introducing e-resources, automating library operations, developing digital library facilities, upgrading infrastructure and study spaces, improving accessibility, and enhancing staff capacity through continuous professional development.",
    responsibilities: [
      "Print & digital collection management",
      "Reference & information services",
      "Reading space & study infrastructure",
      "Introducing e-resources & digital library facilities",
      "Library operations automation",
      "Accessibility & staff capacity development",
    ],
    external_url: "",
    external_label: "Visit Library",
    // NOTE: adjust this to match the exact `subcategory` value used for
    // library staff in the DB once confirmed — falling back to a position
    // match below in the meantime, same as the /staff & /people pages.
    subcategories: ["Library Branch"],
  },
};

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
  departments: { id: number; name: string; short_code: string }[];
  units: { id: number; name: string; short_code: string }[];
};

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

  return /\d/.test(last) ? last : null;
}

// The backend's `per_page` param on /api/staffs is ignored/capped — it
// always comes back paginated at 10 per page (see `last_page` in the
// response) no matter what we send. Requesting a single "big" page was
// silently truncating results to the first 10 staff, which is why
// Finance/Admin Office (and anyone past page 1) never showed up. Walk
// every page and concatenate instead of trusting per_page to do it.
async function getAllStaff(): Promise<Staff[]> {
  try {
    const first = await fetch("http://127.0.0.1:8000/api/staffs?page=1", {
      cache: "no-store",
    });
    if (!first.ok) return [];
    const firstJson = await first.json();
    const firstPage = firstJson?.data?.staffs;
    let all: Staff[] = firstPage?.data ?? [];
    const lastPage: number = firstPage?.last_page ?? 1;

    if (lastPage > 1) {
      const remaining = await Promise.all(
        Array.from({ length: lastPage - 1 }, (_, i) => i + 2).map((page) =>
          fetch(`http://127.0.0.1:8000/api/staffs?page=${page}`, { cache: "no-store" })
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null)
        )
      );
      for (const json of remaining) {
        const pageStaff: Staff[] = json?.data?.staffs?.data ?? [];
        all = all.concat(pageStaff);
      }
    }

    return all;
  } catch {
    return [];
  }
}

// Splits a ";"-separated subcategory string into trimmed segments — same
// convention used on the /staff page (a person can be tagged with more
// than one role, e.g. "Head of Department; Director").
function getSubcategorySegments(s: Staff): string[] {
  return (s.subcategory ?? "")
    .split(";")
    .map((seg) => seg.trim())
    .filter(Boolean);
}

// STRICT: a segment must literally start with "former director".
function isFormerDirector(s: Staff): boolean {
  return getSubcategorySegments(s).some((seg) => /^former\s+director\b/i.test(seg));
}

// STRICT: a segment must literally start with "director" and not be a
// former-director segment.
function isCurrentDirector(s: Staff): boolean {
  return (
    getSubcategorySegments(s).some((seg) => /^director\b/i.test(seg)) && !isFormerDirector(s)
  );
}

// BROAD match — anyone whose subcategory mentions "former" + "director"
// anywhere, including a parenthetical note like "Head of Department
// (Former Acting Director / CEO, Nov 2020 - Nov 2021)". Used only for
// the Former Directors showcase section.
function isFormerDirectorMention(s: Staff): boolean {
  const sub = (s.subcategory ?? "").toLowerCase();
  return sub.includes("former") && sub.includes("director");
}

// Office staff for admin-office / finance — exact match against the same
// `subcategory` values the /staff page's Non Academic sub-filter chips
// use (e.g. "Finance Branch", "Administrative Branch"). Exact match
// avoids accidentally pulling in unrelated staff the way keyword/unit
// guessing did.
function filterBySubcategory(all: Staff[], subcategories: string[]): Staff[] {
  return all.filter((s) => subcategories.includes((s.subcategory ?? "").trim()));
}

// Library staff: the exact `subcategory` value for the Library Branch
// hasn't been confirmed in the DB yet, so this falls back to matching on
// `position === "Assistant Librarian"` (the same reliable check used on
// the /people/leadership page) in addition to the subcategory list above.
function filterLibraryStaff(all: Staff[], subcategories: string[]): Staff[] {
  return all.filter(
    (s) =>
      subcategories.includes((s.subcategory ?? "").trim()) ||
      (s.position ?? "").trim().toLowerCase() === "assistant librarian"
  );
}

// Admin Office staff: some Management Assistants are tagged with a
// position of "Management Assistant - Grade III" but their subcategory
// isn't set to "Administrative Branch", so they were being missed by the
// exact subcategory match alone. Include them via position as well.
function filterAdminStaff(all: Staff[], subcategories: string[]): Staff[] {
  return all.filter(
    (s) =>
      subcategories.includes((s.subcategory ?? "").trim()) ||
      (s.position ?? "").trim().toLowerCase() === "management assistant - grade iii"
  );
}

export default async function AdminSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = management[slug];
  if (!item) notFound();

  const allStaff = await getAllStaff();
  const staff =
    slug === "director-office"
      ? allStaff.filter(isCurrentDirector)
      : slug === "library"
      ? filterLibraryStaff(allStaff, item.subcategories)
      : slug === "admin-office"
      ? filterAdminStaff(allStaff, item.subcategories)
      : filterBySubcategory(allStaff, item.subcategories);

  // Admin Office: order staff by position priority — Management
  // Assistant - Grade III first, then Maintenance Technician, then
  // Office Assistant, then Driver. Anyone with an unlisted position
  // falls to the end. Order within the same position is preserved
  // (stable sort).
  if (slug === "admin-office") {
    const priorityOrder = [
      "management assistant - grade iii",
      "maintenance technician",
      "office assistant",
      "driver",
    ];
    staff.sort((a, b) => {
      const rank = (s: Staff) => {
        const index = priorityOrder.indexOf((s.position ?? "").trim().toLowerCase());
        return index === -1 ? priorityOrder.length : index;
      };
      return rank(a) - rank(b);
    });
  }
  const formerDirectors = slug === "director-office" ? allStaff.filter(isFormerDirectorMention) : [];

  return (
    <>
      {/* HERO */}
      <div className="relative bg-[#0a1628] text-white py-20 px-6 text-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 70% 50%, rgba(232,93,20,0.15) 0%, transparent 60%)",
          }}
        />
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-[#e85d14] text-sm font-semibold uppercase tracking-widest mb-4">
            <i className={`fas ${item.icon}`} />
            <span>UCJ Administration</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-[#e85d14]">{item.title}</span>
          </h1>
          <p className="text-white/70 text-base md:text-lg leading-relaxed mb-6">
            {item.subtitle}
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-white/50">
            <Link href="/" className="text-[#ff7a35] hover:text-white transition-colors">Home</Link>
            <i className="fas fa-chevron-right text-xs" />
            <Link href="/administration" className="text-[#ff7a35] hover:text-white transition-colors">Administration</Link>
            <i className="fas fa-chevron-right text-xs" />
            <span className="text-white/80">{item.title}</span>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-[#0a1931] to-[#122347] px-8 py-7 flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-[#e85d14]/20 border-2 border-[#e85d14]/40 flex items-center justify-center shrink-0">
              <i className={`fas ${item.icon} text-[#ff7a35] text-2xl`} />
            </div>
            <div>
              <h2 className="text-white font-bold text-2xl mb-1">{item.title}</h2>
              <p className="text-white/60 text-sm">{item.subtitle}</p>
            </div>
          </div>

          {/* Card Body */}
          <div className="bg-white px-8 py-8">
            {/* Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
              {item.info.map((i) => (
                <div key={i.label} className="bg-gray-50 rounded-xl p-4 border-l-[3px] border-[#e85d14]">
                  <div className="text-[10px] font-bold tracking-widest uppercase text-[#e85d14] mb-1">{i.label}</div>
                  <div className="text-sm font-medium text-gray-800">{i.value}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            <p className="text-gray-500 leading-relaxed text-sm mb-8">{item.description}</p>

            {/* Responsibilities */}
            <div className="mb-8">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#0f2a5e] mb-4">
                <i className="fas fa-tasks text-[#e85d14] mr-2" />Key Responsibilities
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {item.responsibilities.map((r) => (
                  <li key={r} className="flex items-start gap-2 text-gray-500 text-sm leading-relaxed">
                    <i className="fas fa-circle text-[#e85d14] text-[6px] mt-[6px] shrink-0" />{r}
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
            
              <Link
                href="/administration"
                className="inline-flex items-center gap-2 border border-[#0f2a5e]/30 hover:border-[#0f2a5e] text-[#0f2a5e] px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
              >
                <i className="fas fa-arrow-left" /> Back to Administration
              </Link>
            </div>
          </div>
        </div>

        {/* ── STAFF SECTION ── */}
        {staff.length > 0 && (
          <section className="mt-14">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-6 bg-[#e85d14] rounded-full" />
              <h3 className="text-xl font-bold text-[#0f2a5e]">Office Staff</h3>
              <span className="ml-auto text-xs font-semibold bg-[#e85d14]/10 text-[#e85d14] px-3 py-1 rounded-full">
                {staff.length} {staff.length === 1 ? "Member" : "Members"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {staff.map((s) => (
                <div
                  key={s.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Photo */}
                  <div className="bg-gradient-to-br from-[#0a1931] to-[#122347] h-56 w-full flex items-center justify-center relative p-3">
                    {s.photo ? (
                      <Image
                        src={s.photo}
                        alt={s.name}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-[#e85d14]/20 border-2 border-[#e85d14]/40 flex items-center justify-center">
                        <i className="fas fa-user text-[#e85d14] text-3xl" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h4 className="font-bold text-[#0f2a5e] text-base mb-0.5 truncate">{s.name}</h4>
                    <p className="text-[#e85d14] text-xs font-semibold mb-3 truncate">{s.position}</p>

                    <div className="space-y-1.5 text-xs text-gray-500">
                      {s.email && (
                        <div className="flex items-center gap-2">
                          <i className="fas fa-envelope text-[#e85d14] w-3 shrink-0" />
                          <a href={`mailto:${s.email}`} className="hover:text-[#e85d14] truncate transition-colors">
                            {s.email}
                          </a>
                        </div>
                      )}
                      {s.phone && (
                        <div className="flex items-center gap-2">
                          <i className="fas fa-phone text-[#e85d14] w-3 shrink-0" />
                          <a href={`tel:${s.phone}`} className="hover:text-[#e85d14] transition-colors">
                            {s.phone}
                          </a>
                        </div>
                      )}
                      {s.office && (
                        <div className="flex items-center gap-2">
                          <i className="fas fa-map-marker-alt text-[#e85d14] w-3 shrink-0" />
                          <span>{s.office}</span>
                        </div>
                      )}
                    </div>

                    {/* Social links */}
                    {(s.linkedin || s.research_gate || s.google_scholar) && (
                      <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                        {s.linkedin && (
                          <a href={s.linkedin} target="_blank" rel="noopener noreferrer"
                            className="w-7 h-7 rounded-full bg-[#0f2a5e]/10 hover:bg-[#0f2a5e] text-[#0f2a5e] hover:text-white flex items-center justify-center transition-colors text-xs">
                            <i className="fab fa-linkedin-in" />
                          </a>
                        )}
                        {s.research_gate && (
                          <a href={s.research_gate} target="_blank" rel="noopener noreferrer"
                            className="w-7 h-7 rounded-full bg-[#0f2a5e]/10 hover:bg-[#0f2a5e] text-[#0f2a5e] hover:text-white flex items-center justify-center transition-colors text-xs">
                            <i className="fab fa-researchgate" />
                          </a>
                        )}
                        {s.google_scholar && (
                          <a href={s.google_scholar} target="_blank" rel="noopener noreferrer"
                            className="w-7 h-7 rounded-full bg-[#0f2a5e]/10 hover:bg-[#0f2a5e] text-[#0f2a5e] hover:text-white flex items-center justify-center transition-colors text-xs">
                            <i className="fas fa-graduation-cap" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── FORMER DIRECTORS SECTION (director-office only) ── */}
        {slug === "director-office" && formerDirectors.length > 0 && (
          <section className="mt-14">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-6 bg-gray-300 rounded-full" />
              <h3 className="text-xl font-bold text-[#0f2a5e]">Former Directors</h3>
              <span className="ml-auto text-xs font-semibold bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
                {formerDirectors.length} {formerDirectors.length === 1 ? "Member" : "Members"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {formerDirectors.map((s) => {
                const formerPeriod = extractFormerPeriod(s.subcategory);
                return (
                  <div
                    key={s.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Photo */}
                    <div className="bg-gradient-to-br from-gray-500 to-gray-700 h-56 flex items-center justify-center relative p-3">
                      {s.photo ? (
                        <Image
                          src={s.photo}
                          alt={s.name}
                          fill
                          className="object-contain grayscale-[30%]"
                          sizes="(max-width: 768px) 100vw, 25vw"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center">
                          <i className="fas fa-user text-white/70 text-3xl" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <h4 className="font-bold text-[#0f2a5e] text-base mb-0.5 truncate">{s.name}</h4>
                      <p className="text-gray-400 text-xs font-semibold truncate">
                        {isFormerDirector(s) ? "Former Director" : "Former Acting Director / CEO"}
                      </p>
                      {formerPeriod && (
                        <p className="text-gray-400 text-[11px] font-medium mt-1 mb-3">{formerPeriod}</p>
                      )}

                      <div className="space-y-1.5 text-xs text-gray-500">
                        {s.email && (
                          <div className="flex items-center gap-2">
                            <i className="fas fa-envelope text-gray-400 w-3 shrink-0" />
                            <a href={`mailto:${s.email}`} className="hover:text-[#e85d14] truncate transition-colors">
                              {s.email}
                            </a>
                          </div>
                        )}
                        {s.phone && (
                          <div className="flex items-center gap-2">
                            <i className="fas fa-phone text-gray-400 w-3 shrink-0" />
                            <a href={`tel:${s.phone}`} className="hover:text-[#e85d14] transition-colors">
                              {s.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Contact Strip */}
        <section className="mt-12 bg-[#0f2a5e] rounded-2xl px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white text-center md:text-left">
            <div className="text-[#e85d14] text-xs font-semibold uppercase tracking-widest mb-2">
              <i className="fas fa-envelope mr-1" /> Get in Touch
            </div>
            <h3 className="text-2xl font-bold mb-2">Need Administrative<br />Assistance?</h3>
            <p className="text-white/60 text-sm">Mon – Fri, 8:30 AM – 4:00 PM.</p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-[#e85d14] hover:bg-[#c94e0f] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors">
              <i className="fas fa-paper-plane" /> Contact Us
            </Link>
            <a href="tel:+94212217791" className="inline-flex items-center gap-2 border border-white/30 hover:border-white text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors">
              <i className="fas fa-phone" /> Call Now
            </a>
          </div>
        </section>
      </main>
    </>
  );
}