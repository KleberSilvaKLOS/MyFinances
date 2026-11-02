/**
 * ============================================================================
 * HOOK CUSTOMIZADO: useSummary
 * Agrupamento de despesas por categoria, taxas de economia e histórico mensal.
 * ============================================================================
 */

import { useState, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { useTheme } from '../../context/ThemeContext';
import { formatPrivateValue } from '../../utils/formatters';
import { Transaction } from '../../@types/finance';
import { CreditCard, CardPurchase } from '../cards/types';
import { calculateAllCardsActiveInstallments } from '../../utils/cardCalculations';

export interface CategorySummaryItem {
  category: string;
  total: number;
  percentage: number;
  color: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Alimentação: '#f59e0b',
  Moradia: '#3b82f6',
  Transporte: '#10b981',
  Lazer: '#ec4899',
  Saúde: '#06b6d4',
  Educação: '#8b5cf6',
  Cartão: '#6366f1',
  Outros: '#64748b',
};

export function useSummary() {
  const { theme, isDark, isVisible, toggleVisibility } = useTheme();

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [purchases, setPurchases] = useState<CardPurchase[]>([]);

  const loadSummaryData = async () => {
    try {
      const [storedTrans, storedCards, storedPurchases] = await Promise.all([
        AsyncStorage.getItem('@myfinance:transactions'),
        AsyncStorage.getItem('@myfinance:credit_cards'),
        AsyncStorage.getItem('@myfinance:card_purchases'),
      ]);

      if (storedTrans) setTransactions(JSON.parse(storedTrans));
      if (storedCards) setCards(JSON.parse(storedCards));
      if (storedPurchases) setPurchases(JSON.parse(storedPurchases));
    } catch (error) {
      console.log('Erro ao carregar dados do resumo:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSummaryData();
    }, [])
  );

  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const formattedMonth = useMemo(() => {
    return currentDate.toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric',
    });
  }, [currentDate]);

  /**
   * Filtra lançamentos e parcelas de cartão para a competência selecionada.
   */
  const monthData = useMemo(() => {
    const selMonth = currentDate.getMonth();
    const selYear = currentDate.getFullYear();

    let income = 0;
    let directExpense = 0;
    const categoryTotals: Record<string, number> = {};

    transactions.forEach((tx) => {
      let txDate: Date | null = null;
      if (tx.date) {
        if (tx.date.includes('/')) {
          const [d, m, y] = tx.date.split('/').map(Number);
          txDate = new Date(y, m - 1, d);
        } else {
          txDate = new Date(tx.date);
        }
      }

      if (txDate && txDate.getMonth() === selMonth && txDate.getFullYear() === selYear) {
        const val = Number(tx.value || 0);
        if (tx.type === 'income') {
          income += val;
        } else {
          directExpense += val;
          const cat = tx.category || 'Outros';
          categoryTotals[cat] = (categoryTotals[cat] || 0) + val;
        }
      }
    });

    // Soma as parcelas ativas de cartões de crédito na competência
    const { items: cardItems, total: cardTotal } = calculateAllCardsActiveInstallments(
      cards,
      purchases,
      currentDate
    );

    if (cardTotal > 0) {
      categoryTotals['Cartão'] = (categoryTotals['Cartão'] || 0) + cardTotal;
    }

    const totalExpense = directExpense + cardTotal;
    const balance = income - totalExpense;
    const savingsRate = income > 0 ? Math.max(0, Math.round((balance / income) * 100)) : 0;

    // Converte agrupamento de categorias para lista ordenada com percentual
    const categories: CategorySummaryItem[] = Object.keys(categoryTotals)
      .map((cat) => {
        const val = categoryTotals[cat];
        return {
          category: cat,
          total: val,
          percentage: totalExpense > 0 ? Math.round((val / totalExpense) * 100) : 0,
          color: CATEGORY_COLORS[cat] || '#64748b',
        };
      })
      .sort((a, b) => b.total - a.total);

    return {
      income,
      totalExpense,
      balance,
      savingsRate,
      categories,
      cardTotal,
      cardItemsCount: cardItems.length,
    };
  }, [transactions, cards, purchases, currentDate]);

  const renderValue = (val: number) => formatPrivateValue(val, isVisible);

  return {
    theme,
    isDark,
    isVisible,
    toggleVisibility,
    formattedMonth,
    handlePrevMonth,
    handleNextMonth,
    monthData,
    renderValue,
  };
}