import React from "react";
import type { DashboardPage } from "../../types";
import { currentPageLabel } from "./navigation";

interface MobilePageTitleProps {
  activePage: DashboardPage;
}

/** Small breadcrumb-style title strip under the mobile header. */
export const MobilePageTitle: React.FC<MobilePageTitleProps> = ({
  activePage,
}) => {
  return (
    <div className="md:hidden bg-white/50 dark:bg-black/30 px-3 py-2.5 border-b border-black/5 dark:border-white/10 flex items-center justify-between gap-2">
      <p className="text-[10px] uppercase tracking-widest text-black/50 dark:text-white/50 font-semibold">
        {currentPageLabel(activePage)}
      </p>
      <span className="text-[10px] uppercase tracking-widest text-gold font-bold">
        Account
      </span>
    </div>
  );
};