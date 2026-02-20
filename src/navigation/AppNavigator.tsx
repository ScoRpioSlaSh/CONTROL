import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useAuth } from '../context/AuthContext';
import { LoginScreen } from '../screens/LoginScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { ProductsScreen } from '../screens/ProductsScreen';
import { ScannerScreen } from '../screens/ScannerScreen';
import { MovementsScreen } from '../screens/MovementsScreen';
import { ReportsScreen } from '../screens/ReportsScreen';
import { LabelsScreen } from '../screens/LabelsScreen';
import { AdminScreen } from '../screens/AdminScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const { profile } = useAuth();

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Productos" component={ProductsScreen} />
      <Tab.Screen name="Escaner" component={ScannerScreen} />
      <Tab.Screen name="Movimientos" component={MovementsScreen} />
      <Tab.Screen name="Reportes" component={ReportsScreen} />
      <Tab.Screen name="Etiquetas" component={LabelsScreen} />
      {profile?.role === 'ADMIN' ? <Tab.Screen name="Administración" component={AdminScreen} /> : null}
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { session, loading, profile } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {!session ? (
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      ) : !profile?.is_active ? (
        <Stack.Screen
          name="Inactive"
          component={LoginScreen}
          options={{ title: 'Usuario desactivado' }}
        />
      ) : (
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
}
