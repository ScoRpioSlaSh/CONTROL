import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

import { createMovement } from '../services/inventoryService';
import { useAuth } from '../context/AuthContext';
import { MovementType } from '../types/domain';

export function ScannerScreen() {
  const { profile } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();
  const [mode, setMode] = useState<MovementType>('ENTRADA');
  const [quantity, setQuantity] = useState('1');

  if (!permission?.granted) {
    return (
      <View style={styles.center}>
        <Button title="Dar permiso de cámara" onPress={() => requestPermission()} />
      </View>
    );
  }

  const onScanned = async ({ data }: { data: string }) => {
    if (profile?.role === 'LECTURA') {
      Alert.alert('Permiso denegado', 'Tu rol no puede crear movimientos.');
      return;
    }

    try {
      await createMovement({
        type: mode,
        quantity: Number(quantity),
        product_id: data,
      });
      Alert.alert('Éxito', `Movimiento ${mode} registrado`);
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escáner QR</Text>
      <View style={styles.modes}>
        {(['ENTRADA', 'SALIDA', 'AJUSTE_POSITIVO'] as MovementType[]).map((item) => (
          <Button key={item} title={item} onPress={() => setMode(item)} />
        ))}
      </View>
      <TextInput
        style={styles.input}
        value={quantity}
        keyboardType="numeric"
        onChangeText={setQuantity}
        placeholder="Cantidad"
      />
      <CameraView style={styles.camera} barcodeScannerSettings={{ barcodeTypes: ['qr'] }} onBarcodeScanned={onScanned} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700' },
  modes: { flexDirection: 'row', justifyContent: 'space-between' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10 },
  camera: { flex: 1, borderRadius: 12, overflow: 'hidden' },
});
