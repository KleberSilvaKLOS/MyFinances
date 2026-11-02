/**
 * ============================================================================
 * ROTAS DE PILHA PRINCIPAIS (STACK NAVIGATOR)
 * ============================================================================
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabRoutes from './tab.routes';

const Stack = createNativeStackNavigator();

export function AppRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabRoutes} />
    </Stack.Navigator>
  );
}

export default AppRoutes;