import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '../context/AuthContext';

export function LoginScreen() {
  const { users, signInAs } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState(users[0]?.id ?? '');

  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId),
    [users, selectedUserId],
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>SchoolChat</Text>
      <Text style={styles.subtitle}>Comunicación segura entre apoderados y docentes</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Selecciona un perfil de prueba</Text>
        {users.map((user) => {
          const isSelected = user.id === selectedUserId;
          return (
            <Pressable
              key={user.id}
              onPress={() => setSelectedUserId(user.id)}
              style={[styles.userOption, isSelected && styles.userOptionSelected]}
            >
              <View style={[styles.avatar, { backgroundColor: user.avatarColor }]}>
                <Text style={styles.avatarText}>{user.name.slice(0, 1)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userRole}>{user.role.toUpperCase()} · {user.grade ?? 'Gestión general'}</Text>
              </View>
            </Pressable>
          );
        })}

        <Pressable style={styles.loginButton} onPress={() => signInAs(selectedUserId)}>
          <Text style={styles.loginButtonText}>
            Entrar como {selectedUser?.role ?? 'usuario'}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F4F8FF',
    gap: 16,
  },
  title: { fontSize: 34, fontWeight: '800', textAlign: 'center', color: '#0D47A1' },
  subtitle: { fontSize: 16, textAlign: 'center', color: '#455A64' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    gap: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#263238' },
  userOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#E3EAF5',
    borderRadius: 12,
    padding: 10,
  },
  userOptionSelected: { borderColor: '#1A73E8', backgroundColor: '#E8F0FE' },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '700' },
  userName: { fontSize: 15, fontWeight: '600', color: '#102027' },
  userRole: { fontSize: 12, color: '#546E7A' },
  loginButton: {
    marginTop: 8,
    backgroundColor: '#1A73E8',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 12,
  },
  loginButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
