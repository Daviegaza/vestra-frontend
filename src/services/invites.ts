import { apiRequest } from './api';
import type { User } from '../types';

export interface TenantInvite {
  id: string;
  unitId: string;
  landlordId: string;
  tenantEmail?: string;
  tenantPhone?: string;
  tenantUserId?: string;
  rentAmount: number | string;
  deposit: number | string;
  startDate: string;
  endDate: string;
  terms: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt: string;
  respondedAt?: string;
  unit?: { id: string; title: string; address: string; city: string; rentAmount: number | string; bedrooms: number; bathrooms: number };
  landlord?: { id: string; fullName: string; phone: string; email: string };
  tenantUser?: { id: string; fullName: string; email: string; phone: string };
}

export async function createInvite(data: {
  unitId: string;
  tenantEmail?: string;
  tenantPhone?: string;
  rentAmount: number;
  deposit: number;
  startDate: string;
  endDate: string;
  terms?: string;
}): Promise<TenantInvite> {
  const res = await apiRequest<{ invite: TenantInvite }>(`/api/rentals/invites`, {
    method: 'POST',
    body: data,
  });
  return res.invite;
}

export async function getLandlordInvites(): Promise<TenantInvite[]> {
  const res = await apiRequest<{ invites: TenantInvite[] }>(`/api/rentals/invites/landlord`);
  return res.invites;
}

export async function getMyInvites(): Promise<TenantInvite[]> {
  const res = await apiRequest<{ invites: TenantInvite[] }>(`/api/rentals/invites/mine`);
  return res.invites;
}

export async function acceptInvite(id: string): Promise<{ user: User }> {
  return apiRequest<{ user: User; lease: unknown }>(`/api/rentals/invites/${id}/accept`, { method: 'POST' });
}

export async function declineInvite(id: string): Promise<void> {
  await apiRequest<{ ok: boolean }>(`/api/rentals/invites/${id}/decline`, { method: 'POST' });
}
