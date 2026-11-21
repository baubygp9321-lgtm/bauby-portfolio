import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { FaArrowUp } from "react-icons/fa";
import { useScrolled } from "../hooks/useScrolled";

export function BackToTop() {
  const visible = useScrolled(700);
  const reduceMotion = useReducedMotion();
  return (
    <AnimatePresence>
      {visible && (
        <m.button
          type="button"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          onClick={() => {
            window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
            document.getElementById("main")?.focus({ preventScroll: true });
          }}
          aria-label="Back to top"
          className="fixed z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-brand text-on-accent shadow-lg shadow-cyan-500/30 transition hover:brightness-110 active:scale-95"
          style={{
            right: "max(1rem, env(safe-area-inset-right, 0px))",
            bottom: "calc(1rem + env(safe-area-inset-bottom, 0px))",
          }}
        >
          <FaArrowUp aria-hidden />
        </m.button>
      )}
    </AnimatePresence>
  );
}
