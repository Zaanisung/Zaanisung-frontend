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
    <rect width="48" height="30" rx="4" fill="#FFCB05" />
    <rect width="48" height="30" rx="4" fill="url(#mtnGradient)" />
    <defs>
      <linearGradient id="mtnGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#FFCB05", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#F5B800", stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <text x="24" y="20" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="12" fill="#1B1B1B" letterSpacing="0.5">
      MoMo
    </text>
  </svg>
);

const TelecelLogo: React.FC<LogoProps> = ({ className }) => (
  <svg viewBox="0 0 48 30" className={className} role="img" aria-label="Telecel">
    <rect width="48" height="30" rx="4" fill="url(#telecelGradient)" />
    <defs>
      <linearGradient id="telecelGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#E4002B", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#C00024", stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <text x="24" y="20" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="10" fill="#fff" letterSpacing="0.3">
      Telecel
    </text>
  </svg>
);

const AirtelTigoLogo: React.FC<LogoProps> = ({ className }) => (
  <svg viewBox="0 0 48 30" className={className} role="img" aria-label="AT Money">
    <rect width="48" height="30" rx="4" fill="url(#atGradient)" />
    <defs>
      <linearGradient id="atGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#ED1C24", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#D01820", stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <text x="24" y="20" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="11" fill="#fff" letterSpacing="0.5">
      AT
    </text>
  </svg>
);

const VisaLogo: React.FC<LogoProps> = ({ className }) => (
  <svg viewBox="0 0 48 30" className={className} role="img" aria-label="Visa">
    <rect width="48" height="30" rx="4" fill="url(#visaGradient)" />
    <defs>
      <linearGradient id="visaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#1A1F71", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#14185A", stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <text x="24" y="19" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="16" fill="#fff" letterSpacing="1">
      VISA
    </text>
  </svg>
);

const MastercardLogo: React.FC<LogoProps> = ({ className }) => (
  <svg viewBox="0 0 48 30" className={className} role="img" aria-label="Mastercard">
    <rect width="48" height="30" rx="4" fill="#F5F5F5" />
    <circle cx="19" cy="15" r="8" fill="#EB001B" />
    <circle cx="29" cy="15" r="8" fill="#F79E1B" />
    <path d="M24 9.5c1.5 1.4 2.5 3.4 2.5 5.5s-1 4.1-2.5 5.5c-1.5-1.4-2.5-3.4-2.5-5.5s1-4.1 2.5-5.5z" fill="#FF5F00" />
  </svg>
);

const AmexLogo: React.FC<LogoProps> = ({ className }) => (
  <svg viewBox="0 0 48 30" className={className} role="img" aria-label="American Express">
    <rect width="48" height="30" rx="4" fill="url(#amexGradient)" />
    <defs>
      <linearGradient id="amexGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#2E77BC", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#1F5A94", stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <text x="24" y="19" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="11" fill="#fff" letterSpacing="0.8">
      AMEX
    </text>
  </svg>
);

const CashLogo: React.FC<LogoProps> = ({ className }) => (
  <svg viewBox="0 0 48 30" className={className} role="img" aria-label="Cash on Delivery">
    <rect width="48" height="30" rx="4" fill="url(#cashGradient)" />
    <defs>
      <linearGradient id="cashGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#2E7D32", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#1B5E20", stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <text x="24" y="19" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="10" fill="#fff" letterSpacing="0.5">
      CASH
    </text>
  </svg>
);

const BankLogo: React.FC<LogoProps> = ({ className }) => (
  <svg viewBox="0 0 48 30" className={className} role="img" aria-label="Bank Transfer">
    <rect width="48" height="30" rx="4" fill="url(#bankGradient)" />
    <defs>
      <linearGradient id="bankGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#5B6770", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#455A64", stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <text x="24" y="19" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="9" fill="#fff" letterSpacing="0.5">
      BANK
    </text>
  </svg>
);

const CardLogo: React.FC<LogoProps> = ({ className }) => (
  <svg viewBox="0 0 48 30" className={className} role="img" aria-label="Card">
    <rect width="48" height="30" rx="4" fill="url(#cardGradient)" />
    <defs>
      <linearGradient id="cardGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#8A6D3B", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#6B5530", stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <rect x="8" y="12" width="32" height="6" rx="1" fill="#fff" opacity="0.3" />
    <text x="24" y="19" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="10" fill="#fff" letterSpacing="0.5">
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
