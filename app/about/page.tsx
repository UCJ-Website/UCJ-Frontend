import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Poppins:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ucj-fade-1 { animation: fadeUp 0.8s ease both; }
        .ucj-fade-2 { animation: fadeUp 0.9s 0.2s ease both; }

        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-poppins { font-family: 'Poppins', sans-serif; }

        .ucj-fac-card {
          border-bottom: 3px solid transparent;
          transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .ucj-fac-card:hover {
          border-bottom-color: #e85d14;
          transform: translateY(-4px);
          box-shadow: 0 8px 32px rgba(15, 28, 46, 0.12);
        }
      `}</style>

      {/* ===== HERO BANNER ===== */}
      <div
        className="ucj-fade-1 relative flex items-center justify-center text-center overflow-hidden px-5"
        style={{
          background:
            "linear-gradient(135deg, #0f1c2e 0%, #1a3a5c 60%, #e85d14 120%)",
          minHeight: "300px",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <div className="relative z-10 px-5">
          <h1
            className="font-poppins text-white leading-tight"
            style={{ fontSize: "clamp(1.8rem, 5vw, 3rem)" }}
          >
            About <span className="text-[#e85d14]">College</span>
          </h1>
          <p className="mt-[10px] text-base text-[#aac4df] font-light italic">
            Journey of a thousand miles begins here with your single step today
          </p>
        </div>
        <div className="absolute left-1/2 bottom-4 -translate-x-1/2 flex gap-2 text-xs text-[#aac4df] whitespace-nowrap">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#e85d14]">About</span>
        </div>
      </div>

      {/* ===== ABOUT INTRO ===== */}
      <section className="bg-[#f0f4f8] py-[72px] px-6">
        <div className="max-w-[1100px] mx-auto">
          <h2
            className="font-poppins text-center text-[#2c3e50] leading-snug mb-3"
            style={{ fontSize: "clamp(1.4rem, 4vw, 2.4rem)" }}
          >
            Welcome to the{" "}
            <span className="text-[#e85d14]">University College of Jaffna</span>
          </h2>
          <div className="w-[60px] h-1 bg-[#e85d14] rounded-sm mx-auto mt-3" />
          <p className="text-center text-[#607080] text-[0.95rem] max-w-[600px] mx-auto mt-4 mb-12">
            Empowering students with quality technical and vocational education
            since 2014.
          </p>

          <div className="ucj-fade-2 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image side */}
            <div
              className="relative flex items-center justify-center rounded-2xl overflow-hidden bg-gradient-to-br from-[#0f1c2e] to-[#1a2f4a]"
              style={{ aspectRatio: "4 / 3" }}
            >
              <div className="text-center text-[#6a8aaa]">
                <img
                  src="/assets/backgroundimg/a.png"
                  alt="UCJ Logo"
                  className="w-full max-w-[260px] h-auto object-contain rounded-xl mx-auto"
                />
                <p className="text-[0.85rem] mt-2 opacity-80">
                  University College of Jaffna
                </p>
              </div>
              <div className="absolute bottom-[-1px] left-[-1px] bg-[#e85d14] text-white px-5 py-[10px] rounded-tr-2xl rounded-bl-2xl font-bold text-[0.85rem]">
                Est. 2014
              </div>
            </div>

            {/* Text side */}
            <div>
              <h3
                className="font-playfair text-[#2c3e50] leading-snug mb-4"
                style={{ fontSize: "clamp(1.2rem, 3vw, 1.7rem)" }}
              >
                Shaping the <span className="text-[#e85d14]">Future</span> of
                Technical Education
              </h3>
              <div className="flex flex-col gap-[14px]">
                <p className="text-[#607080] leading-[1.8] text-[0.95rem]">
                  The University College of Jaffna was established in 2014 under the
                  University of Vocational Technology Act No. 31 of 2008, which
                  provides legal provision to establish University Colleges.
                </p>
                <p className="text-[#607080] leading-[1.8] text-[0.95rem]">
                  It operates under 'University College' Ordinance, No. 1 of 2014,
                  of the University of Vocational Technology. Accordingly, the
                  University College of Jaffna operates as an autonomous body with
                  administration and financial powers.
                </p>
                <p className="text-[#607080] leading-[1.8] text-[0.95rem]">
                  We offer National Diploma (NVQ Level 5) and Higher National
                  Diploma (NVQ Level 6) courses leading to a degree offered by the UNIVOTEC.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-5">
                {["NVQ Level 5", "NVQ Level 6", "UNIVOTEC Affiliated", "Autonomous Body"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="bg-white border-[1.5px] border-[#dce5ef] text-[#1a2f4a] text-[0.78rem] font-semibold px-[14px] py-[5px] rounded-full"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HISTORY ===== */}
      <section className="bg-[#0f1c2e] py-[72px] px-6">
        <div className="max-w-[1100px] mx-auto">
          <h2
            className="font-poppins text-center text-white leading-snug mb-3"
            style={{ fontSize: "clamp(1.4rem, 4vw, 2.4rem)" }}
          >
            <span className="text-[#e85d14]">History</span>
          </h2>
          <div className="w-[60px] h-1 bg-[#e85d14] rounded-sm mx-auto mt-3" />
          <p className="text-center text-[#7a9ab8] text-[0.95rem] max-w-[600px] mx-auto mt-4 mb-12">
            Our roots and the foundation that built us.
          </p>
          <div className="flex flex-col gap-[14px] bg-[#1a2f4a] rounded-2xl p-10 border-l-[5px] border-[#e85d14] mt-6">
            <p className="text-[#b0c8e0] leading-[1.9] text-[0.95rem]">
              The University College of Jaffna was established in 2014 under the
              University of Vocational Technology Act No. 31 of 2008, which
              provides legal provision to establish University Colleges and
              operates under 'University College' Ordinance, No. 1 of 2014, of the
              University of Vocational Technology.
            </p>
            <p className="text-[#b0c8e0] leading-[1.9] text-[0.95rem]">
              Accordingly, the University College of Jaffna operates as an
              autonomous body with administration and financial powers.
            </p>
            <p className="text-[#b0c8e0] leading-[1.9] text-[0.95rem] mb-0">
              The University College of Jaffna offers National Diploma (NVQ Level
              5) and Higher National Diploma (NVQ Level 6) courses leading to a
              degree offered by the UNIVOTEC. This will facilitate to produce
              middle level technical personnel and supervisory level personnel in
              technology related areas.
            </p>
          </div>
        </div>
      </section>

      {/* ===== VISION & MISSION ===== */}
      <section className="bg-white py-[72px] px-6">
        <div className="max-w-[1100px] mx-auto">
          <h2
            className="font-poppins text-center text-[#2c3e50] leading-snug mb-3"
            style={{ fontSize: "clamp(1.4rem, 4vw, 2.4rem)" }}
          >
            Vision &amp; <span className="text-[#e85d14]">Mission</span>
          </h2>
          <div className="w-[60px] h-1 bg-[#e85d14] rounded-sm mx-auto mt-3" />
          <p className="text-center text-[#607080] text-[0.95rem] max-w-[600px] mx-auto mt-4 mb-12">
            The principles and goals that drive everything we do.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {[
              {
                icon: "🎯",
                label: "VISION",
                text: "Be the market leader in the vocational training sector in Northern Province, delivering world-class technical education that transforms lives and communities.",
              },
              {
                icon: "🚀",
                label: "MISSION",
                text: "Produce skilled and competent youth force to meet the industry requirements and support the community through the continuous engagements and industrial innovation.",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="relative bg-[#0f1c2e] rounded-2xl p-9 overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-[#e85d14]" />
                <div className="absolute top-7 right-7 text-2xl opacity-15">
                  {item.icon}
                </div>
                <div className="font-playfair text-[1.3rem] font-extrabold text-[#e85d14] tracking-[0.05em] mb-[14px]">
                  {item.label}
                </div>
                <p className="text-[#b0c8e0] leading-[1.8] text-[0.95rem]">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FACILITIES ===== */}
      <section className="bg-[#f0f4f8] py-[72px] px-6">
        <div className="max-w-[1100px] mx-auto">
          <h2
            className="font-poppins text-center text-[#2c3e50] leading-snug mb-3"
            style={{ fontSize: "clamp(1.4rem, 4vw, 2.4rem)" }}
          >
            Facilities &amp; <span className="text-[#e85d14]">Infrastructure</span>
          </h2>
          <div className="w-[60px] h-1 bg-[#e85d14] rounded-sm mx-auto mt-3" />
          <p className="text-center text-[#607080] text-[0.95rem] max-w-[600px] mx-auto mt-4 mb-12">
            State-of-the-art facilities built to support modern technical learning.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: "💻", title: "Computer Labs", desc: "Modern computer labs with latest technology and software for hands-on learning." },
              { icon: "🔧", title: "Workshop", desc: "Well-equipped workshops for practical training and real-world skill development." },
              { icon: "📚", title: "Library", desc: "Extensive collection of books and digital resources to support academic growth." },
              { icon: "⚽", title: "Sports Facilities", desc: "Playground and indoor sports facilities for physical wellness and recreation." },
              { icon: "🏫", title: "Classrooms", desc: "Spacious and air-conditioned smart classrooms equipped with modern teaching aids." },
              { icon: "⚙️", title: "Technical Labs", desc: "Specialised technical laboratories designed for engineering and IT programmes." },
            ].map((fac) => (
              <div
                key={fac.title}
                className="ucj-fac-card bg-white rounded-[14px] p-6 px-6"
                style={{ boxShadow: "0 2px 16px rgba(15, 28, 46, 0.07)" }}
              >
                <div className="text-2xl mb-[14px]">{fac.icon}</div>
                <h4 className="font-playfair text-base font-bold mb-2 text-[#0f1c2e]">
                  {fac.title}
                </h4>
                <p className="text-[#607080] text-[0.87rem] leading-[1.6]">
                  {fac.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}