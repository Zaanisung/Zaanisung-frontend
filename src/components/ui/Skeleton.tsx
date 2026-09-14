import LoadingSkeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import type { SkeletonProps } from "react-loading-skeleton";
import { cn } from "../../utils/cn";

/**
 * Shared shimmer skeleton built on `react-loading-skeleton`.
 *
 * Colours come from CSS variables so they follow the app's light/dark theme.
 * Use `containerClassName` (or the handful of layouts below) to shape the
 * skeleton placeholder to match the real content it is replacing.
 */
export const Skeleton: React.FC<SkeletonProps & { className?: string }> = ({
  className,
  containerClassName,
  ...rest
}) => (
  <SkeletonTheme baseColor="var(--skeleton-base)" highlightColor="var(--skeleton-highlight)">
    <LoadingSkeleton
      className={cn("[--base-color:var(--skeleton-base)] [--highlight-color:var(--skeleton-highlight)]", className)}
      containerClassName={containerClassName}
      {...rest}
    />
  </SkeletonTheme>
);

/** Skeleton shaped like the shared ProductCard (uses the card surface classes). */
export const ProductCardSkeleton: React.FC = () => (
  <div className="flex h-full w-full flex-col overflow-hidden rounded-[18px] border border-black/10 dark:border-white/10 bg-[#fffdf9] dark:bg-[#171717]">
    <Skeleton className="w-full aspect-square !rounded-none" />
    <div className="flex flex-col gap-2.5 p-3 sm:p-4">
      <Skeleton width="70%" height={16} />
      <Skeleton width="45%" height={12} />
      <div className="flex items-center justify-between mt-auto pt-2">
        <Skeleton width="38%" height={16} />
        <Skeleton width="22%" height={12} />
      </div>
      <Skeleton className="!rounded-xl" height={40} />
    </div>
  </div>
);

/** Skeleton shaped like a compact list row (orders, alerts, users, …). */
export const ListRowSkeleton: React.FC<{ lines?: number }> = ({ lines = 1 }) => (
  <div className="flex items-center justify-between gap-3 p-4 sm:p-5 surface-glass-strong">
    <div className="flex-1 min-w-0 space-y-2">
      <Skeleton width="55%" height={14} />
      <Skeleton width="30%" height={12} />
      {lines > 1 && <Skeleton width="45%" height={12} />}
    </div>
    <Skeleton width={72} height={14} />
  </div>
);