import React from 'react';
import { Button } from '../../components/common/Button';
import { useApp } from '../../context/AppContext';

export const NotFoundPage: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 py-24 sm:py-32 text-center">
      <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#92733C] block mb-2">
        Page Not Found
      </span>
      <h1 className="font-serif text-4xl sm:text-5xl text-[#171512] font-normal mb-4">
        404 · Uncharted Notes
      </h1>
      <p className="text-xs sm:text-sm text-[#716C64] max-w-md mx-auto mb-8 font-light">
        The fragrance formulation or page you requested could not be located in our current catalog.
      </p>
      <Button variant="primary" size="md" onClick={() => navigateTo('home')}>
        Return to the Atelier
      </Button>
    </div>
  );
};
