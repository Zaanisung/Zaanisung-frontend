import React, { useState } from 'react';
import { X } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-[#171512] text-[#F8F5EF] text-[11px] sm:text-xs py-2 px-4 transition-all border-b border-[#2A241F]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="w-6" /> {/* Balance spacer */}
        <p className="text-center font-normal tracking-wider flex-1 truncate">
          Complimentary white-glove courier delivery across Greater Accra on orders exceeding GH₵ 1,500.
        </p>
        <button
          onClick={() => setIsVisible(false)}
          aria-label="Dismiss announcement banner"
          className="text-[#A8A29E] hover:text-[#FFFFFF] p-1 transition-colors cursor-pointer shrink-0"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
};
