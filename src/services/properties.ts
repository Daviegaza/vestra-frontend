import type { Property } from '../types';
import { apiRequest } from './api';

export interface PropertyFilters {
  q?: string;
  type?: string;
  listing?: string;
  county?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minBed?: number;
  page?: number;
  perPage?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
}

function buildQuery(filters: PropertyFilters): string {
  const params: string[] = [];
  if (filters.q) params.push(`search=${encodeURIComponent(filters.q)}`);
  if (filters.type) params.push(`propertyType=${filters.type}`);
  if (filters.listing) params.push(`listingType=${filters.listing}`);
  if (filters.county) params.push(`county=${encodeURIComponent(filters.county)}`);
  if (filters.city) params.push(`city=${encodeURIComponent(filters.city)}`);
  if (filters.minPrice) params.push(`minPrice=${filters.minPrice}`);
  if (filters.maxPrice) params.push(`maxPrice=${filters.maxPrice}`);
  const limit = (filters.perPage || 9) * (filters.page || 1) * 4;
  params.push(`limit=${limit}`);
  return params.length ? `?${params.join('&')}` : '';
}

export async function getProperties(filters: PropertyFilters = {}): Promise<PaginatedResult<Property>> {
  const { page = 1, perPage = 9, minBed } = filters;
  const res = await apiRequest<{ properties: Property[] }>(`/api/properties${buildQuery(filters)}`, { auth: false });
  let items = res.properties;
  if (minBed) items = items.filter((p) => p.bedrooms >= minBed);
  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  return { items: items.slice(start, start + perPage), total, page, pages };
}

export async function getPropertyById(id: string): Promise<Property | undefined> {
  try {
    const res = await apiRequest<{ property: Property }>(`/api/properties/${id}`, { auth: false });
    return res.property;
  } catch {
    return undefined;
  }
}

export async function getFeaturedProperties(): Promise<Property[]> {
  const res = await apiRequest<{ properties: Property[] }>(`/api/properties/featured`, { auth: false });
  return res.properties;
}

export async function getSimilarProperties(propertyId: string, limit = 3): Promise<Property[]> {
  const target = await getPropertyById(propertyId);
  if (!target) return [];
  const res = await apiRequest<{ properties: Property[] }>(
    `/api/properties?city=${encodeURIComponent(target.city)}&limit=${limit + 1}`,
    { auth: false },
  );
  return res.properties.filter((p) => p.id !== propertyId).slice(0, limit);
}

export async function getPropertiesByAgent(agentId: string): Promise<Property[]> {
  try {
    const res = await apiRequest<{ listings: Property[] }>(`/api/agents/${agentId}`, { auth: false });
    return res.listings || [];
  } catch {
    return [];
  }
}

export async function createProperty(data: Partial<Property>): Promise<Property> {
  const res = await apiRequest<{ property: Property }>(`/api/properties`, {
    method: 'POST',
    body: data,
  });
  return res.property;
}

export async function deleteProperty(id: string): Promise<void> {
  await apiRequest<{ ok: boolean }>(`/api/properties/${id}`, { method: 'DELETE' });
}
