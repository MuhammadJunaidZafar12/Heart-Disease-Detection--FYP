"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Activity,
  FileText,
  Settings,
  Mail,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminSidebar({ open, onClose }) {
  const pathname = usePathname();

  const menu = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { label: "Users", icon: Users, path: "/admin/users" },
    { label: "Patients", icon: Users, path: "/admin/patients" },
    { label: "Predictions", icon: Activity, path: "/admin/predictions" },
    { label: "Reports", icon: FileText, path: "/admin/reports" },
    { label: "Messages", icon: Mail, path: "/admin/contact-messages" },
    { label: "Settings", icon: Settings, path: "/admin/settings" },
  ];

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-[var(--color-primary-dark)] text-white p-4 flex flex-col transition-transform duration-300 md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-[var(--color-accent)]" />
            <span className="font-semibold text-lg">Admin</span>
          </div>
          <button
            type="button"
            className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-white/10"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-1 flex-1">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.path;
            return (
              <Link key={item.path} href={item.path} onClick={onClose}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all min-h-[44px] relative",
                    active
                      ? "bg-[#132f3a] text-[var(--color-accent)]"
                      : "hover:bg-[#132f3a] text-white/90"
                  )}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[var(--color-accent)] rounded-r-full" />
                  )}
                  <Icon size={18} className="shrink-0 ml-1" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-white/10 text-sm text-gray-400">
          <Link href="/" className="block py-2 hover:text-white transition-colors">
            ← Back to Site
          </Link>
          <p className="text-[var(--color-accent)] mt-2 cursor-pointer hover:underline">
            Sign Out
          </p>
        </div>
      </aside>
    </>
  );
}
