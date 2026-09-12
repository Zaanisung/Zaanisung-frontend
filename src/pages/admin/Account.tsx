import React from "react";
import { Button } from "../../components/Button";
import { ShieldCheck, LogOut, Store, KeyRound } from "lucide-react";

export interface AdminAccountProps {
  onLogout: () => void;
  onReturnToStore: () => void;
}

export const AdminAccount: React.FC<AdminAccountProps> = ({
  onLogout,
  onReturnToStore,
}) => {
  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="pb-2">
        <h2
          className="text-2xl font-light text-black dark:text-white font-brand-serif"
        >
          Admin Portal Settings
        </h2>
        <p className="text-xs uppercase tracking-widest text-black/45 dark:text-white/45 mt-1">
          Zaanisung Management
        </p>
      </div>

      <div className="relative overflow-hidden surface-glass-strong p-6 shadow-lift space-y-6 rounded-2xl">
        <div className="absolute top-0 left-0 right-0 hairline-gold"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 orb orb-gold-faint" aria-hidden="true"></div>

        <div className="relative flex items-center space-x-4 pb-6">
          <div className="w-14 h-14 bg-gold text-black flex items-center justify-center font-bold text-xl rounded-xl">
            A
          </div>
          <div>
            <h3 className="font-semibold text-base text-black dark:text-white">Administrator</h3>
            <span className="text-[10px] uppercase tracking-wider text-gold font-bold bg-gold/10 px-2 py-0.5 border border-gold/40 inline-block mt-0.5 rounded-full">
              Full Stock Control
            </span>
          </div>
        </div>

        <div className="relative space-y-3 text-xs">
          <div className="p-3 surface-glass-tint flex items-center justify-between">
            <div className="flex items-center space-x-2 text-black/60 dark:text-white/60">
              <ShieldCheck className="w-4 h-4 text-gold" />
              <span>Permission Tier</span>
            </div>
            <span className="text-black dark:text-white font-mono font-bold">Owner / Manager</span>
          </div>

          <div className="p-3 surface-glass-tint flex items-center justify-between">
            <div className="flex items-center space-x-2 text-black/60 dark:text-white/60">
              <KeyRound className="w-4 h-4 text-black/45 dark:text-white/45" />
              <span>Authentication</span>
            </div>
            <span className="text-black/45 dark:text-white/45">Passcode Protected</span>
          </div>
        </div>

        <div className="pt-5 space-y-3">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onReturnToStore}
            className="w-full border-black/10 dark:border-white/15 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white flex items-center justify-center gap-2"
          >
            <Store className="w-4 h-4 text-gold" />
            <span>Switch to Customer Storefront</span>
          </Button>

          <Button
            type="button"
            variant="danger"
            size="md"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Exit Admin Session</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
