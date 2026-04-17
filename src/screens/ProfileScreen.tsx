import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAuth } from '../context/AuthContext';

export function ProfileScreen() {
  const { profile } = useAuth();

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text>No hay sesión activa.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.avatar, { backgroundColor: profile.avatarColor }]}>
        <Text style={styles.avatarText}>{profile.name.slice(0, 1)}</Text>
      </View>
      <Text style={styles.name}>{profile.name}</Text>
      <Text style={styles.role}>{profile.role.toUpperCase()}</Text>
      <Text style={styles.grade}>{profile.grade ?? 'Comunidad escolar'}</Text>

      <View style={styles.notice}>
        <Text style={styles.noticeTitle}>Privacidad y seguridad</Text>
        <Text style={styles.noticeText}>
          Las conversaciones están enfocadas en comunicación académica y convivencia escolar.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F5F7FA',
    gap: 10,
  },
  avatar: { width: 82, height: 82, borderRadius: 41, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 34 },
  name: { fontSize: 24, fontWeight: '800', color: '#1C2B33' },
  role: {
    color: '#1A73E8',
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 18,
    backgroundColor: '#E8F0FE',
  },
  grade: { color: '#607D8B' },
  notice: {
    marginTop: 20,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E4EAF2',
    padding: 14,
    gap: 6,
  },
  noticeTitle: { fontWeight: '700', color: '#1D2D35' },
  noticeText: { color: '#546E7A', lineHeight: 20 },
});
