import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTheme } from '../context/ThemeContext';
import { TabRoutes } from './tab.routes';

import LoginScreen from '../screens/login/login';
import EmailScreen from '../screens/auth/email';
import PinCreateScreen from '../screens/auth/pinCreate';

const Stack = createStackNavigator();

export function Routes() {
  const [isLogged, setIsLogged] = useState<boolean | null>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    async function checkLogin() {
      try {
        const logged = await AsyncStorage.getItem('@myfinance:logged');
        const savedPin = await AsyncStorage.getItem('@myfinance:pin');
        setIsLogged(logged === 'true' && savedPin !== null);
      } catch {
        setIsLogged(false);
      }
    }
    checkLogin();
  }, []);

  if (isLogged === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: isDark ? '#0f172a' : '#fff' }}>
        <ActivityIndicator size="large" color="#3870d8" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={isDark ? '#0f172a' : '#3870d8'} />
      <Stack.Navigator
        initialRouteName={isLogged ? 'MainTabs' : 'Login'}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="email" component={EmailScreen} />
        <Stack.Screen name="PinCreate" component={PinCreateScreen} />
        <Stack.Screen name="MainTabs" component={TabRoutes} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}