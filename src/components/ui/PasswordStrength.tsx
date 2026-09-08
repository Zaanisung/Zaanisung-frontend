import React from "react";
import { Check, X } from "lucide-react";
import { VALIDATION, PASSWORD_REGEX } from "../../constants";
import { cn } from "../../utils/cn";

export interface PasswordStrengthProps {
  password: string;
  className?: string;
}

interface PasswordRule {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

const PASSWORD_RULES: PasswordRule[] = [
  {
    id: "length",
    label: `At least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`,
    test: (pwd) => pwd.length >= VALIDATION.PASSWORD_MIN_LENGTH,
  },
  {
    id: "uppercase",
    label: "One uppercase letter",
    test: (pwd) => /[A-Z]/.test(pwd),
  },
  {
    id: "lowercase",
    label: "One lowercase letter",
    test: (pwd) => /[a-z]/.test(pwd),
  },
  {
    id: "number",
    label: "One number",
    test: (pwd) => /\d/.test(pwd),
  },
  {
    id: "special",
    label: "One special character (@$!%*?&#)",
    test: (pwd) => /[@$!%*?&#]/.test(pwd),
  },
];

/**
 * Calculate password strength (0-100)
 */
function calculateStrength(password: string): number {
  if (!password) return 0;
  
  const passedRules = PASSWORD_RULES.filter((rule) => rule.test(password)).length;
  const percentage = (passedRules / PASSWORD_RULES.length) * 100;
  
  return Math.round(percentage);
}

/**
 * Get strength label and color based on percentage
 */
function getStrengthMeta(strength: number): {
  label: string;
  color: string;
  bgColor: string;
} {
  if (strength === 0) {
    return {
      label: "",
      color: "text-black/40 dark:text-white/40",
      bgColor: "bg-black/10 dark:bg-white/10",
    };
  }
  if (strength < 40) {
    return {
      label: "Weak",
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-600 dark:bg-red-400",
    };
  }
  if (strength < 80) {
    return {
      label: "Fair",
      color: "text-gold",
      bgColor: "bg-gold",
    };
  }
  return {
    label: "Strong",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-600 dark:bg-green-400",
  };
}

/**
 * PasswordStrength — Real-time password strength indicator with validation rules
 * 
 * Provides visual feedback on password strength and shows which requirements are met.
 * Uses soft, mist-inspired design to match the perfume aesthetic.
 */
export const PasswordStrength: React.FC<PasswordStrengthProps> = ({
  password,
  className = "",
}) => {
  const strength = calculateStrength(password);
  const { label, color, bgColor } = getStrengthMeta(strength);
  const isValid = PASSWORD_REGEX.test(password);

  // Don't show anything if password is empty
  if (!password) {
    return null;
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Strength meter */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-black/50 dark:text-white/50">
            Password Strength
          </span>
          {label && (
            <span className={cn("text-[11px] uppercase tracking-wider font-bold", color)}>
              {label}
            </span>
          )}
        </div>
        
        {/* Progress bar with soft glassmorphic background */}
        <div className="h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden backdrop-blur-sm">
          <div
            className={cn(
              "h-full transition-all duration-500 ease-out rounded-full",
              bgColor
            )}
            style={{ width: `${strength}%` }}
            role="progressbar"
            aria-valuenow={strength}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Password strength: ${strength}%`}
          />
        </div>
      </div>

      {/* Requirements checklist */}
      <div className="space-y-1.5">
        {PASSWORD_RULES.map((rule) => {
          const passed = rule.test(password);
          return (
            <div
              key={rule.id}
              className="flex items-center gap-2 text-xs transition-colors duration-200"
            >
              <div
                className={cn(
                  "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200",
                  passed
                    ? "bg-green-600 dark:bg-green-500 text-white"
                    : "bg-black/10 dark:bg-white/10 text-black/30 dark:text-white/30"
                )}
              >
                {passed ? (
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                ) : (
                  <X className="w-2.5 h-2.5 stroke-[2]" />
                )}
              </div>
              <span
                className={cn(
                  "transition-colors duration-200",
                  passed
                    ? "text-black/80 dark:text-white/80"
                    : "text-black/45 dark:text-white/45"
                )}
              >
                {rule.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Overall validation status */}
      {password.length >= VALIDATION.PASSWORD_MIN_LENGTH && (
        <div
          className={cn(
            "text-xs font-medium px-3 py-2 rounded-lg backdrop-blur-sm transition-colors duration-200",
            isValid
              ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
              : "bg-gold/10 text-gold-700 dark:text-gold-300 border border-gold/30"
          )}
        >
          {isValid
            ? "✓ Password meets all requirements"
            : "Complete all requirements for a strong password"}
        </div>
      )}
    </div>
  );
};
