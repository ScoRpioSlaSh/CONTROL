import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { getStockReport } from '../services/inventoryService';
import { StockRow } from '../types/domain';

export function ReportsScreen() {
  const [stock, setStock] = useState<StockRow[]>([]);

  useEffect(() => {
    getStockReport().then(setStock).catch(console.error);
  }, []);

  const valuation = stock.reduce((acc, item) => acc + item.quantity * item.average_cost, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reportes</Text>
      <Text style={styles.valuation}>Valorización total: ${valuation.toFixed(2)}</Text>
      <FlatList
        data={stock}
        keyExtractor={(item) => item.product_id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.bold}>{item.name}</Text>
            <Text>Stock: {item.quantity}</Text>
            <Text>Costo prom: ${item.average_cost.toFixed(2)}</Text>
            {item.quantity <= item.min_stock ? <Text style={styles.low}>⚠ Stock bajo</Text> : null}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: '700' },
  valuation: { marginVertical: 10, fontWeight: '600' },
  row: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  bold: { fontWeight: '700' },
  low: { color: '#c24e00', fontWeight: '700' },
});
