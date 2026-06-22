import { create } from 'zustand';
import { toast } from './toastStore';
import type { EscrowTransaction } from '../types';

interface EscrowState {
  escrows: EscrowTransaction[];
  createEscrow: (data: Partial<EscrowTransaction>) => void;
  updateStatus: (id: string, status: EscrowTransaction['status']) => void;
  disputeEscrow: (id: string, reason: string) => void;
  getEscrowsByUser: (userId: string) => EscrowTransaction[];
  getActiveEscrows: (userId: string) => EscrowTransaction[];
}

let counter = 300;
const uid = (p: string) => `${p}-${++counter}`;
const now = () => new Date().toISOString();

export const useEscrowStore = create<EscrowState>((set, get) => ({
  escrows: [
    { id: 'esc-001', propertyId: 'prop-001', propertyTitle: 'Modern 3BR Villa in Karen', buyerId: 'user-001', sellerId: 'user-002', amount: 4500000, currency: 'KES', status: 'deposit_paid', createdAt: '2026-06-15T10:00:00Z' },
    { id: 'esc-002', propertyId: 'prop-007', propertyTitle: '3BR Townhouse in Lavington', buyerId: 'user-001', sellerId: 'user-002', amount: 3200000, currency: 'KES', status: 'completed', createdAt: '2026-05-20T10:00:00Z' },
    { id: 'esc-003', propertyId: 'prop-003', propertyTitle: '5BR Mansion in Runda', buyerId: 'user-001', sellerId: 'user-004', amount: 12000000, currency: 'KES', status: 'initiated', createdAt: '2026-06-22T10:00:00Z' },
  ],

  createEscrow: (data) => {
    const escrow: EscrowTransaction = {
      id: uid('esc'),
      propertyId: data.propertyId || '',
      propertyTitle: data.propertyTitle || '',
      buyerId: data.buyerId || '',
      sellerId: data.sellerId || '',
      amount: data.amount || 0,
      currency: 'KES',
      status: 'initiated',
      createdAt: now(),
    };
    set((s) => ({ escrows: [escrow, ...s.escrows] }));
    toast.success('Escrow created! Deposit payment pending.');
  },

  updateStatus: (id, status) => {
    set((s) => ({ escrows: s.escrows.map((e) => (e.id === id ? { ...e, status } : e)) }));
    const labels: Record<string, string> = {
      initiated: 'Escrow initiated',
      deposit_paid: 'Deposit received!',
      balance_paid: 'Balance paid!',
      completed: 'Escrow completed! Funds released.',
      cancelled: 'Escrow cancelled.',
      refunded: 'Funds refunded.',
      disputed: 'Escrow disputed.',
    };
    toast.success(labels[status] || 'Status updated');
  },

  disputeEscrow: (id, reason) => {
    set((s) => ({ escrows: s.escrows.map((e) => (e.id === id ? { ...e, status: 'disputed' as const } : e)) }));
    toast.warning(`Escrow disputed: ${reason}`);
  },

  getEscrowsByUser: (userId) => get().escrows.filter((e) => e.buyerId === userId || e.sellerId === userId),
  getActiveEscrows: (userId) => get().escrows.filter((e) => (e.buyerId === userId || e.sellerId === userId) && !['completed', 'cancelled', 'refunded'].includes(e.status)),
}));
