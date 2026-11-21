import { FaArrowUp, FaEnvelope, FaGlobe } from "react-icons/fa";
import type { PortfolioData } from "../lib/portfolio";
import { QYSOUL_URL } from "../lib/portfolio";
import { socialIcon } from "../lib/icons";
import type { NavItem } from "./Navbar";

export function Footer({ data, items }: { data: PortfolioData; items: NavItem[] }) {
  const links = [
    ...(data.contact.email ? [{ label: "Email", url: `mailto:${data.contact.email}`, Icon: FaEnvelope }] : []),
    { label: "QySoul", url: QYSOUL_URL, Icon: FaGlobe },
    ...data.socials.map((s) => ({ ...s, Icon: socialIcon(s.url, s.label) })),
  ];

  return (
    <footer className="border-t border-line bg-nav/60 px-4 pt-12 backdrop-blur-xl sm:px-6" style={{ paddingBottom: "calc(2.5rem + env(safe-area-inset-bottom, 0px))" }}>
      <div className="mx-auto grid grid-cols-1 w-full max-w-6xl gap-10 md:grid-cols-[1.3fr_1fr_auto]">
        <div className="min-w-0">
          <p className="text-gradient text-2xl font-extrabold">{data.name}</p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-subtle">{data.headline}. Building the future through AI, Quantum & Deep Tech.</p>
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Social links">
            {links.map(({ label, url, Icon }) => (
              <li key={url}>
                <a
                  href={url}
                  {...(url.startsWith("mailto:") ? {} : { target: "_blank", rel: "noreferrer" })}
                  aria-label={label}
                  title={label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-muted transition hover:border-accent/60 hover:text-accent"
                >
                  <Icon aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Footer">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-subtle">Explore</p>
          <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1">
            {items.map((i) => (
              <li key={i.id}>
                <a href={`#${i.id}`} className="inline-flex min-h-10 items-center text-sm text-muted transition hover:text-accent">
                  {i.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:text-right">
          <a
            href="#hero"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-surface px-5 text-sm font-semibold text-fg transition hover:border-accent/60 hover:text-accent"
          >
            <FaArrowUp aria-hidden /> Back to top
          </a>
        </div>
      </div>
      <p className="mx-auto mt-10 w-full max-w-6xl border-t border-line pt-6 text-center text-xs text-subtle">
        © {new Date().getFullYear()} {data.name} · {data.headline}
      </p>
    </footer>
  );
}
