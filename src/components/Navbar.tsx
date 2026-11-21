import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { FaBars, FaLock, FaMoon, FaSun, FaTimes, FaUserShield } from "react-icons/fa";
import type { Theme } from "../hooks/useTheme";
import { useScrolled } from "../hooks/useScrolled";

export type NavItem = { id: string; label: string };

type Props = {
  name: string;
  items: NavItem[];
  active: string;
  theme: Theme;
  onToggleTheme: () => void;
  onAdmin: () => void;
  signedIn: boolean;
};

const iconBtn =
  "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-fg transition hover:border-accent/60 hover:text-accent active:scale-95";

export function Navbar({ name, items, active, theme, onToggleTheme, onAdmin, signedIn }: Props) {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled(12);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close on Escape (returning focus to the toggle) and when resizing up to desktop.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const mq = window.matchMedia("(min-width: 1024px)");
    const onMq = () => mq.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    menuRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open]);

  const adminLabel = signedIn ? "Open admin dashboard" : "Admin login";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled || open ? "border-line bg-nav shadow-lg shadow-black/10 backdrop-blur-xl" : "border-transparent bg-transparent"
      }`}
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 sm:h-[4.5rem]"
        style={{
          paddingLeft: "max(1rem, env(safe-area-inset-left, 0px))",
          paddingRight: "max(1rem, env(safe-area-inset-right, 0px))",
        }}
      >
        <a href="#hero" className="min-w-0 truncate text-xl font-extrabold tracking-tight sm:text-2xl" onClick={() => setOpen(false)}>
          <span className="text-gradient">{name}</span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {items.map((item) => {
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative rounded-full px-3 py-2 text-sm font-medium transition-colors xl:px-4 ${
                    isActive ? "text-accent" : "text-muted hover:text-fg"
                  }`}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-3 -bottom-0.5 h-0.5 origin-center rounded-full bg-gradient-brand transition-transform duration-300 xl:inset-x-4 ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            className={iconBtn}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            title={theme === "dark" ? "Light theme" : "Dark theme"}
          >
            {theme === "dark" ? <FaSun className="text-yellow-300" aria-hidden /> : <FaMoon aria-hidden />}
          </button>

          {/* Admin: icon on phones, labelled pill from sm upwards — always reachable. */}
          <button
            type="button"
            onClick={onAdmin}
            aria-label={adminLabel}
            title={adminLabel}
            className="inline-flex h-11 min-w-11 shrink-0 items-center justify-center gap-2 rounded-full border border-accent/50 px-3 text-sm font-semibold text-accent transition hover:bg-accent/10 active:scale-95 sm:px-4"
          >
            {signedIn ? <FaUserShield aria-hidden /> : <FaLock aria-hidden />}
            <span className="hidden sm:inline">Admin</span>
          </button>

          <button
            ref={toggleRef}
            type="button"
            className={`${iconBtn} lg:hidden`}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <FaTimes aria-hidden /> : <FaBars aria-hidden />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            ref={menuRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden lg:hidden"
          >
            <ul className="mx-auto grid grid-cols-1 max-h-[calc(100svh-5rem)] w-full max-w-7xl gap-1 overflow-y-auto px-4 pb-5 pt-1 sm:grid-cols-2 sm:px-6">
              {items.map((item) => {
                const isActive = active === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={() => setOpen(false)}
                      aria-current={isActive ? "true" : undefined}
                      className={`flex min-h-12 items-center rounded-2xl px-4 text-base font-medium transition ${
                        isActive ? "bg-accent/10 text-accent" : "text-fg hover:bg-surface"
                      }`}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
