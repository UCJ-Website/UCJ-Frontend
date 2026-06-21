"use client";

import { useState } from "react";

export default function CourseImage({
  src,
  alt,
  fallbackIcon,
}: {
  src: string;
  alt: string;
  fallbackIcon: string;
}) {
  const [errored, setErrored] = useState(false);

  return (
    <div
      className="relative h-48 flex items-center justify-center overflow-hidden"
      style={{ background: "#e8edf5" }}
    >
      <i className={`fas ${fallbackIcon} text-[64px] text-[#0f2a5e]/20`}></i>
      {!errored && src && (
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setErrored(true)}
        />
      )}
    </div>
  );
}