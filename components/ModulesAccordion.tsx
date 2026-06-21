"use client";

import { useState } from "react";

interface Subject {
  id: number;
  name: string;
}

interface Module {
  id: number;
  name: string;
}

interface ElectiveGroup {
  id: number;
  name: string;
  modules: Module[];
}

interface Semester {
  id: number;
  name: string;
  subjects: Subject[];
  elective_groups: ElectiveGroup[];
}

export default function SemestersAccordion({ semesters }: { semesters: Semester[] }) {
  const [openId, setOpenId] = useState<number | null>(semesters[0]?.id ?? null);

  return (
    <div className="flex flex-col gap-4">
      {semesters.map((sem) => {
        const isOpen = openId === sem.id;
        const totalItems =
          sem.subjects.length +
          sem.elective_groups.reduce((acc, g) => acc + g.modules.length, 0);

        return (
          <div
            key={sem.id}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden transition-shadow hover:shadow-sm"
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : sem.id)}
              className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#fdeee3] text-[#e85d14] flex items-center justify-center font-bold text-[13px] shrink-0">
                  <i className="fas fa-layer-group text-[13px]"></i>
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-[#0b1730]">{sem.name}</h3>
                  <span className="text-[12px] text-[#5a6380]">
                    {totalItems} {totalItems === 1 ? "module" : "modules"}
                  </span>
                </div>
              </div>
              <i
                className={`fas fa-chevron-down text-[#e85d14] text-[13px] transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              ></i>
            </button>

            {isOpen && (
              <div className="px-6 pb-6 pt-1 border-t border-gray-100">
                {sem.subjects.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
                    {sem.subjects.map((subj) => (
                      <div
                        key={subj.id}
                        className="flex items-center gap-2.5 bg-[#f8f9fc] rounded-xl px-4 py-3 text-[13.5px] text-[#0b1730] font-medium"
                      >
                        <i className="fas fa-book text-[#e85d14] text-[11px]"></i>
                        {subj.name}
                      </div>
                    ))}
                  </div>
                )}

                {sem.elective_groups.length > 0 && (
                  <div className="flex flex-col gap-4">
                    {sem.elective_groups.map((group) => (
                      <div key={group.id}>
                        <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.06em] text-[#e85d14] mb-2.5">
                          <i className="fas fa-shuffle text-[10px]"></i> {group.name}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {group.modules.map((mod) => (
                            <div
                              key={mod.id}
                              className="flex items-center gap-2.5 border border-dashed border-[#e8b896] rounded-xl px-4 py-3 text-[13.5px] text-[#0b1730] font-medium"
                            >
                              <i className="fas fa-book-open text-[#e85d14] text-[11px]"></i>
                              {mod.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {sem.subjects.length === 0 && sem.elective_groups.length === 0 && (
                  <p className="text-[13px] text-gray-400 py-2">No modules added for this semester yet.</p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}