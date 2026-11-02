/**
 * ============================================================================
 * HOOK CUSTOMIZADO: useCards (Atualizado)
 * Suporte a múltiplos cartões com seletor ativo e projeção de faturas.
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

  const [cards, setCards] = useState<CreditCard[]>([]);
  const [purchases, setPurchases] = useState<CardPurchase[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // Formulário de compra
  const [desc, setDesc] = useState<string>('');
  const [val, setVal] = useState<string>('');
  const [installments, setInstallments] = useState<string>('1');

  // Modal de novo cartão
  const [cardName, setCardName] = useState<string>('');
  const [cardLimit, setCardLimit] = useState<string>('');
  const [closingDay, setClosingDay] = useState<string>('');
  const [dueDay, setDueDay] = useState<string>('');
  const [showCardModal, setShowCardModal] = useState<boolean>(false);

  const loadData = async () => {
    try {
      const [storedCards, storedPurchases, lastSelectedId] = await Promise.all([
        AsyncStorage.getItem('@myfinance:credit_cards'),
        AsyncStorage.getItem('@myfinance:card_purchases'),
        AsyncStorage.getItem('@myfinance:last_card_id'),
      ]);

      const parsedCards: CreditCard[] = storedCards ? JSON.parse(storedCards) : [];
      const parsedPurchases: CardPurchase[] = storedPurchases ? JSON.parse(storedPurchases) : [];

      setCards(parsedCards);
      setPurchases(parsedPurchases);

      if (parsedCards.length > 0) {
        if (lastSelectedId && parsedCards.some((c) => c.id === lastSelectedId)) {
          setSelectedCardId(lastSelectedId);
        } else {
          setSelectedCardId(parsedCards[0].id);
        }
      }
    } catch (error) {
      console.log('Erro ao carregar dados dos cartões:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleSelectCard = async (id: string) => {
    setSelectedCardId(id);
    await AsyncStorage.setItem('@myfinance:last_card_id', id);
  };

  const activeCard = useMemo(() => {
    return cards.find((c) => c.id === selectedCardId) || cards[0] || null;
  }, [cards, selectedCardId]);

  const saveCards = async (newCards: CreditCard[]) => {
    try {
      await AsyncStorage.setItem('@myfinance:credit_cards', JSON.stringify(newCards));
      setCards(newCards);
    } catch (error) {
      console.log('Erro ao salvar cartões:', error);
    }
  };

  const savePurchases = async (newPurchases: CardPurchase[]) => {
    try {
      await AsyncStorage.setItem('@myfinance:card_purchases', JSON.stringify(newPurchases));
      setPurchases(newPurchases);
    } catch (error) {
      console.log('Erro ao salvar compras:', error);
    }
  };

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
    handleSelectCard(newCard.id);

    setCardName('');
    setCardLimit('');
    setClosingDay('');
    setDueDay('');
    setShowCardModal(false);
  };

  const handleAddPurchase = () => {
    if (!activeCard) {
      Alert.alert('Atenção', 'Selecione ou cadastre um cartão primeiro.');
      return;
    }

    const descTrimmed = desc.trim();
    const totalVal = parseCurrencyInput(val);
    const totalInst = parseInt(installments, 10) || 1;

    if (!descTrimmed || totalVal <= 0) {
      Alert.alert('Atenção', 'Informe uma descrição e um valor válido.');
      return;
    }

    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    const installmentValue = Number((totalVal / totalInst).toFixed(2));

    const newPurchase: CardPurchase = {
      id: String(Date.now()),
      cardId: activeCard.id,
      description: descTrimmed,
      totalValue: totalVal,
      installmentCount: totalInst,
      installmentValue,
      purchaseDate: `${day}/${month}/${year}`,
    };

    const updated = [newPurchase, ...purchases];
    savePurchases(updated);

    setDesc('');
    setVal('');
    setInstallments('1');
    Keyboard.dismiss();
  };

  const handleDeletePurchase = (id: string) => {
    Alert.alert('Excluir Compra', 'Deseja remover esta compra e todas as parcelas?', [
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
   * Cálculo de competência por fatura
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
      const parts = p.purchaseDate.split('/').map(Number);
      const day = parts[0];
      const purchaseMonth = parts[1] - 1;
      const purchaseYear = parts[2];

      let firstInvoiceMonth = purchaseMonth;
      let firstInvoiceYear = purchaseYear;

      // Se a compra foi feita no dia ou após o fechamento, cai no mês seguinte
      if (day >= activeCard.closingDay) {
        firstInvoiceMonth += 1;
        if (firstInvoiceMonth > 11) {
          firstInvoiceMonth = 0;
          firstInvoiceYear += 1;
        }
      }

      const monthDiff = (targetYear - firstInvoiceYear) * 12 + (targetMonth - firstInvoiceMonth);

      if (monthDiff >= 0 && monthDiff < p.installmentCount) {
        items.push({
          purchaseId: p.id,
          description: p.description,
          currentInstallment: monthDiff + 1,
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

  const committedLimit = useMemo(() => {
    if (!activeCard) return 0;
    const now = new Date();
    const curMonth = now.getMonth();
    const curYear = now.getFullYear();

    const cardPurchases = purchases.filter((p) => p.cardId === activeCard.id);
    let remainingTotal = 0;

    cardPurchases.forEach((p) => {
      const parts = p.purchaseDate.split('/').map(Number);
      let firstM = parts[1] - 1;
      let firstY = parts[2];

      if (parts[0] >= activeCard.closingDay) {
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
    handleSelectCard,
    currentInvoice,
    formattedMonth,
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