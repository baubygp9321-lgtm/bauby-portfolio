import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { motion } from "framer-motion";
import { FaMoon, FaSun, FaLock, FaSignOutAlt, FaSave, FaExternalLinkAlt } from "react-icons/fa";
import Typewriter from "typewriter-effect";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { supabase } from "./lib/supabase";

type CardItem = { title: string; desc: string; status?: string; url?: string };
type PortfolioData = {
  name: string;
  headline: string;
  about: string;
  skills: CardItem[];
  projects: CardItem[];
  research: CardItem[];
  exploring: CardItem[];
  avatarUrl: string;
  cvUrl: string;
  contact: { email: string; phone: string; location: string };
};

const DEFAULT_DATA: PortfolioData = {
  name: "Bauby Gupta",
  headline: "Founder & CEO, QySoul",
  about: "Founder & CEO of QySoul. Add your verified professional introduction from the Admin Dashboard.",
  skills: [],
  projects: [{
    title: "QySoul",
    status: "Live",
    desc: "A deployed MERN + TypeScript application.",
    url: "https://qy-soul.vercel.app/"
  }],
  research: [],
  exploring: [],
  avatarUrl: "",
  cvUrl: "",
  contact: { email: "", phone: "", location: "" }
};

const cardClass = "relative group p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-xl transition duration-500 hover:shadow-cyan-500/20";
const inputClass = "w-full rounded-xl border border-white/15 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-400";
const labelClass = "mb-2 block text-sm font-medium text-cyan-300";

function App() {
  const [dark, setDark] = useState(true);
  const [data, setData] = useState<PortfolioData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [skillsText, setSkillsText] = useState("[]");
  const [projectsText, setProjectsText] = useState("[]");
  const [researchText, setResearchText] = useState("[]");
  const [exploringText, setExploringText] = useState("[]");

  const particlesInit = async (main: any) => { await loadFull(main); };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data: result }) => {
      if (mounted) setSession(result.session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });
    const loadPortfolio = async () => {
      const { data: row, error } = await supabase
        .from("portfolio_content").select("data").eq("id", 1).maybeSingle();
      if (!error && row?.data && mounted) setData({ ...DEFAULT_DATA, ...row.data });
      if (mounted) setLoading(false);
    };
    loadPortfolio();
    return () => { mounted = false; listener.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    setSkillsText(JSON.stringify(data.skills, null, 2));
    setProjectsText(JSON.stringify(data.projects, null, 2));
    setResearchText(JSON.stringify(data.research, null, 2));
    setExploringText(JSON.stringify(data.exploring, null, 2));
  }, [data]);

  const roles = useMemo(() => {
    const list = [data.headline, "Building with curiosity", "Founder & Builder"].filter(Boolean);
    return list.length ? list : ["Welcome"];
  }, [data.headline]);

  const update = (key: keyof PortfolioData, value: any) => {
    setData(current => ({ ...current, [key]: value }));
  };

  const signIn = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true); setLoginError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setLoginError("Login failed. Please check your email and password.");
    else { setLoginOpen(false); setDashboardOpen(true); setPassword(""); }
  };

  const save = async () => {
    try {
      setBusy(true); setNotice("");
      const nextData: PortfolioData = {
        ...data,
        skills: JSON.parse(skillsText),
        projects: JSON.parse(projectsText),
        research: JSON.parse(researchText),
        exploring: JSON.parse(exploringText)
      };
      const { error } = await supabase.from("portfolio_content")
        .update({ data: nextData, updated_at: new Date().toISOString() }).eq("id", 1);
      if (error) throw error;
      setData(nextData);
      setNotice("Saved! Public portfolio is updated.");
    } catch (error) {
      setNotice(error instanceof SyntaxError
        ? "List JSON is invalid. Check commas and quotation marks."
        : "Save failed. Check your admin access and Supabase setup.");
    } finally { setBusy(false); }
  };

  const uploadFile = async (file: File, kind: "avatar" | "cv") => {
    setBusy(true); setNotice("");
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `${kind}/${Date.now()}-${safeName}`;
    const { error } = await supabase.storage.from("portfolio-assets").upload(path, file, { upsert: true });
    if (error) {
      setNotice("Upload failed. Check the portfolio-assets bucket and storage policies.");
    } else {
      const { data: publicData } = supabase.storage.from("portfolio-assets").getPublicUrl(path);
      if (kind === "avatar") update("avatarUrl", publicData.publicUrl);
      else update("cvUrl", publicData.publicUrl);
      setNotice(`${kind === "avatar" ? "Photo" : "CV"} uploaded. Click Save Changes to publish it.`);
    }
    setBusy(false);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setDashboardOpen(false);
  };

  const renderCards = (items: CardItem[], type: "skill" | "project" | "research" | "exploring") => {
    if (!items.length) return null;
    return (
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <motion.article key={`${item.title}-${i}`} initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: Math.min(i * 0.08, 0.35) }} whileHover={{ y: -8 }}
            className={`${cardClass} text-left`}>
            {type === "project" && item.status && <span className="mb-4 inline-block rounded-full bg-cyan-500/20 px-3 py-1 text-xs text-cyan-300">{item.status}</span>}
            <h3 className="mb-3 text-xl font-semibold text-cyan-300">{item.title}</h3>
            <p className="text-sm leading-7 text-slate-200">{item.desc}</p>
            {item.url && <a href={item.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm text-cyan-300 hover:underline">Explore <FaExternalLinkAlt /></a>}
          </motion.article>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-black text-white">
      <Particles init={particlesInit} className="pointer-events-none fixed inset-0 -z-0"
        options={{ particles: { number: { value: 65 }, size: { value: 2 }, color: { value: "#00ffff" }, move: { enable: true, speed: 0.7 }, links: { enable: true, color: "#8b5cf6", opacity: 0.18 } } }} />
      <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-cyan-500 opacity-20 blur-[150px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-purple-600 opacity-20 blur-[150px]" />

      <button onClick={() => setDark(!dark)} aria-label="Toggle theme"
        className="fixed right-5 top-24 z-50 rounded-full border border-white/20 bg-white/10 p-3 backdrop-blur-xl transition hover:scale-110">
        {dark ? <FaSun className="text-yellow-400" /> : <FaMoon />}
      </button>

      <nav className="fixed left-0 top-0 z-40 w-full bg-slate-900/85 shadow-lg backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="#hero" className="text-2xl font-bold text-cyan-400">{data.name}</a>
          <div className="hidden items-center gap-7 font-medium text-gray-200 md:flex">
            {["about", "skills", "projects", "research", "contact"].map(id =>
              <a key={id} href={`#${id}`} className="capitalize transition hover:text-cyan-400">{id}</a>)}
          </div>
          <button onClick={() => session ? setDashboardOpen(true) : setLoginOpen(true)}
            className="flex items-center gap-2 rounded-full border border-cyan-400/50 px-4 py-2 text-sm text-cyan-300 transition hover:bg-cyan-400/10">
            <FaLock /> Admin
          </button>
        </div>
      </nav>

      <main className="relative z-10">
        <section id="hero" className="flex min-h-screen items-center px-6 pt-24">
          <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
            <div className="text-center md:text-left">
              <motion.h1 initial={{ opacity: 0, y: -35 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}
                className="text-5xl font-extrabold leading-tight md:text-6xl">
                Hi, I'm <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">{data.name}</span>
              </motion.h1>
              <div className="mt-6 text-2xl text-cyan-400">
                <Typewriter options={{ strings: roles, autoStart: true, loop: true }} />
              </div>
              <p className="mt-6 max-w-xl leading-8 text-slate-200">{data.about}</p>
              <div className="mt-8 flex justify-center gap-4 md:justify-start">
                <a href="#projects" className="rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 px-8 py-3 font-semibold text-black shadow-lg transition hover:scale-105">View Projects</a>
                <a href="#contact" className="rounded-full border border-cyan-400 px-8 py-3 text-cyan-300 transition hover:bg-cyan-400/10">Contact Me</a>
              </div>
              {data.cvUrl && <a href={data.cvUrl} target="_blank" rel="noreferrer" className="mt-5 inline-block text-sm text-cyan-300 underline">View CV</a>}
            </div>
            <motion.div initial={{ opacity: 0, scale: 0.82 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}
              className="relative flex justify-center">
              <div className="absolute h-80 w-80 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 opacity-30 blur-3xl md:h-[26rem] md:w-[26rem]" />
              {data.avatarUrl
                ? <img src={data.avatarUrl} alt={data.name} className="relative h-72 w-72 rounded-full border-4 border-cyan-400 object-cover shadow-2xl md:h-96 md:w-96" />
                : <div className="relative flex h-72 w-72 items-center justify-center rounded-full border-4 border-cyan-400 bg-slate-900/80 text-7xl font-bold text-cyan-300 shadow-2xl md:h-96 md:w-96">BG</div>}
            </motion.div>
          </div>
        </section>

        <section id="about" className="px-6 py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-8 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">About Me</h2>
              <p className="text-lg leading-8 text-slate-100">{data.about}</p>
              <p className="mt-6 text-lg leading-8 text-slate-300">Founder & CEO of <a href="https://qy-soul.vercel.app/" target="_blank" rel="noreferrer" className="text-cyan-300 underline">QySoul</a>.</p>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/5 p-10 text-center shadow-2xl backdrop-blur-xl">
              <div className="text-5xl font-bold text-cyan-300">QySoul</div>
              <p className="mt-4 text-slate-300">A live project</p>
              <a href="https://qy-soul.vercel.app/" target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-cyan-300 hover:underline">Visit QySoul <FaExternalLinkAlt /></a>
            </div>
          </div>
        </section>

        {data.skills.length > 0 && <section id="skills" className="px-6 py-28">
          <div className="mx-auto max-w-6xl text-center"><h2 className="mb-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">Technical Expertise</h2>
            <p className="mb-16 text-slate-400">Skills and tools I work with.</p>{renderCards(data.skills, "skill")}</div>
        </section>}

        {data.exploring.length > 0 && <section className="px-6 py-28">
          <div className="mx-auto max-w-6xl text-center"><h2 className="mb-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">Currently Exploring</h2>
            <p className="mb-16 text-slate-400">Topics I am currently learning and exploring.</p>{renderCards(data.exploring, "exploring")}</div>
        </section>}

        <section id="projects" className="px-6 py-28">
          <div className="mx-auto max-w-6xl text-center"><h2 className="mb-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">Projects & Vision</h2>
            <p className="mb-16 text-slate-400">Selected work and products.</p>
            {data.projects.length ? renderCards(data.projects, "project") : <p className="text-slate-400">Projects will be added here.</p>}</div>
        </section>

        {data.research.length > 0 && <section id="research" className="px-6 py-28">
          <div className="mx-auto max-w-6xl text-center"><h2 className="mb-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">Research & Insights</h2>
            <p className="mb-16 text-slate-400">Research notes and areas of interest.</p>{renderCards(data.research, "research")}</div>
        </section>}

        <section id="contact" className="px-6 py-28">
          <div className="mx-auto max-w-5xl text-center"><h2 className="mb-6 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">Let's Build The Future Together</h2>
            <p className="mb-12 text-lg leading-8 text-slate-300">For professional opportunities, collaborations and product discussions.</p>
            <div className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-10 text-left shadow-2xl backdrop-blur-xl md:grid-cols-3">
              {data.contact.email && <div><p className="mb-2 text-sm text-slate-400">Email</p><a className="break-all text-cyan-300 hover:underline" href={`mailto:${data.contact.email}`}>{data.contact.email}</a></div>}
              {data.contact.phone && <div><p className="mb-2 text-sm text-slate-400">Phone</p><a className="text-cyan-300 hover:underline" href={`tel:${data.contact.phone}`}>{data.contact.phone}</a></div>}
              {data.contact.location && <div><p className="mb-2 text-sm text-slate-400">Location</p><p className="text-cyan-300">{data.contact.location}</p></div>}
              {!data.contact.email && !data.contact.phone && !data.contact.location && <p className="text-slate-400 md:col-span-3">Contact details can be added securely from the Admin Dashboard.</p>}
            </div>
            <p className="mt-16 text-sm text-slate-500">© {new Date().getFullYear()} {data.name} · Founder & CEO, QySoul</p>
          </div>
        </section>
      </main>

      {loading && <div className="fixed bottom-4 left-4 z-30 rounded-lg bg-slate-900/90 px-4 py-2 text-xs text-cyan-300">Loading portfolio content…</div>}

      {loginOpen && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
        <form onSubmit={signIn} className="w-full max-w-md rounded-3xl border border-cyan-400/30 bg-slate-900 p-8 shadow-2xl">
          <h2 className="mb-2 text-2xl font-bold text-cyan-300">Admin Login</h2><p className="mb-6 text-sm text-slate-400">Sign in with the admin account created in Supabase.</p>
          <label className="mb-2 block text-sm text-slate-300">Email</label><input className={`${inputClass} mb-4`} type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} />
          <label className="mb-2 block text-sm text-slate-300">Password</label><input className={`${inputClass} mb-4`} type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} />
          {loginError && <p className="mb-4 text-sm text-rose-400">{loginError}</p>}
          <div className="flex gap-3"><button disabled={busy} className="flex-1 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 px-5 py-3 font-semibold text-black disabled:opacity-50">{busy ? "Signing in…" : "Login"}</button><button type="button" onClick={() => setLoginOpen(false)} className="rounded-xl border border-white/20 px-5 py-3">Cancel</button></div>
        </form>
      </div>}

      {dashboardOpen && session && <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/95 p-4 backdrop-blur-xl md:p-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm text-cyan-400">PRIVATE CONTROL PANEL</p><h2 className="text-3xl font-bold">Portfolio Admin</h2></div><div className="flex gap-3"><button onClick={logout} className="flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2"><FaSignOutAlt /> Logout</button><button onClick={() => setDashboardOpen(false)} className="rounded-xl border border-white/20 px-4 py-2">Close</button></div></div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6"><label className={labelClass}>Display name</label><input className={inputClass} value={data.name} onChange={e => update("name", e.target.value)} />
              <label className={`${labelClass} mt-5`}>Headline / roles</label><input className={inputClass} value={data.headline} onChange={e => update("headline", e.target.value)} />
              <label className={`${labelClass} mt-5`}>About</label><textarea rows={7} className={inputClass} value={data.about} onChange={e => update("about", e.target.value)} />
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="mb-4 text-lg font-semibold text-cyan-300">Profile & CV</h3>
              <label className={labelClass}>Profile photo</label><input type="file" accept="image/*" className="mb-5 block w-full text-sm text-slate-300" onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0], "avatar")} />
              <label className={labelClass}>CV / Resume (PDF)</label><input type="file" accept="application/pdf" className="mb-4 block w-full text-sm text-slate-300" onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0], "cv")} />
              {data.avatarUrl && <p className="mb-2 break-all text-xs text-slate-400">Photo URL saved</p>}{data.cvUrl && <p className="break-all text-xs text-slate-400">CV URL saved</p>}
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6"><label className={labelClass}>Skills (JSON list)</label><textarea rows={10} className={`${inputClass} font-mono text-xs`} value={skillsText} onChange={e => setSkillsText(e.target.value)} placeholder={'[{"title":"React","desc":"Frontend development"}]'} /></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6"><label className={labelClass}>Projects (JSON list)</label><textarea rows={10} className={`${inputClass} font-mono text-xs`} value={projectsText} onChange={e => setProjectsText(e.target.value)} /></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6"><label className={labelClass}>Research (JSON list)</label><textarea rows={10} className={`${inputClass} font-mono text-xs`} value={researchText} onChange={e => setResearchText(e.target.value)} /></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6"><label className={labelClass}>Currently Exploring (JSON list)</label><textarea rows={10} className={`${inputClass} font-mono text-xs`} value={exploringText} onChange={e => setExploringText(e.target.value)} /></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:col-span-2"><h3 className="mb-4 text-lg font-semibold text-cyan-300">Contact details</h3><div className="grid gap-4 md:grid-cols-3">
              <div><label className={labelClass}>Email</label><input className={inputClass} value={data.contact.email} onChange={e => update("contact", { ...data.contact, email: e.target.value })} /></div>
              <div><label className={labelClass}>Phone</label><input className={inputClass} value={data.contact.phone} onChange={e => update("contact", { ...data.contact, phone: e.target.value })} /></div>
              <div><label className={labelClass}>Location</label><input className={inputClass} value={data.contact.location} onChange={e => update("contact", { ...data.contact, location: e.target.value })} /></div>
            </div></div>
          </div>
          {notice && <p className={`my-5 text-sm ${notice.startsWith("Saved") ? "text-emerald-400" : "text-amber-300"}`}>{notice}</p>}
          <div className="sticky bottom-0 mt-6 flex justify-end border-t border-white/10 bg-slate-950/90 py-5 backdrop-blur"><button onClick={save} disabled={busy} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 px-7 py-3 font-bold text-black disabled:opacity-50"><FaSave /> {busy ? "Working…" : "Save Changes"}</button></div>
          <p className="pb-8 text-xs text-slate-500">For skills, projects, research and exploring, each list item uses {"{ title, desc, status?, url? }"}. Keep JSON valid. Only your authorized Supabase admin account can save changes.</p>
        </div>
      </div>}
    </div>
  );
}

export default App;
