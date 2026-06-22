import { useAsync } from './useAsync';
import { getAgents, getAgentById, getTopAgents, type AgentFilters } from '../services/agents';

export function useAgents(filters: AgentFilters = {}) {
  return useAsync(() => getAgents(filters), [filters.badgeLevel, filters.city, filters.county]);
}

export function useAgent(id: string) {
  return useAsync(async () => {
    const agent = await getAgentById(id);
    if (!agent) throw new Error('Agent not found');
    return agent;
  }, [id]);
}

export function useTopAgents(limit = 5) {
  return useAsync(() => getTopAgents(limit), [limit]);
}
