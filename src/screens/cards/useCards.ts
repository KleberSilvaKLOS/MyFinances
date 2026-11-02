/**
 * ============================================================================
 * HOOK CUSTOMIZADO: useCards
 * Centraliza as regras de cartões de crédito, parcelamentos e projeção de faturas.
 * ============================================================================
 */

import { useState, useCallback, useMemo } from 'react';
import { Alert, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { useTheme } from '../../context/ThemeContext';
import { parseCurrencyInput, formatPrivateValue } from '../../utils/formatters';
import {
  CreditCard,
  CardPurchase,
  InvoiceDetails,
  MonthlyInstallmentItem,
  CARD_COLORS,
} from './types';

export function useCards() {
  const { theme, isDark, isVisible, toggleVisibility } = useTheme();

  // Estados dos cartões e compras
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [purchases, setPurchases] = useState<CardPurchase[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // Mês de navegação da fatura
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // Formulário de compra parcelada
  const [desc, setDesc] = useState<string>('');
  const [val, setVal] = useState<string>('');
  const [installments, setInstallments] = useState<string>('1');

  // Formulário / Configuração do cartão
  const [cardName, setCardName] = useState<string>('');
  const [cardLimit, setCardLimit] = useState<string>('');
  const [closingDay, setClosingDay] = useState<string>('');
  const [dueDay, setDueDay] = useState<string>('');
  const [showCardModal, setShowCardModal] = useState<boolean>(false);

  /**
   * Carrega os cartões e as compras salvas no AsyncStorage.
   */
  const loadData = async () => {
    try {
      const [storedCards, storedPurchases] = await Promise.all([
        AsyncStorage.getItem('@myfinance:credit_cards'),
        AsyncStorage.getItem('@myfinance:card_purchases'),
      ]);

      const parsedCards: CreditCard[] = storedCards ? JSON.parse(storedCards) : [];
      const parsedPurchases: CardPurchase[] = storedPurchases ? JSON.parse(storedPurchases) : [];

      setCards(parsedCards);
      setPurchases(parsedPurchases);

      if (parsedCards.length > 0 && !selectedCardId) {
        setSelectedCardId(parsedCards[0].id);
      }
    } catch (error) {
      console.log('Erro ao carregar cartões e parcelamentos:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const activeCard = useMemo(() => {
    return cards.find((c) => c.id === selectedCardId) || cards[0] || null;
  }, [cards, selectedCardId]);

  /**
   * Salva a lista de cartões no AsyncStorage.
   */
  const saveCards = async (newCards: CreditCard[]) => {
    try {
      await AsyncStorage.setItem('@myfinance:credit_cards', JSON.stringify(newCards));
      setCards(newCards);
    } catch (error) {
      console.log('Erro ao salvar cartões:', error);
    }
  };

  /**
   * Salva as compras parceladas no AsyncStorage.
   */
  const savePurchases = async (newPurchases: CardPurchase[]) => {
    try {
      await AsyncStorage.setItem('@myfinance:card_purchases', JSON.stringify(newPurchases));
      setPurchases(newPurchases);
    } catch (error) {
      console.log('Erro ao salvar compras:', error);
    }
  };

  /**
   * Cadastra um novo cartão de crédito.
   */
  const handleSaveCard = () => {
    const nameTrimmed = cardName.trim();
    const limitNum = parseCurrencyInput(cardLimit);
    const closeNum = parseInt(closingDay, 10);
    const dueNum = parseInt(dueDay, 10);

    if (!nameTrimmed || limitNum <= 0 || isNaN(closeNum) || isNaN(dueNum)) {
      Alert.alert('Atenção', 'Preencha o nome, limite, fechamento e vencimento.');
      return;
    }

    const newCard: CreditCard = {
      id: String(Date.now()),
      name: nameTrimmed,
      limit: limitNum,
      closingDay: closeNum,
      dueDay: dueNum,
      color: CARD_COLORS[cards.length % CARD_COLORS.length],
    };

    const updated = [...cards, newCard];
    saveCards(updated);
    setSelectedCardId(newCard.id);

    setCardName('');
    setCardLimit('');
    setClosingDay('');
    setDueDay('');
    setShowCardModal(false);
  };

  /**
   * Cadastra uma nova compra (à vista ou parcelada).
   */
  const handleAddPurchase = () => {
    if (!activeCard) {
      Alert.alert('Atenção', 'Cadastre um cartão primeiro.');
      return;
    }

    const descTrimmed = desc.trim();
    const totalVal = parseCurrencyInput(val);
    const totalInst = parseInt(installments, 10);

    if (!descTrimmed || totalVal <= 0 || isNaN(totalInst) || totalInst <= 0) {
      Alert.alert('Atenção', 'Informe a descrição, o valor total e o número de parcelas.');
      return;
    }

    const now = new Date();
    const installmentValue = Number((totalVal / totalInst).toFixed(2));

    const newPurchase: CardPurchase = {
      id: String(Date.now()),
      cardId: activeCard.id,
      description: descTrimmed,
      totalValue: totalVal,
      installmentCount: totalInst,
      installmentValue,
      purchaseDate: now.toLocaleDateString('pt-BR'),
    };

    const updated = [newPurchase, ...purchases];
    savePurchases(updated);

    setDesc('');
    setVal('');
    setInstallments('1');
    Keyboard.dismiss();
  };

  /**
   * Exclui uma compra e todas as parcelas restantes.
   */
  const handleDeletePurchase = (id: string) => {
    Alert.alert('Excluir Compra', 'Deseja remover esta compra e suas parcelas?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          const filtered = purchases.filter((p) => p.id !== id);
          savePurchases(filtered);
        },
      },
    ]);
  };

  /**
   * Navega entre os meses da fatura.
   */
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
   * Calcula as parcelas ativas para o mês da fatura atual.
   * Lógica de competência: Se a compra ocorreu no dia >= dia de fechamento, a 1ª parcela cai no mês seguinte.
   */
  const currentInvoice: InvoiceDetails = useMemo(() => {
    if (!activeCard) {
      return { month: currentDate.getMonth(), year: currentDate.getFullYear(), total: 0, items: [] };
    }

    const targetMonth = currentDate.getMonth();
    const targetYear = currentDate.getFullYear();
    const items: MonthlyInstallmentItem[] = [];
    let total = 0;

    const cardPurchases = purchases.filter((p) => p.cardId === activeCard.id);

    cardPurchases.forEach((p) => {
      const [d, m, y] = p.purchaseDate.split('/').map(Number);
      const purchaseMonth = m - 1;
      const purchaseYear = y;

      // Define o primeiro mês de cobrança
      let firstInvoiceMonth = purchaseMonth;
      let firstInvoiceYear = purchaseYear;

      if (d >= activeCard.closingDay) {
        firstInvoiceMonth += 1;
        if (firstInvoiceMonth > 11) {
          firstInvoiceMonth = 0;
          firstInvoiceYear += 1;
        }
      }

      // Calcula a diferença em meses entre o mês da fatura em tela e o mês inicial
      const monthDiff = (targetYear - firstInvoiceYear) * 12 + (targetMonth - firstInvoiceMonth);

      if (monthDiff >= 0 && monthDiff < p.installmentCount) {
        const currentInstallment = monthDiff + 1;
        items.push({
          purchaseId: p.id,
          description: p.description,
          currentInstallment,
          totalInstallments: p.installmentCount,
          value: p.installmentValue,
        });
        total += p.installmentValue;
      }
    });

    return {
      month: targetMonth,
      year: targetYear,
      total,
      items,
    };
  }, [activeCard, purchases, currentDate]);

  /**
   * Calcula o limite total comprometido (soma de todas as parcelas futuras não liquidadas).
   */
  const committedLimit = useMemo(() => {
    if (!activeCard) return 0;
    const now = new Date();
    const curMonth = now.getMonth();
    const curYear = now.getFullYear();

    const cardPurchases = purchases.filter((p) => p.cardId === activeCard.id);

    let remainingTotal = 0;

    cardPurchases.forEach((p) => {
      const [d, m, y] = p.purchaseDate.split('/').map(Number);
      let firstM = m - 1;
      let firstY = y;

      if (d >= activeCard.closingDay) {
        firstM += 1;
        if (firstM > 11) {
          firstM = 0;
          firstY += 1;
        }
      }

      const elapsed = (curYear - firstY) * 12 + (curMonth - firstM);
      const remainingInstallments = p.installmentCount - Math.max(0, elapsed);

      if (remainingInstallments > 0) {
        remainingTotal += remainingInstallments * p.installmentValue;
      }
    });

    return Math.min(activeCard.limit, remainingTotal);
  }, [activeCard, purchases]);

  const availableLimit = useMemo(() => {
    if (!activeCard) return 0;
    return Math.max(0, activeCard.limit - committedLimit);
  }, [activeCard, committedLimit]);

  const limitUsagePercentage = useMemo(() => {
    if (!activeCard || activeCard.limit === 0) return 0;
    return Math.min(100, Math.round((committedLimit / activeCard.limit) * 100));
  }, [activeCard, committedLimit]);

  const renderValue = (v: number) => formatPrivateValue(v, isVisible);

  return {
    theme,
    isDark,
    isVisible,
    toggleVisibility,
    cards,
    activeCard,
    setSelectedCardId,
    currentInvoice,
    formattedMonth,
    committedLimit,
    availableLimit,
    limitUsagePercentage,
    desc,
    setDesc,
    val,
    setVal,
    installments,
    setInstallments,
    cardName,
    setCardName,
    cardLimit,
    setCardLimit,
    closingDay,
    setClosingDay,
    dueDay,
    setDueDay,
    showCardModal,
    setShowCardModal,
    handleSaveCard,
    handleAddPurchase,
    handleDeletePurchase,
    handlePrevMonth,
    handleNextMonth,
    renderValue,
  };
}