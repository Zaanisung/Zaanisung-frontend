import React from "react";
import { CustomerUser } from "../types";
import { Button } from "../components/Button";
import { User, Phone, Mail, LogOut } from "lucide-react";

export interface AccountProps {
  user: CustomerUser | null;
  onLogout: () => void;
  onNavigateToLogin: () => void;
}

export const Account: React.FC<AccountProps> = ({
  user,
  onLogout,
  onNavigateToLogin,
}) => {
  if (!user) {
    return (
      <div className="w-full max-w-md mx-auto py-16 px-6 bg-white dark:bg-white/5 border border-black/10 dark:border-white/15 text-center flex flex-col items-center shadow-xs">
        <div className="w-14 h-14 bg-white dark:bg-white/5 flex items-center justify-center text-black/45 dark:text-white/45 mb-4 border border-black/10 dark:border-white/15">
          <User className="w-6 h-6 stroke-[1.5]" />
        </div>
        <h2
          className="text-xl font-light text-black dark:text-white mb-1"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Customer Account
        </h2>
        <p className="text-xs text-black/50 dark:text-white/50 mb-6">
          Sign in to view saved shipping info and previous orders.
        </p>
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={onNavigateToLogin}
          className="w-full font-bold"
        >
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="pb-2">
        <h2
          className="text-2xl font-light text-black dark:text-white"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Customer Account
        </h2>
        <p className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-semibold mt-1">
          Zaanisung Ent. GH Profile
        </p>
      </div>

      <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/15 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Customer Avatar & Name */}
        <div className="flex items-center space-x-4 pb-6">
          <div className="w-14 h-14 bg-black dark:bg-white/5 text-[#D4AF37] border border-[#D4AF37]/50 flex items-center justify-center text-lg font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-base text-black dark:text-white">{user.name}</h3>
            <span className="text-[11px] uppercase tracking-wider text-[#D4AF37] dark:text-[#D4AF37] font-bold bg-[#D4AF37]/10 dark:bg-[#D4AF37]/10 px-2 py-0.5 border border-[#D4AF37]/40 dark:border-[#D4AF37]/40 inline-block mt-0.5">
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
