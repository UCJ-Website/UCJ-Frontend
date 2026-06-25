"use client";

import { useRef, useState } from "react";

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  description: string;
  cover_image: string;
  year: number;
  month: string;
}

export default function GalleryDragScroll({
  items,
  apiBase,
}: {
  items: GalleryItem[];
  apiBase: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);
  const [dragging, setDragging] = useState(false);

  function resolveImg(path: string) {
    return path.startsWith("http") ? path : `${apiBase}/storage/${path}`;
  }

  function onPointerDown(e: React.PointerEvent) {
    if (!trackRef.current) return;
    isDown.current = true;
    setDragging(true);
    startX.current = e.clientX;
    scrollStart.current = trackRef.current.scrollLeft;
    trackRef.current.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!isDown.current || !trackRef.current) return;
    const dx = e.clientX - startX.current;
    trackRef.current.scrollLeft = scrollStart.current - dx;
  }

  function endDrag() {
    isDown.current = false;
    setDragging(false);
  }

  return (
    <div
      ref={trackRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      className={`flex gap-4 overflow-x-auto select-none pb-2 ${
        dragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      style={{ scrollbarWidth: "thin" }}
    >
      {items.map((item) => (
        <div
          key={item.id}
          className="shrink-0 w-[230px] rounded-xl border border-[#e5eaf3] overflow-hidden bg-[#f8fafc]"
        >
          <div className="h-[140px] bg-[#eff6ff] overflow-hidden">
            <img
              src={resolveImg(item.cover_image)}
              alt={item.title}
              draggable={false}
              className="w-full h-full object-cover pointer-events-none"
            />
          </div>
          <div className="p-3">
            <div className="text-[13px] font-semibold text-[#0f2a5e] truncate">
              {item.title}
            </div>
            <div className="text-[11px] text-[#6b7280] mt-1">
              {item.month} {item.year} · {item.category}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}