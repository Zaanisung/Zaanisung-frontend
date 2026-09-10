import React from "react";
import { cn } from "../../utils/cn";

/**
 * Minimal, text-free loaders. No words — pure motion.
 * Variants: dots, squares, circles, ring, circle (concentric page spinner).
 */

type LoaderVariant = "dots" | "squares" | "circles" | "ring" | "circle";

interface LoaderProps {
  variant?: LoaderVariant;
  className?: string;
  label?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap: Record<NonNullable<LoaderProps["size"]>, string> = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

const gapMap: Record<NonNullable<LoaderProps["size"]>, string> = {
  sm: "gap-1.5",
  md: "gap-2",
  lg: "gap-2.5",
};

const ringSizeMap: Record<NonNullable<LoaderProps["size"]>, string> = {
  sm: "h-5 w-5",
  md: "h-7 w-7",
  lg: "h-10 w-10",
};

const ringInnerSizeMap: Record<NonNullable<LoaderProps["size"]>, string> = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-6 w-6",
};

export const Loader: React.FC<LoaderProps> = ({
  variant = "dots",
  className,
  size = "md",
}) => {
  const box = sizeMap[size];

  if (variant === "circle") {
    return (
      <span
        role="status"
        aria-label="Loading"
        className={cn(
          "relative inline-flex items-center justify-center",
          className
        )}
      >
        <span
          className={cn(
            ringSizeMap[size],
            "rounded-full border-2 border-gold/25 border-t-gold loader-ring"
          )}
        />
        <span
          className={cn(
            ringInnerSizeMap[size],
            "absolute rounded-full border border-gold/40 border-t-transparent loader-ring"
          )}
          style={{ animationDirection: "reverse", animationDuration: "0.9s" }}
        />
      </span>
    );
  }

  if (variant === "ring") {
    return (
      <span
        role="status"
        aria-label="Loading"
        className={cn("inline-flex items-center justify-center", className)}
      >
        <span
          className={cn(
            ringSizeMap[size],
            "rounded-full border-2 border-gold/30 border-t-gold loader-ring"
          )}
        />
      </span>
    );
  }

  if (variant === "squares") {
    return (
      <span
        role="status"
        aria-label="Loading"
        className={cn("inline-flex items-center", gapMap[size], className)}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={cn(box, "bg-gold loader-square")}
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </span>
    );
  }

  if (variant === "circles") {
    return (
      <span
        role="status"
        aria-label="Loading"
        className={cn("inline-flex items-center", gapMap[size], className)}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={cn(
              box,
              "rounded-full bg-gold loader-circle",
              i === 1 && "opacity-60",
              i === 2 && "opacity-35"
            )}
            style={{ animationDelay: `${i * 0.16}s` }}
          />
        ))}
      </span>
    );
  }

  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn("inline-flex items-center", gapMap[size], className)}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(box, "rounded-full bg-gold loader-dot")}
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
};

/** Full-bleed centered circle page loader for page-level async states. */
export const PageLoader: React.FC<{
  variant?: LoaderVariant;
  className?: string;
}> = ({ variant = "circle", className }) => (
  <div className="flex items-center justify-center py-16 sm:py-24" role="status">
    <Loader variant={variant} size="lg" className={className} />
  </div>
);

/** Full-viewport centered circle loader shown while the whole app boots. */
export const FullPageLoader: React.FC<{ className?: string }> = ({
  className,
}) => (
  <div
    className="min-h-screen w-full flex items-center justify-center bg-cream dark:bg-black"
    role="status"
    aria-label="Loading"
  >
    <Loader variant="circle" size="lg" className={className} />
  </div>
);
