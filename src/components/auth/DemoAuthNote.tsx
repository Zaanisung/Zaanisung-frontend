import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import type { CustomerUser } from "../../types";
import { createDemoAccount, getErrorMessage } from "../../services";
import { cn } from "../../utils/cn";

export interface DemoAuthNoteProps {
  role?: "CUSTOMER" | "ADMIN";
  title?: string;
  description?: string;
  label?: string;
  compact?: boolean;
  onSuccess: (user: CustomerUser) => void;
}

export const DemoAuthNote: React.FC<DemoAuthNoteProps> = ({
  role = "CUSTOMER",
  title,
  description,
  label,
  compact = false,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const user = await createDemoAccount(role);
      onSuccess({
        id: user.id,
        name: user.name,
        phone: user.phone || "",
        email: user.email,
        role: user.role,
      });
    } catch (err) {
      setError(getErrorMessage(err, "Could not create the demo account."));
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = role === "ADMIN";

  return (
    <div className={cn(
      "rounded-xl border bg-gold/10 border-gold/40",
      compact ? "p-3 space-y-3" : "p-4 space-y-4",
    )}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold">
          <Sparkles className="h-3.5 w-3.5" />
        </span>
        <div className="text-[11px] leading-relaxed text-ink/80 dark:text-cream/80">
          <strong className="block text-gold uppercase tracking-widest text-[9px] mb-0.5">
            {title ?? (isAdmin ? "Demo admin access" : "No registration needed — try instantly")}
          </strong>
          <span>
            {description ??
              (isAdmin
                ? "Tap below to sign into the seller portal as the store admin."
                : "Tap below to create a fully-stocked customer account. Everything you do is saved right in this browser — nothing leaves your device.")}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleCreate}
        disabled={isLoading}
        className={cn(
          "w-full min-h-[44px] rounded-xl border border-gold/60 bg-gold/15 text-gold",
          "hover:bg-gold/25 font-bold text-[11px] uppercase tracking-widest transition-colors",
          "flex items-center justify-center gap-2 disabled:opacity-60",
        )}
      >
        <Sparkles className="h-3.5 w-3.5" />
        {isLoading ? "One moment…" : (label ?? (isAdmin ? "Create the demo admin account" : "Create the demo account"))}
      </button>

      {isAdmin && (
        <p className="text-[10px] text-ink/60 dark:text-cream/60 text-center font-medium -mt-2">
          admin@zaanisung.demo / Admin@12345
        </p>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 font-medium p-2.5">
          {error}
        </div>
      )}
    </div>
  );
};
