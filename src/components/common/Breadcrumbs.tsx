import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useApp, AppRoute } from '../../context/AppContext';

export interface Crumb {
  label: string;
  route?: AppRoute;
  params?: Record<string, string>;
}

export const Breadcrumbs: React.FC<{ items: Crumb[] }> = ({ items }) => {
  const { navigateTo } = useApp();

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-1.5 text-xs text-[#716C64]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5">
              {item.route && !isLast ? (
                <button
                  onClick={() => navigateTo(item.route!, item.params)}
                  className="hover:text-[#171512] transition-colors underline-offset-4 hover:underline cursor-pointer"
                >
                  {item.label}
                </button>
              ) : (
                <span className={isLast ? 'text-[#171512] font-medium' : ''}>
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight size={12} className="text-[#A8A29E]" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
