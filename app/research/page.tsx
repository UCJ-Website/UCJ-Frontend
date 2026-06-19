import Link from "next/link";

export default function ResearchPage() {
  return (
    <>
      {/* ===== HERO BANNER ===== */}
      <div
        className="relative text-center py-20 px-6 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f2a5e 0%, #1a4a8a 60%, #2563b0 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10">
          <div className="text-[13px] text-white/65 mb-3">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-1.5">›</span>
            <span className="text-white">Research</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-[12px] font-semibold px-4 py-1.5 rounded-full mb-5">
            <i className="fas fa-flask text-[#e85d14]"></i> Research &amp; Innovation
          </div>
          <h1 className="text-white font-bold mb-3" style={{ fontSize: "clamp(28px,5vw,44px)" }}>
            Advancing Knowledge, <span className="text-[#60a5fa]">Shaping the Future</span>
          </h1>
          <p className="text-white/75 text-[15px] max-w-[620px] mx-auto leading-[1.6]">
            University College of Jaffna fosters a culture of research and innovation —
            our faculty and students engage in cutting-edge work across multiple disciplines.
          </p>
        </div>
      </div>

      {/* ===== STATS STRIP ===== */}
      <div className="bg-[#0f2a5e] py-10 px-6">
        <div className="max-w-[1100px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { num: "50+", label: "Research Projects" },
            { num: "120+", label: "Publications" },
            { num: "30+", label: "Innovation Projects" },
            { num: "15+", label: "Industry Collaborations" },
          ].map((s) => (
            <div key={s.label} className="text-center border-l border-white/10 first:border-l-0">
              <div className="text-[32px] font-bold text-[#60a5fa]">{s.num}</div>
              <div className="text-white/60 text-[12px] mt-1 tracking-wide uppercase">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <main className="max-w-[1200px] mx-auto px-6 py-16">

        {/* ===== DISCIPLINES ===== */}
        <div className="text-[12px] font-semibold tracking-[0.1em] uppercase text-[#2563b0] mb-2 text-center">Focus Areas</div>
        <h2 className="font-bold text-[#0f2a5e] mb-10 text-center" style={{ fontSize: "clamp(22px,3vw,30px)" }}>
          Key Research <span className="text-[#2563b0]">Disciplines</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {[
            { icon: "fa-laptop-code", title: "ICT", desc: "Software engineering, AI, cybersecurity, data science." },
            { icon: "fa-heart-pulse", title: "Health & Sports", desc: "Human performance, physiotherapy, sports science." },
            { icon: "fa-briefcase", title: "Business", desc: "Entrepreneurship, management, socio-economic studies." },
            { icon: "fa-leaf", title: "Environment", desc: "Sustainability, green tech, environmental research." },
            { icon: "fa-people-group", title: "Social Studies", desc: "Peace building, reconciliation, community research." },
            { icon: "fa-graduation-cap", title: "Education", desc: "Curriculum development and digital learning." },
          ].map((d) => (
            <div
              key={d.title}
              className="bg-white rounded-[14px] border border-[#e5eaf3] p-6 flex flex-col gap-2.5 hover:shadow-[0_8px_28px_rgba(37,99,176,0.13)] hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="w-[46px] h-[46px] rounded-xl bg-[#eff6ff] text-[#2563b0] flex items-center justify-center text-[20px]">
                <i className={`fas ${d.icon}`}></i>
              </div>
              <div className="font-semibold text-[#0f2a5e] text-[15px] leading-[1.4]">{d.title}</div>
              <div className="text-[13px] text-[#6b7280] leading-[1.55]">{d.desc}</div>
            </div>
          ))}
        </div>

        {/* ===== HIGHLIGHTS ===== */}
        <div className="text-[12px] font-semibold tracking-[0.1em] uppercase text-[#2563b0] mb-2 text-center">Explore Further</div>
        <h2 className="font-bold text-[#0f2a5e] mb-10 text-center" style={{ fontSize: "clamp(22px,3vw,30px)" }}>
          Research <span className="text-[#2563b0]">Highlights</span>
        </h2>

        <div className="grid sm:grid-cols-2 gap-6">
          <Link
            href="/research/innovation-projects"
            className="group bg-white rounded-2xl border border-[#e5eaf3] p-7 flex flex-col gap-3 hover:shadow-[0_10px_30px_rgba(37,99,176,0.13)] hover:-translate-y-0.5 transition-all duration-200 no-underline text-inherit"
          >
            <div className="w-[50px] h-[50px] rounded-xl bg-[#eff6ff] text-[#2563b0] flex items-center justify-center text-[22px]">
              <i className="fas fa-lightbulb"></i>
            </div>
            <h3 className="font-semibold text-[#0f2a5e] text-[18px]">Innovation Projects</h3>
            <p className="text-[#6b7280] text-[14px] leading-[1.6]">
              Student and faculty innovation projects solving real-world problems.
            </p>
            <span className="text-[#2563b0] font-medium text-[13px] flex items-center gap-1.5 mt-2">
              Explore projects
              <i className="fas fa-arrow-right text-[11px] group-hover:translate-x-1 transition-transform"></i>
            </span>
          </Link>

          <Link
            href="/research/publications"
            className="group bg-white rounded-2xl border border-[#e5eaf3] p-7 flex flex-col gap-3 hover:shadow-[0_10px_30px_rgba(37,99,176,0.13)] hover:-translate-y-0.5 transition-all duration-200 no-underline text-inherit"
          >
            <div className="w-[50px] h-[50px] rounded-xl bg-[#f0fdf4] text-[#16a34a] flex items-center justify-center text-[22px]">
              <i className="fas fa-book-open"></i>
            </div>
            <h3 className="font-semibold text-[#0f2a5e] text-[18px]">Publications</h3>
            <p className="text-[#6b7280] text-[14px] leading-[1.6]">
              Journals, conference papers and research outputs from UCJ.
            </p>
            <span className="text-[#2563b0] font-medium text-[13px] flex items-center gap-1.5 mt-2">
              View publications
              <i className="fas fa-arrow-right text-[11px] group-hover:translate-x-1 transition-transform"></i>
            </span>
          </Link>
        </div>
      </main>
    </>
  );
}