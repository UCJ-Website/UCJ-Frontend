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

function formatTime(value: string | null | undefined): string {
  if (!value) return "";
  // event_time comes back as "HH:mm" — build a throwaway date just to format it
  const [h, m] = value.split(":");
  if (h === undefined || m === undefined) return value;
  const d = new Date();
  d.setHours(Number(h), Number(m), 0, 0);
  return d.toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit", hour12: true });
}

const BADGE: Record<string, string> = {
  workshop: "bg-[#8a4a0a] text-white",
  competition: "bg-[#5a1a8a] text-white",
  ceremony: "bg-[#1a3a8a] text-white",
  exhibition: "bg-[#126b50] text-white",
};

interface EventDetail {
  id: number;
  title: string;
  slug: string;
  description?: string;
  image: string | null;
  type: string;
  status?: string;
  venue?: string;
  event_time?: string;
  event_date?: string;
}

async function getAllEvents(): Promise<EventDetail[]> {
  try {
    const res = await fetch(`${API_BASE}/events`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const payload = await res.json();
    return payload?.data?.events?.data ?? [];
  } catch {
    return [];
  }
}

export default async function EventDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const all = await getAllEvents();
  const event = all.find((item) => item.slug === slug) ?? null;
  const otherEvents = all.filter((item) => item.slug !== slug).slice(0, 4);

  if (!event) {
    notFound();
  }

  const img = resolveImage(event.image);
  const description = event.description ?? "";

  return (
    <>
      {/* HERO */}
      <div style={{ background: "linear-gradient(135deg,#0b1730 0%,#1a3060 100%)", padding: "36px 20px 28px" }}>
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="text-white/50 text-[13px] mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            {" / "}
            <Link href="/events" className="hover:text-white transition-colors">Events</Link>
            {" / "}
            <span className="text-white/80">{event.title}</span>
          </div>
          <span className={"text-[10px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full w-fit inline-block mb-3 " + (BADGE[event.type] ?? "bg-gray-200 text-gray-600")}>
            {event.type}
          </span>
          <h1 className="text-white text-[24px] sm:text-[32px] font-extrabold leading-tight max-w-[820px]">
            {event.title}
          </h1>
          <div className="flex items-center gap-5 text-[13px] text-white/60 mt-4 flex-wrap">
            {event.event_date && (
              <span className="flex items-center gap-1.5">
                <i className="far fa-calendar-alt text-[#e85d14]"></i> {formatDate(event.event_date)}
              </span>
            )}
            {event.event_time && (
              <span className="flex items-center gap-1.5">
                <i className="far fa-clock text-[#e85d14]"></i> {formatTime(event.event_time)}
              </span>
            )}
            {event.venue && (
              <span className="flex items-center gap-1.5">
                <i className="fas fa-map-marker-alt text-[#e85d14]"></i> {event.venue}
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
              <div className="w-full h-[280px] sm:h-[380px] overflow-hidden bg-[#0b1730]">
                <img src={img} alt={event.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-6 sm:p-10">
              <div className="text-[15px] text-[#3d4a6a] leading-[1.9] whitespace-pre-line">
                {description}
              </div>

              <div className="mt-10 pt-6 border-t border-gray-200 flex items-center justify-between flex-wrap gap-4">
                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#0f2a5e] hover:text-[#e85d14] transition-colors"
                >
                  <i className="fas fa-arrow-left text-[12px]"></i> Back to All Events
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
                  <span className="text-gray-400">Type</span>
                  <span className="font-semibold capitalize">{event.type}</span>
                </div>
                {event.event_date && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Date</span>
                    <span className="font-semibold">{formatDate(event.event_date)}</span>
                  </div>
                )}
                {event.event_time && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Time</span>
                    <span className="font-semibold">{formatTime(event.event_time)}</span>
                  </div>
                )}
                {event.venue && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Venue</span>
                    <span className="font-semibold text-right">{event.venue}</span>
                  </div>
                )}
                {event.status && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Status</span>
                    <span className="font-semibold capitalize">{event.status}</span>
                  </div>
                )}
              </div>
            </div>

            {/* More events */}
            {otherEvents.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#0b1730] mb-4 flex items-center gap-2">
                  <span className="w-4 h-0.5 bg-[#e85d14] rounded"></span>More Events
                </div>
                <div className="flex flex-col gap-4">
                  {otherEvents.map((item) => {
                    const thumb = resolveImage(item.image);
                    return (
                      <Link
                        key={item.id}
                        href={`/events/${item.slug}`}
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
                          <span className="text-[11px] text-gray-400">{formatDate(item.event_date)}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                <Link
                  href="/events"
                  className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-[#e85d14] hover:gap-2 transition-all duration-200"
                >
                  View all events <i className="fas fa-chevron-right text-[9px]"></i>
                </Link>
              </div>
            )}
          </aside>

        </div>
      </div>
    </>
  );
}