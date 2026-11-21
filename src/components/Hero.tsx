import { m, useReducedMotion } from "framer-motion";
import { FaArrowRight, FaDownload, FaEnvelope, FaGlobe } from "react-icons/fa";
import type { PortfolioData } from "../lib/portfolio";
import { QYSOUL_URL } from "../lib/portfolio";
import { useTypewriter } from "../hooks/useTypewriter";
import { socialIcon } from "../lib/icons";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

export function Hero({ data }: { data: PortfolioData }) {
  const reduceMotion = useReducedMotion() ?? false;
  const roles = data.roles.length ? data.roles : [data.headline];
  const typed = useTypewriter(roles, !reduceMotion);

  const links = [
    { label: "Email", url: `mailto:${data.contact.email}`, show: !!data.contact.email },
    { label: "QySoul", url: QYSOUL_URL, show: true },
    ...data.socials.map((s) => ({ ...s, show: true })),
  ].filter((l) => l.show);

  return (
    <section
      id="hero"
      aria-label="Introduction"
      className="relative flex min-h-[100svh] items-center px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:pb-20"
    >
      <div className="mx-auto grid grid-cols-1 w-full max-w-7xl items-center gap-12 md:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div className="min-w-0 text-center md:text-left">
          <m.p
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold text-accent sm:text-sm md:mx-0"
          >
            <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="truncate">{data.headline}</span>
          </m.p>

          <m.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05 }}
            className="text-[2.6rem] font-extrabold leading-[1.08] tracking-tight text-fg min-[400px]:text-5xl sm:text-6xl lg:text-7xl"
          >
            Hi, I'm <span className="text-gradient">{data.name}</span>
          </m.h1>

          <p className="mt-5 min-h-[2.25rem] text-xl font-medium text-accent sm:text-2xl">
            <span className="sr-only">Roles: {roles.join(", ")}</span>
            <span aria-hidden="true">
              {typed}
              <span className="caret ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[0.15em] bg-current" />
            </span>
          </p>

          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8 md:mx-0"
          >
            {data.tagline}
          </m.p>

          <m.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-8 flex flex-col items-stretch gap-3 min-[400px]:flex-row min-[400px]:flex-wrap min-[400px]:items-center min-[400px]:justify-center md:justify-start"
          >
            <a
              href="#projects"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-brand px-7 font-semibold text-on-accent shadow-lg shadow-cyan-500/20 transition hover:shadow-cyan-500/40 hover:brightness-110 active:scale-[0.98]"
            >
              View Projects
              <FaArrowRight className="transition-transform group-hover:translate-x-0.5" aria-hidden />
            </a>
            <a
              href="#contact"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-accent/70 px-7 font-semibold text-accent transition hover:bg-accent/10 active:scale-[0.98]"
            >
              Contact Me
            </a>
            {data.cvUrl && (
              <a
                href={data.cvUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-line bg-surface px-6 font-semibold text-fg transition hover:border-accent/60 hover:text-accent active:scale-[0.98]"
              >
                <FaDownload aria-hidden /> Download CV
              </a>
            )}
          </m.div>

          <ul className="mt-8 flex flex-wrap items-center justify-center gap-2 md:justify-start" aria-label="Links">
            {links.map((l) => {
              const Icon = l.label === "QySoul" ? FaGlobe : l.label === "Email" ? FaEnvelope : socialIcon(l.url, l.label);
              const external = !l.url.startsWith("mailto:");
              return (
                <li key={l.url}>
                  <a
                    href={l.url}
                    {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm text-muted transition hover:border-accent/60 hover:text-accent"
                  >
                    <Icon aria-hidden /> {l.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Portrait / monogram. All decoration is sized relative to this box, so nothing can widen the page. */}
        <m.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="relative mx-auto aspect-square w-full max-w-[15rem] min-[400px]:max-w-[17rem] sm:max-w-[20rem] lg:max-w-[24rem]"
        >
          <div className="absolute inset-0 scale-100 rounded-full bg-gradient-brand opacity-35 blur-3xl" aria-hidden="true" />
          {/* The rotating layer is clipped by its own circle: a rotated square's bounding box is ~41%
              larger and would otherwise widen the document on 320px screens. */}
          <div className="absolute inset-0 overflow-hidden rounded-full" aria-hidden="true">
            <div
              className="animate-spin-slow absolute inset-0"
              style={{ background: "conic-gradient(from 0deg, var(--g1), var(--g2), var(--g3), var(--g1))" }}
            />
          </div>
          <div className="absolute inset-[3px] overflow-hidden rounded-full bg-surface-2">
            {data.avatarUrl ? (
              <img
                src={data.avatarUrl}
                alt={`Portrait of ${data.name}`}
                width={384}
                height={384}
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center" role="img" aria-label={`${data.name} monogram`}>
                <span className="text-gradient text-7xl font-black tracking-tight sm:text-8xl">{initials(data.name)}</span>
              </div>
            )}
          </div>
        </m.div>
      </div>
    </section>
  );
}
