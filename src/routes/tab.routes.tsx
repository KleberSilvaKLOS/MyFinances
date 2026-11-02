/**
 * ============================================================================
 * ROTAS DE NAVEGAÇÃO POR ABAS (BOTTOM TABS)
 * Integração das 5 telas modulares com suporte a tema dinâmico e ícones.
 * =====================================    =======================================
 */

import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '../context/ThemeContext';

// Importação das telas refatoradas
import HomeScreen from '../screens/home/home';  
import ExpensesScreen from '../screens/expenses/expenses';
import FixedBillsScreen from '../screens/fixedbills/fixedbills';  
import CardsScreen from '../screens/cards/cards';
import SummaryScreen from '../screens/summary/summary';

console.log('Telas carregadas:', {
  HomeScreen: !!HomeScreen,
  ExpensesScreen: !!ExpensesScreen,
  FixedBillsScreen: !!FixedBillsScreen,
  CardsScreen: !!CardsScreen,
  SummaryScreen: !!SummaryScreen,
});

const Tab = createBottomTabNavigator();

export default function TabRoutes() {
  const { theme, isDark } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#3870d8',
        tabBarInactiveTintColor: isDark ? '#64748b' : '#94a3b8',
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          height: Platform.OS === 'ios' ? 88 : 65,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 8,
          borderTopWidth: 1,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >

      {/* 2. Lançamentos / Gastos */}
      <Tab.Screen
        name="Gastos"
        component={ExpensesScreen}
        options={{
          tabBarLabel: 'Gastos',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'wallet' : 'wallet-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* 3. Contas Fixas */}
      <Tab.Screen
        name="Fixas"
        component={FixedBillsScreen}
        options={{
          tabBarLabel: 'Fixas',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons
              name={focused ? 'receipt-long' : 'receipt'}
              size={size}
              color={color}
            />
          ),
        }}
      />

        {/* 1. Tela Inicial */}
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Início',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={size}
                color={color}
              />
            ),
          }}
        />
      {/* 4. Gestão de Cartões de Crédito */}
      <Tab.Screen
        name="Cartoes"
        component={CardsScreen}
        options={{
          tabBarLabel: 'Cartões',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'card' : 'card-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* 5. Resumo e Gráficos */}
      <Tab.Screen
        name="Resumo"
        component={SummaryScreen}
        options={{
          tabBarLabel: 'Resumo',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'pie-chart' : 'pie-chart-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
  }