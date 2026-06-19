import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface ManagementMember {
  slug: string;
  icon: string;
  title: string;
  sub: string;
  desc: string;
}

interface AdminService {
  slug: string;
  icon: string;
  title: string;
  desc: string;
}

async function getManagement(): Promise<ManagementMember[]> {
  try {
    const res = await fetch(`${API_BASE}/api/management`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data.data ?? [];
  } catch {
    return [];
  }
}

async function getAdminServices(): Promise<AdminService[]> {
  try {
    const res = await fetch(`${API_BASE}/api/admin-services`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data.data ?? [];
  } catch {
    return [];
  }
}

// Reusable empty-state block shown whenever a backend fetch
// returns no data (API down, no records, network error, etc.)
function EmptyState({
  icon = "fa-circle-info",
  title = "No data found",
  desc = "We couldn't find anything to show here right now. Please check back later.",
}: {
  icon?: string;
  title?: string;
  desc?: string;
}) {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center py-14 px-6 bg-white rounded-2xl border border-dashed border-gray-200">
      <div className="w-[54px] h-[54px] rounded-full bg-[#2563b0]/10 text-[#2563b0] flex items-center justify-center text-[22px] mb-4">
        <i className={`fas ${icon}`}></i>
      </div>
      <div className="font-semibold text-[#0f2a5e] text-[15px] mb-1.5">{title}</div>
      <div className="text-gray-500 text-[13px] leading-[1.55] max-w-[360px]">{desc}</div>
    </div>
  );
}

export default async function AdministrationPage() {
  const [management, services] = await Promise.all([getManagement(), getAdminServices()]);

  return (
    <>
      {/* ===== HERO BANNER ===== */}
      <div className="relative bg-[#0a1628] text-white py-20 px-6 text-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #2563b0 0%, transparent 50%), radial-gradient(circle at 80% 20%, #e85d14 0%, transparent 40%)",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-[#e85d14] text-sm font-semibold uppercase tracking-widest mb-4">
            <i className="fas fa-landmark" />
            <span>UCJ Administration</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-[Playfair_Display]">
            University <span className="text-[#e85d14]">Administration</span>
          </h1>
          <p className="text-white/70 text-base md:text-lg leading-relaxed mb-6">
            The administrative backbone that supports academic excellence and
            institutional growth at University College of Jaffna.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-white/50">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <i className="fas fa-chevron-right text-xs" />
            <span className="text-white/80">Administration</span>
          </div>
        </div>
      </div>

      <main className="max-w-[1200px] mx-auto px-6 py-16 space-y-20">

        {/* ① SENIOR MANAGEMENT */}
        <section>
          <div className="text-center mb-12">
            <div className="text-[12px] font-semibold tracking-[0.1em] uppercase text-[#2563b0] mb-2">
              <i className="fas fa-user-tie mr-1" /> Leadership
            </div>
            <h2 className="font-bold text-[#0f2a5e] mb-4" style={{ fontSize: "clamp(22px,3vw,30px)" }}>
              Senior <span className="text-[#2563b0]">Management</span>
            </h2>
            <div className="w-12 h-1 bg-[#e85d14] mx-auto rounded-full mb-4" />
            <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
              The senior leadership team of University College of Jaffna,
              operating under the University of Jaffna, provides strategic
              direction and academic governance.
            </p>
          </div>

          {management.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {management.map((card) => (
                <div key={card.slug} className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  <div className="bg-[#0f2a5e] text-white text-center py-8 px-6">
                    <div className="w-14 h-14 rounded-full bg-[#e85d14]/20 flex items-center justify-center mx-auto mb-3">
                      <i className={`fas ${card.icon} text-[#e85d14] text-xl`} />
                    </div>
                    <h3 className="font-bold text-lg mb-1">{card.title}</h3>
                    <p className="text-white/60 text-sm">{card.sub}</p>
                  </div>
                  <div className="bg-white px-6 py-5 flex flex-col gap-4 flex-1">
                    <p className="text-gray-500 text-sm leading-relaxed">{card.desc}</p>
                    <Link
                      href={`/management/${card.slug}`}
                      className="inline-flex items-center gap-1.5 text-[#2563b0] font-semibold text-sm hover:text-[#e85d14] transition-colors mt-auto"
                    >
                      Visit <i className="fas fa-external-link-alt text-xs" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="fa-user-tie"
              title="No management members found"
              desc="We couldn't load the senior management information right now. Please refresh the page or check back later."
            />
          )}
        </section>

        {/* ② STUDENT SERVICES */}
        <section>
          <div className="text-center mb-10">
            <div className="text-[12px] font-semibold tracking-[0.1em] uppercase text-[#2563b0] mb-2">
              <i className="fas fa-sitemap mr-1" /> Administrative Units
            </div>
            <h2 className="font-bold text-[#0f2a5e] mb-4" style={{ fontSize: "clamp(22px,3vw,30px)" }}>
              Student <span className="text-[#2563b0]">Services</span>
            </h2>
            <div className="w-12 h-1 bg-[#e85d14] mx-auto rounded-full mb-4" />
            <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
              Administrative departments that support the day-to-day operations,
              academic management, and institutional development of UCJ.
            </p>
          </div>

          {services.length > 0 ? (
            <div className="flex flex-col gap-4 max-w-2xl mx-auto">
              {services.map((item) => (
                <Link
                  key={item.slug}
                  href={`/services/${item.slug}`}
                  className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl px-5 py-4 shadow-sm hover:shadow-md hover:border-[#2563b0]/30 transition-all group"
                >
                  <div className="w-11 h-11 rounded-full bg-[#2563b0]/10 flex items-center justify-center shrink-0 group-hover:bg-[#2563b0] transition-colors">
                    <i className={`fas ${item.icon} text-[#2563b0] group-hover:text-white transition-colors`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#0f2a5e] mb-0.5">{item.title}</h4>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                  </div>
                  <i className="fas fa-arrow-right text-gray-300 group-hover:text-[#e85d14] transition-colors" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <EmptyState
                icon="fa-sitemap"
                title="No administrative services found"
                desc="We couldn't find any student services or administrative units to display right now."
              />
            </div>
          )}
        </section>

        {/* ③ CONTACT STRIP */}
        <section className="bg-[#0f2a5e] rounded-2xl px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white text-center md:text-left">
            <div className="text-[#e85d14] text-xs font-semibold uppercase tracking-widest mb-2">
              <i className="fas fa-envelope mr-1" /> Get in Touch
            </div>
            <h3 className="text-2xl font-bold mb-2">
              Need Administrative<br />Assistance?
            </h3>
            <p className="text-white/60 text-sm">
              Our admin team is available Monday to Friday, 8:30 AM – 4:00 PM.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#e85d14] hover:bg-[#c94e0f] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
            >
              <i className="fas fa-paper-plane" /> Contact Us
            </Link>
            <a 
              href="tel:+94212217791"
              className="inline-flex items-center gap-2 border border-white/30 hover:border-white text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
            >
              <i className="fas fa-phone" /> Call Now
            </a>
          </div>
        </section>
      </main>
    </>
  );
}