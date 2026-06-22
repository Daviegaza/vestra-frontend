type ShortcutHandler = () => void;

interface Shortcut {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  handler: ShortcutHandler;
  description: string;
  category: 'navigation' | 'action' | 'global';
}

const shortcuts: Shortcut[] = [];

export function registerShortcut(
  key: string,
  handler: ShortcutHandler,
  description: string,
  category: 'navigation' | 'action' | 'global' = 'action',
  modifiers?: { ctrl?: boolean; meta?: boolean; shift?: boolean }
) {
  shortcuts.push({
    key: key.toLowerCase(),
    handler,
    description,
    category,
    ctrl: modifiers?.ctrl ?? false,
    meta: modifiers?.meta ?? (category === 'global'),
    shift: modifiers?.shift ?? false,
  });
}

export function unregisterShortcut(key: string) {
  const idx = shortcuts.findIndex((s) => s.key === key.toLowerCase());
  if (idx > -1) shortcuts.splice(idx, 1);
}

export function getShortcuts(): Shortcut[] {
  return [...shortcuts];
}

export function getShortcutsByCategory(): Record<string, Shortcut[]> {
  return shortcuts.reduce(
    (acc, s) => {
      (acc[s.category] ||= []).push(s);
      return acc;
    },
    {} as Record<string, Shortcut[]>
  );
}

// Initialize global keyboard listener
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    // Don't trigger shortcuts when typing in inputs
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.tagName === 'SELECT' ||
      target.isContentEditable
    ) {
      return;
    }

    for (const shortcut of shortcuts) {
      const keyMatch = e.key.toLowerCase() === shortcut.key;
      const ctrlMatch = shortcut.ctrl ? e.ctrlKey || e.metaKey : !e.ctrlKey && !e.metaKey;
      const metaMatch = shortcut.meta ? e.metaKey || e.ctrlKey : true;
      const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;

      if (keyMatch && ctrlMatch && metaMatch && shiftMatch) {
        e.preventDefault();
        shortcut.handler();
        break;
      }
    }
  });
}
