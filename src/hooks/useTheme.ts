import { useCallback, useEffect, useState } from "react";

export type Theme = "dark" | "light";

const THEME_COLOR: Record<Theme, string> = { dark: "#05060f", light: "#f4f7fd" };

/** Class-based theme (`.dark` / `.light` on <html>), persisted in localStorage. Dark is the brand default. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.classList.contains("light") ? "light" : "dark",
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme === "light");
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[theme]);
    try {
      localStorage.setItem("theme", theme);
    } catch {
      /* storage unavailable (private mode) — theme still applies for this visit */
    }
  }, [theme]);

  const toggle = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);
  return { theme, toggle };
}
