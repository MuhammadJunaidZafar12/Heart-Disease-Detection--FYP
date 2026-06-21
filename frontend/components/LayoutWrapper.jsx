"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/ui/PageTransition";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");
  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <>
      {!isAdminPage && !isAuthPage && <Navbar />}
      <main className="flex-1">
        <PageTransition key={pathname}>{children}</PageTransition>
      </main>
      {!isAdminPage && !isAuthPage && <Footer />}
    </>
  );
}
