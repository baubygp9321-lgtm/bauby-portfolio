import type { ReactNode } from "react";
import { m } from "framer-motion";

/** Fade/slide-in on first scroll into view. framer-motion's MotionConfig handles reduced motion. */
export function Reveal({
  children,
  delay = 0,
  className,
  y = 24,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.div>
  );
}

export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  width = "max-w-6xl",
}: {
  id: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  children: ReactNode;
  width?: string;
}) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className="px-4 py-20 sm:px-6 sm:py-24 lg:py-28">
      <div className={`mx-auto w-full ${width}`}>
        <Reveal className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          {eyebrow && (
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-accent">{eyebrow}</p>
          )}
          <h2 id={headingId} className="text-gradient text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            {title}
          </h2>
          {intro && <p className="mt-4 text-base leading-7 text-subtle sm:text-lg">{intro}</p>}
        </Reveal>
        {children}
      </div>
    </section>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line bg-surface px-2.5 py-1 text-xs font-medium text-muted">
      {children}
    </span>
  );
}

const STATUS_STYLES: [RegExp, string][] = [
  [/live|launched|deployed/i, "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 ring-emerald-500/30"],
  [/build|progress|active/i, "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 ring-cyan-500/30"],
  [/research/i, "bg-purple-500/15 text-purple-700 dark:text-purple-300 ring-purple-500/30"],
];

export function StatusBadge({ status }: { status: string }) {
  const cls =
    STATUS_STYLES.find(([re]) => re.test(status))?.[1] ??
    "bg-slate-500/15 text-slate-700 dark:text-slate-300 ring-slate-500/30";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${cls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {status}
    </span>
  );
}

export const cardBase =
  "glass glow-border rounded-3xl shadow-lg shadow-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_-20px] hover:shadow-cyan-500/40 motion-reduce:hover:translate-y-0";
