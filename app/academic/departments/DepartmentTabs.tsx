"use client";

import { useState } from "react";
import Link from "next/link";

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

interface StaffMember {
  id: number;
  name: string;
  position?: string | null;
  email?: string | null;
  phone?: string | null;
  photo?: string | null;
}

interface CourseSummary {
  id: number;
  title: string;
  short_code?: string;
  slug: string;
  image?: string | null;
  level?: string;
  duration?: string;
}

interface GalleryItem {
  id: number;
  title: string | null;
  description: string | null;
  category: string | null;
  month: string | null;
  year: number | null;
  cover_image: string;
}

interface Research {
  id: number;
  title: string;
  type?: "project" | "publication";
  authors?: string | null;
  description?: string | null;
  public_link?: string | null;
  download_link?: string | null;
  year?: string | number | null;
  month?: number | null;
}

interface AlbumImage {
  id: number;
  url: string;
  caption?: string | null;
}

interface AlbumDetail {
  id: number;
  title: string | null;
  description: string | null;
  category: string | null;
  month: string | null;
  year: number | null;
  cover_image: string;
  images: AlbumImage[];
}

interface Props {
  staff: StaffMember[];
  courses: CourseSummary[];
  gallery: GalleryItem[];
  research: Research[];
  apiBase: string;
}

function resolveImage(path: string | null | undefined, apiBase: string): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${apiBase}/${path.replace(/^\/+/, "")}`;
}

type TabKey = "staff" | "courses" | "gallery" | "research";

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: "staff",    label: "Staff",    icon: "fa-users" },
  { key: "courses",  label: "Courses",  icon: "fa-graduation-cap" },
  { key: "gallery",  label: "Gallery",  icon: "fa-images" },
  { key: "research", label: "Research", icon: "fa-flask" },
];

export default function DepartmentTabs({ staff, courses, gallery, research, apiBase }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("staff");

  const [album, setAlbum]               = useState<AlbumDetail | null>(null);
  const [albumLoading, setAlbumLoading] = useState(false);
  const [albumError, setAlbumError]     = useState<string | null>(null);
  const [lightbox, setLightbox]         = useState<{ src: string; caption?: string | null } | null>(null);

  const projects     = research.filter((r) => r.type === "project");
  const publications = research.filter((r) => r.type === "publication");

  const counts: Record<TabKey, number> = {
    staff:    staff.length,
    courses:  courses.length,
    gallery:  gallery.length,
    research: research.length,
  };

  async function openAlbum(id: number) {
    setAlbumLoading(true);
    setAlbumError(null);
    setAlbum(null);
    try {
      const res = await fetch(`${apiBase}/api/gallery/${id}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      const detail: AlbumDetail = json?.data?.album ?? json?.data ?? json;
      setAlbum(detail);
    } catch {
      setAlbumError("Could not load album. Please try again.");
    } finally {
      setAlbumLoading(false);
    }
  }

  function closeAlbum() {
    setAlbum(null);
    setAlbumError(null);
  }

  return (
    <>
      <div className="bg-white rounded-[14px] border border-[#e5eaf3] overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-[#e5eaf3] overflow-x-auto scrollbar-none">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); closeAlbum(); }}
                className={`
                  relative flex items-center gap-2 px-6 py-4 text-[13.5px] font-semibold whitespace-nowrap
                  transition-colors duration-150 outline-none
                  ${isActive
                    ? "text-[#2563b0] bg-[#f5f8ff]"
                    : "text-[#6b7280] hover:text-[#374151] hover:bg-[#f9fafb]"
                  }
                `}
              >
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#2563b0] rounded-t-full" />
                )}
                <i className={`fas ${tab.icon} text-[12px]`}></i>
                {tab.label}
                {counts[tab.key] > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${isActive ? "bg-[#2563b0] text-white" : "bg-[#f3f4f6] text-[#6b7280]"}`}>
                    {counts[tab.key]}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-6 sm:p-8">

          {/* ── STAFF ── */}
          {activeTab === "staff" && (
            staff.length === 0 ? (
              <EmptyState icon="fa-users" message="No staff members listed for this department." />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {staff.map((member) => {
                  const photo = resolveImage(member.photo, apiBase);
                  return (
                    <div key={member.id} className="flex items-center gap-4 p-4 rounded-xl border border-[#e5eaf3] hover:border-[#bfdbfe] hover:shadow-sm transition-all duration-200">
                      <div className="w-[56px] h-[56px] rounded-full overflow-hidden bg-[#eff6ff] text-[#2563b0] flex items-center justify-center text-[18px] font-bold shrink-0">
                        {photo ? (
                          <img src={photo} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          <span>{member.name.charAt(0)}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-[#0f2a5e] text-[14px] truncate">{member.name}</div>
                        {member.position && <div className="text-[12px] text-[#2563b0] mb-1 truncate">{member.position}</div>}
                        {member.phone && (
                          <div className="text-[12px] text-[#6b7280] flex items-center gap-1.5">
                            <i className="fas fa-phone text-[10px]"></i>
                            <span className="truncate">{member.phone}</span>
                          </div>
                        )}
                        {member.email && (
                          <div className="text-[12px] text-[#6b7280] flex items-center gap-1.5">
                            <i className="fas fa-envelope text-[10px]"></i>
                            <span className="truncate">{member.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}

          {/* ── COURSES ── */}
          {activeTab === "courses" && (
            courses.length === 0 ? (
              <EmptyState icon="fa-graduation-cap" message="No courses available for this department." />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {courses.map((course) => {
                  const courseImg = resolveImage(course.image, apiBase);
                  return (
                    <Link key={course.id} href={`/courses/${course.slug}`} className="flex flex-col rounded-xl overflow-hidden border border-[#e5eaf3] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                      <div className="h-[130px] relative overflow-hidden bg-[#0f2a5e]">
                        {courseImg ? (
                          <img src={courseImg} alt={course.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <i className="fas fa-graduation-cap text-3xl text-white/25"></i>
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex flex-col gap-1.5">
                        {course.short_code && (
                          <div className="text-[11px] font-bold text-[#2563b0] uppercase tracking-[0.08em]">{course.short_code}</div>
                        )}
                        <div className="text-[13.5px] font-semibold text-[#0f2a5e] leading-[1.45]">{course.title}</div>
                        <div className="text-[12px] text-[#6b7280] flex items-center gap-3 mt-1">
                          {course.level && <span className="flex items-center gap-1"><i className="fas fa-layer-group text-[10px]"></i> {course.level}</span>}
                          {course.duration && <span className="flex items-center gap-1"><i className="fas fa-clock text-[10px]"></i> {course.duration}</span>}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )
          )}

          {/* ── GALLERY ── */}
          {activeTab === "gallery" && (
            <>
              {/* Loading */}
              {albumLoading && (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-[#6b7280]">
                  <div className="w-8 h-8 border-2 border-[#2563b0] border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-[13px]">Loading album…</span>
                </div>
              )}

              {/* Error */}
              {albumError && !albumLoading && (
                <div className="text-center py-10">
                  <p className="text-[#dc2626] text-[13px] mb-3">{albumError}</p>
                  <button onClick={closeAlbum} className="text-[13px] text-[#2563b0] hover:underline">
                    ← Back to Gallery
                  </button>
                </div>
              )}

              {/* Album detail */}
              {album && !albumLoading && (
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <button
                      onClick={closeAlbum}
                      className="w-8 h-8 rounded-full border border-[#e5eaf3] flex items-center justify-center text-[#6b7280] hover:text-[#0f2a5e] hover:border-[#2563b0]/40 transition-all"
                    >
                      <i className="fas fa-arrow-left text-[11px]"></i>
                    </button>
                    <div>
                      <h3 className="font-bold text-[#0f2a5e] text-[16px]">{album.title ?? "Album"}</h3>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        {album.category && (
                          <span className="text-[11px] bg-[#fff7ed] text-[#c2410c] px-2 py-0.5 rounded-full font-medium capitalize">
                            {album.category}
                          </span>
                        )}
                        {(album.month || album.year) && (
                          <span className="text-[11px] text-[#9ca3af]">
                            {[album.month, album.year].filter(Boolean).join(" ")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {album.description && (
                    <p className="text-[13px] text-[#4b5563] mb-5 leading-relaxed">{album.description}</p>
                  )}

                  {!album.images || album.images.length === 0 ? (
                    <EmptyState icon="fa-images" message="No images in this album yet." />
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {album.images.map((img) => {
                        const src = resolveImage(img.url, apiBase);
                        if (!src) return null;
                        return (
                          <button
                            key={img.id}
                            onClick={() => setLightbox({ src, caption: img.caption })}
                            className="aspect-square rounded-[8px] overflow-hidden border border-[#e5eaf3] hover:border-[#2563b0]/40 hover:shadow-md transition-all group"
                          >
                            <img
                              src={src}
                              alt={img.caption ?? "Gallery image"}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Cover grid */}
              {!album && !albumLoading && !albumError && (
                gallery.length === 0 ? (
                  <EmptyState icon="fa-images" message="No gallery albums available." />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {gallery.map((item) => {
                      const coverImg = resolveImage(item.cover_image, apiBase);
                      return (
                        <button
                          key={item.id}
                          onClick={() => openAlbum(item.id)}
                          className="group flex flex-col rounded-xl overflow-hidden border border-[#e5eaf3] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 bg-white text-left w-full"
                        >
                          <div className="relative h-[160px] overflow-hidden bg-[#0f2a5e]">
                            {coverImg ? (
                              <img
                                src={coverImg}
                                alt={item.title ?? "Album"}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <i className="fas fa-images text-3xl text-white/25"></i>
                              </div>
                            )}
                            {item.category && (
                              <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-[0.07em] px-2 py-0.5 rounded-full bg-white/90 text-[#2563b0]">
                                {item.category}
                              </span>
                            )}
                            <div className="absolute inset-0 bg-[#0f2a5e]/0 group-hover:bg-[#0f2a5e]/30 transition-all duration-300 flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full w-10 h-10 flex items-center justify-center">
                                <i className="fas fa-folder-open text-[#e85d14] text-[15px]"></i>
                              </div>
                            </div>
                          </div>
                          <div className="p-4 flex flex-col gap-1">
                            <div className="text-[13.5px] font-semibold text-[#0f2a5e] leading-[1.4] line-clamp-2">
                              {item.title}
                            </div>
                            {item.description && (
                              <p className="text-[12px] text-[#6b7280] leading-[1.5] line-clamp-2 mt-0.5">
                                {item.description}
                              </p>
                            )}
                            {(item.month || item.year) && (
                              <div className="text-[11px] text-[#9ca3af] flex items-center gap-1 mt-1">
                                <i className="fas fa-calendar-alt text-[10px]"></i>
                                {[item.month, item.year].filter(Boolean).join(" ")}
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )
              )}
            </>
          )}

          {/* ── RESEARCH ── */}
          {activeTab === "research" && (
            research.length === 0 ? (
              <EmptyState icon="fa-flask" message="No research items available for this department." />
            ) : (
              <div className="space-y-8">
                {projects.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-7 h-7 rounded-lg bg-[#eff6ff] text-[#2563b0] flex items-center justify-center text-[12px]">
                        <i className="fas fa-lightbulb"></i>
                      </div>
                      <h3 className="text-[13px] font-bold tracking-[0.08em] uppercase text-[#0f2a5e]">Innovation Projects</h3>
                      <span className="text-[11px] font-semibold bg-[#eff6ff] text-[#2563b0] px-2 py-0.5 rounded-full">{projects.length}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {projects.map((item) => <ResearchCard key={item.id} item={item} />)}
                    </div>
                  </div>
                )}
                {publications.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-7 h-7 rounded-lg bg-[#eff6ff] text-[#2563b0] flex items-center justify-center text-[12px]">
                        <i className="fas fa-book"></i>
                      </div>
                      <h3 className="text-[13px] font-bold tracking-[0.08em] uppercase text-[#0f2a5e]">Publications</h3>
                      <span className="text-[11px] font-semibold bg-[#eff6ff] text-[#2563b0] px-2 py-0.5 rounded-full">{publications.length}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {publications.map((item) => <ResearchCard key={item.id} item={item} />)}
                    </div>
                  </div>
                )}
                {projects.length === 0 && publications.length === 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {research.map((item) => <ResearchCard key={item.id} item={item} />)}
                  </div>
                )}
              </div>
            )
          )}

        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            onClick={() => setLightbox(null)}
          >
            <i className="fas fa-times text-[14px]"></i>
          </button>
          <div
            className="max-w-[90vw] max-h-[90vh] flex flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.src}
              alt={lightbox.caption ?? "Gallery image"}
              className="max-w-full max-h-[80vh] object-contain rounded-[8px] shadow-2xl"
            />
            {lightbox.caption && (
              <p className="text-white/70 text-[13px] text-center">{lightbox.caption}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function ResearchCard({ item }: { item: Research }) {
  const monthIndex = item.month ? Number(item.month) - 1 : null;
  const monthLabel = monthIndex !== null && MONTH_NAMES[monthIndex] ? MONTH_NAMES[monthIndex] : "";

  return (
    <div className="border border-[#e5eaf3] rounded-xl p-5 hover:border-[#bfdbfe] hover:shadow-sm transition-all duration-200">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="font-semibold text-[#0f2a5e] text-[14px] leading-[1.4]">{item.title}</div>
        {(monthLabel || item.year) && (
          <span className="text-[11px] font-medium text-[#6b7280] whitespace-nowrap shrink-0 bg-[#f9fafb] px-2 py-0.5 rounded-md border border-[#e5eaf3]">
            {[monthLabel, item.year].filter(Boolean).join(" ")}
          </span>
        )}
      </div>
      {item.authors && (
        <div className="text-[12px] text-[#2563b0] mb-2 flex items-center gap-1.5">
          <i className={`fas ${item.type === "publication" ? "fa-user-edit" : "fa-users"} text-[10px]`}></i>
          {item.authors}
        </div>
      )}
      {item.description && (
        <p className="text-[13px] text-[#6b7280] leading-[1.55]">{item.description}</p>
      )}
      {(item.public_link || item.download_link) && (
        <div className="flex gap-3 mt-3">
          {item.public_link && (
            <a href={item.public_link} target="_blank" rel="noopener noreferrer" className="text-[12px] font-medium text-[#2563b0] flex items-center gap-1.5 hover:underline">
              <i className="fas fa-external-link-alt text-[10px]"></i> View
            </a>
          )}
          {item.download_link && (
            <a href={item.download_link} target="_blank" rel="noopener noreferrer" className="text-[12px] font-medium text-[#2563b0] flex items-center gap-1.5 hover:underline">
              <i className="fas fa-download text-[10px]"></i> Download
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon, message }: { icon: string; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-[#f3f4f6] flex items-center justify-center text-[24px] text-[#9ca3af] mb-4">
        <i className={`fas ${icon}`}></i>
      </div>
      <p className="text-[#9ca3af] text-[14px]">{message}</p>
    </div>
  );
}