import React from "react";
import { Smartphone, CreditCard, Building2, Banknote } from "lucide-react";

/**
 * A set of inline brand marks used to visually represent the specific
 * payment provider/network selected by the user (e.g. MTN MoMo, Telecel,
 * AirtelTigo, Visa, Mastercard). Falls back to a generic glyph when the
 * brand is unknown.
 */

type BrandName =
  | "mtn"
  | "momo"
  | "telecel"
  | "airteltigo"
  | "at"
  | "visa"
  | "mastercard"
  | "amex"
  | "cash"
  | "bank"
  | "card";

function normalizeBrand(provider?: string): BrandName | null {
  if (!provider) return null;
  const p = provider.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (p.includes("mtn") || p.includes("momo")) return "momo";
  if (p.includes("telecel") || p.includes("vodafone")) return "telecel";
  if (p.includes("airtel") || p.includes("tigo") || p === "at" || p.includes("atmoney")) return "airteltigo";
  if (p.includes("visa")) return "visa";
  if (p.includes("mastercard") || p === "mc") return "mastercard";
  if (p.includes("amex") || p.includes("american")) return "amex";
  if (p.includes("cash") || p.includes("cod")) return "cash";
  if (p.includes("bank")) return "bank";
  if (p.includes("card")) return "card";
  return null;
}

interface LogoProps {
  className?: string;
}

const MTNMoMoLogo: React.FC<LogoProps> = ({ className }) => (
  <svg viewBox="0 0 48 30" className={className} role="img" aria-label="MTN MoMo">
    <rect width="48" height="30" rx="3" fill="#FFCC00" />
    <text x="24" y="21" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="13" fill="#1B1B1B">
      MoMo
    </text>
  </svg>
);

const TelecelLogo: React.FC<LogoProps> = ({ className }) => (
  <svg viewBox="0 0 48 30" className={className} role="img" aria-label="Telecel">
    <rect width="48" height="30" rx="3" fill="#E4002B" />
    <text x="24" y="21" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="11" fill="#fff">
      Telecel
    </text>
  </svg>
);

const AirtelTigoLogo: React.FC<LogoProps> = ({ className }) => (
  <svg viewBox="0 0 48 30" className={className} role="img" aria-label="AirtelTigo">
    <rect width="48" height="30" rx="3" fill="#ED1C24" />
    <text x="24" y="21" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="10" fill="#fff">
      AirtelTigo
    </text>
  </svg>
);

const VisaLogo: React.FC<LogoProps> = ({ className }) => (
  <svg viewBox="0 0 48 30" className={className} role="img" aria-label="Visa">
    <rect width="48" height="30" rx="3" fill="#1A1F71" />
    <text x="24" y="20" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold" fontStyle="italic" fontSize="18" fill="#fff">
      VISA
    </text>
  </svg>
);

const MastercardLogo: React.FC<LogoProps> = ({ className }) => (
  <svg viewBox="0 0 48 30" className={className} role="img" aria-label="Mastercard">
    <rect width="48" height="30" rx="3" fill="#fff" />
    <circle cx="20" cy="15" r="9" fill="#EB001B" opacity="0.9" />
    <circle cx="28" cy="15" r="9" fill="#F79E1B" opacity="0.9" />
  </svg>
);

const AmexLogo: React.FC<LogoProps> = ({ className }) => (
  <svg viewBox="0 0 48 30" className={className} role="img" aria-label="American Express">
    <rect width="48" height="30" rx="3" fill="#2E77BC" />
    <text x="24" y="20" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="12" fill="#fff">
      AMEX
    </text>
  </svg>
);

const CashLogo: React.FC<LogoProps> = ({ className }) => (
  <svg viewBox="0 0 48 30" className={className} role="img" aria-label="Cash on Delivery">
    <rect width="48" height="30" rx="3" fill="#2F7D32" />
    <text x="24" y="20" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="11" fill="#fff">
      CASH
    </text>
  </svg>
);

const BankLogo: React.FC<LogoProps> = ({ className }) => (
  <svg viewBox="0 0 48 30" className={className} role="img" aria-label="Bank Transfer">
    <rect width="48" height="30" rx="3" fill="#5B6770" />
    <text x="24" y="20" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="10" fill="#fff">
      BANK
    </text>
  </svg>
);

const CardLogo: React.FC<LogoProps> = ({ className }) => (
  <svg viewBox="0 0 48 30" className={className} role="img" aria-label="Card">
    <rect width="48" height="30" rx="3" fill="#8A6D3B" />
    <text x="24" y="20" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="11" fill="#fff">
      CARD
    </text>
  </svg>
);

/**
 * Resolve the appropriate brand logo for a payment method based on its
 * provider / network / card brand / type. Falls back to a neutral glyph.
 */
export const PaymentMethodLogo: React.FC<{
  className?: string;
  provider?: string;
  type?: string;
  details?: Partial<{
    momoNetwork?: string;
    cardBrand?: string;
    bankName?: string;
  }>;
}> = ({ className = "w-8 h-6", provider, type, details }) => {
  const source = provider || details?.momoNetwork || details?.cardBrand || type || "";
  const brand = normalizeBrand(source);

  switch (brand) {
    case "momo":
      return <MTNMoMoLogo className={className} />;
    case "telecel":
      return <TelecelLogo className={className} />;
    case "airteltigo":
      return <AirtelTigoLogo className={className} />;
    case "visa":
      return <VisaLogo className={className} />;
    case "mastercard":
      return <MastercardLogo className={className} />;
    case "amex":
      return <AmexLogo className={className} />;
    case "cash":
      return <CashLogo className={className} />;
    case "bank":
      return <BankLogo className={className} />;
    case "card":
      return <CardLogo className={className} />;
    default: {
      // Generic fallback based on payment type
      if (type === "MOBILE_MONEY") {
        return (
          <div className={`${className} bg-black/5 dark:bg-white/10 flex items-center justify-center`}>
            <Smartphone className="w-4 h-4 text-black/50 dark:text-white/50" />
          </div>
        );
      }
      if (type === "CARD") {
        return (
          <div className={`${className} bg-black/5 dark:bg-white/10 flex items-center justify-center`}>
            <CreditCard className="w-4 h-4 text-black/50 dark:text-white/50" />
          </div>
        );
      }
      if (type === "BANK") {
        return (
          <div className={`${className} bg-black/5 dark:bg-white/10 flex items-center justify-center`}>
            <Building2 className="w-4 h-4 text-black/50 dark:text-white/50" />
          </div>
        );
      }
      return (
        <div className={`${className} bg-black/5 dark:bg-white/10 flex items-center justify-center`}>
          <Banknote className="w-4 h-4 text-black/50 dark:text-white/50" />
        </div>
      );
    }
  }
};
