import { apiRequest } from './api';

export type ExtensionKind = 'rent' | 'deposit' | 'subscription' | 'escrow' | 'other';
export type ExtensionStatus = 'pending' | 'approved' | 'declined' | 'expired';

export interface PaymentExtension {
  id: string;
  requesterId: string;
  approverId?: string | null;
  unitId?: string | null;
  kind: ExtensionKind;
  amount: number | string;
  currency: string;
  originalDue: string;
  requestedDue: string;
  reason: string;
  status: ExtensionStatus;
  decisionAt?: string | null;
  decisionNote?: string | null;
  createdAt: string;
  requester?: { id: string; fullName: string; email: string; phone: string };
  approver?: { id: string; fullName: string };
}

export async function requestExtension(data: {
  kind?: ExtensionKind;
  unitId?: string;
  amount: number;
  currency?: string;
  originalDue: string;
  requestedDue: string;
  reason: string;
  approverId?: string;
}): Promise<PaymentExtension> {
  const res = await apiRequest<{ extension: PaymentExtension }>(`/api/extensions`, {
    method: 'POST',
    body: data,
  });
  return res.extension;
}

export async function getMyExtensions(): Promise<PaymentExtension[]> {
  const res = await apiRequest<{ extensions: PaymentExtension[] }>(`/api/extensions/mine`);
  return res.extensions;
}

export async function getIncomingExtensions(): Promise<PaymentExtension[]> {
  const res = await apiRequest<{ extensions: PaymentExtension[] }>(`/api/extensions/incoming`);
  return res.extensions;
}

export async function approveExtension(id: string, note?: string): Promise<void> {
  await apiRequest<{ extension: PaymentExtension }>(`/api/extensions/${id}/approve`, {
    method: 'POST',
    body: { note },
  });
}

export async function declineExtension(id: string, note?: string): Promise<void> {
  await apiRequest<{ extension: PaymentExtension }>(`/api/extensions/${id}/decline`, {
    method: 'POST',
    body: { note },
  });
}
