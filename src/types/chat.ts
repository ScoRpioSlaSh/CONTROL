export type UserRole = 'apoderado' | 'docente' | 'admin';

export interface AppUser {
  id: string;
  name: string;
  role: UserRole;
  grade?: string;
  avatarColor: string;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: string;
  readBy: string[];
}

export interface ChatRoom {
  id: string;
  title: string;
  participantIds: string[];
  courseTag: string;
  priority?: 'normal' | 'importante';
}
