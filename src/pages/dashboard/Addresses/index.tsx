import React, { useState } from "react";
import type { Address } from "../../../types/user";
import { EmptyState } from "../../../components/ui/EmptyState";
import { MapPin, Plus } from "lucide-react";
import { AddressCard } from "./AddressCard";
import { AddressForm } from "./AddressForm";

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

  const editingAddress = editingId
    ? addresses.find((a) => a._id === editingId) ?? null
    : null;

  const handleSave = (data: Omit<Address, "_id" | "isDefault">) => {
    if (editingId) {
      onUpdateAddress(editingId, data);
    } else {
      onAddAddress({ ...data, isDefault: addresses.length === 0 });
    }
    setShowForm(false);
    setEditingId(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
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
            onClick={() => setShowForm(true)}
            className="min-h-[44px] px-4 py-2 text-xs uppercase tracking-wider font-bold text-ink bg-gold hover:bg-gold-600 transition-colors flex items-center gap-2 rounded-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Add Address</span>
          </button>
        )}
      </div>

      {showForm && (
        <AddressForm
          key={editingId ?? "new"}
          editing={editingAddress}
          onSave={handleSave}
          onCancel={handleCancel}
        />
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
                className="w-full min-h-[44px] px-5 text-xs uppercase tracking-wider font-bold text-ink bg-gold hover:bg-gold-600 transition-colors flex items-center justify-center gap-2 rounded-lg"
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
            <AddressCard
              key={addr._id}
              address={addr}
              onEdit={(a) => {
                setEditingId(a._id);
                setShowForm(true);
              }}
              onDelete={onDeleteAddress}
              onSetDefault={onSetDefaultAddress}
            />
          ))}
        </div>
      )}
    </div>
  );
};