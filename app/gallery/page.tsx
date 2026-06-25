"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const RAW_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";
const ORIGIN = RAW_BASE.replace(/\/api\/?$/, "");
const API_BASE = `${ORIGIN}/api`;

const FP_MONTH_FULL = [
  "", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const FP_MONTH_SHORT = [
  "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const FP_CURRENT_YEAR = new Date().getFullYear();

const MONTH_NAME_TO_NUM: Record<string, number> = Object.fromEntries(
  FP_MONTH_FULL.slice(1).map((name, i) => [name.toLowerCase(), i + 1])
);

function parseMonth(raw: unknown): number {
  if (typeof raw === "number") return raw;
  if (typeof raw === "string") {
    const byName = MONTH_NAME_TO_NUM[raw.trim().toLowerCase()];
    if (byName) return byName;
    const asNum = Number(raw);
    if (!Number.isNaN(asNum)) return asNum;
  }
  return 1;
}

const FP_EVENT_META: Record<string, { label: string; icon: string; bg: string }> = {
  pongal:      { label: "தைப்பொங்கல்", icon: "🔥", bg: "#7d3c00" },
  anniversary: { label: "Anniversary",  icon: "🎂", bg: "#0a1f44" },
  talent:      { label: "Talent Show",  icon: "⭐", bg: "#4c1d95" },
  sports:      { label: "Sports Day",   icon: "🏃", bg: "#064e3b" },
  tech:        { label: "Tech Fest",    icon: "💻", bg: "#1e3a5f" },
  seminar:     { label: "Seminar",      icon: "🎓", bg: "#1e293b" },
  ceremony:    { label: "Ceremony",     icon: "👘", bg: "#3b0764" },
  cultural:    { label: "Cultural",     icon: "🎵", bg: "#7c2d12" },
};
const FALLBACK_COLORS = ["#334155","#5b21b6","#0f766e","#9d174d","#854d0e","#1e40af"];

function metaFor(key: string) {
  if (FP_EVENT_META[key]) return FP_EVENT_META[key];
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return {
    label: key.charAt(0).toUpperCase() + key.slice(1),
    icon: "📷",
    bg: FALLBACK_COLORS[hash % FALLBACK_COLORS.length],
  };
}

function buildImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${ORIGIN}/${path.replace(/^\/+/, "")}`;
}

// ── Types ──────────────────────────────────────────────────────────────────────
interface AlbumImage {
  id: number;
  url: string;
  caption: string;
}

interface Album {
  id: number;
  title: string;
  description: string;
  category: string;
  month: number;
  year: number;
  cover_image: string | null;
  image_count: number;
}

interface AlbumDetail extends Album {
  images: AlbumImage[];
}

interface FilterState {
  year: number;
  month: number | "all";
  event: string;
}

interface EventOption {
  key: string;
  label: string;
  icon: string;
}

function normalizeAlbum(raw: any): Album {
  return {
    id:          Number(raw.id),
    title:       String(raw.title ?? ""),
    description: String(raw.description ?? ""),
    category:    String(raw.category ?? raw.event ?? "cultural"),
    month:       parseMonth(raw.month),
    year:        Number(raw.year),
    cover_image: buildImageUrl(raw.cover_image ?? raw.image ?? null),
    image_count: Number(raw.image_count ?? 0),
  };
}

// ── Album Card ─────────────────────────────────────────────────────────────────
function AlbumCard({ album, onClick }: { album: Album; onClick: () => void }) {
  const pal = metaFor(album.category);
  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col"
      style={{ boxShadow: "0 2px 12px rgba(11,23,48,0.07)" }}
    >
      {/* Cover */}
      <div
        className="relative h-[210px] overflow-hidden flex items-center justify-center shrink-0"
        style={{ background: pal.bg }}
      >
        {album.cover_image ? (
          <img
            src={album.cover_image}
            alt={album.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : null}
        {/* Dark gradient overlay always present */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        <span className="text-[3rem] z-10 select-none drop-shadow-lg">{pal.icon}</span>

        {/* Image count badge */}
        <span className="absolute bottom-3 right-3 z-10 bg-black/50 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-white/10">
          <i className="fas fa-images text-[10px] text-[#e85d14]"></i>
          {album.image_count} photos
        </span>

        {/* Year badge */}
        <span className="absolute top-3 left-3 z-10 bg-[#0f2a5e]/80 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-lg border border-white/10">
          {album.year}
        </span>

        {/* Hover overlay CTA */}
        <div className="absolute inset-0 z-10 bg-[#e85d14]/0 group-hover:bg-[#e85d14]/10 transition-colors duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 bg-[#e85d14] text-white text-[12px] font-bold px-5 py-2.5 rounded-full flex items-center gap-2 shadow-lg">
            <i className="fas fa-eye text-[11px]"></i> View Album
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold uppercase tracking-wide text-[#e85d14] bg-orange-50 px-2.5 py-0.5 rounded-full">
            {pal.label}
          </span>
          <span className="text-[10px] text-gray-400 flex items-center gap-1">
            <i className="fas fa-calendar-alt text-[9px]"></i>
            {FP_MONTH_FULL[album.month]} {album.year}
          </span>
        </div>
        <div className="text-[14px] font-semibold text-[#0b1730] leading-snug">{album.title}</div>
        {album.description && (
          <div className="text-[12px] text-gray-400 line-clamp-2 leading-relaxed">{album.description}</div>
        )}
      </div>
    </div>
  );
}

// ── Album Lightbox ─────────────────────────────────────────────────────────────
function AlbumLightbox({ album, onClose }: { album: AlbumDetail; onClose: () => void }) {
  const [imgIndex, setImgIndex] = useState(0);
  const [view, setView] = useState<"grid" | "single">("grid");
  const pal = metaFor(album.category);
  const images = album.images;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (view === "single") {
        if (e.key === "ArrowLeft")  setImgIndex((i) => (i - 1 + images.length) % images.length);
        if (e.key === "ArrowRight") setImgIndex((i) => (i + 1) % images.length);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [view, images.length, onClose]);

  function openSingle(idx: number) { setImgIndex(idx); setView("single"); }

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col" style={{ background: "rgba(6,10,22,0.97)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 shrink-0 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          {view === "single" && (
            <button
              onClick={() => setView("grid")}
              className="w-9 h-9 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
              title="Back to grid"
            >
              <i className="fas fa-th-large text-[13px]"></i>
            </button>
          )}
          <div>
            <div className="text-white font-bold text-[15px] leading-tight">{album.title}</div>
            <div className="text-white/40 text-[11px] flex items-center gap-2 mt-0.5">
              <span>{pal.icon} {pal.label}</span>
              <span className="w-1 h-1 rounded-full bg-white/20 inline-block"></span>
              <span>{FP_MONTH_FULL[album.month]} {album.year}</span>
              <span className="w-1 h-1 rounded-full bg-white/20 inline-block"></span>
              <span>{images.length} photos</span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-[#e85d14] transition-colors"
        >
          <i className="fas fa-times text-[13px]"></i>
        </button>
      </div>

      {/* Grid view */}
      {view === "grid" && (
        <div className="flex-1 overflow-y-auto p-5">
          {images.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-white/30">
              <i className="fas fa-images text-[48px]"></i>
              <p className="text-[14px]">No images in this album.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-w-[1200px] mx-auto">
              {images.map((img, idx) => (
                <div
                  key={img.id}
                  onClick={() => openSingle(idx)}
                  className="group relative aspect-square rounded-xl overflow-hidden bg-white/5 cursor-pointer hover:ring-2 hover:ring-[#e85d14] transition-all duration-200"
                >
                  <img
                    src={img.url}
                    alt={img.caption || album.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <i className="fas fa-expand text-white opacity-0 group-hover:opacity-100 text-[18px] transition-opacity drop-shadow-lg"></i>
                  </div>
                  {img.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-[10px] leading-tight line-clamp-2">{img.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Single image view */}
      {view === "single" && images[imgIndex] && (
        <div className="flex-1 flex flex-col items-center justify-center relative px-16 py-6 overflow-hidden">
          <button
            onClick={() => setImgIndex((i) => (i - 1 + images.length) % images.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-[#e85d14] transition-colors z-10"
          >
            <i className="fas fa-chevron-left"></i>
          </button>

          <div className="max-w-[90vw] max-h-[68vh] flex items-center justify-center rounded-2xl overflow-hidden ring-1 ring-white/10">
            <img
              src={images[imgIndex].url}
              alt={images[imgIndex].caption || album.title}
              className="max-w-full max-h-[68vh] object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>

          <button
            onClick={() => setImgIndex((i) => (i + 1) % images.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-[#e85d14] transition-colors z-10"
          >
            <i className="fas fa-chevron-right"></i>
          </button>

          <div className="mt-4 text-center px-5">
            {images[imgIndex].caption && (
              <p className="text-white/60 text-[13px]">{images[imgIndex].caption}</p>
            )}
            <div className="text-white/30 text-[11px] mt-2 font-mono">{imgIndex + 1} / {images.length}</div>
          </div>

          {/* Thumbnail strip */}
          <div className="flex gap-2 mt-4 overflow-x-auto max-w-full px-4 pb-1 scrollbar-hide">
            {images.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setImgIndex(idx)}
                className={`shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all duration-200 ${idx === imgIndex ? "border-[#e85d14] scale-110" : "border-transparent opacity-40 hover:opacity-70"}`}
              >
                <img src={img.url} alt="" className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function GalleryPage() {
  const [allAlbums, setAllAlbums]           = useState<Album[]>([]);
  const [events, setEvents]                 = useState<EventOption[]>([{ key: "all", label: "All Events", icon: "🏠" }]);
  const [loading, setLoading]               = useState(true);
  const [loadError, setLoadError]           = useState<string | null>(null);
  const [latestDataYear, setLatestDataYear] = useState<number>(FP_CURRENT_YEAR);
  const [fpState, setFpState]               = useState<FilterState>({ year: FP_CURRENT_YEAR, month: "all", event: "all" });
  const [fpTmp, setFpTmp]                   = useState<FilterState>({ year: FP_CURRENT_YEAR, month: "all", event: "all" });
  const [curModal, setCurModal]             = useState<"year" | "month" | "event" | null>(null);
  const [search, setSearch]                 = useState("");

  const [openAlbum, setOpenAlbum]           = useState<AlbumDetail | null>(null);
  const [albumLoading, setAlbumLoading]     = useState(false);

  // Sentinel-based stuck detection (reliable cross-browser)
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-1px 0px 0px 0px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Close dropdown on outside click
  const filterRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!curModal) return;
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFpTmp({ ...fpState });
        setCurModal(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [curModal, fpState]);

  // Fetch all albums
  useEffect(() => {
    fetch(`${API_BASE}/gallery?per_page=9999`)
      .then((r) => {
        if (!r.ok) throw new Error(`Request failed (${r.status})`);
        return r.json();
      })
      .then((payload) => {
        const rawItems = payload?.data?.items?.data ?? [];
        const albums: Album[] = rawItems
          .filter((it: any) => it.is_active !== false)
          .map(normalizeAlbum);
        setAllAlbums(albums);

        const categoryCounts = payload?.data?.filters?.categories ?? {};
        const keys = Object.keys(categoryCounts);
        setEvents([
          { key: "all", label: "All Events", icon: "🏠" },
          ...keys.map((k) => {
            const m = metaFor(k);
            return { key: k, label: m.label, icon: m.icon };
          }),
        ]);

        const availableYears: number[] = payload?.data?.filters?.available_years ?? albums.map((d) => d.year);
        if (availableYears.length > 0) {
          const newest = Math.max(...availableYears);
          setLatestDataYear(newest);
          setFpState((s) => ({ ...s, year: newest }));
          setFpTmp((s) => ({ ...s, year: newest }));
        }
      })
      .catch((err) => {
        setAllAlbums([]);
        setLoadError(err.message || "Could not load gallery");
      })
      .finally(() => setLoading(false));
  }, []);

  // Open album → fetch detail
  async function handleOpenAlbum(album: Album) {
    setAlbumLoading(true);
    try {
      const res = await fetch(`${API_BASE}/gallery/${album.id}`);
      if (!res.ok) throw new Error("Failed");
      const payload = await res.json();
      const raw = payload?.data?.album ?? payload?.data;
      setOpenAlbum({
        ...normalizeAlbum(raw),
        images: (raw.images ?? []).map((img: any) => ({
          id:      Number(img.id),
          url:     buildImageUrl(img.url ?? img.image) ?? "",
          caption: String(img.caption ?? ""),
        })),
      });
    } catch {
      setOpenAlbum({ ...album, images: [] });
    } finally {
      setAlbumLoading(false);
    }
  }

  const years = [...new Set([latestDataYear, ...allAlbums.map((d) => d.year)])].sort((a, b) => b - a);
  const monthsForYear = (y: number) => new Set(allAlbums.filter((d) => d.year === y).map((d) => d.month));
  const countEvent = (k: string, y: number) =>
    k === "all"
      ? allAlbums.filter((d) => d.year === y).length
      : allAlbums.filter((d) => d.category === k && d.year === y).length;

  const visible = allAlbums
    .filter(
      (d) =>
        d.year === fpState.year &&
        (fpState.month === "all" || d.month === fpState.month) &&
        (fpState.event === "all" || d.category === fpState.event) &&
        (!search ||
          d.title.toLowerCase().includes(search.toLowerCase()) ||
          d.description.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => a.month - b.month || a.id - b.id);

  function applyModal() { setFpState({ ...fpTmp }); setCurModal(null); }
  function openModal(type: "year" | "month" | "event") {
    setFpTmp({ ...fpState });
    setCurModal(curModal === type ? null : type);
  }
  function clearAll() {
    const reset = { year: latestDataYear, month: "all" as const, event: "all" };
    setFpState(reset);
    setFpTmp(reset);
    setCurModal(null);
  }

  const hasActiveFilters = fpState.month !== "all" || fpState.event !== "all" || fpState.year !== latestDataYear;

  return (
    <>
      {/* ── HERO ── */}
      <section
        className="relative flex flex-col items-center justify-center text-center py-16 overflow-hidden w-full"
        style={{ background: "linear-gradient(135deg,#0b1730 0%,#1a3060 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle,rgba(232,93,20,0.6) 1.5px,transparent 1.5px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Accent blur blobs */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#e85d14]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-[#1a3060] rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 px-5">
          <div className="inline-flex items-center gap-2 text-[#e85d14] text-[11px] font-bold tracking-widest uppercase mb-4 bg-[#e85d14]/10 border border-[#e85d14]/20 px-4 py-1.5 rounded-full">
            <i className="fas fa-camera"></i>
            Gallery
          </div>
          <h1 className="text-white font-extrabold leading-tight mb-4" style={{ fontSize: "clamp(28px,5vw,48px)" }}>
            College <span className="text-[#e85d14]">Moments</span>
          </h1>
          <p className="text-white/60 text-[14px] mb-5 max-w-[460px] mx-auto leading-relaxed">
            Explore events, celebrations, and memories from University College of Jaffna
          </p>
          <div className="text-white/40 text-[13px]">
            <Link href="/" className="hover:text-[#e85d14] transition-colors">Home</Link>
            <span className="mx-2 text-white/20">/</span>
            <span className="text-[#e85d14]">Gallery</span>
          </div>
        </div>
      </section>

      {/* ── SENTINEL (for intersection observer stuck detection) ── */}
      <div ref={sentinelRef} className="h-px w-full" aria-hidden="true" />

      {/* ── FILTER PANEL ── */}
      <div
        ref={filterRef}
        className={`sticky top-0 z-40 bg-white transition-all duration-200 ${
          isStuck
            ? "shadow-[0_4px_24px_rgba(11,23,48,0.12)] border-b border-gray-100"
            : "border-b border-gray-100"
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-5 py-3.5 flex flex-col gap-3">
          {/* Row 1: Search + count */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 hover:border-[#e85d14]/50 rounded-xl px-3 py-2 flex-1 min-w-[180px] max-w-[320px] transition-colors focus-within:border-[#e85d14] focus-within:ring-2 focus-within:ring-[#e85d14]/10">
              <i className="fas fa-search text-gray-400 text-[12px] shrink-0"></i>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search albums…"
                className="bg-transparent outline-none text-[13px] text-[#0b1730] placeholder:text-gray-400 w-full"
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-gray-300 hover:text-gray-500 transition-colors shrink-0">
                  <i className="fas fa-times text-[11px]"></i>
                </button>
              )}
            </div>

            {/* Stats badge */}
            <div className="ml-auto flex items-center gap-2 text-[12px] text-gray-400">
              <span>
                <strong className="text-[#0b1730] font-semibold">{visible.length}</strong> albums
              </span>
              {fpState.year === latestDataYear && (
                <span className="bg-[#e85d14]/10 text-[#e85d14] text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wide">
                  ✦ Latest
                </span>
              )}
            </div>
          </div>

          {/* Row 2: Filter chips */}
          <div className="flex gap-2 flex-wrap items-center">
            {/* Year */}
            <button
              onClick={() => openModal("year")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-[12px] font-semibold transition-all duration-150 ${
                curModal === "year"
                  ? "bg-[#e85d14] text-white border-[#e85d14] shadow-sm"
                  : "bg-white text-[#0b1730] border-gray-200 hover:border-[#e85d14] hover:text-[#e85d14]"
              }`}
            >
              <i className="fas fa-calendar-alt text-[10px]"></i>
              <span>{fpState.year}</span>
              <i className={`fas fa-chevron-down text-[9px] transition-transform duration-200 ${curModal === "year" ? "rotate-180" : ""}`}></i>
            </button>

            {/* Month */}
            <button
              onClick={() => openModal("month")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-[12px] font-semibold transition-all duration-150 ${
                curModal === "month"
                  ? "bg-[#e85d14] text-white border-[#e85d14] shadow-sm"
                  : fpState.month !== "all"
                  ? "bg-orange-50 text-[#e85d14] border-[#e85d14]/40"
                  : "bg-white text-[#0b1730] border-gray-200 hover:border-[#e85d14] hover:text-[#e85d14]"
              }`}
            >
              <i className="fas fa-calendar-check text-[10px]"></i>
              <span>{fpState.month === "all" ? "Month" : FP_MONTH_SHORT[fpState.month as number]}</span>
              <i className={`fas fa-chevron-down text-[9px] transition-transform duration-200 ${curModal === "month" ? "rotate-180" : ""}`}></i>
            </button>

            {/* Event */}
            <button
              onClick={() => openModal("event")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-[12px] font-semibold transition-all duration-150 ${
                curModal === "event"
                  ? "bg-[#e85d14] text-white border-[#e85d14] shadow-sm"
                  : fpState.event !== "all"
                  ? "bg-orange-50 text-[#e85d14] border-[#e85d14]/40"
                  : "bg-white text-[#0b1730] border-gray-200 hover:border-[#e85d14] hover:text-[#e85d14]"
              }`}
            >
              <i className="fas fa-tag text-[10px]"></i>
              <span>
                {fpState.event === "all"
                  ? "Event"
                  : (events.find((e) => e.key === fpState.event)?.label ?? "Event")}
              </span>
              <i className={`fas fa-chevron-down text-[9px] transition-transform duration-200 ${curModal === "event" ? "rotate-180" : ""}`}></i>
            </button>

            {/* Clear all */}
            {hasActiveFilters && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] text-gray-400 hover:text-[#e85d14] transition-colors"
              >
                <i className="fas fa-times-circle text-[11px]"></i>
                Clear
              </button>
            )}
          </div>
        </div>

        {/* ── Dropdown Panels ── */}
        {curModal && (
          <div className="border-t border-gray-100 bg-white shadow-xl">
            <div className="max-w-[1280px] mx-auto px-5 py-5">

              {/* Year picker */}
              {curModal === "year" && (
                <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-2">
                  {years.map((y) => (
                    <button
                      key={y}
                      onClick={() => setFpTmp((t) => ({ ...t, year: y }))}
                      className={`rounded-xl py-3 px-2 text-center text-[13px] font-bold border transition-all duration-150 ${
                        fpTmp.year === y
                          ? "bg-[#e85d14] text-white border-[#e85d14] shadow-sm scale-[1.03]"
                          : "bg-gray-50 text-[#0b1730] border-gray-200 hover:border-[#e85d14] hover:bg-orange-50"
                      }`}
                    >
                      {y}
                      <div className="text-[10px] font-normal mt-0.5 opacity-60">
                        {allAlbums.filter((d) => d.year === y).length} albums
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Month picker */}
              {curModal === "month" && (
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  <button
                    onClick={() => setFpTmp((t) => ({ ...t, month: "all" }))}
                    className={`col-span-2 sm:col-span-1 rounded-xl py-2.5 text-[12px] font-bold border transition-all duration-150 ${
                      fpTmp.month === "all"
                        ? "bg-[#e85d14] text-white border-[#e85d14]"
                        : "bg-gray-50 text-[#0b1730] border-gray-200 hover:border-[#e85d14] hover:bg-orange-50"
                    }`}
                  >
                    All
                  </button>
                  {FP_MONTH_SHORT.slice(1).map((m, i) => {
                    const mo = i + 1;
                    const has = monthsForYear(fpTmp.year).has(mo);
                    return (
                      <button
                        key={m}
                        onClick={() => has && setFpTmp((t) => ({ ...t, month: mo }))}
                        className={`rounded-xl py-2.5 text-[12px] font-bold border transition-all duration-150 ${
                          fpTmp.month === mo
                            ? "bg-[#e85d14] text-white border-[#e85d14]"
                            : has
                            ? "bg-gray-50 text-[#0b1730] border-gray-200 hover:border-[#e85d14] hover:bg-orange-50"
                            : "bg-gray-50/50 text-gray-300 border-gray-100 cursor-not-allowed"
                        }`}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Event picker */}
              {curModal === "event" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  {events.map((ev) => (
                    <button
                      key={ev.key}
                      onClick={() => setFpTmp((t) => ({ ...t, event: ev.key }))}
                      className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl border text-[12px] font-semibold transition-all duration-150 ${
                        fpTmp.event === ev.key
                          ? "bg-[#e85d14] text-white border-[#e85d14] shadow-sm"
                          : "bg-gray-50 text-[#0b1730] border-gray-200 hover:border-[#e85d14] hover:bg-orange-50"
                      }`}
                    >
                      <span className="text-[16px] leading-none">{ev.icon}</span>
                      <div className="text-left min-w-0">
                        <div className="text-[12px] font-bold leading-tight truncate">{ev.label}</div>
                        <div className="text-[10px] opacity-60 mt-0.5">{countEvent(ev.key, fpTmp.year)} albums</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Action row */}
              <div className="flex gap-2 mt-5 justify-end border-t border-gray-100 pt-4">
                <button
                  onClick={() => { setFpTmp({ ...fpState }); setCurModal(null); }}
                  className="px-5 py-2 rounded-xl border border-gray-200 text-[13px] text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={applyModal}
                  className="px-6 py-2 rounded-xl bg-[#e85d14] text-white text-[13px] font-bold hover:bg-[#c74d0f] transition-colors shadow-sm"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── ALBUM GRID ── */}
      <section className="py-10 px-5 bg-[#f8f9fc] min-h-[400px]">
        <div className="max-w-[1280px] mx-auto">
          {loading ? (
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1,2,3,4,5,6,7,8].map((i) => (
                <div key={i} className="rounded-2xl overflow-hidden bg-white border border-gray-100 animate-pulse">
                  <div className="h-[210px] bg-gray-100" />
                  <div className="p-4 flex flex-col gap-2.5">
                    <div className="h-2.5 bg-gray-100 rounded-full w-2/3" />
                    <div className="h-2.5 bg-gray-100 rounded-full w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : loadError ? (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                <i className="fas fa-triangle-exclamation text-[24px] text-gray-300"></i>
              </div>
              <h3 className="text-[17px] font-bold text-gray-400">Could not load gallery</h3>
              <p className="text-[13px] text-gray-400">{loadError}</p>
            </div>
          ) : visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                <i className="fas fa-images text-[24px] text-gray-300"></i>
              </div>
              <h3 className="text-[17px] font-bold text-gray-400">No albums found</h3>
              <p className="text-[13px] text-gray-400">Try a different year, month, or event.</p>
              <button
                onClick={clearAll}
                className="mt-1 px-5 py-2.5 rounded-xl bg-[#e85d14] text-white text-[13px] font-bold hover:bg-[#c74d0f] transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visible.map((album) => (
                <AlbumCard
                  key={album.id}
                  album={album}
                  onClick={() => handleOpenAlbum(album)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Album loading spinner ── */}
      {albumLoading && (
        <div className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-white bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-8 py-6">
            <svg className="animate-spin h-8 w-8 text-[#e85d14]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <span className="text-[13px] font-semibold text-white/80">Loading album…</span>
          </div>
        </div>
      )}

      {/* ── Album Lightbox ── */}
      {openAlbum && (
        <AlbumLightbox album={openAlbum} onClose={() => setOpenAlbum(null)} />
      )}
    </>
  );
}