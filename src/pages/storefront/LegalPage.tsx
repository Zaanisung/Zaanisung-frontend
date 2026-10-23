import React, { useState } from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { useApp } from '../../context/AppContext';

export const LegalPage: React.FC = () => {
  const { routeParams } = useApp();
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'delivery'>(
    (routeParams.tab as any) || 'terms'
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 text-left">
      <Breadcrumbs items={[{ label: 'Home', route: 'home' }, { label: 'Legal & Policies' }]} />

      <div className="mb-8 pb-4 border-b border-[#E4DED3]">
        <h1 className="font-serif text-3xl sm:text-4xl text-[#171512] font-normal tracking-tight">
          Policies & Commercial Terms
        </h1>
        <p className="text-xs text-[#716C64] mt-1 font-light">
          Last reviewed October 2026 · Operating under laws of the Republic of Ghana.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E4DED3] mb-8 gap-6 text-xs uppercase tracking-wider font-semibold">
        <button
          onClick={() => setActiveTab('terms')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'terms' ? 'border-[#B69A59] text-[#171512]' : 'border-transparent text-[#716C64]'
          }`}
        >
          Terms of Service
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'privacy' ? 'border-[#B69A59] text-[#171512]' : 'border-transparent text-[#716C64]'
          }`}
        >
          Privacy Policy
        </button>
        <button
          onClick={() => setActiveTab('delivery')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'delivery' ? 'border-[#B69A59] text-[#171512]' : 'border-transparent text-[#716C64]'
          }`}
        >
          Delivery & Returns
        </button>
      </div>

      {/* Content */}
      <div className="bg-[#FFFFFF] border border-[#E4DED3] p-8 rounded-xs shadow-xs text-xs sm:text-sm text-[#716C64] leading-relaxed space-y-6">
        {activeTab === 'terms' && (
          <>
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#171512] mb-2">1. Boutique Commercial Terms</h3>
              <p>
                By placing an order with ZAANISUNG via our digital platform, you agree to these terms. Prices are denominated in Ghanaian Cedis (GHS) and include statutory local taxes. All inventory availability is subject to physical flacon allocations in our Accra facility.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#171512] mb-2">2. Payment & Authorization</h3>
              <p>
                Online orders are billed securely via Paystack Ghana. We accept Visa, Mastercard, and registered Ghanaian mobile money wallets (MTN MoMo, Telecel Cash, AT Money). Ownership passes once funds are confirmed.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#171512] mb-2">3. Product Integrity & Authenticity</h3>
              <p>
                All ZAANISUNG perfumes are formulated without unnecessary fillers, adhering to IFRA safety standards and hand-sealed with an individual batch code.
              </p>
            </div>
          </>
        )}

        {activeTab === 'privacy' && (
          <>
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#171512] mb-2">1. Client Data Confidentiality</h3>
              <p>
                We collect your name, phone number, delivery address, and email strictly for the fulfillment of orders and personal concierge communications. We do not sell or monetize client records to third parties.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#171512] mb-2">2. Payment Security</h3>
              <p>
                Payment card numbers and mobile money PINs are processed directly inside Paystack&apos;s PCI-DSS Level 1 compliant infrastructure. ZAANISUNG servers never capture or store raw debit/credit card CVVs.
              </p>
            </div>
          </>
        )}

        {activeTab === 'delivery' && (
          <>
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#171512] mb-2">1. Ghana Delivery Timelines</h3>
              <p>
                Greater Accra courier dispatches occur within 24 to 48 hours following payment confirmation. Regional deliveries to Kumasi, Takoradi, Sunyani, and Tamale are fulfilled through our dedicated regional logistics partners within 48 to 72 hours.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#171512] mb-2">2. Returns & Tamper Seals</h3>
              <p>
                Due to the intimate nature of haute fragrance formulations, returns are only accepted if the external cellophane box and tamper-evident seal remain completely intact and untampered within 7 days of delivery.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
