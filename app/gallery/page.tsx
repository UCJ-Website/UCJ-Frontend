"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// .env.local may or may not already include "/api" — normalize it here.
const RAW_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";
const ORIGIN = RAW_BASE.replace(/\/api\/?$/, "");
const API_BASE = `${ORIGIN}/api`;

const FP_MONTH_SHORT = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const FP_MONTH_FULL = ["","January","February","March","April","May","June","July","August","September","October","November","December"];
const FP_CURRENT_YEAR = new Date().getFullYear();

// Backend sends month as a name string ("June") — map to 1-12.
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
  pongal: { label: "தைப்பொங்கல்", icon: "🔥", bg: "#7d3c00" },
  anniversary: { label: "Anniversary", icon: "🎂", bg: "#0a1f44" },
  talent: { label: "Talent Show", icon: "⭐", bg: "#4c1d95" },
  sports: { label: "Sports Day", icon: "🏃", bg: "#064e3b" },
  tech: { label: "Tech Fest", icon: "💻", bg: "#1e3a5f" },
  seminar: { label: "Seminar", icon: "🎓", bg: "#1e293b" },
  ceremony: { label: "Ceremony", icon: "👘", bg: "#3b0764" },
  cultural: { label: "Cultural", icon: "🎵", bg: "#7c2d12" },
};

const FALLBACK_COLORS = ["#334155", "#5b21b6", "#0f766e", "#9d174d", "#854d0e", "#1e40af"];

function metaFor(key: string): { label: string; icon: string; bg: string } {
  if (FP_EVENT_META[key]) return FP_EVENT_META[key];
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return {
    label: key.charAt(0).toUpperCase() + key.slice(1),
    icon: "📷",
    bg: FALLBACK_COLORS[hash % FALLBACK_COLORS.length],
  };
}

function buildImageUrl(path: string | null): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${ORIGIN}/${path.replace(/^\/+/, "")}`;
}

interface GalleryItem {
  id: number;
  year: number;
  month: number;
  event: string;
  title: string;
  desc: string;
  src: string | null;
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

function normalizeGalleryItem(raw: any): GalleryItem {
  return {
    id: Number(raw.id),
    year: Number(raw.year),
    month: parseMonth(raw.month),
    event: String(raw.category ?? raw.event ?? "cultural"),
    title: String(raw.title ?? ""),
    desc: String(raw.description ?? raw.desc ?? ""),
    src: buildImageUrl(raw.image ?? raw.image_url ?? raw.src ?? null),
  };
}

export default function GalleryPage() {
  const [allData, setAllData] = useState<GalleryItem[]>([]);
  const [events, setEvents] = useState<EventOption[]>([{ key: "all", label: "All Events", icon: "🏠" }]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  // The default/"current" year is corrected once data loads (see fetch effect
  // below) to the newest year actually present in backend data, instead of
  // the browser's real system clock year — those two were drifting apart
  // (seeded demo data dated 2026 vs. an older real machine date), which made
  // the gallery default to a year with zero photos and look "stuck in the past".
  const [latestDataYear, setLatestDataYear] = useState<number>(FP_CURRENT_YEAR);
  const [fpState, setFpState] = useState<FilterState>({ year: FP_CURRENT_YEAR, month: "all", event: "all" });
  const [fpTmp, setFpTmp] = useState<FilterState>({ year: FP_CURRENT_YEAR, month: "all", event: "all" });
  const [curModal, setCurModal] = useState<"year" | "month" | "event" | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [lbIndex, setLbIndex] = useState(0);
  const [lbOpen, setLbOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`${API_BASE}/gallery?per_page=9999`)
      .then((r) => {
        if (!r.ok) throw new Error(`Request failed (${r.status})`);
        return r.json();
      })
      .then((payload) => {
        const rawItems = payload?.data?.items?.data ?? [];
        const items: GalleryItem[] = rawItems
          .filter((it: any) => it.is_active !== false)
          .map(normalizeGalleryItem);
        setAllData(items);

        const categories = payload?.data?.filters?.categories ?? {};
        const keys = Object.keys(categories);
        setEvents([
          { key: "all", label: "All Events", icon: "🏠" },
          ...keys.map((k) => {
            const m = metaFor(k);
            return { key: k, label: m.label, icon: m.icon };
          }),
        ]);

        const availableYears: number[] = payload?.data?.filters?.available_years ?? items.map((d) => d.year);
        if (availableYears.length > 0) {
          const newest = Math.max(...availableYears);
          setLatestDataYear(newest);
          setFpState((s) => ({ ...s, year: newest }));
          setFpTmp((s) => ({ ...s, year: newest }));
        }
      })
      .catch((err) => {
        setAllData([]);
        setLoadError(err.message || "Could not load gallery");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!lbOpen) return;
      if (e.key === "Escape") setLbOpen(false);
      if (e.key === "ArrowLeft") setLbIndex((i) => (i - 1 + visible.length) % visible.length);
      if (e.key === "ArrowRight") setLbIndex((i) => (i + 1) % visible.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lbOpen, allData, fpState, search]);

  const years = [...new Set([latestDataYear, ...allData.map((d) => d.year)])].sort((a, b) => b - a);

  const visible = allData.filter((d) =>
    d.year === fpState.year &&
    (fpState.month === "all" || d.month === fpState.month) &&
    (fpState.event === "all" || d.event === fpState.event) &&
    (!search || d.title.toLowerCase().includes(search.toLowerCase()) || d.desc.toLowerCase().includes(search.toLowerCase()))
  ).sort((a, b) => a.month - b.month || a.id - b.id);

  const monthsForYear = (y: number) => new Set(allData.filter((d) => d.year === y).map((d) => d.month));
  const countEvent = (k: string, y: number) => k === "all" ? allData.filter((d) => d.year === y).length : allData.filter((d) => d.event === k && d.year === y).length;

  function applyModal() {
    setFpState({ ...fpTmp });
    setCurModal(null);
  }

  function openModal(type: "year" | "month" | "event") {
    setFpTmp({ ...fpState });
    setCurModal(curModal === type ? null : type);
  }

  function clearAll() {
    const reset = { year: latestDataYear, month: "all" as const, event: "all" };
    setFpState(reset);
    setFpTmp(reset);
  }

  const lbItem = visible[lbIndex];
  const lbPal = lbItem ? metaFor(lbItem.event) : null;

  return (
    <>
      {/* HERO */}
      <section className="relative flex flex-col items-center justify-center text-center py-16 px-5 overflow-hidden" style={{ background: "linear-gradient(135deg,#0b1730 0%,#1a3060 100%)", minHeight: 240 }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle,rgba(232,93,20,0.4) 1.5px,transparent 1.5px)", backgroundSize: "28px 28px" }} />
        <div className="relative z-10">
          <div className="text-[#e85d14] text-[12px] font-bold tracking-widest uppercase mb-3">
            <i className="fas fa-camera mr-2"></i>Gallery
          </div>
          <h1 className="text-white font-extrabold leading-tight mb-3" style={{ fontSize: "clamp(30px,5vw,50px)" }}>
            Our <span className="text-[#e85d14]">Gallery</span>
          </h1>
          <p className="text-white/70 text-[14px] mb-5 max-w-[500px] mx-auto">
            Explore memorable moments and events at University College of Jaffna
          </p>
          <div className="text-white/50 text-[13px]">
            <Link href="/" className="hover:text-[#e85d14] transition-colors">Home</Link>
            {" / "}
            <span className="text-[#e85d14]">Gallery</span>
          </div>
        </div>
      </section>

      {/* FILTER PANEL */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-[108px] z-40">
        <div className="max-w-[1280px] mx-auto px-5 py-4 flex flex-col gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-[#f0f2f7] border border-gray-200 rounded-xl px-3 py-2 flex-1 min-w-[180px] max-w-[340px]">
              <i className="fas fa-search text-gray-400 text-[13px]"></i>
              <input
                ref={searchRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search photos, events…"
                className="bg-transparent outline-none text-[13px] text-[#0b1730] placeholder:text-gray-400 w-full"
              />
            </div>
            <div className="flex gap-1 ml-auto">
              {(["grid", "list"] as const).map((v) => (
                <button key={v} onClick={() => setView(v)} className={`w-9 h-9 rounded-lg flex items-center justify-center text-[13px] transition-colors ${view === v ? "bg-[#e85d14] text-white" : "bg-[#f0f2f7] text-gray-500 hover:bg-gray-200"}`}>
                  <i className={`fas ${v === "grid" ? "fa-th" : "fa-list"}`}></i>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button onClick={() => openModal("year")} className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[13px] font-medium transition-colors ${curModal === "year" ? "bg-[#e85d14] text-white border-[#e85d14]" : "bg-[#f0f2f7] text-[#0b1730] border-gray-200 hover:border-[#e85d14]"}`}>
              <i className="fas fa-calendar-alt text-[11px]"></i>
              <span>{fpState.year}</span>
              <i className={`fas fa-chevron-down text-[10px] transition-transform ${curModal === "year" ? "rotate-180" : ""}`}></i>
            </button>
            <button onClick={() => openModal("month")} className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[13px] font-medium transition-colors ${curModal === "month" ? "bg-[#e85d14] text-white border-[#e85d14]" : fpState.month !== "all" ? "bg-[#fff3ed] text-[#e85d14] border-[#e85d14]" : "bg-[#f0f2f7] text-[#0b1730] border-gray-200 hover:border-[#e85d14]"}`}>
              <i className="fas fa-calendar-check text-[11px]"></i>
              <span>{fpState.month === "all" ? "All Months" : FP_MONTH_FULL[fpState.month as number]}</span>
              <i className={`fas fa-chevron-down text-[10px] transition-transform ${curModal === "month" ? "rotate-180" : ""}`}></i>
            </button>
            <button onClick={() => openModal("event")} className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[13px] font-medium transition-colors ${curModal === "event" ? "bg-[#e85d14] text-white border-[#e85d14]" : fpState.event !== "all" ? "bg-[#fff3ed] text-[#e85d14] border-[#e85d14]" : "bg-[#f0f2f7] text-[#0b1730] border-gray-200 hover:border-[#e85d14]"}`}>
              <i className="fas fa-tag text-[11px]"></i>
              <span>{events.find((e) => e.key === fpState.event)?.label ?? "All Events"}</span>
              <i className={`fas fa-chevron-down text-[10px] transition-transform ${curModal === "event" ? "rotate-180" : ""}`}></i>
            </button>
            {(fpState.month !== "all" || fpState.event !== "all" || fpState.year !== latestDataYear) && (
              <button onClick={clearAll} className="px-4 py-2 rounded-xl border border-gray-200 text-[13px] text-gray-500 hover:text-[#e85d14] hover:border-[#e85d14] transition-colors">
                Clear all
              </button>
            )}
            <span className="ml-auto text-[12px] text-gray-400 self-center">
              Showing <strong className="text-[#0b1730]">{visible.length}</strong> photos
              {fpState.year === latestDataYear && <span className="ml-2 text-[#e85d14] font-semibold">✦ Latest Year</span>}
            </span>
          </div>
        </div>

        {curModal && (
          <div className="border-t border-gray-100 bg-white shadow-lg">
            <div className="max-w-[1280px] mx-auto px-5 py-5">
              {curModal === "year" && (
                <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-2">
                  {years.map((y) => (
                    <button key={y} onClick={() => setFpTmp((t) => ({ ...t, year: y }))}
                      className={`rounded-xl py-3 px-2 text-center text-[13px] font-semibold border transition-colors ${fpTmp.year === y ? "bg-[#e85d14] text-white border-[#e85d14]" : "bg-[#f0f2f7] text-[#0b1730] border-gray-200 hover:border-[#e85d14]"}`}>
                      {y}
                      <div className="text-[10px] font-normal mt-0.5 opacity-70">{allData.filter((d) => d.year === y).length} photos</div>
                    </button>
                  ))}
                </div>
              )}
              {curModal === "month" && (
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  <button onClick={() => setFpTmp((t) => ({ ...t, month: "all" }))}
                    className={`col-span-2 sm:col-span-1 rounded-xl py-2.5 text-[12px] font-semibold border transition-colors ${fpTmp.month === "all" ? "bg-[#e85d14] text-white border-[#e85d14]" : "bg-[#f0f2f7] text-[#0b1730] border-gray-200 hover:border-[#e85d14]"}`}>
                    All
                  </button>
                  {FP_MONTH_SHORT.slice(1).map((m, i) => {
                    const mo = i + 1;
                    const has = monthsForYear(fpTmp.year).has(mo);
                    return (
                      <button key={m} onClick={() => has && setFpTmp((t) => ({ ...t, month: mo }))}
                        className={`rounded-xl py-2.5 text-[12px] font-semibold border transition-colors ${fpTmp.month === mo ? "bg-[#e85d14] text-white border-[#e85d14]" : has ? "bg-[#f0f2f7] text-[#0b1730] border-gray-200 hover:border-[#e85d14]" : "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"}`}>
                        {m}
                      </button>
                    );
                  })}
                </div>
              )}
              {curModal === "event" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  {events.map((ev) => (
                    <button key={ev.key} onClick={() => setFpTmp((t) => ({ ...t, event: ev.key }))}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-[13px] font-medium transition-colors ${fpTmp.event === ev.key ? "bg-[#e85d14] text-white border-[#e85d14]" : "bg-[#f0f2f7] text-[#0b1730] border-gray-200 hover:border-[#e85d14]"}`}>
                      <span>{ev.icon}</span>
                      <div className="text-left">
                        <div className="text-[12px] font-semibold leading-tight">{ev.label}</div>
                        <div className="text-[10px] opacity-70">{countEvent(ev.key, fpTmp.year)} photos</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              <div className="flex gap-2 mt-4 justify-end">
                <button onClick={() => { setFpTmp({ ...fpState }); setCurModal(null); }} className="px-5 py-2 rounded-xl border border-gray-200 text-[13px] text-gray-500 hover:border-gray-400 transition-colors">Cancel</button>
                <button onClick={applyModal} className="px-5 py-2 rounded-xl bg-[#e85d14] text-white text-[13px] font-semibold hover:bg-[#c74d0f] transition-colors">Apply Filter</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* GALLERY GRID */}
      <section className="py-10 px-5 bg-[#f8f9fc] min-h-[400px]">
        <div className="max-w-[1280px] mx-auto">
          {loading ? (
            <div className={`grid gap-5 ${view === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
              {[1,2,3,4,5,6,7,8].map((i) => (
                <div key={i} className="rounded-2xl overflow-hidden bg-white border border-gray-200 animate-pulse">
                  <div className="h-[200px] bg-gray-200" />
                  <div className="p-4 flex flex-col gap-2">
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : loadError ? (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
              <i className="fas fa-triangle-exclamation text-[48px] text-gray-200"></i>
              <h3 className="text-[18px] font-bold text-gray-400">Couldn&apos;t load the gallery</h3>
              <p className="text-[13px] text-gray-400">{loadError}</p>
            </div>
          ) : visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
              <i className="fas fa-images text-[48px] text-gray-200"></i>
              <h3 className="text-[18px] font-bold text-gray-400">No photos found</h3>
              <p className="text-[13px] text-gray-400">Try selecting a different year, month, or event.</p>
              <button onClick={clearAll} className="mt-2 px-5 py-2 rounded-xl bg-[#e85d14] text-white text-[13px] font-semibold hover:bg-[#c74d0f] transition-colors">Reset Filters</button>
            </div>
          ) : (
            <div className={`grid gap-5 ${view === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1 max-w-[700px]"}`}>
              {visible.map((item, idx) => {
                const pal = metaFor(item.event);
                return (
                  <div key={item.id} onClick={() => { setLbIndex(idx); setLbOpen(true); }}
                    className={`group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer flex ${view === "list" ? "flex-row h-[100px]" : "flex-col"}`}>
                    <div className={`relative overflow-hidden shrink-0 flex items-center justify-center ${view === "list" ? "w-[120px] h-full" : "h-[200px] w-full"}`}
                      style={{ background: pal.bg }}>
                      {item.src ? (
                        <img src={item.src} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      ) : null}
                      <span className="text-[2.5rem] z-0">{pal.icon}</span>
                      <span className="absolute top-2 left-2 bg-[rgba(11,23,48,0.75)] text-white text-[10px] font-bold px-2 py-0.5 rounded">{item.year}</span>
                    </div>
                    <div className="p-4 flex flex-col justify-center gap-1 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold uppercase text-[#e85d14] bg-[#fff3ed] px-2 py-0.5 rounded-full">{item.event}</span>
                        <span className="text-[10px] text-gray-400">{FP_MONTH_FULL[item.month]}</span>
                      </div>
                      <div className="text-[13px] font-semibold text-[#0b1730] leading-snug">{item.title}</div>
                      {view === "grid" && <div className="text-[12px] text-gray-400">{item.desc}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* LIGHTBOX */}
      {lbOpen && lbItem && (
        <div className="fixed inset-0 z-[9999] bg-black/90 flex flex-col items-center justify-center" onClick={(e) => { if (e.target === e.currentTarget) setLbOpen(false); }}>
          <button onClick={() => setLbOpen(false)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors">
            <i className="fas fa-times"></i>
          </button>
          <button onClick={() => setLbIndex((i) => (i - 1 + visible.length) % visible.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-[#e85d14] transition-colors">
            <i className="fas fa-chevron-left"></i>
          </button>
          <button onClick={() => setLbIndex((i) => (i + 1) % visible.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-[#e85d14] transition-colors">
            <i className="fas fa-chevron-right"></i>
          </button>
          <div className="max-w-[90vw] max-h-[70vh] flex items-center justify-center rounded-xl overflow-hidden" style={{ background: lbPal!.bg, minWidth: 280, minHeight: 200 }}>
            {lbItem.src ? (
              <img src={lbItem.src} alt={lbItem.title} className="max-w-full max-h-[70vh] object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            ) : (
              <span className="text-[5rem]">{lbPal!.icon}</span>
            )}
          </div>
          <div className="mt-4 text-center text-white px-5">
            <h3 className="text-[16px] font-bold">{lbItem.title}</h3>
            <p className="text-white/60 text-[13px] mt-1">{lbItem.desc}</p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-[11px] bg-white/10 px-2.5 py-1 rounded-full"><i className="fas fa-calendar mr-1"></i>{lbItem.year}</span>
              <span className="text-[11px] bg-white/10 px-2.5 py-1 rounded-full"><i className="fas fa-clock mr-1"></i>{FP_MONTH_FULL[lbItem.month]}</span>
              <span className="text-[11px] bg-white/10 px-2.5 py-1 rounded-full"><i className="fas fa-tag mr-1"></i>{lbItem.event}</span>
            </div>
            <div className="text-white/40 text-[12px] mt-2">{lbIndex + 1} / {visible.length}</div>
          </div>
        </div>
      )}
    </>
  );
}