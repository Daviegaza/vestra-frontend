import { create } from 'zustand';

interface OnboardingState {
  hasCompletedOnboarding: boolean;
  showWizard: boolean;
  complete: () => void;
  dismiss: () => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  hasCompletedOnboarding: localStorage.getItem('vestra_onboarding_done') === 'true',
  showWizard: false,

  complete: () => {
    localStorage.setItem('vestra_onboarding_done', 'true');
    set({ hasCompletedOnboarding: true, showWizard: false });
  },

  dismiss: () => {
    set({ showWizard: false });
  },

  reset: () => {
    localStorage.removeItem('vestra_onboarding_done');
    set({ hasCompletedOnboarding: false, showWizard: false });
  },
}));

// Show wizard for new users after registration
export function triggerOnboarding() {
  const store = useOnboardingStore.getState();
  if (!store.hasCompletedOnboarding) {
    store.showWizard = true;
    useOnboardingStore.setState({ showWizard: true });
  }
}
