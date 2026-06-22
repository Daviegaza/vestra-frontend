import { create } from 'zustand';

export type SubscriptionTier = 'free' | 'basic' | 'pro' | 'premium';

export const tierPrices: Record<SubscriptionTier, number> = {
  free: 0,
  basic: 1000,
  pro: 3500,
  premium: 8000,
};

export const tierFeatures: Record<SubscriptionTier, Record<string, string>> = {
  free: { listings: '3', featured: '—', verification: '1/mo', analytics: 'Basic', leads: '—', placement: 'Bottom', commission: '5%' },
  basic: { listings: '10', featured: '—', verification: '5/mo', analytics: 'Basic', leads: '10/mo', placement: 'Standard', commission: '4%' },
  pro: { listings: '50', featured: '2/mo', verification: 'Unlimited', analytics: 'Advanced', leads: '100/mo', placement: 'Top', commission: '3%' },
  premium: { listings: 'Unlimited', featured: '10/mo', verification: 'Unlimited', analytics: 'Advanced', leads: 'Unlimited', placement: 'Featured', commission: '2%' },
};

interface SubscriptionState {
  tier: SubscriptionTier;
  upgrade: (tier: SubscriptionTier) => void;
  downgrade: () => void;
}

function loadTier(): SubscriptionTier {
  try {
    const raw = localStorage.getItem('vestra_subscription');
    return (raw as SubscriptionTier) || 'free';
  } catch {
    return 'free';
  }
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  tier: loadTier(),

  upgrade: (tier: SubscriptionTier) => {
    localStorage.setItem('vestra_subscription', tier);
    set({ tier });
  },

  downgrade: () => {
    localStorage.setItem('vestra_subscription', 'free');
    set({ tier: 'free' });
  },
}));
