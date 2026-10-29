/**
 * ============================================================================
 * TELA HOME (Dashboard Principal)
 * Componente estritamente visual: consome os dados e handlers do hook useHome.
 * ============================================================================
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';

import { useHome } from './useHome';
import { styles } from './styles';

export default function HomeScreen() {
  const {
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
  } = useHome();

  const todayDate = new Date().getDate();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={['top']}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.header}
      />

      {/* --- MENU LATERAL (MODAL / DRAWER) --- */}
      <Modal
        animationType="fade"
        transparent
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <Pressable style={[styles.drawerContainer, { backgroundColor: theme.card }]}>
            <View style={[styles.drawerHeader, { borderBottomColor: theme.border }]}>
              <Text style={[styles.drawerTitle, { color: theme.text }]}>Configurações</Text>
              <TouchableOpacity onPress={() => setMenuVisible(false)}>
                <Ionicons name="close" size={28} color={theme.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.drawerContent}>
              <TouchableOpacity style={styles.drawerItem}>
                <Ionicons name="person-outline" size={22} color={theme.subtext} />
                <Text style={[styles.drawerItemText, { color: theme.text }]}>Perfil</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.drawerItem} onPress={toggleTheme}>
                <Ionicons
                  name={isDark ? 'sunny-outline' : 'moon-outline'}
                  size={22}
                  color={theme.subtext}
                />
                <Text style={[styles.drawerItemText, { color: theme.text }]}>
                  {isDark ? 'Modo Claro' : 'Modo Escuro'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.drawerItem}>
                <Ionicons name="shield-checkmark-outline" size={22} color={theme.subtext} />
                <Text style={[styles.drawerItemText, { color: theme.text }]}>Segurança</Text>
              </TouchableOpacity>
            </ScrollView>

            <TouchableOpacity
              style={[styles.logoutBtn, { borderTopColor: theme.border }]}
              onPress={handleLogout}
            >
              <MaterialIcons name="logout" size={22} color="#ef4444" />
              <Text style={styles.logoutBtnText}>Sair da Conta</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho */}
        <View style={[styles.header, { backgroundColor: theme.header }]}>
          <View style={styles.headerTop}>
            <Text style={styles.greeting}>Olá, Kleber</Text>

            <View style={styles.headerActions}>
              <TouchableOpacity onPress={toggleVisibility} style={styles.headerIconBtn}>
                <Ionicons
                  name={isVisible ? 'eye' : 'eye-off'}
                  size={22}
                  color="#ffffff"
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setMenuVisible(true)}
                style={styles.headerIconBtn}
              >
                <Ionicons name="settings" size={22} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.labelBalance}>Saldo Disponível</Text>
          <Text style={styles.balanceValue}>{renderValue(balance)}</Text>
        </View>

        {/* Botões de Ação Rápida */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: theme.card }]}
            onPress={() => navigation.navigate('Gastos')}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#dcfce7' }]}>
              <MaterialIcons name="add" size={24} color="#13ec6d" />
            </View>
            <Text style={[styles.actionText, { color: theme.text }]}>Receita</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: theme.card }]}
            onPress={() => navigation.navigate('Gastos')}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#fee2e2' }]}>
              <MaterialIcons name="remove" size={24} color="#ef4444" />
            </View>
            <Text style={[styles.actionText, { color: theme.text }]}>Despesa</Text>
          </TouchableOpacity>
        </View>

        {/* Seção: Gráfico de Gastos */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Gastos do Mês</Text>

          <View style={[styles.card, { backgroundColor: theme.card }]}>
            {chartData.length > 0 ? (
              <View style={styles.chartRow}>
                <View style={styles.chartWrapper}>
                  <PieChart
                    data={chartData}
                    width={160}
                    height={160}
                    chartConfig={{ color: () => '#000' }}
                    accessor="value"
                    backgroundColor="transparent"
                    paddingLeft="40"
                    hasLegend={false}
                  />
                  <View style={[styles.donutHole, { backgroundColor: theme.card }]}>
                    <Text style={styles.donutText}>Total</Text>
                  </View>
                </View>

                <View style={styles.legendContainer}>
                  {chartData.map((item, index) => (
                    <View key={index} style={styles.legendItem}>
                      <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                      <Text
                        style={[styles.legendText, { color: theme.subtext }]}
                        numberOfLines={1}
                      >
                        {item.name}
                      </Text>
                      <Text style={[styles.legendValue, { color: theme.text }]}>
                        {isVisible
                          ? `${Math.round((item.value / monthExpense) * 100)}%`
                          : '••%'}
                      </Text>
                    </View>
                  ))}

                  <View style={[styles.divider, { backgroundColor: theme.border }]} />
                  <Text style={[styles.totalExpenseValue, { color: theme.text }]}>
                    {renderValue(monthExpense)}
                  </Text>
                </View>
              </View>
            ) : (
              <Text style={styles.emptyText}>Sem gastos registrados.</Text>
            )}
          </View>
        </View>

        {/* Seção: Contas Fixas */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Contas Fixas do Mês
          </Text>

          <TouchableOpacity
            style={[styles.cardDark, isDark && { backgroundColor: theme.card }]}
            onPress={() => navigation.navigate('Fixas')}
          >
            <View style={styles.fixedHeader}>
              <View style={styles.iconBox}>
                <MaterialIcons name="receipt-long" size={24} color="#ef4444" />
              </View>
              <View>
                <Text style={styles.fixedLabel}>Total Previsto</Text>
                <Text style={styles.fixedValue}>{renderValue(fixedTotal)}</Text>
              </View>
            </View>

            <View
              style={[
                styles.fixedDivider,
                { backgroundColor: isDark ? theme.border : '#334155' },
              ]}
            />

            <Text style={styles.nextBillLabel}>PENDÊNCIAS ATUAIS</Text>

            {nextBills.length > 0 ? (
              nextBills.map((bill) => {
                const isLate = bill.dueDay < todayDate;

                return (
                  <View key={bill.id} style={styles.billItemRow}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <Text style={styles.nextBillTitle}>{bill.title}</Text>
                        {isLate && (
                          <View style={styles.lateBadge}>
                            <Text style={styles.lateBadgeText}>ATRASADA</Text>
                          </View>
                        )}
                      </View>
                      <Text
                        style={[
                          styles.nextBillDateText,
                          isLate && { color: '#ef4444' },
                        ]}
                      >
                        Vence dia {bill.dueDay}
                      </Text>
                    </View>

                    <Text
                      style={[
                        styles.nextBillValue,
                        isLate && { color: '#ef4444' },
                      ]}
                    >
                      {renderValue(bill.value)}
                    </Text>
                  </View>
                );
              })
            ) : (
              <Text style={styles.emptyText}>Parabéns! Nenhuma conta pendente.</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}