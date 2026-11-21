import { FaArrowRight, FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import type { CardItem } from "../lib/portfolio";
import { tagIcon } from "../lib/icons";
import { TopicIcon } from "./TopicIcon";
import { cardBase, Reveal, StatusBadge, Tag } from "./ui";

type Variant = "skill" | "exploring" | "research" | "project";

const gridCols: Record<Variant, string> = {
  skill: "sm:grid-cols-2 lg:grid-cols-3",
  exploring: "sm:grid-cols-2 lg:grid-cols-3",
  research: "sm:grid-cols-2 lg:grid-cols-3",
  project: "md:grid-cols-2",
};

const linkCls =
  "inline-flex min-h-11 items-center gap-2 rounded-full text-sm font-semibold text-accent transition hover:underline underline-offset-4";

function Tags({ tags }: { tags?: string[] }) {
  if (!tags?.length) return null;
  return (
    <ul className="mt-4 flex flex-wrap gap-2" aria-label="Technologies">
      {tags.map((t) => {
        const Icon = tagIcon(t);
        return (
          <li key={t}>
            <Tag>
              {Icon && <Icon className="mr-1.5" aria-hidden />}
              {t}
            </Tag>
          </li>
        );
      })}
    </ul>
  );
}

function Card({ item, variant }: { item: CardItem; variant: Variant }) {
  const isProject = variant === "project";

  return (
    <article className={`${cardBase} flex h-full flex-col overflow-hidden ${isProject ? "" : "p-6 sm:p-7"}`}>
      {isProject && item.image && (
        <div className="aspect-video overflow-hidden border-b border-line bg-surface-2">
          <img
            src={item.image}
            alt={`${item.title} screenshot`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className={isProject ? "flex flex-1 flex-col p-6 sm:p-8" : "flex flex-1 flex-col"}>
        <div className="flex items-start justify-between gap-3">
          <span
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/15 to-purple-500/15 text-xl text-accent ring-1 ring-inset ring-line"
            aria-hidden="true"
          >
            <TopicIcon title={item.title} />
          </span>
          {item.status && <StatusBadge status={item.status} />}
        </div>

        <h3
          className={`mt-5 font-bold leading-snug ${
            variant === "research" ? "text-lg text-accent-2 sm:text-xl" : isProject ? "text-xl text-fg sm:text-2xl" : "text-lg text-fg sm:text-xl"
          }`}
        >
          {item.title}
        </h3>
        <p className="mt-3 text-sm leading-7 text-muted sm:text-[0.95rem]">{item.desc}</p>
        <Tags tags={item.tags} />

        {(item.url || item.repo) && (
          <div className="mt-auto flex flex-wrap gap-x-5 gap-y-1 pt-5">
            {item.url && (
              <a href={item.url} target="_blank" rel="noreferrer" className={linkCls}>
                {isProject ? (
                  <>
                    Live demo <FaExternalLinkAlt aria-hidden />
                  </>
                ) : (
                  <>
                    {variant === "research" ? "Read research" : "Learn more"} <FaArrowRight aria-hidden />
                  </>
                )}
                <span className="sr-only"> — {item.title} (opens in a new tab)</span>
              </a>
            )}
            {item.repo && (
              <a href={item.repo} target="_blank" rel="noreferrer" className={linkCls}>
                <FaGithub aria-hidden /> Source code
                <span className="sr-only"> — {item.title} (opens in a new tab)</span>
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export function CardGrid({ items, variant }: { items: CardItem[]; variant: Variant }) {
  return (
    <ul className={`grid grid-cols-1 gap-5 sm:gap-6 lg:gap-7 ${gridCols[variant]}`}>
      {items.map((item, i) => (
        <li key={`${item.title}-${i}`} className="min-w-0">
          <Reveal delay={Math.min(i * 0.07, 0.35)} className="h-full">
            <Card item={item} variant={variant} />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
