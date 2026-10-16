import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Estrutura da paleta de cores dinâmica do aplicativo.
 */
export interface ThemeColors {
  background: string;
  header: string;
  card: string;
  text: string;
  subtext: string;
  input: string;
  border: string;
  modal: string;
  iconBox: string;
  itemCard: string;
  itemIconBg: string;
}

/**
 * Interface do que o Contexto fornece para as telas.
 */
interface ThemeContextData {
  isDark: boolean;
  toggleTheme: () => Promise<void>;
  theme: ThemeColors;
  isVisible: boolean;
  toggleVisibility: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export const ThemeProvider = ({ children}: { children: ReactNode }) => {
  const deviceScheme = useColorScheme();
  const [isDark, setIsDark] = useState<boolean>(deviceScheme === 'dark');
  const [isVisible, setIsVisible] = useState<boolean>(true);

  /**
   * Carrega as preferências salvas de Tema e Privacidade ao inicar o app.
   */
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const [savedTheme, savedVisibility] = await Promise.all([
          AsyncStorage.getItem('@myfinance:theme'),
          AsyncStorage.getItem('@myfinance:visibility'),
        ]);

        if (savedTheme !== null) {
          setIsDark(savedTheme === 'dark');
        }
        if (savedVisibility !== null) {
          setIsVisible(JSON.parse(savedVisibility));
        }
      } catch (error) {
        console.error('Erro ao carregar preferências:', error);
      }
    };

    loadPreferences();
  }, []);

  /**
   * Alterna entre Modo Claro e Modo Escuro e persiste no AsyncStorage.
   */
  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    await AsyncStorage.setItem('@myfinance:theme', newTheme ? 'dark' : 'light');
  };

  /**
   * Alterna a visibilidade dos valores monetários (Modo Privacidade) e persiste no AsyncStorage.
   */
  const toggleVisibility = async () => {
    const newValue = !isVisible;
    setIsVisible(newValue);
    await AsyncStorage.setItem('@myfinance:visibility', JSON.stringify(newValue));
  };

  /**
   * Paleta de cores unificada de acordo com o tema ativo.
   */
  const theme: ThemeColors = {
    background: isDark ? '#0f172a' : '#fefefe',
    header: isDark ? '#1e293b' : '#3870d8',
    card: isDark ? '#1e293b' : '#ffffff',
    text: isDark ? '#f8fafc' : '#1e293b',
    subtext: isDark ? '#94a3b8' : '#64748b',
    input: isDark ? '#334155' : '#f1f5f9',
    border: isDark ? '#334155' : '#e2e8f0',
    modal: isDark ? '#1e293b' : '#ffffff',
    iconBox: isDark ? '#334155' : '#f1f5f9',
    itemCard: isDark ? '#1e293b' : '#3870d8',
    itemIconBg: isDark ? '#0f172a' : '#233860',
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme, isVisible, toggleVisibility }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook customizado para acessar tema e visibilidade em qualquer tela.
 */
export const useTheme = () => useContext(ThemeContext);