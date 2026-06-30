import type { Commission, Lead, RentReceipt, Property } from '../types';
import { apiRequest } from './api';

// Buyer
export async function getBuyerStats(): Promise<{
  saved: number; activeEscrows: number; totalInEscrow: string; recommendations: number;
}> {
  const stored = localStorage.getItem('vestra_wishlist');
  const saved = stored ? (JSON.parse(stored) as string[]).length : 0;
  try {
    const escrow = await apiRequest<{ transactions: { amount: number; status: string }[] }>(`/api/escrow`);
    const active = escrow.transactions.filter((t) => !['completed', 'cancelled', 'refunded'].includes(t.status));
    const total = active.reduce((s, t) => s + Number(t.amount), 0);
    return {
      saved,
      activeEscrows: active.length,
      totalInEscrow: `KES ${(total / 1_000_000).toFixed(1)}M`,
      recommendations: 6,
    };
  } catch {
    return { saved, activeEscrows: 0, totalInEscrow: 'KES 0', recommendations: 0 };
  }
}

export async function getBuyerFavorites(): Promise<string[]> {
  const stored = localStorage.getItem('vestra_wishlist');
  return stored ? JSON.parse(stored) : [];
}

// Seller
export async function getSellerListings(_ownerId: string): Promise<Property[]> {
  const res = await apiRequest<{ properties: Property[] }>(`/api/properties?limit=100`, { auth: false });
  try {
    const me = await apiRequest<{ user: { id: string } }>(`/api/auth/me`);
    return res.properties.filter((p) => p.ownerId === me.user.id);
  } catch {
    return res.properties;
  }
}

export async function getSellerStats(ownerId: string) {
  const myListings = await getSellerListings(ownerId);
  const totalValue = myListings.reduce((s, p) => s + Number(p.price), 0);
  return {
    totalListings: myListings.length,
    totalViews: myListings.reduce((s, p) => s + p.views, 0),
    inquiries: myListings.reduce((s, p) => s + p.inquiries, 0),
    estValue: `KES ${(totalValue / 1_000_000).toFixed(0)}M`,
  };
}

// Landlord
export async function getLandlordStats(_ownerId?: string) {
  try {
    const res = await apiRequest<{ units: number; activeLeases: number; monthRevenue: number | string }>(`/api/dashboard/landlord`);
    return {
      totalUnits: res.units,
      occupied: res.activeLeases,
      maintenance: 0,
      monthlyIncome: `KES ${(Number(res.monthRevenue) / 1000).toFixed(0)}K`,
    };
  } catch {
    return { totalUnits: 0, occupied: 0, maintenance: 0, monthlyIncome: 'KES 0' };
  }
}

// Tenant
export async function getTenantStats() {
  try {
    const res = await apiRequest<{ receipts: { amount: number; paidAt: string }[] }>(`/api/rentals/receipts`);
    const ytd = res.receipts
      .filter((r) => new Date(r.paidAt).getFullYear() === new Date().getFullYear())
      .reduce((s, r) => s + Number(r.amount), 0);
    const last = res.receipts[0];
    const monthly = last ? Number(last.amount) : 0;
    return {
      monthlyRent: `KES ${(monthly / 1000).toFixed(0)}K`,
      nextDue: 'Jul 1',
      paidYTD: `KES ${(ytd / 1000).toFixed(0)}K`,
      openRequests: 0,
    };
  } catch {
    return { monthlyRent: 'KES 0', nextDue: '—', paidYTD: 'KES 0', openRequests: 0 };
  }
}

export async function getTenantReceipts(): Promise<RentReceipt[]> {
  interface BackendReceipt {
    id: string;
    amount: number;
    currency: string;
    period: string;
    paidAt: string;
    paymentMethod: string;
    mpesaRef?: string;
    tenantId?: string;
    landlordId?: string;
    unit?: { title?: string };
  }
  try {
    const res = await apiRequest<{ receipts: BackendReceipt[] }>(`/api/rentals/receipts`);
    return res.receipts.map((r) => ({
      id: r.id,
      unitTitle: r.unit?.title || 'Unit',
      amount: Number(r.amount),
      currency: r.currency || 'KES',
      period: r.period,
      paidAt: r.paidAt,
      paymentMethod: r.paymentMethod,
      mpesaRef: r.mpesaRef,
      tenantId: r.tenantId,
      landlordId: r.landlordId || undefined,
    }));
  } catch {
    return [];
  }
}

// Agent
export async function getAgentLeads(): Promise<Lead[]> {
  interface BackendLead {
    id: string; name: string; email: string; phone: string; message: string;
    status: Lead['status']; createdAt: string;
    property?: { title?: string };
  }
  try {
    const res = await apiRequest<{ leads: BackendLead[] }>(`/api/leads`);
    return res.leads.map((l) => ({
      id: l.id,
      name: l.name,
      email: l.email,
      phone: l.phone,
      propertyTitle: l.property?.title || '—',
      message: l.message,
      status: l.status,
      createdAt: l.createdAt,
    }));
  } catch {
    return [];
  }
}

export async function getAgentCommissions(): Promise<Commission[]> {
  interface BackendComm {
    id: string; propertyTitle: string; salePrice: number; commissionRate: number;
    commissionAmount: number; currency: string; status: Commission['status']; closedAt: string;
  }
  try {
    const res = await apiRequest<{ commissions: BackendComm[] }>(`/api/commissions`);
    return res.commissions.map((c) => ({
      id: c.id,
      propertyTitle: c.propertyTitle,
      salePrice: Number(c.salePrice),
      commissionRate: c.commissionRate,
      commissionAmount: Number(c.commissionAmount),
      currency: c.currency,
      status: c.status,
      closedAt: c.closedAt,
    }));
  } catch {
    return [];
  }
}

export async function getAgentStats() {
  try {
    const res = await apiRequest<{ listings: number; newLeads: number; lifetimeCommission: number | string }>(`/api/dashboard/agent`);
    return {
      activeLeads: res.newLeads,
      totalListings: res.listings,
      totalCommission: `KES ${(Number(res.lifetimeCommission) / 1_000_000).toFixed(1)}M`,
      conversion: '—',
    };
  } catch {
    return { activeLeads: 0, totalListings: 0, totalCommission: 'KES 0', conversion: '—' };
  }
}
