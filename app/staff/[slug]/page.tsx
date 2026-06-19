"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

// ===== API CONFIG =====
// Set NEXT_PUBLIC_API_URL in .env.local to override (e.g. for production).
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

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
}

// Normalizes whatever shape the Laravel API returns for a single staff
// member into the StaffDetail shape this page renders.
function normalizeStaffDetail(json: unknown): StaffDetail {
  const item: any = (json as any)?.data ?? json ?? {};

  return {
    name: item.name ?? "",
    position: item.position ?? "",
    category: item.category ?? "",
    email: item.email ?? "",
    photo:
      item.photo ??
      item.image ??
      item.image_url ??
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400",
    about: item.about ?? "",
    office: item.office ?? "",
    dept: item.dept ?? item.department ?? "",
    staffId: item.staffId ?? item.staff_id ?? "",
    joined: item.joined ?? item.joined_at ?? "",
    quals: Array.isArray(item.quals)
      ? item.quals
      : Array.isArray(item.qualifications)
      ? item.qualifications.map((q: any) => ({
          degree: q.degree ?? "",
          inst: q.inst ?? q.institution ?? "",
        }))
      : [],
    exp: Array.isArray(item.exp)
      ? item.exp
      : Array.isArray(item.experience)
      ? item.experience.map((e: any) => ({
          role: e.role ?? "",
          place: e.place ?? "",
          year: e.year ?? "",
        }))
      : [],
    subjects: Array.isArray(item.subjects) ? item.subjects : [],
    pubs: Array.isArray(item.pubs)
      ? item.pubs
      : Array.isArray(item.publications)
      ? item.publications.map((p: any) => ({
          title: p.title ?? "",
          venue: p.venue ?? "",
        }))
      : [],
  };
}

export default function StaffDetailsPage() {
  const params = useParams();
  const id = params.slug as string;

  const [staff, setStaff] = useState<StaffDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function fetchStaffDetail() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/staff/${id}`, {
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
  }, [id]);

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
            {API_URL}/staff/{id}
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
            className="w-36 h-36 rounded-2xl object-cover border-4 border-white/20"
          />

          <div>
            <span className="bg-white/10 px-3 py-1 rounded-full text-xs">
              {staff.category}
            </span>

            <h1 className="text-4xl font-bold mt-2">{staff.name}</h1>
            <p className="text-white/70">{staff.position}</p>

            <div className="mt-3 text-sm">📧 {staff.email}</div>
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
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="font-bold text-lg mb-3">Qualifications</h2>

            {staff.quals.map((q, i) => (
              <div key={i} className="mb-3">
                <div className="font-semibold">{q.degree}</div>
                <div className="text-sm text-gray-600">{q.inst}</div>
              </div>
            ))}
          </div>

          {/* EXPERIENCE */}
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

          {/* SUBJECTS */}
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

          {/* PUBLICATIONS */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="font-bold text-lg mb-3">Publications</h2>

            {staff.pubs.map((p, i) => (
              <div key={i} className="mb-3">
                <div className="font-semibold">{p.title}</div>
                <div className="text-sm text-gray-600">{p.venue}</div>
              </div>
            ))}
          </div>
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

            <p>📧 {staff.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}