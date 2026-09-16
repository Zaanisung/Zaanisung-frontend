import React, { useState } from "react";
import { cn } from "../../utils/cn";
import { resolveApiUrl } from "../../services/apiClient";

export interface ProductImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallback?: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  className,
  fallback = "Z",
}) => {
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    return (
      <img
        src={resolveApiUrl(src)}
        alt={alt}
        onError={() => setFailed(true)}
        className={cn("object-cover object-center", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center text-xs uppercase tracking-widest text-black/45 dark:text-white/45 bg-white dark:bg-white/20",
        className
      )}
      role="img"
      aria-label={alt}
    >
      {fallback}
    </div>
  );
};