import React, { useState } from "react";
import type { Address } from "../../../types/user";
import { GHANA_PHONE_REGEX } from "../../../constants";
import { X } from "lucide-react";

const inputClass =
  "w-full min-h-[44px] px-3 py-2 text-sm bg-white dark:bg-white/5 border border-black/15 dark:border-white/20 text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none focus:border-gold transition-colors";

interface AddressFormProps {
  /** When present, the form pre-fills and submits an update instead of a create. */
  editing: Address | null;
  onSave: (data: Omit<Address, "_id" | "isDefault">) => void;
  onCancel: () => void;
}

export const AddressForm: React.FC<AddressFormProps> = ({
  editing,
  onSave,
  onCancel,
}) => {
  const [label, setLabel] = useState(editing?.label ?? "");
  const [recipientName, setRecipientName] = useState(editing?.recipientName ?? "");
  const [phone, setPhone] = useState(editing?.phone ?? "");
  const [streetAddress, setStreetAddress] = useState(editing?.streetAddress ?? "");
  const [city, setCity] = useState(editing?.city ?? "");
  const [region, setRegion] = useState(editing?.region ?? "");
  const [digitalAddress, setDigitalAddress] = useState(editing?.digitalAddress ?? "");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!GHANA_PHONE_REGEX.test(phone.trim().replace(/[\s-]/g, ""))) {
      setError("Please enter a valid Ghanaian phone number, e.g. +233 24 000 0000.");
      return;
    }
    onSave({
      label,
      recipientName,
      phone,
      streetAddress,
      city,
      region,
      digitalAddress: digitalAddress || undefined,
    });
  };

  return (
    <div className="border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/[0.03] p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs uppercase tracking-widest text-black dark:text-white font-bold">
          {editing ? "Edit Address" : "New Address"}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-black/45 dark:text-white/45 hover:text-black dark:hover:text-white transition-colors"
          aria-label="Cancel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-black/45 dark:text-white/45 font-bold block mb-1.5">
              Label
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Home, Office"
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-black/45 dark:text-white/45 font-bold block mb-1.5">
              Recipient Name
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-black/45 dark:text-white/45 font-bold block mb-1.5">
              Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+233 24 000 0000"
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-black/45 dark:text-white/45 font-bold block mb-1.5">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-black/45 dark:text-white/45 font-bold block mb-1.5">
              Region
            </label>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-black/45 dark:text-white/45 font-bold block mb-1.5">
              Digital Address{" "}
              <span className="text-black/30 dark:text-white/30 normal-case">(optional)</span>
            </label>
            <input
              type="text"
              value={digitalAddress}
              onChange={(e) => setDigitalAddress(e.target.value)}
              placeholder="e.g. GA-123-4567"
              className={inputClass}
            />
          </div>
        </div>
        <div className="w-full">
          <label className="text-[10px] uppercase tracking-widest text-black/45 dark:text-white/45 font-bold block mb-1.5">
            Street Address
          </label>
          <input
            type="text"
            value={streetAddress}
            onChange={(e) => setStreetAddress(e.target.value)}
            required
            className={inputClass}
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="min-h-[44px] px-5 text-xs uppercase tracking-wider font-bold text-ink bg-gold hover:bg-gold-600 transition-colors flex items-center gap-2"
          >
            <span>{editing ? "Save Changes" : "Add Address"}</span>
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="min-h-[44px] px-5 text-xs uppercase tracking-wider font-bold text-black/60 dark:text-white/60 border border-black/15 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};