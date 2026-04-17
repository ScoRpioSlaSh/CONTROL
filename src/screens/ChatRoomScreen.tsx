import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { quickReplies } from '../data/mockSchoolChatData';
import { useAuth } from '../context/AuthContext';
import { useMessaging, usersById } from '../context/MessagingContext';
import { InboxStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<InboxStackParamList, 'ChatRoom'>;

export function ChatRoomScreen({ route }: Props) {
  const { roomId } = route.params;
  const { profile } = useAuth();
  const { getRoomMessages, sendMessage, markAsRead } = useMessaging();
  const [draft, setDraft] = useState('');

  const roomMessages = useMemo(() => getRoomMessages(roomId), [getRoomMessages, roomId]);

  useEffect(() => {
    if (profile) {
      markAsRead(roomId, profile.id);
    }
  }, [markAsRead, profile, roomId, roomMessages.length]);

  const onSend = () => {
    if (!profile) return;
    sendMessage(roomId, profile.id, draft);
    setDraft('');
  };

  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={styles.messagesList}>
        {roomMessages.map((message) => {
          const isMine = message.senderId === profile?.id;
          const sender = usersById[message.senderId];
          const timestamp = new Date(message.createdAt).toLocaleTimeString('es-CL', {
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <View key={message.id} style={[styles.bubble, isMine ? styles.myBubble : styles.otherBubble]}>
              {!isMine ? <Text style={styles.sender}>{sender?.name ?? 'Docente'}</Text> : null}
              <Text style={[styles.body, isMine && styles.myBody]}>{message.text}</Text>
              <Text style={[styles.time, isMine && styles.myTime]}>{timestamp}</Text>
            </View>
          );
        })}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickReplies}>
        {quickReplies.map((reply) => (
          <Pressable key={reply} onPress={() => setDraft(reply)} style={styles.quickReplyChip}>
            <Text style={styles.quickReplyText}>{reply}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.inputRow}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Escribe un mensaje al colegio"
          style={styles.input}
          multiline
        />
        <Pressable onPress={onSend} style={styles.sendBtn}>
          <Text style={styles.sendText}>Enviar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#EEF3FB' },
  messagesList: { padding: 12, gap: 8 },
  bubble: {
    maxWidth: '84%',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  myBubble: { alignSelf: 'flex-end', backgroundColor: '#1A73E8' },
  otherBubble: { alignSelf: 'flex-start', backgroundColor: '#fff' },
  sender: { fontSize: 12, color: '#607D8B', marginBottom: 2, fontWeight: '600' },
  body: { fontSize: 15, color: '#263238' },
  myBody: { color: '#fff' },
  time: { marginTop: 4, color: '#607D8B', fontSize: 11, textAlign: 'right' },
  myTime: { color: '#D7E7FF' },
  quickReplies: { paddingHorizontal: 10, paddingVertical: 8, gap: 8 },
  quickReplyChip: {
    backgroundColor: '#fff',
    borderColor: '#D6E4FF',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  quickReplyText: { color: '#1A4FA8', fontSize: 12, fontWeight: '600' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#DDE4F0',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    maxHeight: 90,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDE3EA',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  sendBtn: {
    backgroundColor: '#1A73E8',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  sendText: { color: '#fff', fontWeight: '700' },
});
