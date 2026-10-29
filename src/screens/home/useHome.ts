/**
 * ============================================================================
 * HOOK CUSTOMIZADO: useHome
 * Centraliza as regras de negócio, persistência e cálculos do dashboard principal.
 * ============================================================================
 */

import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { useTheme } from '../../context/ThemeContext';
import { formatPrivateValue } from '../../utils/formatters';
import { Transaction, FixedBill, ChartItem, CHART_COLORS } from './types';

export function useHome() {
  const navigation = useNavigation<any>();
  const { theme, isDark, toggleTheme, isVisible, toggleVisibility } = useTheme();

  // Estados dos montantes financeiros
  const [balance, setBalance] = useState<number>(0);
  const [monthExpense, setMonthExpense] = useState<number>(0);
  const [fixedTotal, setFixedTotal] = useState<number>(0);

  // Estados dos dados tratados para renderização
  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [nextBills, setNextBills] = useState<FixedBill[]>([]);

  // Estado do menu lateral (Drawer/Modal)
  const [menuVisible, setMenuVisible] = useState<boolean>(false);

  /**
   * Processa todas as transações cadastradas para apurar:
   * 1. Saldo geral líquido (Receitas - Despesas).
   * 2. Despesas específicas do mês corrente.
   * 3. As 4 maiores categorias de despesa do mês para montagem do gráfico Donut.
   *
   * @param list - Coleção completa de transações recuperada do AsyncStorage.
   */
  const calculateBalanceAndChart = (list: Transaction[]) => {
    let totalBal = 0;
    let currentMonthExpense = 0;
    const expensesMap: { [key: string]: number } = {};
    const now = new Date();

    list.forEach((item) => {
      const val = Number(item.value);

      // Soma entradas e subtrai saídas para obter o saldo geral líquido
      if (item.type === 'income') {
        totalBal += val;
      } else {
        totalBal -= val;
      }

      // Valida se o lançamento pertence ao mês e ano vigentes
      const [d, m, y] = item.date.split('/').map(Number);
      if (item.type === 'expense' && m - 1 === now.getMonth() && y === now.getFullYear()) {
        currentMonthExpense += val;
        expensesMap[item.description] = (expensesMap[item.description] || 0) + val;
      }
    });

    setBalance(totalBal);
    setMonthExpense(currentMonthExpense);

    // Formata e ordena os 4 maiores gastos para exibição no gráfico
    const data: ChartItem[] = Object.keys(expensesMap)
      .map((key, i) => ({
        name: key,
        value: expensesMap[key],
        color: CHART_COLORS[i % CHART_COLORS.length],
        legendFontColor: isDark ? '#94a3b8' : '#64748b',
        legendFontSize: 12,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 4);

    setChartData(data);
  };

  /**
   * Avalia as contas fixas cadastradas cruzando com o histórico de liquidações:
   * 1. Soma o valor total mensal previsto de contas fixas.
   * 2. Filtra apenas as contas que ainda não foram marcadas como pagas no mês atual.
   * 3. Ordena as contas em aberto pelo dia do vencimento mais próximo.
   *
   * @param bills - Lista com todas as contas fixas cadastradas.
   * @param paymentsMap - Dicionário de pagamentos do mês ("ID_MES_ANO": true).
   */
  
  const calculateFixedBills = (bills: FixedBill[], paymentsMap: Record<string, boolean>) => {
    const total = bills.reduce((acc, b) => acc + Number(b.value), 0);
    setFixedTotal(total);

    const now = new Date();
    const currentMonthKey = `${now.getMonth()}_${now.getFullYear()}`;

    // Mantém somente contas sem registo de liquidação no mês corrente
    const unpaid = bills.filter((b) => !paymentsMap[`${b.id}_${currentMonthKey}`]);
    const sortedUnpaid = unpaid.sort((a, b) => a.dueDay - b.dueDay);

    setNextBills(sortedUnpaid);
  };

  /**
   * Executa a leitura assíncrona dos dados consolidados no AsyncStorage.
   */
  const loadDashboardData = async () => {
    try {
      const [transJson, billsJson, paymentsJson] = await Promise.all([
        AsyncStorage.getItem('@myfinance:transactions'),
        AsyncStorage.getItem('@myfinance:fixed_bills'),
        AsyncStorage.getItem('@myfinance:bill_payments'),
      ]);

      const transactions: Transaction[] = transJson ? JSON.parse(transJson) : [];
      const bills: FixedBill[] = billsJson ? JSON.parse(billsJson) : [];
      const paymentsMap = paymentsJson ? JSON.parse(paymentsJson) : {};

      calculateBalanceAndChart(transactions);
      calculateFixedBills(bills, paymentsMap);
    } catch (error) {
      console.log('Erro ao carregar dados do dashboard:', error);
    }
  };

  /**
   * Dispara o recarregamento dos dados financeiros sempre que o utilizador visualiza a tela.
   */
  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [isVisible])
  );

  /**
   * Realiza o encerramento da sessão:
   * Remove a chave de autenticação do AsyncStorage e redireciona para a tela de Login.
   */
  const handleLogout = () => {
    setMenuVisible(false);
    Alert.alert('Sair', 'Deseja realmente sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('@myfinance:logged');
          navigation.replace('Login');
        },
      },
    ]);
  };

  /**
   * Máscara formatadora monetária conectada ao contexto de privacidade do app.
   */
  const renderValue = (val: number) => formatPrivateValue(val, isVisible);

  return {
    navigation,
    theme,
    isDark,
    toggleTheme,
    isVisible,
    toggleVisibility,
    balance,
    monthExpense,
    fixedTotal,
    chartData,
    nextBills,
    menuVisible,
    setMenuVisible,
    handleLogout,
    renderValue,
  };
}