"use client";

import type { InnovationProject } from "./page";

export default function InnovationGrid({ projects }: { projects: InnovationProject[] }) {
  if (projects.length === 0) {
    return <p className="text-center text-[#9ca3af] text-sm py-16">No projects found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {projects.map((p) => (
        <div
          key={p.id}
          className="bg-white rounded-[14px] border border-[#e5eaf3] p-6 flex flex-col gap-2.5 hover:shadow-[0_8px_28px_rgba(37,99,176,0.13)] hover:-translate-y-0.5 transition-all duration-200"
        >
          <div className="w-[46px] h-[46px] rounded-xl bg-[#eff6ff] text-[#2563b0] flex items-center justify-center text-[20px]">
            <i className="fas fa-flask"></i>
          </div>
          {p.department && (
            <span className="inline-block bg-[#eff6ff] text-[#1d4ed8] text-[10px] font-semibold tracking-[0.06em] uppercase px-2.5 py-0.5 rounded-full w-fit">
              {p.department.name}
            </span>
          )}
          <div className="font-semibold text-[#0f2a5e] text-[15px] leading-[1.4]">{p.title}</div>
          {p.authors && (
            <div className="text-[12px] text-[#6b7280]">
              <i className="fas fa-user text-[11px] mr-1.5"></i>{p.authors}
            </div>
          )}
          {p.description && (
            <div className="text-[13px] text-[#6b7280] leading-[1.55]">{p.description}</div>
          )}
          {p.year && (
            <div className="text-[11px] text-[#9ca3af] mt-auto pt-1">
              <i className="fas fa-calendar text-[10px] mr-1"></i>{p.year}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}