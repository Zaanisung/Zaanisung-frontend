import React from "react";
import { cn } from "../../utils/cn";
import { Plus, Minus } from "lucide-react";

export interface QuantityStepperProps {
  quantity: number;
  max: number;
  min?: number;
  onDecrease: () => void;
  onIncrease: () => void;
  variant?: "default" | "gold";
  className?: string;
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  quantity,
  max,
  min = 0,
  onDecrease,
  onIncrease,
  variant = "default",
  className,
}) => {
  const isMinReached = quantity <= min;
  const isMaxReached = quantity >= max;

  const isGold = variant === "gold";
  const buttonClass = cn(
    "min-h-[44px] flex items-center justify-center text-black/70 dark:text-white/70 hover:bg-cream dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors",
    isGold ? "w-12 h-12" : "w-10 h-10"
  );

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg overflow-hidden",
        "transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
        isGold
          ? "border border-gold/40 surface-glass-tint"
          : "border border-black/15 dark:border-white/15 surface-glass",
        className
      )}
    >
      <button
        type="button"
        onClick={onDecrease}
        disabled={isMinReached}
        className={buttonClass}
        aria-label="Decrease quantity"
      >
        <Minus className={isGold ? "w-4 h-4" : "w-3.5 h-3.5"} />
      </button>
      <span
        className={cn(
          "text-center font-bold font-mono text-black dark:text-white",
          isGold ? "w-12 text-base" : "w-9 text-xs"
        )}
      >
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={isMaxReached}
        className={buttonClass}
        aria-label="Increase quantity"
      >
        <Plus className={isGold ? "w-4 h-4" : "w-3.5 h-3.5"} />
      </button>
    </div>
  );
};