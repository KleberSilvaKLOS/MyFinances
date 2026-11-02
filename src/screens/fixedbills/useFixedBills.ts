/**
 * ============================================================================
 * HOOK CUSTOMIZADO: useFixedBills
 * Centraliza as regras de negócio, liquidação mensal e persistência de contas fixas.
 * ============================================================================
 */

import { useState, useCallback, useMemo } from 'react';
import { Alert, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { useTheme } from '../../context/ThemeContext';
import { parseCurrencyInput, formatPrivateValue } from '../../utils/formatters';
import { FixedBill, PaymentsMap } from './types';

export function useFixedBills() {
  const { theme, isDark, isVisible, toggleVisibility } = useTheme();

  // Estados principais
  const [bills, setBills] = useState<FixedBill[]>([]);
  const [payments, setPayments] = useState<PaymentsMap>({});

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

  /**
   * Dia atual do mês para comparação de atrasos.
   */
  const todayDay = useMemo(() => new Date().getDate(), []);

  /**
   * Valor total somado de todas as contas fixas cadastradas.
   */
  const totalAmount = useMemo(() => {
    return bills.reduce((acc, item) => acc + Number(item.value || 0), 0);
  }, [bills]);

  /**
   * Carrega as contas cadastradas e o mapa de pagamentos do AsyncStorage.
   */
  const loadBillsData = async () => {
    try {
      const [storedBills, storedPayments] = await Promise.all([
        AsyncStorage.getItem('@myfinance:fixed_bills'),
        AsyncStorage.getItem('@myfinance:bill_payments'),
      ]);

      if (storedBills) setBills(JSON.parse(storedBills));
      if (storedPayments) setPayments(JSON.parse(storedPayments));
    } catch (error) {
      console.log('Erro ao carregar dados de contas fixas:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadBillsData();
    }, [])
  );

  /**
   * Salva a lista de contas fixas no armazenamento local.
   */
  const saveBills = async (newList: FixedBill[]) => {
    try {
      await AsyncStorage.setItem('@myfinance:fixed_bills', JSON.stringify(newList));
      setBills(newList);
    } catch (error) {
      console.log('Erro ao salvar contas fixas:', error);
    }
  };

  /**
   * Salva o mapa de pagamentos mensais no armazenamento local.
   */
  const savePayments = async (newPayments: PaymentsMap) => {
    try {
      await AsyncStorage.setItem('@myfinance:bill_payments', JSON.stringify(newPayments));
      setPayments(newPayments);
    } catch (error) {
      console.log('Erro ao salvar pagamentos:', error);
    }
  };

  /**
   * Adiciona uma nova conta fixa ou atualiza a conta em edição.
   */
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

    // Ordena pelo dia de vencimento
    updatedBills.sort((a, b) => a.dueDay - b.dueDay);

    saveBills(updatedBills);

    setTitle('');
    setValue('');
    setDueDay('');
    Keyboard.dismiss();
  };

  /**
   * Prepara o formulário para edição de uma conta fixa.
   */
  const handleStartEdit = (bill: FixedBill) => {
    setEditingId(bill.id);
    setTitle(bill.title);
    setValue(String(bill.value));
    setDueDay(String(bill.dueDay));
  };

  /**
   * Cancela o modo de edição e limpa os campos.
   */
  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setValue('');
    setDueDay('');
    Keyboard.dismiss();
  };

  /**
   * Remove permanentemente uma conta fixa do catálogo.
   */
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
   * Alterna o estado de liquidação (pago / não pago) da conta no mês corrente.
   */
  const handleTogglePayment = (billId: string) => {
    const paymentKey = `${billId}_${currentMonthKey}`;
    const newPayments = {
      ...payments,
      [paymentKey]: !payments[paymentKey],
    };

    savePayments(newPayments);
  };

  /**
   * Verifica se a conta está paga no mês corrente.
   */
  const isBillPaid = (billId: string): boolean => {
    return !!payments[`${billId}_${currentMonthKey}`];
  };

  /**
   * Formata valores respeitando o modo de privacidade do ThemeContext.
   */
  const renderValue = (val: number) => formatPrivateValue(val, isVisible);

  return {
    theme,
    isDark,
    isVisible,
    toggleVisibility,
    bills,
    totalAmount,
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