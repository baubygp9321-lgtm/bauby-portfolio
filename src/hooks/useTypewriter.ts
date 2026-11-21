import { useEffect, useState } from "react";

/**
 * Cycles through `words`, typing and deleting them. When `enabled` is false (reduced motion)
 * it simply returns the first word — no timers run.
 */
export function useTypewriter(words: string[], enabled: boolean) {
  const [text, setText] = useState("");
  const key = words.join("\u0000");

  useEffect(() => {
    if (!enabled) return;
    const list = key.split("\u0000").filter(Boolean);
    if (!list.length) return;

    let word = 0;
    let chars = 0;
    let deleting = false;
    let timer = 0;

    const tick = () => {
      const current = list[word % list.length];
      if (!deleting) {
        chars += 1;
        setText(current.slice(0, chars));
        if (chars >= current.length) {
          deleting = true;
          timer = window.setTimeout(tick, 1700);
          return;
        }
        timer = window.setTimeout(tick, 75);
      } else {
        chars -= 1;
        setText(current.slice(0, chars));
        if (chars <= 0) {
          deleting = false;
          word += 1;
          timer = window.setTimeout(tick, 350);
          return;
        }
        timer = window.setTimeout(tick, 35);
      }
    };
    timer = window.setTimeout(tick, 500);
    return () => window.clearTimeout(timer);
  }, [key, enabled]);

  return enabled ? text : (words[0] ?? "");
}
