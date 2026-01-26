import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

// IMPORTAÇÃO DO TEMA (Contexto para gerenciar Dark/Light mode)
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

// IMPORTAÇÃO DAS TELAS
import HomeScreen from './src/screens/home/home';
import ExpensesScreen from './src/screens/expenses/expenses';
import SummaryScreen from './src/screens/summary/summary';
import FixedBillsScreen from './src/screens/fixedbills/fixedbills';
import InvestmentsScreen from './src/screens/investments/investments';
import LoginScreen from './src/screens/login/login';
import EmailScreen from './src/screens/auth/email'; 
import PinCreateScreen from './src/screens/auth/pinCreate';

// Criação dos navegadores (Pilha e Abas Inferiores)
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Estilos para os ícones da barra de navegação
const styles = StyleSheet.create({
  // Estilo quando a aba está selecionada (Bola azul flutuante)
  iconFocused: {
    width: 55,
    height: 55,
    backgroundColor: '#3870d8',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 35, // Faz o ícone "saltar" para fora da barra
    elevation: 10,
    shadowColor: '#3870d8',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  // Estilo padrão quando a aba não está selecionada
  iconUnfocused: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});

// COMPONENTE DA BARRA DE NAVEGAÇÃO INFERIOR
function TabNavigator() {
  const { isDark } = useTheme(); // Hook do tema para verificar se é modo escuro

  return (
    <Tab.Navigator
      initialRouteName="Home" 
      screenOptions={{
        headerShown: false, // Remove o cabeçalho padrão
        tabBarShowLabel: false, // Remove os textos abaixo dos ícones
        // Estilização da barra flutuante (arredondada e descolada do fundo)
        tabBarStyle: {
          position: 'absolute',
          bottom: - 3, // Ajuste de posição vertical
          left: 20,
          right: 20,
          elevation: 5,
          backgroundColor: isDark ? '#1e293b' : '#ffffff', // COR DINÂMICA baseada no tema
          borderRadius: 20,
          height: 70,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.1,
          shadowRadius: 3.5,
          borderTopWidth: 0,
          marginBottom: 10,
        },
      }}
    >
      {/* TELA DE GASTOS */}
      <Tab.Screen 
        name="Gastos" 
        component={ExpensesScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={focused ? styles.iconFocused : styles.iconUnfocused}>
              <MaterialIcons name="attach-money" size={30} color={focused ? '#fff' : (isDark ? '#64748b' : '#94a3b8')} />
            </View>
          ),
        }}
      />
      {/* TELA DE CONTAS FIXAS */}
      <Tab.Screen 
        name="Fixas" 
        component={FixedBillsScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={focused ? styles.iconFocused : styles.iconUnfocused}>
              <MaterialIcons name="event-note" size={30} color={focused ? '#fff' : (isDark ? '#64748b' : '#94a3b8')} />
            </View>
          ),
        }}
      />
      {/* TELA HOME (CENTRAL) */}
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={focused ? styles.iconFocused : styles.iconUnfocused}>
              <MaterialIcons name="home" size={30} color={focused ? '#fff' : (isDark ? '#64748b' : '#94a3b8')} />
            </View>
          ),
        }}
      />
      {/* TELA DE RESUMO/GRÁFICOS */}
      <Tab.Screen 
        name="Resumo" 
        component={SummaryScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={focused ? styles.iconFocused : styles.iconUnfocused}>
              <MaterialIcons name="pie-chart" size={30} color={focused ? '#fff' : (isDark ? '#64748b' : '#94a3b8')} />
            </View>
          ),
        }}
      />
      {/* TELA DE INVESTIMENTOS */}
      <Tab.Screen 
        name="Investimentos" 
        component={InvestmentsScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={focused ? styles.iconFocused : styles.iconUnfocused}>
              <MaterialIcons name="trending-up" size={30} color={focused ? '#fff' : (isDark ? '#64748b' : '#94a3b8')} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// COMPONENTE PARA WRAPPER DO TEMA E LÓGICA DE LOGIN
function MainApp() {
  const [isLogged, setIsLogged] = useState(null); // Estado para verificar login (null = carregando)
  const { isDark } = useTheme();

  // Verifica se o usuário já está logado ao abrir o app
  useEffect(() => {
    async function checkLogin() {
      try {
        const logged = await AsyncStorage.getItem('@myfinance:logged');
        const savedPin = await AsyncStorage.getItem('@myfinance:pin');
        // Só considera logado se a flag for true E existir um PIN salvo
        setIsLogged(logged === 'true' && savedPin !== null);
      } catch (e) {
        setIsLogged(false);
      }
    }
    checkLogin();
  }, []);

  // Enquanto verifica o login, retorna null (pode ser substituído por uma Splash Screen)
  if (isLogged === null) return null;

  return (
    <NavigationContainer>
      {/* STATUSBAR TAMBÉM MUDA COM O TEMA */}
      <StatusBar style={isDark ? "light" : "dark"} backgroundColor={isDark ? "#0f172a" : "#3870d8"} />
      
      {/* Navegação em Pilha (Stack) */}
      <Stack.Navigator 
        initialRouteName={isLogged ? 'MainTabs' : 'Login'} // Define tela inicial baseado no login
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="email" component={EmailScreen} />
        <Stack.Screen name="PinCreate" component={PinCreateScreen} />
        
        {/* A navegação por abas (TabNavigator) é uma tela dentro da pilha */}
        <Stack.Screen name="MainTabs" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// COMPONENTE PRINCIPAL QUE ENVOLVE TUDO NO CONTEXTO DE TEMA
export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}