/**
 * ============================================================================
 * TELA DE RESUMO E RELATÓRIOS
 * Gráficos nativos em barra de distribuição por categoria e saldo mensal.
 * ============================================================================
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';

import { useSummary } from './useSummary';
import { styles } from './styles';

export default function SummaryScreen() {
  const {
    theme,
    isDark,
    isVisible,
    toggleVisibility,
    formattedMonth,
    handlePrevMonth,
    handleNextMonth,
    monthData,
    renderValue,
  } = useSummary();

  const isPositiveBalance = monthData.balance >= 0;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={['top']}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.header}
      />

      {/* --- CABEÇALHO --- */}
      <View style={[styles.header, { backgroundColor: theme.header }]}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Resumo Financeiro</Text>
          <TouchableOpacity onPress={toggleVisibility} style={styles.headerIconBtn}>
            <Ionicons
              name={isVisible ? 'eye' : 'eye-off'}
              size={20}
              color="#ffffff"
            />
          </TouchableOpacity>
        </View>

        {/* Seletor Mensal */}
        <View style={styles.monthSelector}>
          <TouchableOpacity onPress={handlePrevMonth} style={styles.monthNavBtn}>
            <MaterialIcons name="chevron-left" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.monthText}>{formattedMonth}</Text>
          <TouchableOpacity onPress={handleNextMonth} style={styles.monthNavBtn}>
            <MaterialIcons name="chevron-right" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* --- CARDS DE ENTRADAS VS SAÍDAS --- */}
        <View style={styles.cardsGrid}>
          <View style={[styles.metricCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.metricLabel, { color: theme.subtext }]}>Entradas</Text>
            <Text style={[styles.metricValue, { color: '#13ec6d' }]}>
              {renderValue(monthData.income)}
            </Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.metricLabel, { color: theme.subtext }]}>Despesas Totais</Text>
            <Text style={[styles.metricValue, { color: '#ef4444' }]}>
              {renderValue(monthData.totalExpense)}
            </Text>
          </View>
        </View>

        {/* --- CARD DE EFICIÊNCIA / POUPANÇA --- */}
        <View style={[styles.healthCard, { backgroundColor: theme.card }]}>
          <View style={styles.healthTop}>
            <Text style={[styles.healthTitle, { color: theme.text }]}>
              Taxa de Poupança
            </Text>
            <View
              style={[
                styles.healthBadge,
                {
                  backgroundColor: isPositiveBalance
                    ? 'rgba(19, 236, 109, 0.15)'
                    : 'rgba(239, 68, 68, 0.15)',
                },
              ]}
            >
              <Text
                style={[
                  styles.healthBadgeText,
                  { color: isPositiveBalance ? '#13ec6d' : '#ef4444' },
                ]}
              >
                {monthData.savingsRate}% economizado
              </Text>
            </View>
          </View>

          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${monthData.savingsRate}%`,
                  backgroundColor: isPositiveBalance ? '#13ec6d' : '#ef4444',
                },
              ]}
            />
          </View>

          <Text style={[styles.healthSubtitle, { color: theme.subtext }]}>
            Saldo líquido do mês:{' '}
            <Text
              style={{
                fontWeight: 'bold',
                color: isPositiveBalance ? '#13ec6d' : '#ef4444',
              }}
            >
              {renderValue(monthData.balance)}
            </Text>
          </Text>
        </View>

        {/* --- DISTRIBUIÇÃO POR CATEGORIA --- */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Despesas por Categoria
          </Text>

          {monthData.categories.length === 0 ? (
            <View style={[styles.emptyContainer, { backgroundColor: theme.card }]}>
              <Feather name="pie-chart" size={32} color={theme.subtext} />
              <Text style={[styles.emptyText, { color: theme.subtext }]}>
                Sem despesas registradas para este mês.
              </Text>
            </View>
          ) : (
            monthData.categories.map((item) => (
              <View
                key={item.category}
                style={[styles.categoryCard, { backgroundColor: theme.card }]}
              >
                <View style={styles.categoryTopRow}>
                  <View style={styles.categoryNameRow}>
                    <View style={[styles.categoryDot, { backgroundColor: item.color }]} />
                    <Text style={[styles.categoryTitle, { color: theme.text }]}>
                      {item.category}
                    </Text>
                  </View>
                  <Text style={[styles.categoryValue, { color: theme.text }]}>
                    {renderValue(item.total)}
                  </Text>
                </View>

                {/* Barra Proporcional */}
                <View style={styles.categoryBarBg}>
                  <View
                    style={[
                      styles.categoryBarFill,
                      { width: `${item.percentage}%`, backgroundColor: item.color },
                    ]}
                  />
                </View>

                <Text style={[styles.categoryPercentText, { color: theme.subtext }]}>
                  {item.percentage}% do total gasto
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}