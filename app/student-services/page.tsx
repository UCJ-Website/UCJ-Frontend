import Link from "next/link";

const services = [
  {
    slug: "admissions",
    icon: "fa-door-open",
    title: "Admissions",
    subtitle: "University College of Jaffna — Student Intake & Enrolment",
    info: [
      { label: "Office", value: "Admissions Unit, UCJ" },
      { label: "Location", value: "No 29 Brown Road, Kokuvil East, Jaffna" },
      { label: "Office Hours", value: "Mon – Fri, 8:30 AM – 4:00 PM" },
      { label: "Contact", value: "+94 0212 217791" },
    ],
    description:
      "The Admissions unit at University College of Jaffna manages the full student intake process — from receiving applications and verifying eligibility to registering successful candidates and coordinating orientation. Whether you're applying for an HND programme or a general certificate course, the Admissions team is your first point of contact.",
    processTitle: "Admission Process",
    steps: [
      { num: 1, title: "Apply Online / In-Person", desc: "Submit your application form with required documents" },
      { num: 2, title: "Document Verification", desc: "Academic certificates and ID documents are reviewed" },
      { num: 3, title: "Selection & Offer", desc: "Eligible candidates receive an admission offer letter" },
      { num: 4, title: "Enrolment & Orientation", desc: "Complete registration and attend the induction programme" },
    ],
    responsibilities: [
      "Application processing and review",
      "Eligibility and document verification",
      "Student registration and ID issuance",
      "Intake coordination with departments",
      "Orientation programme management",
      "Scholarship and bursary guidance",
    ],
    external_url: "https://www.jfn.ac.lk/index.php/unit/admissions/",
    external_label: "Visit UoJ Admissions",
  },
  {
    slug: "examinations",
    icon: "fa-clipboard-list",
    title: "Examinations",
    subtitle: "University College of Jaffna — Academic Assessment & Results",
    info: [
      { label: "Office", value: "Examinations Unit, UCJ" },
      { label: "Location", value: "No 29 Brown Road, Kokuvil East, Jaffna" },
      { label: "Office Hours", value: "Mon – Fri, 8:30 AM – 4:00 PM" },
      { label: "Email", value: "info@ucj.ac.lk" },
    ],
    description:
      "The Examinations unit at UCJ oversees the planning, scheduling, and conduct of all academic assessments. From semester exams and practical evaluations to supplementary sittings and result publications, this unit ensures that examinations are conducted fairly and transparently in accordance with University of Jaffna regulations and TVEC guidelines.",
    processTitle: "Examination Process",
    steps: [
      { num: 1, title: "Registration", desc: "Students register for exams within the given deadline" },
      { num: 2, title: "Hall Ticket Issued", desc: "Admit cards issued after fees and registration confirmed" },
      { num: 3, title: "Examination Held", desc: "Written and practical exams conducted as scheduled" },
      { num: 4, title: "Results Published", desc: "Results released and certificates issued after verification" },
    ],
    responsibilities: [
      "Exam timetable planning and publishing",
      "Hall ticket and admit card issuance",
      "Invigilation and exam hall management",
      "Answer script handling and marking",
      "Results processing and publication",
      "Supplementary exam coordination",
    ],
    external_url: "https://www.jfn.ac.lk/index.php/unit/general-administration/",
    external_label: "Visit UoJ Examinations",
  },
];

export default function StudentServicesPage() {
  return (
    <>
      {/* HERO */}
      <div className="relative bg-[#0a1628] text-white py-20 px-6 text-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 30% 50%, rgba(232,93,20,0.15) 0%, transparent 60%)",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-[#e85d14] text-sm font-semibold uppercase tracking-widest mb-4">
            <i className="fas fa-user-graduate" />
            <span>UCJ Administration</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-[Playfair_Display]">
            Student <span className="text-[#e85d14]">Services</span>
          </h1>
          <p className="text-white/70 text-base md:text-lg leading-relaxed mb-6">
            Everything you need to know about admissions and examinations at University College of Jaffna.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-white/50">
            <Link href="/" className="text-[#ff7a35] hover:text-white transition-colors">Home</Link>
            <i className="fas fa-chevron-right text-xs" />
            <Link href="/administration" className="text-[#ff7a35] hover:text-white transition-colors">Administration</Link>
            <i className="fas fa-chevron-right text-xs" />
            <span className="text-white/80">Student Services</span>
          </div>
        </div>
      </div>

      <main className="max-w-[1100px] mx-auto px-6 py-16">
        {/* Section Head */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#e85d14]/10 text-[#e85d14] border border-[#e85d14]/20 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase mb-4">
            <i className="fas fa-sitemap" /> Administrative Units
          </div>
          <h2 className="font-bold text-[#0f2a5e] mb-3" style={{ fontSize: "clamp(22px,3vw,30px)" }}>
            Admissions &amp; <span className="text-[#e85d14]">Examinations</span>
          </h2>
          <div className="w-12 h-1 bg-[#e85d14] mx-auto rounded-full mb-4" />
          <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
            Two core units that support every stage of your academic journey — from joining UCJ to completing your qualifications.
          </p>
        </div>

        <div className="flex flex-col gap-10">
          {services.map((item) => (
            <div key={item.slug} className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-[#0a1931] to-[#122347] px-8 py-7 flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-[#e85d14]/20 border-2 border-[#e85d14]/40 flex items-center justify-center shrink-0">
                  <i className={`fas ${item.icon} text-[#ff7a35] text-2xl`} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl mb-1 font-[Playfair_Display]">{item.title}</h3>
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
                <p className="text-gray-500 leading-relaxed text-sm mb-7">{item.description}</p>

                {/* Process Steps */}
                <div className="mb-7">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#0f2a5e] mb-5">
                    <i className="fas fa-route text-[#e85d14] mr-2" />{item.processTitle}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {item.steps.map((step) => (
                      <div key={step.num} className="bg-gray-50 rounded-xl p-5 text-center">
                        <div className="w-9 h-9 rounded-full bg-[#e85d14] text-white text-sm font-bold flex items-center justify-center mx-auto mb-3">
                          {step.num}
                        </div>
                        <h5 className="font-semibold text-[#0f2a5e] text-sm mb-1.5">{step.title}</h5>
                        <p className="text-gray-400 text-xs leading-relaxed">{step.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Responsibilities */}
                <div className="mb-7">
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

                {/* External Link */}
                <a
                  href={item.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#e85d14] hover:bg-[#c94e0f] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
                >
                  <i className="fas fa-external-link-alt" /> {item.external_label}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Strip */}
        <section className="mt-16 bg-[#0f2a5e] rounded-2xl px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white text-center md:text-left">
            <div className="text-[#e85d14] text-xs font-semibold uppercase tracking-widest mb-2">
              <i className="fas fa-envelope mr-1" /> Get in Touch
            </div>
            <h3 className="text-2xl font-bold mb-2">Have Questions About<br />Admissions or Exams?</h3>
            <p className="text-white/60 text-sm">Our team is available Monday to Friday, 8:30 AM – 4:00 PM.</p>
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