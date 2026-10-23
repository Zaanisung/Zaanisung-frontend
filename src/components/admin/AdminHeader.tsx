import React from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { ExternalLink, Bell, User } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ title, subtitle, action }) => {
  const { currentUser, navigateTo } = useApp();

  return (
    <header className="bg-[#FFFFFF] border-b border-[#E4DED3] px-6 sm:px-8 py-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#171512] tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-[#716C64] mt-0.5 font-light">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          {action}
          
          <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-[#E4DED3] text-xs text-[#716C64]">
            <User size={14} className="text-[#92733C]" />
            <span className="font-medium text-[#171512]">{currentUser?.name || 'Administrator'}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateTo('home')}
            rightIcon={<ExternalLink size={12} />}
          >
            Live Store
          </Button>
        </div>
      </div>
    </header>
  );
};
