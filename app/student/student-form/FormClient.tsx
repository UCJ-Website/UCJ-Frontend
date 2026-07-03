"use client";

import { useState } from "react";
import type { StudentForm } from "./page";

const STORAGE_BASE = process.env.NEXT_PUBLIC_STORAGE_URL ?? "http://localhost:8000";

function isAbsoluteUrl(path: string) {
  return /^https?:\/\//i.test(path);
}

function buildFileUrl(filePath: string) {
  // Some forms store a full external URL (e.g. ucj.ac.lk PDFs),
  // others store a relative local path like "storage/student-forms/xyz.pdf"
  if (isAbsoluteUrl(filePath)) {
    return filePath;
  }
  const cleanPath = filePath.replace(/^\/+/, "");
  return `${STORAGE_BASE}/${cleanPath}`;
}

export default function FormClient({ forms }: { forms: StudentForm[] }) {
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  async function handleDownload(form: StudentForm) {
    const url = buildFileUrl(form.file_path);
    const filename = form.file_path.split("/").pop() || `${form.slug || form.title}.pdf`;

    // External (cross-origin) PDFs usually can't be fetched as a blob due to
    // CORS, so just open them directly — the browser/PDF viewer handles it.
    if (isAbsoluteUrl(form.file_path)) {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }

    console.log("🔍 Fetching file from:", url);
    setDownloadingId(form.id);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch file: ${res.status}`);
      const blob = await res.blob();

      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("❌ Download failed:", err);
      window.open(url, "_blank", "noopener,noreferrer");
    } finally {
      setDownloadingId(null);
    }
  }

  return (
    <section className="py-16 px-5 bg-[#f8f9fc]">
      <div className="max-w-[1280px] mx-auto">
        <h2 className="text-center text-[clamp(24px,3vw,34px)] font-extrabold text-[#0b1730] mb-3">
          Official <span className="text-[#e85d14]">Forms &amp; Documents</span>
        </h2>
        <div className="w-16 h-1 bg-[#e85d14] rounded mx-auto mb-4" />
        <p className="text-center text-[#5a6380] text-[15px] mb-12">
          Download and submit the appropriate forms for your academic needs.
        </p>

        {forms.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-10">No forms available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => (
              <div
                key={form.id}
                className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-3 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                <div className="w-11 h-11 rounded-xl bg-[#e85d14]/10 flex items-center justify-center text-[#e85d14]">
                  <i className={`${form.icon_class ?? "fas fa-file-alt"} text-[16px]`}></i>
                </div>
                <h4 className="text-[15px] font-bold text-[#0b1730] leading-snug">{form.title}</h4>
                <p className="text-[13px] text-[#5a6380] leading-[1.7] flex-1">{form.description}</p>

                <button
                  type="button"
                  onClick={() => handleDownload(form)}
                  disabled={downloadingId === form.id}
                  className="inline-flex items-center gap-2 text-[13px] font-semibold text-white bg-[#e85d14] hover:bg-[#cf4f0f] disabled:opacity-60 px-4 py-2 rounded-lg transition-colors w-fit mt-1 cursor-pointer"
                >
                  <i className="fas fa-download text-[11px]"></i>
                  {downloadingId === form.id ? "Downloading..." : "Download"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}