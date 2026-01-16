/**
 * ============================================================================
 * IMPORTAÇÕES
 * ============================================================================
 */

// React Hooks: 
// - useState: Gerenciamento de estado local.
// - useCallback: Otimização de performance para funções.
import React, { useState, useCallback } from 'react';

// Componentes Nativos do React Native:
// - SafeAreaView: Protege o layout contra 'notches' e barras de status.
// - Modal: Utilizado aqui para criar o Menu Lateral (Drawer).
// - ScrollView: Permite rolagem da tela.
// - StatusBar: Manipula a barra superior do sistema (bateria, hora).
import { 
  View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, 
  Dimensions, StatusBar, Platform, Alert, Modal, Pressable 
} from 'react-native';

// Biblioteca de Ícones: Usada para os ícones de configurações, logout, olho, etc.
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

// Armazenamento Local: Persistência de dados (banco de dados simples do app).
import AsyncStorage from '@react-native-async-storage/async-storage';

// Navegação:
// - useFocusEffect: Dispara ações toda vez que a tela entra em foco.
// - useNavigation: Hook para transitar entre telas.
import { useFocusEffect, useNavigation } from '@react-navigation/native';

// Gráficos: Biblioteca externa para renderizar o gráfico de pizza (PieChart).
import { PieChart } from 'react-native-chart-kit';

// Contexto: Importação do Hook customizado para gerenciar o Tema (Dark/Light).
import { useTheme } from '../../context/ThemeContext'; 

/**
 * ============================================================================
 * CONSTANTES E TIPAGEM
 * ============================================================================
 */

// Captura a largura da tela para ajustes responsivos.
const screenWidth = Dimensions.get('window').width;

// Cores fixas utilizadas nas fatias do gráfico de gastos.
const CHART_COLORS = ['#3870d8', '#13ec6d', '#ef4444', '#f59e0b', '#8b5cf6'];

// Interface TypeScript para Transações (Receitas e Despesas).
interface Transaction { 
  id: string; 
  value: number; 
  type: 'income' | 'expense'; 
  date: string; 
  description: string; 
}

// Interface TypeScript para Contas Fixas (Contas recorrentes).
interface FixedBill { 
  id: string; 
  title: string; 
  value: number; 
  dueDay: number; 
}

/**
 * ============================================================================
 * COMPONENTE PRINCIPAL: HomeScreen
 * ============================================================================
 */
export default function HomeScreen() {
  // Hooks de Navegação e Tema
  const navigation = useNavigation<any>();
  const { isDark, toggleTheme } = useTheme(); 
  
  // -- ESTADOS DA APLICAÇÃO --
  
  // Saldos e Valores
  const [balance, setBalance] = useState(0);              // Saldo total calculado
  const [monthExpense, setMonthExpense] = useState(0);    // Total de gastos do mês atual
  const [fixedTotal, setFixedTotal] = useState(0);        // Total de contas fixas cadastradas
  
  // Dados Estruturados
  const [chartData, setChartData] = useState<any[]>([]);  // Array formatado para o componente de gráfico
  const [nextBills, setNextBills] = useState<FixedBill[]>([]); // Lista de contas pendentes
  
  // Controles de UI
  const [isVisible, setIsVisible] = useState(true);       // Controla se os valores estão visíveis ou ocultos (••••)
  const [menuVisible, setMenuVisible] = useState(false);  // Controla a visibilidade do Modal (Menu Lateral)

  // -- SISTEMA DE CORES DINÂMICO --
  // Define as cores baseadas no estado 'isDark' (Modo Escuro vs Claro)
  const theme = {
    background: isDark ? '#0f172a' : '#f8fafc',
    card: isDark ? '#1e293b' : '#ffffff',
    text: isDark ? '#f8fafc' : '#1e293b',
    subtext: isDark ? '#94a3b8' : '#64748b',
    border: isDark ? '#334155' : '#f1f5f9',
    header: isDark ? '#1e293b' : '#3870d8'
  };

  /**
   * Função de Logout
   * 1. Fecha o menu lateral.
   * 2. Exibe alerta de confirmação.
   * 3. Limpa o token de login do Storage.
   * 4. Redireciona para a tela de Login.
   */
  const handleLogout = () => {
    setMenuVisible(false);
    Alert.alert("Sair", "Deseja realmente sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Sair", 
        style: "destructive", 
        onPress: async () => {
          await AsyncStorage.removeItem('@myfinance:logged');
          navigation.replace('Login');
        } 
      }
    ]);
  };

  /**
   * Função Toggle Visibility
   * Alterna entre mostrar/esconder valores e salva a preferência no Storage.
   */
  const toggleVisibility = async () => {
    const newValue = !isVisible;
    setIsVisible(newValue);
    await AsyncStorage.setItem('@myfinance:visibility', JSON.stringify(newValue));
  };

  /**
   * Hook useFocusEffect
   * Executado toda vez que o usuário visualiza esta tela.
   * Responsável por carregar os dados atualizados do AsyncStorage.
   */
  useFocusEffect(
    useCallback(() => {
      const loadSync = async () => {
        // Carrega preferência de visibilidade
        const saved = await AsyncStorage.getItem('@myfinance:visibility');
        if (saved !== null) setIsVisible(JSON.parse(saved));
        
        // Inicia o carregamento dos dados financeiros
        loadDashboardData();
      };
      loadSync();
    }, [isVisible])
  );

  /**
   * Função loadDashboardData (Assíncrona)
   * Busca todas as transações, contas fixas e pagamentos no AsyncStorage.
   */
  async function loadDashboardData() {
    try {
      // Carrega Transações
      const transJson = await AsyncStorage.getItem('@myfinance:transactions');
      const transactions = transJson ? JSON.parse(transJson) : [];
      calculateBalanceAndChart(transactions);

      // Carrega Contas Fixas e Histórico de Pagamentos
      const billsJson = await AsyncStorage.getItem('@myfinance:fixed_bills');
      const paymentsJson = await AsyncStorage.getItem('@myfinance:bill_payments');
      const bills = billsJson ? JSON.parse(billsJson) : [];
      const paymentsMap = paymentsJson ? JSON.parse(paymentsJson) : {};
      calculateFixedBills(bills, paymentsMap);
    } catch (e) { console.log(e); }
  }

  /**
   * Função de Cálculo Financeiro e Gráfico
   * - Calcula saldo total (Receitas - Despesas).
   * - Filtra despesas apenas do Mês/Ano atual.
   * - Agrupa despesas por categoria para o gráfico.
   */
  function calculateBalanceAndChart(list: Transaction[]) {
    let totalBal = 0, currentMonthExpense = 0;
    const expensesMap: {[key: string]: number} = {};
    const now = new Date();

    list.forEach(item => {
      const val = Number(item.value);
      // Cálculo do Saldo Geral
      if (item.type === 'income') totalBal += val; else totalBal -= val;
      
      // Lógica de Data: Converte string "DD/MM/YYYY" para comparar mês e ano
      const [d, m, y] = item.date.split('/').map(Number);
      if (item.type === 'expense' && (m - 1) === now.getMonth() && y === now.getFullYear()) {
        currentMonthExpense += val;
        // Soma valores por descrição para o gráfico
        expensesMap[item.description] = (expensesMap[item.description] || 0) + val;
      }
    });

    setBalance(totalBal);
    setMonthExpense(currentMonthExpense);

    // Formatação dos dados para o PieChart (Top 4 despesas)
    const data = Object.keys(expensesMap).map((key, i) => ({
      name: key, 
      value: expensesMap[key], 
      color: CHART_COLORS[i % 5], 
      legendFontColor: isDark ? '#94a3b8' : '#64748b', 
      legendFontSize: 12
    })).sort((a,b) => b.value - a.value).slice(0, 4);
    
    setChartData(data);
  }

  /**
   * Função de Cálculo de Contas Fixas
   * - Filtra contas que ainda não foram pagas no mês atual.
   * - Ordena pela data de vencimento (dia mais próximo primeiro).
   */
  function calculateFixedBills(bills: FixedBill[], paymentsMap: any) {
    setFixedTotal(bills.reduce((acc, b) => acc + b.value, 0));
    const now = new Date();
    
    // Filtro: Apenas contas sem registro de pagamento na chave "ID_MÊS_ANO"
    const unpaid = bills.filter(b => !paymentsMap[`${b.id}_${now.getMonth()}_${now.getFullYear()}`]);
    const sortedUnpaid = unpaid.sort((a, b) => a.dueDay - b.dueDay);
    
    setNextBills(sortedUnpaid);
  }

  // Helper para renderizar valor monetário ou máscara de privacidade
  const renderValue = (val: number) => isVisible ? val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '••••••';

  /**
   * ============================================================================
   * RENDERIZAÇÃO (JSX)
   * ============================================================================
   */
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      
      {/* 1. COMPONENTE MODAL (Menu Lateral / Drawer Customizado) */}
      <Modal animationType="fade" transparent visible={menuVisible} onRequestClose={() => setMenuVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <Pressable style={[styles.drawerContainer, { backgroundColor: theme.card }]}>
            
            {/* Cabeçalho do Menu */}
            <View style={[styles.drawerHeader, { borderBottomColor: theme.border }]}>
              <Text style={[styles.drawerTitle, { color: theme.text }]}>Configurações</Text>
              <TouchableOpacity onPress={() => setMenuVisible(false)}>
                <Ionicons name="close" size={28} color={theme.text} />
              </TouchableOpacity>
            </View>

            {/* Itens do Menu */}
            <ScrollView style={styles.drawerContent}>
              <TouchableOpacity style={styles.drawerItem}>
                <Ionicons name="person-outline" size={22} color={theme.subtext} />
                <Text style={[styles.drawerItemText, { color: theme.text }]}>Perfil</Text>
              </TouchableOpacity>
              
              {/* Botão para Trocar Tema (Claro/Escuro) */}
              <TouchableOpacity style={styles.drawerItem} onPress={toggleTheme}>
                <Ionicons name={isDark ? "sunny-outline" : "moon-outline"} size={22} color={theme.subtext} />
                <Text style={[styles.drawerItemText, { color: theme.text }]}>
                  {isDark ? "Modo Claro" : "Modo Escuro"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.drawerItem}>
                <Ionicons name="shield-checkmark-outline" size={22} color={theme.subtext} />
                <Text style={[styles.drawerItemText, { color: theme.text }]}>Segurança</Text>
              </TouchableOpacity>
            </ScrollView>

            {/* Botão de Logout */}
            <TouchableOpacity style={[styles.logoutBtn, { borderTopColor: theme.border }]} onPress={handleLogout}>
              <MaterialIcons name="logout" size={22} color="#ef4444" />
              <Text style={styles.logoutBtnText}>Sair da Conta</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* 2. CONTEÚDO DA TELA PRINCIPAL (Scrollável) */}
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        {/* -- Header Principal (Azul/Escuro) -- */}
        <View style={[styles.header, { backgroundColor: theme.header }]}>
          <View style={styles.headerTop}>
             <Text style={styles.greeting}>Olá, Kleber</Text>
             <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                {/* Botão Olho (Privacidade) */}
                <TouchableOpacity onPress={toggleVisibility} style={styles.headerIconBtn}>
                  <Ionicons name={isVisible ? "eye" : "eye-off"} size={22} color="#ffffff" />
                </TouchableOpacity>

                {/* Botão Engrenagem (Abre Menu) */}
                <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.headerIconBtn}>
                  <Ionicons name="settings-outline" size={24} color="#ffffff" />
                </TouchableOpacity>
             </View>
          </View>
          <Text style={styles.labelBalance}>Saldo Disponível</Text>
          <Text style={styles.balanceValue}>{renderValue(balance)}</Text>
        </View>

        {/* -- Botões de Ação Rápida (Receita/Despesa) -- */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.card }]} onPress={() => navigation.navigate('Gastos')}>
            <View style={[styles.iconCircle, { backgroundColor: '#dcfce7' }]}><MaterialIcons name="add" size={24} color="#13ec6d" /></View>
            <Text style={[styles.actionText, { color: theme.text }]}>Receita</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.card }]} onPress={() => navigation.navigate('Gastos')}>
            <View style={[styles.iconCircle, { backgroundColor: '#fee2e2' }]}><MaterialIcons name="remove" size={24} color="#ef4444" /></View>
            <Text style={[styles.actionText, { color: theme.text }]}>Despesa</Text>
          </TouchableOpacity>
        </View>

        {/* -- Seção: Gráfico de Gastos -- */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Gastos do Mês</Text>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            {chartData.length > 0 ? (
              <View style={styles.chartRow}>
                {/* Componente Gráfico PieChart */}
                <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
                  <PieChart data={chartData} width={160} height={160} chartConfig={{ color: () => '#000' }} accessor={"value"} backgroundColor={"transparent"} paddingLeft={"40"} hasLegend={false} />
                  {/* Círculo central para efeito Donut */}
                  <View style={[styles.donutHole, { backgroundColor: theme.card }]}><Text style={styles.donutText}>Total</Text></View>
                </View>
                
                {/* Legenda Customizada */}
                <View style={styles.legendContainer}>
                  {chartData.map((item, i) => (
                    <View key={i} style={styles.legendItem}>
                      <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                      <Text style={[styles.legendText, { color: theme.subtext }]} numberOfLines={1}>{item.name}</Text>
                      <Text style={[styles.legendValue, { color: theme.text }]}>{isVisible ? `${Math.round((item.value / monthExpense) * 100)}%` : '••%'}</Text>
                    </View>
                  ))}
                  <View style={[styles.divider, { backgroundColor: theme.border }]} />
                  <Text style={[styles.totalExpenseValue, { color: theme.text }]}>{renderValue(monthExpense)}</Text>
                </View>
              </View>
            ) : <Text style={styles.emptyText}>Sem gastos registrados.</Text>}
          </View>
        </View>

        {/* -- Seção: Contas Fixas -- */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Contas Fixas do Mês</Text>
          <TouchableOpacity style={[styles.cardDark, isDark && { backgroundColor: theme.card }]} onPress={() => navigation.navigate('Fixas')}>
            <View style={styles.fixedHeader}>
              <View style={styles.iconBox}><MaterialIcons name="receipt-long" size={24} color="#ef4444" /></View>
              <View><Text style={styles.fixedLabel}>Total Previsto</Text><Text style={styles.fixedValue}>{renderValue(fixedTotal)}</Text></View>
            </View>
            <View style={[styles.fixedDivider, { backgroundColor: isDark ? theme.border : '#334155' }]} />
            <Text style={styles.nextBillLabel}>PENDÊNCIAS ATUAIS</Text>
            
            {/* Lista de Contas Pendentes */}
            {nextBills.length > 0 ? (
              nextBills.map(b => {
                const now = new Date();
                const isLate = b.dueDay < now.getDate(); // Verifica atraso
                return (
                  <View key={b.id} style={styles.billItemRow}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <Text style={styles.nextBillTitle}>{b.title}</Text>
                        {isLate && (
                          <View style={styles.lateBadge}>
                            <Text style={styles.lateBadgeText}>ATRASADA</Text>
                          </View>
                        )}
                      </View>
                      <Text style={[styles.nextBillDateText, isLate && { color: '#ef4444' }]}>Vence dia {b.dueDay}</Text>
                    </View>
                    <Text style={[styles.nextBillValue, isLate && { color: '#ef4444' }]}>{renderValue(b.value)}</Text>
                  </View>
                );
              })
            ) : <Text style={styles.emptyText}>Parabéns! Nenhuma conta pendente.</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * ============================================================================
 * ESTILIZAÇÃO (StyleSheet)
 * ============================================================================
 */
const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  header: { padding: 25, paddingBottom: 40, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  greeting: { color: '#ffffffaa', fontSize: 14 },
  headerIconBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255, 255, 255, 0.12)', justifyContent: 'center', alignItems: 'center' },
  labelBalance: { color: '#fff', fontSize: 16, fontWeight: '600' },
  balanceValue: { color: '#fff', fontSize: 36, fontWeight: 'bold', marginTop: 5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end', flexDirection: 'row' },
  drawerContainer: { width: '75%', height: '100%', padding: 20, shadowColor: '#000', shadowOffset: { width: -5, height: 0 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 10 },
  drawerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, borderBottomWidth: 1, paddingBottom: 15 },
  drawerTitle: { fontSize: 20, fontWeight: 'bold' },
  drawerContent: { flex: 1 },
  drawerItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, gap: 15 },
  drawerItemText: { fontSize: 16, fontWeight: '500' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 15, paddingVertical: 20, borderTopWidth: 1, marginBottom: Platform.OS === 'ios' ? 20 : 10 },
  logoutBtnText: { fontSize: 16, color: '#ef4444', fontWeight: 'bold' },
  actionsContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: -25 },
  actionBtn: { flex: 0.48, borderRadius: 20, padding: 15, alignItems: 'center', flexDirection: 'row', gap: 10, elevation: 4 },
  iconCircle: { width: 35, height: 35, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  actionText: { fontWeight: 'bold', fontSize: 13 },
  sectionContainer: { marginTop: 25, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  card: { borderRadius: 20, padding: 20, elevation: 2 },
  chartRow: { flexDirection: 'row', alignItems: 'center' },
  donutHole: { position: 'absolute', width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', left: 45 },
  donutText: { fontSize: 10, color: '#94a3b8', fontWeight: 'bold' },
  legendContainer: { flex: 1, marginLeft: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, justifyContent: 'space-between' },
  legendColor: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  legendText: { flex: 1, fontSize: 12 },
  legendValue: { fontWeight: 'bold', fontSize: 12 },
  divider: { height: 1, marginVertical: 8 },
  totalExpenseValue: { fontWeight: 'bold', fontSize: 16 },
  cardDark: { backgroundColor: '#1e293b', borderRadius: 20, padding: 20, marginBottom: 20 },
  fixedHeader: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  iconBox: { width: 45, height: 45, borderRadius: 12, backgroundColor: 'rgba(239, 68, 68, 0.15)', justifyContent: 'center', alignItems: 'center' },
  fixedLabel: { color: '#94a3b8', fontSize: 12 },
  fixedValue: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  fixedDivider: { height: 1, marginVertical: 15 },
  nextBillLabel: { color: '#ef4444', fontSize: 10, fontWeight: 'bold', marginBottom: 10 },
  billItemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  nextBillTitle: { color: '#fff', fontSize: 16, fontWeight: '600' },
  nextBillValue: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  nextBillDateText: { color: '#94a3b8', fontSize: 11 },
  lateBadge: { backgroundColor: '#ef4444', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  lateBadgeText: { color: '#fff', fontSize: 8, fontWeight: 'bold' },
  emptyText: { color: '#94a3b8', textAlign: 'center' }
});