import React, { createContext, useContext, useMemo, useState } from 'react';

import { mockMessages, mockRooms, mockUsers } from '../data/mockSchoolChatData';
import { ChatMessage, ChatRoom } from '../types/chat';

interface MessagingContextValue {
  rooms: ChatRoom[];
  messages: ChatMessage[];
  getRoomMessages: (roomId: string) => ChatMessage[];
  getRoomUnreadCount: (roomId: string, userId: string) => number;
  sendMessage: (roomId: string, senderId: string, text: string) => void;
  markAsRead: (roomId: string, userId: string) => void;
}

const MessagingContext = createContext<MessagingContextValue | undefined>(undefined);

export function MessagingProvider({ children }: { children: React.ReactNode }) {
  const [rooms] = useState<ChatRoom[]>(mockRooms);
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);

  const getRoomMessages = (roomId: string) =>
    messages
      .filter((message) => message.chatId === roomId)
      .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));

  const getRoomUnreadCount = (roomId: string, userId: string) =>
    messages.filter((message) => message.chatId === roomId && !message.readBy.includes(userId)).length;

  const markAsRead = (roomId: string, userId: string) => {
    setMessages((current) =>
      current.map((message) => {
        if (message.chatId !== roomId || message.readBy.includes(userId)) {
          return message;
        }

        return {
          ...message,
          readBy: [...message.readBy, userId],
        };
      }),
    );
  };

  const sendMessage = (roomId: string, senderId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const participants = rooms.find((room) => room.id === roomId)?.participantIds ?? [];

    setMessages((current) => [
      ...current,
      {
        id: `m-${current.length + 1}`,
        chatId: roomId,
        senderId,
        text: trimmed,
        createdAt: new Date().toISOString(),
        readBy: [senderId, ...participants.filter((participantId) => participantId === senderId)],
      },
    ]);
  };

  const value = useMemo(
    () => ({
      rooms,
      messages,
      getRoomMessages,
      getRoomUnreadCount,
      sendMessage,
      markAsRead,
    }),
    [rooms, messages],
  );

  return <MessagingContext.Provider value={value}>{children}</MessagingContext.Provider>;
}

export function useMessaging() {
  const ctx = useContext(MessagingContext);
  if (!ctx) throw new Error('useMessaging debe usarse dentro de MessagingProvider');
  return ctx;
}

export const usersById = Object.fromEntries(mockUsers.map((user) => [user.id, user]));
