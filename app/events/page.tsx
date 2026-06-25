"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// .env.local may or may not already include "/api" — normalize it here.
const RAW_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";
const ORIGIN = RAW_BASE.replace(/\/api\/?$/, "");
const API_BASE = `${ORIGIN}/api`;

function resolveImage(path: string | null | undefined): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${ORIGIN}/${path.replace(/^\/+/, "")}`;
}

interface Event {
  id: number;
  img: string;
  day: string;
  month: string;
  status: "upcoming" | "ongoing" | "past";
  category: "workshop" | "competition" | "ceremony" | "exhibition";
  title: string;
  time: string;
  location: string;
  href?: string;
}

const MONTHS = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// Converts a raw backend event record into the shape this page expects.
// Backend fields confirmed: type, venue, event_time, event_date, status.
function mapEventItem(item: any): Event {
  const rawDate = item.event_date;
  const d = rawDate ? new Date(rawDate) : null;
  const validDate = d && !isNaN(d.getTime()) ? d : null;

  let status: Event["status"] = item.status ?? "upcoming";
  if (!item.status && validDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    status = validDate < today ? "past" : "upcoming";
  }

  return {
    id: item.id,
    img: resolveImage(item.image),
    day: validDate ? String(validDate.getDate()) : "--",
    month: validDate ? MONTHS[validDate.getMonth() + 1] : "--",
    status,
    category: (item.type ?? "workshop") as Event["category"],
    title: item.title,
    time: item.event_time ?? "",
    location: item.venue ?? "",
    href: `/events/${item.slug}`,
  };
}

type TabKey = "all" | "workshop" | "competition" | "ceremony" | "exhibition";

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All Events" },
  { key: "workshop", label: "Workshops" },
  { key: "competition", label: "Competitions" },
  { key: "ceremony", label: "Ceremonies" },
  { key: "exhibition", label: "Exhibitions" },
];

const BADGE: Record<string, string> = {
  workshop: "bg-[#8a4a0a] text-white",
  competition: "bg-[#5a1a8a] text-white",
  ceremony: "bg-[#1a3a8a] text-white",
  exhibition: "bg-[#126b50] text-white",
};

const STATUS_BADGE: Record<string, string> = {
  upcoming: "bg-[#e85d14] text-white",
  ongoing: "bg-[#126b50] text-white",
  past: "bg-gray-500 text-white",
};

export default function LatestEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [activeMonth, setActiveMonth] = useState<number | "all">("all");

  // --- sticky filter bar watcher --------------------------------------
  // Same fix used on the Gallery page: pure CSS `position: sticky` can
  // silently fail to "stick" if any ancestor sets a transform/overflow
  // that creates a new containing block. `isolate` gives this bar its own
  // stacking context so it can't be undermined by Navbar's higher
  // z-index, and the scroll watcher gives us isStuck as a visual smoke test.
  const filterBarRef = useRef<HTMLDivElement>(null);
  const [isStuck, setIsStuck] = useState(false);
  const FILTER_BAR_TOP = 108; // topbar (38px) + header (70px)

  useEffect(() => {
    const handleScroll = () => {
      if (!filterBarRef.current) return;
      const rect = filterBarRef.current.getBoundingClientRect();
      setIsStuck(rect.top <= FILTER_BAR_TOP);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // /api/events -> { data: { events: { data: [...] } } }
    fetch(`${API_BASE}/events`)
      .then((r) => r.json())
      .then((payload) => {
        const items = payload?.data?.events?.data ?? [];
        setEvents(items.map(mapEventItem));
      })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = events.filter((e) => {
    const catMatch = activeTab === "all" || e.category === activeTab;
    const monthMatch = activeMonth === "all" || MONTHS.indexOf(e.month) === activeMonth;
    return catMatch && monthMatch;
  });

  const upcoming = filtered.filter((e) => e.status === "upcoming" || e.status === "ongoing");
  const past = filtered.filter((e) => e.status === "past");

  const monthsWithEvents = new Set(events.map((e) => MONTHS.indexOf(e.month)));

  function SkeletonCard() {
    return (
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 animate-pulse flex flex-col">
        <div className="h-[200px] bg-gray-200" />
        <div className="p-5 flex flex-col gap-2">
          <div className="h-3 bg-gray-200 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* HERO */}
      <div style={{ background: "linear-gradient(135deg,#0b1730 0%,#1a3060 100%)", padding: "40px 20px 32px", textAlign: "center" }}>
        <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 800, margin: "0 0 8px" }}>
          <i className="fas fa-calendar-alt" style={{ marginRight: 10 }}></i>Latest Events
        </h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, margin: 0 }}>
          Workshops, competitions, ceremonies and more happening at University College of Jaffna
        </p>
        <div className="mt-3 text-white/50 text-[13px]">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          {" / "}
          <span className="text-white/80">Latest Events</span>
        </div>
      </div>

      {/* FILTER BAR */}
      <div
        ref={filterBarRef}
        className={`relative isolate bg-white border-b border-gray-200 sticky top-[108px] z-40 transition-shadow duration-200 ${isStuck ? "shadow-md" : "shadow-sm"}`}
      >
        <div className="max-w-[1280px] mx-auto px-5 py-3 flex gap-2 flex-wrap">
          <span className="text-[12px] font-semibold text-gray-400 self-center mr-1">Filter:</span>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={
                "px-4 py-1.5 rounded-xl text-[13px] font-semibold border transition-colors " +
                (activeTab === tab.key
                  ? "bg-[#0b1730] text-white border-[#0b1730]"
                  : "bg-white text-[#3d4a6a] border-gray-200 hover:border-[#0b1730]")
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-5 py-8">

        {/* MONTH STRIP */}
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          <span className="text-[12px] font-semibold text-gray-400 flex items-center gap-1">
            <i className="fas fa-filter text-[11px]"></i> Month:
          </span>
          <button
            onClick={() => setActiveMonth("all")}
            className={
              "px-3 py-1 rounded-full text-[12px] font-semibold border transition-colors " +
              (activeMonth === "all" ? "bg-[#e85d14] text-white border-[#e85d14]" : "bg-white text-gray-500 border-gray-200 hover:border-[#e85d14]")
            }
          >
            All
          </button>
          {MONTHS.slice(1).map((m, i) => {
            const mo = i + 1;
            const has = monthsWithEvents.has(mo);
            return (
              <button
                key={m}
                onClick={() => has && setActiveMonth(mo)}
                className={
                  "px-3 py-1 rounded-full text-[12px] font-semibold border transition-colors " +
                  (activeMonth === mo
                    ? "bg-[#e85d14] text-white border-[#e85d14]"
                    : has
                    ? "bg-white text-[#0b1730] border-gray-200 hover:border-[#e85d14]"
                    : "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed")
                }
              >
                {m}
              </button>
            );
          })}
        </div>

        {/* UPCOMING */}
        <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#e85d14] mb-4 flex items-center gap-2">
          <span className="w-4 h-0.5 bg-[#e85d14] rounded"></span>
          Upcoming &amp; Ongoing Events
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-10">
            {[1,2,3,4].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : upcoming.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-[14px] mb-10">No upcoming events found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-10">
            {upcoming.map((ev) => (
              <div key={ev.id} className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col">
                <div className="relative h-[200px] overflow-hidden bg-[#0b1730]">
                  {/* Guarded against empty-string src — see Home.tsx fix.
                      When there's no image, the dark bg-[#0b1730]
                      background of this wrapper shows on its own. */}
                  {ev.img && (
                    <img
                      src={ev.img}
                      alt={ev.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  )}
                  <div className="absolute top-3 left-3 bg-[rgba(11,23,48,0.85)] text-white text-center px-2.5 py-1.5 rounded-xl">
                    <div className="text-[18px] font-extrabold leading-none">{ev.day}</div>
                    <div className="text-[10px] font-semibold uppercase">{ev.month}</div>
                  </div>
                  <span className={"absolute top-3 right-3 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full " + (STATUS_BADGE[ev.status] ?? "bg-gray-500 text-white")}>
                    {ev.status}
                  </span>
                </div>
                <div className="p-5 flex flex-col gap-2.5 flex-1">
                  <span className={"text-[10px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full w-fit " + (BADGE[ev.category] ?? "bg-gray-200 text-gray-600")}>
                    {ev.category}
                  </span>
                  <h3 className="text-[14px] font-semibold text-[#0b1730] leading-[1.5] flex-1">{ev.title}</h3>
                  <div className="flex flex-col gap-1 text-[12px] text-gray-400">
                    <span className="flex items-center gap-1.5"><i className="fas fa-clock text-[#e85d14] text-[10px]"></i>{ev.time}</span>
                    <span className="flex items-center gap-1.5"><i className="fas fa-map-marker-alt text-[#e85d14] text-[10px]"></i>{ev.location}</span>
                  </div>
                  <Link href={ev.href ?? "#"} className="inline-flex items-center gap-1.5 text-[#e85d14] text-[12px] font-semibold mt-auto pt-2 hover:gap-2.5 transition-all duration-200">
                    View Details <i className="fas fa-chevron-right text-[10px]"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PAST */}
      </div>
    </>
  );
}