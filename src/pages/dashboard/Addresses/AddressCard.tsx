import React from "react";
import type { Address } from "../../../types/user";
import { Star, User, Phone, Pencil, Trash2 } from "lucide-react";

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export const AddressCard: React.FC<AddressCardProps> = ({
  address: addr,
  onEdit,
  onDelete,
  onSetDefault,
}) => {
  return (
    <div
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
            onClick={() => onSetDefault(addr._id)}
            className="min-h-[36px] px-3 text-[10px] uppercase tracking-wider font-bold text-gold border border-gold/40 hover:bg-gold/10 transition-colors flex items-center gap-1"
          >
            <Star className="w-3 h-3" />
            Make default
          </button>
        )}
        <button
          type="button"
          onClick={() => onEdit(addr)}
          className="min-h-[36px] px-3 text-[10px] uppercase tracking-wider font-bold text-black/60 dark:text-white/60 border border-black/15 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-1"
        >
          <Pencil className="w-3 h-3" />
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(addr._id)}
          className="min-h-[36px] px-3 text-[10px] uppercase tracking-wider font-bold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors flex items-center gap-1"
        >
          <Trash2 className="w-3 h-3" />
          Remove
        </button>
      </div>
    </div>
  );
};