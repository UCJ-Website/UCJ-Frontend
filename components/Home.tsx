"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface NewsCard {
  img: string;
  tag: string;
  tagClass: string;
  date: string;
  title: string;
  meta: string;
  href: string;
  fallbackClass: string;
  fallbackIcon: string;
}

interface CourseCard {
  img: string;
  code: string;
  title: string;
  fallbackClass: string;
  fallbackIcon: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function CardGrid({ cards, altBg = false }: { cards: NewsCard[]; altBg?: boolean }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[22px]">
      {cards.map((card) => (
        <Link
          key={card.title}
          href={card.href}
          className={`flex flex-col rounded-2xl overflow-hidden border border-[#97938f] transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lg cursor-pointer ${altBg ? "bg-[#f8f9fc]" : "bg-white"}`}
        >
          <div className="h-[172px] relative overflow-hidden shrink-0">
            <img
              src={card.img}
              alt={card.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <div className={`absolute inset-0 bg-gradient-to-br ${card.fallbackClass} flex items-center justify-center -z-10`}>
              <i className={`fas ${card.fallbackIcon} text-5xl text-white/20`}></i>
            </div>
            <span className={`absolute top-3.5 left-3.5 ${card.tagClass} text-white text-[10px] font-bold uppercase tracking-[0.06em] px-2.5 py-1 rounded-full`}>
              {card.tag}
            </span>
            <div className="absolute bottom-3.5 right-3.5 bg-[rgba(11,23,48,0.75)] backdrop-blur-sm text-white/85 text-[11px] font-medium px-2.5 py-1 rounded flex items-center gap-1">
              <i className="fas fa-calendar text-[10px] text-[#e85d14]"></i> {card.date}
            </div>
          </div>
          <div className="p-5 flex flex-col gap-2.5 flex-1">
            <div className="text-[14px] font-semibold text-[#0f1729] leading-[1.55]">{card.title}</div>
            <div className="text-[12px] text-gray-400 flex items-center gap-1 mt-auto">
              <i className="fas fa-tag text-[11px] text-[#e85d14]"></i> {card.meta}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[22px]">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-2xl overflow-hidden border border-gray-200 bg-white animate-pulse">
          <div className="h-[172px] bg-gray-200" />
          <div className="p-5 flex flex-col gap-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-3 bg-gray-100 rounded w-1/3 mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function SectionHeader({ eyebrow, title, highlight, viewAllHref, viewAllLabel }: {
  eyebrow: string; title: string; highlight: string;
  viewAllHref: string; viewAllLabel: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-[26px] flex-wrap">
      <div>
        <div className="flex items-center gap-2 text-[11px] font-bold text-[#e85d14] uppercase tracking-[0.14em] mb-2">
          <span className="w-5 h-0.5 bg-[#e85d14] rounded"></span>
          {eyebrow}
        </div>
        <h2 className="font-[Outfit,sans-serif] font-extrabold text-[#0b1730] tracking-[-0.5px] leading-[1.15]"
          style={{ fontSize: "clamp(24px, 3vw, 34px)" }}>
          {title} <span className="text-[#e85d14]">{highlight}</span>
        </h2>
      </div>
      <Link href={viewAllHref} className="inline-flex items-center gap-1.5 text-[#e85d14] text-[13px] font-semibold whitespace-nowrap hover:gap-2.5 transition-all duration-200">
        {viewAllLabel} <i className="fas fa-arrow-right text-[11px]"></i>
      </Link>
    </div>
  );
}

export default function HomeSections() {
  const [news, setNews] = useState<NewsCard[]>([]);
  const [events, setEvents] = useState<NewsCard[]>([]);
  const [courses, setCourses] = useState<CourseCard[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/news`)
      .then((r) => r.json())
      .then((data) => setNews(Array.isArray(data) ? data : data.data ?? []))
      .catch(() => setNews([]))
      .finally(() => setLoadingNews(false));

    fetch(`${API_BASE}/api/events`)
      .then((r) => r.json())
      .then((data) => setEvents(Array.isArray(data) ? data : data.data ?? []))
      .catch(() => setEvents([]))
      .finally(() => setLoadingEvents(false));

    fetch(`${API_BASE}/api/courses`)
      .then((r) => r.json())
      .then((data) => setCourses(Array.isArray(data) ? data : data.data ?? []))
      .catch(() => setCourses([]))
      .finally(() => setLoadingCourses(false));
  }, []);

  return (
    <>
      {/* ===== LATEST NEWS ===== */}
      <section className="py-[30px] px-5 bg-[#f8f9fc]">
        <div className="max-w-[1280px] mx-auto">
          <SectionHeader
            eyebrow="Updates" title="Latest" highlight="News"
            viewAllHref="/news" viewAllLabel="View All News"
          />
          {loadingNews ? <SkeletonGrid /> : news.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-10">No news available.</p>
          ) : (
            <CardGrid cards={news} />
          )}
        </div>
      </section>

      {/* ===== LATEST EVENTS ===== */}
      <section className="py-[30px] px-5 bg-white">
        <div className="max-w-[1280px] mx-auto">
          <SectionHeader
            eyebrow="What's On" title="Latest" highlight="Events"
            viewAllHref="/events" viewAllLabel="View All Events"
          />
          {loadingEvents ? <SkeletonGrid /> : events.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-10">No events available.</p>
          ) : (
            <CardGrid cards={events} altBg />
          )}
        </div>
      </section>

      {/* ===== OUR COURSES ===== */}
      <section className="py-[30px] px-5 bg-[#f8f9fc]">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex items-end justify-between gap-4 mb-[26px] flex-wrap">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold text-[#e85d14] uppercase tracking-[0.14em] mb-2">
                <span className="w-5 h-0.5 bg-[#e85d14] rounded"></span>
                Courses
              </div>
              <h2 className="font-[Outfit,sans-serif] font-extrabold text-[#0b1730] tracking-[-0.5px] leading-[1.15]"
                style={{ fontSize: "clamp(24px, 3vw, 34px)" }}>
                Our <span className="text-[#e85d14]">Courses</span>
              </h2>
            </div>
          </div>

          {loadingCourses ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[22px]">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-gray-200 bg-white animate-pulse">
                  <div className="h-[150px] bg-gray-200" />
                  <div className="p-5 flex flex-col gap-3">
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/3 mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : courses.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-10">No courses available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[22px]">
              {courses.map((course) => (
                <div key={course.code} className="flex flex-col bg-white rounded-2xl overflow-hidden border border-[#97938f] transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lg cursor-pointer">
                  <div className="h-[150px] relative overflow-hidden">
                    <img
                      src={course.img}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${course.fallbackClass} flex items-center justify-center -z-10`}>
                      <i className={`fas ${course.fallbackIcon} text-[40px] text-white/20`}></i>
                    </div>
                    <span className="absolute top-3 right-3 bg-[#e85d14] text-white text-[10px] font-bold uppercase tracking-[0.04em] px-2.5 py-0.5 rounded-full">
                      Free
                    </span>
                  </div>
                  <div className="p-5 flex flex-col gap-2 flex-1">
                    <div className="text-[11px] font-bold text-[#e85d14] uppercase tracking-[0.10em]">{course.code}</div>
                    <div className="text-[13.5px] font-semibold text-[#0f1729] leading-[1.5]">{course.title}</div>
                    <Link href="/courses/details" className="inline-flex items-center gap-1.5 text-[#e85d14] text-[12px] font-semibold mt-auto pt-2 hover:gap-2.5 transition-all duration-200">
                      Learn More <i className="fas fa-arrow-right text-[10px]"></i>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}