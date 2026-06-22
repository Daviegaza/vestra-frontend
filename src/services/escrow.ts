import { mockCall } from './api';
import type { EscrowTransaction } from '../types';

const escrows: EscrowTransaction[] = [
  { id: 'esc-001', propertyId: 'prop-001', propertyTitle: 'Modern 3BR Villa in Karen', buyerId: 'user-001', sellerId: 'user-002', amount: 4500000, currency: 'KES', status: 'deposit_paid', createdAt: '2026-06-15T10:00:00Z' },
  { id: 'esc-002', propertyId: 'prop-007', propertyTitle: '3BR Townhouse in Lavington', buyerId: 'user-001', sellerId: 'user-003', amount: 3200000, currency: 'KES', status: 'completed', createdAt: '2026-05-20T10:00:00Z' },
  { id: 'esc-003', propertyId: 'prop-003', propertyTitle: '5BR Mansion in Runda', buyerId: 'user-001', sellerId: 'user-004', amount: 12000000, currency: 'KES', status: 'initiated', createdAt: '2026-06-22T10:00:00Z' },
];

export async function getMyEscrows(userId: string): Promise<EscrowTransaction[]> {
  return mockCall(escrows.filter((e) => e.buyerId === userId || e.sellerId === userId));
}

export async function createEscrow(data: { propertyId: string; propertyTitle: string; amount: number; buyerId: string; sellerId: string }): Promise<EscrowTransaction> {
  const e: EscrowTransaction = {
    id: `esc-${Date.now()}`,
    propertyId: data.propertyId,
    propertyTitle: data.propertyTitle,
    buyerId: data.buyerId,
    sellerId: data.sellerId,
    amount: data.amount,
    currency: 'KES',
    status: 'initiated',
    createdAt: new Date().toISOString(),
  };
  escrows.push(e);
  return mockCall(e);
}
