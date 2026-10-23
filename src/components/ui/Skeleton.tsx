import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = 'h-4 w-full' }) => {
  return (
    <div
      className={`bg-[#E4DED3]/60 animate-pulse rounded-xs ${className}`}
      aria-hidden="true"
    />
  );
};
