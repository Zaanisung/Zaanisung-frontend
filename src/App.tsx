import { useEffect, useRef, useState } from "react";
import { useAppState } from "./hooks/useAppState";
import { useHashRouter } from "./hooks/useHashRouter";
import { AppRouter } from "./router";
import { FullPageLoader } from "./components/ui/Loader";
import { OnboardingTour } from "./components/onboarding/OnboardingTour";
import { ToastHost } from "./components/Toast";
import { cn } from "./utils/cn";

type LoaderPhase = "booting" | "fading" | "ready";

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

  // Two-way URL sync: deep-links (#/shop, #/product/:id, #/dashboard/:page)
  // restore their view on load, and every view change is mirrored back into
  // the fragment so links are shareable and back/forward works.
  useHashRouter({
    view: state.view,
    isBootstrapping: state.isBootstrapping,
    customerUser: state.customerUser,
    onNavigate: state.onNavigate,
  });

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
          setTimeout(resolve, 1500)
        );
        await Promise.race([onLoad, maxWait]);
      }
      // Paint the freshly-mounted app behind the overlay, then reveal it once
      // the overlay's CSS fade has completed (no artificial extra delay).
      await nextPaint();
      if (!alive) return;

      setPhase("fading");
      await nextPaint();
      const fadeDone = new Promise<void>((resolve) =>
        window.setTimeout(resolve, 500)
      );
      await fadeDone;
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
      <ToastHost />
      <OnboardingTour
        view={state.view}
        isAdminLoggedIn={state.isAdminLoggedIn}
        isBootstrapping={state.isBootstrapping}
        onAdminTabChange={state.onAdminTabChange}
      />
    </>
  );
}