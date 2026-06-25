"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface SettingField {
  value: string;
}

interface SiteSettings {
  footer_address?: string;
  footer_phone?: string;
  footer_email?: string;
  footer_text?: string;
  facebook_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  linkedin_url?: string;
}

// .env.local may or may not already include "/api" — normalize it here.
const RAW_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";
const ORIGIN = RAW_BASE.replace(/\/api\/?$/, "");
const API_BASE = `${ORIGIN}/api`;

// /api/settings returns: { success, data: { footer_address: { value }, footer_phone: { value }, ... } }
function extractSettings(payload: any): SiteSettings {
  const raw = payload?.data ?? {};
  const pick = (key: string): string | undefined => {
    const v = raw[key]?.value;
    return v && v !== "null" ? v : undefined;
  };

  return {
    footer_address: pick("footer_address"),
    footer_phone: pick("footer_phone"),
    footer_email: pick("footer_email"),
    footer_text: pick("footer_text"),
    facebook_url: pick("facebook_url"),
    twitter_url: pick("twitter_url"),
    instagram_url: pick("instagram_url"),
    youtube_url: pick("youtube_url"),
    linkedin_url: pick("linkedin_url"),
  };
}

// TODO: replace with the real team's details (name, role, photo, links).
interface Developer {
  name: string;
  role: string;
  initials: string;
  linkedin?: string;
  github?: string;
}

const DEVELOPERS: Developer[] = [
  {
    name: "Priyanka Thirunavukkarasu",
    role: "Frontend Developer",
    initials: "T",
    linkedin: "https://www.linkedin.com/in/priyanka-thirunavukkarasu-",
    github: "https://github.com/5Priyo",
  },
  {
    name: "Thamilselven Poologarasa",
    role: "Backend Developer",
    initials: "BE",
    linkedin: "https://www.linkedin.com/in/thamilselven/",
    github: "https://github.com/tselven",
  },
];

function DeveloperModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[440px] p-6 sm:p-8 relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-[#0f1c2e] transition-colors"
        >
          <i className="fas fa-times"></i>
        </button>

        <h3 className="text-[18px] font-bold text-[#0f1c2e] mb-1">
          Built by ICT 1st Batch
        </h3>
        <p className="text-[13px] text-gray-500 mb-6">
          This website was designed and developed by the following students.
        </p>

        <div className="flex flex-col gap-4">
          {DEVELOPERS.map((dev) => (
            <div
              key={dev.name}
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50"
            >
              <div className="w-12 h-12 rounded-full bg-[#1a3a6b] text-white flex items-center justify-center font-bold text-[14px] shrink-0">
                {dev.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-semibold text-[#0f1c2e] truncate">
                  {dev.name}
                </div>
                <div className="text-[12px] text-gray-500">{dev.role}</div>
              </div>
              <div className="flex gap-2 shrink-0">
                {dev.linkedin && (
                  <a
                    href={dev.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-[#1a3a6b] hover:text-white hover:border-[#1a3a6b] transition-colors"
                    aria-label={`${dev.name} on LinkedIn`}
                  >
                    <i className="fab fa-linkedin-in text-[13px]"></i>
                  </a>
                )}
                {dev.github && (
                  <a
                    href={dev.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-[#0f1c2e] hover:text-white hover:border-[#0f1c2e] transition-colors"
                    aria-label={`${dev.name} on GitHub`}
                  >
                    <i className="fab fa-github text-[13px]"></i>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [showDevModal, setShowDevModal] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/settings`)
      .then((r) => r.json())
      .then((payload) => setSettings(extractSettings(payload)))
      .catch(() => setSettings({}));
  }, []);

  const contactItems = [
    {
      icon: "fa-map-marker-alt",
      text: settings.footer_address ?? "No 29 Brown Road, Kokuvil East, Jaffna.",
    },
    {
      icon: "fa-envelope",
      text: settings.footer_email ?? "info@ucj.ac.lk",
    },
    {
      icon: "fa-phone",
      text: settings.footer_phone ?? "+94 0212 217 791",
    },
  ];

  const socialLinks = [
    { icon: "fa-facebook-f", href: settings.facebook_url },
    { icon: "fa-twitter", href: settings.twitter_url },
    { icon: "fa-instagram", href: settings.instagram_url },
    { icon: "fa-youtube", href: settings.youtube_url },
    { icon: "fa-linkedin-in", href: settings.linkedin_url },
  ].filter((s) => !!s.href);

  return (
    <footer className="bg-[#0f1c2e] text-white">
      <div className="max-w-[1280px] mx-auto px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Get in Touch */}
        <div>
          <h5 className="text-[15px] font-bold mb-5 text-white">Get in Touch</h5>
          <div className="flex flex-col gap-3">
            {contactItems.map((item) => (
              <div key={item.icon} className="flex items-start gap-3 text-[13px] text-[#8da0c4]">
                <span className="mt-0.5 shrink-0">
                  <i className={`fas ${item.icon} text-[#e85d14]`}></i>
                </span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Menus */}
        <div>
          <h5 className="text-[15px] font-bold mb-5 text-white">Menus</h5>
          <div className="flex flex-col gap-2">
            {[
              { label: "Home", href: "/" },
              { label: "Course", href: "/courses" },
              { label: "Staff", href: "/staff" },
              { label: "Contact", href: "/contact" },
              { label: "Academic", href: "/academic" },
              { label: "Administration", href: "/administration" },
              { label: "Research", href: "/research" },
              { label: "Library", href: "/library" },
              { label: "Student", href: "/student" },
            ].map((item) => (
              <Link key={item.label} href={item.href} className="text-[13px] text-[#8da0c4] hover:text-[#e85d14] transition-colors duration-150">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Our Courses */}
        <div>
          <h5 className="text-[15px] font-bold mb-5 text-white">Our Courses</h5>
          <div className="flex flex-col gap-2">
            {["HND ICT", "HND CT", "HND BST", "HND PT", "HND MNT", "HND FOT", "HND FM"].map((course) => (
              <Link key={course} href="/courses" className="text-[13px] text-[#8da0c4] hover:text-[#e85d14] transition-colors duration-150">
                {course}
              </Link>
            ))}
          </div>
        </div>

        {/* Social Media */}
        <div>
          <h5 className="text-[15px] font-bold mb-5 text-white">Social Media</h5>
          <div className="flex gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.icon}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#1a2f4a] flex items-center justify-center text-[#8da0c4] hover:bg-[#e85d14] hover:text-white transition-all duration-200"
              >
                <i className={`fab ${social.icon} text-[14px]`}></i>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#1a2f4a] py-4 px-4 text-center text-[12px] text-[#607080] flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2">
        <span>
          {settings.footer_text ?? (
            <>Copyright © 2026 <span className="text-white font-medium">University College of Jaffna</span> | All Rights Reserved</>
          )}
        </span>
        <span className="hidden sm:inline text-[#2a3d56]">|</span>
        <button
          onClick={() => setShowDevModal(true)}
          className="text-[#607080] hover:text-[#e85d14] underline underline-offset-2 transition-colors bg-transparent border-none cursor-pointer p-0"
        >
          Developed by ICT 1st Batch Students
        </button>
      </div>

      {showDevModal && <DeveloperModal onClose={() => setShowDevModal(false)} />}
    </footer>
  );
}