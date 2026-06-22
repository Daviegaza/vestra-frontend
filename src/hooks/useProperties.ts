import { useMemo } from 'react';
import { useAsync } from './useAsync';
import { getProperties, getFeaturedProperties, getPropertyById, getSimilarProperties, type PropertyFilters } from '../services/properties';

export function useProperties(filters: PropertyFilters = {}) {
  const deps = useMemo(
    () => [filters.q, filters.type, filters.listing, filters.county, filters.city, String(filters.minPrice || ''), String(filters.maxPrice || ''), String(filters.minBed || ''), filters.page, filters.perPage].filter(Boolean),
    [filters],
  );
  return useAsync(() => getProperties(filters), deps);
}

export function useFeaturedProperties() {
  return useAsync(() => getFeaturedProperties(), []);
}

export function useProperty(id: string) {
  return useAsync(async () => {
    const prop = await getPropertyById(id);
    if (!prop) throw new Error('Property not found');
    return prop;
  }, [id]);
}

export function useSimilarProperties(propertyId: string, limit = 3) {
  return useAsync(() => getSimilarProperties(propertyId, limit), [propertyId, limit]);
}
