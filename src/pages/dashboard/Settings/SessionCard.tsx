import React from "react";
import { Button } from "../../../components/Button";
import { LogOut } from "lucide-react";

interface SessionCardProps {
  onLogout: () => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({ onLogout }) => {
  return (
    <div className="border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/[0.03] p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-black dark:text-white">
            Session
          </h3>
          <p className="text-xs text-black/50 dark:text-white/50 mt-0.5">
            Sign out of your account on this device.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={onLogout}
          className="flex items-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/40 border-red-200 dark:border-red-900 font-bold"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </Button>
      </div>
    </div>
  );
};