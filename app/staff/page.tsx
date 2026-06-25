"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { FaLinkedin } from "react-icons/fa";

// ===== API CONFIG =====
const RAW_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";
const ORIGIN = RAW_BASE.replace(/\/api\/?$/, "");
const API_URL = `${ORIGIN}/api`;

function resolveImage(path: string | null | undefined): string {
    if (!path) return "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400";
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
    category: string;
    subcategory: string;
    image: string;
    email?: string;
    phone?: string;
    linkedin?: string | null;
    departments: Department[];
    units: Unit[];
}

// ===== FILTER DEFINITIONS =====
const categoryFilters = [
    { id: "all", label: "All Staff", icon: Users },
    { id: "director", label: "Director", icon: Briefcase },
    { id: "head-of-division", label: "Head of Division", icon: Award },
    { id: "academics", label: "Academics", icon: GraduationCap },
    { id: "non-academic", label: "Non Academic", icon: Settings },
];

const academicSubFilters = [
    { id: "all", label: "All", icon: Users },
    { id: "ICT", label: "ICT", icon: Monitor },
    { id: "BST", label: "BST", icon: Wrench },
    { id: "FT", label: "FT", icon: FlaskConical },
    { id: "COS", label: "COS", icon: Compass },
    { id: "CT", label: "CT", icon: HardHat },
    { id: "HM", label: "HM", icon: UtensilsCrossed },
    { id: "PT", label: "PT", icon: Factory },
    { id: "FM", label: "FM", icon: Tractor },
    { id: "MT", label: "MT", icon: Bot },
];

const nonAcademicSubFilters = [
    { id: "all", label: "All", icon: Users },
    { id: "administrative", label: "Administrative Branch", icon: Building2 },
    { id: "finance", label: "Finance Branch", icon: DollarSign },
    { id: "library", label: "Library", icon: BookOpen },
];

function getBadge(member: StaffMember) {
    if (member.category === "director" && member.subcategory === "former") {
        return {
            label: "Former Director",
            className: "bg-[#0b1730]/5 text-[#5a6380] border border-gray-200",
        };
    }
    if (member.category === "director") {
        return {
            label: "Director",
            className: "bg-[#e85d14] text-white border border-[#e85d14]",
        };
    }
    if (member.category === "head-of-division") {
        return {
            label: "Head of Division",
            className: "bg-[#0b1730] text-white border border-[#0b1730]",
        };
    }
    if (member.category === "academics") {
        // Show first department short_code as badge label if available
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
            subcategory: item.subcategory ?? "all",
            image: resolveImage(item.photo),
            email: item.email ?? undefined,
            phone: item.phone ?? undefined,
            linkedin: item.linkedin ?? null,
            departments: item.departments ?? [],
            units: item.units ?? [],
        }));
}

export default function StaffPage() {
    const [activeCategory, setActiveCategory] = useState("all");
    const [activeSub, setActiveSub] = useState("all");

    const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function fetchStaff() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`${API_URL}/staffs?per_page=1000`, {
                    headers: { Accept: "application/json" },
                });
                if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
                const json = await res.json();
                if (!cancelled) setStaffMembers(normalizeStaffResponse(json));
            } catch (err) {
                if (!cancelled)
                    setError(err instanceof Error ? err.message : "Failed to load staff data.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchStaff();
        return () => { cancelled = true; };
    }, []);

    function selectCategory(id: string) {
        setActiveCategory(id);
        setActiveSub("all");
    }

    // ── FILTER LOGIC ──
    const filtered = staffMembers.filter((m) => {
        // Category filter
        if (activeCategory !== "all" && m.category !== activeCategory) return false;

        // Sub-filter for academics → match by departments[].short_code
        if (activeCategory === "academics" && activeSub !== "all") {
            const hasDept = m.departments.some(
                (d) => d.short_code.toUpperCase() === activeSub.toUpperCase()
            );
            if (!hasDept) return false;
        }

        // Sub-filter for non-academic → match by subcategory (administrative / finance / library)
        if (activeCategory === "non-academic" && activeSub !== "all") {
            if (m.subcategory !== activeSub) return false;
        }

        return true;
    });

    const currentDirectors = filtered.filter(
        (m) => m.category === "director" && m.subcategory === "current"
    );
    const formerDirectors = filtered.filter(
        (m) => m.category === "director" && m.subcategory === "former"
    );
    const rest = filtered.filter((m) => m.category !== "director");

    const showSubFilters =
        activeCategory === "academics" || activeCategory === "non-academic";
    const subFilterList =
        activeCategory === "academics" ? academicSubFilters : nonAcademicSubFilters;

    return (
        <>
            {/* ===== HERO BANNER ===== */}
            <div
                className="relative flex flex-col items-center justify-center text-center py-20 px-5 overflow-hidden"
                style={{
                    background: "linear-gradient(135deg, #0b1730 0%, #1a3060 100%)",
                    minHeight: "260px",
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
                    <h1 className="text-white font-extrabold text-[clamp(32px,5vw,52px)] leading-tight mb-3">
                        Our <span className="text-[#e85d14]">Staff</span>
                    </h1>
                    <p className="text-white/70 text-[15px] mb-5">
                        Meet the dedicated team of professionals committed to excellence
                        in education and administration.
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
            <section className="py-16 px-5 bg-[#f8f9fc]">
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
                    {showSubFilters && (
                        <div className="flex flex-wrap justify-center gap-2 mb-12">
                            {subFilterList.map((sub) => {
                                const Icon = sub.icon;
                                const active = activeSub === sub.id;
                                return (
                                    <button
                                        key={sub.id}
                                        onClick={() => setActiveSub(sub.id)}
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

                    {/* Grid */}
                    {!loading && !error && (currentDirectors.length > 0 || rest.length > 0) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-2">
                            {currentDirectors.map((member) => (
                                <StaffCard key={member.id} member={member} />
                            ))}
                            {rest.map((member) => (
                                <StaffCard key={member.id} member={member} />
                            ))}
                        </div>
                    )}

                    {/* Former Directors */}
                    {!loading && !error && formerDirectors.length > 0 && (
                        <>
                            <div className="flex items-center gap-3 mt-12 mb-6">
                                <History className="text-[#e85d14]" size={20} />
                                <h3 className="text-[18px] font-bold text-[#0b1730]">
                                    Former Directors
                                </h3>
                                <div className="flex-1 h-px bg-gray-200" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {formerDirectors.map((member) => (
                                    <StaffCard key={member.id} member={member} />
                                ))}
                            </div>
                        </>
                    )}

                    {!loading && !error && filtered.length === 0 && (
                        <p className="text-center text-[#5a6380] text-[14px] py-16">
                            No staff members found in this category.
                        </p>
                    )}
                </div>
            </section>
        </>
    );
}

function StaffCard({ member }: { member: StaffMember }) {
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
            className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer"
        >
            <div className="relative h-64 overflow-hidden">
                <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1730]/85 via-[#0b1730]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-5">
                    <div className="flex gap-2.5">
                        {member.email && (
                            <a
                                href={`mailto:${member.email}`}
                                onClick={(e) => e.stopPropagation()}
                                className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#e85d14] transition-colors"
                            >
                                <Mail size={15} />
                            </a>
                        )}
                        {member.phone && (
                            <a
                                href={`tel:${member.phone}`}
                                onClick={(e) => e.stopPropagation()}
                                className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#e85d14] transition-colors"
                            >
                                <Phone size={15} />
                            </a>
                        )}
                        {member.linkedin && (
                            <a
                                href={member.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#e85d14] transition-colors"
                            >
                                <FaLinkedin size={20} />
                            </a>
                        )}
                    </div>
                </div>
            </div>
            <div className="p-5 text-center">
                <h3 className="text-[15px] font-bold text-[#0b1730] mb-1">
                    {member.name}
                </h3>
                <p className="text-[13px] text-[#5a6380] mb-3">{member.position}</p>
                <span className={`text-[11px] font-semibold px-3 py-1 rounded-full ${badge.className}`}>
                    {badge.label}
                </span>
            </div>
        </div>
    );
}