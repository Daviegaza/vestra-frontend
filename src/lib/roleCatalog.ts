import {
  Building, Briefcase, Users, ShoppingBag, Shield,
  type LucideIcon,
} from 'lucide-react';
import type { UserRole } from '../types';

export interface ActivationField {
  name: string;
  label: string;
  placeholder?: string;
  type: 'text' | 'tel' | 'email' | 'number' | 'select' | 'textarea';
  required?: boolean;
  options?: { value: string; label: string }[];
  help?: string;
}

export interface RoleCatalogEntry {
  role: UserRole;
  label: string;
  tagline: string;
  description: string;
  perks: string[];
  activationFields: ActivationField[];
  requiresReview: boolean;
  dashboardPath: string;
  icon: LucideIcon;
  accent: 'emerald' | 'violet' | 'cyan' | 'orange' | 'blue' | 'slate';
  selfServe: boolean;
}

export const ROLE_CATALOG: RoleCatalogEntry[] = [
  {
    role: 'seller',
    label: 'Seller',
    tagline: 'List & sell your property',
    description: 'For homeowners ready to sell. List unlimited properties, get AI verification badges, and reach verified buyers.',
    perks: ['Unlimited property listings', 'AI trust-score & fraud check', 'Buyer inquiries inbox', 'Sale analytics dashboard'],
    activationFields: [
      { name: 'ownershipProof', label: 'Title deed reference', placeholder: 'e.g. NRB/BLOCK/12345', type: 'text', required: true, help: 'Used to verify ownership during listing.' },
      { name: 'sellingCount', label: 'Properties to list', type: 'number', placeholder: '1' },
    ],
    requiresReview: false,
    dashboardPath: '/dashboard/seller',
    icon: ShoppingBag,
    accent: 'emerald',
    selfServe: true,
  },
  {
    role: 'landlord',
    label: 'Landlord',
    tagline: 'Manage units & tenants',
    description: 'Run your rental portfolio. Track tenants, collect rent via M-Pesa, handle maintenance, sign digital leases.',
    perks: ['Multi-unit portfolio view', 'M-Pesa rent collection', 'Tenant onboarding wizard', 'Digital lease + e-sign', 'Maintenance ticket flow'],
    activationFields: [
      { name: 'unitCount', label: 'How many units do you own?', type: 'number', placeholder: '1', required: true },
      { name: 'primaryCity', label: 'Primary city', type: 'text', placeholder: 'Nairobi', required: true },
      { name: 'mpesaPaybill', label: 'M-Pesa paybill (optional)', type: 'text', placeholder: '247247', help: 'Used to auto-reconcile rent payments.' },
    ],
    requiresReview: false,
    dashboardPath: '/dashboard/landlord',
    icon: Building,
    accent: 'violet',
    selfServe: true,
  },
  {
    role: 'agent',
    label: 'Agent',
    tagline: 'Grow your real-estate business',
    description: 'Licensed real-estate agents. Manage listings, leads pipeline, commissions, and a public profile.',
    perks: ['Public agent profile + badge', 'Lead pipeline (CRM-lite)', 'Commission tracker', 'Subscription tiers', 'Featured-listing placements'],
    activationFields: [
      { name: 'licenseNumber', label: 'EARB License Number', placeholder: 'EARB/2024/00000', type: 'text', required: true, help: 'Estate Agents Registration Board (EARB) number.' },
      { name: 'agencyName', label: 'Agency name', placeholder: 'Vestra Realty', type: 'text', required: true },
      { name: 'specialty', label: 'Primary specialty', type: 'select', required: true, options: [
        { value: 'residential', label: 'Residential' },
        { value: 'commercial', label: 'Commercial' },
        { value: 'land', label: 'Land' },
        { value: 'luxury', label: 'Luxury' },
      ] },
    ],
    requiresReview: true,
    dashboardPath: '/dashboard/agent',
    icon: Briefcase,
    accent: 'cyan',
    selfServe: true,
  },
];

export const ROLE_INDEX: Partial<Record<UserRole, RoleCatalogEntry>> = ROLE_CATALOG.reduce(
  (acc, entry) => { acc[entry.role] = entry; return acc; },
  {} as Partial<Record<UserRole, RoleCatalogEntry>>
);

export const BASE_ROLE: UserRole = 'buyer';
export const BASE_ROLE_LABEL = 'Member';
export const BASE_ROLE_ICON: LucideIcon = Users;
export const ADMIN_ICON: LucideIcon = Shield;

export function isUpgradableRole(role: UserRole): boolean {
  return ROLE_CATALOG.some((e) => e.role === role);
}

export function roleAccentClasses(accent: RoleCatalogEntry['accent']) {
  switch (accent) {
    case 'violet': return { bg: 'bg-violet-50 dark:bg-violet-900/20', text: 'text-violet-600 dark:text-violet-400', ring: 'ring-violet-500/30', solid: 'bg-violet-600 hover:bg-violet-700' };
    case 'cyan': return { bg: 'bg-cyan-50 dark:bg-cyan-900/20', text: 'text-cyan-600 dark:text-cyan-400', ring: 'ring-cyan-500/30', solid: 'bg-cyan-600 hover:bg-cyan-700' };
    case 'orange': return { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400', ring: 'ring-orange-500/30', solid: 'bg-orange-600 hover:bg-orange-700' };
    case 'blue': return { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', ring: 'ring-blue-500/30', solid: 'bg-blue-600 hover:bg-blue-700' };
    case 'slate': return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300', ring: 'ring-slate-500/30', solid: 'bg-slate-700 hover:bg-slate-800' };
    case 'emerald':
    default: return { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400', ring: 'ring-emerald-500/30', solid: 'bg-emerald-600 hover:bg-emerald-700' };
  }
}
