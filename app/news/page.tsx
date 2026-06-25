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
    // /api/news -> { data: { allNews: { data: [...] } } }
    fetch(`${API_BASE}/news`)
      .then((r) => r.json())
      .then((payload) => {
        const items = payload?.data?.allNews?.data ?? [];
        setNews(items.map(mapNewsItem));
      })
      .catch(() => setNews([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = news.filter((n) => activeTab === "all" || n.category === activeTab);
  const recent = filtered.filter((n) => !n.featured).slice(0, 6);


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

        {loading ? (
          <div className="flex flex-col gap-6">
            {/* Featured skeleton */}
            <div className="rounded-2xl overflow-hidden border border-gray-200 animate-pulse grid md:grid-cols-2">
              <div className="h-[280px] bg-gray-200" />
              <div className="p-8 flex flex-col gap-3">
                <div className="h-3 bg-gray-200 rounded w-1/4" />
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-100 rounded w-full" />
                <div className="h-4 bg-gray-100 rounded w-5/6" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-gray-200 animate-pulse">
                  <div className="h-[180px] bg-gray-200" />
                  <div className="p-5 flex flex-col gap-2">
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center gap-3">
            <i className="fas fa-newspaper text-[48px] text-gray-200"></i>
            <p className="text-gray-400 text-[14px]">No news found.</p>
          </div>
        ) : (
          <>
        

            {/* RECENT */}
            {recent.length > 0 && (
              <>
                <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#e85d14] mb-4 flex items-center gap-2">
                  <span className="w-4 h-0.5 bg-[#e85d14] rounded"></span>Recent News
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                  {recent.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href ?? "#"}
                      className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col"
                    >
                      <div className="h-[180px] overflow-hidden bg-[#0b1730]">
                        {/* Guarded against empty-string src — see Home.tsx fix.
                            When there's no image, the dark bg-[#0b1730]
                            background of this wrapper shows on its own. */}
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
                        <h3 className="text-[14px] font-semibold text-[#0b1730] leading-[1.5] flex-1">{item.title}</h3>
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
              </>
            )}

            
          </>
        )}
      </div>
    </>
  );
}