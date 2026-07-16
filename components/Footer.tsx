"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

const RAW_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

const ORIGIN = RAW_BASE.replace(/\/api\/?$/, "");
const API_BASE = `${ORIGIN}/api`;

function extractSettings(payload: any): SiteSettings {
  const raw = payload?.data ?? {};

  const pick = (key: string): string | undefined => {
    const value = raw[key]?.value;

    return value && value !== "null" ? value : undefined;
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

export default function Footer() {
  const [settings, setSettings] = useState<SiteSettings>({});

  useEffect(() => {
    fetch(`${API_BASE}/settings`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch footer settings");
        }

        return response.json();
      })
      .then((payload) => {
        setSettings(extractSettings(payload));
      })
      .catch(() => {
        setSettings({});
      });
  }, []);

  const contactItems = [
    {
      icon: "fa-map-marker-alt",
      text:
        settings.footer_address ??
        "No 29 Brown Road, Kokuvil East, Jaffna.",
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

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Course", href: "/courses" },
    { label: "Staff", href: "/staff" },
    { label: "Contact", href: "/contact" },
    { label: "Academic", href: "/academic" },
    { label: "Administration", href: "/administration" },
    { label: "Research", href: "/research" },
    { label: "Library", href: "/library" },
    { label: "Student", href: "/student" },
  ];

  const courseItems = [
    "HND ICT",
    "HND CT",
    "HND BST",
    "HND PT",
    "HND MNT",
    "HND FOT",
    "HND FM",
  ];

  const socialLinks = [
    {
      icon: "fa-facebook-f",
      href: settings.facebook_url,
      label: "Facebook",
    },
    {
      icon: "fa-twitter",
      href: settings.twitter_url,
      label: "Twitter",
    },
    {
      icon: "fa-instagram",
      href: settings.instagram_url,
      label: "Instagram",
    },
    {
      icon: "fa-youtube",
      href: settings.youtube_url,
      label: "YouTube",
    },
    {
      icon: "fa-linkedin-in",
      href: settings.linkedin_url,
      label: "LinkedIn",
    },
  ].filter((social) => Boolean(social.href));

  return (
    <footer className="bg-[#0f1c2e] text-white">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-10 px-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {/* Get in Touch */}
        <div>
          <h5 className="mb-5 text-[15px] font-bold text-white">
            Get in Touch
          </h5>

          <div className="flex flex-col gap-3">
            {contactItems.map((item) => (
              <div
                key={item.icon}
                className="flex items-start gap-3 text-[13px] text-[#8da0c4]"
              >
                <span className="mt-0.5 shrink-0">
                  <i
                    className={`fas ${item.icon} text-[#e85d14]`}
                  ></i>
                </span>

                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Menus */}
        <div>
          <h5 className="mb-5 text-[15px] font-bold text-white">
            Menus
          </h5>

          <div className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[13px] text-[#8da0c4] transition-colors duration-150 hover:text-[#e85d14]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Our Courses */}
        <div>
          <h5 className="mb-5 text-[15px] font-bold text-white">
            Our Courses
          </h5>

          <div className="flex flex-col gap-2">
            {courseItems.map((course) => (
              <Link
                key={course}
                href="/courses"
                className="text-[13px] text-[#8da0c4] transition-colors duration-150 hover:text-[#e85d14]"
              >
                {course}
              </Link>
            ))}
          </div>
        </div>

        {/* Social Media */}
        <div>
          <h5 className="mb-5 text-[15px] font-bold text-white">
            Social Media
          </h5>

          <div className="flex gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.icon}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1a2f4a] text-[#8da0c4] transition-all duration-200 hover:bg-[#e85d14] hover:text-white"
              >
                <i
                  className={`fab ${social.icon} text-[14px]`}
                ></i>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex flex-col items-center justify-center gap-1.5 border-t border-[#1a2f4a] px-4 py-4 text-center text-[12px] text-[#607080] sm:flex-row sm:gap-2">
        <span>
          {settings.footer_text ?? (
            <>
              Copyright © 2026{" "}
              <span className="font-medium text-white">
                University College of Jaffna
              </span>{" "}
              | All Rights Reserved
            </>
          )}
        </span>

        <span className="hidden text-[#2a3d56] sm:inline">
          |
        </span>

        <span className="text-[#607080]">
          Developed by ICT 1st Batch Students
        </span>
      </div>
    </footer>
  );
}