import Link from "next/link";
import { notFound } from "next/navigation";

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
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

const BADGE: Record<string, string> = {
  publication: "bg-[#0b1730] text-white",
  notice: "bg-[#e85d14] text-white",
  academic: "bg-[#1a3a8a] text-white",
  general: "bg-[#126b50] text-white",
};

interface NewsDetail {
  id: number;
  title: string;
  slug: string;
  content: string;
  image: string | null;
  category: string;
  is_featured: boolean;
  published_at: string;
  read_time: number;
}

async function getNews(slug: string): Promise<NewsDetail | null> {
  try {
    const res = await fetch(`${API_BASE}/news`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const payload = await res.json();
    const items = payload?.data?.allNews?.data ?? [];
    return items.find((item: any) => item.slug === slug) ?? null;
  } catch {
    return null;
  }
}

// Sidebar uses this to show "more news" without repeating the current item
async function getOtherNews(currentSlug: string): Promise<NewsDetail[]> {
  try {
    const res = await fetch(`${API_BASE}/news`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const payload = await res.json();
    const items: NewsDetail[] = payload?.data?.allNews?.data ?? [];
    return items.filter((item) => item.slug !== currentSlug).slice(0, 4);
  } catch {
    return [];
  }
}

export default async function NewsDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [news, otherNews] = await Promise.all([getNews(slug), getOtherNews(slug)]);

  if (!news) {
    notFound();
  }

  const img = resolveImage(news.image);

  return (
    <>
      {/* HERO */}
      <div style={{ background: "linear-gradient(135deg,#0b1730 0%,#1a3060 100%)", padding: "36px 20px 28px" }}>
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="text-white/50 text-[13px] mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            {" / "}
            <Link href="/news" className="hover:text-white transition-colors">News</Link>
            {" / "}
            <span className="text-white/80">{news.title}</span>
          </div>
          <span className={"text-[10px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full w-fit inline-block mb-3 " + (BADGE[news.category] ?? "bg-gray-200 text-gray-600")}>
            {news.category}
          </span>
          <h1 className="text-white text-[24px] sm:text-[32px] font-extrabold leading-tight max-w-[820px]">
            {news.title}
          </h1>
          <div className="flex items-center gap-5 text-[13px] text-white/60 mt-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              <i className="far fa-calendar-alt text-[#e85d14]"></i> {formatDate(news.published_at)}
            </span>
            {news.read_time && (
              <span className="flex items-center gap-1.5">
                <i className="far fa-clock text-[#e85d14]"></i> {news.read_time} min read
              </span>
            )}
          </div>
        </div>
      </div>

      {/* CONTENT + SIDEBAR */}
      <div className="max-w-[1280px] mx-auto px-5 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">

          {/* MAIN ARTICLE */}
          <article className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {img && (
  <div className="w-full aspect-[3/2] overflow-hidden bg-[#0b1730]">
    <img src={img} alt={news.title} className="w-full h-full object-cover" />
  </div>
)}
            <div className="p-6 sm:p-10">
              <div className="text-[15px] text-[#3d4a6a] leading-[1.9] whitespace-pre-line">
                {news.content}
              </div>

              <div className="mt-10 pt-6 border-t border-gray-200 flex items-center justify-between flex-wrap gap-4">
                <Link
                  href="/news"
                  className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#0f2a5e] hover:text-[#e85d14] transition-colors"
                >
                  <i className="fas fa-arrow-left text-[12px]"></i> Back to All News
                </Link>

                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-gray-400 font-semibold mr-1">Share:</span>
                  {["facebook-f", "twitter", "linkedin-in"].map((icon) => (
                    <span
                      key={icon}
                      className="w-8 h-8 rounded-full bg-[#f0f2f7] text-[#0b1730] flex items-center justify-center text-[13px] hover:bg-[#e85d14] hover:text-white transition-colors cursor-pointer"
                    >
                      <i className={`fab fa-${icon}`}></i>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>

          {/* SIDEBAR */}
          <aside className="flex flex-col gap-6">
            {/* Quick info card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#0b1730] mb-4 flex items-center gap-2">
                <span className="w-4 h-0.5 bg-[#e85d14] rounded"></span>Details
              </div>
              <div className="flex flex-col gap-3 text-[13px] text-[#3d4a6a]">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Category</span>
                  <span className="font-semibold capitalize">{news.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Published</span>
                  <span className="font-semibold">{formatDate(news.published_at)}</span>
                </div>
                {news.read_time && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Read time</span>
                    <span className="font-semibold">{news.read_time} min</span>
                  </div>
                )}
              </div>
            </div>

            {/* More news */}
            {otherNews.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#0b1730] mb-4 flex items-center gap-2">
                  <span className="w-4 h-0.5 bg-[#e85d14] rounded"></span>More News
                </div>
                <div className="flex flex-col gap-4">
                  {otherNews.map((item) => {
                    const thumb = resolveImage(item.image);
                    return (
                      <Link
                        key={item.id}
                        href={`/news/${item.slug}`}
                        className="flex gap-3 group"
                      >
                        <div className="w-[64px] h-[56px] rounded-lg overflow-hidden bg-[#0b1730] shrink-0">
                          {thumb && (
                            <img src={thumb} alt={item.title} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex flex-col gap-1 min-w-0">
                          <h4 className="text-[12.5px] font-semibold text-[#0b1730] leading-[1.4] line-clamp-2 group-hover:text-[#e85d14] transition-colors">
                            {item.title}
                          </h4>
                          <span className="text-[11px] text-gray-400">{formatDate(item.published_at)}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                <Link
                  href="/news"
                  className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-[#e85d14] hover:gap-2 transition-all duration-200"
                >
                  View all news <i className="fas fa-chevron-right text-[9px]"></i>
                </Link>
              </div>
            )}
          </aside>

        </div>
      </div>
    </>
  );
}