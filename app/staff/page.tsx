"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Phone,
  History,
  Users,
  Briefcase,
  Award,
  GraduationCap,
  Settings,
  Building2,
  DollarSign,
  BookOpen,
  Monitor,
  Wrench,
  FlaskConical,
  Compass,
  HardHat,
  UtensilsCrossed,
  Factory,
  Tractor,
  Bot,
  Loader2,
  Clock,
} from "lucide-react";
import { FaLinkedin } from "react-icons/fa";

// ===== API CONFIG =====
const RAW_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";
const ORIGIN = RAW_BASE.replace(/\/api\/?$/, "");
const API_URL = `${ORIGIN}/api`;

function resolveImage(path: string | null | undefined): string {
  if (!path)
    return "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400";
  if (/^https?:\/\//i.test(path)) return path;
  return `${ORIGIN}/${path.replace(/^\/+/, "")}`;
}

// ===== TYPES =====
interface Department {
  id: number;
  name: string;
  short_code: string;
  role_type: string | null;
}

interface DepartmentFilter {
  id: string;
  label: string;
  icon: any;
  sortOrder: number;
}

interface Unit {
  id: number;
  name: string;
  short_code: string;
  role_type: string | null;
}

interface StaffMember {
  id: string | number;
  slug: string;
  name: string;
  position: string;
  category: string; // raw backend value: "academics" | "non-academic"
  subcategory: string | null;
  image: string;
  email?: string;
  phone?: string;
  linkedin?: string | null;
  departments: Department[];
  units: Unit[];
}

// ===== STATIC FILTER DEFINITIONS =====
const categoryFilters = [
  { id: "director", label: "Director", icon: Briefcase },
  { id: "academics", label: "Academics", icon: GraduationCap },
  { id: "non-academic", label: "Non Academic", icon: Settings },
];

// Academics filters are created from the departments returned by the staff API.
const academicDepartmentOrder = [
  "COS",
  "FM",
  "FT",
  "CT",
  "HM",
  "ICT",
  "MT",
  "PT",
  "BST",
];

const academicDepartmentIcons: Record<string, any> = {
  COS: Compass,
  FM: Tractor,
  FT: FlaskConical,
  CT: HardHat,
  HM: UtensilsCrossed,
  ICT: Monitor,
  MT: Bot,
  PT: Factory,
  BST: Wrench,
};

const dynamicIconPool = [
  Building2,
  DollarSign,
  BookOpen,
  Settings,
  Briefcase,
  Award,
];

// ── ROLE DETECTION ──
function getSubcategorySegments(m: StaffMember): string[] {
  return (m.subcategory ?? "")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
}

// STRICT: a segment must literally START with "director" / "former director".
function isFormerDirector(m: StaffMember) {
  return getSubcategorySegments(m).some((seg) =>
    /^former\s+director\b/i.test(seg),
  );
}

function isCurrentDirector(m: StaffMember) {
  return (
    getSubcategorySegments(m).some((seg) => /^director\b/i.test(seg)) &&
    !isFormerDirector(m)
  );
}

// Head of Division: no longer excludes current directors — someone can be
// BOTH Director and Head of Department (e.g. Ramanan for ICT) and should
// still show up under the "Head of Division" filter.
function isHeadOfDivision(m: StaffMember) {
  return (
    getSubcategorySegments(m).some((seg) =>
      /head of department|head of division/i.test(seg),
    ) && !isFormerDirector(m)
  );
}

// BROAD match — used ONLY for the "Former Directors" showcase section.
// Includes anyone whose subcategory mentions "former" + "director"
// anywhere (e.g. a current HOD who was historically an Acting Director).
function isFormerDirectorMention(m: StaffMember) {
  const sub = (m.subcategory ?? "").toLowerCase();
  return sub.includes("former") && sub.includes("director");
}

// Only actual former academic staff should appear in the Academics
// "Former Staff" filter. Historical roles such as
// "Former Acting Director / CEO" do not make a current HOD a former staff member.
function isFormerStaff(m: StaffMember) {
  return getSubcategorySegments(m).some((seg) =>
    /^former\s+academic\s+staff\b/i.test(seg),
  );
}

function extractDirectorDuration(m: StaffMember): string | null {
  const sub = m.subcategory ?? "";
  const match = sub.match(
    /([A-Za-z]{3,9}\s+\d{4}|\d{1,2}-\d{1,2}-\d{4}|\d{4})\s*-\s*([A-Za-z]{3,9}\s+\d{4}|\d{1,2}-\d{1,2}-\d{4}|\d{4})/,
  );
  return match ? `${match[1]} – ${match[2]}` : null;
}

function getFormerDirectorLabel(member: StaffMember): string {
  const sub = member.subcategory ?? "";

  if (/former\s+acting\s+director/i.test(sub)) {
    return "Former Acting Director / CEO";
  }

  return "Former Director / CEO";
}

function getBadge(member: StaffMember) {
  if (isFormerDirector(member)) {
    return {
      label: "Former Director",
      className: "bg-[#0b1730]/5 text-[#5a6380] border border-gray-200",
    };
  }
  if (isCurrentDirector(member)) {
    return {
      label: "Director",
      className: "bg-[#e85d14] text-white border border-[#e85d14]",
    };
  }
  if (isHeadOfDivision(member)) {
    return {
      label: "Head of Division",
      className: "bg-[#0b1730] text-white border border-[#0b1730]",
    };
  }
  if (member.category === "academics") {
    const deptCode = member.departments?.[0]?.short_code;
    return {
      label: deptCode ? `Academic · ${deptCode}` : "Academic",
      className: "bg-[#e85d14]/10 text-[#e85d14] border border-[#e85d14]/30",
    };
  }
  return {
    label: "Non Academic",
    className: "bg-[#0b1730]/10 text-[#0b1730] border border-[#0b1730]/20",
  };
}

function normalizeStaffResponse(json: unknown): StaffMember[] {
  const raw: any[] =
    (json as any)?.data?.staffs?.data ??
    (json as any)?.data?.staffs ??
    (json as any)?.data ??
    [];

  if (!Array.isArray(raw)) return [];

  return raw
    .filter((item) => item.is_active !== false)
    .map((item) => ({
      id: item.id,
      slug: item.slug ?? String(item.id),
      name: item.name ?? "",
      position: item.position ?? "",
      category: item.category ?? "",
      subcategory: item.subcategory ?? null,
      image: resolveImage(item.photo),
      email: item.email ?? undefined,
      phone: item.phone ?? undefined,
      linkedin: item.linkedin ?? null,
      departments: item.departments ?? [],
      units: item.units ?? [],
    }));
}

export default function StaffPage() {
  // "All Staff" tab was removed, so default to the first remaining tab.
  const [activeCategory, setActiveCategory] = useState("director");
  // Default sub-filter for Academics is "HOD" since "All" isn't an
  // option there anymore.
  const [activeSub, setActiveSub] = useState("HOD");

  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [departments, setDepartments] = useState<DepartmentFilter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchAllStaff(): Promise<StaffMember[]> {
      const allStaff: StaffMember[] = [];
      let page = 1;
      let lastPage = 1;

      do {
        const res = await fetch(`${API_URL}/staffs?page=${page}`, {
          headers: { Accept: "application/json" },
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`Staff request failed with status ${res.status}`);
        }

        const json = await res.json();
        allStaff.push(...normalizeStaffResponse(json));

        lastPage =
          Number((json as any)?.data?.staffs?.last_page) ||
          Number((json as any)?.data?.last_page) ||
          1;

        page += 1;
      } while (page <= lastPage);

      return Array.from(
        new Map(
          allStaff.map((member) => [String(member.id), member]),
        ).values(),
      );
    }

    async function fetchDepartments(): Promise<DepartmentFilter[]> {
      const res = await fetch(`${API_URL}/departments`, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(
          `Departments request failed with status ${res.status}`,
        );
      }

      const json = await res.json();
      const rawDepartments =
        (json as any)?.data?.departments?.data ??
        (json as any)?.data?.departments ??
        (json as any)?.data ??
        [];

      if (!Array.isArray(rawDepartments)) return [];

      return rawDepartments
        .filter(
          (department: any) =>
            department.is_unit !== true &&
            department.short_code &&
            department.short_code.trim() !== "",
        )
        .map((department: any) => {
          const code = String(department.short_code).trim().toUpperCase();

          return {
            id: code,
            label: code,
            icon: academicDepartmentIcons[code] ?? Building2,
            sortOrder: Number(department.sort_order) || 999,
          };
        })
        .sort(
          (a: DepartmentFilter, b: DepartmentFilter) =>
            a.sortOrder - b.sortOrder || a.label.localeCompare(b.label),
        );
    }

    async function loadPageData() {
      setLoading(true);
      setError(null);

      try {
        const [loadedStaff, loadedDepartments] = await Promise.all([
          fetchAllStaff(),
          fetchDepartments(),
        ]);

        if (!cancelled) {
          setStaffMembers(loadedStaff);
          setDepartments(loadedDepartments);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load staff data.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPageData();

    return () => {
      cancelled = true;
    };
  }, []);

  const academicSubFilters = useMemo(
    () => [
      { id: "HOD", label: "HOD", icon: Award },
      ...departments.map(({ id, label, icon }) => ({ id, label, icon })),
    ],
    [departments],
  );

  // Non-academic filters are built from the API subcategories.
  const nonAcademicSubFilters = useMemo(() => {
    const preferredOrder = [
      "Head of Administrative Division",
      "Head of Finance Division",
      "Finance Branch",
      "Administrative Branch",
      "Head of Library",
      "Laboratory Assistant",
    ];

    const unique = Array.from(
      new Set(
        staffMembers
          .filter((m) => {
            const subcategory = (m.subcategory ?? "").trim();
            const normalizedSubcategory = subcategory.toLowerCase();

            return (
              m.category === "non-academic" &&
              subcategory !== "" &&
              // Former directors are displayed only in the Director section.
              !normalizedSubcategory.includes("former director") &&
              // Board members are displayed only on their unit pages.
              normalizedSubcategory !== "board of management" &&
              normalizedSubcategory !== "board of studies"
            );
          })
          .map((m) => m.subcategory as string),
      ),
    ).sort((a, b) => {
      const aIndex = preferredOrder.indexOf(a);
      const bIndex = preferredOrder.indexOf(b);

      // Listed filters always appear first in the required order.
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;

      // Any future non-academic categories appear after them alphabetically.
      return a.localeCompare(b);
    });

    return unique.map((sub, idx) => ({
      id: sub,
      label: sub,
      icon: dynamicIconPool[idx % dynamicIconPool.length],
    }));
  }, [staffMembers]);

  const nonAcademicSections = useMemo(
    () =>
      nonAcademicSubFilters.map((filter) => ({
        ...filter,
        members: staffMembers
          .filter((member) => {
            const normalizedSubcategory = (
              member.subcategory ?? ""
            ).trim().toLowerCase();

            return (
              member.category === "non-academic" &&
              member.subcategory === filter.id &&
              normalizedSubcategory !== "board of management" &&
              normalizedSubcategory !== "board of studies"
            );
          })
          .sort((a, b) => {
            const administrativeBranchPositionOrder = [
              "Management Assistant - Grade III",
              "Maintenance Technician",
              "Office Assistant",
              "Driver",
            ];

            const rank = (member: StaffMember) => {
              // Required staff order only inside Administrative Branch.
              if (filter.id === "Administrative Branch") {
                const positionIndex =
                  administrativeBranchPositionOrder.indexOf(
                    member.position.trim(),
                  );

                return positionIndex === -1
                  ? administrativeBranchPositionOrder.length
                  : positionIndex;
              }

              // Existing order for every other non-academic section.
              if (
                member.position.trim() ===
                "Management Assistant - Grade III"
              ) {
                return 0;
              }

              if (member.position.trim() !== "") return 1;
              return 2;
            };

            const rankDifference = rank(a) - rank(b);

            if (rankDifference !== 0) {
              return rankDifference;
            }

            return a.name.localeCompare(b.name);
          }),
      })),
    [nonAcademicSubFilters, staffMembers],
  );

  function selectCategory(id: string) {
    setActiveCategory(id);

    if (id === "academics") {
      setActiveSub("HOD");
    } else if (id === "non-academic") {
      setActiveSub(nonAcademicSubFilters[0]?.id ?? "");
    } else {
      setActiveSub("all");
    }
  }

  function handleSubFilterClick(id: string) {
    setActiveSub(id);
  }

  // ── FILTER LOGIC ──
  // "director" tab now checks STRICT current-director only — historical
  // "Acting Director" mentions inside an HOD's subcategory no longer
  // pull them into the main Director grid.
  // "academics"/"non-academic" checks the raw backend category, so ALL
  // department members show regardless of their director/HOD status.
  const filtered = staffMembers.filter((m) => {
    if (activeCategory === "all") return true;

    if (activeCategory === "director") {
      return isCurrentDirector(m);
    }

    if (activeCategory === "academics") {
      if (m.category !== "academics") return false;
      // "HOD" sub-filter overrides the department check entirely —
      // it shows Heads of Division within Academics regardless of
      // which department they belong to.
      if (activeSub === "HOD") {
        return isHeadOfDivision(m);
      }

      return m.departments.some(
        (department) =>
          (department.short_code ?? "").trim().toUpperCase() ===
          activeSub.toUpperCase(),
      );
    }

    if (activeCategory === "non-academic") {
      return m.category === "non-academic";
    }

    return true;
  });

  // Department views show current and former academic staff separately.
  // No separate "Former Staff" filter tab is required.
  const isAcademicDepartmentView =
    activeCategory === "academics" && activeSub !== "HOD";

  const formerDepartmentStaff = isAcademicDepartmentView
    ? filtered.filter(isFormerStaff)
    : [];

  const currentFiltered = isAcademicDepartmentView
    ? filtered.filter((m) => !isFormerStaff(m))
    : filtered;

  const currentDirectors = currentFiltered.filter(isCurrentDirector);

  const rest = currentFiltered
    .filter((m) => !isCurrentDirector(m) && !isFormerDirector(m))
    .sort((a, b) => {
      // In every academic department view, show the Head of Department /
      // Head of Division as the first staff card.
      if (isAcademicDepartmentView) {
        const aHeadRank = isHeadOfDivision(a) ? 0 : 1;
        const bHeadRank = isHeadOfDivision(b) ? 0 : 1;

        if (aHeadRank !== bHeadRank) {
          return aHeadRank - bHeadRank;
        }
      }

      if (activeCategory === "non-academic") {
        // "Management Assistant - Grade III" staff show first,
        // ahead of everyone else with a position, which in turn
        // show ahead of staff with a blank position.
        const rank = (m: StaffMember) => {
          if (m.position.trim() === "Management Assistant - Grade III")
            return 0;
          if (m.position.trim() !== "") return 1;
          return 2;
        };
        const aRank = rank(a);
        const bRank = rank(b);
        if (aRank !== bRank) return aRank - bRank;
      }

      return a.name.localeCompare(b.name);
    });

  // Former Directors showcase: broad match against the FULL staff list
  // (not the tab-filtered one), shown only on "All Staff" and "Director"
  // tabs — never inside a department sub-filter view.
  const showFormerDirectorsShowcase =
    activeCategory === "all" || activeCategory === "director";
  const formerDirectorsShowcase = showFormerDirectorsShowcase
    ? staffMembers.filter(isFormerDirectorMention)
    : [];

  const showSubFilters = activeCategory === "academics";
  const subFilterList = academicSubFilters;

  return (
    <>
      {/* ===== HERO BANNER ===== */}
      <div
        className="relative flex flex-col items-center justify-center text-center py-5 px-5 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0b1730 0%, #1a3060 100%)",
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
          <h1 className="text-white font-extrabold text-[clamp(28px,4.5vw,44px)] leading-tight mb-2">
            Our <span className="text-[#e85d14]">Staff</span>
          </h1>
          <p className="text-white/70 text-[14px] mb-3">
            Meet the dedicated team of professionals committed to excellence in
            education and administration.
          </p>
          <div className="text-white/50 text-[13px]">
            <Link href="/" className="hover:text-[#e85d14] transition-colors">
              Home
            </Link>
            {" / "}
            <span className="text-[#e85d14]">Staff</span>
          </div>
        </div>
      </div>

      {/* ===== STAFF SECTION ===== */}
      <section className="py-10 px-5 bg-[#f8f9fc]">
        <div className="max-w-[1280px] mx-auto">
          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {categoryFilters.map((cat) => {
              const Icon = cat.icon;
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => selectCategory(cat.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-semibold border transition-all duration-200 ${
                    active
                      ? "bg-[#e85d14] text-white border-[#e85d14] shadow-sm"
                      : "bg-white text-[#3d4a6a] border-gray-200 hover:border-[#e85d14]/40 hover:text-[#e85d14]"
                  }`}
                >
                  <Icon size={15} />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Sub Filters */}
          {showSubFilters && subFilterList.length > 1 && (
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {subFilterList.map((sub) => {
                const Icon = sub.icon;
                const active = activeSub === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => handleSubFilterClick(sub.id)}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-semibold border transition-all duration-200 ${
                      active
                        ? "bg-[#0b1730] text-white border-[#0b1730]"
                        : "bg-white text-[#5a6380] border-gray-200 hover:border-[#0b1730]/30"
                    }`}
                  >
                    <Icon size={13} />
                    {sub.label}
                  </button>
                );
              })}
            </div>
          )}

          {!showSubFilters && <div className="mb-4" />}

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 text-[#5a6380]">
              <Loader2 className="animate-spin mb-3" size={28} />
              <p className="text-[14px]">Loading staff…</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="text-center py-24">
              <p className="text-[14px] text-red-600 mb-2">
                Couldn&apos;t load staff data.
              </p>
              <p className="text-[12px] text-[#5a6380]">{error}</p>
              <p className="text-[12px] text-[#5a6380] mt-1">
                Make sure the Laravel API is running at{" "}
                <code className="bg-gray-100 px-1.5 py-0.5 rounded">
                  {API_URL}/staffs
                </code>{" "}
                and CORS allows this origin.
              </p>
            </div>
          )}

          {/* Current staff grid */}
          {!loading &&
            !error &&
            activeCategory !== "non-academic" &&
            (currentDirectors.length > 0 || rest.length > 0) && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-2">
                {currentDirectors.map((member) => (
                  <StaffCard key={member.id} member={member} />
                ))}
                {rest.map((member) => (
                  <StaffCard key={member.id} member={member} />
                ))}
              </div>
            )}

          {/* Non-academic staff shown section by section */}
          {!loading && !error && activeCategory === "non-academic" && (
            <div className="space-y-14">
              {nonAcademicSections.map((section) => {
                const SectionIcon = section.icon;

                return (
                  <section key={section.id}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-9 h-9 rounded-lg bg-[#e85d14]/10 border border-[#e85d14]/20 flex items-center justify-center">
                        <SectionIcon size={16} className="text-[#e85d14]" />
                      </div>

                      <div>
                        <h3 className="text-[18px] font-bold text-[#0b1730]">
                          {section.label}
                        </h3>
                        <p className="text-[12px] text-[#5a6380]">
                          {section.members.length}{" "}
                          {section.members.length === 1
                            ? "staff member"
                            : "staff members"}
                        </p>
                      </div>

                      <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {section.members.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {section.members.map((member) => (
                          <StaffCard
                            key={`${section.id}-${member.id}`}
                            member={member}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-gray-200 bg-white py-10 text-center">
                        <p className="text-[13px] text-[#5a6380]">
                          No staff members found in this section.
                        </p>
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          )}

          {/* Former Academic Staff for the selected department */}
          {!loading && !error && formerDepartmentStaff.length > 0 && (
            <>
              <div className="flex items-center gap-3 mt-12 mb-6">
                <History className="text-[#e85d14]" size={20} />
                <h3 className="text-[18px] font-bold text-[#0b1730]">
                  Former Academic Staff
                </h3>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {formerDepartmentStaff.map((member) => (
                  <StaffCard
                    key={`former-academic-${member.id}`}
                    member={member}
                    forceLabel="Former Academic Staff"
                    duration={extractDirectorDuration(member)}
                  />
                ))}
              </div>
            </>
          )}

          {/* Former Directors Showcase */}
          {!loading && !error && formerDirectorsShowcase.length > 0 && (
            <>
              <div className="flex items-center gap-3 mt-12 mb-6">
                <History className="text-[#e85d14]" size={20} />
                <h3 className="text-[18px] font-bold text-[#0b1730]">
                  Former Directors
                </h3>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {formerDirectorsShowcase.map((member) => (
                  <StaffCard
                    key={`former-${member.id}`}
                    member={member}
                    forceLabel={getFormerDirectorLabel(member)}
                    duration={extractDirectorDuration(member)}
                  />
                ))}
              </div>
            </>
          )}

          {!loading &&
            !error &&
            activeCategory !== "non-academic" &&
            filtered.length === 0 && (
              <p className="text-center text-[#5a6380] text-[14px] py-16">
                No staff members found in this category.
              </p>
            )}
        </div>
      </section>
    </>
  );
}

function StaffCard({
  member,
  forceLabel,
  duration,
}: {
  member: StaffMember;
  forceLabel?: string;
  duration?: string | null;
}) {
  const badge = getBadge(member);
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/staff/${member.slug}`)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") router.push(`/staff/${member.slug}`);
      }}
      className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1730]/85 via-[#0b1730]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
          <div className="flex gap-1.5">
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                onClick={(e) => e.stopPropagation()}
                className="w-7 h-7 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#e85d14] transition-colors"
              >
                <Mail size={12} />
              </a>
            )}
            {member.phone && (
              <a
                href={`tel:${member.phone}`}
                onClick={(e) => e.stopPropagation()}
                className="w-7 h-7 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#e85d14] transition-colors"
              >
                <Phone size={12} />
              </a>
            )}
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-7 h-7 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#e85d14] transition-colors"
              >
                <FaLinkedin size={15} />
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="p-3 text-center">
        <h3 className="text-[13px] font-bold leading-snug text-[#0b1730] mb-0.5">
          {member.name}
        </h3>
        <p className="text-[11px] text-[#5a6380] mb-2">{member.position}</p>
        <span
          className={`inline-block text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
            forceLabel
              ? "bg-[#0b1730]/5 text-[#5a6380] border border-gray-200"
              : badge.className
          }`}
        >
          {forceLabel ?? badge.label}
        </span>
        {duration && (
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#5a6380] mt-1.5">
            <Clock size={11} />
            <span>{duration}</span>
          </div>
        )}
      </div>
    </div>
  );
}