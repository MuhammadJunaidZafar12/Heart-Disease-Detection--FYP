import Link from "next/link";
import { Heart, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="page-container py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-6 h-6 text-[var(--color-accent)] fill-[var(--color-accent)]" />
              <h2 className="text-xl font-bold text-[var(--color-primary)]">
                CardioGuard
              </h2>
            </div>
            <p className="text-[var(--color-muted)] leading-relaxed max-w-xs text-sm sm:text-base">
              AI-powered heart disease detection for early prevention and better
              outcomes.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/prediction", label: "Prediction" },
                { href: "/chatbot", label: "Chatbot" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors relative group inline-block"
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--color-primary)] transition-all group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
                { href: "/privacy-policy", label: "Privacy Policy" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors relative group inline-block"
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--color-primary)] transition-all group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-4">
              Contact
            </h3>
            <div className="space-y-3 text-[var(--color-muted)] text-sm sm:text-base">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[var(--color-primary)] shrink-0" />
                hello@cardioguard.ai
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[var(--color-primary)] shrink-0" />
                +1 (555) 123-4567
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-12 pt-8 text-center">
          <p className="text-[var(--color-muted)] text-sm">
            © 2026 CardioGuard. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
