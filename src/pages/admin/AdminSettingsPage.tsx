import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Shield, Key, Sliders, CheckCircle2 } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { addToast } = useApp();

  const [storeName, setStoreName] = useState('ZAANISUNG');
  const [currency, setCurrency] = useState('GHS');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState('1500');
  const [accraCourierFee, setAccraCourierFee] = useState('50');
  const [regionalCourierFee, setRegionalCourierFee] = useState('90');
  const [paystackMode, setPaystackMode] = useState('test');
  const [paystackPublicKey, setPaystackPublicKey] = useState('pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxx');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      type: 'success',
      title: 'Settings Saved',
      message: 'Commerce configuration and Paystack environment refreshed.',
    });
  };

  return (
    <div className="flex-1 min-h-screen bg-[#FAF8F4] flex flex-col text-left">
      <AdminHeader
        title="Commerce & Integration Settings"
        subtitle="Operational parameters, courier thresholds, and Paystack integration contracts"
      />

      <div className="p-6 sm:p-8 max-w-4xl space-y-8">
        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* General Store Parameters */}
          <div className="bg-[#FFFFFF] border border-[#E4DED3] p-6 rounded-xs shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E4DED3]">
              <Sliders size={16} className="text-[#92733C]" />
              <h3 className="font-serif text-base font-semibold text-[#171512]">
                Store Identity & Currency
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Store Trading Name"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                required
              />
              <Select
                label="Primary Operating Currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                options={[
                  { value: 'GHS', label: 'Ghanaian Cedi (GH₵ / GHS)' },
                  { value: 'USD', label: 'United States Dollar (USD)' },
                ]}
              />
            </div>
          </div>

          {/* Delivery & Logistics Fees */}
          <div className="bg-[#FFFFFF] border border-[#E4DED3] p-6 rounded-xs shadow-xs space-y-4">
            <h3 className="font-serif text-base font-semibold text-[#171512] pb-3 border-b border-[#E4DED3]">
              Ghana Domestic Courier Thresholds (GHS)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Accra Free Shipping Threshold"
                type="number"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(e.target.value)}
                required
              />
              <Input
                label="Standard Accra Courier Fee"
                type="number"
                value={accraCourierFee}
                onChange={(e) => setAccraCourierFee(e.target.value)}
                required
              />
              <Input
                label="Regional Delivery Fee (Kumasi/Other)"
                type="number"
                value={regionalCourierFee}
                onChange={(e) => setRegionalCourierFee(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Paystack Gateway Integration Notice */}
          <div className="bg-[#FFFFFF] border border-[#E4DED3] p-6 rounded-xs shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E4DED3]">
              <Shield size={16} className="text-[#92733C]" />
              <h3 className="font-serif text-base font-semibold text-[#171512]">
                Paystack Payment Gateway Configuration
              </h3>
            </div>

            <p className="text-xs text-[#716C64] leading-relaxed">
              In accordance with security guidelines, private server secret keys are managed through server environment variables (<code className="bg-[#FAF8F4] px-1 py-0.5 border border-[#E4DED3] text-[#171512]">PAYSTACK_SECRET_KEY</code>) and never exposed to client-side code.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Environment Mode"
                value={paystackMode}
                onChange={(e) => setPaystackMode(e.target.value)}
                options={[
                  { value: 'test', label: 'Sandbox / Test Mode' },
                  { value: 'live', label: 'Production Live Mode' },
                ]}
              />
              <Input
                label="Public Key (Client-Safe)"
                value={paystackPublicKey}
                onChange={(e) => setPaystackPublicKey(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="primary" size="md">
              Save Configuration
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
