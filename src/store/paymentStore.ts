import { create } from 'zustand';
import { toast } from './toastStore';
import type { MpesaSTKPush, PaymentRecord } from '../types';

export type Currency = 'KES' | 'USD' | 'EUR' | 'GBP' | 'ZAR' | 'NGN' | 'GHS' | 'TZS' | 'UGX' | 'AED' | 'INR' | 'CNY';

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  KES: 'KSh', USD: '$', EUR: '€', GBP: '£', ZAR: 'R', NGN: '₦', GHS: 'GH₵', TZS: 'TSh', UGX: 'USh', AED: 'د.إ', INR: '₹', CNY: '¥',
};

export const CURRENCY_LABELS: Record<Currency, string> = {
  KES: 'Kenyan Shilling', USD: 'US Dollar', EUR: 'Euro', GBP: 'British Pound', ZAR: 'South African Rand', NGN: 'Nigerian Naira', GHS: 'Ghanaian Cedi', TZS: 'Tanzanian Shilling', UGX: 'Ugandan Shilling', AED: 'UAE Dirham', INR: 'Indian Rupee', CNY: 'Chinese Yuan',
};

export const PAYMENT_METHODS = [
  { id: 'mpesa', label: 'M-Pesa', icon: '📱', regions: ['KE', 'TZ'] },
  { id: 'stripe', label: 'Credit/Debit Card', icon: '💳', regions: ['*'] },
  { id: 'paypal', label: 'PayPal', icon: '🅿️', regions: ['*'] },
  { id: 'bank', label: 'Bank Transfer', icon: '🏦', regions: ['*'] },
  { id: 'airtel', label: 'Airtel Money', icon: '📱', regions: ['KE', 'TZ', 'GH', 'NG'] },
  { id: 'mtn', label: 'MTN Mobile Money', icon: '📱', regions: ['GH', 'NG', 'UG', 'ZA'] },
  { id: 'flutterwave', label: 'Flutterwave', icon: '🌊', regions: ['NG', 'GH', 'KE', 'ZA'] },
  { id: 'pesalink', label: 'PesaLink', icon: '🔗', regions: ['KE'] },
];

export function formatCurrency(amount: number, currency: Currency = 'KES'): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  if (currency === 'KES' || currency === 'TZS' || currency === 'UGX') {
    return `${symbol} ${amount.toLocaleString('en-KE')}`;
  }
  return `${symbol}${amount.toLocaleString('en-US')}`;
}

interface PaymentState {
  activeCurrency: Currency;
  stkPushes: MpesaSTKPush[];
  payments: PaymentRecord[];

  setCurrency: (c: Currency) => void;
  initiateSTKPush: (phone: string, amount: number, description: string) => MpesaSTKPush;
  completeSTKPush: (id: string, receipt: string) => void;
  failSTKPush: (id: string, reason: string) => void;
  recordPayment: (p: Partial<PaymentRecord>) => void;
  getPaymentsByPayer: (payerId: string) => PaymentRecord[];
  getPaymentsByType: (type: PaymentRecord['type']) => PaymentRecord[];
  getTotalCollected: () => number;
}

let counter = 200;

function uid(prefix: string): string {
  return `${prefix}-${++counter}`;
}

const now = () => new Date().toISOString();

export const usePaymentStore = create<PaymentState>((set, get) => ({
  activeCurrency: 'KES',
  stkPushes: [],
  payments: [],

  setCurrency: (c) => {
    set({ activeCurrency: c });
    localStorage.setItem('vestra_currency', c);
  },

  initiateSTKPush: (phone, amount, description) => {
    const stk: MpesaSTKPush = {
      id: uid('stk'),
      phone: phone.replace(/\D/g, ''),
      amount,
      currency: 'KES',
      reference: `VESTRA-${Date.now().toString(36).toUpperCase()}`,
      description,
      status: 'pending',
      createdAt: now(),
    };
    set((s) => ({ stkPushes: [stk, ...s.stkPushes] }));
    return stk;
  },

  completeSTKPush: (id, receipt) => {
    set((s) => ({
      stkPushes: s.stkPushes.map((stk) =>
        stk.id === id ? { ...stk, status: 'completed' as const, mpesaReceipt: receipt, completedAt: now() } : stk,
      ),
    }));
    toast.success('M-Pesa payment completed!');
  },

  failSTKPush: (id, reason) => {
    set((s) => ({
      stkPushes: s.stkPushes.map((stk) =>
        stk.id === id ? { ...stk, status: 'failed' as const } : stk,
      ),
    }));
    toast.error(`Payment failed: ${reason}`);
  },

  recordPayment: (data) => {
    const payment: PaymentRecord = {
      id: uid('pay'),
      type: data.type || 'rent',
      amount: data.amount || 0,
      currency: data.currency || 'KES',
      method: data.method || 'mpesa',
      status: data.status || 'completed',
      reference: data.reference || `PAY-${Date.now().toString(36).toUpperCase()}`,
      mpesaRef: data.mpesaRef,
      description: data.description || '',
      payerId: data.payerId || '',
      payerName: data.payerName || '',
      recipientId: data.recipientId,
      recipientName: data.recipientName,
      propertyId: data.propertyId,
      unitId: data.unitId,
      createdAt: now(),
      completedAt: data.status === 'completed' ? now() : undefined,
    };
    set((s) => ({ payments: [payment, ...s.payments] }));
    toast.success('Payment recorded!');
  },

  getPaymentsByPayer: (payerId) => get().payments.filter((p) => p.payerId === payerId),
  getPaymentsByType: (type) => get().payments.filter((p) => p.type === type),
  getTotalCollected: () => get().payments.filter((p) => p.status === 'completed').reduce((s, p) => s + p.amount, 0),
}));
