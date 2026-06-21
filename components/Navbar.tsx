"use client";

import { useState } from "react";
import Link from "next/link";
import "./css/navbar.css";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const toggle = (k: string) => setMobileExpanded(p => p === k ? null : k);

  const di = "flex items-center gap-2 px-3 py-[9px] rounded text-[13px] font-medium text-[#3d4a6a] hover:bg-gray-100 hover:text-[#e85d14] transition-colors whitespace-nowrap";

  const mobileGroups = [
    {
      key: "about", label: "About", items: [
        { icon: "fa-bullseye", label: "Vision & Mission", href: "/about" },
        { icon: "fa-landmark", label: "History", href: "/about" },
      ]
    },
    {
      key: "academic", label: "Academic", items: [
        { icon: "fa-tools", label: "Building Services Technology", href: "/departments/building-services" },
        { icon: "fa-hard-hat", label: "Construction Technology", href: "/departments/construction" },
        { icon: "fa-robot", label: "Mechatronics Technology", href: "/departments/mechatronics" },
        { icon: "fa-tractor", label: "Farm Machinery", href: "/departments/farm-machinery" },
        { icon: "fa-industry", label: "Production Technology", href: "/departments/production" },
        { icon: "fa-flask", label: "Food Technology", href: "/departments/food-technology" },
        { icon: "fa-concierge-bell", label: "Hospitality Management", href: "/departments/hospitality" },
        { icon: "fa-handshake", label: "Career Guidance Unit", href: "/management/social-reconciliation" },
        { icon: "fa-users", label: "Staff Development Unit", href: "/management/staff-development" },
      ]
    },
    {
      key: "courses", label: "Courses", items: [
        { icon: "fa-desktop", label: "General ICT and English", href: "/courses/general" },
        { icon: "fa-graduation-cap", label: "HND Courses", href: "/courses" },
      ]
    },
    {
      key: "admin", label: "Administration", items: [
        { icon: "fa-building", label: "Director Office", href: "/management" },
        { icon: "fa-briefcase", label: "Admin Office", href: "/management" },
        { icon: "fa-hand-holding-usd", label: "Finance and Accounts", href: "/management" },
        { icon: "fa-user-plus", label: "Admissions", href: "/student-services" },
        { icon: "fa-clipboard-list", label: "Examination", href: "/student-services" },
      ]
    },
    {
      key: "research", label: "Research", items: [
        { icon: "fa-lightbulb", label: "Innovation Projects", href: "/research/innovation-projects" },
        { icon: "fa-book", label: "Publications", href: "/research/publications" },
      ]
    },
    {
      key: "student", label: "Student", items: [
        { icon: "fa-heart", label: "Student Life", href: "/student/studentlife" },
        { icon: "fa-file-alt", label: "Student Form", href: "/student/studentform" },
      ]
    },
  ];

  return (
    <div>
      {/* TOPBAR */}
      <div className="bg-[#0f1c2e] text-[#8da0c4] text-[11px] px-5 py-2 flex items-center gap-5 sticky top-0" style={{ zIndex: 1001 }}>
        <span className="flex items-center gap-2 ml-4 shrink-0">
          <i className="fas fa-map-marker-alt text-[#e85d14]" />
          <span className="hidden sm:inline">No 29 Brown Road, Kokuvil East, Jaffna.</span>
          <span className="sm:hidden">Kokuvil East, Jaffna.</span>
        </span>
        <span className="flex items-center gap-2 shrink-0">
          <i className="fas fa-phone text-[#e85d14]" />
          +94 0212 217791
        </span>
      </div>

      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 sticky shadow-sm" style={{ zIndex: 1000, top: 38 }}>
        <div className="max-w-[1280px] mx-auto px-10 h-[70px] flex items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <img src="/ucj.png" alt="UCJ Logo" className="h-[44px] w-auto object-contain" />
            <div className="hidden sm:block text-[16px] font-bold text-[#0f1c2e] tracking-tight leading-tight">
              University College of Jaffna
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link href="/" className="nav-plain">Home</Link>

            {/* About */}
            <div className="nav-group">
              <Link href="/about" className="nav-plain">About <i className="fas fa-chevron-down text-[10px]" /></Link>
              <div className="dropdown-panel">
                <Link href="/about" className={di}><i className="fas fa-bullseye text-gray-400 w-[18px] text-center" /> Vision &amp; Mission</Link>
                <Link href="/about" className={di}><i className="fas fa-landmark text-gray-400 w-[18px] text-center" /> History</Link>
              </div>
            </div>

            {/* Academic */}
            <div className="nav-group">
              <Link href="/academic" className="nav-plain">Academic <i className="fas fa-chevron-down text-[10px]" /></Link>
              <div className="dropdown-panel mega-panel">
                <div className="flex">
                  <div className="flex-1 p-4 border-r border-gray-100">
                    <div className="text-[11px] font-bold uppercase tracking-wide text-gray-400 mb-2 pb-2 border-b border-gray-100 flex items-center gap-2">
                      <i className="fas fa-building text-[#e85d14]" /> Departments
                    </div>
                    <div className="text-[11px] font-semibold uppercase text-[#185FA5] flex items-center gap-1 px-3 py-1">
                      <i className="fas fa-cogs" /> Engineering
                    </div>
                    {[
                      { icon: "fa-tools", label: "Building Services Technology", href: "/academic/departments/department-of-building-services-technology" },
                      { icon: "fa-hard-hat", label: "Construction Technology", href: "/academic/departments/department-of-construction-technology" },
                      { icon: "fa-robot", label: "Mechatronics Technology", href: "/academic/departments/department-of-mechatronics-technology" },
                      { icon: "fa-tractor", label: "Farm Machinery", href: "/academic/departments/department-of-farm-machinery" },
                      { icon: "fa-industry", label: "Production Technology", href: "/academic/departments/department-of-production-technology" },
                    ].map(item => (
                      <Link key={item.label} href={item.href} className={di}>
                        <i className={`fas ${item.icon} text-gray-400 w-[18px] text-center`} /> {item.label}
                      </Link>
                    ))}
                    <div className="my-1.5 mx-3 border-t border-gray-200" />
                    <div className="text-[11px] font-semibold uppercase text-[#3B6D11] flex items-center gap-1 px-3 py-1">
                      <i className="fas fa-graduation-cap" /> Non-Engineering
                    </div>
                    {[
                      { icon: "fa-flask", label: "Food Technology", href: "/academic/departments/department-of-food-technology" },
                      { icon: "fa-concierge-bell", label: "Hospitality Management", href: "/academic/departments/department-of-hospitality-management" },
                      { icon: "fa-compass", label: "Interdisciplinary", href: "/academic/departments/department-of-interdisciplinary" },
                    ].map(item => (
                      <Link key={item.label} href={item.href} className={di}>
                        <i className={`fas ${item.icon} text-gray-400 w-[18px] text-center`} /> {item.label}
                      </Link>
                    ))}
                  </div>
                  <div className="flex-1 p-4">
                    <div className="text-[11px] font-bold uppercase tracking-wide text-gray-400 mb-2 pb-2 border-b border-gray-100 flex items-center gap-2">
                      <i className="fas fa-school text-[#e85d14]" /> Units
                    </div>
                    {[
                      { icon: "fa-handshake", label: "Career Guidance Unit", href: "/academic/units/career-guidance" },
                      { icon: "fa-users", label: "Staff Development Unit", href: "/academic/units/staff-development" },
                    ].map(item => (
                      <Link key={item.label} href={item.href} className={di}>
                        <i className={`fas ${item.icon} text-gray-400 w-[18px] text-center`} /> {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Courses */}
            <div className="nav-group">
              <Link href="/courses" className="nav-plain">Courses <i className="fas fa-chevron-down text-[10px]" /></Link>
              <div className="dropdown-panel">
                <Link href="/courses/general" className={di}><i className="fas fa-desktop text-gray-400 w-[18px] text-center" /> General ICT and English</Link>
                <Link href="/courses" className={di}><i className="fas fa-graduation-cap text-gray-400 w-[18px] text-center" /> HND Courses</Link>
              </div>
            </div>

            {/* Administration */}
            <div className="nav-group">
              <Link href="/administration" className="nav-plain">Administration <i className="fas fa-chevron-down text-[10px]" /></Link>
              <div className="dropdown-panel mega-panel">
                <div className="flex">
                  <div className="flex-1 p-4 border-r border-gray-100">
                    <div className="text-[11px] font-bold uppercase tracking-wide text-gray-400 mb-2 pb-2 border-b border-gray-100 flex items-center gap-2">
                      <i className="fas fa-user-tie text-[#e85d14]" /> Management
                    </div>
                    {[
                      { icon: "fa-building", label: "Director Office", href: "/administration/director-office" },
                      { icon: "fa-briefcase", label: "Admin Office", href: "/administration/admin-office" },
                      { icon: "fa-hand-holding-usd", label: "Finance and Accounts", href: "/administration/finance-accounts" },
                    ].map(item => (
                      <Link key={item.label} href={item.href} className={di}>
                        <i className={`fas ${item.icon} text-gray-400 w-[18px] text-center`} /> {item.label}
                      </Link>
                    ))}
                  </div>
                  <div className="flex-1 p-4">
                    <div className="text-[11px] font-bold uppercase tracking-wide text-gray-400 mb-2 pb-2 border-b border-gray-100 flex items-center gap-2">
                      <i className="fas fa-user-graduate text-[#e85d14]" /> Student Services
                    </div>
                    {[
                      { icon: "fa-user-plus", label: "Admissions", href: "/student-services/admissions" },
                      { icon: "fa-clipboard-list", label: "Examination", href: "/student-services/examinations" },
                    ].map(item => (
                      <Link key={item.label} href={item.href} className={di}>
                        <i className={`fas ${item.icon} text-gray-400 w-[18px] text-center`} /> {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Link href="/staff" className="nav-plain">Staff</Link>

            {/* Research */}
            <div className="nav-group">
              <Link href="/research" className="nav-plain">Research <i className="fas fa-chevron-down text-[10px]" /></Link>
              <div className="dropdown-panel">
                <Link href="/research/innovation-projects" className={di}><i className="fas fa-lightbulb text-gray-400 w-[18px] text-center" /> Innovation Projects</Link>
                <Link href="/research/publications" className={di}><i className="fas fa-book text-gray-400 w-[18px] text-center" /> Publications</Link>
              </div>
            </div>

            {/* Student */}
            <div className="nav-group">
              <Link href="/student-form" className="nav-plain">Student <i className="fas fa-chevron-down text-[10px]" /></Link>
              <div className="dropdown-panel">
                <Link href="/student-life" className={di}><i className="fas fa-heart text-gray-400 w-[18px] text-center" /> Student Life</Link>
                <Link href="/student-form" className={di}><i className="fas fa-file-alt text-gray-400 w-[18px] text-center" /> Student Form</Link>
              </div>
            </div>

            <Link href="/library" className="nav-plain">Library</Link>
            <Link href="/contact" className="nav-plain">Contact</Link>
          </nav>

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden flex flex-col justify-center gap-[5px] bg-transparent border-none cursor-pointer p-1.5 w-9 h-9"
            aria-label="Toggle navigation"
          >
            <span className={`block w-[22px] h-[2px] bg-[#0f1c2e] rounded transition-all duration-300 ${mobileOpen ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`block w-[22px] h-[2px] bg-[#0f1c2e] rounded transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block w-[22px] h-[2px] bg-[#0f1c2e] rounded transition-all duration-300 ${mobileOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </button>
        </div>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div className="lg:hidden absolute left-0 right-0 bg-white border-t border-gray-200 shadow-lg max-h-[calc(100svh-70px)] overflow-y-auto flex flex-col px-4 py-3 gap-0.5" style={{ top: 70, zIndex: 999 }}>
            <Link href="/" onClick={() => setMobileOpen(false)} className="block px-3.5 py-2.5 text-[13.5px] font-semibold text-[#2c3e50] rounded hover:bg-gray-100 hover:text-[#e85d14] transition-colors">Home</Link>

            {mobileGroups.map(group => (
              <div key={group.key}>
                <button
                  onClick={() => toggle(group.key)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 text-[13.5px] font-semibold text-[#2c3e50] rounded hover:bg-gray-100 hover:text-[#e85d14] transition-colors bg-transparent border-none cursor-pointer"
                >
                  {group.label}
                  <i className={`fas fa-chevron-down text-[10px] transition-transform duration-200 ${mobileExpanded === group.key ? "rotate-180" : ""}`} />
                </button>
                {mobileExpanded === group.key && (
                  <div className="ml-2.5 mt-1 border border-gray-100 rounded-lg overflow-hidden">
                    {group.items.map((item, i) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-2 px-3 py-2.5 text-[13px] text-[#3d4a6a] hover:bg-gray-50 hover:text-[#e85d14] transition-colors ${i > 0 ? "border-t border-gray-100" : ""}`}
                      >
                        <i className={`fas ${item.icon} text-gray-400 w-[18px] text-center`} /> {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <Link href="/staff" onClick={() => setMobileOpen(false)} className="block px-3.5 py-2.5 text-[13.5px] font-semibold text-[#2c3e50] rounded hover:bg-gray-100 hover:text-[#e85d14] transition-colors">Staff</Link>
            <Link href="/library" onClick={() => setMobileOpen(false)} className="block px-3.5 py-2.5 text-[13.5px] font-semibold text-[#2c3e50] rounded hover:bg-gray-100 hover:text-[#e85d14] transition-colors">Library</Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)} className="block px-3.5 py-2.5 text-[13.5px] font-semibold text-[#2c3e50] rounded hover:bg-gray-100 hover:text-[#e85d14] transition-colors">Contact</Link>
          </div>
        )}
      </header>
    </div>
  );
}