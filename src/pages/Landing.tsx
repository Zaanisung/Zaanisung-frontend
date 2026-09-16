import React, { useEffect, useState } from "react";
import { Product, CustomerUser } from "../types";
import * as api from "../services";
import { getErrorMessage } from "../services";
import { Footer } from "../components/Footer";
import { LandingBottomNav } from "../components/landing/LandingBottomNav";
import { LandingHeader } from "../components/landing/LandingHeader";
import { LandingHero } from "../components/landing/LandingHero";
import { LandingAuthCard } from "../components/landing/LandingAuthCard";
import type { AuthMode } from "../components/landing/LandingAuthCard";
import { CollectionSection } from "../components/landing/CollectionSection";
import { AboutSection } from "../components/landing/AboutSection";
import { CraftSection } from "../components/landing/CraftSection";
import { CtaBanner } from "../components/landing/CtaBanner";
import { FullscreenToggle } from "../components/ui/FullscreenToggle";
import { SESSION_KEY } from "../components/landing/constants";

export interface LandingProps {
  products: Product[];
  currentUser: CustomerUser | null;
  isLoadingProducts: boolean;
  initialSection?: "collections" | "about" | "craft";
  onCreateAccount: (user: CustomerUser) => void;
  onLogin: (user: CustomerUser) => void;
  onStartShopping: () => void;
  onBrowseShop: () => void;
  onGoToLogin: () => void;
  onOpenDashboard?: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  recentlyAddedId?: string | null;
}

export const Landing: React.FC<LandingProps> = ({
  products,
  currentUser,
  isLoadingProducts,
  initialSection,
  onCreateAccount,
  onLogin,
  onStartShopping,
  onBrowseShop,
  onGoToLogin,
  onOpenDashboard,
  onSelectProduct,
  onAddToCart,
  recentlyAddedId,
}) => {
  const [mode, setMode] = useState<AuthMode>(() =>
    typeof window !== "undefined" && window.sessionStorage.getItem(SESSION_KEY) === "signed"
      ? "login"
      : "signup"
  );

  // Deep-link to a landing section (e.g. "About Us" in the storefront footer).
  useEffect(() => {
    if (!initialSection) return;
    const element = document.getElementById(initialSection);
    if (!element) return;
    const timer = setTimeout(() => {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
    return () => clearTimeout(timer);
  }, [initialSection]);

  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [justCreated, setJustCreated] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (mode === "signup" && !name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!identifier.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (mode === "signup") {
        const { user } = await api.registerUser({
          name: name.trim(),
          phone: /^\d/.test(identifier.trim()) ? identifier.trim() : undefined,
          email: identifier.includes("@") ? identifier.trim() : undefined,
          password,
        });
        sessionStorage.setItem(SESSION_KEY, "signed");
        setJustCreated(true);
        onCreateAccount({
          id: user.id,
          name: user.name,
          phone: user.phone || "",
          email: user.email,
          role: user.role,
        });
      } else {
        const { user } = await api.loginUser(identifier, password);
        sessionStorage.setItem(SESSION_KEY, "signed");
        onLogin({
          id: user.id,
          name: user.name,
          phone: user.phone || "",
          email: user.email,
          role: user.role,
        });
      }
    } catch (err) {
      setError(getErrorMessage(err, "Something went wrong. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  const isLoggedIn = !!currentUser;
  const showForm = !isLoggedIn && !justCreated;

  const handleDemoAccount = (user: CustomerUser) => {
    sessionStorage.setItem(SESSION_KEY, "signed");
    setJustCreated(true);
    onCreateAccount(user);
  };

  const scrollToAuth = () =>
    document.getElementById("auth-card")?.scrollIntoView({ behavior: "smooth", block: "center" });

  return (
    <div className="min-h-screen bg-cream dark:bg-black text-ink dark:text-white">
      <LandingHeader
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        onBrowseShop={onBrowseShop}
        onGoToLogin={onGoToLogin}
        onStartShopping={onStartShopping}
        onOpenDashboard={onOpenDashboard}
      />

      <LandingHero
        showForm={showForm}
        isLoggedIn={isLoggedIn}
        onStartShopping={onStartShopping}
        onBrowseShop={onBrowseShop}
        onScrollToAuth={scrollToAuth}
        authPanel={
          <LandingAuthCard
            mode={mode}
            showForm={showForm}
            isLoggedIn={isLoggedIn}
            justCreated={justCreated}
            currentUser={currentUser}
            name={name}
            identifier={identifier}
            password={password}
            error={error}
            isLoading={isLoading}
            onModeChange={(m) => {
              setMode(m);
              setError(null);
            }}
            onNameChange={(v) => {
              setName(v);
              if (error) setError(null);
            }}
            onIdentifierChange={(v) => {
              setIdentifier(v);
              if (error) setError(null);
            }}
            onPasswordChange={(v) => {
              setPassword(v);
              if (error) setError(null);
            }}
            onSubmit={handleSubmit}
            onStartShopping={onStartShopping}
            onBrowseShop={onBrowseShop}
            onOpenDashboard={onOpenDashboard}
            onDemoAccount={handleDemoAccount}
          />
        }
      />

      <CollectionSection
        products={products}
        isLoadingProducts={isLoadingProducts}
        recentlyAddedId={recentlyAddedId}
        onBrowseShop={onBrowseShop}
        onSelectProduct={onSelectProduct}
        onAddToCart={onAddToCart}
      />

      <AboutSection onGoToLogin={onGoToLogin} />

      <CraftSection />

      <CtaBanner
        showForm={showForm}
        isLoggedIn={isLoggedIn}
        onStartShopping={onStartShopping}
        onBrowseShop={onBrowseShop}
        onScrollToAuth={scrollToAuth}
      />

      <Footer
        onNavigate={(target) => {
          if (target === "about") {
            document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
          } else if (target === "home") {
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else if (target === "shop") {
            onBrowseShop();
          } else if (target === "orders" || target === "account") {
            onGoToLogin();
          }
        }}
      />

      {/* Bottom nav for the marketing page (mobile/tablet) + spacer so the
          fixed bar never covers the footer content */}
      <div
        aria-hidden="true"
        className="lg:hidden bg-ink"
        style={{ height: "calc(4rem + env(safe-area-inset-bottom))" }}
      />
      <LandingBottomNav
        onHome={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        onShop={onBrowseShop}
      />

      <FullscreenToggle className="fixed right-4 bottom-[calc(4rem+env(safe-area-inset-bottom)+0.625rem)] lg:right-6 lg:bottom-6 z-50" />
    </div>
  );
};