import Link from "next/link";

const management = [
  {
    slug: "director-office",
    icon: "fa-landmark",
    title: "Director Office",
    sub: "University of Jaffna",
    desc: "The Vice-Chancellor oversees the academic and administrative affairs of the university, ensuring the highest standards of education and governance.",
  },
  {
    slug: "admin-office",
    icon: "fa-pen-nib",
    title: "Admin Office",
    sub: "University of Jaffna",
    desc: "The Registrar manages all academic records, student admissions, examinations, and official university documentation and correspondence.",
  },
  {
    slug: "finance-accounts",
    icon: "fa-coins",
    title: "Finance and Accounts",
    sub: "University of Jaffna",
    desc: "The Bursar is responsible for the financial management, budgeting, and accounting operations of the university institution.",
  },
];

const services = [
  {
    slug: "admissions",
    icon: "fa-door-open",
    title: "Admissions",
    desc: "Handles student intake, application processing, and enrolment coordination.",
  },
  {
    slug: "examinations",
    icon: "fa-clipboard-list",
    title: "Examinations",
    desc: "Coordinates institutional services, facilities management, and daily administrative operations.",
  },
];

export default function AdministrationPage() {
  return (
    <>
      {/* HERO */}
      <div className="relative bg-[#0a1628] text-white py-14 px-6 text-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #2563b0 0%, transparent 50%), radial-gradient(circle at 80% 20%, #e85d14 0%, transparent 40%)",
          }}
        />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            University <span className="text-[#e85d14]">Administration</span>
          </h1>
          <p className="text-white/60 text-sm mb-4">
            The administrative backbone that supports academic excellence at UCJ.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-white/40">
            <Link href="/" className="text-[#ff7a35] hover:text-white transition-colors">Home</Link>
            <i className="fas fa-chevron-right text-xs" />
            <span className="text-white/70">Administration</span>
          </div>
        </div>
      </div>

      <main className="max-w-[1200px] mx-auto px-6 py-10 space-y-12">

        {/* SENIOR MANAGEMENT */}
        <section>
          <div className="text-center mb-8">
            <h2 className="font-bold text-[#0f2a5e] mb-2" style={{ fontSize: "clamp(20px,3vw,28px)" }}>
              Senior <span className="text-[#e85d14]">Management</span>
            </h2>
            <div className="w-10 h-1 bg-[#e85d14] mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {management.map((card) => (
              <div
                key={card.slug}
                className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="bg-[#0f2a5e] text-white text-center py-6 px-5">
                  <div className="w-12 h-12 rounded-full bg-[#e85d14]/20 flex items-center justify-center mx-auto mb-2">
                    <i className={`fas ${card.icon} text-[#e85d14] text-lg`} />
                  </div>
                  <h3 className="font-bold text-base mb-0.5">{card.title}</h3>
                  <p className="text-white/50 text-xs">{card.sub}</p>
                </div>
                <div className="bg-white px-5 py-4 flex flex-col gap-3 flex-1">
                  <p className="text-gray-500 text-sm leading-relaxed">{card.desc}</p>
                  <Link
                    href={`/administration/${card.slug}`}
                    className="inline-flex items-center gap-1.5 text-[#e85d14] font-semibold text-sm hover:text-[#c94e0f] transition-colors mt-auto"
                  >
                    Learn more <i className="fas fa-arrow-right text-xs" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* STUDENT SERVICES */}
        <section>
          <div className="text-center mb-8">
            <h2 className="font-bold text-[#0f2a5e] mb-2" style={{ fontSize: "clamp(20px,3vw,28px)" }}>
              Student <span className="text-[#e85d14]">Services</span>
            </h2>
            <div className="w-10 h-1 bg-[#e85d14] mx-auto rounded-full" />
          </div>

          <div className="flex flex-col gap-3 max-w-2xl mx-auto">
            {services.map((item) => (
              <Link
                key={item.slug}
                href={`/student-services/${item.slug}`}
                className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl px-5 py-4 shadow-sm hover:shadow-md hover:border-[#e85d14]/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-[#e85d14]/10 flex items-center justify-center shrink-0 group-hover:bg-[#e85d14] transition-colors">
                  <i className={`fas ${item.icon} text-[#e85d14] group-hover:text-white transition-colors text-sm`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[#0f2a5e] text-sm mb-0.5">{item.title}</h4>
                  <p className="text-gray-400 text-xs">{item.desc}</p>
                </div>
                <i className="fas fa-arrow-right text-gray-300 group-hover:text-[#e85d14] transition-colors text-sm" />
              </Link>
            ))}
          </div>
        </section>

        {/* CONTACT STRIP */}
        <section className="bg-[#0f2a5e] rounded-2xl px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="text-white text-center md:text-left">
            <h3 className="text-xl font-bold mb-1">Need Administrative Assistance?</h3>
            <p className="text-white/50 text-sm">Mon – Fri, 8:30 AM – 4:00 PM.</p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#e85d14] hover:bg-[#c94e0f] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
            >
              <i className="fas fa-paper-plane" /> Contact Us
            </Link>
            <a
              href="tel:+94212217791"
              className="inline-flex items-center gap-2 border border-white/30 hover:border-white text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
            >
              <i className="fas fa-phone" /> Call Now
            </a>
          </div>
        </section>

      </main>
    </>
  );
}