import { lazy, Suspense, useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { Theme } from "../hooks/useTheme";

const ParticlesLayer = lazy(() => import("./ParticlesLayer"));

/**
 * Decorative page background: brand gradient, two glow blobs and the particle field.
 *
 * ROOT-CAUSE FIX for the mobile "white area on the right": the glow blobs used to be
 * `absolute -right-40 w-[500px]` with no positioned ancestor, so their containing block was
 * the initial containing block and `overflow-hidden` on a non-positioned wrapper never clipped
 * them — the document became 160px wider than the viewport at every width. Here the blobs live
 * inside a `fixed inset-0 overflow-hidden` layer, which *is* their containing block, so they
 * are clipped to the viewport and cannot affect document width.
 */
export function Background({ theme }: { theme: Theme }) {
  const reduceMotion = useReducedMotion();
  const [showParticles, setShowParticles] = useState(false);

  // Defer the particle engine until the browser is idle so it never competes with first paint.
  useEffect(() => {
    if (reduceMotion) return;
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setShowParticles(true), { timeout: 2000 });
      return () => (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(() => setShowParticles(true), 800);
    return () => window.clearTimeout(t);
  }, [reduceMotion]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden" style={{ background: "var(--bg-grad)" }}>
      <div
        className="animate-float-glow absolute -left-[12vmax] -top-[12vmax] h-[38vmax] w-[38vmax] rounded-full blur-[110px]"
        style={{ background: "var(--glow-1)" }}
      />
      <div
        className="animate-float-glow absolute -bottom-[12vmax] -right-[12vmax] h-[38vmax] w-[38vmax] rounded-full blur-[110px] [animation-delay:-4s]"
        style={{ background: "var(--glow-2)" }}
      />
      {showParticles && !reduceMotion && (
        <Suspense fallback={null}>
          <ParticlesLayer theme={theme} />
        </Suspense>
      )}
    </div>
  );
}
