import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../context/ThemeContext';

import HomeScreen from '../screens/home/home';
import ExpensesScreen from '../screens/expenses/expenses';
import FixedBillsScreen from '../screens/fixedbills/fixedbills';
import SummaryScreen from '../screens/summary/summary';
import InvestmentsScreen from '../screens/investments/investments';

const Tab = createBottomTabNavigator();

export function TabRoutes() {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: insets.bottom,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: isDark ? '#0f172a' : '#ffffff00',
          borderRadius: 2,
          height: 50,
          borderTopWidth: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tab.Screen
        name="Gastos"
        component={ExpensesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={focused ? styles.iconFocused : styles.iconUnfocused}>
              <MaterialIcons name="attach-money"
              size={30}
              color={focused ? '#fff' : (isDark ? '#64748b' : '#94a3b8')}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Fixas"
        component={FixedBillsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={focused ? styles.iconFocused : styles.iconUnfocused}>
              <MaterialIcons
                name="event-note"
                size={30}
                color={focused ? '#fff' : (isDark ? '#64748b' : '#94a3b8')}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={focused ? styles.iconFocused : styles.iconUnfocused}>
              <MaterialIcons
                name="home"
                size={30}
                color={focused ? '#fff' : (isDark ? '#64748b' : '#94a3b8')}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Resumo"
        component={SummaryScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={focused ? styles.iconFocused : styles.iconUnfocused}>
              <MaterialIcons
                name="pie-chart"
                size={30}
                color={focused ? '#fff' : (isDark ? '#64748b' : '#94a3b8')}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Investimentos"
        component={InvestmentsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={focused ? styles.iconFocused : styles.iconUnfocused}>
              <MaterialIcons
                name="trending-up"
                size={30}
                color={focused ? '#fff' : (isDark ? '#64748b' : '#94a3b8')}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconFocused: {
    width: 55,
    height: 55,
    backgroundColor: '#3670d8',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    elevation: 10,
    shadowColor: '#3870d8',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  iconUnfocused: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});