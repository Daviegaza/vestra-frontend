import { messages as mockData } from '../data/messages';
import { mockCall } from './api';
import type { Message } from '../types';

export async function getMessages(): Promise<Message[]> {
  return mockCall(mockData);
}

export async function getConversation(userId: string): Promise<Message[]> {
  return mockCall(mockData.filter((m) => m.senderId === userId || m.receiverId === userId));
}

export async function sendMessage(data: { receiverId: string; subject: string; content: string }): Promise<Message> {
  const store = await import('../store/authStore');
  const user = store.useAuthStore.getState().user;
  const msg: Message = {
    id: `msg-${Date.now()}`,
    senderId: user?.id || 'unknown',
    senderName: user?.fullName || 'Unknown',
    senderAvatar: '',
    receiverId: data.receiverId,
    subject: data.subject,
    content: data.content,
    timestamp: new Date().toISOString(),
    read: false,
  };
  mockData.push(msg);
  return mockCall(msg);
}
