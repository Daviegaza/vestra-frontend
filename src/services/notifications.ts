import type { Notification } from '../types';
import { apiRequest } from './api';

interface BackendNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: Notification['type'];
  read: boolean;
  createdAt: string;
}

function toNotification(n: BackendNotification): Notification {
  return {
    id: n.id,
    userId: n.userId,
    title: n.title,
    message: n.message,
    type: n.type,
    read: n.read,
    createdAt: n.createdAt,
  };
}

export async function getNotifications(): Promise<{ items: Notification[]; unread: number }> {
  const res = await apiRequest<{ notifications: BackendNotification[]; unreadCount: number }>(`/api/notifications`);
  return { items: res.notifications.map(toNotification), unread: res.unreadCount };
}

export async function markAsRead(id: string): Promise<void> {
  await apiRequest<{ ok: boolean }>(`/api/notifications/${id}/read`, { method: 'POST' });
}

export async function markAllAsRead(): Promise<void> {
  await apiRequest<{ ok: boolean }>(`/api/notifications/read-all`, { method: 'POST' });
}
