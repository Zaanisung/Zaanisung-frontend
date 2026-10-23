import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  side?: 'right' | 'left';
  width?: 'sm' | 'md' | 'lg';
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  side = 'right',
  width = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthStyles = {
    sm: 'max-w-xs',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  const sideStyles = {
    right: 'right-0',
    left: 'left-0',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#171512]/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className={`fixed inset-y-0 ${sideStyles[side]} flex max-w-full pl-10`}>
        <div className={`w-screen ${widthStyles[width]} bg-[#FAF8F4] border-l border-[#E4DED3] shadow-2xl flex flex-col z-10 animate-drawer-slide`}>
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#E4DED3] flex items-center justify-between bg-[#FFFFFF]">
            <div>
              {title && (
                <h3 className="font-serif text-xl font-semibold text-[#171512] tracking-wide">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-[#716C64] mt-0.5">{subtitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              aria-label="Close drawer"
              className="p-2 text-[#716C64] hover:text-[#171512] transition-colors rounded-sm hover:bg-[#F0ECE5] cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
