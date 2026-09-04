import React from "react";
import { CustomerUser } from "../types";
import { Button } from "../components/Button";
import { User, Phone, Mail, LogOut, Shield } from "lucide-react";

export interface AccountProps {
  user: CustomerUser | null;
  onLogout: () => void;
  onNavigateToLogin: () => void;
  onSwitchToAdmin: () => void;
}

export const Account: React.FC<AccountProps> = ({
  user,
  onLogout,
  onNavigateToLogin,
  onSwitchToAdmin,
}) => {
  if (!user) {
    return (
      <div className="w-full max-w-md mx-auto py-16 px-6 bg-white dark:bg-[#131317] border border-gray-200 dark:border-[#22222A] text-center flex flex-col items-center shadow-xs">
        <div className="w-14 h-14 bg-gray-100 dark:bg-[#1C1C24] flex items-center justify-center text-gray-400 mb-4 border border-gray-200 dark:border-[#282834]">
          <User className="w-6 h-6 stroke-[1.5]" />
        </div>
        <h2
          className="text-xl font-light text-gray-900 dark:text-gray-100 mb-1"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Customer Account
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
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
      <div className="border-b border-gray-200 dark:border-[#22222A] pb-4">
        <h2
          className="text-2xl font-light text-gray-900 dark:text-gray-100"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Customer Account
        </h2>
        <p className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-semibold mt-1">
          Zaanisung Ent. GH Profile
        </p>
      </div>

      <div className="bg-white dark:bg-[#131317] border border-gray-200 dark:border-[#22222A] p-6 sm:p-8 shadow-xs space-y-6">
        {/* Customer Avatar & Name */}
        <div className="flex items-center space-x-4 border-b border-gray-100 dark:border-[#202028] pb-6">
          <div className="w-14 h-14 bg-black dark:bg-[#1A1A22] text-[#D4AF37] border border-[#D4AF37]/50 flex items-center justify-center text-lg font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-base text-gray-900 dark:text-gray-100">{user.name}</h3>
            <span className="text-[11px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 border border-emerald-200 dark:border-emerald-800 inline-block mt-0.5">
              Verified Customer
            </span>
          </div>
        </div>

        {/* Details list */}
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="font-mono">{user.phone}</span>
          </div>

          {user.email && (
            <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
              <Mail className="w-4 h-4 text-gray-400" />
              <span>{user.email}</span>
            </div>
          )}
        </div>

        {/* Admin Portal Quick Switch */}
        <div className="pt-6 border-t border-gray-100 dark:border-[#202028]">
          <button
            type="button"
            onClick={onSwitchToAdmin}
            className="w-full min-h-[44px] px-4 py-2.5 text-xs uppercase tracking-wider font-semibold border border-gray-200 dark:border-[#2C2C38] hover:border-black dark:hover:border-white text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-[#181820] flex items-center justify-center space-x-2 transition-colors"
          >
            <Shield className="w-4 h-4 text-[#D4AF37]" />
            <span>Switch to Admin Inventory Portal</span>
          </button>
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
