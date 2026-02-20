import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useAuth } from '../context/AuthContext';
import { getProducts, upsertProduct } from '../services/inventoryService';
import { Product } from '../types/domain';

export function ProductsScreen() {
  const { profile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');

  const load = async () => setProducts(await getProducts());

  useEffect(() => {
    void load();
  }, []);

  const createProduct = async () => {
    try {
      await upsertProduct({ name, sku, qr_value: sku, active: true });
      setName('');
      setSku('');
      await load();
    } catch (error) {
      Alert.alert('No se pudo guardar', (error as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Productos</Text>
      {profile?.role !== 'LECTURA' ? (
        <View style={styles.form}>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nombre" />
          <TextInput style={styles.input} value={sku} onChangeText={setSku} placeholder="SKU" />
          <TouchableOpacity style={styles.btn} onPress={createProduct}>
            <Text style={styles.btnText}>Guardar producto</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.rowTitle}>{item.name}</Text>
            <Text>{item.sku} · QR: {item.qr_value}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 10 },
  title: { fontSize: 24, fontWeight: '700' },
  form: { gap: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10 },
  btn: { backgroundColor: '#2E3A59', borderRadius: 8, padding: 12, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: '600' },
  row: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#ececec' },
  rowTitle: { fontWeight: '700' },
});
