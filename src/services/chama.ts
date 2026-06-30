import { apiRequest } from './api';
import type { PaymentMethod } from '../lib/paymentMethods';

export interface ChamaMember {
  id: string;
  userId: string;
  role: 'founder' | 'treasurer' | 'member';
  shares: number;
  joinedAt: string;
  user?: { id: string; fullName: string; email: string };
}

export interface ChamaContribution {
  id: string;
  chamaId: string;
  memberId: string;
  amount: number | string;
  paymentMethod: PaymentMethod;
  paymentRef?: string | null;
  period: string;
  paidAt: string;
  member?: { id: string; fullName: string };
}

export interface ChamaProperty {
  id: string;
  chamaId: string;
  title: string;
  address: string;
  costKes: number | string;
  acquiredAt: string;
  notes?: string;
}

export interface Chama {
  id: string;
  name: string;
  description: string;
  targetKes: number | string;
  monthlyContribution: number | string;
  status: 'active' | 'paused' | 'closed';
  createdAt: string;
  members: ChamaMember[];
  contributions: ChamaContribution[];
  properties: ChamaProperty[];
  raisedKes?: number | string;
}

export async function getMyChamas(): Promise<Chama[]> {
  const res = await apiRequest<{ chamas: Chama[] }>(`/api/chamas`);
  return res.chamas;
}

export async function getChama(id: string): Promise<Chama> {
  const res = await apiRequest<{ chama: Chama }>(`/api/chamas/${id}`);
  return res.chama;
}

export async function createChama(data: {
  name: string;
  description: string;
  targetKes: number;
  monthlyContribution: number;
}): Promise<Chama> {
  const res = await apiRequest<{ chama: Chama }>(`/api/chamas`, {
    method: 'POST',
    body: data,
  });
  return res.chama;
}

export async function joinChama(id: string): Promise<void> {
  await apiRequest<{ member: ChamaMember }>(`/api/chamas/${id}/join`, { method: 'POST' });
}

export async function contributeToChama(id: string, data: {
  amount: number;
  period: string;
  paymentMethod: PaymentMethod;
  paymentRef?: string;
}): Promise<ChamaContribution> {
  const res = await apiRequest<{ contribution: ChamaContribution }>(`/api/chamas/${id}/contribute`, {
    method: 'POST',
    body: data,
  });
  return res.contribution;
}
