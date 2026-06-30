import type { Message } from '../types';
import { apiRequest } from './api';

interface BackendMessage {
  id: string;
  senderId: string;
  receiverId: string;
  subject: string;
  content: string;
  read: boolean;
  createdAt: string;
  sender?: { id: string; fullName: string; avatar?: string };
}

function toMessage(m: BackendMessage): Message {
  return {
    id: m.id,
    senderId: m.senderId,
    senderName: m.sender?.fullName || 'Unknown',
    senderAvatar: m.sender?.avatar || '',
    receiverId: m.receiverId,
    subject: m.subject,
    content: m.content,
    timestamp: m.createdAt,
    read: m.read,
  };
}

export async function getMessages(): Promise<Message[]> {
  const res = await apiRequest<{ messages: BackendMessage[] }>(`/api/messages`);
  return res.messages.map(toMessage);
}

export async function getConversation(userId: string): Promise<Message[]> {
  const all = await getMessages();
  return all.filter((m) => m.senderId === userId || m.receiverId === userId);
}

export async function sendMessage(data: { receiverId: string; subject: string; content: string }): Promise<Message> {
  const res = await apiRequest<{ message: BackendMessage }>(`/api/messages`, {
    method: 'POST',
    body: data,
  });
  return toMessage(res.message);
}
