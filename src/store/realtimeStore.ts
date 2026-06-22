import { create } from 'zustand';

export interface RealtimeNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'payment' | 'verification' | 'message';
  read: boolean;
  createdAt: string;
  userId: string;
}

interface RealtimeState {
  notifications: RealtimeNotification[];
  unreadCount: number;
  isConnected: boolean;
  lastUpdate: string | null;

  connect: () => void;
  disconnect: () => void;
  addNotification: (n: Partial<RealtimeNotification>) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clearAll: () => void;
}

let intervalId: ReturnType<typeof setInterval> | null = null;
let counter = 500;

function uid() { return `rt-${++counter}`; }
function now() { return new Date().toISOString(); }

const simulatedEvents = [
  { title: 'New Property Match', message: 'A new property matching your criteria was just listed.', type: 'info' as const },
  { title: 'Price Drop Alert', message: 'A saved property dropped in price by KES 500,000.', type: 'success' as const },
  { title: 'New Message', message: 'You have a new message from an agent.', type: 'message' as const },
  { title: 'Verification Complete', message: 'Your property verification report is ready.', type: 'verification' as const },
  { title: 'Payment Received', message: 'Rent payment of KES 45,000 has been received.', type: 'payment' as const },
  { title: 'Lease Expiring Soon', message: 'A lease is expiring in 30 days.', type: 'warning' as const },
];

export const useRealtimeStore = create<RealtimeState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isConnected: false,
  lastUpdate: null,

  connect: () => {
    if (get().isConnected) return;
    set({ isConnected: true, lastUpdate: now() });

    // Simulate incoming notifications every 15-45 seconds
    intervalId = setInterval(() => {
      const event = simulatedEvents[Math.floor(Math.random() * simulatedEvents.length)];
      get().addNotification({
        title: event.title,
        message: event.message,
        type: event.type,
        userId: 'user-001',
      });
    }, 15000 + Math.random() * 30000);
  },

  disconnect: () => {
    if (intervalId) { clearInterval(intervalId); intervalId = null; }
    set({ isConnected: false });
  },

  addNotification: (n) => {
    const notif: RealtimeNotification = {
      id: uid(),
      title: n.title || 'Notification',
      message: n.message || '',
      type: n.type || 'info',
      read: false,
      createdAt: now(),
      userId: n.userId || 'user-001',
    };
    set((s) => ({
      notifications: [notif, ...s.notifications].slice(0, 100),
      unreadCount: s.unreadCount + 1,
      lastUpdate: now(),
    }));
  },

  markRead: (id) => {
    set((s) => {
      const notifications = s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
      return { notifications, unreadCount: notifications.filter((n) => !n.read).length };
    });
  },

  markAllRead: () => {
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  clearAll: () => {
    set({ notifications: [], unreadCount: 0 });
  },
}));
