import { create } from 'zustand';
import { toast } from './toastStore';
import type { RentalUnit, Tenant, LeaseAgreement, MaintenanceRequest, RentReceipt, TenantOnboarding, PaymentRecord } from '../types';

interface RentalState {
  units: RentalUnit[];
  tenants: Tenant[];
  leases: LeaseAgreement[];
  maintenance: MaintenanceRequest[];
  receipts: RentReceipt[];
  onboardings: TenantOnboarding[];
  payments: PaymentRecord[];

  // Unit management
  addUnit: (unit: Partial<RentalUnit>) => void;
  updateUnit: (id: string, data: Partial<RentalUnit>) => void;
  removeUnit: (id: string) => void;

  // Tenant management
  addTenant: (tenant: Partial<Tenant>) => void;
  updateTenant: (id: string, data: Partial<Tenant>) => void;
  removeTenant: (id: string) => void;

  // Lease management
  createLease: (lease: Partial<LeaseAgreement>) => void;
  signLease: (id: string, role: 'landlord' | 'tenant') => void;
  terminateLease: (id: string) => void;

  // Tenant onboarding
  inviteTenant: (data: Partial<TenantOnboarding>) => void;
  acceptInvite: (id: string) => void;
  declineInvite: (id: string) => void;

  // Maintenance
  submitMaintenance: (req: Partial<MaintenanceRequest>) => void;
  updateMaintenanceStatus: (id: string, status: MaintenanceRequest['status']) => void;
  assignMaintenance: (id: string) => void;
  completeMaintenance: (id: string) => void;

  // Payments & Receipts
  recordPayment: (payment: Partial<PaymentRecord>) => void;
  generateReceipt: (payment: PaymentRecord) => void;
  payRent: (unitId: string, tenantId: string, amount: number, method: string) => void;

  // Building room management (each specific room in a building)
  buildingRooms: BuildingRoom[];
  addRoom: (room: Partial<BuildingRoom>) => void;
  occupyRoom: (roomId: string, tenantName: string, tenantPhone: string) => void;
  vacateRoom: (roomId: string) => void;
  markRoomPaid: (roomId: string) => void;
  markRoomOverdue: (roomId: string) => void;
  getBuildingStats: (buildingId: string) => { total: number; occupied: number; vacant: number; paid: number; overdue: number };
}

export interface BuildingRoom {
  id: string;
  buildingId: string;
  buildingName: string;
  number: string;
  floor: number;
  bedrooms: number;
  bathrooms: number;
  rentAmount: number;
  status: 'vacant' | 'occupied' | 'maintenance';
  tenantName?: string;
  tenantPhone?: string;
  paymentStatus: 'paid' | 'pending' | 'overdue';
  lastPaymentDate?: string;
}

let counter = 100;

function uid(prefix: string): string {
  return `${prefix}-${++counter}`;
}

const now = () => new Date().toISOString();
const todayStr = () => new Date().toISOString().split('T')[0];

export const useRentalStore = create<RentalState>((set, get) => ({
  buildingRooms: [
    { id: 'rm-101', buildingId: 'bld-001', buildingName: 'Kilimani Apartments', number: '101', floor: 1, bedrooms: 2, bathrooms: 1, rentAmount: 85000, status: 'occupied', tenantName: 'Mary Wanjiru', tenantPhone: '+254711111111', paymentStatus: 'paid', lastPaymentDate: '2026-06-01' },
    { id: 'rm-102', buildingId: 'bld-001', buildingName: 'Kilimani Apartments', number: '102', floor: 1, bedrooms: 2, bathrooms: 1, rentAmount: 85000, status: 'occupied', tenantName: 'James Otieno', tenantPhone: '+254722222222', paymentStatus: 'overdue', lastPaymentDate: '2026-05-01' },
    { id: 'rm-103', buildingId: 'bld-001', buildingName: 'Kilimani Apartments', number: '103', floor: 1, bedrooms: 1, bathrooms: 1, rentAmount: 55000, status: 'vacant', paymentStatus: 'pending' },
    { id: 'rm-104', buildingId: 'bld-001', buildingName: 'Kilimani Apartments', number: '104', floor: 1, bedrooms: 2, bathrooms: 1, rentAmount: 85000, status: 'occupied', tenantName: 'Alice Wambui', tenantPhone: '+254733333333', paymentStatus: 'paid', lastPaymentDate: '2026-06-02' },
    { id: 'rm-105', buildingId: 'bld-001', buildingName: 'Kilimani Apartments', number: '105', floor: 1, bedrooms: 1, bathrooms: 1, rentAmount: 55000, status: 'vacant', paymentStatus: 'pending' },
    { id: 'rm-106', buildingId: 'bld-001', buildingName: 'Kilimani Apartments', number: '106', floor: 1, bedrooms: 2, bathrooms: 1, rentAmount: 85000, status: 'maintenance', paymentStatus: 'pending' },
    { id: 'rm-201', buildingId: 'bld-001', buildingName: 'Kilimani Apartments', number: '201', floor: 2, bedrooms: 3, bathrooms: 2, rentAmount: 120000, status: 'occupied', tenantName: 'Peter Kamau', tenantPhone: '+254744444444', paymentStatus: 'paid', lastPaymentDate: '2026-06-01' },
    { id: 'rm-202', buildingId: 'bld-001', buildingName: 'Kilimani Apartments', number: '202', floor: 2, bedrooms: 2, bathrooms: 1, rentAmount: 95000, status: 'vacant', paymentStatus: 'pending' },
    { id: 'rm-g1', buildingId: 'bld-002', buildingName: 'Westlands Heights', number: 'G1', floor: 0, bedrooms: 2, bathrooms: 2, rentAmount: 95000, status: 'occupied', tenantName: 'Alice Mwikali', tenantPhone: '+254733333333', paymentStatus: 'pending', lastPaymentDate: '2026-05-01' },
    { id: 'rm-g2', buildingId: 'bld-002', buildingName: 'Westlands Heights', number: 'G2', floor: 0, bedrooms: 1, bathrooms: 1, rentAmount: 65000, status: 'vacant', paymentStatus: 'pending' },
    { id: 'rm-1a', buildingId: 'bld-002', buildingName: 'Westlands Heights', number: '1A', floor: 1, bedrooms: 3, bathrooms: 2, rentAmount: 150000, status: 'occupied', tenantName: 'Brian Kiprono', tenantPhone: '+254755555555', paymentStatus: 'paid', lastPaymentDate: '2026-06-03' },
    { id: 'rm-1b', buildingId: 'bld-002', buildingName: 'Westlands Heights', number: '1B', floor: 1, bedrooms: 2, bathrooms: 2, rentAmount: 110000, status: 'maintenance', paymentStatus: 'pending' },
  ],
  units: [
    { id: 'unit-001', title: '2BR Apartment in Kilimani', address: '45 Rose Avenue', city: 'Kilimani', bedrooms: 2, bathrooms: 1, rentAmount: 85000, currency: 'KES', status: 'occupied', tenantId: 'tnt-001', tenantName: 'Mary Wanjiru', leaseStart: '2026-01-01', leaseEnd: '2026-12-31', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=200' },
    { id: 'unit-002', title: '1BR Studio in Kileleshwa', address: '15 Kandara Road', city: 'Kileleshwa', bedrooms: 1, bathrooms: 1, rentAmount: 45000, currency: 'KES', status: 'occupied', tenantId: 'tnt-002', tenantName: 'James Otieno', leaseStart: '2026-03-01', leaseEnd: '2027-02-28', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200' },
    { id: 'unit-003', title: '3BR House in Langata', address: '89 Langata Road', city: 'Langata', bedrooms: 3, bathrooms: 2, rentAmount: 120000, currency: 'KES', status: 'vacant', image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=200' },
    { id: 'unit-004', title: '2BR Apartment in Westlands', address: '10 Mpaka Road', city: 'Westlands', bedrooms: 2, bathrooms: 2, rentAmount: 95000, currency: 'KES', status: 'maintenance', image: 'https://images.unsplash.com/photo-1600566753086-a00f2ae021d9?w=200' },
  ],
  tenants: [
    { id: 'tnt-001', name: 'Mary Wanjiru', email: 'mary@example.com', phone: '+254711111111', unitId: 'unit-001', unitTitle: '2BR Apartment in Kilimani', leaseStart: '2026-01-01', leaseEnd: '2026-12-31', rentAmount: 85000, currency: 'KES', status: 'active', avatar: '' },
    { id: 'tnt-002', name: 'James Otieno', email: 'james@example.com', phone: '+254722222222', unitId: 'unit-002', unitTitle: '1BR Studio in Kileleshwa', leaseStart: '2026-03-01', leaseEnd: '2027-02-28', rentAmount: 45000, currency: 'KES', status: 'active', avatar: '' },
    { id: 'tnt-003', name: 'Alice Mwikali', email: 'alice@example.com', phone: '+254733333333', unitId: 'unit-004', unitTitle: '2BR Apartment in Westlands', leaseStart: '2026-06-01', leaseEnd: '2026-11-30', rentAmount: 95000, currency: 'KES', status: 'notice', avatar: '' },
  ],
  leases: [
    { id: 'lease-001', unitId: 'unit-001', unitTitle: '2BR Apartment in Kilimani', landlordId: 'user-003', landlordName: 'Sammy Ndungu', tenantId: 'tnt-001', tenantName: 'Mary Wanjiru', tenantEmail: 'mary@example.com', tenantPhone: '+254711111111', rentAmount: 85000, currency: 'KES', deposit: 85000, startDate: '2026-01-01', endDate: '2026-12-31', status: 'active', terms: 'Standard one-year lease agreement. Rent due on the 1st of each month. Late fee of KES 500 applies after the 5th. One month notice required for termination.', signedByLandlord: true, signedByTenant: true, createdAt: '2026-01-01T10:00:00Z' },
    { id: 'lease-002', unitId: 'unit-002', unitTitle: '1BR Studio in Kileleshwa', landlordId: 'user-003', landlordName: 'Sammy Ndungu', tenantId: 'tnt-002', tenantName: 'James Otieno', tenantEmail: 'james@example.com', tenantPhone: '+254722222222', rentAmount: 45000, currency: 'KES', deposit: 45000, startDate: '2026-03-01', endDate: '2027-02-28', status: 'active', terms: 'Standard lease. Rent due by 5th of each month. Utilities included. No pets.', signedByLandlord: true, signedByTenant: true, createdAt: '2026-03-01T10:00:00Z' },
  ],
  maintenance: [
    { id: 'mnt-001', unitId: 'unit-001', unitTitle: '2BR Apartment in Kilimani', tenantId: 'tnt-001', tenantName: 'Mary Wanjiru', title: 'Leaking kitchen sink', description: 'The kitchen sink has been leaking for 2 days. Water damage visible on cabinet.', priority: 'medium', status: 'in_progress', createdAt: '2026-06-20T10:00:00Z' },
    { id: 'mnt-002', unitId: 'unit-002', unitTitle: '1BR Studio in Kileleshwa', tenantId: 'tnt-002', tenantName: 'James Otieno', title: 'Broken window lock', description: 'Window lock in the bedroom is broken. Security concern.', priority: 'high', status: 'reported', createdAt: '2026-06-22T08:00:00Z' },
  ],
  receipts: [
    { id: 'rec-001', unitTitle: '1BR Studio in Kileleshwa', amount: 45000, currency: 'KES', period: 'June 2026', paidAt: '2026-06-01', paymentMethod: 'M-Pesa', mpesaRef: 'MP123456789', tenantId: 'tnt-002' },
    { id: 'rec-002', unitTitle: '1BR Studio in Kileleshwa', amount: 45000, currency: 'KES', period: 'May 2026', paidAt: '2026-05-01', paymentMethod: 'M-Pesa', mpesaRef: 'MP123456788', tenantId: 'tnt-002' },
    { id: 'rec-003', unitTitle: '2BR Apartment in Kilimani', amount: 85000, currency: 'KES', period: 'June 2026', paidAt: '2026-06-01', paymentMethod: 'M-Pesa', mpesaRef: 'MP123456790', tenantId: 'tnt-001' },
    { id: 'rec-004', unitTitle: '2BR Apartment in Kilimani', amount: 85000, currency: 'KES', period: 'May 2026', paidAt: '2026-05-01', paymentMethod: 'M-Pesa', mpesaRef: 'MP123456787', tenantId: 'tnt-001' },
  ],
  onboardings: [],
  payments: [],

  addUnit: (data) => {
    const unit: RentalUnit = {
      id: uid('unit'),
      title: data.title || 'New Unit',
      address: data.address || '',
      city: data.city || '',
      bedrooms: data.bedrooms || 0,
      bathrooms: data.bathrooms || 0,
      rentAmount: data.rentAmount || 0,
      currency: 'KES',
      status: 'vacant',
      image: data.image || 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=200',
    };
    set((s) => ({ units: [...s.units, unit] }));
    toast.success('Unit added successfully!');
  },

  updateUnit: (id, data) => {
    set((s) => ({ units: s.units.map((u) => u.id === id ? { ...u, ...data } : u) }));
    toast.success('Unit updated!');
  },

  removeUnit: (id) => {
    set((s) => ({ units: s.units.filter((u) => u.id !== id) }));
    toast.success('Unit removed.');
  },

  addTenant: (data) => {
    const tenant: Tenant = {
      id: uid('tnt'),
      name: data.name || 'New Tenant',
      email: data.email || '',
      phone: data.phone || '',
      unitId: data.unitId || '',
      unitTitle: data.unitTitle || '',
      leaseStart: data.leaseStart || todayStr(),
      leaseEnd: data.leaseEnd || '',
      rentAmount: data.rentAmount || 0,
      currency: 'KES',
      status: 'active',
      avatar: '',
    };
    set((s) => ({
      tenants: [...s.tenants, tenant],
      units: s.units.map((u) => u.id === tenant.unitId ? { ...u, status: 'occupied' as const, tenantId: tenant.id, tenantName: tenant.name, leaseStart: tenant.leaseStart, leaseEnd: tenant.leaseEnd } : u),
    }));
    toast.success('Tenant added!');
  },

  updateTenant: (id, data) => {
    set((s) => ({ tenants: s.tenants.map((t) => t.id === id ? { ...t, ...data } : t) }));
    toast.success('Tenant updated!');
  },

  removeTenant: (id) => {
    set((s) => ({
      tenants: s.tenants.filter((t) => t.id !== id),
      units: s.units.map((u) => u.tenantId === id ? { ...u, status: 'vacant' as const, tenantId: undefined, tenantName: undefined, leaseStart: undefined, leaseEnd: undefined } : u),
    }));
    toast.success('Tenant removed.');
  },

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
      deposit: data.deposit || data.rentAmount || 0,
      startDate: data.startDate || todayStr(),
      endDate: data.endDate || '',
      status: 'draft',
      terms: data.terms || 'Standard lease agreement.',
      signedByLandlord: false,
      signedByTenant: false,
      createdAt: now(),
    };
    set((s) => ({ leases: [...s.leases, lease] }));
    toast.success('Lease created! Pending signatures.');
  },

  signLease: (id, role) => {
    set((s) => ({
      leases: s.leases.map((l) => {
        if (l.id !== id) return l;
        const updated = { ...l, [`signedBy${role === 'landlord' ? 'Landlord' : 'Tenant'}`]: true };
        if (updated.signedByLandlord && updated.signedByTenant) updated.status = 'active' as const;
        return updated;
      }),
    }));
    toast.success(`Lease signed by ${role}!`);
  },

  terminateLease: (id) => {
    set((s) => ({ leases: s.leases.map((l) => l.id === id ? { ...l, status: 'terminated' as const } : l) }));
    toast.success('Lease terminated.');
  },

  inviteTenant: (data) => {
    const onboarding: TenantOnboarding = {
      id: uid('onb'),
      unitId: data.unitId || '',
      unitTitle: data.unitTitle || '',
      landlordId: data.landlordId || '',
      landlordName: data.landlordName || '',
      tenantName: data.tenantName || '',
      tenantEmail: data.tenantEmail || '',
      tenantPhone: data.tenantPhone || '',
      rentAmount: data.rentAmount || 0,
      currency: 'KES',
      status: 'invited',
      invitedAt: now(),
    };
    set((s) => ({ onboardings: [...s.onboardings, onboarding] }));
    toast.success('Invitation sent to tenant via SMS & email!');
  },

  acceptInvite: (id) => {
    set((s) => ({
      onboardings: s.onboardings.map((o) => o.id === id ? { ...o, status: 'active' as const, acceptedAt: now() } : o),
    }));
    toast.success('Invitation accepted!');
  },

  declineInvite: (id) => {
    set((s) => ({ onboardings: s.onboardings.map((o) => o.id === id ? { ...o, status: 'declined' as const } : o) }));
    toast.info('Invitation declined.');
  },

  submitMaintenance: (data) => {
    const req: MaintenanceRequest = {
      id: uid('mnt'),
      unitId: data.unitId || '',
      unitTitle: data.unitTitle || '',
      tenantId: data.tenantId || '',
      tenantName: data.tenantName || '',
      title: data.title || 'Maintenance Request',
      description: data.description || '',
      priority: data.priority || 'medium',
      status: 'reported',
      createdAt: now(),
    };
    set((s) => ({ maintenance: [req, ...s.maintenance] }));
    toast.success('Maintenance request submitted!');
  },

  updateMaintenanceStatus: (id, status) => {
    set((s) => ({ maintenance: s.maintenance.map((m) => m.id === id ? { ...m, status } : m) }));
    toast.success(`Maintenance updated to ${status.replace('_', ' ')}`);
  },

  assignMaintenance: (id) => {
    set((s) => ({ maintenance: s.maintenance.map((m) => m.id === id ? { ...m, status: 'assigned' as const } : m) }));
    toast.success('Maintenance assigned!');
  },

  completeMaintenance: (id) => {
    set((s) => ({ maintenance: s.maintenance.map((m) => m.id === id ? { ...m, status: 'completed' as const } : m) }));
    toast.success('Maintenance marked complete!');
  },

  recordPayment: (data) => {
    const payment: PaymentRecord = {
      id: uid('pay'),
      type: data.type || 'rent',
      amount: data.amount || 0,
      currency: 'KES',
      method: data.method || 'mpesa',
      status: 'completed',
      reference: data.reference || `PAY-${Date.now()}`,
      mpesaRef: data.mpesaRef,
      description: data.description || '',
      payerId: data.payerId || '',
      payerName: data.payerName || '',
      recipientId: data.recipientId,
      recipientName: data.recipientName,
      propertyId: data.propertyId,
      unitId: data.unitId,
      createdAt: now(),
      completedAt: now(),
    };
    set((s) => ({ payments: [...s.payments, payment] }));
    get().generateReceipt(payment);
  },

  generateReceipt: (payment) => {
    const period = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    const unit = get().units.find((u) => u.id === payment.unitId);
    const receipt: RentReceipt = {
      id: uid('rec'),
      unitTitle: unit?.title || payment.description,
      amount: payment.amount,
      currency: 'KES',
      period,
      paidAt: now(),
      paymentMethod: payment.method === 'mpesa' ? 'M-Pesa' : payment.method,
      mpesaRef: payment.mpesaRef,
      tenantId: payment.payerId,
      landlordId: payment.recipientId,
    };
    set((s) => ({ receipts: [receipt, ...s.receipts] }));
    toast.success('Receipt generated automatically!');
  },

  payRent: (unitId, tenantId, amount, method) => {
    const unit = get().units.find((u) => u.id === unitId);
    const tenant = get().tenants.find((t) => t.id === tenantId);
    if (!unit || !tenant) return;
    const mpesaRef = method === 'mpesa' ? `MP${Date.now().toString(36).toUpperCase()}` : undefined;
    get().recordPayment({
      type: 'rent',
      amount,
      method: method as PaymentRecord['method'],
      description: `Rent: ${unit.title}`,
      mpesaRef,
      payerId: tenantId,
      payerName: tenant.name,
      unitId,
      reference: `RENT-${Date.now()}`,
    });
    // Auto-update the building room payment status
    const room = get().buildingRooms.find((r) => r.id === unitId || r.id.includes(unitId));
    if (room) {
      set((s) => ({
        buildingRooms: s.buildingRooms.map((r) =>
          r.id === room.id ? { ...r, paymentStatus: 'paid' as const, lastPaymentDate: now() } : r
        ),
      }));
    }
  },

  // Building room management
  addRoom: (data) => {
    const room: BuildingRoom = {
      id: uid('rm'),
      buildingId: data.buildingId || 'bld-001',
      buildingName: data.buildingName || 'Building',
      number: data.number || '000',
      floor: data.floor || 0,
      bedrooms: data.bedrooms || 1,
      bathrooms: data.bathrooms || 1,
      rentAmount: data.rentAmount || 0,
      status: 'vacant',
      paymentStatus: 'pending',
    };
    set((s) => ({ buildingRooms: [...s.buildingRooms, room] }));
    toast.success(`Room ${room.number} added!`);
  },

  occupyRoom: (roomId, tenantName, tenantPhone) => {
    set((s) => ({
      buildingRooms: s.buildingRooms.map((r) =>
        r.id === roomId ? { ...r, status: 'occupied' as const, tenantName, tenantPhone, paymentStatus: 'pending' as const } : r
      ),
    }));
    toast.success(`Room ${roomId} now occupied by ${tenantName}`);
  },

  vacateRoom: (roomId) => {
    set((s) => ({
      buildingRooms: s.buildingRooms.map((r) =>
        r.id === roomId ? { ...r, status: 'vacant' as const, tenantName: undefined, tenantPhone: undefined, paymentStatus: 'pending' as const } : r
      ),
    }));
    toast.success('Room vacated and available for rent');
  },

  markRoomPaid: (roomId) => {
    set((s) => ({
      buildingRooms: s.buildingRooms.map((r) =>
        r.id === roomId ? { ...r, paymentStatus: 'paid' as const, lastPaymentDate: now() } : r
      ),
    }));
    toast.success('Payment recorded!');
  },

  markRoomOverdue: (roomId) => {
    set((s) => ({
      buildingRooms: s.buildingRooms.map((r) =>
        r.id === roomId ? { ...r, paymentStatus: 'overdue' as const } : r
      ),
    }));
    toast.warning('Room marked as overdue');
  },

  getBuildingStats: (buildingId) => {
    const rooms = get().buildingRooms.filter((r) => r.buildingId === buildingId);
    return {
      total: rooms.length,
      occupied: rooms.filter((r) => r.status === 'occupied').length,
      vacant: rooms.filter((r) => r.status === 'vacant').length,
      paid: rooms.filter((r) => r.paymentStatus === 'paid').length,
      overdue: rooms.filter((r) => r.paymentStatus === 'overdue').length,
    };
  },
}));
