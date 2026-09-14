import { useEffect, useRef, useState } from "react";
import { useAppState } from "./hooks/useAppState";
import { AppRouter } from "./router";
import { FullPageLoader } from "./components/ui/Loader";
import { OnboardingTour } from "./components/onboarding/OnboardingTour";
import { cn } from "./utils/cn";

type LoaderPhase = "booting" | "fading" | "ready";

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const nextPaint = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

/** Full-viewport loader that fades out on mount so the freshly-mounted
 *  app behind it is revealed smoothly instead of being hard-swapped. */
const FadeOutOverlay: React.FC = () => {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setHidden(true));
    });
    return () => cancelAnimationFrame(raf);
  }, []);
  if (hidden) return null;
  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] pointer-events-none transition-opacity duration-[500ms] ease-out",
        hidden ? "opacity-0" : "opacity-100"
      )}
      aria-hidden="true"
    >
      <FullPageLoader />
    </div>
  );
};

export default function App() {
  const state = useAppState();
  const [phase, setPhase] = useState<LoaderPhase>("booting");

  useEffect(() => {
    if (state.isBootstrapping) return;
    let alive = true;

    (async () => {
      // Hold the loader until every vital resource (fonts, stylesheets,
      // images including background images) has finished loading — but never
      // block the page forever if a single resource stalls.
      if (document.readyState !== "complete") {
        const onLoad = new Promise<void>((resolve) => {
          window.addEventListener("load", () => resolve(), { once: true });
        });
        const maxWait = new Promise<void>((resolve) =>
          setTimeout(resolve, 2500)
        );
        await Promise.race([onLoad, maxWait]);
      }
      // Give the app a beat to mount and paint its core sections first.
      await wait(700);
      await nextPaint();
      if (!alive) return;

      // Mount the router behind a fading overlay, then unhook the loader.
      setPhase("fading");
      await wait(700);
      if (alive) setPhase("ready");
    })();

    return () => {
      alive = false;
    };
  }, [state.isBootstrapping]);

  // Every navigation to a new page scrolls the window back to the top so a
  // fresh route never opens mid-scroll. Landing-section deep links skip this
  // and let the Landing page scrollIntoView its target section instead.
  const prevView = useRef(state.view);
  useEffect(() => {
    const prev = prevView.current;
    prevView.current = state.view;
    if (prev.type === "landing" && state.view.type === "landing" && state.view.section) {
      return;
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [state.view]);

  if (phase === "booting") {
    return <FullPageLoader />;
  }

  return (
    <>
      <AppRouter {...state} />
      {phase === "fading" && <FadeOutOverlay />}
      <OnboardingTour
        view={state.view}
        isAdminLoggedIn={state.isAdminLoggedIn}
        isBootstrapping={state.isBootstrapping}
        onAdminTabChange={state.onAdminTabChange}
      />
    </>
  );
}