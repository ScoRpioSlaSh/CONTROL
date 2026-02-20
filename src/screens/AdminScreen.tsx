import React, { useEffect, useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';

import { supabase } from '../lib/supabase';
import { Role } from '../types/domain';

interface AdminUser {
  id: string;
  full_name: string;
  role: Role;
  is_active: boolean;
}

export function AdminScreen() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('OPERADOR');

  const load = async () => {
    const { data } = await supabase.from('profiles').select('id,full_name,role,is_active').order('full_name');
    setUsers((data ?? []) as AdminUser[]);
  };

  useEffect(() => {
    load().catch(console.error);
  }, []);

  const createUser = async () => {
    const { error } = await supabase.functions.invoke('create-user', {
      body: { email, full_name: name, role },
    });
    if (error) {
      Alert.alert('Error', error.message);
      return;
    }
    setEmail('');
    setName('');
    await load();
  };

  const toggleActive = async (id: string, current: boolean) => {
    const { error } = await supabase.from('profiles').update({ is_active: !current }).eq('id', id);
    if (error) Alert.alert('Error', error.message);
    await load();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Administración de usuarios</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" />
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nombre" />
      <View style={styles.roles}>
        {(['ADMIN', 'OPERADOR', 'LECTURA'] as Role[]).map((r) => (
          <Button key={r} title={r} onPress={() => setRole(r)} />
        ))}
      </View>
      <Button title="Crear usuario" onPress={createUser} />

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.bold}>{item.full_name}</Text>
            <Text>{item.role} · {item.is_active ? 'Activo' : 'Inactivo'}</Text>
            <Button title={item.is_active ? 'Desactivar' : 'Activar'} onPress={() => toggleActive(item.id, item.is_active)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 8 },
  title: { fontSize: 22, fontWeight: '700' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10 },
  roles: { flexDirection: 'row', justifyContent: 'space-between' },
  row: { borderWidth: 1, borderColor: '#efefef', borderRadius: 10, padding: 10, marginTop: 8, gap: 4 },
  bold: { fontWeight: '700' },
});
