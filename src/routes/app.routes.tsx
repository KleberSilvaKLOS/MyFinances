import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabRoutes from './tab.routes';
import SettingsScreen from '../screens/settings/settings';

const Stack = createNativeStackNavigator();

export function AppRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabRoutes} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

export default AppRoutes;