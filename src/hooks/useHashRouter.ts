import { useCallback, useEffect, useRef } from "react";
import type { AppView, FullUser } from "../types";
import { hashToView, viewToHash } from "../utils/appUrl";

/**
 * Two-way sync between the current AppView and the URL hash fragment.
 *
 * - A load or a hashchange (back/forward, manual edit) maps back to a view
 *   via hashToView; unparseable or access-gated URLs are ignored.
 * - View changes are mirrored into the fragment with pushState (which never
 *   emits a hashchange, so there is no feedback loop).
 *
 * Only the bootstrapped state participates: until getMeProfile resolves we
 * never override the URL or jump views.
 */
export interface HashRouterState {
  view: AppView;
  isBootstrapping: boolean;
  customerUser: FullUser | null;
  onNavigate: (view: AppView) => void;
}

const HOME_HASHES = new Set(["", "#", "#/", "#/home"]);

export const useHashRouter = ({
  view,
  isBootstrapping,
  customerUser,
  onNavigate,
}: HashRouterState) => {
  // Always read the freshest props inside callbacks registered once. The ref is
  // synced in the first effect so listeners registered in later effects in the
  // same commit already see this render's values.
  const latest = useRef({ view, isBootstrapping, customerUser, onNavigate });
  useEffect(() => {
    latest.current = { view, isBootstrapping, customerUser, onNavigate };
  });

  const applyHashToView = useCallback(() => {
    const state = latest.current;
    if (state.isBootstrapping) return;

    const nextView = hashToView(window.location.hash);
    if (!nextView) return;

    // The account dashboard belongs to a signed-in customer. A guest's URL is
    // left untouched instead of pulling them into a shell they can't use.
    if (nextView.type === "dashboard" && !state.customerUser) return;

    state.onNavigate(nextView);
  }, []);

  // Apply the incoming URL once bootstrap completes, then on every hashchange.
  useEffect(() => {
    if (isBootstrapping) return;
    applyHashToView();
  }, [isBootstrapping, applyHashToView]);

  useEffect(() => {
    window.addEventListener("hashchange", applyHashToView);
    return () => window.removeEventListener("hashchange", applyHashToView);
  }, [applyHashToView]);

  // Mirror the current view into the URL fragment. The very first render and
  // the landing "home" hash (empty fragment vs #/ vs #/home) are treated as
  // already in sync so we never rewrite the user's URL gratuitously.
  const previousView = useRef(view);
  useEffect(() => {
    const previous = previousView.current;
    previousView.current = view;
    if (isBootstrapping) return;
    if (previous === view) return;

    const target = `#${viewToHash(view)}`;
    const current = window.location.hash;
    if (current === target) return;
    if (HOME_HASHES.has(current) && HOME_HASHES.has(target)) return;

    window.history.pushState(null, "", target);
  }, [view, isBootstrapping]);
};