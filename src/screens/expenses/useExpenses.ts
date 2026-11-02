/**
 * ============================================================================
 * HOOK CUSTOMIZADO: useExpenses
 * Centraliza as regras de negócio, persistência e gestão de lançamentos financeiros.
 * ============================================================================
 */

import { useState, useEffect, useCallback } from 'react';
import { Alert, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { useTheme } from '../../context/ThemeContext';
import { parseCurrencyInput, formatPrivateValue } from '../../utils/formatters';
import { Transaction, DEFAULT_SUGGESTIONS } from './types';

export function useExpenses() {
  const { theme, isDark, isVisible, toggleVisibility } = useTheme();

  // Estados dos dados armazenados
  const [list, setList] = useState<Transaction[]>([]);
  const [customCategories, setCustomCategories] = useState<string[]>([]);

  // Estados de cálculo financeiro
  const [balance, setBalance] = useState<number>(0);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpense, setTotalExpense] = useState<number>(0);

  // Estados de formulário e modal
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Campos de entrada da transação
  const [value, setValue] = useState<string>('');
  const [description, setDescription] = useState<string>(''); // Categoria
  const [detail, setDetail] = useState<string>('');           // Descrição complementar
  const [type, setType] = useState<'income' | 'expense'>('expense');

  // Gestão de categorias personalizadas
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [editingCategoryIndex, setEditingCategoryIndex] = useState<number | null>(null);

  // Mecanismo de autocomplete / sugestões
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  /**
   * Recalcula o saldo geral, somatório de receitas e de despesas
   * sempre que o registo de transações sofrer alterações.
   *
   * @param currentList - Coleção atual de transações.
   */
  const calculateTotals = (currentList: Transaction[]) => {
    let total = 0;
    let income = 0;
    let expense = 0;

    currentList.forEach((item) => {
      const val = Number(item.value);
      if (item.type === 'income') {
        total += val;
        income += val;
      } else {
        total -= val;
        expense += val;
      }
    });

    setBalance(total);
    setTotalIncome(income);
    setTotalExpense(expense);
  };

  useEffect(() => {
    calculateTotals(list);
  }, [list]);

  /**
   * Lê os dados persistidos de transações e categorias criadas.
   */
  const loadStoredData = async () => {
    try {
      const [transJson, catJson] = await Promise.all([
        AsyncStorage.getItem('@myfinance:transactions'),
        AsyncStorage.getItem('@myfinance:categories'),
      ]);

      if (transJson) setList(JSON.parse(transJson));
      if (catJson) setCustomCategories(JSON.parse(catJson));
    } catch (error) {
      console.log('Erro ao carregar lançamentos/categorias:', error);
    }
  };

  /**
   * Recarrega os registos sempre que o ecrã recebe foco.
   */
  useFocusEffect(
    useCallback(() => {
      loadStoredData();
    }, [])
  );

  /**
   * Persiste a lista atualizada de transações no armazenamento local.
   *
   * @param newList - Novo array de transações.
   */
  const saveTransactions = async (newList: Transaction[]) => {
    try {
      await AsyncStorage.setItem('@myfinance:transactions', JSON.stringify(newList));
      setList(newList);
    } catch (error) {
      console.log('Erro ao salvar transações:', error);
    }
  };

  /**
   * Persiste a lista de categorias personalizadas no armazenamento local.
   *
   * @param newCategories - Novo array de categorias.
   */
  const saveCategories = async (newCategories: string[]) => {
    try {
      await AsyncStorage.setItem('@myfinance:categories', JSON.stringify(newCategories));
      setCustomCategories(newCategories);
    } catch (error) {
      console.log('Erro ao salvar categorias:', error);
    }
  };

  /**
   * Filtra dinamicamente as sugestões de categoria à medida que o utilizador digita.
   *
   * @param text - Texto inserido no campo de categoria.
   */
  const handleDescriptionChange = (text: string) => {
    setDescription(text);
    if (text.length > 0) {
      const allOptions = [...DEFAULT_SUGGESTIONS, ...customCategories];
      const filtered = allOptions.filter((item) =>
        item.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredSuggestions([...new Set(filtered)]);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  /**
   * Aplica a sugestão selecionada no campo de categoria e oculta o dropdown.
   *
   * @param suggestion - Categoria selecionada.
   */
  const selectSuggestion = (suggestion: string) => {
    setDescription(suggestion);
    setShowSuggestions(false);
  };

  /**
   * Regista um novo lançamento ou atualiza um item existente em edição.
   */
  const handleSaveTransaction = () => {
    if (value.trim() === '' || description.trim() === '') {
      Alert.alert('Atenção', 'Preencha o valor e a categoria.');
      return;
    }

    const numericValue = parseCurrencyInput(value);
    const now = new Date();

    let newList = [...list];

    if (editingId) {
      newList = newList.map((item) =>
        item.id === editingId
          ? {
              ...item,
              description: description.trim(),
              detail: detail.trim(),
              value: numericValue,
              type,
            }
          : item
      );
      setEditingId(null);
    } else {
      const newTransaction: Transaction = {
        id: String(now.getTime()),
        description: description.trim(),
        detail: detail.trim(),
        value: numericValue,
        type,
        date: now.toLocaleDateString('pt-BR'),
        time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      newList = [newTransaction, ...newList];
    }

    saveTransactions(newList);

    // Limpa o formulário
    setValue('');
    setDescription('');
    setDetail('');
    setShowSuggestions(false);
    Keyboard.dismiss();
  };

  /**
   * Prepara o formulário para editar uma transação já existente.
   *
   * @param item - Transação a ser editada.
   */
  const handleStartEdit = (item: Transaction) => {
    setEditingId(item.id);
    setDescription(item.description);
    setDetail(item.detail || '');
    setValue(String(item.value));
    setType(item.type);
  };

  /**
   * Remove permanentemente uma transação após confirmação do utilizador.
   *
   * @param id - Identificador único da transação.
   */
  const handleDeleteTransaction = (id: string) => {
    Alert.alert(
      'Excluir Lançamento',
      'Tem certeza de que deseja apagar este item permanentemente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: () => {
            const newList = list.filter((item) => item.id !== id);
            saveTransactions(newList);

            if (editingId === id) {
              setEditingId(null);
              setValue('');
              setDescription('');
              setDetail('');
            }
          },
        },
      ]
    );
  };

  /**
   * Cria uma nova categoria personalizada ou atualiza o nome de uma categoria existente.
   */
  const handleAddOrUpdateCategory = () => {
    const trimmed = newCategoryName.trim();
    if (trimmed === '') return Alert.alert('Erro', 'Digite o nome da categoria.');

    const updatedCategories = [...customCategories];

    if (editingCategoryIndex !== null) {
      updatedCategories[editingCategoryIndex] = trimmed;
      setEditingCategoryIndex(null);
      Alert.alert('Sucesso', 'Categoria atualizada!');
    } else {
      if (updatedCategories.includes(trimmed)) {
        return Alert.alert('Erro', 'Esta categoria já existe.');
      }
      updatedCategories.push(trimmed);
      Alert.alert('Sucesso', 'Categoria adicionada!');
    }

    saveCategories(updatedCategories);
    setNewCategoryName('');
  };

  /**
   * Inicia a edição de uma categoria no modal lateral.
   *
   * @param index - Índice da categoria na lista.
   */
  const handleEditCategory = (index: number) => {
    setNewCategoryName(customCategories[index]);
    setEditingCategoryIndex(index);
  };

  /**
   * Remove uma categoria personalizada após confirmação.
   *
   * @param index - Índice da categoria a ser excluída.
   */
  const handleDeleteCategory = (index: number) => {
    Alert.alert(
      'Excluir Categoria',
      `Deseja apagar a categoria "${customCategories[index]}"?`,
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim',
          style: 'destructive',
          onPress: () => {
            const updated = customCategories.filter((_, i) => i !== index);
            saveCategories(updated);

            if (editingCategoryIndex === index) {
              setEditingCategoryIndex(null);
              setNewCategoryName('');
            }
          },
        },
      ]
    );
  };

  /**
   * Limpa permanentemente todos os lançamentos e categorias do AsyncStorage e do estado.
   * Corrige a falha anterior em que os dados apenas sumiam da memória temporária.
   */
  const handleResetApp = () => {
    Alert.alert(
      'Resetar',
      'Apagar TUDO (Lançamentos e Categorias)?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim',
          style: 'destructive',
          onPress: async () => {
            await Promise.all([
              AsyncStorage.removeItem('@myfinance:transactions'),
              AsyncStorage.removeItem('@myfinance:categories'),
            ]);
            setList([]);
            setCustomCategories([]);
            setModalVisible(false);
          },
        },
      ]
    );
  };

  /**
   * Máscara de valor financeiro baseada no estado de privacidade do utilizador.
   */
  const renderValue = (val: number) => formatPrivateValue(val, isVisible);

  return {
    theme,
    isDark,
    isVisible,
    toggleVisibility,
    list,
    customCategories,
    balance,
    totalIncome,
    totalExpense,
    modalVisible,
    setModalVisible,
    editingId,
    value,
    setValue,
    description,
    detail,
    setDetail,
    type,
    setType,
    newCategoryName,
    setNewCategoryName,
    editingCategoryIndex,
    filteredSuggestions,
    showSuggestions,
    handleDescriptionChange,
    selectSuggestion,
    handleSaveTransaction,
    handleStartEdit,
    handleDeleteTransaction,
    handleAddOrUpdateCategory,
    handleEditCategory,
    handleDeleteCategory,
    handleResetApp,
    renderValue,
  };
}