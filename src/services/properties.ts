import { properties as mockData } from '../data/properties';
import { mockCall } from './api';
import type { Property } from '../types';

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

export async function getProperties(filters: PropertyFilters = {}): Promise<PaginatedResult<Property>> {
  const { q, type, listing, county, city, minPrice, maxPrice, minBed, page = 1, perPage = 9 } = filters;

  let filtered = [...mockData];

  if (q) {
    const lq = q.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(lq) ||
        p.city.toLowerCase().includes(lq) ||
        p.county.toLowerCase().includes(lq) ||
        p.description.toLowerCase().includes(lq),
    );
  }
  if (type) filtered = filtered.filter((p) => p.propertyType === type);
  if (listing) filtered = filtered.filter((p) => p.listingType === listing);
  if (county) filtered = filtered.filter((p) => p.county === county);
  if (city) filtered = filtered.filter((p) => p.city === city);
  if (minPrice) filtered = filtered.filter((p) => p.price >= minPrice);
  if (maxPrice) filtered = filtered.filter((p) => p.price <= maxPrice);
  if (minBed) filtered = filtered.filter((p) => p.bedrooms >= minBed);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;

  return mockCall({
    items: filtered.slice(start, start + perPage),
    total,
    page,
    pages,
  });
}

export async function getPropertyById(id: string): Promise<Property | undefined> {
  return mockCall(mockData.find((p) => p.id === id));
}

export async function getFeaturedProperties(): Promise<Property[]> {
  return mockCall(mockData.filter((p) => p.isFeatured));
}

export async function getSimilarProperties(propertyId: string, limit = 3): Promise<Property[]> {
  const prop = mockData.find((p) => p.id === propertyId);
  if (!prop) return mockCall([]);
  return mockCall(
    mockData.filter((p) => p.id !== propertyId && (p.city === prop.city || p.county === prop.county)).slice(0, limit),
  );
}

export async function getPropertiesByAgent(agentId: string): Promise<Property[]> {
  return mockCall(mockData.filter((p) => p.agentId === agentId));
}

export async function createProperty(data: Partial<Property>): Promise<Property> {
  const p: Property = {
    id: `prop-${Date.now()}`,
    title: data.title || 'Untitled',
    description: data.description || '',
    propertyType: data.propertyType || 'residential',
    listingType: data.listingType || 'sale',
    status: 'active',
    price: data.price || 0,
    currency: 'KES',
    bedrooms: data.bedrooms || 0,
    bathrooms: data.bathrooms || 0,
    sizeSqft: data.sizeSqft || 0,
    yearBuilt: data.yearBuilt || 2024,
    address: data.address || '',
    city: data.city || '',
    county: data.county || '',
    country: 'Kenya',
    lat: data.lat || -1.2921,
    lng: data.lng || 36.8219,
    amenities: data.amenities || [],
    images: data.images || ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
    trustScore: 80,
    isVerified: false,
    isFeatured: false,
    views: 0,
    inquiries: 0,
    ownerId: data.ownerId || '',
    agentId: data.agentId,
    createdAt: new Date().toISOString(),
  };
  mockData.unshift(p);
  return mockCall(p);
}

export async function deleteProperty(id: string): Promise<void> {
  const idx = mockData.findIndex((p) => p.id === id);
  if (idx >= 0) mockData.splice(idx, 1);
  return mockCall(undefined);
}
