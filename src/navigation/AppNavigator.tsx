import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useAuth } from '../context/AuthContext';
import { useMessaging, usersById } from '../context/MessagingContext';
import { LoginScreen } from '../screens/LoginScreen';
import { ChatsScreen } from '../screens/ChatsScreen';
import { ChatRoomScreen } from '../screens/ChatRoomScreen';
import { ContactsScreen } from '../screens/ContactsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

export type InboxStackParamList = {
  Chats: undefined;
  ChatRoom: { roomId: string };
};

const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const InboxStack = createNativeStackNavigator<InboxStackParamList>();

function InboxNavigator() {
  const { rooms } = useMessaging();

  return (
    <InboxStack.Navigator>
      <InboxStack.Screen
        name="Chats"
        component={ChatsScreen}
        options={{ title: 'Mensajes del colegio' }}
      />
      <InboxStack.Screen
        name="ChatRoom"
        component={ChatRoomScreen}
        options={({ route }) => ({
          title: rooms.find((room) => room.id === route.params.roomId)?.title ?? 'Conversación',
        })}
      />
    </InboxStack.Navigator>
  );
}

function MainTabs() {
  const { profile, signOut } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        headerRight: () => (
          <Pressable onPress={() => signOut()} style={{ paddingHorizontal: 10, paddingVertical: 6 }}>
            <Text style={{ color: '#1A73E8', fontWeight: '700' }}>Salir</Text>
          </Pressable>
        ),
      }}
    >
      <Tab.Screen
        name="Inbox"
        component={InboxNavigator}
        options={{ title: profile?.role === 'apoderado' ? 'Comunidad escolar' : 'Bandeja docente', headerShown: false }}
      />
      <Tab.Screen
        name="Contactos"
        component={ContactsScreen}
        options={{
          title: 'Contactos',
          headerTitle: profile?.role === 'apoderado' ? 'Equipo docente' : 'Apoderados del curso',
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <RootStack.Navigator>
      {!session ? (
        <RootStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      ) : (
        <RootStack.Screen
          name="Main"
          component={MainTabs}
          options={{
            title: usersById[session.userId]?.name ?? 'Comunidad escolar',
            headerShown: false,
          }}
        />
      )}
    </RootStack.Navigator>
  );
}
