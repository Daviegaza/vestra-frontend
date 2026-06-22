import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'vestra_recently_viewed';
const MAX_ITEMS = 8;

export interface RecentView {
  id: string;
  title: string;
  city: string;
  price: number;
  currency: string;
  image?: string;
  listingType: string;
  viewedAt: number;
}

export function useRecentlyViewed() {
  const [items, setItems] = useState<RecentView[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed.slice(0, MAX_ITEMS));
      }
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch { /* ignore */ }
  }, [items, hydrated]);

  const addView = useCallback((property: { id: string; title: string; city: string; price: number; currency?: string; listingType: string; image?: string }) => {
    setItems((prev) => {
      const filtered = prev.filter((v) => v.id !== property.id);
      const entry: RecentView = {
        id: property.id,
        title: property.title,
        city: property.city,
        price: property.price,
        currency: property.currency || 'KES',
        listingType: property.listingType,
        image: property.image,
        viewedAt: Date.now(),
      };
      return [entry, ...filtered].slice(0, MAX_ITEMS);
    });
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((v) => v.id !== id));
  }, []);

  return { items, addView, clearAll, removeItem, hydrated };
}
