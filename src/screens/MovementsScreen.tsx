import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { getKardex } from '../services/inventoryService';
import { InventoryMovement } from '../types/domain';

export function MovementsScreen() {
  const [movements, setMovements] = useState<InventoryMovement[]>([]);

  useEffect(() => {
    getKardex().then(setMovements).catch(console.error);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kardex</Text>
      <FlatList
        data={movements}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.primary}>{item.type}</Text>
            <Text>{item.product_id}</Text>
            <Text>Cant: {item.quantity}</Text>
            <Text>{new Date(item.created_at).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  row: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#efefef', gap: 2 },
  primary: { fontWeight: '700' },
});
