/**
 * Portfolio content model.
 *
 * The public site renders `resolvePortfolio(dbRow)`. The database always takes priority:
 *
 *  - Lists (skills, projects, research, exploring, journey, roles, socials):
 *      missing / null / not-an-array  -> built-in default
 *      any array, including []        -> used as stored ([] hides the section)
 *  - Contact fields (email, phone, location) — privacy-sensitive:
 *      missing / null                 -> built-in default
 *      any string, including "" / "  " -> used as stored (blank = hidden on the public page)
 *  - Core profile text (name, headline, tagline, about):
 *      missing / null / blank         -> built-in default (the page needs these to make sense)
 *      the legacy "Add your verified professional introduction…" placeholder also counts as unset.
 *  - avatarUrl / cvUrl: blank means "none" (their default is empty anyway).
 *
 * The built-in defaults contain no phone number. Saving from the Admin dashboard writes the full
 * resolved object, so after the first save the database holds every field explicitly.
 *
 * Backward compatible with the original `portfolio-admin-update` shape
 * ({ name, headline, about, skills, projects, research, exploring, avatarUrl, cvUrl, contact }).
 * Fields added here (tagline, roles, journey, socials, and optional item fields tags/repo/image)
 * are all optional in stored data. Unknown keys found in the database are preserved on save.
 */

export type CardItem = {
  title: string;
  desc: string;
  status?: string;
  url?: string;
  /** Source-code link (projects). */
  repo?: string;
  /** Short technology / keyword chips. */
  tags?: string[];
  /** Screenshot / cover image URL (projects). */
  image?: string;
};

export type SocialLink = { label: string; url: string };

export type Contact = { email: string; phone: string; location: string };

export type PortfolioData = {
  name: string;
  headline: string;
  tagline: string;
  roles: string[];
  about: string;
  skills: CardItem[];
  projects: CardItem[];
  research: CardItem[];
  exploring: CardItem[];
  journey: CardItem[];
  avatarUrl: string;
  cvUrl: string;
  contact: Contact;
  socials: SocialLink[];
};

export type ListKey = "skills" | "projects" | "research" | "exploring" | "journey";
export const LIST_KEYS: ListKey[] = ["skills", "projects", "research", "exploring", "journey"];

export const QYSOUL_URL = "https://qy-soul.vercel.app/";

/** Built-in content, restored from the original portfolio (main branch). */
export const FALLBACK: PortfolioData = {
  name: "Bauby Gupta",
  headline: "Founder & CEO, QySoul",
  tagline:
    "Building intelligent systems, scalable architectures, and next-generation technology to empower the future.",
  roles: ["AI Researcher", "Full Stack Developer", "Quantum Computing", "Software Engineer", "Scientific Discovery"],
  about: [
    "I am Bauby Gupta, a self-driven Full Stack & Deep Tech Engineer and the Founder & CEO of QySoul — a research, innovation, and invention lab focused on Artificial Intelligence, Quantum Computing, and next-generation science.",
    "I made the bold decision to step away from traditional academics and drop my B.Tech to pursue real-world innovation and deep technical mastery. My journey is built on execution, research, and building scalable systems that can shape the future of humanity.",
    "My expertise spans MERN Stack, Spring Boot, Java backend architecture, enterprise-level Full Stack development, AI systems engineering, DevOps automation, and emerging Quantum computing research.",
    "I don’t just build software — I engineer intelligent ecosystems. My mission is to create technology that empowers, protects, and advances humanity.",
  ].join("\n\n"),
  skills: [
    { title: "MERN Stack", desc: "MongoDB, Express, React, Node.js", tags: ["MongoDB", "Express", "React", "Node.js"] },
    { title: "Full Stack Development", desc: "End-to-end scalable applications" },
    { title: "App Development", desc: "Android, Java, Spring Boot & cross-platform apps", tags: ["Android", "Java", "Spring Boot"] },
    { title: "Software Engineering", desc: "Robust architecture & clean code" },
    { title: "Artificial Intelligence", desc: "ML systems & intelligent automation" },
    { title: "Quantum Computing", desc: "Next-gen computational research" },
  ],
  projects: [
    {
      title: "QySoul",
      status: "Live",
      desc: "A deployed MERN + TypeScript application.",
      url: QYSOUL_URL,
      tags: ["MERN", "TypeScript"],
    },
    {
      title: "Women's Safety AI System",
      status: "Currently Building",
      desc: "An intelligent AI-powered safety ecosystem designed to protect women using real-time monitoring, emergency alerts, smart analytics, and scalable backend infrastructure.",
    },
    {
      title: "AI Research Projects",
      status: "In Research Phase",
      desc: "Developing advanced machine learning systems, automation frameworks, and experimental AI architectures focused on real-world impact and scalability.",
    },
    {
      title: "Quantum Computing Initiatives",
      status: "Future Development",
      desc: "Exploring quantum algorithms, deep computational models, and next-generation problem solving to build breakthrough scientific systems.",
    },
  ],
  research: [
    {
      title: "How AI Can Prevent Crime",
      desc: "Exploring predictive analytics, real-time monitoring, behavioral modeling, and ethical AI systems to enhance public safety.",
    },
    {
      title: "System Design Fundamentals",
      desc: "Understanding scalability, distributed systems, load balancing, and backend architecture for high-performance applications.",
    },
    {
      title: "DevOps Learning Journey",
      desc: "CI/CD pipelines, Docker, Kubernetes, automation, and building reliable cloud-native infrastructures.",
    },
    {
      title: "Linux Essentials",
      desc: "Kernel basics, process management, memory systems, shell scripting, and system-level engineering.",
    },
    {
      title: "Networking Fundamentals",
      desc: "Protocols, TCP/IP, routing, distributed communication, and secure infrastructure design.",
    },
  ],
  exploring: [
    {
      title: "Quantum Computing",
      desc: "Quantum algorithms, qubits, computational physics, and next-generation cryptography.",
    },
    {
      title: "System Software",
      desc: "Operating systems, memory management, compilers, and low-level architecture.",
    },
    {
      title: "AI Research",
      desc: "Advanced machine learning models, deep learning systems, and intelligent automation.",
    },
    { title: "Science & Mathematics", desc: "Complex mathematical theorems and cosmic science." },
    { title: "Biological Computation", desc: "A deep curiosity for exploring biological computation." },
  ],
  journey: [
    {
      title: "Founder & CEO",
      status: "QySoul",
      desc: "Leading QySoul — a research, innovation, and invention lab focused on Artificial Intelligence, Quantum Computing, and next-generation science.",
      url: QYSOUL_URL,
    },
    {
      title: "Currently building: Women's Safety AI System",
      status: "In progress",
      desc: "An AI-powered safety ecosystem with real-time monitoring, emergency alerts, smart analytics, and scalable backend infrastructure.",
    },
    {
      title: "Self-directed engineering path",
      status: "Education",
      desc: "Stepped away from a B.Tech programme to pursue real-world innovation and deep technical mastery through research, execution, and building scalable systems.",
    },
  ],
  avatarUrl: "",
  cvUrl: "",
  // No phone number in built-in defaults (privacy). A phone shows only if stored in the database.
  contact: { email: "baubygp9321@gmail.com", phone: "", location: "Panipat, Haryana, India" },
  socials: [],
};

/** Placeholder strings shipped by the previous version; treated as "not set yet". */
const PLACEHOLDERS = new Set([
  "Founder & CEO of QySoul. Add your verified professional introduction from the Admin Dashboard.",
]);

export type FieldSource = "database" | "default";
export type Sources = Partial<Record<keyof PortfolioData, FieldSource>>;

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

function cleanItem(v: unknown): CardItem | null {
  if (!isObj(v)) return null;
  const title = str(v.title);
  const desc = str(v.desc);
  if (!title && !desc) return null;
  const item: CardItem = { title, desc };
  for (const k of ["status", "url", "repo", "image"] as const) {
    const s = str(v[k]);
    if (s) item[k] = s;
  }
  if (Array.isArray(v.tags)) {
    const tags = v.tags.map(str).filter(Boolean);
    if (tags.length) item.tags = tags;
  }
  return item;
}

function cleanList(v: unknown): CardItem[] {
  return Array.isArray(v) ? v.map(cleanItem).filter((x): x is CardItem => x !== null) : [];
}

function cleanSocials(v: unknown): SocialLink[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter(isObj)
    .map((s) => ({ label: str(s.label), url: str(s.url) }))
    .filter((s) => s.url);
}

export function resolvePortfolio(raw: unknown): { data: PortfolioData; sources: Sources } {
  const db = isObj(raw) ? raw : {};
  const sources: Sources = {};
  const pickStr = (key: "name" | "headline" | "tagline" | "about" | "avatarUrl" | "cvUrl") => {
    const v = str(db[key]);
    const ok = v !== "" && !PLACEHOLDERS.has(v);
    sources[key] = ok ? "database" : "default";
    return ok ? v : FALLBACK[key];
  };
  // Any stored array is respected, even []; only missing/null/non-array values fall back.
  const pickList = (key: ListKey) => {
    const stored = Array.isArray(db[key]);
    sources[key] = stored ? "database" : "default";
    return stored ? cleanList(db[key]) : FALLBACK[key];
  };

  const rolesStored = Array.isArray(db.roles);
  sources.roles = rolesStored ? "database" : "default";
  const roles = rolesStored ? (db.roles as unknown[]).map(str).filter(Boolean) : FALLBACK.roles;

  const socialsStored = Array.isArray(db.socials);
  sources.socials = socialsStored ? "database" : "default";
  const socials = socialsStored ? cleanSocials(db.socials) : FALLBACK.socials;

  // Contact: a stored string (even "" or whitespace) is respected so blank fields stay hidden.
  const c = isObj(db.contact) ? db.contact : null;
  const contactField = (k: keyof Contact) => (c && typeof c[k] === "string" ? (c[k] as string).trim() : FALLBACK.contact[k]);
  const contact: Contact = { email: contactField("email"), phone: contactField("phone"), location: contactField("location") };
  sources.contact = c ? "database" : "default";

  const data: PortfolioData = {
    name: pickStr("name"),
    headline: pickStr("headline"),
    tagline: pickStr("tagline"),
    roles,
    about: pickStr("about"),
    skills: pickList("skills"),
    projects: pickList("projects"),
    research: pickList("research"),
    exploring: pickList("exploring"),
    journey: pickList("journey"),
    avatarUrl: pickStr("avatarUrl"),
    cvUrl: pickStr("cvUrl"),
    contact,
    socials,
  };
  return { data, sources };
}

export const paragraphs = (text: string) =>
  text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

export const isHttpUrl = (s: string) => /^https?:\/\/[^\s]+$/i.test(s.trim());

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

/** Validation used by the Admin dashboard before saving. Returns human-readable problems. */
export function validatePortfolio(d: PortfolioData): string[] {
  const errors: string[] = [];
  if (!d.name.trim()) errors.push("Profile: display name is required.");
  const checkUrl = (label: string, v: string | undefined) => {
    if (v && v.trim() && !isHttpUrl(v)) errors.push(`${label}: “${v}” must start with http:// or https://`);
  };
  checkUrl("Profile photo URL", d.avatarUrl);
  checkUrl("CV URL", d.cvUrl);
  if (d.contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.contact.email.trim()))
    errors.push("Contact: email address looks invalid.");
  d.socials.forEach((s, i) => {
    if (!s.label.trim()) errors.push(`Social link #${i + 1}: label is required.`);
    checkUrl(`Social link #${i + 1}`, s.url);
    if (!s.url.trim()) errors.push(`Social link #${i + 1}: URL is required.`);
  });
  for (const key of LIST_KEYS) {
    d[key].forEach((item, i) => {
      const where = `${key[0].toUpperCase()}${key.slice(1)} #${i + 1}`;
      if (!item.title.trim()) errors.push(`${where}: title is required.`);
      if (!item.desc.trim()) errors.push(`${where}: description is required.`);
      checkUrl(`${where} link`, item.url);
      checkUrl(`${where} repository`, item.repo);
      checkUrl(`${where} image`, item.image);
    });
  }
  return errors;
}

/** Normalises a draft before saving: trims strings and drops empty optional fields. */
export function normalizePortfolio(d: PortfolioData): PortfolioData {
  const item = (x: CardItem): CardItem => cleanItem(x) ?? { title: x.title.trim(), desc: x.desc.trim() };
  return {
    ...d,
    name: d.name.trim(),
    headline: d.headline.trim(),
    tagline: d.tagline.trim(),
    about: d.about.trim(),
    roles: d.roles.map((r) => r.trim()).filter(Boolean),
    avatarUrl: d.avatarUrl.trim(),
    cvUrl: d.cvUrl.trim(),
    contact: { email: d.contact.email.trim(), phone: d.contact.phone.trim(), location: d.contact.location.trim() },
    socials: d.socials.map((s) => ({ label: s.label.trim(), url: s.url.trim() })),
    skills: d.skills.map(item),
    projects: d.projects.map(item),
    research: d.research.map(item),
    exploring: d.exploring.map(item),
    journey: d.journey.map(item),
  };
}
