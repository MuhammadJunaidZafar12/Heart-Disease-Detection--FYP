"use client";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";

const titles = {
  "/admin": "Dashboard",
  "/admin/users": "User Management",
  "/admin/patients": "Patients",
  "/admin/predictions": "Predictions",
  "/admin/reports": "Reports",
  "/admin/contact-messages": "Contact Messages",
  "/admin/settings": "Settings",
};

export default function AdminHeader({ onMenuClick }) {
  const pathname = usePathname();
  const title = titles[pathname] || "CardioGuard Admin";

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center gap-4">
      <button
        type="button"
        className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl hover:bg-gray-100"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6 text-[var(--color-foreground)]" />
      </button>
      <div>
        <p className="text-xs text-[var(--color-muted)] uppercase tracking-wide">
          CardioGuard Admin
        </p>
        <h2 className="font-semibold text-lg text-[var(--color-foreground)]">
          {title}
        </h2>
      </div>
    </header>
  );
}
