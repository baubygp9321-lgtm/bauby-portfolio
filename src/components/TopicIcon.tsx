import { createElement } from "react";
import { topicIcon } from "../lib/icons";

/** Renders the icon matching a topic title (stable component, safe for hooks lint rules). */
export function TopicIcon({ title }: { title: string }) {
  return createElement(topicIcon(title));
}
