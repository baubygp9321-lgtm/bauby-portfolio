import { useId, useState, type FormEvent } from "react";
import { FaLock, FaTimes } from "react-icons/fa";
import { supabase } from "../lib/supabase";
import { useDialog } from "./useDialog";
import { btnGhost, btnPrimary, inputCls, labelCls } from "./styles";

export function AdminLogin({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const ref = useDialog<HTMLDivElement>(onClose);
  const uid = useId();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const signIn = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError("");
    const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (authError) {
      setError("Login failed. Please check your email and password.");
    } else {
      setPassword("");
      onSuccess();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-0 backdrop-blur-md sm:items-center sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${uid}-title`}
        className="w-full max-w-md rounded-t-3xl border border-accent/30 bg-surface-2 p-6 shadow-2xl sm:rounded-3xl sm:p-8"
        style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom, 0px))" }}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 id={`${uid}-title`} className="flex items-center gap-2 text-2xl font-bold text-accent">
              <FaLock aria-hidden className="text-lg" /> Admin Login
            </h2>
            <p className="mt-1 text-sm text-subtle">Sign in with the admin account created in Supabase.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className={`${btnGhost} h-11 w-11 shrink-0 px-0`}>
            <FaTimes aria-hidden />
          </button>
        </div>

        {!supabase ? (
          <p role="alert" className="rounded-2xl border border-amber-400/40 bg-amber-400/10 p-4 text-sm leading-6 text-amber-700 dark:text-amber-200">
            Admin is not available in this build: <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> are not set.
            Add them to a local <code>.env</code> file or to the Vercel project environment.
          </p>
        ) : (
          <form onSubmit={signIn} className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor={`${uid}-email`} className={labelCls}>
                Email
              </label>
              <input
                id={`${uid}-email`}
                data-autofocus
                className={inputCls}
                type="email"
                inputMode="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor={`${uid}-password`} className={labelCls}>
                Password
              </label>
              <input
                id={`${uid}-password`}
                className={inputCls}
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <p role="alert" className="text-sm text-rose-500 dark:text-rose-400">
                {error}
              </p>
            )}
            <div className="mt-2 flex gap-3">
              <button disabled={busy} className={`${btnPrimary} flex-1`}>
                {busy ? "Signing in…" : "Login"}
              </button>
              <button type="button" onClick={onClose} className={btnGhost}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
