/**
 * ============================================================================
 * GERENCIADOR DE ROTAS COM AUTENTICAÇÃO REATIVA (Firebase Auth)
 * Alterna dinamicamente entre fluxo deslogado (Auth) e logado (Tabs/Settings).
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged, User } from 'firebase/auth';

import { auth } from '../config/firebase';
import { useTheme } from '../context/ThemeContext';

import LoginScreen from '../screens/auth/login';
import TabRoutes from './tab.routes';
import SettingsScreen from '../screens/settings/settings';

const Stack = createNativeStackNavigator();

export function AppRoutes() {
  const { theme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Escuta mudanças de sessão em tempo real
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, [initializing]);

  // Exibe tela de carregamento neutra enquanto checa o token no AsyncStorage
  if (initializing) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.background,
        }}
      >
        <ActivityIndicator size="large" color="#3870d8" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        // Fluxo de Autenticação
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        // Fluxo Principal (Logado)
        <>
          <Stack.Screen name="MainTabs" component={TabRoutes} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default AppRoutes;