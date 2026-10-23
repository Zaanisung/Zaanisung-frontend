import React from 'react';
import { useApp } from '../../context/AppContext';
import { BRAND_CONFIG } from '../../config/assets';
import { FileCode2, Shield } from 'lucide-react';

export const StorefrontFooter: React.FC = () => {
  const { navigateTo, setIsIntegrationDocsOpen, loginAsAdmin, isAdmin } = useApp();

  return (
    <footer className="bg-[#171512] text-[#F8F5EF] pt-16 pb-12 border-t border-[#2A241F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-[#2A241F]">
          {/* Column 1: Brand & Identity */}
          <div className="md:col-span-1">
            <h4 className="font-serif text-2xl tracking-[0.25em] text-[#F8F5EF] mb-3">
              ZAANISUNG
            </h4>
            <p className="text-xs text-[#A8A29E] leading-relaxed mb-4">
              Artisanal luxury perfumery rooted in Ghanaian heritage and classical haute distillation. Formulated in Accra and Grasse with rare botanical oils and aged resins.
            </p>
            <div className="text-[11px] text-[#B69A59] tracking-wider uppercase">
              {BRAND_CONFIG.location} · West Africa
            </div>
          </div>

          {/* Column 2: Fragrance Collections */}
          <div>
            <h5 className="text-xs uppercase tracking-[0.18em] font-semibold text-[#B69A59] mb-4">
              Fragrance Atelier
            </h5>
            <ul className="space-y-2.5 text-xs text-[#D6D3D1]">
              <li>
                <button
                  onClick={() => navigateTo('catalog', { family: 'Woody & Oriental' })}
                  className="hover:text-[#FFFFFF] transition-colors cursor-pointer"
                >
                  Woody & Oriental Resins
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('catalog', { family: 'Amber & Warm' })}
                  className="hover:text-[#FFFFFF] transition-colors cursor-pointer"
                >
                  Amber & Single-Estate Cocoa
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('catalog', { family: 'Fresh & Citrus' })}
                  className="hover:text-[#FFFFFF] transition-colors cursor-pointer"
                >
                  River & Coastal Marine Notes
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('catalog', { family: 'Floral & Delicate' })}
                  className="hover:text-[#FFFFFF] transition-colors cursor-pointer"
                >
                  Botanical Florals & Neroli
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('catalog')}
                  className="hover:text-[#FFFFFF] transition-colors font-medium text-[#B69A59] cursor-pointer"
                >
                  View All Flacons →
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Client Experience & Care */}
          <div>
            <h5 className="text-xs uppercase tracking-[0.18em] font-semibold text-[#B69A59] mb-4">
              Client Concierge
            </h5>
            <ul className="space-y-2.5 text-xs text-[#D6D3D1]">
              <li>
                <button
                  onClick={() => navigateTo('account')}
                  className="hover:text-[#FFFFFF] transition-colors cursor-pointer"
                >
                  Client Account & Orders
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="hover:text-[#FFFFFF] transition-colors cursor-pointer"
                >
                  Private Consultation & Inquiries
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('legal', { tab: 'delivery' })}
                  className="hover:text-[#FFFFFF] transition-colors cursor-pointer"
                >
                  Ghana Delivery & Logistics
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('legal', { tab: 'terms' })}
                  className="hover:text-[#FFFFFF] transition-colors cursor-pointer"
                >
                  Terms of Service & Privacy
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Payment & Operational Reassurance */}
          <div>
            <h5 className="text-xs uppercase tracking-[0.18em] font-semibold text-[#B69A59] mb-4">
              Secure Commerce
            </h5>
            <p className="text-xs text-[#A8A29E] leading-relaxed mb-4">
              All online transactions are processed through encrypted channels via Paystack, supporting Visa, Mastercard, and Ghana Mobile Money.
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 text-[11px] text-[#A8A29E] border border-[#2A241F] px-3 py-1.5 rounded-xs bg-[#1F1C18]">
                <Shield size={13} className="text-[#B69A59]" />
                <span>Verified Paystack Integration</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#716C64]">
          <p>© {new Date().getFullYear()} ZAANISUNG. All rights reserved. Prices in Ghanaian Cedis (GHS).</p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsIntegrationDocsOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs text-[#B69A59] hover:text-[#DFC98F] transition-colors underline-offset-4 hover:underline cursor-pointer"
            >
              <FileCode2 size={13} />
              <span>Integration Specs & Screen Matrix</span>
            </button>
            <span aria-hidden="true" className="text-[#3A352F]">·</span>
            {!isAdmin ? (
              <button
                onClick={loginAsAdmin}
                className="hover:text-[#A8A29E] transition-colors cursor-pointer"
              >
                Admin Sign-In
              </button>
            ) : (
              <button
                onClick={() => navigateTo('admin-dashboard')}
                className="text-[#B69A59] hover:text-[#FFFFFF] transition-colors cursor-pointer font-medium"
              >
                Admin Console
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
