import { useId, useState, type FormEvent } from "react";
import { FaCheck, FaCopy, FaEnvelope, FaExternalLinkAlt, FaMapMarkerAlt, FaPaperPlane, FaPhoneAlt } from "react-icons/fa";
import type { PortfolioData } from "../lib/portfolio";
import { QYSOUL_URL, telHref } from "../lib/portfolio";
import { cardBase, Reveal, Section } from "./ui";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

const inputCls =
  "w-full rounded-2xl border border-line bg-surface-2/60 px-4 py-3 text-base text-fg placeholder:text-subtle outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30 aria-[invalid=true]:border-rose-400";

/**
 * The site has no mail-sending backend, so the form does NOT send anything by itself.
 * It validates the input and opens the visitor's email app with the message pre-filled,
 * and says so plainly in the UI.
 */
export function Contact({ data }: { data: PortfolioData }) {
  const { email, phone, location } = data.contact;
  const uid = useId();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"" | "opened">("");
  const [copied, setCopied] = useState(false);

  const validate = (): Errors => {
    const e: Errors = {};
    if (form.name.trim().length < 2) e.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "Please enter a valid email address.";
    if (form.message.trim().length < 10) e.message = "Please write a message of at least 10 characters.";
    return e;
  };

  const onSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      const first = Object.keys(e)[0];
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    const subject = `Portfolio enquiry from ${form.name.trim()}`;
    const body = `${form.message.trim()}\n\n— ${form.name.trim()} (${form.email.trim()})`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus("opened");
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the address is visible to copy manually */
    }
  };

  const field = (key: "name" | "email" | "message", label: string, props: Record<string, unknown>, multiline = false) => {
    const id = `${uid}-${key}`;
    const errId = `${id}-error`;
    const common = {
      id,
      name: key,
      value: form[key],
      "aria-invalid": errors[key] ? true : undefined,
      "aria-describedby": errors[key] ? errId : undefined,
      onChange: (e: { target: { value: string } }) => {
        setForm((f) => ({ ...f, [key]: e.target.value }));
        if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
      },
      className: inputCls,
      ...props,
    };
    return (
      <div>
        <label htmlFor={id} className="mb-2 block text-sm font-semibold text-fg">
          {label}
        </label>
        {multiline ? <textarea rows={5} {...common} /> : <input {...common} />}
        {errors[key] && (
          <p id={errId} className="mt-1.5 text-sm text-rose-500 dark:text-rose-400">
            {errors[key]}
          </p>
        )}
      </div>
    );
  };

  const info = [
    email && { icon: FaEnvelope, label: "Email", value: email, href: `mailto:${email}` },
    phone && { icon: FaPhoneAlt, label: "Phone", value: phone, href: telHref(phone) },
    location && { icon: FaMapMarkerAlt, label: "Location", value: location },
  ].filter(Boolean) as { icon: typeof FaEnvelope; label: string; value: string; href?: string }[];

  return (
    <Section
      id="contact"
      eyebrow="Get in touch"
      title="Let’s Build The Future Together"
      intro="Open to AI research collaborations, deep tech innovation, startup partnerships, and building intelligent systems that matter."
    >
      {/* Blank contact fields are hidden; without an email there is no form, so the info column centres. */}
      <div className={`grid grid-cols-1 gap-6 lg:gap-8 ${email ? "lg:grid-cols-[0.85fr_1.15fr]" : "mx-auto max-w-xl"}`}>
        <Reveal className="grid grid-cols-1 content-start gap-4">
          {info.length === 0 && (
            <a
              href={QYSOUL_URL}
              target="_blank"
              rel="noreferrer"
              className={`${cardBase} flex items-center justify-between gap-4 p-5 font-semibold text-fg hover:text-accent`}
            >
              Connect through QySoul <FaExternalLinkAlt aria-hidden className="shrink-0 text-accent" />
            </a>
          )}
          {info.map(({ icon: Icon, label, value, href }) => (
            <div key={label} className={`${cardBase} flex items-center gap-4 p-5`}>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-lg text-accent" aria-hidden="true">
                <Icon />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-subtle">{label}</p>
                {href ? (
                  <a href={href} className="font-semibold text-fg [overflow-wrap:anywhere] underline-offset-4 hover:text-accent hover:underline">
                    {value}
                  </a>
                ) : (
                  <p className="font-semibold text-fg">{value}</p>
                )}
              </div>
              {label === "Email" && (
                <button
                  type="button"
                  onClick={copyEmail}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-muted transition hover:border-accent/60 hover:text-accent"
                  aria-label={copied ? "Email address copied" : "Copy email address"}
                  title="Copy email"
                >
                  {copied ? <FaCheck aria-hidden className="text-emerald-500" /> : <FaCopy aria-hidden />}
                </button>
              )}
            </div>
          ))}
        </Reveal>

        {email && (
          <Reveal delay={0.1}>
            <form noValidate onSubmit={onSubmit} className={`${cardBase} grid grid-cols-1 gap-5 p-5 sm:p-8`} aria-describedby={`${uid}-note`}>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {field("name", "Your name", { type: "text", autoComplete: "name", placeholder: "Jane Doe" })}
                {field("email", "Your email", { type: "email", autoComplete: "email", inputMode: "email", placeholder: "you@example.com" })}
              </div>
              {field("message", "Message", { placeholder: "Tell me about your project, idea or opportunity…" }, true)}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p id={`${uid}-note`} className="text-xs leading-5 text-subtle">
                  This opens your email app with the message ready to send. Nothing is sent until you press Send there.
                </p>
                <button
                  type="submit"
                  className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-brand px-7 font-semibold text-on-accent shadow-lg shadow-cyan-500/20 transition hover:brightness-110 active:scale-[0.98]"
                >
                  <FaPaperPlane aria-hidden /> Compose email
                </button>
              </div>
              <p role="status" aria-live="polite" className="text-sm text-emerald-600 empty:hidden dark:text-emerald-300">
                {status === "opened" &&
                  `Your email app should now be open with the message filled in — press Send there. If nothing opened, email ${email} directly.`}
              </p>
            </form>
          </Reveal>
        )}
      </div>
    </Section>
  );
}
