"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

// ===== API CONFIG =====
const RAW_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";
const ORIGIN = RAW_BASE.replace(/\/api\/?$/, "");
const API_URL = `${ORIGIN}/api`;

function resolveImage(path: string | null | undefined): string {
  if (!path) return "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400";
  if (/^https?:\/\//i.test(path)) return path;
  return `${ORIGIN}/${path.replace(/^\/+/, "")}`;
}

interface Qualification {
  degree: string;
  inst: string;
}

interface Experience {
  role: string;
  place: string;
  year: string;
}

interface Publication {
  title: string;
  venue: string;
}

interface StaffDetail {
  name: string;
  position: string;
  category: string;
  email: string;
  phone: string;
  photo: string;
  about: string;
  office: string;
  dept: string;
  staffId: string;
  joined: string;
  quals: Qualification[];
  exp: Experience[];
  subjects: string[];
  pubs: Publication[];
  linkedin: string;
  researchGate: string;
  googleScholar: string;
}

// FIX: backend's StaffController@show returns the record under
// data.staffMember (see Laravel controller), but this was previously
// looking for data.staff — which never matched, so item resolved to
// {} and every field silently fell back to its default ("—", "",
// "No bio added yet."). Now checks staffMember first, with the old
// "staff" key kept as a fallback in case any other endpoint uses it.
function normalizeStaffDetail(json: unknown): StaffDetail {
  const item: any =
    (json as any)?.data?.staffMember ??
    (json as any)?.data?.staff ??
    (json as any)?.data ??
    json ??
    {};

  return {
    name: item.name ?? "",
    position: item.position ?? "",
    category: item.category ?? "",
    email: item.email ?? "",
    phone: item.phone ?? "",
    photo: resolveImage(item.photo),
    about: item.about ?? "No bio added yet.",
    office: item.office ?? "—",
    dept:
      typeof item.department === "string"
        ? item.department
        : item.department?.name ?? "—",
    staffId: item.staff_id ?? "—",
    joined: item.joined_date ?? "—",
    quals: Array.isArray(item.qualifications)
      ? item.qualifications.map((q: any) => ({
          degree: q.degree ?? q.title ?? q.qualification ?? "",
          inst: q.inst ?? q.institution ?? "",
        }))
      : [],
    exp: Array.isArray(item.experience)
      ? item.experience.map((e: any) => ({
          role: e.role ?? e.position ?? "",
          place: e.place ?? e.organization ?? "",
          year: e.year ?? e.duration ?? "",
        }))
      : [],
    subjects: Array.isArray(item.subjects) ? item.subjects : [],
    pubs: Array.isArray(item.publications)
      ? item.publications.map((p: any) => ({
          title: p.title ?? "",
          venue: p.venue ?? p.journal ?? "",
        }))
      : [],
    linkedin: item.linkedin ?? "",
    researchGate: item.research_gate ?? "",
    googleScholar: item.google_scholar ?? "",
  };
}

export default function StaffDetailsPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [staff, setStaff] = useState<StaffDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    async function fetchStaffDetail() {
      setLoading(true);
      setError(null);
      try {
        // FIX: endpoint is /staffs/{slug}, not /staff/{id}
        const res = await fetch(`${API_URL}/staffs/${slug}`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        const json = await res.json();
        if (!cancelled) {
          setStaff(normalizeStaffDetail(json));
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load staff member."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchStaffDetail();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-[#f6f7fb] min-h-screen flex flex-col items-center justify-center text-[#5a6380]">
        <Loader2 className="animate-spin mb-3" size={28} />
        <p className="text-[14px]">Loading staff member…</p>
      </div>
    );
  }

  if (error || !staff) {
    return (
      <div className="bg-[#f6f7fb] min-h-screen flex flex-col items-center justify-center text-center px-5">
        <p className="text-[14px] text-red-600 mb-2">
          Couldn&apos;t load this staff member.
        </p>
        <p className="text-[12px] text-[#5a6380]">{error}</p>
        <p className="text-[12px] text-[#5a6380] mt-1">
          Make sure the Laravel API is running at{" "}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded">
            {API_URL}/staffs/{slug}
          </code>{" "}
          and CORS allows this origin.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#f6f7fb] min-h-screen">
      {/* ===== HERO ===== */}
      <div className="bg-gradient-to-r from-[#0b1730] to-[#1a3060] text-white">
        <div className="max-w-6xl mx-auto px-5 py-14 flex flex-col md:flex-row gap-8 items-center">
          <img
            src={staff.photo}
            alt={staff.name}
            className="w-36 h-36 rounded-2xl object-cover border-4 border-white/20"
          />

          <div>
            <span className="bg-white/10 px-3 py-1 rounded-full text-xs">
              {staff.category}
            </span>

            <h1 className="text-4xl font-bold mt-2">{staff.name}</h1>
            <p className="text-white/70">{staff.position}</p>

            <div className="mt-3 text-sm flex flex-col gap-1">
              {staff.email && <span>📧 {staff.email}</span>}
              {staff.phone && <span>📱 {staff.phone}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="max-w-6xl mx-auto px-5 py-10 grid lg:grid-cols-[1fr_350px] gap-8">
        {/* LEFT */}
        <div className="space-y-6">
          {/* ABOUT */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="font-bold text-lg mb-3">About</h2>
            <p>{staff.about}</p>
          </div>

          {/* QUALIFICATIONS */}
          {staff.quals.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="font-bold text-lg mb-3">Qualifications</h2>
              {staff.quals.map((q, i) => (
                <div key={i} className="mb-3">
                  <div className="font-semibold">{q.degree}</div>
                  <div className="text-sm text-gray-600">{q.inst}</div>
                </div>
              ))}
            </div>
          )}

          {/* EXPERIENCE */}
          {staff.exp.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="font-bold text-lg mb-3">Experience</h2>
              {staff.exp.map((e, i) => (
                <div key={i} className="mb-3 border-l-2 pl-3">
                  <div className="font-semibold">{e.role}</div>
                  <div className="text-sm">{e.place}</div>
                  <div className="text-xs text-gray-500">{e.year}</div>
                </div>
              ))}
            </div>
          )}

          {/* SUBJECTS */}
          {staff.subjects.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="font-bold text-lg mb-3">Subjects</h2>
              <div className="flex flex-wrap gap-2">
                {staff.subjects.map((s, i) => (
                  <span key={i} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* PUBLICATIONS */}
          {staff.pubs.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="font-bold text-lg mb-3">Publications</h2>
              {staff.pubs.map((p, i) => (
                <div key={i} className="mb-3">
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-sm text-gray-600">{p.venue}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="font-bold mb-3">At a Glance</h2>
            <p>📅 Joined: {staff.joined}</p>
            <p>🏢 Department: {staff.dept}</p>
            <p>🆔 Staff ID: {staff.staffId}</p>
            <p>🏢 Office: {staff.office}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="font-bold mb-3">Contact</h2>
            {staff.email && <p>📧 {staff.email}</p>}
            {staff.phone && <p>📱 {staff.phone}</p>}
            {staff.linkedin && (
              <p>
                <a href={staff.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#0b1730] hover:text-[#e85d14]">
                  LinkedIn ↗
                </a>
              </p>
            )}
            {staff.researchGate && (
              <p>
                <a href={staff.researchGate} target="_blank" rel="noopener noreferrer" className="text-[#0b1730] hover:text-[#e85d14]">
                  ResearchGate ↗
                </a>
              </p>
            )}
            {staff.googleScholar && (
              <p>
                <a href={staff.googleScholar} target="_blank" rel="noopener noreferrer" className="text-[#0b1730] hover:text-[#e85d14]">
                  Google Scholar ↗
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}