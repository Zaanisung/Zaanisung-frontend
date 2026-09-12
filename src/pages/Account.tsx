import React from "react";
import { CustomerUser } from "../types";
import { Button } from "../components/Button";
import { User, Phone, Mail, LogOut, LayoutDashboard, ArrowRight } from "lucide-react";

export interface AccountProps {
  user: CustomerUser | null;
  onLogout: () => void;
  onNavigateToLogin: () => void;
  onOpenDashboard?: () => void;
}

export const Account: React.FC<AccountProps> = ({
  user,
  onLogout,
  onNavigateToLogin,
  onOpenDashboard,
}) => {
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="relative overflow-hidden w-full max-w-md aspect-auto py-16 px-6 surface-glass-strong rounded-2xl kente-frame text-center flex flex-col items-center shadow-[0_0_0_1px_rgba(212,175,55,0.1),0_12px_40px_-10px_rgba(0,0,0,0.15)]">
        <div className="absolute -bottom-20 -left-20 w-56 h-56 orb orb-gold-faint animate-mist-pulse" aria-hidden="true"></div>

        <div className="relative w-14 h-14 bg-gold/10 flex items-center justify-center text-gold mb-4 border border-gold/40 rounded-xl">
          <User className="w-6 h-6 stroke-[1.5]" />
        </div>
        <h2
          className="relative text-xl font-light text-black dark:text-white mb-1 font-brand-serif"
        >
          Customer Account
        </h2>
        <p className="relative text-xs text-black/50 dark:text-white/50 mb-6">
          Sign in to view saved shipping info and previous orders.
        </p>
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={onNavigateToLogin}
          className="relative w-full font-bold"
        >
          Sign In
        </Button>
      </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="pb-2">
        <h2
          className="text-2xl font-light text-black dark:text-white font-brand-serif"
        >
          Customer Account
        </h2>
        <p className="text-[11px] uppercase tracking-widest text-gold font-semibold mt-1">
          Zaanisung Profile
        </p>
      </div>

      <div className="relative overflow-hidden surface-glass-strong p-6 sm:p-8 shadow-lift rounded-2xl space-y-6">
        <div className="absolute top-0 left-0 right-0 hairline-gold" aria-hidden="true"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 orb orb-gold-faint" aria-hidden="true"></div>

        {/* Customer Avatar & Name */}
        <div className="relative flex items-center space-x-4 pb-6">
          <div className="w-14 h-14 bg-black dark:bg-white/5 text-gold border border-gold/50 flex items-center justify-center text-lg font-bold rounded-xl">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-base text-black dark:text-white">{user.name}</h3>
            <span className="text-[11px] uppercase tracking-wider text-gold dark:text-gold font-bold bg-gold/10 dark:bg-gold/10 px-2 py-0.5 border border-gold/40 dark:border-gold/40 inline-block mt-0.5 rounded-full">
              Verified Customer
            </span>
          </div>
        </div>

        {/* Details list */}
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="flex items-center space-x-3 text-black/70 dark:text-white/80">
            <Phone className="w-4 h-4 text-black/45 dark:text-white/45" />
            <span className="font-mono">{user.phone}</span>
          </div>

          {user.email && (
            <div className="flex items-center space-x-3 text-black/70 dark:text-white/80">
              <Mail className="w-4 h-4 text-black/45 dark:text-white/45" />
              <span>{user.email}</span>
            </div>
          )}
        </div>

        {/* Dashboard action */}
        {onOpenDashboard && (
          <div className="pt-2">
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={onOpenDashboard}
              className="w-full flex items-center justify-center gap-2 font-bold"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Logout Action */}
        <div className="pt-2">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/40 border-red-200 dark:border-red-900 font-bold"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
