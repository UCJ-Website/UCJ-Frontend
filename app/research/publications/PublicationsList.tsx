"use client";

import { useState } from "react";
import type { Publication } from "./page";

const typeStyles: Record<string, { bg: string; text: string }> = {
  journal: { bg: "#eff6ff", text: "#1d4ed8" },
  conf: { bg: "#f0fdf4", text: "#15803d" },
  thesis: { bg: "#fef3e8", text: "#c2410c" },
  report: { bg: "#f3f0ff", text: "#6d28d9" },
  publication: { bg: "#eff6ff", text: "#1d4ed8" },
};

const YEARS = ["2026", "2025", "2024", "2023", "2022", "2021", "2020"];

export default function PublicationsList({ publications }: { publications: Publication[] }) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [year, setYear] = useState("all");

  const filtered = publications.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.authors.toLowerCase().includes(search.toLowerCase());
    const matchType = type === "all" || item.type === type;
    const matchYear = year === "all" || item.year === year;
    return matchSearch && matchType && matchYear;
  });

  return (
    <>
      <div className="flex flex-wrap gap-3 mb-10 bg-white border border-[#e5eaf3] rounded-2xl p-4">
        <div className="relative flex-1 min-w-[220px]">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af] text-[13px]"></i>
          <input
            placeholder="Search by title or author..."
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e5eaf3] text-[13px] text-[#374151] focus:outline-none focus:border-[#2563b0] transition-colors"
          />
        </div>
        <select
          onChange={(e) => setType(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-[#e5eaf3] text-[13px] text-[#374151] focus:outline-none focus:border-[#2563b0]"
        >
          <option value="all">All types</option>
          <option value="publication">Publication</option>
          <option value="journal">Journal</option>
          <option value="conf">Conference</option>
          <option value="thesis">Thesis</option>
          <option value="report">Report</option>
        </select>
        <select
          onChange={(e) => setYear(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-[#e5eaf3] text-[13px] text-[#374151] focus:outline-none focus:border-[#2563b0]"
        >
          <option value="all">All years</option>
          {YEARS.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-[#9ca3af] text-sm py-16">No publications found.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((item) => {
            const style = typeStyles[item.type] ?? { bg: "#f3f4f6", text: "#374151" };
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#e5eaf3] p-6 flex flex-col gap-2.5 hover:shadow-[0_8px_28px_rgba(37,99,176,0.10)] transition-all duration-200"
              >
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className="text-[10px] font-semibold tracking-[0.06em] uppercase px-2.5 py-0.5 rounded-full"
                    style={{ background: style.bg, color: style.text }}
                  >
                    {item.type}
                  </span>
                  <span className="text-[12px] text-[#9ca3af]">{item.year}</span>
                  {item.department && (
                    <span className="text-[11px] text-[#6b7280] bg-[#f3f4f6] px-2.5 py-0.5 rounded-full">
                      <i className="fas fa-building text-[10px] mr-1"></i>
                      {item.department.name}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-[#0f2a5e] text-[16px] leading-[1.4]">{item.title}</h3>
                <p className="text-[13px] text-[#6b7280]">
                  <i className="fas fa-user text-[11px] mr-1.5"></i>{item.authors}
                </p>
                <p className="text-[13px] text-[#6b7280] leading-[1.55]">{item.description}</p>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}