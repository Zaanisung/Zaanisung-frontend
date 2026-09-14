import type { OnboardingTourId } from "./tours";

/**
 * Tiny cross-component pub/sub used so any button anywhere can ask the
 * OnboardingTour overlay (mounted in App) to launch a given tour.
 * `window.dispatchEvent(new CustomEvent("zaanisung:onboarding", { detail: id }))`
 */
export const ONBOARDING_EVENT = "zaanisung:onboarding";

export const startOnboarding = (tourId: OnboardingTourId): void => {
  window.dispatchEvent(new CustomEvent<OnboardingTourId>(ONBOARDING_EVENT, { detail: tourId }));
};