"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Loader2, Mail, Phone, MapPin, Calendar, IdCard,
  Building2, GraduationCap, Briefcase, BookOpen,
  FlaskConical, ChevronRight, ExternalLink
} from "lucide-react";
import { FaLinkedin, FaResearchgate } from "react-icons/fa";
import { SiGooglescholar } from "react-icons/si";

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
interface Qualification { degree: string; inst: string }
interface Experience    { role: string; place: string; year: string }
interface Publication   { title: string; venue: string }

interface StaffDetail {
  name: string; position: string; category: string;
  email: string; phone: string; photo: string; about: string;
  office: string; dept: string; staffId: string; joined: string;
  quals: Qualification[]; exp: Experience[];
  subjects: string[]; pubs: Publication[];
  linkedin: string; researchGate: string; googleScholar: string;
}

function normalizeStaffDetail(json: unknown): StaffDetail {
  const item: any =
    (json as any)?.data?.staff ??
    (json as any)?.data?.staffMember ??
    (json as any)?.data ??
    json ?? {};

  return {
    name:     item.name ?? "",
    position: item.position ?? "",
    category: item.category ?? "",
    email:    item.email ?? "",
    phone:    item.phone ?? "",
    photo:    resolveImage(item.photo),
    about:    item.about ?? "",
    office:   item.office ?? "—",
    dept:     typeof item.department === "string"
                ? item.department
                : item.department?.name ?? item.departments?.[0]?.name ?? "—",
    staffId:  item.staff_id ?? "—",
    joined:   item.joined_date ?? "—",
    quals:    Array.isArray(item.qualifications)
                ? item.qualifications.map((q: any) => ({
                    degree: q.degree ?? q.title ?? q.qualification ?? "",
                    inst:   q.inst ?? q.institution ?? "",
                  }))
                : [],
    exp:      Array.isArray(item.experience)
                ? item.experience.map((e: any) => ({
                    role:  e.role ?? e.position ?? "",
                    place: e.place ?? e.organization ?? "",
                    year:  e.year ?? e.duration ?? "",
                  }))
                : [],
    subjects: Array.isArray(item.subjects) ? item.subjects : [],
    pubs:     Array.isArray(item.publications)
                ? item.publications.map((p: any) => ({
                    title: p.title ?? "",
                    venue: p.venue ?? p.journal ?? "",
                  }))
                : [],
    linkedin:      item.linkedin ?? "",
    researchGate:  item.research_gate ?? "",
    googleScholar: item.google_scholar ?? "",
  };
}

function categoryLabel(cat: string) {
  if (cat === "academics") return "Academic Staff";
  if (cat === "non-academic") return "Non-Academic Staff";
  if (cat === "director") return "Director";
  if (cat === "head-of-division") return "Head of Division";
  return cat;
}

export default function StaffDetailsPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [staff, setStaff]   = useState<StaffDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    async function fetchStaffDetail() {
      setLoading(true); setError(null);
      try {
        const res = await fetch(`${API_URL}/staffs/${slug}`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const json = await res.json();
        if (!cancelled) setStaff(normalizeStaffDetail(json));
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchStaffDetail();
    return () => { cancelled = true; };
  }, [slug]);

  /* ── Loading ── */
  if (loading) return (
    <div className="min-h-screen bg-[#f6f7fb] flex flex-col items-center justify-center text-[#5a6380]">
      <Loader2 className="animate-spin mb-3" size={32} />
      <p className="text-sm">Loading staff member…</p>
    </div>
  );

  /* ── Error ── */
  if (error || !staff) return (
    <div className="min-h-screen bg-[#f6f7fb] flex flex-col items-center justify-center text-center px-5">
      <p className="text-sm text-red-600 mb-1">Couldn&apos;t load this staff member.</p>
      <p className="text-xs text-[#5a6380]">{error}</p>
    </div>
  );

  const hasSocials = staff.linkedin || staff.researchGate || staff.googleScholar;

  return (
    <div className="bg-[#f6f7fb] min-h-screen">

      {/* ════════════ HERO ════════════ */}
      <div className="relative bg-[#0b1730] overflow-hidden">
        {/* dot pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(232,93,20,0.5) 1.5px, transparent 1.5px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* orange glow */}
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-10"
          style={{ background: "radial-gradient(ellipse at 80% 40%, #e85d14 0%, transparent 70%)" }}
        />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-14">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-white/40 text-xs mb-8">
            <Link href="/" className="hover:text-[#e85d14] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/staff" className="hover:text-[#e85d14] transition-colors">Staff</Link>
            <ChevronRight size={12} />
            <span className="text-white/70">{staff.name}</span>
          </div>

          {/* Profile row */}
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            {/* Photo */}
            <div className="relative shrink-0">
              <img
                src={staff.photo}
                alt={staff.name}
                className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover border-4 border-white/10 shadow-2xl"
              />
              <span className="absolute -bottom-2 -right-2 bg-[#e85d14] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                {staff.category === "academics" ? "Academic" :
                 staff.category === "director" ? "Director" :
                 staff.category === "head-of-division" ? "HOD" : "Staff"}
              </span>
            </div>

            {/* Name + meta */}
            <div className="flex-1">
              <p className="text-[#e85d14] text-xs font-semibold uppercase tracking-widest mb-2">
                {categoryLabel(staff.category)}
              </p>
              <h1 className="text-white font-extrabold text-3xl md:text-4xl leading-tight mb-1">
                {staff.name}
              </h1>
              <p className="text-white/60 text-base mb-5">{staff.position}</p>

              {/* Quick contact chips */}
              <div className="flex flex-wrap gap-3">
                {staff.email && (
                  <a href={`mailto:${staff.email}`}
                    className="flex items-center gap-2 bg-white/10 hover:bg-[#e85d14] text-white text-xs font-medium px-4 py-2 rounded-full transition-colors">
                    <Mail size={13} /> {staff.email}
                  </a>
                )}
                {staff.phone && (
                  <a href={`tel:${staff.phone}`}
                    className="flex items-center gap-2 bg-white/10 hover:bg-[#e85d14] text-white text-xs font-medium px-4 py-2 rounded-full transition-colors">
                    <Phone size={13} /> {staff.phone}
                  </a>
                )}
                {staff.office && staff.office !== "—" && (
                  <span className="flex items-center gap-2 bg-white/10 text-white/70 text-xs font-medium px-4 py-2 rounded-full">
                    <MapPin size={13} /> {staff.office}
                  </span>
                )}
              </div>
            </div>

            {/* Social icons (desktop) */}
            {hasSocials && (
              <div className="hidden md:flex flex-col gap-3">
                {staff.linkedin && (
                  <a href={staff.linkedin} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#0077b5] flex items-center justify-center text-white transition-colors" title="LinkedIn">
                    <FaLinkedin size={18} />
                  </a>
                )}
                {staff.researchGate && (
                  <a href={staff.researchGate} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#00d0af] flex items-center justify-center text-white transition-colors" title="ResearchGate">
                    <FaResearchgate size={18} />
                  </a>
                )}
                {staff.googleScholar && (
                  <a href={staff.googleScholar} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#4285f4] flex items-center justify-center text-white transition-colors" title="Google Scholar">
                    <SiGooglescholar size={16} />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ════════════ STAT BAR ════════════ */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {[
              { icon: Building2,  label: "Department", value: staff.dept },
              { icon: IdCard,     label: "Staff ID",   value: staff.staffId },
              { icon: Calendar,   label: "Joined",     value: staff.joined },
              { icon: MapPin,     label: "Office",     value: staff.office },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 px-6 py-4">
                <div className="w-9 h-9 rounded-lg bg-[#e85d14]/10 flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-[#e85d14]" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#5a6380]">{label}</div>
                  <div className="text-sm font-semibold text-[#0b1730] truncate max-w-[140px]">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════ BODY ════════════ */}
      <div className="max-w-[1400px] mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">

        {/* ── LEFT COLUMN ── */}
        <div className="space-y-6">

          {/* About */}
          {staff.about && (
            <Section icon={<BookOpen size={18} className="text-[#e85d14]" />} title="About">
              <p className="text-gray-600 leading-relaxed text-sm">{staff.about}</p>
            </Section>
          )}

          {/* Qualifications */}
          {staff.quals.length > 0 && (
            <Section icon={<GraduationCap size={18} className="text-[#e85d14]" />} title="Qualifications">
              <div className="space-y-3">
                {staff.quals.map((q, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-[#e85d14]/10 flex items-center justify-center shrink-0 text-[#e85d14] text-xs font-bold mt-0.5">
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-[#0b1730] text-sm">{q.degree}</div>
                      <div className="text-xs text-[#5a6380] mt-0.5">{q.inst}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Experience */}
          {staff.exp.length > 0 && (
            <Section icon={<Briefcase size={18} className="text-[#e85d14]" />} title="Experience">
              <div className="relative pl-5 border-l-2 border-[#e85d14]/20 space-y-5">
                {staff.exp.map((e, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-[#e85d14] border-2 border-white shadow" />
                    <div className="font-semibold text-[#0b1730] text-sm">{e.role}</div>
                    <div className="text-xs text-[#5a6380] mt-0.5">{e.place}</div>
                    {e.year && (
                      <span className="inline-block mt-1.5 text-[10px] font-semibold bg-[#e85d14]/10 text-[#e85d14] px-2.5 py-0.5 rounded-full">
                        {e.year}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Subjects */}
          {staff.subjects.length > 0 && (
            <Section icon={<BookOpen size={18} className="text-[#e85d14]" />} title="Subjects Taught">
              <div className="flex flex-wrap gap-2">
                {staff.subjects.map((s, i) => (
                  <span key={i}
                    className="bg-[#0b1730]/5 text-[#0b1730] border border-[#0b1730]/10 text-xs font-medium px-3 py-1.5 rounded-full">
                    {s}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* Publications */}
          {staff.pubs.length > 0 && (
            <Section icon={<FlaskConical size={18} className="text-[#e85d14]" />} title="Publications">
              <div className="space-y-4">
                {staff.pubs.map((p, i) => (
                  <div key={i} className="border-l-2 border-[#e85d14]/30 pl-4">
                    <div className="font-semibold text-[#0b1730] text-sm leading-snug">{p.title}</div>
                    {p.venue && <div className="text-xs text-[#5a6380] mt-1 italic">{p.venue}</div>}
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div className="space-y-5">

          {/* Contact card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-[#0b1730] to-[#122347] px-5 py-4">
              <h3 className="text-white font-bold text-sm">Contact Information</h3>
            </div>
            <div className="p-5 space-y-3">
              {staff.email && (
                <a href={`mailto:${staff.email}`}
                  className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#e85d14] transition-colors group">
                  <span className="w-8 h-8 rounded-lg bg-[#e85d14]/10 flex items-center justify-center shrink-0 group-hover:bg-[#e85d14] transition-colors">
                    <Mail size={14} className="text-[#e85d14] group-hover:text-white" />
                  </span>
                  <span className="truncate">{staff.email}</span>
                </a>
              )}
              {staff.phone && (
                <a href={`tel:${staff.phone}`}
                  className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#e85d14] transition-colors group">
                  <span className="w-8 h-8 rounded-lg bg-[#e85d14]/10 flex items-center justify-center shrink-0 group-hover:bg-[#e85d14] transition-colors">
                    <Phone size={14} className="text-[#e85d14] group-hover:text-white" />
                  </span>
                  {staff.phone}
                </a>
              )}
              {staff.office && staff.office !== "—" && (
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <span className="w-8 h-8 rounded-lg bg-[#e85d14]/10 flex items-center justify-center shrink-0">
                    <MapPin size={14} className="text-[#e85d14]" />
                  </span>
                  {staff.office}
                </div>
              )}
            </div>
          </div>

          {/* Academic profiles */}
          {hasSocials && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-[#0b1730] to-[#122347] px-5 py-4">
                <h3 className="text-white font-bold text-sm">Academic Profiles</h3>
              </div>
              <div className="p-5 space-y-3">
                {staff.linkedin && (
                  <a href={staff.linkedin} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-[#0077b5] transition-colors group">
                    <span className="w-8 h-8 rounded-lg bg-[#0077b5]/10 flex items-center justify-center shrink-0 group-hover:bg-[#0077b5] transition-colors">
                      <FaLinkedin size={15} className="text-[#0077b5] group-hover:text-white" />
                    </span>
                    LinkedIn Profile
                    <ExternalLink size={11} className="ml-auto text-gray-400" />
                  </a>
                )}
                {staff.researchGate && (
                  <a href={staff.researchGate} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-[#00d0af] transition-colors group">
                    <span className="w-8 h-8 rounded-lg bg-[#00d0af]/10 flex items-center justify-center shrink-0 group-hover:bg-[#00d0af] transition-colors">
                      <FaResearchgate size={15} className="text-[#00d0af] group-hover:text-white" />
                    </span>
                    ResearchGate
                    <ExternalLink size={11} className="ml-auto text-gray-400" />
                  </a>
                )}
                {staff.googleScholar && (
                  <a href={staff.googleScholar} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-[#4285f4] transition-colors group">
                    <span className="w-8 h-8 rounded-lg bg-[#4285f4]/10 flex items-center justify-center shrink-0 group-hover:bg-[#4285f4] transition-colors">
                      <SiGooglescholar size={14} className="text-[#4285f4] group-hover:text-white" />
                    </span>
                    Google Scholar
                    <ExternalLink size={11} className="ml-auto text-gray-400" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Back button */}
          <Link href="/staff"
            className="flex items-center justify-center gap-2 w-full bg-[#0b1730] hover:bg-[#0f2a5e] text-white text-sm font-semibold py-3 rounded-2xl transition-colors">
            ← Back to Staff
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Reusable section card ──
function Section({ icon, title, children }: {
  icon: React.ReactNode; title: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-100">
        {icon}
        <h2 className="font-bold text-[#0b1730] text-sm uppercase tracking-wide">{title}</h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}