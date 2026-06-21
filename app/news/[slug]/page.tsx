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
    // There is no /api/news/{slug} route on the backend — the listing endpoint
    // already returns full fields (content, image, etc.), so we fetch the list
    // and find the matching item by slug here instead.
    const res = await fetch(`${API_BASE}/news`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const payload = await res.json();
    const items = payload?.data?.allNews?.data ?? [];
    return items.find((item: any) => item.slug === slug) ?? null;
  } catch {
    return null;
  }
}

export default async function NewsDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const news = await getNews(slug);

  if (!news) {
    notFound();
  }

  const img = resolveImage(news.image);

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-[#f0f2f7] border-b border-gray-200 py-3 px-6">
        <div className="max-w-[1280px] mx-auto text-[13px] text-[#607080]">
          <Link href="/" className="hover:text-[#e85d14] transition-colors">Home</Link>
          {" / "}
          <Link href="/news" className="hover:text-[#e85d14] transition-colors">News</Link>
          {" / "}
          <span className="text-[#0b1730] font-medium">{news.title}</span>
        </div>
      </div>

      <article className="max-w-[860px] mx-auto px-6 py-12">
        <span className={"text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full w-fit inline-block mb-4 " + (BADGE[news.category] ?? "bg-gray-200 text-gray-600")}>
          {news.category}
        </span>

        <h1 className="text-[28px] sm:text-[34px] font-extrabold text-[#0b1730] leading-tight mb-4">
          {news.title}
        </h1>

        <div className="flex items-center gap-5 text-[13px] text-gray-400 mb-8 flex-wrap">
          <span className="flex items-center gap-1.5">
            <i className="far fa-calendar-alt text-[#e85d14]"></i> {formatDate(news.published_at)}
          </span>
          {news.read_time && (
            <span className="flex items-center gap-1.5">
              <i className="far fa-clock text-[#e85d14]"></i> {news.read_time} min read
            </span>
          )}
        </div>

        {img && (
          <div className="w-full h-[320px] sm:h-[420px] rounded-2xl overflow-hidden mb-8 bg-[#0b1730]">
            <img src={img} alt={news.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="text-[15px] text-[#3d4a6a] leading-[1.9] whitespace-pre-line">
          {news.content}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#0f2a5e] hover:text-[#e85d14] transition-colors"
          >
            <i className="fas fa-arrow-left text-[12px]"></i> Back to All News
          </Link>
        </div>
      </article>
    </>
  );
}