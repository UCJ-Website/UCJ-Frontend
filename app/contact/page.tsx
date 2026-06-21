"use client";

import Link from "next/link";
import { useState } from "react";

// .env.local may or may not already include "/api" — normalize it here.
const RAW_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";
const ORIGIN = RAW_BASE.replace(/\/api\/?$/, "");
const API_BASE = `${ORIGIN}/api`;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch(`${API_BASE}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message || "Failed to send message");
      }

      setSubmitted(true);
      form.reset();
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputBase =
    "w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-[14px] text-[#1a2f4a] outline-none focus:border-[#e85d14] focus:ring-2 focus:ring-[#e85d14]/15 transition-all bg-[#f8fafc] focus:bg-white";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Poppins:wght@600;700;800&display=swap');
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-poppins { font-family: 'Poppins', sans-serif; }

        .ucj-contact-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .ucj-contact-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(15, 28, 46, 0.1);
          border-color: rgba(232, 93, 20, 0.35);
        }
      `}</style>

      {/* ===== HERO BANNER ===== */}
      <div
        className="relative flex flex-col items-center justify-center text-center py-20 px-5 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0f1c2e 0%, #1a3a5c 60%, #e85d14 120%)",
          minHeight: "260px",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <div className="relative z-10">
          <div className="text-[#e85d14] text-[13px] font-semibold tracking-widest uppercase mb-3">
            <i className="fas fa-comments mr-2"></i>
            Get In Touch
          </div>
          <h1 className="font-poppins text-white font-extrabold text-[clamp(32px,5vw,52px)] leading-tight mb-3">
            Contact <span className="text-[#e85d14]">Us</span>
          </h1>
          <p className="text-white/70 text-[15px] mb-5">
            We&apos;d love to hear from you — reach out anytime
          </p>
          <div className="text-white/50 text-[13px]">
            <Link href="/" className="hover:text-[#e85d14] transition-colors">
              Home
            </Link>
            {" / "}
            <span className="text-[#e85d14]">Contact Us</span>
          </div>
        </div>
      </div>

      {/* ===== FORM + SIDEBAR ===== */}
      <section className="py-16 px-5 bg-[#f0f4f8]">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-10">

            {/* Sidebar */}
            <div className="flex flex-col gap-6">
              <div>
                <div className="text-[#e85d14] text-[12px] font-bold tracking-widest uppercase mb-2">
                  Send a Message
                </div>
                <h2 className="font-poppins text-[clamp(24px,3vw,34px)] font-extrabold text-[#0f1c2e] leading-tight mb-3">
                  Write Us a{" "}
                  <span className="font-playfair text-[#e85d14] italic font-bold">
                    Message Here
                  </span>
                </h2>
                <p className="text-[14px] text-[#607080] leading-[1.75]">
                  Fill in the form and our team will get back to you within one
                  business day.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {[
                  {
                    icon: "fa-map-marker-alt",
                    label: "Location",
                    value: "No 29 Brown Road, Kokuvil East, Jaffna",
                  },
                  {
                    icon: "fa-envelope",
                    label: "Email",
                    value: "info@ucj.ac.lk",
                  },
                  {
                    icon: "fa-phone",
                    label: "Phone",
                    value: "+94 0212 217 791",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="ucj-contact-card flex items-start gap-4 bg-white rounded-2xl border border-gray-200 p-4 shadow-sm"
                  >
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0f1c2e] to-[#1a2f4a] flex items-center justify-center text-[#e85d14] flex-shrink-0">
                      <i className={`fas ${item.icon} text-[15px]`}></i>
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-[#e85d14] uppercase tracking-wider mb-0.5">
                        {item.label}
                      </div>
                      <div className="text-[14px] text-[#1a2f4a] font-medium">
                        {item.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social row */}
              <div className="flex gap-3">
                {["fa-facebook-f", "fa-youtube", "fa-envelope"].map((icon) => (
                  < a
                    key={icon}
                    href="#"
                    className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#1a2f4a] hover:bg-[#e85d14] hover:text-white hover:border-[#e85d14] transition-all duration-200 shadow-sm"
                  >
                    <i className={`fab ${icon} text-[14px]`}></i>
                  </a>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {error && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-[13px] font-medium rounded-xl px-4 py-3">
                    <i className="fas fa-circle-exclamation"></i>
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-[#0f1c2e]">
                      Full Name
                    </label>
                    <div className="relative">
                      <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa8bd] text-[13px]"></i>
                      <input
                        type="text"
                        name="name"
                        placeholder="Your full name"
                        required
                        className={inputBase}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-[#0f1c2e]">
                      Email Address
                    </label>
                    <div className="relative">
                      <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa8bd] text-[13px]"></i>
                      <input
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        required
                        className={inputBase}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[#0f1c2e]">
                    Phone Number
                  </label>
                  <div className="relative">
                    <i className="fas fa-phone absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa8bd] text-[13px]"></i>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+94 xxx xxx xxx"
                      required
                      className={inputBase}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[#0f1c2e]">
                    Subject
                  </label>
                  <div className="relative">
                    <i className="fas fa-tag absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa8bd] text-[13px]"></i>
                    <input
                      type="text"
                      name="subject"
                      placeholder="What's this about?"
                      className={inputBase}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[#0f1c2e]">
                    Message
                  </label>
                  <div className="relative">
                    <i className="fas fa-comment-dots absolute left-4 top-4 text-[#9aa8bd] text-[13px]"></i>
                    <textarea
                      name="message"
                      rows={5}
                      placeholder="Write your message here…"
                      required
                      className={`${inputBase} resize-none`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-white font-semibold text-[14px] transition-all duration-300 shadow-md disabled:opacity-60 disabled:cursor-not-allowed ${
                    submitted
                      ? "bg-[#1a8a5a]"
                      : "bg-[#e85d14] hover:bg-[#cf4f0f] hover:-translate-y-0.5 hover:shadow-lg"
                  }`}
                >
                  <i
                    className={`fas ${
                      submitted ? "fa-check" : submitting ? "fa-spinner fa-spin" : "fa-paper-plane"
                    }`}
                  ></i>
                  {submitted ? "Message Sent!" : submitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MAP ===== */}
      <section className="relative bg-white">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3933.0234567890123!2d80.0123456789!3d9.6789012345678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwNDAnNDQuMCJOIDgwwrAwMCc0NC4wIkU!5e0!3m2!1sen!2slk!4v1234567890123!5m2!1sen!2slk"
          className="w-full"
          style={{ height: "420px", border: 0, display: "block", filter: "grayscale(15%)" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />

        {/* Floating info card */}
        <div className="hidden md:flex absolute top-8 left-8 bg-white rounded-2xl shadow-xl border border-gray-200 p-6 max-w-[280px] flex-col gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0f1c2e] to-[#1a2f4a] flex items-center justify-center text-[#e85d14]">
            <i className="fas fa-map-marker-alt text-[16px]"></i>
          </div>
          <h4 className="font-playfair font-bold text-[#0f1c2e] text-[15px]">
            University College of Jaffna
          </h4>
          <p className="text-[13px] text-[#607080] leading-[1.6]">
            No 29 Brown Road, Kokuvil East, Jaffna.
          </p>
          <a
            href="https://www.google.com/maps"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] font-semibold text-[#e85d14] hover:text-[#cf4f0f] flex items-center gap-1.5"
          >
            Get Directions <i className="fas fa-arrow-right text-[11px]"></i>
          </a>
        </div>
      </section>
    </>
  );
}