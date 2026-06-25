"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

interface ApiResource {
  id: number;
  notification_id: number;
  title: string;
  url: string;
  created_at: string;
  updated_at: string;
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

const BADGE: Record<string, string> = {
  vacancy: "bg-[#1a3a6b] text-white",
  result: "bg-[#126b50] text-white",
  notice: "bg-[#e85d14] text-white",
};

const TYPE_ICON: Record<string, string> = {
  vacancy: "fa-briefcase",
  result: "fa-graduation-cap",
  notice: "fa-exclamation-circle",
};

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-LK", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NotificationDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [notif, setNotif] = useState<ApiNotification | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;

    // Fetch the full list and find the matching notification by id
    fetch(`${API_BASE}/api/notifications`)
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json();
      })
      .then((json) => {
        const candidates = [
          json?.data?.notifications?.data,
          json?.notifications?.data,
          json?.data,
          json,
        ];
        const list: ApiNotification[] =
          candidates.find((c) => Array.isArray(c)) ?? [];

        const found = list.find((n) => String(n.id) === String(slug));
        if (!found) throw new Error("Not found");
        setNotif(found);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <>
      {/* Hero Banner */}
      <div
        style={{
          background: "linear-gradient(135deg,#1a3a6b 0%,#2d5fa6 100%)",
          padding: "36px 20px 32px",
          textAlign: "center",
        }}
      >
        <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 800, margin: "0 0 6px" }}>
          <i className="fas fa-bell" style={{ marginRight: 10 }}></i>
          Notification Detail
        </h1>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, margin: 0 }}>
          University College of Jaffna
        </p>
        <div className="mt-3 text-white/50 text-[13px]">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          {" / "}
          <Link href="/notifications" className="hover:text-white transition-colors">
            Notifications
          </Link>
          {" / "}
          <span className="text-white/80">{notif?.title ?? "Detail"}</span>
        </div>
      </div>

      <div className="max-w-[820px] mx-auto px-5 py-10">
        {/* Back button */}
        <Link
          href="/notifications"
          className="inline-flex items-center gap-2 text-[13px] text-[#1a3a6b] font-semibold mb-6 hover:underline"
        >
          <i className="fas fa-arrow-left text-[11px]"></i> Back to Notifications
        </Link>

        {/* Loading skeleton */}
        {loading && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 animate-pulse flex flex-col gap-4">
            <div className="h-4 bg-gray-200 rounded w-1/5" />
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-full" />
            <div className="h-3 bg-gray-100 rounded w-5/6" />
            <div className="h-3 bg-gray-100 rounded w-2/3" />
            <div className="mt-4 flex gap-3">
              <div className="h-10 bg-gray-200 rounded-xl w-36" />
              <div className="h-10 bg-gray-100 rounded-xl w-36" />
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-20 flex flex-col items-center gap-3">
            <i className="fas fa-triangle-exclamation text-[44px] text-gray-200"></i>
            <p className="text-gray-400 text-[14px]">
              Notification not found. It may have been removed or the API is offline.
            </p>
            <Link
              href="/notifications"
              className="mt-2 text-[13px] text-[#1a3a6b] font-semibold hover:underline"
            >
              ← Back to list
            </Link>
          </div>
        )}

        {/* Detail Card */}
        {!loading && !error && notif && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Colored top strip */}
            <div
              className={
                "h-1.5 w-full " +
                (notif.type === "vacancy"
                  ? "bg-[#1a3a6b]"
                  : notif.type === "result"
                  ? "bg-[#126b50]"
                  : "bg-[#e85d14]")
              }
            />

            <div className="p-8 flex flex-col gap-5">
              {/* Badge */}
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className={
                    "inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full " +
                    (BADGE[notif.type] ?? "bg-gray-200 text-gray-600")
                  }
                >
                  <i className={"fas " + (TYPE_ICON[notif.type] ?? "fa-bell") + " text-[10px]"}></i>
                  {notif.type}
                </span>
                {!notif.is_read && (
                  <span className="text-[11px] bg-blue-50 text-[#1a3a6b] border border-[#c5d1f0] font-semibold px-2.5 py-0.5 rounded-full">
                    New
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="text-[24px] font-extrabold text-[#0b1730] leading-snug">
                {notif.title}
              </h2>

              {/* Meta */}
              <div className="flex items-center gap-4 text-[12px] text-gray-400 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <i className="far fa-clock"></i>
                  {formatDate(notif.created_at)}
                </span>
                {notif.created_at !== notif.updated_at && (
                  <span className="flex items-center gap-1.5">
                    <i className="fas fa-pen text-[10px]"></i>
                    Updated {formatDate(notif.updated_at)}
                  </span>
                )}
              </div>

              <hr className="border-gray-100" />

              {/* Description */}
              <p className="text-[15px] text-[#3d4a6a] leading-[1.8]">
                {notif.description}
              </p>

              {/* Resources */}
              {notif.resources && notif.resources.length > 0 && (
                <div className="mt-2 flex flex-col gap-3">
                  <p className="text-[12px] font-bold uppercase tracking-widest text-gray-400">
                    Related Links
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {notif.resources.map((res, idx) => (
                      <a
                        key={res.id}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={
                          "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-colors " +
                          (idx === 0
                            ? "bg-[#1a3a6b] text-white hover:bg-[#0f2a5e]"
                            : "bg-gray-50 text-[#1a3a6b] border border-[#c5d1f0] hover:bg-[#eef2fb]")
                        }
                      >
                        <i
                          className={
                            "fas " +
                            (idx === 0 ? "fa-arrow-right" : "fa-external-link-alt") +
                            " text-[11px]"
                          }
                        ></i>
                        {res.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}