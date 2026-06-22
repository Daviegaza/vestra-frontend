import { create } from 'zustand';
import { toast } from './toastStore';
import type { LeaseAgreement } from '../types';

interface SaleAgreement {
  id: string;
  propertyId: string;
  propertyTitle: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  price: number;
  currency: string;
  deposit: number;
  status: 'draft' | 'signed_buyer' | 'signed_seller' | 'active' | 'completed' | 'cancelled';
  conditions: string[];
  createdAt: string;
  completedAt?: string;
}

interface ContractState {
  leases: LeaseAgreement[];
  saleAgreements: SaleAgreement[];
  createLease: (data: Partial<LeaseAgreement>) => void;
  signLease: (id: string, party: 'landlord' | 'tenant') => void;
  createSaleAgreement: (data: Partial<SaleAgreement>) => void;
  signSaleAgreement: (id: string, party: 'buyer' | 'seller') => void;
  completeSaleAgreement: (id: string) => void;
}

let counter = 400;
const uid = (p: string) => `${p}-${++counter}`;
const now = () => new Date().toISOString();

export const useContractStore = create<ContractState>((set) => ({
  leases: [
    { id: 'lease-001', unitId: 'unit-001', unitTitle: '2BR Apartment in Kilimani', landlordId: 'user-003', landlordName: 'Sammy Ndungu', tenantId: 'tnt-001', tenantName: 'Mary Wanjiru', tenantEmail: 'mary@example.com', tenantPhone: '+254711111111', rentAmount: 85000, currency: 'KES', deposit: 85000, startDate: '2026-01-01', endDate: '2026-12-31', status: 'active', terms: 'Standard one-year lease. Rent due 1st of each month. Late fee KES 500 after 5th. One month notice for termination.', signedByLandlord: true, signedByTenant: true, createdAt: '2026-01-01T10:00:00Z' },
    { id: 'lease-002', unitId: 'unit-002', unitTitle: '1BR Studio in Kileleshwa', landlordId: 'user-003', landlordName: 'Sammy Ndungu', tenantId: 'tnt-002', tenantName: 'James Otieno', tenantEmail: 'james@example.com', tenantPhone: '+254722222222', rentAmount: 45000, currency: 'KES', deposit: 45000, startDate: '2026-03-01', endDate: '2027-02-28', status: 'active', terms: 'Standard lease. Utilities included. No pets.', signedByLandlord: true, signedByTenant: true, createdAt: '2026-03-01T10:00:00Z' },
  ],
  saleAgreements: [
    { id: 'sale-001', propertyId: 'prop-001', propertyTitle: 'Modern 3BR Villa in Karen', buyerId: 'user-001', buyerName: 'John Doe', sellerId: 'user-002', sellerName: 'Jane Muthoni', price: 45000000, currency: 'KES', deposit: 4500000, status: 'signed_buyer', conditions: ['Title deed verification', 'Land rates clearance', 'Spousal consent', 'Physical inspection'], createdAt: '2026-06-15T10:00:00Z' },
  ],

  createLease: (data) => {
    const lease: LeaseAgreement = {
      id: uid('lease'),
      unitId: data.unitId || '',
      unitTitle: data.unitTitle || '',
      landlordId: data.landlordId || '',
      landlordName: data.landlordName || '',
      tenantId: data.tenantId || '',
      tenantName: data.tenantName || '',
      tenantEmail: data.tenantEmail || '',
      tenantPhone: data.tenantPhone || '',
      rentAmount: data.rentAmount || 0,
      currency: 'KES',
      deposit: data.deposit || 0,
      startDate: data.startDate || '',
      endDate: data.endDate || '',
      status: 'draft',
      terms: data.terms || 'Standard lease agreement.',
      signedByLandlord: false,
      signedByTenant: false,
      createdAt: now(),
    };
    set((s) => ({ leases: [lease, ...s.leases] }));
    toast.success('Lease created! Awaiting signatures.');
  },

  signLease: (id, party) => {
    set((s) => ({
      leases: s.leases.map((l) => {
        if (l.id !== id) return l;
        const updated = { ...l, [`signedBy${party === 'landlord' ? 'Landlord' : 'Tenant'}`]: true };
        if (updated.signedByLandlord && updated.signedByTenant) updated.status = 'active' as const;
        return updated;
      }),
    }));
    toast.success(`Lease signed by ${party}!`);
  },

  createSaleAgreement: (data) => {
    const sa: SaleAgreement = {
      id: uid('sale'),
      propertyId: data.propertyId || '',
      propertyTitle: data.propertyTitle || '',
      buyerId: data.buyerId || '',
      buyerName: data.buyerName || '',
      sellerId: data.sellerId || '',
      sellerName: data.sellerName || '',
      price: data.price || 0,
      currency: 'KES',
      deposit: data.deposit || 0,
      status: 'draft',
      conditions: data.conditions || [],
      createdAt: now(),
    };
    set((s) => ({ saleAgreements: [sa, ...s.saleAgreements] }));
    toast.success('Sale agreement created!');
  },

  signSaleAgreement: (id, party) => {
    set((s) => ({
      saleAgreements: s.saleAgreements.map((sa) => {
        if (sa.id !== id) return sa;
        const key = party === 'buyer' ? 'signed_buyer' : 'signed_seller';
        const otherKey = party === 'buyer' ? 'signed_seller' : 'signed_buyer';
        const otherSigned = sa.status === otherKey || sa.status === 'active' || sa.status === 'completed';
        const newStatus = otherSigned ? 'active' as const : key as 'signed_buyer' | 'signed_seller';
        return { ...sa, status: newStatus };
      }),
    }));
    toast.success(`Sale agreement signed by ${party}!`);
  },

  completeSaleAgreement: (id) => {
    set((s) => ({ saleAgreements: s.saleAgreements.map((sa) => sa.id === id ? { ...sa, status: 'completed' as const, completedAt: now() } : sa) }));
    toast.success('Sale completed! Congratulations!');
  },
}));
