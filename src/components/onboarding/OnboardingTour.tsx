import { useCallback, useEffect, useRef, useState } from "react";
import type { AdminTab, AppView } from "../../types/nav";
import { TOURS, type OnboardingStep, type OnboardingTourId } from "../../onboarding/tours";
import { ONBOARDING_EVENT } from "../../onboarding/onboardingBus";
import { cn } from "../../utils/cn";
import { ChevronLeft, ChevronRight, Check, X } from "lucide-react";

const readFlag = (key: string): boolean => window.localStorage.getItem(key) === "1";
const writeFlag = (key: string, done: boolean): void => {
  if (done) window.localStorage.setItem(key, "1");
  else window.localStorage.removeItem(key);
};

const findVisible = (selector: string): HTMLElement | null => {
  const nodes = Array.from(document.querySelectorAll<HTMLElement>(selector));
  for (const node of nodes) {
    const style = window.getComputedStyle(node);
    if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") continue;
    const rect = node.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) return node;
  }
  return null;
};

const TOOLTIP_WIDTH = 320;
const TOOLTIP_HEIGHT = 196;
const RING_GAP = 8;

export interface OnboardingTourProps {
  view: AppView;
  isAdminLoggedIn: boolean;
  isBootstrapping: boolean;
  onAdminTabChange: (tab: AdminTab) => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({
  view,
  isAdminLoggedIn,
  isBootstrapping,
  onAdminTabChange,
}) => {
  const [tourId, setTourId] = useState<OnboardingTourId | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [target, setTarget] = useState<{ el: HTMLElement; rect: DOMRect } | null>(null);

  const tour = tourId ? TOURS[tourId] : null;
  const step: OnboardingStep | null = tour ? tour.steps[stepIndex] ?? null : null;

  const autoStarted = useRef<Set<string>>(new Set());
  const navigatedRef = useRef<string[]>([]);

  // ─── Lifecycle ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (tour) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [tour]);

  const finish = useCallback(() => {
    if (tour) writeFlag(tour.storageKey, true);
    setTourId(null);
    setStepIndex(0);
    setTarget(null);
  }, [tour]);

  const next = useCallback(() => {
    if (!tour) return;
    setTarget(null);
    if (stepIndex >= tour.steps.length - 1) finish();
    else setStepIndex((i) => i + 1);
  }, [tour, stepIndex, finish]);

  const prevStep = useCallback(() => {
    setTarget(null);
    setStepIndex((i) => Math.max(0, i - 1));
  }, []);

  const start = (id: OnboardingTourId) => {
    setTourId(id);
    setStepIndex(0);
    setTarget(null);
  };

  // ─── Manual relaunch bus ────────────────────────────────────────────────
  useEffect(() => {
    const onBus = (event: Event) => {
      const id = (event as CustomEvent<OnboardingTourId>).detail;
      if (id && TOURS[id]) {
        autoStarted.current.add(id);
        start(id);
      }
    };
    window.addEventListener(ONBOARDING_EVENT, onBus);
    return () => window.removeEventListener(ONBOARDING_EVENT, onBus);
  }, []);

  // ─── Auto-start (first-time per role) ───────────────────────────────────
  useEffect(() => {
    if (isBootstrapping || tourId) return;

    if (isAdminLoggedIn && view.type === "admin") {
      const key = TOURS.admin.storageKey;
      if (!readFlag(key) && !autoStarted.current.has("admin")) {
        autoStarted.current.add("admin");
        start("admin");
      }
      return;
    }

    if (view.type === "dashboard" && view.page === "overview") {
      const key = TOURS["buyer-dashboard"].storageKey;
      if (!readFlag(key) && !autoStarted.current.has("buyer-dashboard")) {
        autoStarted.current.add("buyer-dashboard");
        start("buyer-dashboard");
      }
      return;
    }
  }, [view, isAdminLoggedIn, isBootstrapping, tourId]);

  // ─── Keyboard navigation ────────────────────────────────────────────────
  useEffect(() => {
    if (!tour) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish();
      else if (event.key === "ArrowRight") next();
      else if (event.key === "ArrowLeft") prevStep();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tour, next, prevStep, finish]);

  // ─── Target measurement loop ────────────────────────────────────────────
  useEffect(() => {
    if (!tour) return;
    let alive = true;
    let misses = 0;
    let lastScroll = 0;
    const activeStep = tour.steps[stepIndex];
    if (!activeStep) return;

    const check = () => {
      if (!alive) return;

      const el = findVisible(activeStep.selector);
      if (!el) {
        if (activeStep.adminTab && !navigatedRef.current.includes(activeStep.id)) {
          navigatedRef.current.push(activeStep.id);
          onAdminTabChange(activeStep.adminTab);
        }
        misses += 1;
        if (misses > 10) next();
        return;
      }
      misses = 0;

      const rect = el.getBoundingClientRect();
      const inView =
        rect.top >= 0 &&
        rect.bottom <= window.innerHeight + 8 &&
        rect.left >= 0 &&
        rect.right <= window.innerWidth + 8;

      if (!inView) {
        const now = Date.now();
        if (now - lastScroll > 750) {
          lastScroll = now;
          el.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" });
        }
        return;
      }

      setTarget({ el, rect: el.getBoundingClientRect() });
    };

    const id = window.setInterval(check, 250);
    check();

    const onResize = () => {
      const el = findVisible(activeStep.selector);
      if (el) setTarget({ el, rect: el.getBoundingClientRect() });
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);

    return () => {
      alive = false;
      window.clearInterval(id);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [tour, stepIndex, next, onAdminTabChange]);

  if (!tour || !step || !target) return null;

  const rect = target.rect;
  const el = target.el;
  const borderRadius = window.getComputedStyle(el).borderRadius || "18px";

  const showAbove = rect.bottom + 16 + TOOLTIP_HEIGHT > window.innerHeight && rect.top - TOOLTIP_HEIGHT - 16 >= 12;
  const tooltipTop = showAbove
    ? Math.max(12, rect.top - TOOLTIP_HEIGHT - 16)
    : Math.min(window.innerHeight - TOOLTIP_HEIGHT - 12, rect.bottom + 16);
  const tooltipLeft = Math.max(
    12,
    Math.min(rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2, window.innerWidth - TOOLTIP_WIDTH - 12)
  );

  const Icon = step.icon;
  const isLast = stepIndex === tour.steps.length - 1;

  return (
    <>
      {/* Click shield — nothing under the tour starts taking taps */}
      <div className="fixed inset-0 z-[110]" aria-hidden="true" />

      {/* Spotlight ring + dim */}
      <div
        className="pointer-events-none fixed z-[120]"
        style={{
          left: rect.left - RING_GAP,
          top: rect.top - RING_GAP,
          width: rect.width + RING_GAP * 2,
          height: rect.height + RING_GAP * 2,
          borderRadius,
          border: "2px solid var(--color-gold, #d4af37)",
          boxShadow:
            "0 0 0 4px rgba(212,175,55,0.22), 0 0 0 9999px rgba(4,4,4,0.55)",
          transition: "left 0.35s ease, top 0.35s ease, width 0.35s ease, height 0.35s ease",
        }}
      >
        <div
          className="tour-ring-pulse"
          style={{
            position: "absolute",
            inset: -4,
            borderRadius: "inherit",
            border: "2px solid var(--color-gold, #d4af37)",
          }}
          aria-hidden="true"
        />
      </div>

      {/* Tooltip card */}
      <div
        role="dialog"
        aria-modal="false"
        aria-label={tour.title}
        className="fixed z-[130]"
        style={{
          top: tooltipTop,
          left: tooltipLeft,
          width: `min(${TOOLTIP_WIDTH}px, calc(100vw - 24px))`,
        }}
      >
        <div
          className={cn(
            "absolute left-1/2 h-3 w-3 rotate-45 border-gold bg-[#fffdf9] dark:bg-[#171717]",
            "shadow-[1px_1px_0_0_rgba(212,175,55,0.4)]",
            showAbove ? "bottom-[-7px] border-b border-r" : "top-[-7px] border-l border-t"
          )}
          style={{ boxShadow: "0 -2px 6px rgba(0,0,0,0.08)" }}
          aria-hidden="true"
        />
        <div className="relative overflow-hidden rounded-[18px] surface-glass-strong p-5 shadow-lift border border-gold/30">
          <div className="absolute top-0 left-0 right-0 hairline-gold" aria-hidden="true" />

          <div className="relative flex items-start gap-3">
            {Icon && (
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gold/15 border border-gold/40 text-gold">
                <Icon className="h-5 w-5 stroke-[1.6]" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[9px] uppercase tracking-widest text-gold font-bold">
                {tour.title}
              </p>
              <h2 className="mt-0.5 text-sm sm:text-base font-semibold text-black dark:text-white leading-snug">
                {step.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={finish}
              aria-label="Close onboarding"
              className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="relative mt-3 text-xs sm:text-sm leading-relaxed text-black/60 dark:text-white/65">
            {step.body}
          </p>

          <div className="relative mt-4 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={finish}
              className="min-h-[40px] px-2 text-[10px] uppercase tracking-widest font-bold text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors"
            >
              Skip
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevStep}
                disabled={stepIndex === 0}
                aria-label="Previous step"
                className={cn(
                  "min-h-[40px] min-w-[40px] flex items-center justify-center rounded-full border transition-all duration-[400ms]",
                  stepIndex === 0
                    ? "border-black/10 dark:border-white/15 text-black/25 dark:text-white/25"
                    : "border-black/15 dark:border-white/20 text-black dark:text-white hover:border-gold/60"
                )}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={next}
                className={cn(
                  "min-h-[40px] px-4 rounded-full text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5 transition-all duration-[400ms]",
                  isLast
                    ? "bg-gold text-ink border border-gold-600/40"
                    : "bg-ink text-cream dark:bg-gold dark:text-ink border border-ink"
                )}
              >
                {isLast ? "Done" : "Next"}
                {isLast ? <Check className="h-3.5 w-3.5 stroke-[2.5]" /> : <ChevronRight className="h-3.5 w-3.5 stroke-[2.5]" />}
              </button>
            </div>
          </div>

          <div className="relative mt-3 flex items-center gap-1" aria-label={`Step ${stepIndex + 1} of ${tour.steps.length}`}>
            <span className="text-[9px] uppercase tracking-widest text-black/35 dark:text-white/35 font-bold mr-1">
              Step {stepIndex + 1} / {tour.steps.length}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};