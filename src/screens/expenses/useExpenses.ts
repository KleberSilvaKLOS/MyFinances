/**
 * ============================================================================
 * HOOK CUSTOMIZADO: useExpenses
 * Gerencia o CRUD de lançamentos (receitas e despesas) e sincroniza no AsyncStorage.
 * ============================================================================
 */

import { useState, useCallback, useMemo } from 'react';
import { Alert, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { useTheme } from '../../context/ThemeContext';
import { parseCurrencyInput, formatPrivateValue } from '../../utils/formatters';
import { Transaction } from '../../@types/finance';

export function useExpenses() {
  const { theme, isDark, isVisible, toggleVisibility } = useTheme();

  // Estados principais
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState<string>('');

  // Formulário
  const [description, setDescription] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState<string>('Alimentação');
  const [editingId, setEditingId] = useState<string | null>(null);

  /**
   * Carrega os lançamentos salvos no AsyncStorage.
   */
  const loadTransactions = async () => {
    try {
      const stored = await AsyncStorage.getItem('@myfinance:transactions');
      if (stored) {
        setTransactions(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Erro ao carregar transações:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  /**
   * Salva a lista de lançamentos no AsyncStorage e atualiza o estado local.
   */
  const saveTransactions = async (list: Transaction[]) => {
    try {
      await AsyncStorage.setItem('@myfinance:transactions', JSON.stringify(list));
      setTransactions(list);
    } catch (error) {
      console.log('Erro ao salvar transações:', error);
    }
  };

  /**
   * Adiciona ou edita um lançamento, compatibilizando 'value' e 'amount'.
   */
  const handleSaveTransaction = () => {
    const trimmedDesc = description.trim();
    const numericValue = parseCurrencyInput(value);

    if (!trimmedDesc || numericValue <= 0) {
      Alert.alert('Atenção', 'Informe uma descrição e um valor maior que zero.');
      return;
    }

    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(
      now.getMonth() + 1
    ).padStart(2, '0')}/${now.getFullYear()}`;

    let updatedList: Transaction[] = [];

    if (editingId) {
      updatedList = transactions.map((item) => {
        if (item.id === editingId) {
          const updatedItem = {
            ...item,
            description: trimmedDesc,
            value: numericValue,
            amount: numericValue,
            type,
            category: category.trim() || 'Outros',
          } as unknown as Transaction;
          return updatedItem;
        }
        return item;
      });
      setEditingId(null);
    } else {
      const newTransaction = {
        id: String(Date.now()),
        description: trimmedDesc,
        value: numericValue,
        amount: numericValue,
        type,
        category: category.trim() || 'Outros',
        date: formattedDate,
      } as unknown as Transaction;

      updatedList = [newTransaction, ...transactions];
    }

    saveTransactions(updatedList);

    // Limpa formulário
    setDescription('');
    setValue('');
    setCategory('Alimentação');
    setType('expense');
    Keyboard.dismiss();
  };

  const handleStartEdit = (item: Transaction) => {
    const val = item.value ?? (item as any).amount ?? 0;
    setEditingId(item.id);
    setDescription(item.description);
    setValue(String(val));
    setType(item.type);
    setCategory(item.category || 'Alimentação');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setDescription('');
    setValue('');
    setType('expense');
    setCategory('Alimentação');
    Keyboard.dismiss();
  };

  const handleDeleteTransaction = (id: string) => {
    Alert.alert('Excluir Lançamento', 'Deseja remover este registro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          const updatedList = transactions.filter((t) => t.id !== id);
          saveTransactions(updatedList);
          if (editingId === id) handleCancelEdit();
        },
      },
    ]);
  };

  /**
   * Filtra lançamentos pela busca de texto.
   */
  const filteredTransactions = useMemo(() => {
    if (!search.trim()) return transactions;
    const term = search.toLowerCase();
    return transactions.filter(
      (t) =>
        t.description.toLowerCase().includes(term) ||
        (t.category && t.category.toLowerCase().includes(term))
    );
  }, [transactions, search]);

  /**
   * Totais de entradas, saídas e saldo líquido.
   */
  const { totalIncome, totalExpense, balance } = useMemo(() => {
    let income = 0;
    let expense = 0;

    transactions.forEach((t) => {
      const val = Number(t.value ?? (t as any).amount ?? 0);
      if (t.type === 'income') {
        income += val;
      } else {
        expense += val;
      }
    });

    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
    };
  }, [transactions]);

  const renderValue = (val: number) => formatPrivateValue(val, isVisible);

  return {
    theme,
    isDark,
    isVisible,
    toggleVisibility,
    transactions,
    filteredTransactions,
    search,
    setSearch,
    description,
    setDescription,
    value,
    setValue,
    type,
    setType,
    category,
    setCategory,
    editingId,
    totalIncome,
    totalExpense,
    balance,
    handleSaveTransaction,
    handleStartEdit,
    handleCancelEdit,
    handleDeleteTransaction,
    renderValue,
  };
}