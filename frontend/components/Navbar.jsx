"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/prediction", label: "Prediction" },
  { href: "/chatbot", label: "Chatbot" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleAdmin = () => {
    if (isAdmin) router.push("/admin");
    else alert("You don't have admin access");
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const linkClass = (href) =>
    cn(
      "block sm:inline-block py-2.5 px-4 rounded-xl text-sm font-medium transition-colors min-h-[44px] sm:min-h-0 flex sm:inline-flex items-center",
      pathname === href
        ? "bg-[var(--color-primary)]/15 text-[var(--color-primary)]"
        : "text-[var(--color-muted)] hover:bg-gray-100"
    );

  return (
    <>
      <nav
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "bg-white/90 backdrop-blur-lg shadow-md shadow-[var(--color-primary)]/5 border-b border-gray-100"
            : "bg-white/75 backdrop-blur-md shadow-sm"
        )}
      >
        <div className="page-container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Heart className="h-6 w-6 text-[var(--color-accent)] fill-[var(--color-accent)] heartbeat" />
            <span className="font-bold text-lg text-[var(--color-foreground)]">
              CardioGuard
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkClass(link.href)}>
                {link.label}
              </Link>
            ))}
            {isLoggedIn && (
              <Link href="/user" className={linkClass("/user")}>
                My Records
              </Link>
            )}
            {isAdmin && isLoggedIn && (
              <Button variant="secondary" size="sm" onClick={handleAdmin}>
                Admin
              </Button>
            )}
            {isLoggedIn ? (
              <Button variant="white" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            ) : (
              <Link href="/login">
                <Button variant="secondary" size="sm">
                  Login
                </Button>
              </Link>
            )}
          </div>

          <button
            type="button"
            className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          aria-hidden="true"
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-16 left-0 right-0 bottom-0 bg-white p-4 flex flex-col gap-2 overflow-y-auto shadow-xl">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkClass(link.href)}>
                {link.label}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-2">
              {isLoggedIn && (
                <Link href="/user">
                  <Button variant="ghost" className="w-full">
                    My Records
                  </Button>
                </Link>
              )}
              {isAdmin && isLoggedIn && (
                <Button variant="secondary" onClick={handleAdmin}>
                  Admin
                </Button>
              )}
              {isLoggedIn ? (
                <Button variant="ghost" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              ) : (
                <Link href="/login">
                  <Button variant="secondary" className="w-full">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
