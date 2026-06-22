import { properties } from '../data/properties';
import { mockCall } from './api';
import type { Lead, Commission, RentReceipt } from '../types';

// Buyer
export async function getBuyerStats(): Promise<{
  saved: number; activeEscrows: number; totalInEscrow: string; recommendations: number;
}> {
  return mockCall({ saved: 4, activeEscrows: 2, totalInEscrow: 'KES 19.7M', recommendations: 6 });
}

export async function getBuyerFavorites(): Promise<string[]> {
  const stored = localStorage.getItem('vestra_wishlist');
  return mockCall(stored ? JSON.parse(stored) : []);
}

// Seller
export async function getSellerListings(ownerId: string) {
  return mockCall(properties.filter((p) => p.ownerId === ownerId));
}

export async function getSellerStats(ownerId: string) {
  const myListings = properties.filter((p) => p.ownerId === ownerId);
  return mockCall({
    totalListings: myListings.length,
    totalViews: myListings.reduce((s, p) => s + p.views, 0),
    inquiries: myListings.reduce((s, p) => s + p.inquiries, 0),
    estValue: `KES ${(myListings.reduce((s, p) => s + p.price, 0) / 1_000_000).toFixed(0)}M`,
  });
}

// Landlord
export async function getLandlordStats(_ownerId?: string) {
  return mockCall({ totalUnits: 4, occupied: 2, maintenance: 3, monthlyIncome: 'KES 345K' });
}

// Tenant
export async function getTenantStats() {
  return mockCall({ monthlyRent: 'KES 45K', nextDue: 'Jul 1', paidYTD: 'KES 270K', openRequests: 1 });
}

export async function getTenantReceipts(): Promise<RentReceipt[]> {
  return mockCall([
    { id: 'rec-001', unitTitle: '1BR Studio in Kileleshwa', amount: 45000, currency: 'KES', period: 'June 2026', paidAt: '2026-06-01', paymentMethod: 'M-Pesa' },
    { id: 'rec-002', unitTitle: '1BR Studio in Kileleshwa', amount: 45000, currency: 'KES', period: 'May 2026', paidAt: '2026-05-01', paymentMethod: 'M-Pesa' },
    { id: 'rec-003', unitTitle: '1BR Studio in Kileleshwa', amount: 45000, currency: 'KES', period: 'April 2026', paidAt: '2026-04-01', paymentMethod: 'Bank Transfer' },
    { id: 'rec-004', unitTitle: '1BR Studio in Kileleshwa', amount: 45000, currency: 'KES', period: 'March 2026', paidAt: '2026-03-01', paymentMethod: 'M-Pesa' },
  ]);
}

// Agent
export async function getAgentLeads(): Promise<Lead[]> {
  return mockCall([
    { id: 'ld-001', name: 'Alice Wambua', email: 'alice@example.com', phone: '+254733111111', propertyTitle: 'Modern 3BR Villa in Karen', message: 'Very interested, would like a viewing this weekend.', status: 'qualified', createdAt: '2026-06-22' },
    { id: 'ld-002', name: 'Brian Kiprono', email: 'brian@example.com', phone: '+254744222222', propertyTitle: '3BR Townhouse in Lavington', message: 'What are the payment terms and financing options?', status: 'new', createdAt: '2026-06-21' },
    { id: 'ld-003', name: 'Cynthia Mueni', email: 'cynthia@example.com', phone: '+254755333333', propertyTitle: '5BR Mansion in Runda', message: 'Ready to make an offer. Can we discuss?', status: 'contacted', createdAt: '2026-06-20' },
    { id: 'ld-004', name: 'David Mutua', email: 'david@example.com', phone: '+254766444444', propertyTitle: '4BR Family Home in Langata', message: 'Looking for a family home, flexible on price.', status: 'closed', createdAt: '2026-06-10' },
  ]);
}

export async function getAgentCommissions(): Promise<Commission[]> {
  return mockCall([
    { id: 'com-001', propertyTitle: '3BR Townhouse in Lavington', salePrice: 32000000, commissionRate: 3, commissionAmount: 960000, currency: 'KES', status: 'paid', closedAt: '2026-05-20' },
    { id: 'com-002', propertyTitle: '4BR Family Home in Langata', salePrice: 28000000, commissionRate: 3, commissionAmount: 840000, currency: 'KES', status: 'pending', closedAt: '2026-06-15' },
    { id: 'com-003', propertyTitle: '2BR Apartment in Kilimani', salePrice: 12000000, commissionRate: 2.5, commissionAmount: 300000, currency: 'KES', status: 'pending', closedAt: '2026-06-22' },
  ]);
}

export async function getAgentStats() {
  return mockCall({ activeLeads: 3, totalListings: 42, totalCommission: 'KES 2.1M', conversion: '68%' });
}
