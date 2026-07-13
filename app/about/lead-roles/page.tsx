import Link from "next/link";
import Image from "next/image";

const RAW_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";
const ORIGIN = RAW_BASE.replace(/\/api\/?$/, "");
const API_URL = `${ORIGIN}/api`;

function resolveImage(path: string | null | undefined): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${ORIGIN}/${path.replace(/^\/+/, "")}`;
}

type Department = {
  id: number;
  name: string;
  short_code: string;
  role_type?: string | null;
};

type Unit = {
  id: number;
  name: string;
  short_code: string;
  role_type?: string | null;
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
  departments: Department[];
  units?: Unit[];
};

type SectionConfig = {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  icon: string;
  match: (staff: Staff) => boolean;
};

function normalize(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function containsFormerDirector(staff: Staff): boolean {
  const position = normalize(staff.position);
  const subcategory = normalize(staff.subcategory);

  return (
    position.includes("former director") ||
    subcategory.includes("former director") ||
    subcategory.includes("former acting director")
  );
}

function isCurrentDirector(staff: Staff): boolean {
  const position = normalize(staff.position);
  const subcategorySegments = normalize(staff.subcategory)
    .split(";")
    .map((segment) => segment.trim())
    .filter(Boolean);

  const hasUcjDirectorSubcategory = subcategorySegments.some(
    (segment) =>
      segment === "director" ||
      segment.startsWith("director / ceo") ||
      segment.startsWith("director/ceo"),
  );

  const hasUcjDirectorPosition =
    position.includes("director / ceo") ||
    position.includes("director/ceo") ||
    position.includes("ceo/director") ||
    position.includes("ceo / director");

  return (
    (hasUcjDirectorSubcategory || hasUcjDirectorPosition) &&
    !containsFormerDirector(staff)
  );
}

function extractServicePeriod(subcategory: string | null): string | null {
  if (!subcategory) return null;

  const match = subcategory.match(
    /([A-Za-z]{3,9}\s+\d{4}|\d{1,2}-\d{1,2}-\d{4}|\d{4})\s*-\s*([A-Za-z]{3,9}\s+\d{4}|\d{1,2}-\d{1,2}-\d{4}|\d{4})/,
  );

  return match ? `${match[1]} – ${match[2]}` : null;
}

async function fetchAllStaff(): Promise<Staff[]> {
  try {
    const allStaff: Staff[] = [];
    let page = 1;
    let lastPage = 1;

    do {
      const response = await fetch(`${API_URL}/staffs?page=${page}`, {
        cache: "no-store",
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Staff request failed with status ${response.status}`);
      }

      const json = await response.json();
      const pageData: Staff[] =
        json?.data?.staffs?.data ?? json?.data?.staffs ?? json?.data ?? [];

      if (Array.isArray(pageData)) allStaff.push(...pageData);

      lastPage =
        Number(json?.data?.staffs?.last_page) ||
        Number(json?.data?.last_page) ||
        1;

      page += 1;
    } while (page <= lastPage);

    return Array.from(new Map(allStaff.map((staff) => [staff.id, staff])).values());
  } catch (error) {
    console.error("fetchAllStaff failed:", error);
    return [];
  }
}

const sections: SectionConfig[] = [
  {
    id: "director",
    title: "Director",
    subtitle: "Executive Leadership",
    icon: "fa-landmark",
    description:
      "The Director provides strategic academic and administrative leadership for the University College of Jaffna.",
    match: (staff) => isCurrentDirector(staff),
  },
  {
    id: "former-director",
    title: "Former Directors",
    subtitle: "Legacy of Leadership",
    icon: "fa-history",
    description:
      "We honour the former Directors and Acting Directors whose service has contributed to the development of the institution.",
    match: (staff) => containsFormerDirector(staff),
  },
  {
    id: "head-of-academic-division",
    title: "Head of Academic Division",
    subtitle: "Academic Leadership",
    icon: "fa-graduation-cap",
    description:
      "The Head of Academic Division coordinates academic programmes, staff collaboration, quality assurance, and institutional academic development.",
    match: (staff) =>
      normalize(staff.subcategory).includes("head of academic division") ||
      normalize(staff.position).includes("head of academic division"),
  },
  {
    id: "administration",
    title: "Administration",
    subtitle: "Assistant Registrar & General Office",
    icon: "fa-pen-nib",
    match: (staff) => normalize(staff.position) === "assistant registrar",
  },
  {
    id: "finance",
    title: "Finance",
    subtitle: "Assistant Bursar Office",
    icon: "fa-coins",
    match: (staff) => normalize(staff.position) === "assistant bursar",
  },
  {
    id: "library",
    title: "Library",
    subtitle: "Assistant Librarian Office",
    icon: "fa-book-open",
    match: (staff) => normalize(staff.position) === "assistant librarian",
  },
];

export default async function PeopleLeadershipPage() {
  const staff = await fetchAllStaff();

  const groupedSections = sections.map((section) => ({
    ...section,
    people: staff.filter(section.match).sort((a, b) => a.name.localeCompare(b.name)),
  }));

  return (
    <>
      <section className="relative overflow-hidden bg-[#0a1628] px-6 py-16 text-center text-white">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(232,93,20,0.45) 1.5px, transparent 1.5px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-3xl">
          
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Leadership &amp; Administration
          </h1>

          <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/65 md:text-lg">
            Meet the leadership, divisions, and senior administrative officers serving the University College of Jaffna.
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-white/40">
            <Link href="/" className="transition-colors hover:text-[#e85d14]">Home</Link>
            <i className="fas fa-chevron-right text-xs" />
            <span className="text-white/70">People</span>
          </div>
        </div>
      </section>

      <main className="bg-[#f8f9fc] px-4 py-14">
        <div className="mx-auto max-w-7xl space-y-16">
          {groupedSections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-28">
              <div className="mb-7 rounded-2xl border border-gray-100 bg-white px-6 py-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#e85d14]/20 bg-[#e85d14]/10">
                    <i className={`fas ${section.icon} text-lg text-[#e85d14]`} />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-bold text-[#0f2a5e]">{section.title}</h2>
                      <span className="rounded-full bg-[#e85d14]/10 px-3 py-1 text-xs font-semibold text-[#e85d14]">
                        {section.people.length} {section.people.length === 1 ? "Member" : "Members"}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-[#e85d14]">{section.subtitle}</p>
                    {section.description && (
                      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-500">{section.description}</p>
                    )}
                  </div>
                </div>
              </div>

              {section.people.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {section.people.map((person) => {
                    const servicePeriod = extractServicePeriod(person.subcategory);
                    const photo = resolveImage(person.photo);

                    return (
                      <Link
                        key={`${section.id}-${person.id}`}
                        href={`/staff/${person.slug}`}
                        className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                      >
                        <div className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-br from-[#0a1931] to-[#122347]">
                          {photo ? (
                            <Image
                              src={photo}
                              alt={person.name}
                              fill
                              className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#e85d14]/40 bg-[#e85d14]/20">
                                <i className="fas fa-user text-lg text-[#e85d14]" />
                              </div>
                            </div>
                          )}

                          <div className="absolute inset-0 flex items-center justify-center bg-[#0a1628]/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <span className="rounded-full bg-[#e85d14] px-3 py-1.5 text-[10px] font-semibold text-white">View Profile</span>
                          </div>
                        </div>

                        <div className="p-3 text-center">
                          <h3 className="mb-0.5 text-xs font-bold leading-snug text-[#0f2a5e]">{person.name}</h3>
                          <p className="text-[11px] font-semibold text-[#e85d14]">{person.position}</p>

                          {servicePeriod && (
                            <p className="mt-1.5 text-[10px] font-medium text-gray-400">{servicePeriod}</p>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-12 text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                    <i className={`fas ${section.icon} text-xl text-gray-300`} />
                  </div>
                  <p className="text-sm text-gray-400">No records found for {section.title}.</p>
                </div>
              )}
            </section>
          ))}

          <div className="flex justify-center pt-2">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-xl border border-[#0f2a5e]/30 px-6 py-3 text-sm font-semibold text-[#0f2a5e] transition-colors hover:border-[#0f2a5e]"
            >
              <i className="fas fa-arrow-left" /> Back to About
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}