import React from 'react';
import { FulfillmentStatus, PaymentStatus } from '../../types';
import { StockStatus } from '../../utils/inventory';

/**
 * Status indicator compliant with Universal Frontend Design Constitution (Zero-Pill Rule).
 * Renders quiet, refined typographic status indicators without garish colored pill capsules.
 */

interface StatusBadgeProps {
  status: FulfillmentStatus | PaymentStatus | StockStatus | string;
  type?: 'fulfillment' | 'payment' | 'stock' | 'general';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'general' }) => {
  const formatText = (text: string) => {
    return text.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  let textColor = 'text-[#716C64]';
  let indicatorColor = 'bg-[#716C64]';

  if (status === 'delivered' || status === 'paid' || status === 'in_stock') {
    textColor = 'text-emerald-900';
    indicatorColor = 'bg-emerald-700';
  } else if (status === 'processing' || status === 'pending' || status === 'low_stock') {
    textColor = 'text-[#92733C]';
    indicatorColor = 'bg-[#B69A59]';
  } else if (status === 'shipped') {
    textColor = 'text-stone-800';
    indicatorColor = 'bg-stone-700';
  } else if (status === 'cancelled' || status === 'failed' || status === 'out_of_stock') {
    textColor = 'text-red-900';
    indicatorColor = 'bg-red-800';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium tracking-wide ${textColor} whitespace-nowrap`}>
      <span className={`w-1.5 h-1.5 rounded-full ${indicatorColor} shrink-0`} aria-hidden="true" />
      <span>{formatText(status)}</span>
    </span>
  );
};
