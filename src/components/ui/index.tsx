import { clsx } from "clsx";
import type { ComponentProps, ReactNode } from "react";
import { LEVEL_LABELS, type Level } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n/localized";

export function cn(...args: Parameters<typeof clsx>) {
  return clsx(...args);
}

type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

export function buttonClasses({ variant = "primary", size = "md", className }: Pick<ButtonProps, "variant" | "size" | "className">) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors select-none disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap",
    size === "sm" && "h-8 px-3 text-sm",
    size === "md" && "h-10 px-4 text-sm",
    size === "lg" && "h-11 px-5 text-base",
    variant === "primary" && "bg-accent text-accent-fg hover:opacity-90",
    variant === "secondary" && "bg-bg-elevated border border-border-strong text-fg hover:bg-bg-muted",
    variant === "ghost" && "text-fg hover:bg-bg-muted",
    variant === "danger" && "bg-danger text-white hover:opacity-90",
    className,
  );
}

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return <button className={buttonClasses({ variant, size, className })} {...props} />;
}

export function Card({ className, children, as: Tag = "div" }: { className?: string; children: ReactNode; as?: "div" | "section" | "article" | "li" }) {
  return <Tag className={cn("rounded-lg border border-border bg-bg-elevated", className)}>{children}</Tag>;
}

export function Badge({ children, tone = "neutral", className }: { children: ReactNode; tone?: "neutral" | "accent" | "success" | "warning" | "danger" | "info"; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium leading-5",
        tone === "neutral" && "bg-bg-muted text-fg-muted",
        tone === "accent" && "bg-accent-soft text-accent",
        tone === "success" && "bg-success-soft text-success",
        tone === "warning" && "bg-warning-soft text-warning",
        tone === "danger" && "bg-danger-soft text-danger",
        tone === "info" && "bg-info-soft text-info",
        className,
      )}
    >
      {children}
    </span>
  );
}

const LEVEL_TONE: Record<Level, "success" | "info" | "warning" | "danger"> = { 1: "success", 2: "info", 3: "warning", 4: "danger" };

export function LevelBadge({ level, locale }: { level: Level; locale: Locale }) {
  return (
    <Badge tone={LEVEL_TONE[level]}>
      <span className="tabular mr-1">{level}</span>
      {LEVEL_LABELS[level][locale]}
    </Badge>
  );
}

export function ProgressBar({ value, className, label }: { value: number; className?: string; label?: string }) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-bg-muted", className)} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <div className="h-full rounded-full bg-accent transition-[width]" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function PageHeader({ title, intro, aside }: { title: string; intro?: string; aside?: ReactNode }) {
  return (
    <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-fg">{title}</h1>
        {intro && <p className="mt-2 text-base text-fg-muted">{intro}</p>}
      </div>
      {aside && <div className="shrink-0">{aside}</div>}
    </header>
  );
}

export function SectionTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={cn("text-xs font-semibold uppercase tracking-wider text-fg-subtle", className)}>{children}</h2>;
}

export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="rounded border border-border-strong bg-bg-muted px-1.5 py-0.5 font-mono text-[11px] text-fg-muted">{children}</kbd>;
}
