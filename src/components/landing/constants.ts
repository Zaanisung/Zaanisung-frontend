import { Gem, ShieldCheck, RefreshCcw, Heart } from "lucide-react";
import { STORAGE_KEYS } from "../../constants";

// The landing "signed" session marker lives on the shared storage-keys list so
// the app never has two spellings of the same key.
export const SESSION_KEY = STORAGE_KEYS.LANDING_SESSION;

export const navLinks = [
  { label: "Collections", href: "#collections" },
  { label: "About", href: "#about" },
  { label: "The Craft", href: "#craft" },
];

export const storyStats = [
  { value: "100%", label: "Artisanal Blends" },
  { value: "24H+", label: "Long-Lasting Wear" },
  { value: "Tamale", label: "Proudly Ghanaian" },
];

export const craftFeatures = [
  { icon: Gem, title: "Premium Oils", text: "High-concentration perfume oils for all-day sillage." },
  { icon: RefreshCcw, title: "Long-Lasting", text: "Formulated to endure from morning till midnight." },
  { icon: Heart, title: "Made with Love", text: "Small-batch craft, numbered and finished by hand." },
  { icon: ShieldCheck, title: "Trusted & Secure", text: "Secure ordering and nationwide delivery from Tamale." },
];