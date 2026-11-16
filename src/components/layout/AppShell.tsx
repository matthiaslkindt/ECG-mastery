"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Activity, BookOpen, ClipboardCheck, Home, Library, Menu, Stethoscope, TrendingUp, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/components/ui";
import { ThemeToggle } from "./ThemeToggle";
import { LocaleSwitcher } from "./LocaleSwitcher";

const NAV = [
  { href: "/", key: "home", icon: Home },
  { href: "/curriculum", key: "curriculum", icon: BookOpen },
  { href: "/cases", key: "cases", icon: Stethoscope },
  { href: "/library", key: "library", icon: Library },
  { href: "/assessments", key: "assessments", icon: ClipboardCheck },
  { href: "/progress", key: "progress", icon: TrendingUp },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const t = useTranslations("nav");
  const tApp = useTranslations("app");
  const tFooter = useTranslations("footer");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const nav = (
    <nav aria-label="Primary" className="flex flex-col gap-1">
      {NAV.map(({ href, key, icon: Icon }) => (
        <Link
          key={key}
          href={href}
          onClick={() => setOpen(false)}
          aria-current={isActive(href) ? "page" : undefined}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            isActive(href) ? "bg-accent-soft text-accent" : "text-fg-muted hover:bg-bg-muted hover:text-fg",
          )}
        >
          <Icon size={18} aria-hidden="true" />
          {t(key)}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[240px_1fr]">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-bg-elevated focus:px-3 focus:py-2 focus:shadow">
        {t("skipToContent")}
      </a>

      {/* Sidebar (desktop) */}
      <aside className="hidden border-r border-border bg-bg-elevated lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col">
        <div className="flex items-center gap-2 px-5 py-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-accent-fg">
            <Activity size={18} aria-hidden="true" />
          </span>
          <div>
            <div className="text-sm font-semibold leading-tight">{tApp("name")}</div>
            <div className="text-[11px] leading-tight text-fg-subtle">{tApp("tagline")}</div>
          </div>
        </div>
        <div className="px-3">{nav}</div>
        <div className="mt-auto flex items-center justify-between px-5 py-4">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-bg-elevated/90 px-4 py-3 backdrop-blur lg:hidden">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-accent-fg">
              <Activity size={16} aria-hidden="true" />
            </span>
            {tApp("name")}
          </Link>
          <div className="flex items-center gap-2">
            <LocaleSwitcher />
            <ThemeToggle />
            <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-bg-muted" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={t("openMenu")}>
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>
        {open && <div className="border-b border-border bg-bg-elevated px-3 py-3 lg:hidden">{nav}</div>}

        <main id="main" className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-8 lg:px-10">
          {children}
        </main>
        <footer className="mt-12 border-t border-border px-4 py-6 text-xs text-fg-subtle md:px-8 lg:px-10">
          <p>{tFooter("disclaimer")}</p>
          <p className="mt-1">{tFooter("data")}</p>
        </footer>
      </div>
    </div>
  );
}
