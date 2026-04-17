import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '../context/AuthContext';

export function ContactsScreen() {
  const { users, profile } = useAuth();

  const contacts = useMemo(() => {
    if (!profile) return [];

    return users.filter((user) => user.id !== profile.id && user.role !== profile.role);
  }, [users, profile]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {contacts.map((contact) => (
        <View key={contact.id} style={styles.card}>
          <View style={[styles.avatar, { backgroundColor: contact.avatarColor }]}>
            <Text style={styles.avatarText}>{contact.name.slice(0, 1)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{contact.name}</Text>
            <Text style={styles.description}>{contact.role.toUpperCase()} · {contact.grade ?? 'Equipo directivo'}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, gap: 10, backgroundColor: '#F5F7FA' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E4EAF2',
    padding: 12,
  },
  avatar: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '700' },
  name: { fontWeight: '700', color: '#1D2D35', fontSize: 15 },
  description: { color: '#607D8B', marginTop: 2 },
});
