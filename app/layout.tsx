import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

const RAW_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";
const ORIGIN = RAW_BASE.replace(/\/api\/?$/, "");
const API_BASE = `${ORIGIN}/api`;

async function getCourses() {
  try {
    // no-store: navbar must always reflect the latest backend data —
    // a 1hr revalidate cache meant newly added courses wouldn't show
    // up until the cache expired.
    const res = await fetch(`${API_BASE}/courses`, { cache: "no-store" });
    if (!res.ok) return [];
    const payload = await res.json();
    return payload?.data?.courses ?? [];
  } catch {
    return [];
  }
}

export const metadata: Metadata = {
  title: "University College of Jaffna",
  description: "Official website of University College of Jaffna",
  icons: {
    icon: "/ucj.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const courses = await getCourses();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body suppressHydrationWarning className={`${inter.className} bg-[#f8f9fc] min-h-screen`}>
        <Navbar courses={courses} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}