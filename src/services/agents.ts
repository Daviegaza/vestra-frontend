import { agents as mockData } from '../data/agents';
import { mockCall } from './api';
import type { Agent } from '../types';

export interface AgentFilters {
  badgeLevel?: string;
  city?: string;
  county?: string;
  page?: number;
  perPage?: number;
}

export async function getAgents(filters: AgentFilters = {}): Promise<{ items: Agent[]; total: number }> {
  let filtered = [...mockData];
  if (filters.badgeLevel) filtered = filtered.filter((a) => a.badgeLevel === filters.badgeLevel);
  if (filters.city) filtered = filtered.filter((a) => a.city.toLowerCase().includes(filters.city!.toLowerCase()));
  if (filters.county) filtered = filtered.filter((a) => a.county === filters.county);
  return mockCall({ items: filtered, total: filtered.length });
}

export async function getAgentById(id: string): Promise<Agent | undefined> {
  return mockCall(mockData.find((a) => a.id === id));
}

export async function getTopAgents(limit = 5): Promise<Agent[]> {
  return mockCall([...mockData].sort((a, b) => b.rating - a.rating).slice(0, limit));
}
