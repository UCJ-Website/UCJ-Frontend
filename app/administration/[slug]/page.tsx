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
  positionKeyword: string;
}> = {
  "director-office": {
    icon: "fa-landmark",
    title: "Director Office",
    subtitle: "University of Jaffna — Strategic Leadership",
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
      "Liaison with University of Jaffna",
      "Community and stakeholder engagement",
    ],
    external_url: "https://www.jfn.ac.lk/unit/office-of-the-vice-chancellor/",
    external_label: "Visit University of Jaffna",
    positionKeyword: "Director",
  },
  "admin-office": {
    icon: "fa-pen-nib",
    title: "Admin Office",
    subtitle: "University of Jaffna — Administrative Operations",
    info: [
      { label: "Department", value: "Administrative Office" },
      { label: "Location", value: "No 29 Brown Road, Kokuvil East, Jaffna" },
      { label: "Office Hours", value: "Mon – Fri, 8:30 AM – 4:00 PM" },
      { label: "Email", value: "info@ucj.ac.lk" },
    ],
    description:
      "The Administrative Office manages the day-to-day operational backbone of University College of Jaffna. From maintaining official academic records and handling student admissions to managing documentation and institutional correspondence, the Admin Office ensures that all administrative processes run smoothly and in compliance with University of Jaffna regulations.",
    responsibilities: [
      "Academic records management",
      "Student admissions coordination",
      "Official correspondence handling",
      "Examination administration support",
      "Staff HR coordination",
      "Institutional documentation",
    ],
    external_url: "http://www.jfn.ac.lk/index.php/unit/office-of-the-registrar/",
    external_label: "Visit Registrar's Office",
    positionKeyword: "Admin Office",
  },
  "finance-accounts": {
    icon: "fa-coins",
    title: "Finance and Accounts",
    subtitle: "University of Jaffna — Financial Management",
    info: [
      { label: "Department", value: "Finance & Accounts" },
      { label: "Location", value: "No 29 Brown Road, Kokuvil East, Jaffna" },
      { label: "Office Hours", value: "Mon – Fri, 8:30 AM – 4:00 PM" },
      { label: "Contact", value: "+94 0212 217791" },
    ],
    description:
      "The Finance and Accounts division is responsible for all financial operations at University College of Jaffna. This includes budget planning, expenditure monitoring, fee collection, payroll, and financial reporting — all conducted in accordance with the financial regulations of the University of Jaffna and the Government of Sri Lanka.",
    responsibilities: [
      "Budget planning and allocation",
      "Student fee collection and records",
      "Payroll and staff remuneration",
      "Financial reporting and audits",
      "Procurement and asset management",
      "Grant and fund management",
    ],
    external_url: "https://jfn.ac.lk/office-of-the-bursar/",
    external_label: "Visit Bursar's Office",
    positionKeyword: "Finance",
  },
};

type Staff = {
  id: number;
  slug: string;
  name: string;
  position: string;
  category: string;
  subcategory: string;
  photo: string | null;
  email: string;
  phone: string | null;
  office: string | null;
  linkedin: string | null;
  research_gate: string | null;
  google_scholar: string | null;
  joined_date: string | null;
  departments: { id: number; name: string; short_code: string }[];
  units: { id: number; name: string; short_code: string }[];
};

async function getStaffForOffice(positionKeyword: string): Promise<Staff[]> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/staffs?per_page=100", {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    const all: Staff[] = json?.data?.staffs?.data ?? [];
    return all.filter((s) =>
      s.position.toLowerCase().includes(positionKeyword.toLowerCase())
    );
  } catch {
    return [];
  }
}

export default async function AdminSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = management[slug];
  if (!item) notFound();

  const staff = await getStaffForOffice(item.positionKeyword);

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
                  <div className="bg-gradient-to-br from-[#0a1931] to-[#122347] h-36 flex items-center justify-center relative">
                    {s.photo ? (
                      <Image
                        src={s.photo}
                        alt={s.name}
                        fill
                        className="object-cover object-top"
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