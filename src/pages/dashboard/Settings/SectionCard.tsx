import React from "react";

interface SectionCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

/** Shared shell for each Settings card: icon + heading + body. */
export const SectionCard: React.FC<SectionCardProps> = ({
  icon,
  title,
  children,
}) => {
  return (
    <div className="border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/[0.03] p-5 sm:p-6 space-y-5 rounded-2xl">
      <div className="flex items-center gap-2 pb-3 border-b border-black/5 dark:border-white/10">
        {icon}
        <h3 className="text-xs uppercase tracking-widest text-black dark:text-white font-bold">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
};

export const settingsInputClass =
  "w-full min-h-[44px] px-3 py-2 text-sm bg-white dark:bg-white/5 border border-black/15 dark:border-white/20 text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none focus:border-gold transition-colors rounded-xl";