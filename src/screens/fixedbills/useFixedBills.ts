/**
 * ============================================================================
 * HOOK CUSTOMIZADO: useFixedBills (Atualizado)
 * Gerencia contas fixas e integra parcelas ativas de cartões de crédito.
 * ============================================================================
 */

import { useState, useCallback, useMemo } from 'react';
import { Alert, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { useTheme } from '../../context/ThemeContext';
import { parseCurrencyInput, formatPrivateValue } from '../../utils/formatters';
import { FixedBill, PaymentsMap } from './types';
import { CreditCard, CardPurchase } from '../cards/types';
import {
  calculateAllCardsActiveInstallments,
  ActiveCardInstallment,
} from '../../utils/cardCalculations';

export function useFixedBills() {
  const { theme, isDark, isVisible, toggleVisibility } = useTheme();

  // Estados principais
  const [bills, setBills] = useState<FixedBill[]>([]);
  const [payments, setPayments] = useState<PaymentsMap>({});
  const [cardInstallments, setCardInstallments] = useState<ActiveCardInstallment[]>([]);
  const [totalCardInstallments, setTotalCardInstallments] = useState<number>(0);

  // Campos do formulário
  const [title, setTitle] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [dueDay, setDueDay] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  /**
   * Chave única do mês atual no formato "MES_ANO" (ex: "10_2026").
   */
  const currentMonthKey = useMemo(() => {
    const now = new Date();
    return `${now.getMonth()}_${now.getFullYear()}`;
  }, []);

  const todayDay = useMemo(() => new Date().getDate(), []);

  /**
   * Valor total das contas fixas cadastradas.
   */
  const totalBillsAmount = useMemo(() => {
    return bills.reduce((acc, item) => acc + Number(item.value || 0), 0);
  }, [bills]);

  /**
   * Total geral previsto: Contas Fixas + Parcelas de Cartão deste mês.
   */
  const grandTotalAmount = useMemo(() => {
    return totalBillsAmount + totalCardInstallments;
  }, [totalBillsAmount, totalCardInstallments]);

  /**
   * Carrega contas, pagamentos, cartões e compras do AsyncStorage.
   */
  const loadBillsData = async () => {
    try {
      const [storedBills, storedPayments, storedCards, storedPurchases] = await Promise.all([
        AsyncStorage.getItem('@myfinance:fixed_bills'),
        AsyncStorage.getItem('@myfinance:bill_payments'),
        AsyncStorage.getItem('@myfinance:credit_cards'),
        AsyncStorage.getItem('@myfinance:card_purchases'),
      ]);

      if (storedBills) setBills(JSON.parse(storedBills));
      if (storedPayments) setPayments(JSON.parse(storedPayments));

      const cards: CreditCard[] = storedCards ? JSON.parse(storedCards) : [];
      const purchases: CardPurchase[] = storedPurchases ? JSON.parse(storedPurchases) : [];

      const { items, total } = calculateAllCardsActiveInstallments(cards, purchases);
      setCardInstallments(items);
      setTotalCardInstallments(total);
    } catch (error) {
      console.log('Erro ao carregar dados de contas fixas e cartões:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadBillsData();
    }, [])
  );

  const saveBills = async (newList: FixedBill[]) => {
    try {
      await AsyncStorage.setItem('@myfinance:fixed_bills', JSON.stringify(newList));
      setBills(newList);
    } catch (error) {
      console.log('Erro ao salvar contas fixas:', error);
    }
  };

  const savePayments = async (newPayments: PaymentsMap) => {
    try {
      await AsyncStorage.setItem('@myfinance:bill_payments', JSON.stringify(newPayments));
      setPayments(newPayments);
    } catch (error) {
      console.log('Erro ao salvar pagamentos:', error);
    }
  };

  const handleSaveBill = () => {
    const trimmedTitle = title.trim();
    const numericDay = parseInt(dueDay, 10);
    const numericValue = parseCurrencyInput(value);

    if (!trimmedTitle || isNaN(numericDay) || numericValue <= 0) {
      Alert.alert('Atenção', 'Preencha o título, o valor e um dia de vencimento válido (1 a 31).');
      return;
    }

    if (numericDay < 1 || numericDay > 31) {
      Alert.alert('Dia Inválido', 'O dia de vencimento deve estar entre 1 e 31.');
      return;
    }

    let updatedBills = [...bills];

    if (editingId) {
      updatedBills = updatedBills.map((b) =>
        b.id === editingId
          ? { ...b, title: trimmedTitle, value: numericValue, dueDay: numericDay }
          : b
      );
      setEditingId(null);
    } else {
      const newBill: FixedBill = {
        id: String(Date.now()),
        title: trimmedTitle,
        value: numericValue,
        dueDay: numericDay,
      };
      updatedBills.push(newBill);
    }

    updatedBills.sort((a, b) => a.dueDay - b.dueDay);
    saveBills(updatedBills);

    setTitle('');
    setValue('');
    setDueDay('');
    Keyboard.dismiss();
  };

  const handleStartEdit = (bill: FixedBill) => {
    setEditingId(bill.id);
    setTitle(bill.title);
    setValue(String(bill.value));
    setDueDay(String(bill.dueDay));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setValue('');
    setDueDay('');
    Keyboard.dismiss();
  };

  const handleDeleteBill = (id: string) => {
    Alert.alert('Excluir Conta', 'Deseja remover esta conta fixa permanentemente?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          const filtered = bills.filter((b) => b.id !== id);
          saveBills(filtered);

          if (editingId === id) {
            handleCancelEdit();
          }
        },
      },
    ]);
  };

  /**
   * Marca como paga qualquer conta fixa ou parcela de cartão no mês.
   */
  const handleTogglePayment = (itemId: string) => {
    const paymentKey = `${itemId}_${currentMonthKey}`;
    const newPayments = {
      ...payments,
      [paymentKey]: !payments[paymentKey],
    };

    savePayments(newPayments);
  };

  const isBillPaid = (itemId: string): boolean => {
    return !!payments[`${itemId}_${currentMonthKey}`];
  };

  const renderValue = (val: number) => formatPrivateValue(val, isVisible);

  return {
    theme,
    isDark,
    isVisible,
    toggleVisibility,
    bills,
    cardInstallments,
    totalBillsAmount,
    totalCardInstallments,
    grandTotalAmount,
    title,
    setTitle,
    value,
    setValue,
    dueDay,
    setDueDay,
    editingId,
    todayDay,
    handleSaveBill,
    handleStartEdit,
    handleCancelEdit,
    handleDeleteBill,
    handleTogglePayment,
    isBillPaid,
    renderValue,
  };
}