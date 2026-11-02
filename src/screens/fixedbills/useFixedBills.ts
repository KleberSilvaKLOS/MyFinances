/**
 * ============================================================================
 * HOOK CUSTOMIZADO: useFixedBills
 * Gerencia contas fixas, parcelamentos de cartões e sincronização de despesas.
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
import { Transaction } from '../../@types/finance';
import {
  calculateAllCardsActiveInstallments,
  ActiveCardInstallment,
} from '../../utils/cardCalculations';

export function useFixedBills() {
  const { theme, isDark, isVisible, toggleVisibility } = useTheme();

  // Controle de competência mensal
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // Dados persistidos
  const [bills, setBills] = useState<FixedBill[]>([]);
  const [payments, setPayments] = useState<PaymentsMap>({});
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [purchases, setPurchases] = useState<CardPurchase[]>([]);

  // Formulário de cadastro/edição
  const [title, setTitle] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [dueDay, setDueDay] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

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

  const currentMonthKey = useMemo(() => {
    return `${currentDate.getMonth()}_${currentDate.getFullYear()}`;
  }, [currentDate]);

  const isItemOverdue = useCallback(
    (dueDayNum: number, isPaid: boolean): boolean => {
      if (isPaid) return false;

      const now = new Date();
      const currentRealMonth = now.getMonth();
      const currentRealYear = now.getFullYear();
      const selMonth = currentDate.getMonth();
      const selYear = currentDate.getFullYear();

      if (selYear < currentRealYear || (selYear === currentRealYear && selMonth < currentRealMonth)) {
        return true;
      }

      if (selYear > currentRealYear || (selYear === currentRealYear && selMonth > currentRealMonth)) {
        return false;
      }

      return dueDayNum < now.getDate();
    },
    [currentDate]
  );

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
      if (storedCards) setCards(JSON.parse(storedCards));
      if (storedPurchases) setPurchases(JSON.parse(storedPurchases));
    } catch (error) {
      console.log('Erro ao carregar dados:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadBillsData();
    }, [])
  );

  const { cardInstallments, totalCardInstallments } = useMemo(() => {
    const { items, total } = calculateAllCardsActiveInstallments(cards, purchases, currentDate);
    return { cardInstallments: items, totalCardInstallments: total };
  }, [cards, purchases, currentDate]);

  const totalBillsAmount = useMemo(() => {
    return bills.reduce((acc, item) => acc + Number(item.value || 0), 0);
  }, [bills]);

  const grandTotalAmount = useMemo(() => {
    return totalBillsAmount + totalCardInstallments;
  }, [totalBillsAmount, totalCardInstallments]);

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
        onPress: async () => {
          const filtered = bills.filter((b) => b.id !== id);
          saveBills(filtered);

          try {
            const rawTrans = await AsyncStorage.getItem('@myfinance:transactions');
            if (rawTrans) {
              const currentTrans: Transaction[] = JSON.parse(rawTrans);
              const txKey = `tx_bill_${id}_${currentMonthKey}`;
              const updatedTrans = currentTrans.filter((t) => t.id !== txKey);
              await AsyncStorage.setItem('@myfinance:transactions', JSON.stringify(updatedTrans));
            }
          } catch (e) {
            console.log('Erro ao remover transação vinculada:', e);
          }

          if (editingId === id) handleCancelEdit();
        },
      },
    ]);
  };

  const handleTogglePayment = async (itemId: string) => {
    const paymentKey = `${itemId}_${currentMonthKey}`;
    const willBePaid = !payments[paymentKey];

    const newPayments = {
      ...payments,
      [paymentKey]: willBePaid,
    };
    savePayments(newPayments);

    try {
      const rawTrans = await AsyncStorage.getItem('@myfinance:transactions');
      const currentTrans: Transaction[] = rawTrans ? JSON.parse(rawTrans) : [];
      const txLinkedId = `tx_bill_${itemId}_${currentMonthKey}`;

      if (willBePaid) {
        const bill = bills.find((b) => b.id === itemId);
        const inst = cardInstallments.find((i) => i.purchaseId === itemId);

        if (!bill && !inst) return;

        const now = new Date();
        const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(
          now.getMonth() + 1
        ).padStart(2, '0')}/${now.getFullYear()}`;

        const desc = bill
          ? `Pagamento: ${bill.title}`
          : `Parcela ${inst!.currentInstallment}/${inst!.totalInstallments} - ${inst!.description} (${inst!.cardName})`;

        const expenseVal = bill ? Number(bill.value) : Number(inst!.value);
        const cat = bill ? 'Contas Fixas' : 'Cartão';

        // Objeto compatível com ambas as interfaces ('value' ou 'amount')
        const newExpenseTx = {
          id: txLinkedId,
          description: desc,
          value: expenseVal,
          amount: expenseVal,
          type: 'expense',
          category: cat,
          date: formattedDate,
        } as unknown as Transaction;

        const updatedTrans = [newExpenseTx, ...currentTrans.filter((t) => t.id !== txLinkedId)];
        await AsyncStorage.setItem('@myfinance:transactions', JSON.stringify(updatedTrans));
      } else {
        const updatedTrans = currentTrans.filter((t) => t.id !== txLinkedId);
        await AsyncStorage.setItem('@myfinance:transactions', JSON.stringify(updatedTrans));
      }
    } catch (error) {
      console.log('Erro ao sincronizar transação de pagamento:', error);
    }
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
    formattedMonth,
    handlePrevMonth,
    handleNextMonth,
    title,
    setTitle,
    value,
    setValue,
    dueDay,
    setDueDay,
    editingId,
    handleSaveBill,
    handleStartEdit,
    handleCancelEdit,
    handleDeleteBill,
    handleTogglePayment,
    isBillPaid,
    isItemOverdue,
    renderValue,
  };
}