/**
 * ============================================================================
 * HOOK CUSTOMIZADO: useSummary
 * Centraliza o agrupamento mensal, agregação por categorias e cálculo de balanço.
 * ============================================================================
 */

import { useState, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { useTheme } from '../../context/ThemeContext';
import { formatPrivateValue } from '../../utils/formatters';
import {
  Transaction,
  CategorySummary,
  SummaryChartItem,
  PeriodBalance,
  SUMMARY_COLORS,
} from './types';

export function useSummary() {
  const { theme, isDark, isVisible, toggleVisibility } = useTheme();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  /**
   * Carrega o histórico completo de transações do AsyncStorage.
   */
  const loadTransactions = async () => {
    try {
      const stored = await AsyncStorage.getItem('@myfinance:transactions');
      if (stored) {
        setTransactions(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Erro ao carregar transações no resumo:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  /**
   * Navega para o mês anterior.
   */
  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  /**
   * Navega para o próximo mês.
   */
  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  /**
   * Texto formatado do mês e ano em exibição (ex: "Outubro de 2026").
   */
  const formattedMonth = useMemo(() => {
    return currentDate.toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric',
    });
  }, [currentDate]);

  /**
   * Filtra apenas as transações correspondentes ao mês e ano selecionados.
   */
  const monthlyTransactions = useMemo(() => {
    const targetMonth = currentDate.getMonth();
    const targetYear = currentDate.getFullYear();

    return transactions.filter((item) => {
      if (!item.date) return false;
      const [d, m, y] = item.date.split('/').map(Number);
      return m - 1 === targetMonth && y === targetYear;
    });
  }, [transactions, currentDate]);

  /**
   * Balanço do período: Total de Entradas, Total de Saídas e Saldo Líquido.
   */
  const balance: PeriodBalance = useMemo(() => {
    let income = 0;
    let expense = 0;

    monthlyTransactions.forEach((item) => {
      const val = Number(item.value || 0);
      if (item.type === 'income') {
        income += val;
      } else {
        expense += val;
      }
    });

    return {
      totalIncome: income,
      totalExpense: expense,
      netBalance: income - expense,
    };
  }, [monthlyTransactions]);

  /**
   * Agrupa e totaliza as despesas por categoria, calculando suas porcentagens.
   */
  const categorySummaries: CategorySummary[] = useMemo(() => {
    const expenses = monthlyTransactions.filter((item) => item.type === 'expense');
    if (expenses.length === 0 || balance.totalExpense === 0) return [];

    const map: Record<string, number> = {};

    expenses.forEach((item) => {
      const val = Number(item.value || 0);
      const cat = item.description.trim() || 'Outros';
      map[cat] = (map[cat] || 0) + val;
    });

    return Object.entries(map)
      .map(([name, total], index) => ({
        name,
        total,
        percentage: Math.round((total / balance.totalExpense) * 100),
        color: SUMMARY_COLORS[index % SUMMARY_COLORS.length],
      }))
      .sort((a, b) => b.total - a.total);
  }, [monthlyTransactions, balance.totalExpense]);

  /**
   * Dados tratados e formatados para consumo nos gráficos (PieChart / Donut).
   */
  const chartData: SummaryChartItem[] = useMemo(() => {
    return categorySummaries.map((cat) => ({
      name: cat.name,
      population: cat.total,
      color: cat.color,
      legendFontColor: isDark ? '#94a3b8' : '#64748b',
      legendFontSize: 12,
    }));
  }, [categorySummaries, isDark]);

  /**
   * Formata os valores respeitando o modo de privacidade ativo.
   */
  const renderValue = (val: number) => formatPrivateValue(val, isVisible);

  return {
    theme,
    isDark,
    isVisible,
    toggleVisibility,
    formattedMonth,
    balance,
    categorySummaries,
    chartData,
    handlePrevMonth,
    handleNextMonth,
    renderValue,
  };
}