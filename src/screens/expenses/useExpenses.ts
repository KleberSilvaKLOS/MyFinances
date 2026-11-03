/**
 * ============================================================================
 * HOOK CUSTOMIZADO: useExpenses
 * Gerencia lançamentos, máscara monetária BRL em tempo real e categorias.
 * ============================================================================
 */

import { useState, useCallback, useMemo } from 'react';
import { Alert, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { useTheme } from '../../context/ThemeContext';
import { formatPrivateValue } from '../../utils/formatters';
import { Transaction } from '../../@types/finance';

export const DEFAULT_CATEGORIES = [
  'Alimentação',
  'Moradia',
  'Transporte',
  'Lazer',
  'Saúde',
  'Educação',
  'Outros',
];

// Formata texto bruto de dígitos em moeda brasileira (ex: 125000 -> R$ 1.250,00)
export function formatCurrencyBRL(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  const amount = Number(digits) / 100;
  return amount.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

// Converte a string formatada em número puro para salvar no banco
export function parseCurrencyBRL(formatted: string): number {
  const digits = formatted.replace(/\D/g, '');
  return digits ? Number(digits) / 100 : 0;
}

export function useExpenses() {
  const { theme, isDark, isVisible, toggleVisibility } = useTheme();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState<string>('');

  // Categorias
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Formulário
  const [description, setDescription] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState<string>('Alimentação');
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadInitialData = async () => {
    try {
      const [storedTrans, storedCats] = await Promise.all([
        AsyncStorage.getItem('@myfinance:transactions'),
        AsyncStorage.getItem('@myfinance:categories'),
      ]);

      if (storedTrans) {
        setTransactions(JSON.parse(storedTrans));
      }

      if (storedCats) {
        const parsed = JSON.parse(storedCats);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCategories(parsed);
          setCategory((prev) => (parsed.includes(prev) ? prev : parsed[0]));
        }
      } else {
        setCategories(DEFAULT_CATEGORIES);
      }
    } catch (error) {
      console.log('Erro ao carregar dados:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadInitialData();
    }, [])
  );

  const saveTransactions = async (list: Transaction[]) => {
    try {
      await AsyncStorage.setItem('@myfinance:transactions', JSON.stringify(list));
      setTransactions(list);
    } catch (error) {
      console.log('Erro ao salvar transações:', error);
    }
  };

  // Atualiza o valor aplicando a máscara dinâmica conforme o usuário digita
  const handleValueChange = (text: string) => {
    setValue(formatCurrencyBRL(text));
  };

  const handleAddCategory = async () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      Alert.alert('Atenção', 'Informe o nome da categoria.');
      return;
    }

    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      Alert.alert('Atenção', 'Esta categoria já existe.');
      return;
    }

    const updated = [...categories, trimmed];
    try {
      await AsyncStorage.setItem('@myfinance:categories', JSON.stringify(updated));
      setCategories(updated);
      setCategory(trimmed);
      setNewCategoryName('');
      Keyboard.dismiss();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a categoria.');
    }
  };

  const handleMoveCategory = async (catName: string, direction: -1 | 1) => {
    const currentIndex = categories.indexOf(catName);
    if (currentIndex === -1) return;

    const targetIndex = currentIndex + direction;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const reordered = [...categories];
    const [movedItem] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, movedItem);

    try {
      await AsyncStorage.setItem('@myfinance:categories', JSON.stringify(reordered));
      setCategories(reordered);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível reorganizar a categoria.');
    }
  };

  const handleDeleteCategory = (catName: string) => {
    if (categories.length <= 1) {
      Alert.alert('Atenção', 'Você deve manter pelo menos uma categoria cadastrada.');
      return;
    }

    Alert.alert(
      'Excluir Categoria',
      `Deseja remover "${catName}"? Os lançamentos antigos continuarão com ela registrada.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            const updated = categories.filter((c) => c !== catName);
            try {
              await AsyncStorage.setItem('@myfinance:categories', JSON.stringify(updated));
              setCategories(updated);
              if (category === catName) {
                setCategory(updated[0]);
              }
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir a categoria.');
            }
          },
        },
      ]
    );
  };

  const handleSaveTransaction = () => {
    const trimmedDesc = description.trim();
    const numericValue = parseCurrencyBRL(value);

    if (!trimmedDesc || numericValue <= 0) {
      Alert.alert('Atenção', 'Informe a descrição e um valor maior que zero.');
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
          return {
            ...item,
            description: trimmedDesc,
            value: numericValue,
            amount: numericValue,
            type,
            category: category.trim() || 'Outros',
          } as unknown as Transaction;
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
    setDescription('');
    setValue('');
    setType('expense');
    setIsCategoryPickerOpen(false);
    Keyboard.dismiss();
  };

  const handleStartEdit = (item: Transaction) => {
    const val = Number(item.value ?? (item as any).amount ?? 0);
    setEditingId(item.id);
    setDescription(item.description);
    setValue(
      val > 0
        ? val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        : ''
    );
    setType(item.type);
    setCategory(item.category || 'Alimentação');
    setIsCategoryPickerOpen(false);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setDescription('');
    setValue('');
    setType('expense');
    setIsCategoryPickerOpen(false);
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

  const filteredTransactions = useMemo(() => {
    if (!search.trim()) return transactions;
    const term = search.toLowerCase();
    return transactions.filter(
      (t) =>
        t.description.toLowerCase().includes(term) ||
        (t.category && t.category.toLowerCase().includes(term))
    );
  }, [transactions, search]);

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
    filteredTransactions,
    search,
    setSearch,
    categories,
    isCategoryModalVisible,
    setIsCategoryModalVisible,
    isCategoryPickerOpen,
    setIsCategoryPickerOpen,
    newCategoryName,
    setNewCategoryName,
    handleAddCategory,
    handleMoveCategory,
    handleDeleteCategory,
    description,
    setDescription,
    value,
    handleValueChange,
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