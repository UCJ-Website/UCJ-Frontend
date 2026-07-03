"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// .env.local may or may not already include "/api" — normalize it here.
const RAW_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";
const ORIGIN = RAW_BASE.replace(/\/api\/?$/, "");
const API_BASE = `${ORIGIN}/api`;

// How many news items to request per page from the backend.
// Pagination should only appear once total items exceed this number.
// NOTE: the Laravel controller's paginate() call must use this same
// number (or read it from the `per_page` query param) — otherwise the
// backend's own default page size wins and pagination shows up too early,
// same issue we hit on the /events page.
const PER_PAGE = 10;

function resolveImage(path: string | null | undefined): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${ORIGIN}/${path.replace(/^\/+/, "")}`;
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

interface NewsItem {
  id: number;
  img: string;
  category: "publication" | "notice" | "academic" | "general";
  title: string;
  desc?: string;
  date: string;
  read_time?: string;
  href?: string;
  featured?: boolean;
}

// Converts a raw backend news record into the shape this page expects
function mapNewsItem(item: any): NewsItem {
  return {
    id: item.id,
    img: resolveImage(item.image),
    category: (item.category ?? "general") as NewsItem["category"],
    title: item.title,
    desc: item.content,
    date: formatDate(item.published_at ?? item.created_at),
    read_time: item.read_time ? `${item.read_time} min read` : undefined,
    href: `/news/${item.slug}`,
    featured: !!item.is_featured,
  };
}

type TabKey = "all" | "notice" | "academic" | "general";

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All News" },
  { key: "notice", label: "Notices" },
  { key: "academic", label: "Academic" },
  { key: "general", label: "General" },
];

const BADGE: Record<string, string> = {
  publication: "bg-[#0b1730] text-white",
  notice: "bg-[#e85d14] text-white",
  academic: "bg-[#1a3a8a] text-white",
  general: "bg-[#126b50] text-white",
};

export default function LatestNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  // --- pagination (backend-driven, /api/news?page=N&per_page=N) ---------
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalNews, setTotalNews] = useState(0);
  const gridTopRef = useRef<HTMLDivElement>(null);

  // --- sticky filter bar watcher --------------------------------------
  // Switched away from IntersectionObserver — with a negative rootMargin
  // on a 0-height sentinel it was locking `isStuck` to true on mount /
  // never re-evaluating correctly while scrolling, so the bar stayed
  // `fixed` permanently instead of toggling based on real scroll
  // position. A plain scroll listener comparing scrollY against the
  // sentinel's actual document offset is deterministic and fixes it.
  const heroSentinelRef = useRef<HTMLDivElement>(null);
  const filterBarRef = useRef<HTMLDivElement>(null);
  const [isStuck, setIsStuck] = useState(false);
  const [barHeight, setBarHeight] = useState(0);
  const FILTER_BAR_TOP = 108; // topbar (38px) + header (70px)

  useEffect(() => {
    const handleScroll = () => {
      const sentinel = heroSentinelRef.current;
      if (!sentinel) return;
      // Absolute document position of the sentinel (doesn't change on scroll)
      const sentinelDocTop = sentinel.getBoundingClientRect().top + window.scrollY;
      setIsStuck(window.scrollY >= sentinelDocTop - FILTER_BAR_TOP);
    };

    handleScroll(); // run once on mount in case page loads mid-scroll
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // Keep a live measurement of the bar's height so the placeholder below
  // matches exactly, even if tabs wrap to a second line on small screens.
  useEffect(() => {
    const bar = filterBarRef.current;
    if (!bar) return;
    const ro = new ResizeObserver((entries) => setBarHeight(entries[0].contentRect.height));
    ro.observe(bar);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    // /api/news?page=N&per_page=10 -> { data: { allNews: { data: [...], current_page, last_page, total } } }
    setLoading(true);
    fetch(`${API_BASE}/news?page=${page}&per_page=${PER_PAGE}`)
      .then((r) => r.json())
      .then((payload) => {
        const newsBlock = payload?.data?.allNews ?? {};
        const items = newsBlock?.data ?? [];
        setNews(items.map(mapNewsItem));
        setLastPage(newsBlock?.last_page ?? 1);
        setTotalNews(newsBlock?.total ?? items.length);
      })
      .catch(() => {
        setNews([]);
        setLastPage(1);
        setTotalNews(0);
      })
      .finally(() => setLoading(false));
  }, [page]);

  // Category filter applies only within the currently loaded page, since
  // the news list itself is paginated by the backend.
  const filtered = news.filter((n) => activeTab === "all" || n.category === activeTab);

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

  function Pagination() {
    if (lastPage <= 1) return null;
    return (
      <div className="flex items-center justify-center gap-2 mt-4 mb-4 flex-wrap">
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
          <i className="fas fa-newspaper" style={{ marginRight: 10 }}></i>Latest News
        </h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, margin: 0 }}>
          Stay updated with the most recent announcements from University College of Jaffna
        </p>
        <div className="mt-3 text-white/50 text-[13px]">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          {" / "}
          <span className="text-white/80">Latest News</span>
        </div>
      </div>

      {/* sentinel: marks the exact scroll point where the bar should lock.
          Height 0, purely a scroll-position marker. */}
      <div ref={heroSentinelRef} className="h-px" />

      {/* placeholder: reserves space so content doesn't jump when the
          bar switches to `fixed` and leaves normal flow */}
      {isStuck && <div style={{ height: barHeight }} aria-hidden="true" />}

      {/* FILTER BAR */}
      <div
        ref={filterBarRef}
        className={
          "bg-white border-b border-gray-200 z-40 transition-shadow duration-200 " +
          (isStuck
            ? "fixed top-[108px] left-0 right-0 shadow-md"
            : "relative shadow-sm")
        }
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

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-gray-200 animate-pulse">
                <div className="h-[200px] bg-gray-200" />
                <div className="p-5 flex flex-col gap-2">
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center gap-3">
            <i className="fas fa-newspaper text-[48px] text-gray-200"></i>
            <p className="text-gray-400 text-[14px]">No news found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {filtered.map((item) => (
              <Link
                key={item.id}
                href={item.href ?? "#"}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col"
              >
                <div className="h-[200px] overflow-hidden bg-[#0b1730]">
                  {item.img && (
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  )}
                </div>
                <div className="p-5 flex flex-col gap-2 flex-1">
                  <span className={"text-[10px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full w-fit " + (BADGE[item.category] ?? "bg-gray-200 text-gray-600")}>
                    {item.category}
                  </span>
                  <h3 className="text-[15px] font-bold text-[#0b1730] leading-[1.4]">{item.title}</h3>
                  {item.desc && (
                    <p className="text-[13px] text-gray-500 leading-[1.6] line-clamp-2">{item.desc}</p>
                  )}
                  <div className="text-[12px] text-gray-400 flex items-center gap-1">
                    <i className="far fa-calendar-alt text-[#e85d14] text-[10px]"></i>{item.date}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[#e85d14] text-[12px] font-semibold mt-auto pt-2 hover:gap-2 transition-all duration-200">
                    Read more <i className="fas fa-chevron-right text-[10px]"></i>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {!loading && (
          <>
            <Pagination />
            <div className="text-center text-[12px] text-gray-400 mb-6">
              Page {page} of {lastPage} · {totalNews} total news items
            </div>
          </>
        )}
      </div>
    </>
  );
}