"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Sparkles } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/lesson/1", label: "Lessons", match: "/lesson" },
  { href: "/exam", label: "Final Exam" },
  { href: "/mistakes", label: "Mistakes" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 glass border-b border-white/[0.08]">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-6"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="focus-ring flex shrink-0 items-center gap-2 rounded-lg font-bold text-ink"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-gradient shadow-glow">
            <GraduationCap className="h-5 w-5 text-white" aria-hidden="true" />
          </span>
          <span className="hidden sm:inline">HSK 3 Sprint</span>
        </Link>

        <ul className="flex min-w-0 items-center gap-0.5 overflow-x-auto sm:gap-2">
          {links.map((link) => {
            const isActive =
              pathname === link.href || (link.match && pathname.startsWith(link.match));
            return (
              <li key={link.href} className="shrink-0">
                <Link
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`focus-ring block whitespace-nowrap rounded-lg px-2 py-1.5 text-xs font-medium transition-colors sm:px-3 sm:text-sm ${
                    isActive
                      ? "bg-white/10 text-ink"
                      : "text-ink-muted hover:bg-white/5 hover:text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
          <li className="shrink-0">
            <Link
              href="/settings"
              aria-label="Settings"
              className="focus-ring flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-white/5 hover:text-ink"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
