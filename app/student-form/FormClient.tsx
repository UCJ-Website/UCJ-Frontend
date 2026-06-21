"use client";

import { useState } from "react";

interface StudentForm {
  id: number;
  title: string;
  description: string;
  category: string;
  file_url: string;
  icon?: string;
}

const CATEGORIES = ["all", "exam", "registration", "academic", "other"];

const CATEGORY_LABELS: Record<string, string> = {
  all: "All Forms",
  exam: "Examination",
  registration: "Registration",
  academic: "Academic Records",
  other: "Other",
};

const CATEGORY_ICONS: Record<string, string> = {
  exam: "fa-file-alt",
  registration: "fa-user-check",
  academic: "fa-scroll",
  other: "fa-notes-medical",
};

export default function FormClient({ forms }: { forms: StudentForm[] }) {
  const [active, setActive] = useState("all");

  const filtered = active === "all" ? forms : forms.filter((f) => f.category === active);

  return (
    <>
      {/* FILTER BAR */}
      <div className="flex flex-wrap justify-center gap-3 py-8 px-5 bg-white border-b border-gray-100">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-5 py-2 rounded-full text-[13px] font-semibold border transition-all duration-150 ${
              active === cat
                ? "bg-[#e85d14] text-white border-[#e85d14]"
                : "bg-white text-[#0b1730] border-gray-300 hover:border-[#e85d14] hover:text-[#e85d14]"
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* FORMS GRID */}
      <section className="py-16 px-5 bg-[#f8f9fc]">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="text-center text-[clamp(24px,3vw,34px)] font-extrabold text-[#0b1730] mb-3">
            Official <span className="text-[#e85d14]">Forms & Documents</span>
          </h2>
          <div className="w-16 h-1 bg-[#e85d14] rounded mx-auto mb-4" />
          <p className="text-center text-[#5a6380] text-[15px] mb-12">
            Download and submit the appropriate forms for your academic needs.
          </p>

          {filtered.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-10">No forms available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((form) => (
                <div
                  key={form.id}
                  className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-3 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#e85d14] bg-[#e85d14]/10 border border-[#e85d14]/20 px-3 py-1 rounded-full w-fit">
                    {CATEGORY_LABELS[form.category] ?? form.category}
                  </span>
                  <div className="w-11 h-11 rounded-xl bg-[#e85d14]/10 flex items-center justify-center text-[#e85d14]">
                    <i className={`fas ${form.icon ?? CATEGORY_ICONS[form.category] ?? "fa-file-alt"} text-[16px]`}></i>
                  </div>
                  <h4 className="text-[15px] font-bold text-[#0b1730] leading-snug">{form.title}</h4>
                  <p className="text-[13px] text-[#5a6380] leading-[1.7] flex-1">{form.description}</p>
                  <a
                    href={form.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[13px] font-semibold text-white bg-[#e85d14] hover:bg-[#cf4f0f] px-4 py-2 rounded-lg transition-colors w-fit mt-1"
                  >
                    <i className="fas fa-download text-[11px]"></i> Download
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}