import Link from "next/link";
import FormClient from "./FormClient";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface StudentForm {
  id: number;
  title: string;
  description: string;
  category: string;
  file_url: string;
  icon?: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    forms: {
      data: StudentForm[];
      total: number;
      last_page: number;
    };
  };
}

async function getAllForms(): Promise<StudentForm[]> {
  try {
    const res = await fetch(`${API_BASE}/api/students/forms?page=1`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json: ApiResponse = await res.json();
    const firstPage = json?.data?.forms?.data ?? [];
    const lastPage = json?.data?.forms?.last_page ?? 1;

    if (lastPage <= 1) return firstPage;

    // fetch remaining pages
    const promises = Array.from({ length: lastPage - 1 }, (_, i) =>
      fetch(`${API_BASE}/api/students/forms?page=${i + 2}`, {
        next: { revalidate: 3600 },
      })
        .then((r) => r.json())
        .then((d: ApiResponse) => d?.data?.forms?.data ?? [])
        .catch(() => [] as StudentForm[])
    );
    const rest = await Promise.all(promises);
    return [...firstPage, ...rest.flat()];
  } catch {
    return [];
  }
}

export default async function StudentFormPage() {
  const forms = await getAllForms();

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
            Student <span className="text-[#e85d14]">Forms</span>
          </h1>
          <p className="text-white/70 text-[15px] mb-5">
            Download official academic forms, applications, and documents in one place
          </p>
          <div className="text-white/50 text-[13px]">
            <Link href="/" className="hover:text-[#e85d14] transition-colors">Home</Link>
            {" / "}
            <Link href="/student" className="hover:text-[#e85d14] transition-colors">Student</Link>
            {" / "}
            <span className="text-[#e85d14]">Student Forms</span>
          </div>
        </div>
      </div>

      {/* CLIENT — filter + grid */}
      <FormClient forms={forms} />

      {/* INFO STRIP */}
      <div className="bg-[#0f2a5e] text-white text-center text-[14px] py-5 px-5">
        For assistance, visit the{" "}
        <strong>Student Services Unit</strong> at the Admin Office, No 29 Brown Road, Kokuvil East, Jaffna
        {" "}or call{" "}
        <strong>+94 0212 217791</strong>. Office hours: Mon – Fri, 8:30 AM – 4:00 PM.
      </div>
    </>
  );
}