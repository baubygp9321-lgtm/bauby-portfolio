import { FaExternalLinkAlt } from "react-icons/fa";
import type { CardItem } from "../lib/portfolio";
import { TopicIcon } from "./TopicIcon";
import { Reveal, Section } from "./ui";

/** Experience & education timeline. Entries are shown in the order stored (newest first). */
export function Journey({ items }: { items: CardItem[] }) {
  return (
    <Section id="journey" eyebrow="Experience & education" title="My Journey" width="max-w-3xl">
      <ol className="relative ml-5 border-l border-line pl-7 sm:ml-6 sm:pl-10">
        <span
          className="absolute -left-px top-0 h-full w-px bg-gradient-to-b from-cyan-400 via-purple-500 to-transparent"
          aria-hidden="true"
        />
        {items.map((item, i) => {
          return (
            <li key={`${item.title}-${i}`} className="relative pb-10 last:pb-0">
              <span
                className="absolute -left-[2.85rem] top-0 flex h-9 w-9 items-center justify-center rounded-full border border-accent/40 bg-surface-2 text-accent shadow-[0_0_20px] shadow-cyan-500/30 sm:-left-[3.6rem] sm:h-10 sm:w-10"
                aria-hidden="true"
              >
                <TopicIcon title={`${item.title} ${item.status ?? ""}`} />
              </span>
              <Reveal delay={Math.min(i * 0.08, 0.3)}>
                {item.status && (
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{item.status}</p>
                )}
                <h3 className="mt-1.5 text-lg font-bold text-fg sm:text-xl">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted sm:text-base">{item.desc}</p>
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-accent underline-offset-4 hover:underline"
                  >
                    Visit <FaExternalLinkAlt aria-hidden />
                    <span className="sr-only"> {item.status ?? item.title} (opens in a new tab)</span>
                  </a>
                )}
              </Reveal>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
