import Link from "next/link";
import { notFound } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface CourseStructure {
  level: string;
  duration: string;
}

interface CourseData {
  title: string;
  image: string;
  intro: string;
  entryQualifications: string[];
  courseStructure: CourseStructure[];
  modules: Record<string, string[] | Record<string, string[]>>;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  try {
    const res = await fetch(`${API_BASE}/api/courses/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return { title: "Course Details" };
    const data = await res.json();
    const course: CourseData = data.data ?? data;
    return {
      title: course.title || "Course Details",
      description: course.intro || "University College of Jaffna Course",
    };
  } catch {
    return { title: "Course Details" };
  }
}

export default async function CoursePage({ params }: PageProps) {
  const { slug } = await params;

  let course: CourseData | null = null;

  try {
    const res = await fetch(`${API_BASE}/api/courses/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) notFound();
    const data = await res.json();
    course = data.data ?? data;
  } catch {
    notFound();
  }

  if (!course) notFound();

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-[#f0f2f7] border-b border-gray-200 py-3 px-6">
        <div className="max-w-[1280px] mx-auto text-[13px] text-[#607080]">
          <Link href="/" className="hover:text-[#e85d14] transition-colors">Home</Link>
          {" / "}
          <Link href="/courses" className="hover:text-[#e85d14] transition-colors">Courses</Link>
          {" / "}
          <span className="text-[#0b1730] font-medium">{slug.toUpperCase()}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="py-16 px-6 bg-gradient-to-r from-[#0b1730] via-[#152244] to-[#1e3060]">
        <div className="max-w-[1280px] mx-auto">
          <h1 className="text-[15px] lg:text-[28px] font-extrabold text-white mb-6 leading-tight">{course.title}</h1>
          <div className="w-24 h-1 bg-[#e85d14] rounded" />
        </div>
      </section>

      {/* Image */}
      <section className="px-6">
        <div className="max-w-[1280px] mx-auto">
          <img src={course.image} alt={course.title} className="w-full h-[400px] object-cover rounded-lg mt-6" />
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-[1280px] mx-auto">
          <p className="text-[15px] text-[#4a5780] leading-[1.8] max-w-[900px]">{course.intro}</p>
        </div>
      </section>

      {/* Entry Qualifications */}
      <section className="py-16 px-6 bg-[#f8f9fc]">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="text-[32px] font-extrabold text-[#0b1730] mb-8">
            Entry <span className="text-[#e85d14]">Qualifications</span>
          </h2>
          <div className="space-y-4">
            {course.entryQualifications.map((qual, i) => (
              <div key={i} className="bg-white p-6 rounded-lg border border-gray-200 hover:border-[#e85d14] transition-colors">
                <div className="flex items-start gap-4">
                  <div className="text-[#e85d14] text-[20px] mt-1">✓</div>
                  <p className="text-[#0b1730] font-semibold text-[14px]">{qual}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Structure */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="text-[32px] font-extrabold text-[#0b1730] mb-8">
            Course Structure & <span className="text-[#e85d14]">Course Durations</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#f0f2f7]">
                  <th className="border border-gray-200 px-6 py-4 text-left font-semibold text-[#0b1730]">Level</th>
                  <th className="border border-gray-200 px-6 py-4 text-left font-semibold text-[#0b1730]">Duration</th>
                </tr>
              </thead>
              <tbody>
                {course.courseStructure.map((row, i) => (
                  <tr key={i} className="hover:bg-[#f8f9fc] border-b border-gray-200">
                    <td className="border border-gray-200 px-6 py-4 text-[14px] text-[#0b1730] font-medium">{row.level}</td>
                    <td className="border border-gray-200 px-6 py-4">
                      <span className="inline-block bg-[#e85d14] text-white px-4 py-1 rounded-full text-[12px] font-semibold">{row.duration}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="py-16 px-6 bg-[#f8f9fc]">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="text-[32px] font-extrabold text-[#0b1730] mb-8">
            Modules <span className="text-[#e85d14]">Details</span>
          </h2>
          <div className="space-y-4">
            {Object.entries(course.modules).map(([semester, modules], idx) => (
              <details key={idx} className="bg-white border border-gray-200 rounded-lg overflow-hidden group">
                <summary className="w-full px-6 py-4 text-left font-semibold text-[#0b1730] bg-[#f0f2f7] hover:bg-[#e8eaf5] transition-colors cursor-pointer flex items-center justify-between">
                  {semester}
                  <span className="text-[#e85d14] group-open:rotate-180 transition-transform">
                    <i className="fas fa-chevron-down"></i>
                  </span>
                </summary>
                <div className="px-6 py-6 space-y-4">
                  {Array.isArray(modules) ? (
                    <ul className="space-y-3">
                      {modules.map((mod, i) => (
                        <li key={i} className="text-[14px] text-[#4a5780] flex items-start gap-3">
                          <span className="text-[#e85d14] font-bold mt-1">•</span>
                          <span>{mod}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    Object.entries(modules).map(([group, items]) => (
                      <div key={group} className="mb-6">
                        <h4 className="font-semibold text-[14px] mb-3 text-[#e85d14]">{group}</h4>
                        <ul className="space-y-2 ml-4">
                          {Array.isArray(items) && items.map((item, i) => (
                            <li key={i} className="text-[13px] text-[#4a5780]">• {item}</li>
                          ))}
                        </ul>
                      </div>
                    ))
                  )}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-[#0b1730] to-[#152244]">
        <div className="max-w-[1280px] mx-auto text-center">
          <h3 className="text-[32px] font-extrabold text-white mb-2">Ready to Start Your Journey?</h3>
          <p className="text-white/70 mb-8 max-w-[600px] mx-auto">Join our internationally recognized program and transform your future today.</p>
          <button className="bg-[#e85d14] hover:bg-[#c74d0f] text-white px-8 py-4 rounded-lg font-semibold transition-colors text-[15px]">
            Apply Now
          </button>
        </div>
      </section>
    </>
  );
}