import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider } from './src/context/ThemeContext';
import AppRoutes from './src/routes/app.routes';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NavigationContainer>
          <StatusBar barStyle="default" />
          <AppRoutes />
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}