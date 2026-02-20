import React, { useEffect, useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import { getProducts } from '../services/inventoryService';
import { Product } from '../types/domain';
import { buildLabelHtml } from '../utils/labels';

export function LabelsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  useEffect(() => {
    getProducts().then(setProducts).catch(console.error);
  }, []);

  const onGenerate = async () => {
    const list = products.filter((p) => selected[p.id]);
    if (!list.length) {
      Alert.alert('Selecciona productos');
      return;
    }

    const html = buildLabelHtml(list);
    const { uri } = await Print.printToFileAsync({ html, width: 595, height: 842 });
    await Sharing.shareAsync(uri);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Etiquetas QR</Text>
      <Button title="Generar PDF A4" onPress={onGenerate} />
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.row, selected[item.id] ? styles.selected : undefined]}
            onPress={() => setSelected((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
          >
            <Text>{item.name} ({item.sku})</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 10 },
  title: { fontSize: 24, fontWeight: '700' },
  row: { borderWidth: 1, borderColor: '#e7e7e7', borderRadius: 8, padding: 12, marginBottom: 8 },
  selected: { backgroundColor: '#E8F0FE' },
});
