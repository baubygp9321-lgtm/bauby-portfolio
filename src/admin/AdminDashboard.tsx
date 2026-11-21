import { useId, useMemo, useState, type ReactNode } from "react";
import { FaExternalLinkAlt, FaFilePdf, FaPlus, FaSave, FaSignOutAlt, FaTimes, FaTrash, FaUndo, FaUpload } from "react-icons/fa";
import {
  FALLBACK,
  normalizePortfolio,
  resolvePortfolio,
  validatePortfolio,
  type CardItem,
  type ListKey,
  type PortfolioData,
  type Sources,
} from "../lib/portfolio";
import { CONTENT_ROW_ID, CONTENT_TABLE, supabase } from "../lib/supabase";
import { ListEditor, type FieldDef } from "./ListEditor";
import { btnDanger, btnGhost, btnPrimary, hintCls, inputCls, labelCls, panelCls } from "./styles";
import { uploadAsset, type UploadKind } from "./upload";
import { useDialog } from "./useDialog";

type Props = {
  data: PortfolioData;
  sources: Sources;
  raw: Record<string, unknown>;
  userEmail?: string;
  onSaved: (raw: Record<string, unknown>) => void;
  onClose: () => void;
  onLogout: () => void;
};

type TabId = "profile" | "contact" | ListKey | "advanced";

const base: FieldDef[] = [
  { key: "title", label: "Title" },
  { key: "desc", label: "Description" },
];
const LIST_TABS: { id: ListKey; label: string; item: string; fields: FieldDef[] }[] = [
  {
    id: "projects",
    label: "Projects",
    item: "Project",
    fields: [
      ...base,
      { key: "status", label: "Status", placeholder: "Live, Currently Building…" },
      { key: "tags", label: "Technologies", placeholder: "React, Node.js, MongoDB", hint: "Comma-separated." },
      { key: "url", label: "Live demo URL", placeholder: "https://…" },
      { key: "repo", label: "Source code URL", placeholder: "https://github.com/…" },
      { key: "image", label: "Screenshot URL", placeholder: "https://… or upload", hint: "Optional. 16:9 works best." },
    ],
  },
  {
    id: "skills",
    label: "Skills",
    item: "Skill",
    fields: [...base, { key: "tags", label: "Technologies", placeholder: "React, Java…", hint: "Comma-separated. Optional." }],
  },
  {
    id: "journey",
    label: "Journey",
    item: "Timeline entry",
    fields: [...base, { key: "status", label: "Organisation / category", placeholder: "QySoul, Education…" }, { key: "url", label: "Link", placeholder: "https://…" }],
  },
  { id: "research", label: "Research", item: "Research topic", fields: [...base, { key: "url", label: "Article link", placeholder: "https://…", hint: "Optional — shows a “Read research” link." }] },
  { id: "exploring", label: "Exploring", item: "Topic", fields: [...base] },
];

const TABS: { id: TabId; label: string }[] = [
  { id: "profile", label: "Profile" },
  { id: "contact", label: "Contact & links" },
  ...LIST_TABS.map((t) => ({ id: t.id as TabId, label: t.label })),
  { id: "advanced", label: "Advanced (JSON)" },
];

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

export default function AdminDashboard({ data, sources, raw, userEmail, onSaved, onClose, onLogout }: Props) {
  const uid = useId();
  const [draft, setDraft] = useState<PortfolioData>(data);
  const [baseline, setBaseline] = useState(() => JSON.stringify(normalizePortfolio(data)));
  const [tab, setTab] = useState<TabId>("profile");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [confirmClose, setConfirmClose] = useState(false);
  const [jsonText, setJsonText] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [savedSources, setSavedSources] = useState(sources);

  const dirty = useMemo(() => JSON.stringify(normalizePortfolio(draft)) !== baseline, [draft, baseline]);
  const hasDefaults = (Object.keys(savedSources) as (keyof PortfolioData)[]).some(
    (k) => savedSources[k] === "default" && !["avatarUrl", "cvUrl", "socials"].includes(k),
  );
  const requestClose = () => (dirty ? setConfirmClose(true) : onClose());
  const ref = useDialog<HTMLDivElement>(requestClose);

  const set = <K extends keyof PortfolioData>(key: K, value: PortfolioData[K]) => setDraft((d) => ({ ...d, [key]: value }));

  const save = async () => {
    if (!supabase) return;
    const next = normalizePortfolio(draft);
    const problems = validatePortfolio(next);
    setErrors(problems);
    if (problems.length) {
      setNotice(`Fix ${problems.length} problem${problems.length > 1 ? "s" : ""} before saving.`);
      return;
    }
    setBusy(true);
    setNotice("");
    // Keep any keys in the stored row that this version does not know about.
    const payload = { ...raw, ...next };
    const { data: rows, error } = await supabase
      .from(CONTENT_TABLE)
      .update({ data: payload, updated_at: new Date().toISOString() })
      .eq("id", CONTENT_ROW_ID)
      .select("id");
    setBusy(false);
    if (error) {
      setNotice("Save failed. Check your admin access and Supabase setup.");
      return;
    }
    if (!rows?.length) {
      setNotice("Nothing was saved: no row was updated (row missing or this account lacks update permission).");
      return;
    }
    setDraft(next);
    setBaseline(JSON.stringify(next));
    setSavedSources(resolvePortfolio(payload).sources);
    onSaved(payload);
    setNotice("Saved! Public portfolio is updated.");
  };

  const discard = () => {
    setDraft(JSON.parse(baseline) as PortfolioData);
    setErrors([]);
    setNotice("Changes discarded.");
  };

  const upload = async (file: File | undefined, kind: UploadKind) => {
    if (!file) return;
    setBusy(true);
    setNotice("");
    try {
      const url = await uploadAsset(file, kind);
      set(kind === "avatar" ? "avatarUrl" : "cvUrl", url);
      setNotice(`${kind === "avatar" ? "Photo" : "CV"} uploaded. Click Save Changes to publish it.`);
    } catch (err) {
      setNotice((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const addMissingDefaults = (key: ListKey) => {
    const have = new Set(draft[key].map((i) => i.title.trim().toLowerCase()));
    const missing = FALLBACK[key].filter((i) => !have.has(i.title.toLowerCase()));
    set(key, [...draft[key], ...missing] as CardItem[]);
    setNotice(missing.length ? `Added ${missing.length} default item(s). Review, then Save.` : "All default items are already present.");
  };

  const openAdvanced = () => {
    setJsonText(JSON.stringify(normalizePortfolio(draft), null, 2));
    setJsonError("");
    setTab("advanced");
  };

  const applyJson = () => {
    try {
      const parsed: unknown = JSON.parse(jsonText);
      if (!isObj(parsed)) throw new Error("Top level must be an object.");
      setDraft(resolvePortfolio(parsed).data);
      setJsonError("");
      setNotice("JSON applied to the draft. Review, then Save.");
    } catch (e) {
      setJsonError(e instanceof SyntaxError ? `Invalid JSON: ${e.message}` : (e as Error).message);
    }
  };

  const DefaultBadge = ({ k }: { k: keyof PortfolioData }) =>
    savedSources[k] === "default" ? (
      <p className="mb-4 rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-xs leading-5 text-amber-700 dark:text-amber-200">
        Showing built-in default content — it is not stored in the database yet. Saving will store it.
      </p>
    ) : null;

  const field = (id: string, label: string, input: ReactNode, hint?: string) => (
    <div>
      <label htmlFor={`${uid}-${id}`} className={labelCls}>
        {label}
      </label>
      {input}
      {hint && <p className={hintCls}>{hint}</p>}
    </div>
  );

  const listTab = LIST_TABS.find((t) => t.id === tab);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${uid}-title`}
      className="fixed inset-0 z-[100] flex flex-col bg-bg text-fg"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      {/* Header */}
      <div className="border-b border-line bg-nav backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Private control panel</p>
            <h2 id={`${uid}-title`} className="text-xl font-bold sm:text-2xl">
              Portfolio Admin
            </h2>
            {userEmail && <p className="truncate text-xs text-subtle">Signed in as {userEmail}</p>}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={onLogout} className={btnGhost}>
              <FaSignOutAlt aria-hidden /> <span className="hidden sm:inline">Logout</span>
              <span className="sr-only sm:hidden">Logout</span>
            </button>
            <button type="button" onClick={requestClose} className={btnGhost} aria-label="Close dashboard">
              <FaTimes aria-hidden /> <span className="hidden sm:inline">Close</span>
            </button>
          </div>
        </div>
        {confirmClose && (
          <div role="alert" className="border-t border-amber-400/40 bg-amber-400/10">
            <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
              <p className="text-sm text-amber-800 dark:text-amber-100">You have unsaved changes. Close without saving?</p>
              <div className="flex gap-2">
                <button type="button" className={btnDanger} onClick={onClose}>
                  Discard & close
                </button>
                <button type="button" className={btnGhost} onClick={() => setConfirmClose(false)} data-autofocus>
                  Keep editing
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col md:flex-row">
        {/* Tabs: horizontal scroller on phones, sidebar from md */}
        <nav aria-label="Dashboard sections" className="shrink-0 border-b border-line md:w-56 md:border-b-0 md:border-r md:py-6">
          <ul className="flex gap-1 overflow-x-auto px-3 py-2 md:flex-col md:overflow-visible md:px-3 md:py-0" role="tablist">
            {TABS.map((t) => (
              <li key={t.id} className="shrink-0" role="presentation">
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={(e) => {
                    e.currentTarget.scrollIntoView({ block: "nearest", inline: "nearest" });
                    if (t.id === "advanced") openAdvanced();
                    else setTab(t.id);
                  }}
                  className={`min-h-11 w-full whitespace-nowrap rounded-xl px-4 text-left text-sm font-medium transition ${
                    tab === t.id ? "bg-accent/15 text-accent" : "text-muted hover:bg-surface hover:text-fg"
                  }`}
                >
                  {t.label}
                  {savedSources[t.id as keyof PortfolioData] === "default" && (
                    <span className="ml-2 inline-block h-2 w-2 rounded-full bg-amber-400 align-middle" title="Using built-in defaults" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Panel */}
        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6" role="tabpanel">
          {tab === "profile" && (
            <div className="grid grid-cols-1 gap-6">
              <div className={`${panelCls} grid grid-cols-1 gap-5`}>
                {field("name", "Display name", <input id={`${uid}-name`} className={inputCls} value={draft.name} onChange={(e) => set("name", e.target.value)} />)}
                {field(
                  "headline",
                  "Headline",
                  <input id={`${uid}-headline`} className={inputCls} value={draft.headline} onChange={(e) => set("headline", e.target.value)} />,
                  "Shown in the hero badge, About card and footer.",
                )}
                {field(
                  "roles",
                  "Typing roles",
                  <textarea
                    id={`${uid}-roles`}
                    rows={5}
                    className={inputCls}
                    value={draft.roles.join("\n")}
                    onChange={(e) => set("roles", e.target.value.split("\n"))}
                  />,
                  "One role per line — these are typed out in the hero.",
                )}
                {field("tagline", "Hero introduction", <textarea id={`${uid}-tagline`} rows={2} className={inputCls} value={draft.tagline} onChange={(e) => set("tagline", e.target.value)} />)}
                {field(
                  "about",
                  "About",
                  <textarea id={`${uid}-about`} rows={10} className={inputCls} value={draft.about} onChange={(e) => set("about", e.target.value)} />,
                  "Leave an empty line between paragraphs.",
                )}
              </div>

              <div className={`${panelCls} grid grid-cols-1 gap-6 sm:grid-cols-2`}>
                <div className="min-w-0">
                  <p className={labelCls}>Profile photo</p>
                  <div className="flex items-center gap-4">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line bg-surface-2 text-xs text-subtle">
                      {draft.avatarUrl ? <img src={draft.avatarUrl} alt="Current profile photo" className="h-full w-full object-cover" /> : "None"}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <label className={`${btnGhost} cursor-pointer`}>
                        <FaUpload aria-hidden /> Upload
                        <input type="file" accept="image/*" className="sr-only" disabled={busy} onChange={(e) => { void upload(e.target.files?.[0], "avatar"); e.target.value = ""; }} />
                      </label>
                      {draft.avatarUrl && (
                        <button type="button" className={btnDanger} onClick={() => set("avatarUrl", "")}>
                          <FaTrash aria-hidden /> Remove
                        </button>
                      )}
                    </div>
                  </div>
                  <p className={hintCls}>JPG/PNG/WebP, up to 5 MB. Without a photo the site shows your initials.</p>
                </div>
                <div className="min-w-0">
                  <p className={labelCls}>CV / Resume (PDF)</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <label className={`${btnGhost} cursor-pointer`}>
                      <FaUpload aria-hidden /> Upload PDF
                      <input type="file" accept="application/pdf" className="sr-only" disabled={busy} onChange={(e) => { void upload(e.target.files?.[0], "cv"); e.target.value = ""; }} />
                    </label>
                    {draft.cvUrl && (
                      <>
                        <a href={draft.cvUrl} target="_blank" rel="noreferrer" className={btnGhost}>
                          <FaFilePdf aria-hidden /> View <FaExternalLinkAlt aria-hidden className="text-xs" />
                        </a>
                        <button type="button" className={btnDanger} onClick={() => set("cvUrl", "")}>
                          <FaTrash aria-hidden /> Remove
                        </button>
                      </>
                    )}
                  </div>
                  <p className={hintCls}>{draft.cvUrl ? "A “Download CV” button is shown in the hero." : "No CV — the download button is hidden."} Up to 10 MB.</p>
                </div>
              </div>
            </div>
          )}

          {tab === "contact" && (
            <div className="grid grid-cols-1 gap-6">
              <div className={panelCls}>
                <DefaultBadge k="contact" />
                <p className={`${hintCls} mb-4`}>Leave a field blank to hide it on the public site. Blank fields stay hidden — they are never refilled with defaults.</p>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  {(["email", "phone", "location"] as const).map((k) =>
                    field(
                      `contact-${k}`,
                      k[0].toUpperCase() + k.slice(1),
                      <input
                        key={k}
                        id={`${uid}-contact-${k}`}
                        className={inputCls}
                        type={k === "email" ? "email" : k === "phone" ? "tel" : "text"}
                        value={draft.contact[k]}
                        onChange={(e) => set("contact", { ...draft.contact, [k]: e.target.value })}
                      />,
                    ),
                  )}
                </div>
              </div>
              <div className={`${panelCls} grid grid-cols-1 gap-4`}>
                <div>
                  <p className="font-semibold">Social links</p>
                  <p className={hintCls}>GitHub, LinkedIn, X, Instagram, YouTube… Icons are picked automatically from the URL. Shown in the hero and footer.</p>
                </div>
                {draft.socials.map((s, i) => (
                  <div key={i} className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_2fr_auto] sm:items-end">
                    {field(`social-label-${i}`, "Label", <input id={`${uid}-social-label-${i}`} className={inputCls} value={s.label} placeholder="GitHub" onChange={(e) => set("socials", draft.socials.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} />)}
                    {field(`social-url-${i}`, "URL", <input id={`${uid}-social-url-${i}`} className={inputCls} inputMode="url" value={s.url} placeholder="https://github.com/…" onChange={(e) => set("socials", draft.socials.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))} />)}
                    <button type="button" className={`${btnDanger} sm:w-11 sm:px-0`} onClick={() => set("socials", draft.socials.filter((_, j) => j !== i))} aria-label={`Remove ${s.label || "link"}`}>
                      <FaTrash aria-hidden /> <span className="sm:sr-only">Remove</span>
                    </button>
                  </div>
                ))}
                <button type="button" className={`${btnGhost} justify-self-start`} onClick={() => set("socials", [...draft.socials, { label: "", url: "" }])}>
                  <FaPlus aria-hidden /> Add social link
                </button>
              </div>
            </div>
          )}

          {listTab && (
            <div>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-bold">{listTab.label}</h3>
                <button type="button" className={btnGhost} onClick={() => addMissingDefaults(listTab.id)}>
                  <FaPlus aria-hidden /> Add missing default items
                </button>
              </div>
              <DefaultBadge k={listTab.id} />
              <ListEditor
                key={listTab.id}
                itemLabel={listTab.item}
                items={draft[listTab.id]}
                fields={listTab.fields}
                onChange={(items) => set(listTab.id, items)}
                setNotice={setNotice}
              />
            </div>
          )}

          {tab === "advanced" && (
            <div className={`${panelCls} grid grid-cols-1 gap-4`}>
              <div>
                <p className="font-semibold">Edit all content as JSON</p>
                <p className={hintCls}>
                  For power users and backward compatibility. Lists use{" "}
                  <code>{"{ title, desc, status?, url?, repo?, tags?, image? }"}</code>. “Apply” only updates the draft — you still need to Save.
                </p>
              </div>
              <label htmlFor={`${uid}-json`} className="sr-only">
                Portfolio JSON
              </label>
              <textarea
                id={`${uid}-json`}
                rows={22}
                spellCheck={false}
                className={`${inputCls} font-mono text-xs leading-5`}
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                aria-invalid={jsonError ? true : undefined}
              />
              {jsonError && (
                <p role="alert" className="text-sm text-rose-500 dark:text-rose-400">
                  {jsonError}
                </p>
              )}
              <button type="button" className={`${btnGhost} justify-self-start`} onClick={applyJson}>
                Apply JSON to draft
              </button>
            </div>
          )}

          {errors.length > 0 && (
            <div role="alert" className="mt-6 rounded-2xl border border-rose-400/40 bg-rose-500/10 p-4 text-sm text-rose-700 dark:text-rose-200">
              <p className="font-semibold">Please fix before saving:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {errors.slice(0, 12).map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Save bar */}
      <div className="border-t border-line bg-nav backdrop-blur-xl" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <p role="status" aria-live="polite" className={`min-w-0 flex-1 text-sm ${notice.startsWith("Saved") ? "text-emerald-600 dark:text-emerald-400" : notice ? "text-amber-700 dark:text-amber-300" : "text-subtle"}`}>
            {notice || (dirty ? "Unsaved changes" : "No unsaved changes")}
          </p>
          <div className="flex gap-2">
            <button type="button" className={btnGhost} onClick={discard} disabled={!dirty || busy}>
              <FaUndo aria-hidden /> <span className="hidden sm:inline">Discard</span>
              <span className="sr-only sm:hidden">Discard changes</span>
            </button>
            <button type="button" onClick={save} disabled={busy || (!dirty && !hasDefaults)} className={btnPrimary}>
              <FaSave aria-hidden /> {busy ? "Working…" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
