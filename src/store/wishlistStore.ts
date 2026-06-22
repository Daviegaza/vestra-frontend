import { create } from 'zustand';
import { toast } from './toastStore';

interface WishlistState {
  favorites: Set<string>;
  isFavorite: (propertyId: string) => boolean;
  toggle: (propertyId: string) => void;
  all: () => string[];
  clear: () => void;
}

function getStorageKey(): string {
  const raw = localStorage.getItem('vestra_user');
  const userId = raw ? JSON.parse(raw).id : 'anon';
  return `vestra_wishlist_${userId}`;
}

function loadFavorites(): string[] {
  try {
    const raw = localStorage.getItem(getStorageKey());
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveFavorites(ids: string[]) {
  localStorage.setItem(getStorageKey(), JSON.stringify(ids));
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  favorites: new Set(loadFavorites()),

  isFavorite: (propertyId: string) => get().favorites.has(propertyId),

  toggle: (propertyId: string) => {
    const next = new Set(get().favorites);
    const added = !next.has(propertyId);
    if (added) {
      next.add(propertyId);
      toast.success('Added to favorites!');
    } else {
      next.delete(propertyId);
      toast.info('Removed from favorites');
    }
    saveFavorites(Array.from(next));
    set({ favorites: next });
  },

  all: () => Array.from(get().favorites),

  clear: () => {
    saveFavorites([]);
    set({ favorites: new Set() });
  },
}));
