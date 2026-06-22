export type RoleSlug = 'buyer' | 'seller' | 'landlord' | 'tenant' | 'agent' | 'admin';

export interface RoleTheme {
  slug: RoleSlug;
  label: string;
  emoji: string;
  primary: string;
  primaryLight: string;
  primaryText: string;
  secondary: string;
  gradient: string;
  badge: string;
  statIconBg: string;
  statIconColor: string;
}

export const ROLE_THEMES: Record<RoleSlug, RoleTheme> = {
  buyer: {
    slug: 'buyer', label: 'Buyer', emoji: '🏠',
    primary: 'bg-blue-600', primaryLight: 'bg-blue-50', primaryText: 'text-blue-600',
    secondary: 'text-sky-500', gradient: 'from-blue-950 via-blue-900 to-indigo-950',
    badge: 'bg-blue-100 text-blue-700 border-blue-200',
    statIconBg: 'bg-blue-50', statIconColor: 'text-blue-600',
  },
  seller: {
    slug: 'seller', label: 'Seller', emoji: '💰',
    primary: 'bg-emerald-600', primaryLight: 'bg-emerald-50', primaryText: 'text-emerald-600',
    secondary: 'text-teal-500', gradient: 'from-gray-950 via-emerald-950 to-gray-900',
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    statIconBg: 'bg-emerald-50', statIconColor: 'text-emerald-600',
  },
  landlord: {
    slug: 'landlord', label: 'Landlord', emoji: '🏢',
    primary: 'bg-violet-600', primaryLight: 'bg-violet-50', primaryText: 'text-violet-600',
    secondary: 'text-purple-400', gradient: 'from-violet-950 via-purple-950 to-fuchsia-950',
    badge: 'bg-violet-100 text-violet-700 border-violet-200',
    statIconBg: 'bg-violet-50', statIconColor: 'text-violet-600',
  },
  tenant: {
    slug: 'tenant', label: 'Tenant', emoji: '🏡',
    primary: 'bg-orange-600', primaryLight: 'bg-orange-50', primaryText: 'text-orange-600',
    secondary: 'text-amber-500', gradient: 'from-orange-950 via-amber-950 to-yellow-950',
    badge: 'bg-orange-100 text-orange-700 border-orange-200',
    statIconBg: 'bg-orange-50', statIconColor: 'text-orange-600',
  },
  agent: {
    slug: 'agent', label: 'Agent', emoji: '🕴️',
    primary: 'bg-cyan-600', primaryLight: 'bg-cyan-50', primaryText: 'text-cyan-600',
    secondary: 'text-teal-500', gradient: 'from-slate-950 via-cyan-950 to-slate-900',
    badge: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    statIconBg: 'bg-cyan-50', statIconColor: 'text-cyan-600',
  },
  admin: {
    slug: 'admin', label: 'Admin', emoji: '⚙️',
    primary: 'bg-slate-800', primaryLight: 'bg-slate-50', primaryText: 'text-slate-700',
    secondary: 'text-gray-500', gradient: 'from-slate-950 via-gray-950 to-slate-900',
    badge: 'bg-slate-100 text-slate-700 border-slate-200',
    statIconBg: 'bg-slate-50', statIconColor: 'text-slate-600',
  },
};

export function getRoleTheme(role?: string): RoleTheme {
  const slug = (role || 'buyer') as RoleSlug;
  return ROLE_THEMES[slug] || ROLE_THEMES.buyer;
}
