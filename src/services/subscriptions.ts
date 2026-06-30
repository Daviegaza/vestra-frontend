import { apiRequest } from './api';
import type { UserRole } from '../types';

export type SubscriptionTier =
  | 'free' | 'starter' | 'plus' | 'pro' | 'elite' | 'estate'
  | 'buyer_verified' | 'buyer_pro'
  | 'chama_group' | 'chama_cooperative';

export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'cancelled' | 'expired';

export interface TierEntry {
  tier: SubscriptionTier;
  role: UserRole;
  label: string;
  priceKes: number;
  maxListings: number;
  featuredSlots: number;
  description: string;
  perks: string[];
}

export interface Subscription {
  id: string;
  userId: string;
  role: UserRole;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  priceKes: number | string;
  periodDays: number;
  autoRenew: boolean;
  startedAt: string;
  expiresAt: string;
  cancelledAt?: string | null;
  mpesaRef?: string | null;
}

export async function getCatalog(): Promise<TierEntry[]> {
  const res = await apiRequest<{ tiers: TierEntry[] }>(`/api/subscriptions/catalog`, { auth: false });
  return res.tiers;
}

export async function getMySubscriptions(): Promise<Subscription[]> {
  const res = await apiRequest<{ subscriptions: Subscription[] }>(`/api/subscriptions/me`);
  return res.subscriptions;
}

import type { PaymentMethod } from '../lib/paymentMethods';

export async function subscribe(
  role: UserRole,
  tier: SubscriptionTier,
  opts: { paymentMethod?: PaymentMethod; paymentRef?: string } = {},
): Promise<Subscription> {
  const res = await apiRequest<{ subscription: Subscription }>(`/api/subscriptions/subscribe`, {
    method: 'POST',
    body: {
      role,
      tier,
      paymentMethod: opts.paymentMethod || 'mpesa',
      paymentRef: opts.paymentRef,
      autoRenew: true,
    },
  });
  return res.subscription;
}

export async function cancelSubscription(role: UserRole): Promise<void> {
  await apiRequest<{ ok: boolean }>(`/api/subscriptions/${role}/cancel`, { method: 'POST' });
}
