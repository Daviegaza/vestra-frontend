import { notifications as mockData } from '../data/notifications';
import { mockCall } from './api';
import type { Notification } from '../types';

export async function getNotifications(): Promise<{ items: Notification[]; unread: number }> {
  const items = [...mockData];
  return mockCall({ items, unread: items.filter((n) => !n.read).length });
}

export async function markAsRead(id: string): Promise<void> {
  const n = mockData.find((n) => n.id === id);
  if (n) n.read = true;
  return mockCall(undefined);
}

export async function markAllAsRead(): Promise<void> {
  mockData.forEach((n) => (n.read = true));
  return mockCall(undefined);
}
