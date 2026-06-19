import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface CourseFeature {
  text: string;
}

interface GeneralCourse {
  img: string;
  imgFallback: string;
  tag: { icon: string; label: string };
  name: string;
  desc: string;
  features: string[] | CourseFeature[];
}

interface PageData {
  stats: { num: string; label: string }[];
  courses: GeneralCourse[];
}

async function getPageData(): Promise<PageData> {
  try {
    const res = await fetch(`${API_BASE}/api/courses/general`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("fetch failed");
    const data = await res.json();
    return data.data ?? data;
  } catch {
    return {
      stats: [
        { num: "2", label: "Programmes" },
        { num: "100%", label: "Free / Funded" },
        { num: "All", label: "Levels Welcome" },
        { num: "UCJ", label: "Certified" },
      ],
      courses: [],
    };
  }
}

export default async function GeneralCoursePage() {
  const { stats, courses } = await getPageData();

  return (
    <>
      {/* ===== HERO BANNER ===== */}
      <div
        className="relative flex flex-col items-center justify-center text-center py-20 px-5 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0b1730 0%, #1a3060 100%)",
          minHeight: "260px",
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(232,93,20,0.4) 1.5px, transparent 1.5px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative z-10">
          <div className="text-[#e85d14] text-[12px] font-bold tracking-widest uppercase mb-3">
            <i className="fas fa-book-open mr-2"></i>Foundation Programmes
          </div>
          <h1 className="text-white font-extrabold text-[clamp(32px,5vw,52px)] leading-tight mb-3">
            General{" "}
            <span className="text-[#e85d14] italic">ICT &amp; English</span>
          </h1>
          <p className="text-white/70 text-[15px] mb-5 max-w-[560px] mx-auto">
            Build your core digital literacy and language skills with our
            foundation programmes. Designed for beginners and open to all — no
            prior qualifications required.
          </p>
          <div className="text-white/50 text-[13px]">
            <Link href="/" className="hover:text-[#e85d14] transition-colors">Home</Link>
            {" / "}
            <Link href="/courses" className="hover:text-[#e85d14] transition-colors">Courses</Link>
            {" / "}
            <span className="text-[#e85d14]">Foundation Programmes</span>
          </div>
        </div>
      </div>

      {/* ===== STATS BAR ===== */}
      <div className="bg-[#0f2a5e] py-6 px-5">
        <div className="max-w-[1280px] mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-[#e85d14] text-[28px] font-extrabold leading-none">{s.num}</div>
              <div className="text-white/70 text-[12px] mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== COURSES GRID ===== */}
      <section className="py-16 px-5 bg-[#f8f9fc]">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="text-center text-[clamp(24px,3vw,34px)] font-extrabold text-[#0b1730] mb-3">
            General <span className="text-[#e85d14] italic">ICT &amp; English</span>
          </h2>
          <div className="w-16 h-1 bg-[#e85d14] rounded mx-auto mb-12" />

          {courses.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-16">No courses available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[900px] mx-auto">
              {courses.map((course) => {
                const features = course.features.map((f) =>
                  typeof f === "string" ? f : f.text
                );
                return (
                  <div
                    key={course.name}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col"
                  >
                    <div
                      className="relative h-48 flex items-center justify-center overflow-hidden"
                      style={{ background: "#e8edf5" }}
                    >
                      <i className={`fas ${course.imgFallback} text-[64px] text-[#0f2a5e]/20`}></i>
                      <img
                        src={course.img}
                        alt={course.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 flex flex-col gap-3 flex-1">
                      <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#e85d14] bg-[#e85d14]/10 border border-[#e85d14]/20 px-3 py-1 rounded-full w-fit">
                        <i className={`fas ${course.tag.icon} text-[10px]`}></i>
                        {course.tag.label}
                      </span>
                      <h3 className="text-[19px] font-bold text-[#0b1730]">{course.name}</h3>
                      <p className="text-[14px] text-[#5a6380] leading-[1.75]">{course.desc}</p>
                      <ul className="flex flex-col gap-2 mt-1">
                        {features.map((f) => (
                          <li key={f} className="flex items-center gap-2 text-[13px] text-[#3d4a6a]">
                            <i className="fas fa-check-circle text-[#e85d14] text-[12px] flex-shrink-0"></i>
                            {f}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-auto pt-4">
                        <a
                          href="/courses/general/ict" // Placeholder link - replace with actual course URL
                          className="inline-flex items-center gap-2 text-[13px] font-semibold text-white bg-[#e85d14] hover:bg-[#cf4f0f] px-5 py-2.5 rounded-xl transition-colors"
                        >
                          Learn More <i className="fas fa-arrow-right text-[11px]"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#0f2a5e] hover:text-[#e85d14] transition-colors"
            >
              <i className="fas fa-arrow-left text-[12px]"></i> Back to All Courses
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}