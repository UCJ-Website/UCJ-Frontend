"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface HeroSlide {
  image_url: string;
}

interface ApiNotification {
  id: number;
  title: string;
  description: string;
  type: string;
  is_read: boolean;
  is_active: boolean;
  created_at: string;
}

// .env.local may or may not already include "/api" — normalize it here.
const RAW_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";
const ORIGIN = RAW_BASE.replace(/\/api\/?$/, "");
const API_BASE = `${ORIGIN}/api`;

// /api/settings returns: { success, data: { hero_image_1: { key, value, ... }, hero_image_2: {...}, hero_image_3: {...}, logo: {...} } }
function extractSlides(payload: any): HeroSlide[] {
  const settings = payload?.data ?? {};
  const imageKeys = ["hero_image_1", "hero_image_2", "hero_image_3"];

  return imageKeys
    .map((key) => settings[key]?.value)
    .filter((value) => !!value && value !== "null")
    .map((value) => ({ image_url: value }));
}

// /api/notifications returns: { success, data: { notifications: { data: ApiNotification[] } } }
function extractTickerItems(payload: any): string[] {
  const raw: ApiNotification[] =
    payload?.data?.notifications?.data ??
    payload?.notifications?.data ??
    payload?.data ??
    (Array.isArray(payload) ? payload : []);

  return raw
    .filter((n) => n.is_active)
    .map((n) => n.title)
    .filter(Boolean);
}

export default function HeroSection() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tickerItems, setTickerItems] = useState<string[]>([]);

  // Fetch hero slider images from Laravel /api/settings
  useEffect(() => {
    fetch(`${API_BASE}/settings`)
      .then((r) => r.json())
      .then((payload) => {
        const arr = extractSlides(payload);
        setSlides(arr);
      })
      .catch(() => setSlides([]))
      .finally(() => setLoading(false));
  }, []);

  // Fetch live notifications for the ticker strip
  useEffect(() => {
    fetch(`${API_BASE}/notifications`)
      .then((r) => r.json())
      .then((payload) => {
        const items = extractTickerItems(payload);
        setTickerItems(items);
      })
      .catch(() => setTickerItems([]));
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const len = slides.length;
      if (len === 0) return;
      setFading(true);
      setTimeout(() => {
        setCurrent((index + len) % len);
        setFading(false);
      }, 400);
    },
    [slides.length]
  );

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => goTo(current + 1), 5000);
    return () => clearInterval(timer);
  }, [current, goTo, slides.length]);

  const currentBg =
    slides.length > 0 ? slides[current].image_url : null;

  // Repeat the notification list a few times so the marquee loops smoothly,
  // regardless of how many notifications came back.
  const tickerLoop =
    tickerItems.length > 0
      ? Array(Math.max(1, Math.ceil(12 / tickerItems.length)))
          .fill(tickerItems)
          .flat()
      : [];

  return (
    <>
      {/* ===== TICKER ===== */}
      {tickerLoop.length > 0 && (
        <div className="bg-[#152244] text-[#8da0c4] text-[11px] sm:text-[12px] px-4 sm:px-10 py-[10px] flex items-center gap-6 overflow-hidden whitespace-nowrap">
          <div className="flex w-full overflow-hidden">
            <div className="inline-flex items-center gap-12 animate-ticker whitespace-nowrap">
              {tickerLoop.map((text, i) => (
                <span key={i} className="inline-flex items-center gap-2 shrink-0">
                  <i className="fas fa-bell text-[#e85d14]"></i>
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== HERO ===== */}
      <section className="relative min-h-[60vh] sm:min-h-[92vh] flex items-center overflow-hidden bg-[#0b1730]">

        {/* BG image — only when loaded */}
        {!loading && currentBg && (
          <div
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500 ${fading ? "opacity-0" : "opacity-100"}`}
            style={{ backgroundImage: `url('${currentBg}')` }}
          />
        )}

        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(110deg, rgba(11,23,48,0.92) 0%, rgba(11,23,48,0.82) 45%, rgba(11,23,48,0.45) 75%, rgba(11,23,48,0.20) 100%)",
          }}
        />

        {/* Geo circles — hidden on small screens */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
          <div className="absolute -top-[120px] -right-[80px] w-[520px] h-[520px] border border-[rgba(232,124,42,0.18)] rounded-full" />
          <div className="absolute -top-[60px] -right-[20px] w-[380px] h-[380px] border border-[rgba(232,124,42,0.10)] rounded-full" />
        </div>

        {/* Dot grid */}
        <div
          className="absolute bottom-[60px] left-1/2 w-[180px] h-[120px] opacity-60 pointer-events-none hidden sm:block"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.15) 1.5px, transparent 1.5px)",
            backgroundSize: "22px 22px",
          }}
        />

        {/* Accent line */}
        <div
          className="absolute left-0 bottom-0 w-full h-1 pointer-events-none"
          style={{
            background: "linear-gradient(90deg, #e87c2a 0%, transparent 60%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-[1280px] mx-auto px-5 sm:px-10 py-14 sm:py-20 w-full">
          <h1
            className="font-[Outfit,sans-serif] font-bold text-white leading-[1.08] tracking-[-1px] sm:tracking-[-1.5px] mb-4 sm:mb-5 max-w-[640px]"
            style={{ fontSize: "clamp(24px, 6vw, 60px)" }}
          >
            <span className="block font-light text-[0.72em] tracking-[0.02em] text-white/70 mb-1">
              Welcome to the
            </span>
            <span className="block whitespace-nowrap">
              University
              <span className="text-[#e87c2a]"> College of Jaffna</span>
            </span>
          </h1>

          <p className="text-white/60 text-[14px] sm:text-[16px] leading-[1.75] max-w-[500px] mb-8 sm:mb-10 font-light text-justify">
            Offering Higher National Diploma (HND) programs in ICT, Production
            Technology, Building Services, Construction, Farm Machinery, and
            Cosmetology — building skilled professionals for a stronger Northern
            Sri Lanka.
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-3 flex-wrap mb-10 sm:mb-[52px]">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 bg-[#e87c2a] text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-[10px] text-[13px] sm:text-[14px] font-semibold tracking-[0.03em] shadow-[0_6px_24px_rgba(232,124,42,0.40)] hover:bg-[#c56018] hover:-translate-y-0.5 transition-all duration-200"
            >
              <i className="fas fa-book-open"></i> Explore Courses
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 bg-white/[0.08] text-white/85 px-5 sm:px-7 py-3 sm:py-3.5 rounded-[10px] text-[13px] sm:text-[14px] font-medium border border-white/20 backdrop-blur-sm hover:bg-white/[0.14] hover:text-white hover:-translate-y-0.5 transition-all duration-200"
            >
              <i className="fas fa-info-circle"></i> About Us
            </Link>
          </div>

          {/* Quick links */}
          <div className="flex gap-2.5 sm:gap-3 flex-wrap">
            {[
              { icon: "fa-images", label: "Gallery", href: "/gallery" },
              { icon: "fa-tools", label: "Workshops", href: "/events" },
              { icon: "fa-bell", label: "Notices", href: "/notifications" },
            ].map((pill) => (
              <Link
                key={pill.label}
                href={pill.href}
                className="inline-flex items-center gap-2 bg-white/[0.07] border border-white/[0.14] text-white/70 text-[12px] sm:text-[12.5px] font-medium px-4 sm:px-[18px] py-2 sm:py-[9px] rounded-[10px] backdrop-blur-md hover:bg-[rgba(232,124,42,0.18)] hover:border-[rgba(232,124,42,0.35)] hover:text-[#f5b070] hover:-translate-y-0.5 transition-all duration-200"
              >
                <i className={`fas ${pill.icon} text-[12px] sm:text-[13px]`}></i> {pill.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Slide arrows — only when slides exist */}
        {slides.length > 1 && (
          <div className="absolute bottom-6 sm:bottom-10 right-4 sm:right-10 z-10 flex gap-2">
            {["left", "right"].map((dir) => (
              <button
                key={dir}
                onClick={() => goTo(dir === "left" ? current - 1 : current + 1)}
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/10 border border-white/20 text-white/80 text-[13px] sm:text-[14px] flex items-center justify-center backdrop-blur-md hover:bg-[#e87c2a] hover:border-[#e87c2a] hover:text-white transition-all duration-200"
                aria-label={dir === "left" ? "Previous slide" : "Next slide"}
              >
                {dir === "left" ? "❮" : "❯"}
              </button>
            ))}
          </div>
        )}

        {/* Slide dots — only when slides exist */}
        {slides.length > 1 && (
          <div className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-5 sm:w-6 h-2 bg-[#e87c2a]"
                    : "w-2 h-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        )}
      </section>

      {/* ===== STATS STRIP ===== */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1280px] mx-auto grid grid-cols-3">
          {[
            { num: "6+", label: "Diploma Programs" },
            { num: "1200+", label: "Students Enrolled" },
            { num: "10+", label: "Years of Excellence" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`py-4 sm:py-6 px-4 sm:px-8 text-center hover:bg-gray-50 transition-colors ${
                i < 2 ? "border-r border-gray-200" : ""
              }`}
            >
              <div className="font-[Outfit,sans-serif] text-[24px] sm:text-[30px] font-extrabold text-[#0b1730] leading-none">
                {stat.num.replace("+", "")}
                <sup className="text-[13px] sm:text-[16px] text-[#e87c2a] font-bold align-super">+</sup>
              </div>
              <div className="text-[11px] sm:text-[12px] text-gray-400 mt-1.5 font-normal tracking-[0.02em]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}