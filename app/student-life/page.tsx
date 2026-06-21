import Link from "next/link";

export default function StudentLifePage() {
  const lifeCards = [
    {
      id: 1,
      icon: "fa-trophy",
      color: "#e6a817",
      title: "Sports & Recreation",
      desc: "From cricket to volleyball, our sports facilities and inter-college tournaments keep students active and competitive.",
      tag: "Sports",
    },
    {
      id: 2,
      icon: "fa-theater-masks",
      color: "#22a86e",
      title: "Cultural Events",
      desc: "Annual cultural festivals, drama performances, traditional arts, and music events celebrate the rich heritage of our student community.",
      tag: "Culture",
    },
  ];

  const supportCards = [
    { id: 1, icon: "fa-compass", title: "Career Guidance", desc: "One-on-one counselling, CV workshops, and career planning sessions to help you enter the workforce with confidence." },
    { id: 2, icon: "fa-hand-holding-usd", title: "Bursary & Financial Aid", desc: "The Nipunatha Sisu Saviya scheme and other financial support programs help eligible students continue their education." },
    { id: 3, icon: "fa-brain", title: "Counselling Services", desc: "Confidential support for mental health, stress management, and personal challenges — because your wellbeing matters." },
    { id: 4, icon: "fa-book-open", title: "Academic Support", desc: "Tutoring, study groups, and extra academic sessions to help every student reach their full potential." },
  ];

  return (
    <>
      {/* HERO */}
      <div
        className="relative flex flex-col items-center justify-center text-center py-20 px-5 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0b1730 0%, #1a3060 100%)", minHeight: "260px" }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(232,93,20,0.4) 1.5px, transparent 1.5px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative z-10">
          <h1 className="text-white font-extrabold text-[clamp(32px,5vw,52px)] leading-tight mb-3">
            Student <span className="text-[#e85d14]">Life</span>
          </h1>
          <p className="text-white/70 text-[15px] mb-5">
            Experience a vibrant campus community full of learning, culture, sports, and growth
          </p>
          <div className="text-white/50 text-[13px]">
            <Link href="/" className="hover:text-[#e85d14] transition-colors">Home</Link>
            {" / "}
            <Link href="/student" className="hover:text-[#e85d14] transition-colors">Student</Link>
            {" / "}
            <span className="text-[#e85d14]">Student Life</span>
          </div>
        </div>
      </div>

      {/* CAMPUS LIFE */}
      <section className="py-16 px-5 bg-[#f8f9fc]">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="text-center text-[clamp(24px,3vw,34px)] font-extrabold text-[#0b1730] mb-3">
            Campus <span className="text-[#e85d14]">Life</span>
          </h2>
          <div className="w-16 h-1 bg-[#e85d14] rounded mx-auto mb-4" />
          <p className="text-center text-[#5a6380] text-[15px] mb-12">
            Life at UCJ is more than academics — it&apos;s a journey of personal growth, friendships, and unforgettable experiences.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-[860px] mx-auto">
            {lifeCards.map((card) => (
              <div
                key={card.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                <div
                  className="flex items-center justify-center py-10 text-[48px]"
                  style={{ background: `${card.color}1A` }}
                >
                  <i className={`fas ${card.icon}`} style={{ color: card.color }}></i>
                </div>
                <div className="p-6 flex flex-col gap-2">
                  <h3 className="text-[17px] font-bold text-[#0b1730]">{card.title}</h3>
                  <p className="text-[14px] text-[#5a6380] leading-[1.75]">{card.desc}</p>
                  <span className="inline-block mt-2 text-[12px] font-semibold text-[#e85d14] bg-[#e85d14]/10 border border-[#e85d14]/20 px-3 py-1 rounded-full w-fit">
                    {card.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STUDENT SUPPORT */}
      <section className="py-16 px-5 bg-white">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="text-center text-[clamp(24px,3vw,34px)] font-extrabold text-[#0b1730] mb-3">
            Student <span className="text-[#e85d14]">Support</span>
          </h2>
          <div className="w-16 h-1 bg-[#e85d14] rounded mx-auto mb-4" />
          <p className="text-center text-[#5a6380] text-[15px] mb-12">
            We&apos;re here for you — academically, financially, and personally.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportCards.map((card) => (
              <div
                key={card.id}
                className="bg-[#f8f9fc] rounded-2xl border border-gray-200 p-6 flex flex-col gap-3 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                <div className="w-11 h-11 rounded-xl bg-[#e85d14]/10 flex items-center justify-center text-[#e85d14]">
                  <i className={`fas ${card.icon} text-[16px]`}></i>
                </div>
                <h4 className="text-[15px] font-bold text-[#0b1730]">{card.title}</h4>
                <p className="text-[13px] text-[#5a6380] leading-[1.7]">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}