// Lógica de negócio, cálculos e leitura do AsyncStorage

/**
 * ============================================================================
 * HOOK CUSTOMIZADO: useHome
 * Centraliza as regras de negócio, persistência e cálculos do dashboard principal.
 * ============================================================================
 */

import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { useTheme } from '../../context/ThemeContext';
import { formatPrivateValue } from '../../utils/formatters';
import { Transaction, FixedBill, ChartItem, CHART_COLORS } from './types';

export function useHome() {
  const navigation = useNavigation<any>();
  const { theme, isDark, toggleTheme, isVisible, toggleVisibility } = useTheme ();

  // Estados dos montantes financeiros
  const [balance, setBalance] = useState<number>(0);
  const [monthExpense, setMonthExpense] = useState<number>(0);
  const [fixedTotal, setFixedTotal] = useState<number>(0);

  //Estados dos dados tratados para renderização
  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [nextBills, setNextBills] = useState<FixedBill[]>([]);

  //Estado do menu lateral (Drawer/Modal)
  const [menuVisible, setMenuVisible] = useState<boolean>(false);

  /**
   * Processa todas as transações cadastradas para apurar:
   * 1. Saldo geral líquido (Receitas - Despesas).
   * 2. Despesas específicas do mês corrente.
   * 3. As 4 maiores categorias de despesa do mês para montagem do gráfico Donut.
   *
   * @param list - Coleção completa de transações recuperada do AsyncStorage.
   */