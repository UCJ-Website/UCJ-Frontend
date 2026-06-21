"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

interface ApiResource {
  id: number;
  notification_id: number;
  title: string;
  url: string;
}

interface ApiNotification {
  id: number;
  title: string;
  description: string;
  type: "vacancy" | "result" | "notice" | string;
  is_read: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  resources: ApiResource[];
}

interface Notification {
  id: number;
  type: "vacancy" | "result" | "notice" | string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  href?: string;
}

type TabKey = "all" | "vacancy" | "result" | "notice";

const TABS: { key: TabKey; label: string; icon: string | null }[] = [
  { key: "all", label: "All", icon: null },
  { key: "vacancy", label: "Vacancies", icon: "fa-briefcase" },
  { key: "result", label: "Results", icon: "fa-graduation-cap" },
  { key: "notice", label: "Notices", icon: "fa-exclamation-circle" },
];

const BADGE: Record<string, string> = {
  vacancy: "bg-[#1a3a6b] text-white",
  result: "bg-[#126b50] text-white",
  notice: "bg-[#e85d14] text-white",
};

// Turns an ISO timestamp into a short relative label, e.g. "2h ago".
function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return iso;

  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;

  return date.toLocaleDateString("en-LK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Maps the raw API shape (nested under data.notifications.data, with
// description/is_read/created_at/resources) onto the simpler shape the UI uses.
function mapApiNotification(item: ApiNotification): Notification {
  return {
    id: item.id,
    type: item.type,
    title: item.title,
    desc: item.description,
    time: formatRelativeTime(item.created_at),
    unread: !item.is_read,
    href: item.resources?.[0]?.url,
  };
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [readIds, setReadIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetch(`${API_BASE}/api/notifications`)
      .then((r) => {
        if (!r.ok) throw new Error(`Request failed: ${r.status}`);
        return r.json();
      })
      .then((json) => {
        // Expected shape: { success, data: { notifications: { data: ApiNotification[] } } }
        // Try each known shape in turn and only accept it if it's actually an array,
        // so a malformed/unexpected response can never reach setState as a non-array.
        const candidates = [
          json?.data?.notifications?.data,
          json?.notifications?.data,
          json?.data,
          json,
        ];
        const raw: ApiNotification[] =
          candidates.find((c) => Array.isArray(c)) ?? [];

        setNotifications(raw.map(mapApiNotification));
      })
      .catch(() => {
        setNotifications([]);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  function markRead(id: number) {
    setReadIds((prev) => new Set([...prev, id]));
  }

  const visible = (Array.isArray(notifications) ? notifications : []).filter(
    (n) => activeTab === "all" || n.type === activeTab
  );

  const unreadCount = (Array.isArray(notifications) ? notifications : []).filter(
    (n) => n.unread && !readIds.has(n.id)
  ).length;

  function NotifCard({ notif }: { notif: Notification }) {
    const isUnread = notif.unread && !readIds.has(notif.id);
    return (
      <a
        href={notif.href ?? "#"}
        onClick={() => markRead(notif.id)}
        className={
          "flex gap-4 p-5 rounded-2xl border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 " +
          (isUnread ? "bg-[#f0f4ff] border-[#c5d1f0]" : "bg-white border-gray-200")
        }
      >
        <div className="pt-1.5 shrink-0">
          <div
            className={
              "w-2.5 h-2.5 rounded-full transition-colors " +
              (isUnread ? "bg-[#1a3a6b]" : "bg-gray-300")
            }
          />
        </div>
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={
                "text-[10px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full " +
                (BADGE[notif.type] ?? "bg-gray-200 text-gray-600")
              }
            >
              {notif.type}
            </span>
            <span
              className={
                "text-[14px] font-semibold leading-snug " +
                (isUnread ? "text-[#0b1730]" : "text-[#3d4a6a]")
              }
            >
              {notif.title}
            </span>
          </div>
          <p className="text-[13px] text-[#5a6380] leading-[1.65]">{notif.desc}</p>
          <span className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
            <i className="far fa-clock"></i> {notif.time}
          </span>
        </div>
        <div className="self-center shrink-0 text-gray-300">
          <i className="fas fa-chevron-right text-[12px]"></i>
        </div>
      </a>
    );
  }

  return (
    <>
      <div
        style={{
          background: "linear-gradient(135deg,#1a3a6b 0%,#2d5fa6 100%)",
          padding: "36px 20px 32px",
          textAlign: "center",
        }}
      >
        <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 800, margin: "0 0 6px" }}>
          <i className="fas fa-bell" style={{ marginRight: 10 }}></i>
          Notification Board
        </h1>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, margin: 0 }}>
          Latest vacancies, results, and notices from University College of Jaffna
        </p>
        <div className="mt-3 text-white/50 text-[13px]">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          {" / "}
          <span className="text-white/80">Notifications</span>
        </div>
      </div>

      <div className="max-w-[820px] mx-auto px-5 py-10">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <h2 className="text-[22px] font-extrabold text-[#0b1730] flex items-center gap-2">
            <i className="fas fa-bell text-[#1a3a6b]"></i> Notifications
          </h2>
          {unreadCount > 0 && (
            <span className="bg-[#e85d14] text-white text-[12px] font-bold px-3 py-1 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>

        <div className="flex gap-2 flex-wrap mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={
                "flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold border transition-colors " +
                (activeTab === tab.key
                  ? "bg-[#1a3a6b] text-white border-[#1a3a6b]"
                  : "bg-white text-[#3d4a6a] border-gray-200 hover:border-[#1a3a6b] hover:text-[#1a3a6b]")
              }
            >
              {tab.icon && <i className={"fas " + tab.icon + " text-[11px]"}></i>}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {loading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-200 p-5 animate-pulse flex gap-4"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-200 mt-1.5 shrink-0" />
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                    <div className="h-3 bg-gray-100 rounded w-1/3 mt-1" />
                  </div>
                </div>
              ))}
            </>
          ) : error ? (
            <div className="text-center py-16 flex flex-col items-center gap-3">
              <i className="fas fa-triangle-exclamation text-[40px] text-gray-200"></i>
              <p className="text-gray-400 text-[14px]">
                Couldn&apos;t load notifications. Check that the API is running at {API_BASE}.
              </p>
            </div>
          ) : visible.length === 0 ? (
            <div className="text-center py-16 flex flex-col items-center gap-3">
              <i className="fas fa-bell-slash text-[40px] text-gray-200"></i>
              <p className="text-gray-400 text-[14px]">No notifications found.</p>
            </div>
          ) : (
            <>
              {visible.map((notif) => (
                <NotifCard key={notif.id} notif={notif} />
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}