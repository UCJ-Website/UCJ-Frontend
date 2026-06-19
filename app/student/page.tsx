import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface StudentForm {
  id: number;
  icon: string;
  title: string;
  desc: string;
  file_url: string;
}

interface Bursary {
  id: number;
  title: string;
  scheme_name: string;
  day: string;
  month_year: string;
  deadline: string;
  description: string;
  notice_url: string;
  application_url: string;
  previous_post_title?: string;
  previous_post_date?: string;
  previous_post_url?: string;
}

async function getStudentForms(): Promise<StudentForm[]> {
  try {
    const res = await fetch(`${API_BASE}/api/student-forms`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data.data ?? [];
  } catch {
    return [];
  }
}

async function getBursary(): Promise<Bursary | null> {
  try {
    const res = await fetch(`${API_BASE}/api/bursaries`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    const list = Array.isArray(data) ? data : data.data ?? [];
    return list[0] ?? null;
  } catch {
    return null;
  }
}

export default async function StudentPage() {
  const [studentForms, bursary] = await Promise.all([getStudentForms(), getBursary()]);

  return (
    <>
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
            Student <span className="text-[#e85d14]">Portal</span>
          </h1>
          <p className="text-white/70 text-[15px] mb-5">
            Access your forms, bursaries, and academic resources in one place
          </p>
          <div className="text-white/50 text-[13px]">
            <Link href="/" className="hover:text-[#e85d14] transition-colors">Home</Link>
            {" / "}
            <span className="text-[#e85d14]">Student</span>
          </div>
        </div>
      </div>

      <section className="py-16 px-5 bg-[#f8f9fc]">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="text-center text-[clamp(24px,3vw,34px)] font-extrabold text-[#0b1730] mb-3">
            Students Forms &amp; <span className="text-[#e85d14]">Documents</span>
          </h2>
          <div className="w-16 h-1 bg-[#e85d14] rounded mx-auto mb-4" />
          <p className="text-center text-[#5a6380] text-[15px] mb-12">
            Download official forms for examinations, registrations, and academic requests.
          </p>

          {studentForms.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-10">No forms available right now.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {studentForms.map((form) => (
                <div
                  key={form.id}
                  className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-3 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#e85d14]/10 flex items-center justify-center text-[#e85d14]">
                    <i className={`fas ${form.icon} text-[16px]`}></i>
                  </div>
                  <h4 className="text-[15px] font-bold text-[#0b1730] leading-snug">{form.title}</h4>
                  <p className="text-[13px] text-[#5a6380] leading-[1.7] flex-1">{form.desc}</p>
                  <a
                    href={form.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[13px] font-semibold text-white bg-[#e85d14] hover:bg-[#cf4f0f] px-4 py-2 rounded-lg transition-colors w-fit mt-1"
                  >
                    <i className="fas fa-download text-[11px]"></i> Download Form
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 px-5 bg-white">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="text-center text-[clamp(24px,3vw,34px)] font-extrabold text-[#0b1730] mb-3">
            Bursary <span className="text-[#e85d14]">Program</span>
          </h2>
          <div className="w-16 h-1 bg-[#e85d14] rounded mx-auto mb-4" />
          <p className="text-center text-[#5a6380] text-[15px] mb-12">
            Financial support for eligible students to pursue their academic goals.
          </p>

          {!bursary ? (
            <p className="text-center text-gray-400 text-sm py-10">No active bursary notice.</p>
          ) : (
            <div className="max-w-[480px] mx-auto">
              <div className="bg-[#f8f9fc] rounded-2xl border border-gray-200 p-8 flex flex-col gap-4 hover:shadow-md transition-all duration-200 relative overflow-hidden">
                <div className="absolute top-6 right-6 bg-[#0f2a5e] text-white rounded-xl px-3 py-2 text-center leading-tight">
                  <div className="text-[20px] font-extrabold">{bursary.day}</div>
                  <div className="text-[11px] font-medium opacity-80">{bursary.month_year}</div>
                </div>

                <div className="w-11 h-11 rounded-xl bg-[#e85d14]/10 flex items-center justify-center text-[#e85d14]">
                  <i className="fas fa-hand-holding-usd text-[16px]"></i>
                </div>

                <div>
                  <h4 className="text-[18px] font-bold text-[#0b1730] mb-1">{bursary.title}</h4>
                  <p className="text-[13px] font-semibold text-[#e85d14] mb-3">{bursary.scheme_name}</p>
                  <p className="text-[14px] text-[#3d4a6a] leading-[1.75]">
                    {bursary.description}{" "}
                    <strong className="text-[#0b1730]">{bursary.deadline}</strong>.
                  </p>
                </div>

                <div className="flex gap-3 flex-wrap">
                  <a
                    href={bursary.notice_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[13px] font-semibold text-white bg-[#e85d14] hover:bg-[#cf4f0f] px-4 py-2 rounded-lg transition-colors"
                  >
                    <i className="fas fa-download text-[11px]"></i> Notice
                  </a>
                  <a
                    href={bursary.application_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[13px] font-semibold text-white bg-[#0f2a5e] hover:bg-[#0b1730] px-4 py-2 rounded-lg transition-colors"
                  >
                    <i className="fas fa-download text-[11px]"></i> Application
                  </a>
                </div>

                {bursary.previous_post_title && (
                  <div className="border-t border-gray-200 pt-4 mt-1">
                    <div className="text-[11px] font-bold text-[#5a6380] uppercase tracking-wider mb-1">
                      Previous Post
                    </div>
                    <a
                      href={bursary.previous_post_url ?? "#"}
                      className="text-[13px] font-semibold text-[#e85d14] hover:underline"
                    >
                      {bursary.previous_post_title}
                    </a>
                    <div className="text-[12px] text-[#5a6380] mt-0.5">{bursary.previous_post_date}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}