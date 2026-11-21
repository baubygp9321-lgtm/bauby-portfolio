import { FaBriefcase, FaExternalLinkAlt, FaMapMarkerAlt, FaRocket } from "react-icons/fa";
import type { PortfolioData } from "../lib/portfolio";
import { paragraphs, QYSOUL_URL } from "../lib/portfolio";
import qysoulLogo from "../assets/qysoul-800.webp";
import { cardBase, Reveal, Section } from "./ui";

export function About({ data }: { data: PortfolioData }) {
  const facts = [
    { icon: FaBriefcase, label: "Role", value: data.headline },
    { icon: FaMapMarkerAlt, label: "Based in", value: data.contact.location },
    { icon: FaRocket, label: "Focus", value: "AI, Quantum Computing & next-generation science" },
  ].filter((f) => f.value);

  return (
    <Section id="about" eyebrow="Who I am" title="About Me">
      <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-[1.2fr_0.8fr] lg:gap-14">
        <div className="min-w-0">
          {paragraphs(data.about).map((p, i) => (
            <Reveal key={i} delay={Math.min(i * 0.08, 0.3)}>
              <p className={`text-base leading-8 sm:text-lg ${i === 0 ? "text-fg" : "mt-5 text-muted"}`}>{p}</p>
            </Reveal>
          ))}

          <Reveal delay={0.2} className="mt-8">
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {facts.map(({ icon: Icon, label, value }) => (
                <div key={label} className={`${cardBase} p-4`}>
                  <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
                    <Icon aria-hidden /> {label}
                  </dt>
                  <dd className="mt-1.5 text-sm font-medium leading-6 text-fg">{value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mx-auto w-full max-w-sm md:max-w-none">
          <a
            href={QYSOUL_URL}
            target="_blank"
            rel="noreferrer"
            className={`${cardBase} group block overflow-hidden p-0`}
            aria-label="Visit QySoul (opens in a new tab)"
          >
            <div className="aspect-square overflow-hidden rounded-t-3xl bg-[#03042a]">
              <img
                src={qysoulLogo}
                alt="QySoul logo — Quantum + AI Science"
                width={800}
                height={800}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:group-hover:scale-100"
              />
            </div>
            <div className="flex items-center justify-between gap-3 p-5">
              <div className="min-w-0">
                <p className="text-lg font-bold text-fg">QySoul</p>
                <p className="text-sm text-subtle">Founder & CEO · A live project</p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-accent">
                Visit <FaExternalLinkAlt aria-hidden />
              </span>
            </div>
          </a>
        </Reveal>
      </div>
    </Section>
  );
}
