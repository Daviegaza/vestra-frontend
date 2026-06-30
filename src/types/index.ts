export type UserRole = 'buyer' | 'seller' | 'agent' | 'landlord' | 'tenant' | 'admin';

export type PropertyType = 'residential' | 'commercial' | 'land' | 'industrial' | 'agricultural' | 'student_housing' | 'short_stay';
export type ListingType = 'sale' | 'rent' | 'lease';
export type PropertyStatus = 'active' | 'pending' | 'sold' | 'rented' | 'suspended';

export interface Property {
  id: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  listingType: ListingType;
  status: PropertyStatus;
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  sizeSqft: number;
  yearBuilt: number;
  address: string;
  city: string;
  county: string;
  country: string;
  lat: number;
  lng: number;
  amenities: string[];
  images: string[];
  trustScore: number;
  isVerified: boolean;
  isFeatured: boolean;
  views: number;
  inquiries: number;
  ownerId: string;
  agentId?: string;
  createdAt: string;
}

export interface Agent {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  agencyName: string;
  licenseNumber: string;
  badgeLevel: 'bronze' | 'silver' | 'gold' | 'platinum';
  rating: number;
  reviewCount: number;
  listingCount: number;
  soldCount: number;
  bio: string;
  specialties: string[];
  city: string;
  county: string;
  subscriptionTier: 'free' | 'basic' | 'pro' | 'premium';
  joinedAt: string;
}

export type RoleStatus = 'active' | 'pending' | 'suspended';

export interface RoleProfile {
  role: UserRole;
  status: RoleStatus;
  activatedAt: string;
  /** Role-specific metadata captured during activation. */
  meta?: Record<string, string | number | boolean>;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  /** All roles the user has activated. Always contains at least 'buyer' at runtime. */
  roles: UserRole[];
  /** The role whose dashboard/nav is currently in view. */
  activeRole: UserRole;
  /** Per-role metadata (license #, agency, units, etc.). */
  roleProfiles?: RoleProfile[];
  /**
   * @deprecated Kept for back-compat with legacy storage. Mirrors activeRole.
   */
  role?: UserRole;
  avatar?: string;
  isVerified: boolean;
  isKycVerified: boolean;
  location?: string;
  bio?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  receiverId: string;
  subject: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'payment' | 'verification' | 'message';
  read: boolean;
  createdAt: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorAvatar: string;
  category: string;
  image: string;
  publishedAt: string;
  readTime: string;
}

export interface EscrowTransaction {
  id: string;
  propertyId: string;
  propertyTitle: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  currency: string;
  status: 'initiated' | 'deposit_paid' | 'balance_paid' | 'completed' | 'cancelled' | 'refunded' | 'disputed';
  createdAt: string;
}

export interface RentalUnit {
  id: string;
  title: string;
  address: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  rentAmount: number;
  currency: string;
  status: 'vacant' | 'occupied' | 'maintenance';
  tenantId?: string;
  tenantName?: string;
  leaseStart?: string;
  leaseEnd?: string;
  image: string;
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  unitId: string;
  unitTitle: string;
  leaseStart: string;
  leaseEnd: string;
  rentAmount: number;
  currency: string;
  status: 'active' | 'notice' | 'expired';
  avatar: string;
}

export interface MaintenanceRequest {
  id: string;
  unitId: string;
  unitTitle: string;
  tenantId: string;
  tenantName: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'emergency';
  status: 'reported' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyTitle: string;
  message: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed' | 'lost';
  createdAt: string;
}

export interface Commission {
  id: string;
  propertyTitle: string;
  salePrice: number;
  commissionRate: number;
  commissionAmount: number;
  currency: string;
  status: 'pending' | 'paid' | 'cancelled';
  closedAt: string;
}

export interface RentReceipt {
  id: string;
  unitTitle: string;
  amount: number;
  currency: string;
  period: string;
  paidAt: string;
  paymentMethod: string;
  mpesaRef?: string;
  tenantId?: string;
  landlordId?: string;
}

export interface LeaseAgreement {
  id: string;
  unitId: string;
  unitTitle: string;
  landlordId: string;
  landlordName: string;
  tenantId: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  rentAmount: number;
  currency: string;
  deposit: number;
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'expiring_soon' | 'expired' | 'terminated';
  terms: string;
  signedByLandlord: boolean;
  signedByTenant: boolean;
  createdAt: string;
}

export interface MpesaSTKPush {
  id: string;
  phone: string;
  amount: number;
  currency: string;
  reference: string;
  description: string;
  status: 'pending' | 'sent' | 'completed' | 'failed' | 'cancelled';
  mpesaReceipt?: string;
  createdAt: string;
  completedAt?: string;
}

export interface PaymentRecord {
  id: string;
  type: 'rent' | 'deposit' | 'escrow' | 'verification' | 'subscription' | 'promotion';
  amount: number;
  currency: string;
  method: 'mpesa' | 'bank_transfer' | 'card' | 'cash';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  reference: string;
  mpesaRef?: string;
  description: string;
  payerId: string;
  payerName: string;
  recipientId?: string;
  recipientName?: string;
  propertyId?: string;
  unitId?: string;
  createdAt: string;
  completedAt?: string;
}

export interface TenantOnboarding {
  id: string;
  unitId: string;
  unitTitle: string;
  landlordId: string;
  landlordName: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  rentAmount: number;
  currency: string;
  status: 'invited' | 'accepted' | 'declined' | 'active';
  invitedAt: string;
  acceptedAt?: string;
}

export interface RentalCollection {
  totalExpected: number;
  totalCollected: number;
  collectionRate: number;
  overdue: number;
  onTime: number;
  pending: number;
  monthlyBreakdown: { month: string; collected: number; expected: number }[];
}
