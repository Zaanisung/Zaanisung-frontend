import React, { useState } from "react";
import type { Address } from "../../types/user";
import { EmptyState } from "../../components/ui/EmptyState";
import { Loader } from "../../components/ui/Loader";
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Star,
  X,
  Phone,
  User,
} from "lucide-react";

export interface AddressesProps {
  addresses: Address[];
  onAddAddress: (
    data: Omit<Address, "_id" | "isDefault"> & { isDefault?: boolean }
  ) => void;
  onUpdateAddress: (id: string, data: Partial<Omit<Address, "_id">>) => void;
  onDeleteAddress: (id: string) => void;
  onSetDefaultAddress: (id: string) => void;
}

export const Addresses: React.FC<AddressesProps> = ({
  addresses,
  onAddAddress,
  onUpdateAddress,
  onDeleteAddress,
  onSetDefaultAddress,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [label, setLabel] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [phone, setPhone] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [digitalAddress, setDigitalAddress] = useState("");
  const [loading] = useState(false);

  const resetForm = () => {
    setLabel("");
    setRecipientName("");
    setPhone("");
    setStreetAddress("");
    setCity("");
    setRegion("");
    setDigitalAddress("");
    setShowForm(false);
    setEditingId(null);
  };

  const startEdit = (addr: Address) => {
    setEditingId(addr._id);
    setLabel(addr.label);
    setRecipientName(addr.recipientName);
    setPhone(addr.phone);
    setStreetAddress(addr.streetAddress);
    setCity(addr.city);
    setRegion(addr.region);
    setDigitalAddress(addr.digitalAddress ?? "");
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      label,
      recipientName,
      phone,
      streetAddress,
      city,
      region,
      digitalAddress: digitalAddress || undefined,
    };

    if (editingId) {
      onUpdateAddress(editingId, data);
    } else {
      onAddAddress({ ...data, isDefault: addresses.length === 0 });
    }
    resetForm();
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="eyebrow text-black/45 dark:text-white/45 mb-1">
            Delivery Locations
          </p>
          <h2 className="text-2xl font-light text-black dark:text-white font-brand-serif">
            My Addresses
          </h2>
        </div>
        {!showForm && (
          <button
            type="button"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="min-h-[44px] px-4 py-2 text-xs uppercase tracking-wider font-bold text-ink bg-gold hover:bg-gold-600 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Address</span>
          </button>
        )}
      </div>

      {showForm && (
        <div className="border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/[0.03] p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs uppercase tracking-widest text-black dark:text-white font-bold">
              {editingId ? "Edit Address" : "New Address"}
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-black/45 dark:text-white/45 hover:text-black dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="w-full min-h-[44px] px-3 py-2 text-sm bg-white dark:bg-white/5 border border-black/15 dark:border-white/20 text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none focus:border-gold transition-colors"
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
                  className="w-full min-h-[44px] px-3 py-2 text-sm bg-white dark:bg-white/5 border border-black/15 dark:border-white/20 text-black dark:text-white focus:outline-none focus:border-gold transition-colors"
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
                  required
                  className="w-full min-h-[44px] px-3 py-2 text-sm bg-white dark:bg-white/5 border border-black/15 dark:border-white/20 text-black dark:text-white focus:outline-none focus:border-gold transition-colors"
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
                  className="w-full min-h-[44px] px-3 py-2 text-sm bg-white dark:bg-white/5 border border-black/15 dark:border-white/20 text-black dark:text-white focus:outline-none focus:border-gold transition-colors"
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
                  className="w-full min-h-[44px] px-3 py-2 text-sm bg-white dark:bg-white/5 border border-black/15 dark:border-white/20 text-black dark:text-white focus:outline-none focus:border-gold transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-black/45 dark:text-white/45 font-bold block mb-1.5">
                  Digital Address{" "}
                  <span className="text-black/30 dark:text-white/30 normal-case">
                    (optional)
                  </span>
                </label>
                <input
                  type="text"
                  value={digitalAddress}
                  onChange={(e) => setDigitalAddress(e.target.value)}
                  placeholder="e.g. GA-123-4567"
                  className="w-full min-h-[44px] px-3 py-2 text-sm bg-white dark:bg-white/5 border border-black/15 dark:border-white/20 text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none focus:border-gold transition-colors"
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
                className="w-full min-h-[44px] px-3 py-2 text-sm bg-white dark:bg-white/5 border border-black/15 dark:border-white/20 text-black dark:text-white focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="min-h-[44px] px-5 text-xs uppercase tracking-wider font-bold text-ink bg-gold hover:bg-gold-600 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {loading && <Loader variant="dots" size="sm" />}
                <span>{editingId ? "Save Changes" : "Add Address"}</span>
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="min-h-[44px] px-5 text-xs uppercase tracking-wider font-bold text-black/60 dark:text-white/60 border border-black/15 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {addresses.length === 0 && !showForm ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <EmptyState
            icon={<MapPin className="w-6 h-6 stroke-[1.5]" />}
            title="No saved addresses"
            message="Add a delivery address so checkout is faster next time."
            action={
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="w-full min-h-[44px] px-5 text-xs uppercase tracking-wider font-bold text-ink bg-gold hover:bg-gold-600 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Your First Address</span>
              </button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className={`border bg-white/60 dark:bg-white/[0.03] p-5 space-y-3 transition-colors ${
                addr.isDefault
                  ? "border-gold/50 bg-gold/5"
                  : "border-black/10 dark:border-white/15"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-black dark:text-white">
                    {addr.label}
                  </span>
                  {addr.isDefault && (
                    <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 font-bold bg-gold/15 text-gold border border-gold/40 flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-gold" />
                      Default
                    </span>
                  )}
                </div>
                {addr.digitalAddress && (
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 font-bold bg-black/5 dark:bg-white/10 text-black/60 dark:text-white/60 border border-black/10 dark:border-white/15">
                    {addr.digitalAddress}
                  </span>
                )}
              </div>

              <div className="space-y-1.5 text-xs text-black/60 dark:text-white/60">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-black/40 dark:text-white/40" />
                  <span>{addr.recipientName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-black/40 dark:text-white/40" />
                  <span className="font-mono">{addr.phone}</span>
                </div>
              </div>

              <p className="text-xs text-black/50 dark:text-white/50 leading-relaxed">
                {addr.streetAddress}, {addr.city}, {addr.region}
              </p>

              <div className="flex items-center gap-2 pt-2 border-t border-black/5 dark:border-white/10">
                {!addr.isDefault && (
                  <button
                    type="button"
                    onClick={() => onSetDefaultAddress(addr._id)}
                    className="min-h-[36px] px-3 text-[10px] uppercase tracking-wider font-bold text-gold border border-gold/40 hover:bg-gold/10 transition-colors flex items-center gap-1"
                  >
                    <Star className="w-3 h-3" />
                    Make default
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => startEdit(addr)}
                  className="min-h-[36px] px-3 text-[10px] uppercase tracking-wider font-bold text-black/60 dark:text-white/60 border border-black/15 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-1"
                >
                  <Pencil className="w-3 h-3" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteAddress(addr._id)}
                  className="min-h-[36px] px-3 text-[10px] uppercase tracking-wider font-bold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
