import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useAuth } from '../context/AuthContext';
import { useMessaging, usersById } from '../context/MessagingContext';
import { InboxStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<InboxStackParamList, 'Chats'>;

export function ChatsScreen({ navigation }: Props) {
  const { profile } = useAuth();
  const { rooms, getRoomMessages, getRoomUnreadCount } = useMessaging();
  const [query, setQuery] = useState('');

  const visibleRooms = useMemo(() => {
    if (!profile) return [];

    return rooms
      .filter((room) => room.participantIds.includes(profile.id))
      .filter((room) => room.title.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => {
        const aLast = getRoomMessages(a.id).at(-1)?.createdAt ?? '';
        const bLast = getRoomMessages(b.id).at(-1)?.createdAt ?? '';
        return +new Date(bLast) - +new Date(aLast);
      });
  }, [rooms, profile, query, getRoomMessages]);

  return (
    <View style={styles.page}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar conversación"
        style={styles.search}
      />

      <ScrollView contentContainerStyle={styles.list}>
        {visibleRooms.map((room) => {
          const lastMessage = getRoomMessages(room.id).at(-1);
          const unreadCount = profile ? getRoomUnreadCount(room.id, profile.id) : 0;
          const lastSender = lastMessage ? usersById[lastMessage.senderId]?.name ?? 'Colegio' : '';

          return (
            <Pressable
              key={room.id}
              onPress={() => navigation.navigate('ChatRoom', { roomId: room.id })}
              style={styles.roomCard}
            >
              <View style={{ flex: 1 }}>
                <View style={styles.roomHeader}>
                  <Text style={styles.roomTitle}>{room.title}</Text>
                  {room.priority === 'importante' ? <Text style={styles.priority}>Importante</Text> : null}
                </View>
                <Text style={styles.meta}>{room.courseTag}</Text>
                <Text numberOfLines={2} style={styles.preview}>
                  {lastMessage ? `${lastSender}: ${lastMessage.text}` : 'Inicia la conversación con el colegio.'}
                </Text>
              </View>
              {unreadCount > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F5F7FA', padding: 12, gap: 10 },
  search: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DFE3EA',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  list: { gap: 10, paddingBottom: 32 },
  roomCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8EDF4',
    padding: 12,
    flexDirection: 'row',
    gap: 12,
  },
  roomHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 },
  roomTitle: { fontSize: 16, fontWeight: '700', color: '#1A1F36', flex: 1 },
  priority: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B71C1C',
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
  },
  meta: { fontSize: 12, color: '#5E6C84', marginTop: 2 },
  preview: { marginTop: 6, color: '#344563', fontSize: 13 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#1A73E8',
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: { color: '#fff', fontWeight: '700', fontSize: 12 },
});
