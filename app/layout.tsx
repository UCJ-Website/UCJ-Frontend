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
    const res = await fetch(`${API_BASE}/courses`, { cache: "no-store" });
    if (!res.ok) return [];
    const payload = await res.json();
    return payload?.data?.courses ?? [];
  } catch {
    return [];
  }
}

async function getDepartments() {
  try {
    const res = await fetch(`${API_BASE}/departments`, { cache: "no-store" });
    if (!res.ok) return [];
    const payload = await res.json();

    // DEBUG — `npm run dev` terminal-ல் shape பாருங்க, fix ஆனா remove பண்ணுங்க
    console.log("DEPT RAW:", JSON.stringify(payload).slice(0, 600));

    return payload?.data?.departments ?? payload?.data ?? [];
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
  const [courses, departments] = await Promise.all([
    getCourses(),
    getDepartments(),
  ]);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body suppressHydrationWarning className={`${inter.className} bg-[#f8f9fc] min-h-screen`}>
        <Navbar courses={courses} departments={departments} />
        <main className="pt-[108px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}