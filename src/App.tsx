import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { domAnimation, LazyMotion, MotionConfig } from "framer-motion";
import { CONTENT_ROW_ID, CONTENT_TABLE, supabase } from "./lib/supabase";
import { resolvePortfolio, type ListKey } from "./lib/portfolio";
import { useTheme } from "./hooks/useTheme";
import { useActiveSection } from "./hooks/useActiveSection";
import { Background } from "./components/Background";
import { Navbar, type NavItem } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Section } from "./components/ui";
import { CardGrid } from "./components/CardGrid";
import { Journey } from "./components/Journey";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { BackToTop } from "./components/BackToTop";

// Admin UI is only downloaded when someone opens it.
const AdminLogin = lazy(() => import("./admin/AdminLogin").then((m) => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import("./admin/AdminDashboard"));

const CACHE_KEY = "portfolio-content-v1";
type Raw = Record<string, unknown>;

function readCache(): Raw {
  try {
    const s = localStorage.getItem(CACHE_KEY);
    const v: unknown = s ? JSON.parse(s) : null;
    return v && typeof v === "object" && !Array.isArray(v) ? (v as Raw) : {};
  } catch {
    return {};
  }
}

function writeCache(raw: Raw) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(raw));
  } catch {
    /* storage full / unavailable */
  }
}

/** `list` marks sections that are hidden (with their nav link) when their stored list is empty. */
const NAV: (NavItem & { list?: ListKey })[] = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills", list: "skills" },
  { id: "journey", label: "Journey", list: "journey" },
  { id: "projects", label: "Projects", list: "projects" },
  { id: "research", label: "Research", list: "research" },
  { id: "exploring", label: "Exploring", list: "exploring" },
  { id: "contact", label: "Contact" },
];

function App() {
  const { theme, toggle } = useTheme();
  // Last-known database content renders instantly on repeat visits; fresh data replaces it when it arrives.
  const [raw, setRaw] = useState<Raw>(readCache);
  const [syncing, setSyncing] = useState(() => !!supabase);
  const [session, setSession] = useState<Session | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);

  const { data, sources } = useMemo(() => resolvePortfolio(raw), [raw]);
  const navItems = useMemo<NavItem[]>(
    () => NAV.filter((n) => !n.list || data[n.list].length > 0).map(({ id, label }) => ({ id, label })),
    [data],
  );
  const show = (key: ListKey) => data[key].length > 0;
  // "hero" is observed too, so scrolling back to the top clears the highlight.
  const active = useActiveSection(["hero", ...navItems.map((n) => n.id)]);

  useEffect(() => {
    const client = supabase;
    if (!client) return;
    let mounted = true;

    client.auth.getSession().then(({ data: result }) => {
      if (mounted) setSession(result.session);
    });
    const { data: listener } = client.auth.onAuthStateChange((_event, next) => setSession(next));

    client
      .from(CONTENT_TABLE)
      .select("data")
      .eq("id", CONTENT_ROW_ID)
      .maybeSingle()
      .then(({ data: row, error }) => {
        if (!mounted) return;
        if (error) console.warn("[portfolio] could not load content, showing cached/default content", error.message);
        else if (row?.data && typeof row.data === "object") {
          setRaw(row.data as Raw);
          writeCache(row.data as Raw);
        }
        setSyncing(false);
      });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const openAdmin = () => (session ? setDashboardOpen(true) : setLoginOpen(true));

  const logout = async () => {
    await supabase?.auth.signOut();
    setDashboardOpen(false);
  };

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <a
          href="#main"
          className="sr-only z-[200] rounded-full bg-gradient-brand font-semibold text-on-accent focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:px-5 focus:py-3"
        >
          Skip to content
        </a>

        <Background theme={theme} />

        <Navbar
          name={data.name}
          items={navItems}
          active={active}
          theme={theme}
          onToggleTheme={toggle}
          onAdmin={openAdmin}
          signedIn={!!session}
        />

        <main id="main" tabIndex={-1} className="relative z-10 outline-none">
          <Hero data={data} />
          <About data={data} />
          {show("skills") && (
            <Section id="skills" eyebrow="What I work with" title="Technical Expertise" intro="Engineering intelligent systems with scalable modern architecture.">
              <CardGrid items={data.skills} variant="skill" />
            </Section>
          )}
          {show("journey") && <Journey items={data.journey} />}
          {show("projects") && (
            <Section id="projects" eyebrow="Selected work" title="Projects & Vision" intro="Building intelligent systems today. Researching tomorrow’s technology.">
              <CardGrid items={data.projects} variant="project" />
            </Section>
          )}
          {show("research") && (
            <Section id="research" eyebrow="Notes & study" title="Research & Insights" intro="Exploring deep systems, AI innovation, and modern computing architecture.">
              <CardGrid items={data.research} variant="research" />
            </Section>
          )}
          {show("exploring") && (
            <Section id="exploring" eyebrow="Always learning" title="Currently Exploring" intro="Continuously evolving through deep research, system design, and frontier technologies.">
              <CardGrid items={data.exploring} variant="exploring" />
            </Section>
          )}
          <Contact data={data} />
        </main>

        <div className="relative z-10">
          <Footer data={data} items={navItems} />
        </div>

        <BackToTop />

        {syncing && (
          <p
            role="status"
            className="fixed z-30 rounded-full border border-line bg-nav px-4 py-2 text-xs text-accent shadow-lg backdrop-blur-xl"
            style={{ left: "max(1rem, env(safe-area-inset-left, 0px))", bottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}
          >
            Syncing latest content…
          </p>
        )}

        <Suspense fallback={null}>
          {loginOpen && (
            <AdminLogin
              onClose={() => setLoginOpen(false)}
              onSuccess={() => {
                setLoginOpen(false);
                setDashboardOpen(true);
              }}
            />
          )}
          {dashboardOpen && session && (
            <AdminDashboard
              data={data}
              sources={sources}
              raw={raw}
              userEmail={session.user.email}
              onSaved={(next) => {
                setRaw(next);
                writeCache(next);
              }}
              onClose={() => setDashboardOpen(false)}
              onLogout={logout}
            />
          )}
        </Suspense>
      </LazyMotion>
    </MotionConfig>
  );
}

export default App;
