import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const actions = ['Escanear Entrada', 'Escanear Salida', 'Stock Bajo'];

export function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <View style={styles.grid}>
        {actions.map((label) => (
          <TouchableOpacity key={label} style={styles.card}>
            <Text style={styles.cardText}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  grid: { gap: 12 },
  card: { backgroundColor: '#2E3A59', borderRadius: 14, padding: 24 },
  cardText: { color: 'white', fontSize: 20, fontWeight: '600' },
});
