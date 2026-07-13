"use client";

import { useState } from "react";

interface CourseImageProps {
  src: string;
  alt: string;
  fallbackIcon?: string; // FontAwesome icon class, e.g. "fa-desktop"
}

export default function CourseImage({ src, alt, fallbackIcon = "fa-image" }: CourseImageProps) {
  const [failed, setFailed] = useState(false);

  const showFallback = !src || src.trim() === "" || failed;

  if (showFallback) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#0b1730]/40">
        <i className={`fas ${fallbackIcon} text-white/70 text-[22px]`}></i>
      </div>
    );
  }

  return (
    // Plain <img> is used (not next/image) so this works regardless of
    // next.config.ts remotePatterns setup for the Laravel storage host.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}