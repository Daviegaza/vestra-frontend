import {
  Smartphone, CreditCard, Building2, Banknote, Globe, Wallet,
  type LucideIcon,
} from 'lucide-react';

export type PaymentMethod =
  | 'mpesa'
  | 'airtel_money'
  | 'card'
  | 'bank_transfer'
  | 'pesalink'
  | 'equitel'
  | 'paypal'
  | 'flutterwave'
  | 'intasend'
  | 'cash';

export interface PaymentMethodEntry {
  method: PaymentMethod;
  label: string;
  tagline: string;
  icon: LucideIcon;
  feePct: number;
  region: 'KE' | 'EA' | 'intl';
  liveReady: boolean;
  prompt: string;
}

export const PAYMENT_METHODS: PaymentMethodEntry[] = [
  {
    method: 'mpesa', label: 'M-Pesa', tagline: 'STK push to your phone',
    icon: Smartphone, feePct: 0, region: 'KE', liveReady: false,
    prompt: 'Enter your M-Pesa phone number — STK push appears in seconds.',
  },
  {
    method: 'airtel_money', label: 'Airtel Money', tagline: 'Push payment to Airtel wallet',
    icon: Smartphone, feePct: 0, region: 'EA', liveReady: false,
    prompt: 'Enter your Airtel Money number — confirm prompt in your app.',
  },
  {
    method: 'card', label: 'Debit / Credit Card', tagline: 'Visa, Mastercard, Verve',
    icon: CreditCard, feePct: 2.9, region: 'intl', liveReady: false,
    prompt: 'Pay with any bank card — securely tokenized, never stored.',
  },
  {
    method: 'bank_transfer', label: 'Bank Transfer', tagline: 'RTGS / EFT to Vestra account',
    icon: Building2, feePct: 0, region: 'KE', liveReady: true,
    prompt: 'We email you the bank details. Upload the deposit slip after sending.',
  },
  {
    method: 'pesalink', label: 'PesaLink', tagline: 'Inter-bank instant transfer',
    icon: Wallet, feePct: 0.5, region: 'KE', liveReady: false,
    prompt: 'Send via PesaLink from any Kenyan bank app. Instant clearance.',
  },
  {
    method: 'equitel', label: 'Equitel', tagline: 'Equity Bank mobile money',
    icon: Smartphone, feePct: 0, region: 'KE', liveReady: false,
    prompt: 'Equity Bank mobile money. Confirm in the Equity app.',
  },
  {
    method: 'flutterwave', label: 'Flutterwave', tagline: 'Card + mobile + bank, one checkout',
    icon: Globe, feePct: 1.4, region: 'intl', liveReady: false,
    prompt: 'Multi-method checkout via Flutterwave. Card, mobile, bank — your choice.',
  },
  {
    method: 'intasend', label: 'IntaSend', tagline: 'KES-native aggregator',
    icon: Wallet, feePct: 1.0, region: 'KE', liveReady: false,
    prompt: 'IntaSend handles M-Pesa + card in a single checkout.',
  },
  {
    method: 'paypal', label: 'PayPal', tagline: 'International buyers',
    icon: Globe, feePct: 3.9, region: 'intl', liveReady: false,
    prompt: 'Sign in to PayPal to complete the payment.',
  },
  {
    method: 'cash', label: 'Cash (manual)', tagline: 'Mark paid at office or in person',
    icon: Banknote, feePct: 0, region: 'KE', liveReady: true,
    prompt: 'For in-person settlement. Landlord/admin confirms receipt.',
  },
];

export const PAYMENT_METHOD_INDEX: Record<PaymentMethod, PaymentMethodEntry> =
  PAYMENT_METHODS.reduce((acc, m) => { acc[m.method] = m; return acc; }, {} as Record<PaymentMethod, PaymentMethodEntry>);

export function makeSandboxRef(method: PaymentMethod): string {
  const prefix = method.toUpperCase().replace(/_/g, '');
  return `${prefix}-SBX-${Date.now()}`;
}
