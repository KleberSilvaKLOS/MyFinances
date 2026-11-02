/**
 * ============================================================================
 * HOOK CUSTOMIZADO: useHome
 * Centraliza saldos, pendências de contas fixas e parcelamentos ativos de cartões.
 * ============================================================================
 */

import { useState, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { useTheme } from '../../context/ThemeContext';
import { formatPrivateValue } from '../../utils/formatters';
import { Transaction } from '../../@types/finance';
import { FixedBill, PaymentsMap } from '../fixedbills/types';
import { CreditCard, CardPurchase } from '../cards/types';
import {
  calculateAllCardsActiveInstallments,
  ActiveCardInstallment,
} from '../../utils/cardCalculations';

export function useHome() {
  const { theme, isDark, isVisible, toggleVisibility } = useTheme();

  // Estados dos dados brutos
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [fixedBills, setFixedBills] = useState<FixedBill[]>([]);
  const [billPayments, setBillPayments] = useState<PaymentsMap>({});
  const [cardInstallments, setCardInstallments] = useState<ActiveCardInstallment[]>([]);
  const [totalCardInstallments, setTotalCardInstallments] = useState<number>(0);

  const currentMonthKey = useMemo(() => {
    const now = new Date();
    return `${now.getMonth()}_${now.getFullYear()}`;
  }, []);

  const todayDay = useMemo(() => new Date().getDate(), []);

  /**
   * Carrega todos os registros do AsyncStorage em paralelo.
   */
  const loadHomeData = async () => {
    try {
      const [
        storedTrans,
        storedBills,
        storedPayments,
        storedCards,
        storedPurchases,
      ] = await Promise.all([
        AsyncStorage.getItem('@myfinance:transactions'),
        AsyncStorage.getItem('@myfinance:fixed_bills'),
        AsyncStorage.getItem('@myfinance:bill_payments'),
        AsyncStorage.getItem('@myfinance:credit_cards'),
        AsyncStorage.getItem('@myfinance:card_purchases'),
      ]);

      if (storedTrans) setTransactions(JSON.parse(storedTrans));
      if (storedBills) setFixedBills(JSON.parse(storedBills));
      if (storedPayments) setBillPayments(JSON.parse(storedPayments));

      const cards: CreditCard[] = storedCards ? JSON.parse(storedCards) : [];
      const purchases: CardPurchase[] = storedPurchases ? JSON.parse(storedPurchases) : [];

      const { items, total } = calculateAllCardsActiveInstallments(cards, purchases);
      setCardInstallments(items);
      setTotalCardInstallments(total);
    } catch (error) {
      console.log('Erro ao carregar dados da Home:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadHomeData();
    }, [])
  );

  /**
   * Totais de entradas, saídas e saldo líquido geral de lançamentos.
   */
  const { totalIncome, totalExpense, currentBalance } = useMemo(() => {
    let income = 0;
    let expense = 0;

    transactions.forEach((item) => {
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
      currentBalance: income - expense,
    };
  }, [transactions]);

  /**
   * Total de contas fixas tradicionais cadastradas.
   */
  const totalFixedBills = useMemo(() => {
    return fixedBills.reduce((acc, item) => acc + Number(item.value || 0), 0);
  }, [fixedBills]);

  /**
   * Contas fixas pendentes no mês atual.
   */
  const pendingBills = useMemo(() => {
    return fixedBills.filter((bill) => !billPayments[`${bill.id}_${currentMonthKey}`]);
  }, [fixedBills, billPayments, currentMonthKey]);

  /**
   * Parcelamentos de cartões pendentes no mês atual.
   */
  const pendingCardInstallments = useMemo(() => {
    return cardInstallments.filter((inst) => !billPayments[`${inst.purchaseId}_${currentMonthKey}`]);
  }, [cardInstallments, billPayments, currentMonthKey]);

  /**
   * Total geral comprometido com contas e faturas no mês.
   */
  const totalMonthlyCommitments = useMemo(() => {
    return totalFixedBills + totalCardInstallments;
  }, [totalFixedBills, totalCardInstallments]);

  const renderValue = (val: number) => formatPrivateValue(val, isVisible);

  return {
    theme,
    isDark,
    isVisible,
    toggleVisibility,
    currentBalance,
    totalIncome,
    totalExpense,
    totalFixedBills,
    totalCardInstallments,
    totalMonthlyCommitments,
    pendingBills,
    cardInstallments,
    pendingCardInstallments,
    todayDay,
    renderValue,
  };
}