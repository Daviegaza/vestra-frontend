import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

function applyTheme(t: Theme) {
  const root = document.documentElement;
  if (t === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'light',

  toggle: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('vestra_theme', next);
    set({ theme: next });
  },

  setTheme: (t: Theme) => {
    applyTheme(t);
    localStorage.setItem('vestra_theme', t);
    set({ theme: t });
  },
}));

export function initTheme() {
  const stored = localStorage.getItem('vestra_theme') as Theme | null;
  const theme = stored || getSystemTheme();
  applyTheme(theme);
  useThemeStore.setState({ theme });
}
