import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import type { Theme } from "../hooks/useTheme";

/*
 * ROOT-CAUSE FIX for "t.checkVersion is not a function":
 * the old code rendered `react-tsparticles@2` (which creates a v2 `tsparticles-engine`) and
 * passed that engine to `loadFull` from `tsparticles@3`, which calls the v3-only
 * `engine.checkVersion()`. Everything now comes from the single v3 engine:
 * `@tsparticles/react@3` + `@tsparticles/engine@3` + `@tsparticles/slim@3`.
 */

// The engine is global; initialise it once even if this component remounts.
let enginePromise: Promise<void> | null = null;

export default function ParticlesLayer({ theme }: { theme: Theme }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    enginePromise ??= initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    });
    enginePromise
      .then(() => alive && setReady(true))
      .catch((err) => console.error("[particles] failed to initialise", err));
    return () => {
      alive = false;
    };
  }, []);

  const options = useMemo<ISourceOptions>(() => {
    const small = window.matchMedia("(max-width: 767px)").matches;
    const dark = theme === "dark";
    return {
      fullScreen: { enable: false },
      background: { color: { value: "transparent" } },
      fpsLimit: 60,
      detectRetina: true,
      pauseOnBlur: true,
      pauseOnOutsideViewport: true,
      interactivity: { events: { resize: { enable: true } } },
      particles: {
        number: { value: small ? 32 : 70, density: { enable: true } },
        color: { value: dark ? "#00ffff" : "#0891b2" },
        size: { value: { min: 1, max: 2.2 } },
        opacity: { value: dark ? 0.7 : 0.45 },
        move: { enable: true, speed: small ? 0.5 : 0.7, outModes: { default: "out" } },
        links: {
          enable: true,
          color: dark ? "#8b5cf6" : "#7c3aed",
          opacity: dark ? 0.2 : 0.15,
          distance: small ? 110 : 140,
        },
      },
    };
  }, [theme]);

  if (!ready) return null;
  return <Particles id="tsparticles" className="absolute inset-0 h-full w-full" options={options} />;
}
