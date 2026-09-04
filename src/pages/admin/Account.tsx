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
      <div className="border-b border-[#1E1E24] pb-4">
        <h2
          className="text-2xl font-light text-white"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Admin Portal Settings
        </h2>
        <p className="text-xs uppercase tracking-widest text-gray-400 mt-1">
          Zaanisung Ent. GH Management
        </p>
      </div>

      <div className="bg-[#121216] border border-[#1E1E24] p-6 space-y-6">
        <div className="flex items-center space-x-4 border-b border-[#1E1E24] pb-6">
          <div className="w-14 h-14 bg-[#D4AF37] text-black flex items-center justify-center font-bold text-xl">
            A
          </div>
          <div>
            <h3 className="font-semibold text-base text-white">Administrator</h3>
            <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 border border-emerald-800 inline-block mt-0.5">
              Full Stock Control
            </span>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3 bg-[#181820] border border-[#242430] flex items-center justify-between">
            <div className="flex items-center space-x-2 text-gray-300">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Permission Tier</span>
            </div>
            <span className="text-white font-mono font-bold">Owner / Manager</span>
          </div>

          <div className="p-3 bg-[#181820] border border-[#242430] flex items-center justify-between">
            <div className="flex items-center space-x-2 text-gray-300">
              <KeyRound className="w-4 h-4 text-gray-400" />
              <span>Authentication</span>
            </div>
            <span className="text-gray-400">Passcode Protected</span>
          </div>
        </div>

        <div className="pt-4 border-t border-[#1E1E24] space-y-3">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onReturnToStore}
            className="w-full border-[#2E2E3C] text-gray-300 hover:text-white flex items-center justify-center gap-2"
          >
            <Store className="w-4 h-4 text-[#D4AF37]" />
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
