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

// How many events to request per page from the backend.
// NOTE: pagination should only kick in once total events exceed this number.
// If the Laravel controller still hardcodes paginate(5) (or any other
// number) server-side, this value has to match on the backend too —
// otherwise the backend's own per-page size wins and pagination will
// still show up too early.
const PER_PAGE = 10;

// Converts a raw backend event record into the shape this page expects.
// Backend fields confirmed: type, venue, event_time, event_date, status.
function mapEventItem(item: any): Event {
  const rawDate = item.event_date;
  const d = rawDate ? new Date(rawDate) : null;
  const validDate = d && !isNaN(d.getTime()) ? d : null;

  // Backend sends "upcoming" | "ongoing" | "completed" — this page's UI
  // uses "past" instead of "completed", so map it here. Without this,
  // completed events matched neither the upcoming filter nor the past
  // filter and silently disappeared from the grid (while still counting
  // toward the paginator's total).
  let status: Event["status"];
  if (item.status === "completed") {
    status = "past";
  } else if (item.status === "upcoming" || item.status === "ongoing") {
    status = item.status;
  } else if (validDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    status = validDate < today ? "past" : "upcoming";
  } else {
    status = "upcoming";
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

// Shared grid classes for the event cards — 3 per row on large screens.
const CARD_GRID = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5";

export default function LatestEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [activeMonth, setActiveMonth] = useState<number | "all">("all");

  // --- pagination (backend-driven, /api/events?page=N&per_page=N) ------
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const gridTopRef = useRef<HTMLDivElement>(null);

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
    // /api/events?page=N&per_page=10 -> { data: { events: { data: [...], current_page, last_page, total } } }
    setLoading(true);
    fetch(`${API_BASE}/events?page=${page}&per_page=${PER_PAGE}`)
      .then((r) => r.json())
      .then((payload) => {
        const eventsBlock = payload?.data?.events ?? {};
        const items = eventsBlock?.data ?? [];
        setEvents(items.map(mapEventItem));
        setLastPage(eventsBlock?.last_page ?? 1);
        setTotalEvents(eventsBlock?.total ?? items.length);
      })
      .catch(() => {
        setEvents([]);
        setLastPage(1);
        setTotalEvents(0);
      })
      .finally(() => setLoading(false));
  }, [page]);

  // Category/month filters apply only within the currently loaded page,
  // since the event list itself is paginated by the backend.
  const filtered = events.filter((e) => {
    const catMatch = activeTab === "all" || e.category === activeTab;
    const monthMatch = activeMonth === "all" || MONTHS.indexOf(e.month) === activeMonth;
    return catMatch && monthMatch;
  });

  // Show everything returned for this page (upcoming, ongoing, and past/completed)
  // in one grid — pagination is handled entirely by the backend (10 per page),
  // so there's no need to split the list client-side.
  const displayEvents = filtered;

  const monthsWithEvents = new Set(events.map((e) => MONTHS.indexOf(e.month)));

  function goToPage(next: number) {
    if (next < 1 || next > lastPage || next === page) return;
    setPage(next);
    gridTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Builds a compact page-number list with ellipses, e.g. 1 … 4 5 [6] 7 8 … 12
  function getPageNumbers(): (number | "...")[] {
    const delta = 1;
    const range: (number | "...")[] = [];
    const left = Math.max(2, page - delta);
    const right = Math.min(lastPage - 1, page + delta);

    range.push(1);
    if (left > 2) range.push("...");
    for (let i = left; i <= right; i++) range.push(i);
    if (right < lastPage - 1) range.push("...");
    if (lastPage > 1) range.push(lastPage);

    return range;
  }

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

  function Pagination() {
    if (lastPage <= 1) return null;
    return (
      <div className="flex items-center justify-center gap-2 mt-10 mb-4 flex-wrap">
        <button
          onClick={() => goToPage(page - 1)}
          disabled={page === 1}
          className={
            "w-9 h-9 rounded-lg text-[13px] font-semibold border flex items-center justify-center transition-colors " +
            (page === 1
              ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
              : "bg-white text-[#0b1730] border-gray-200 hover:border-[#e85d14] hover:text-[#e85d14]")
          }
          aria-label="Previous page"
        >
          <i className="fas fa-chevron-left text-[11px]"></i>
        </button>

        {getPageNumbers().map((n, i) =>
          n === "..." ? (
            <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-[13px] text-gray-300">
              …
            </span>
          ) : (
            <button
              key={n}
              onClick={() => goToPage(n)}
              className={
                "w-9 h-9 rounded-lg text-[13px] font-semibold border flex items-center justify-center transition-colors " +
                (n === page
                  ? "bg-[#0b1730] text-white border-[#0b1730]"
                  : "bg-white text-[#3d4a6a] border-gray-200 hover:border-[#0b1730]")
              }
            >
              {n}
            </button>
          )
        )}

        <button
          onClick={() => goToPage(page + 1)}
          disabled={page === lastPage}
          className={
            "w-9 h-9 rounded-lg text-[13px] font-semibold border flex items-center justify-center transition-colors " +
            (page === lastPage
              ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
              : "bg-white text-[#0b1730] border-gray-200 hover:border-[#e85d14] hover:text-[#e85d14]")
          }
          aria-label="Next page"
        >
          <i className="fas fa-chevron-right text-[11px]"></i>
        </button>
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

      <div className="max-w-[1280px] mx-auto px-5 py-8" ref={gridTopRef}>

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

        {/* ALL EVENTS */}
        <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#e85d14] mb-4 flex items-center gap-2">
          <span className="w-4 h-0.5 bg-[#e85d14] rounded"></span>
          Events
        </div>

        {loading ? (
          <div className={`${CARD_GRID} mb-10`}>
            {[1,2,3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : displayEvents.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-[14px] mb-10">No events found.</div>
        ) : (
          <div className={`${CARD_GRID} mb-10`}>
            {displayEvents.map((ev) => (
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

        {/* PAGINATION */}
        {!loading && (
          <>
            <Pagination />
            <div className="text-center text-[12px] text-gray-400 mb-6">
              Page {page} of {lastPage} · {totalEvents} total events
            </div>
          </>
        )}

      </div>
    </>
  );
}