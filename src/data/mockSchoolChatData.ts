import { AppUser, ChatMessage, ChatRoom } from '../types/chat';

export const mockUsers: AppUser[] = [
  {
    id: 'parent-1',
    name: 'Carla Muñoz',
    role: 'apoderado',
    grade: '2° Básico A',
    avatarColor: '#34A853',
  },
  {
    id: 'teacher-1',
    name: 'Prof. Andrea Salazar',
    role: 'docente',
    grade: '2° Básico A',
    avatarColor: '#1A73E8',
  },
  {
    id: 'teacher-2',
    name: 'Prof. Luis Paredes',
    role: 'docente',
    grade: 'Convivencia escolar',
    avatarColor: '#FB8C00',
  },
  {
    id: 'admin-1',
    name: 'Coordinación Académica',
    role: 'admin',
    avatarColor: '#7E57C2',
  },
];

export const mockRooms: ChatRoom[] = [
  {
    id: 'room-curso-2a',
    title: '2° Básico A · Profesora Jefe',
    participantIds: ['parent-1', 'teacher-1', 'admin-1'],
    courseTag: 'Curso',
  },
  {
    id: 'room-convivencia',
    title: 'Convivencia escolar',
    participantIds: ['parent-1', 'teacher-2', 'admin-1'],
    courseTag: 'Soporte',
    priority: 'importante',
  },
];

export const mockMessages: ChatMessage[] = [
  {
    id: 'm-1',
    chatId: 'room-curso-2a',
    senderId: 'teacher-1',
    text: 'Buenas tardes. Les recuerdo que mañana deben traer su cuaderno de ciencias.',
    createdAt: '2026-04-15T15:30:00.000Z',
    readBy: ['teacher-1', 'parent-1'],
  },
  {
    id: 'm-2',
    chatId: 'room-curso-2a',
    senderId: 'parent-1',
    text: '¡Gracias profesora! ¿Puede confirmar si también deben llevar lápices de colores?',
    createdAt: '2026-04-15T15:34:00.000Z',
    readBy: ['teacher-1', 'parent-1'],
  },
  {
    id: 'm-3',
    chatId: 'room-curso-2a',
    senderId: 'teacher-1',
    text: 'Sí, por favor. 12 colores serán suficientes 🙂',
    createdAt: '2026-04-15T15:38:00.000Z',
    readBy: ['teacher-1', 'parent-1'],
  },
  {
    id: 'm-4',
    chatId: 'room-convivencia',
    senderId: 'teacher-2',
    text: 'Recordatorio: la charla de uso responsable de redes será este viernes a las 10:00.',
    createdAt: '2026-04-16T13:10:00.000Z',
    readBy: ['teacher-2', 'admin-1'],
  },
];

export const quickReplies = [
  'Gracias por el aviso',
  'Confirmo recepción',
  '¿Podemos agendar una reunión?',
  'Enviaré la autorización hoy',
];
