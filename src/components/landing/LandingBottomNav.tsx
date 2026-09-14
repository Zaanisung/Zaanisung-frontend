import React, { useEffect, useState } from "react";
import { Home, Sparkles, Info, Hammer, Store } from "lucide-react";
import { cn } from "../../utils/cn";

interface LandingBottomNavProps {
  onHome: () => void;
  onShop: () => void;
}

type LandingTab = "home" | "collections" | "about" | "craft";

const SECTION_IDS: Exclude<LandingTab, "home">[] = ["collections", "about", "craft"];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Fixed bottom navigation for the public landing page (mobile/tablet only,
 * hidden from lg up where the desktop header nav takes over). Mirrors the
 * storefront + dashboard bottom navs, and highlights the section currently
 * in view as the user scrolls the marketing page.
 */
export const LandingBottomNav: React.FC<LandingBottomNavProps> = ({ onHome, onShop }) => {
  const [active, setActive] = useState<LandingTab>("home");

  useEffect(() => {
    const onScroll = () => {
      const offset = window.scrollY + 120;
      let current: LandingTab = "home";
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= offset) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const tabs: { id: LandingTab | "shop"; label: string; icon: typeof Home; active?: boolean }[] = [
    { id: "home", label: "Home", icon: Home, active: active === "home" },
    { id: "collections", label: "Collections", icon: Sparkles, active: active === "collections" },
    { id: "about", label: "About", icon: Info, active: active === "about" },
    { id: "craft", label: "The Craft", icon: Hammer, active: active === "craft" },
    { id: "shop", label: "Shop", icon: Store },
  ];

  return (
    <nav
      id="landing-bottom-nav"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-black/10 dark:border-white/15 pb-safe backdrop-blur-xl bg-white/80 dark:bg-black/75"
      aria-label="Landing Mobile Navigation"
    >
      <div className="grid grid-cols-5 h-16 max-w-md mx-auto px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = Boolean(tab.active);
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                if (tab.id === "shop") onShop();
                else if (tab.id === "home") onHome();
                else scrollToSection(tab.id);
              }}
              className={cn(
                "flex flex-col items-center justify-center min-h-[44px] h-full relative transition-colors",
                isActive
                  ? "text-gold"
                  : "text-black/45 dark:text-white/45 hover:text-black dark:hover:text-white"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "stroke-[2.2]" : "stroke-[1.6]")} />
              <span
                className={cn(
                  "text-[10px] uppercase tracking-widest mt-1",
                  isActive ? "text-gold font-bold" : "text-black/45 dark:text-white/45"
                )}
              >
                {tab.label}
              </span>
              {isActive && <span className="absolute top-0 w-8 h-[2px] bg-gold" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
};