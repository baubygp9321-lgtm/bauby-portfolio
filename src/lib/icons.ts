import type { IconType } from "react-icons";
import {
  FaAtom,
  FaBrain,
  FaCode,
  FaDna,
  FaEnvelope,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaJava,
  FaLayerGroup,
  FaLink,
  FaLinkedin,
  FaMicrochip,
  FaMobileAlt,
  FaNetworkWired,
  FaServer,
  FaShieldAlt,
  FaSquareRootAlt,
  FaTwitter,
  FaYoutube,
  FaLinux,
  FaRocket,
  FaFlask,
} from "react-icons/fa";
import { SiAndroid, SiExpress, SiMongodb, SiNodedotjs, SiReact, SiSpringboot, SiTypescript } from "react-icons/si";

const TOPIC_ICONS: [RegExp, IconType][] = [
  [/mern|full.?stack|web/i, FaLayerGroup],
  [/app|android|mobile/i, FaMobileAlt],
  [/quantum/i, FaAtom],
  [/\bai\b|artificial|machine|intelligen|crime/i, FaBrain],
  [/safety|security|secure/i, FaShieldAlt],
  [/system software|operating|compiler/i, FaMicrochip],
  [/system design|backend|server|devops/i, FaServer],
  [/linux/i, FaLinux],
  [/network/i, FaNetworkWired],
  [/math|science/i, FaSquareRootAlt],
  [/bio/i, FaDna],
  [/research/i, FaFlask],
  [/software|engineer|code/i, FaCode],
];

export function topicIcon(title: string): IconType {
  return TOPIC_ICONS.find(([re]) => re.test(title))?.[1] ?? FaRocket;
}

const TAG_ICONS: Record<string, IconType> = {
  mongodb: SiMongodb,
  express: SiExpress,
  react: SiReact,
  "node.js": SiNodedotjs,
  node: SiNodedotjs,
  "spring boot": SiSpringboot,
  java: FaJava,
  android: SiAndroid,
  typescript: SiTypescript,
};

export function tagIcon(tag: string): IconType | undefined {
  return TAG_ICONS[tag.toLowerCase()];
}

export function socialIcon(url: string, label = ""): IconType {
  const s = `${url} ${label}`.toLowerCase();
  if (s.includes("github")) return FaGithub;
  if (s.includes("linkedin")) return FaLinkedin;
  if (s.includes("twitter") || s.includes("x.com")) return FaTwitter;
  if (s.includes("instagram")) return FaInstagram;
  if (s.includes("youtube")) return FaYoutube;
  if (s.startsWith("mailto:")) return FaEnvelope;
  if (s.includes("qy-soul") || s.includes("qysoul")) return FaGlobe;
  return FaLink;
}
