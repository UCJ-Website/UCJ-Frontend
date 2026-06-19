"use client";

import { useState } from "react";
import type { InnovationProject } from "./page";

const catIcons: Record<string, string> = {
  ict: "fa-laptop-code",
  bst: "fa-briefcase",
  hm: "fa-heart-pulse",
};

export default function InnovationGrid({ projects }: { projects: InnovationProject[] }) {
  const [filter, setFilter] = useState("all");

  const categories = ["all", ...Array.from(new Set(projects.map((p) => p.cat)))];
  const filtered = filter === "all" ? projects : projects.filter((p) => p.cat === filter);

  return (
    <>
      <div className="flex gap-2.5 flex-wrap justify-center mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-[18px] py-2 rounded-full border-[1.5px] text-[13px] font-medium transition-all duration-200 ${
              filter === cat
                ? "bg-[#2563b0] border-[#2563b0] text-white"
                : "bg-white border-[#d1d9e6] text-[#4b5563] hover:border-[#2563b0] hover:text-[#2563b0]"
            }`}
          >
            {cat === "all" ? "All Projects" : cat.toUpperCase()}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-[#9ca3af] text-sm py-16">No projects found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-[14px] border border-[#e5eaf3] p-6 flex flex-col gap-2.5 hover:shadow-[0_8px_28px_rgba(37,99,176,0.13)] hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="w-[46px] h-[46px] rounded-xl bg-[#eff6ff] text-[#2563b0] flex items-center justify-center text-[20px]">
                <i className={`fas ${catIcons[p.cat] ?? "fa-flask"}`}></i>
              </div>
              <span className="inline-block bg-[#eff6ff] text-[#1d4ed8] text-[10px] font-semibold tracking-[0.06em] uppercase px-2.5 py-0.5 rounded-full w-fit">
                {p.catLabel ?? p.cat}
              </span>
              <div className="font-semibold text-[#0f2a5e] text-[15px] leading-[1.4]">{p.title}</div>
              {p.description && (
                <div className="text-[13px] text-[#6b7280] leading-[1.55]">{p.description}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}