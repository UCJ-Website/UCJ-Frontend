"use client";

import { useState } from "react";
import Link from "next/link";
import "./css/navbar.css";

interface Course {
  id: number;
  title: string;
  slug: string;
  short_code: string;
  is_main?: boolean;
}

interface NavbarProps {
  courses?: Course[];
}

export default function Navbar({ courses = [] }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const toggle = (k: string) => setMobileExpanded(p => p === k ? null : k);

  const [closedGroup, setClosedGroup] = useState<string | null>(null);
  const closeNow = (key: string) => setClosedGroup(key);
  const resetClose = () => setClosedGroup(null);

  // Only HND (main) courses belong in the "HND Courses" section.
  // General ICT/English courses are linked separately via /courses/general.
  const hndCourses = courses.filter(c => c.is_main !== false);

  const di =
    "flex items-center gap-2 px-3 py-[9px] rounded text-[13px] font-medium text-[#3d4a6a] hover:bg-gray-100 hover:text-[#e85d14] transition-colors whitespace-nowrap";

  const mobileGroups = [
    {
      key: "about",
      label: "About",
      items: [
        { icon: "fa-university", label: "University College of Jaffna", href: "/about", isHeader: true },
        { icon: "fa-bullseye", label: "Vision, Mission & History", href: "/about/vision-mission-history", isHeader: false },
        { icon: "fa-sitemap", label: "Board of Management", href: "/about/board-of-management", isHeader: false },
        { icon: "fa-book-open", label: "Board of Studies", href: "/about/board-of-studies", isHeader: false },
        { icon: "fa-users", label: "Peoples", href: "/about/peoples", isHeader: true },
        { icon: "fa-user-tie", label: "Director", href: "/about/director", isHeader: false },
        { icon: "fa-user-cog", label: "Assistant Director", href: "/about/assistant-director", isHeader: false },
        { icon: "fa-user-edit", label: "Assistant Registrar", href: "/about/assistant-registrar", isHeader: false },
        { icon: "fa-hand-holding-usd", label: "Assistant Bursar", href: "/about/assistant-bursar", isHeader: false },
        { icon: "fa-history", label: "Former Director", href: "/about/former-director", isHeader: false },
      ],
    },
    {
      key: "academic",
      label: "Academic",
      items: [
        { icon: "fa-tools", label: "Building Services Technology", href: "/academic/departments/department-of-building-services-technology", isHeader: false },
        { icon: "fa-hard-hat", label: "Construction Technology", href: "/academic/departments/department-of-construction-technology", isHeader: false },
        { icon: "fa-robot", label: "Mechatronics Technology", href: "/academic/departments/department-of-mechatronics-technology", isHeader: false },
        { icon: "fa-tractor", label: "Farm Machinery", href: "/academic/departments/department-of-farm-machinery", isHeader: false },
        { icon: "fa-industry", label: "Production Technology", href: "/academic/departments/department-of-production-technology", isHeader: false },
        { icon: "fa-flask", label: "Food Technology", href: "/academic/departments/department-of-food-technology", isHeader: false },
        { icon: "fa-concierge-bell", label: "Hospitality Management", href: "/academic/departments/department-of-hospitality-management", isHeader: false },
        { icon: "fa-compass", label: "Interdisciplinary", href: "/academic/departments/department-of-interdisciplinary", isHeader: false },
        { icon: "fa-spa", label: "Cosmetology", href: "/academic/departments/department-of-cosmetology", isHeader: false },
        { icon: "fa-school", label: "Units", href: "/academic/units", isHeader: true },
        { icon: "fa-graduation-cap", label: "HRDC Unit", href: "/academic/units/hrdc-unit", isHeader: false },
        { icon: "fa-handshake", label: "Career Guidance Unit", href: "/academic/units/career-guidance-unit", isHeader: false },
        { icon: "fa-users", label: "Staff Development Unit", href: "/academic/units/staff-development-unit", isHeader: false },
      ],
    },
    {
      key: "courses",
      label: "Courses",
      items: [
        { icon: "fa-graduation-cap", label: "HND Courses", href: "/courses", isHeader: true as const },
        ...hndCourses.map(course => ({
          icon: "fa-graduation-cap",
          label: course.title,
          href: `/courses/${course.slug}`,
          isHeader: false as const,
        })),
        { icon: "fa-desktop", label: "General", href: "/courses/general", isHeader: true as const },
        { icon: "fa-desktop", label: "General ICT and English", href: "/courses/general", isHeader: false as const },
      ],
    },
    {
      key: "admin",
      label: "Administration",
      items: [
        { icon: "fa-building", label: "Director Office", href: "/administration/director-office", isHeader: false },
        { icon: "fa-briefcase", label: "Admin Office", href: "/administration/admin-office", isHeader: false },
        { icon: "fa-hand-holding-usd", label: "Finance and Accounts", href: "/administration/finance-accounts", isHeader: false },
        { icon: "fa-user-plus", label: "Admissions", href: "/student-services/admissions", isHeader: false },
        { icon: "fa-clipboard-list", label: "Examination", href: "/student-services/examinations", isHeader: false },
      ],
    },
    {
      key: "research",
      label: "Research",
      items: [
        { icon: "fa-lightbulb", label: "Innovation Projects", href: "/research/innovation-projects", isHeader: false },
        { icon: "fa-book", label: "Publications", href: "/research/publications", isHeader: false },
      ],
    },
    {
      key: "student",
      label: "Student",
      items: [
        { icon: "fa-heart", label: "Student Life", href: "/student-life", isHeader: false },
        { icon: "fa-file-alt", label: "Student Form", href: "/student/student-form", isHeader: false },
      ],
    },
  ];

  return (
    <div>
      {/* ── TOPBAR ── */}
      <div
        className="bg-[#0f1c2e] text-[#8da0c4] text-[11px] px-5 py-2 flex items-center gap-5 sticky top-0"
        style={{ zIndex: 1001 }}
      >
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

      {/* ── HEADER ── */}
      <header
        className="bg-white border-b border-gray-200 sticky shadow-sm"
        style={{ zIndex: 1000, top: 38 }}
      >
        <div className="max-w-[1280px] mx-auto px-10 h-[70px] flex items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <img src="/ucj.png" alt="UCJ Logo" className="h-[44px] w-auto object-contain" />
            <div className="hidden sm:block text-[19px] font-bold text-[#0f1c2e] tracking-tight leading-tight">
              University College of Jaffna
            </div>
          </Link>

          {/* ── DESKTOP NAV ── */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link href="/" className="nav-plain">Home</Link>

            {/* ABOUT */}
            <div className="nav-group" onMouseLeave={resetClose}>
              <Link href="/about" className="nav-plain">
                About <i className="fas fa-chevron-down text-[10px]" />
              </Link>
              <div
                className="dropdown-panel mega-panel"
                style={closedGroup === "about" ? { display: "none" } : undefined}
              >
                <div className="flex">
                  <div className="flex-1 p-4 border-r border-gray-100">
                    <div className="mega-col-header">
                      <i className="fas fa-university text-[#e85d14]" />
                      University College of Jaffna
                    </div>
                    <Link href="/about" onClick={() => closeNow("about")} className={di}>
                      <i className="fas fa-bullseye text-gray-400 w-[18px] text-center" />
                      Vision, Mission &amp; History
                    </Link>
                    <Link href="/academic/units/board-of-management" onClick={() => closeNow("about")} className={di}>
                      <i className="fas fa-sitemap text-gray-400 w-[18px] text-center" />
                      Board of Management
                    </Link>
                    <Link href="/academic/units/board-of-studies" onClick={() => closeNow("about")} className={di}>
                      <i className="fas fa-book-open text-gray-400 w-[18px] text-center" />
                      Board of Studies
                    </Link>
                  </div>
                  <div className="flex-1 p-4">
                    <div className="mega-col-header">
                      <i className="fas fa-users text-[#e85d14]" />
                      Peoples
                    </div>
                    <Link href="/about/director" onClick={() => closeNow("about")} className={di}>
                      <i className="fas fa-user-tie text-gray-400 w-[18px] text-center" />
                      Director
                    </Link>
                    <Link href="/about/assistant-director" onClick={() => closeNow("about")} className={di}>
                      <i className="fas fa-user-cog text-gray-400 w-[18px] text-center" />
                      Assistant Director
                    </Link>
                    <Link href="/about/assistant-registrar" onClick={() => closeNow("about")} className={di}>
                      <i className="fas fa-user-edit text-gray-400 w-[18px] text-center" />
                      Assistant Registrar
                    </Link>
                    <Link href="/about/assistant-bursar" onClick={() => closeNow("about")} className={di}>
                      <i className="fas fa-hand-holding-usd text-gray-400 w-[18px] text-center" />
                      Assistant Bursar
                    </Link>
                    <Link href="/about/former-director" onClick={() => closeNow("about")} className={di}>
                      <i className="fas fa-history text-gray-400 w-[18px] text-center" />
                      Former Director
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* ACADEMIC */}
            <div className="nav-group" onMouseLeave={resetClose}>
              <Link href="/academic" className="nav-plain">
                Academic <i className="fas fa-chevron-down text-[10px]" />
              </Link>
              <div
                className="dropdown-panel mega-panel"
                style={closedGroup === "academic" ? { display: "none" } : undefined}
              >
                <div className="flex">
                  <div className="flex-1 p-4 border-r border-gray-100">
                    <div className="mega-col-header">
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
                      <Link key={item.label} href={item.href} onClick={() => closeNow("academic")} className={di}>
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
                      { icon: "fa-spa", label: "Cosmetology", href: "/academic/departments/department-of-cosmetology" },
                    ].map(item => (
                      <Link key={item.label} href={item.href} onClick={() => closeNow("academic")} className={di}>
                        <i className={`fas ${item.icon} text-gray-400 w-[18px] text-center`} /> {item.label}
                      </Link>
                    ))}
                  </div>
                  <div className="flex-1 p-4">
                    <div className="mega-col-header">
                      <i className="fas fa-school text-[#e85d14]" /> Units
                    </div>
                    {[
                      { icon: "fa-graduation-cap", label: "HRDC Unit", href: "/academic/units/hrdc-unit" },
                      { icon: "fa-handshake", label: "Career Guidance Unit", href: "/academic/units/career-guidance-unit" },
                      { icon: "fa-users", label: "Staff Development Unit", href: "/academic/units/staff-development-unit" },
                    ].map(item => (
                      <Link key={item.label} href={item.href} onClick={() => closeNow("academic")} className={di}>
                        <i className={`fas ${item.icon} text-gray-400 w-[18px] text-center`} /> {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* COURSES — dynamic from API, HND only */}
            <div className="nav-group" onMouseLeave={resetClose}>
              <Link href="/courses" className="nav-plain">
                Courses <i className="fas fa-chevron-down text-[10px]" />
              </Link>
              <div
                className="dropdown-panel"
                style={closedGroup === "courses" ? { display: "none" } : undefined}
              >
                {hndCourses.length > 0 && (
                  <>
                    <div className="mega-col-header">
                      <i className="fas fa-graduation-cap text-[#e85d14]" /> HND Courses
                    </div>
                    {hndCourses.map(course => (
                      <Link
                        key={course.slug}
                        href={`/courses/${course.slug}`}
                        onClick={() => closeNow("courses")}
                        className={di}
                      >
                        <i className="fas fa-graduation-cap text-gray-400 w-[18px] text-center" />
                        {course.title}
                      </Link>
                    ))}
                    <div className="my-1.5 mx-3 border-t border-gray-200" />
                  </>
                )}
                <div className="mega-col-header">
                  <i className="fas fa-desktop text-[#e85d14]" /> General
                </div>
                <Link href="/courses/general" onClick={() => closeNow("courses")} className={di}>
                  <i className="fas fa-desktop text-gray-400 w-[18px] text-center" /> General ICT and English
                </Link>
              </div>
            </div>

            {/* ADMINISTRATION */}
            <div className="nav-group" onMouseLeave={resetClose}>
              <Link href="/administration" className="nav-plain">
                Administration <i className="fas fa-chevron-down text-[10px]" />
              </Link>
              <div
                className="dropdown-panel mega-panel"
                style={closedGroup === "administration" ? { display: "none" } : undefined}
              >
                <div className="flex">
                  <div className="flex-1 p-4 border-r border-gray-100">
                    <div className="mega-col-header">
                      <i className="fas fa-user-tie text-[#e85d14]" /> Management
                    </div>
                    {[
                      { icon: "fa-building", label: "Director Office", href: "/administration/director-office" },
                      { icon: "fa-briefcase", label: "Admin Office", href: "/administration/admin-office" },
                      { icon: "fa-hand-holding-usd", label: "Finance and Accounts", href: "/administration/finance-accounts" },
                    ].map(item => (
                      <Link key={item.label} href={item.href} onClick={() => closeNow("administration")} className={di}>
                        <i className={`fas ${item.icon} text-gray-400 w-[18px] text-center`} /> {item.label}
                      </Link>
                    ))}
                  </div>
                  <div className="flex-1 p-4">
                    <div className="mega-col-header">
                      <i className="fas fa-user-graduate text-[#e85d14]" /> Student Services
                    </div>
                    {[
                      { icon: "fa-user-plus", label: "Admissions", href: "/student-services/admissions" },
                      { icon: "fa-clipboard-list", label: "Examination", href: "/student-services/examinations" },
                    ].map(item => (
                      <Link key={item.label} href={item.href} onClick={() => closeNow("administration")} className={di}>
                        <i className={`fas ${item.icon} text-gray-400 w-[18px] text-center`} /> {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Link href="/staff" className="nav-plain">Staff</Link>

            {/* RESEARCH */}
            <div className="nav-group" onMouseLeave={resetClose}>
              <Link href="/research" className="nav-plain">
                Research <i className="fas fa-chevron-down text-[10px]" />
              </Link>
              <div
                className="dropdown-panel"
                style={closedGroup === "research" ? { display: "none" } : undefined}
              >
                <Link href="/research/innovation-projects" onClick={() => closeNow("research")} className={di}>
                  <i className="fas fa-lightbulb text-gray-400 w-[18px] text-center" /> Innovation Projects
                </Link>
                <Link href="/research/publications" onClick={() => closeNow("research")} className={di}>
                  <i className="fas fa-book text-gray-400 w-[18px] text-center" /> Publications
                </Link>
              </div>
            </div>

            {/* STUDENT */}
            <div className="nav-group" onMouseLeave={resetClose}>
              <Link href="/student/student-form" className="nav-plain">
                Student <i className="fas fa-chevron-down text-[10px]" />
              </Link>
              <div
                className="dropdown-panel"
                style={closedGroup === "student" ? { display: "none" } : undefined}
              >
                <Link href="/student-life" onClick={() => closeNow("student")} className={di}>
                  <i className="fas fa-heart text-gray-400 w-[18px] text-center" /> Student Life
                </Link>
                <Link href="/student/student-form" onClick={() => closeNow("student")} className={di}>
                  <i className="fas fa-file-alt text-gray-400 w-[18px] text-center" /> Student Form
                </Link>
              </div>
            </div>

            <Link href="/library" className="nav-plain">Library</Link>
            <Link href="/contact" className="nav-plain">Contact</Link>
          </nav>

          {/* HAMBURGER */}
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

        {/* ── MOBILE MENU ── */}
        {mobileOpen && (
          <div
            className="lg:hidden absolute left-0 right-0 bg-white border-t border-gray-200 shadow-lg max-h-[calc(100svh-108px)] overflow-y-auto flex flex-col px-4 py-3 gap-0.5"
            style={{ top: 70, zIndex: 999 }}
          >
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="block px-3.5 py-2.5 text-[13.5px] font-semibold text-[#2c3e50] rounded hover:bg-gray-100 hover:text-[#e85d14] transition-colors"
            >
              Home
            </Link>

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
                    {group.items.map((item, i) =>
                      item.isHeader ? (
                        <div
                          key={item.label}
                          className={`flex items-center gap-2 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#e85d14] bg-gray-50 ${i > 0 ? "border-t border-gray-200 mt-1" : ""}`}
                        >
                          <i className={`fas ${item.icon} w-[16px] text-center`} />
                          {item.label}
                        </div>
                      ) : (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center gap-2 px-3 py-2.5 text-[13px] text-[#3d4a6a] hover:bg-gray-50 hover:text-[#e85d14] transition-colors ${i > 0 ? "border-t border-gray-100" : ""}`}
                        >
                          <i className={`fas ${item.icon} text-gray-400 w-[18px] text-center`} />
                          {item.label}
                        </Link>
                      )
                    )}
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