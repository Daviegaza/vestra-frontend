import type { Agent } from '../types';
import { apiRequest } from './api';

export interface AgentFilters {
  badgeLevel?: string;
  city?: string;
  county?: string;
  page?: number;
  perPage?: number;
}

interface BackendAgentUser {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  avatar?: string;
  location?: string;
  bio?: string;
  agentProfile?: {
    agencyName?: string;
    licenseNumber?: string;
    badgeLevel?: string;
    rating?: number;
    reviewCount?: number;
    specialties?: string[];
    city?: string;
    county?: string;
    subscriptionTier?: string;
    createdAt?: string;
  };
}

function toAgent(u: BackendAgentUser): Agent {
  const p = u.agentProfile || {};
  return {
    id: u.id,
    userId: u.id,
    name: u.fullName,
    email: u.email,
    phone: u.phone,
    avatar: u.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(u.fullName)}`,
    agencyName: p.agencyName || '',
    licenseNumber: p.licenseNumber || '',
    badgeLevel: (p.badgeLevel as Agent['badgeLevel']) || 'bronze',
    rating: p.rating ?? 0,
    reviewCount: p.reviewCount ?? 0,
    listingCount: 0,
    soldCount: 0,
    bio: u.bio || '',
    specialties: p.specialties || [],
    city: p.city || u.location || '',
    county: p.county || '',
    subscriptionTier: (p.subscriptionTier as Agent['subscriptionTier']) || 'free',
    joinedAt: p.createdAt || new Date().toISOString(),
  };
}

export async function getAgents(filters: AgentFilters = {}): Promise<{ items: Agent[]; total: number }> {
  const res = await apiRequest<{ agents: BackendAgentUser[] }>(`/api/agents`, { auth: false });
  let items = res.agents.map(toAgent);
  if (filters.badgeLevel) items = items.filter((a) => a.badgeLevel === filters.badgeLevel);
  if (filters.city) items = items.filter((a) => a.city.toLowerCase().includes(filters.city!.toLowerCase()));
  if (filters.county) items = items.filter((a) => a.county === filters.county);
  return { items, total: items.length };
}

export async function getAgentById(id: string): Promise<Agent | undefined> {
  try {
    const res = await apiRequest<{ agent: BackendAgentUser }>(`/api/agents/${id}`, { auth: false });
    return toAgent(res.agent);
  } catch {
    return undefined;
  }
}

export async function getTopAgents(limit = 5): Promise<Agent[]> {
  const { items } = await getAgents();
  return items.sort((a, b) => b.rating - a.rating).slice(0, limit);
}
