/**
 * ============================================================================
 * TELA DE RESUMO
 * Camada de apresentação visual conectada ao hook useSummary.
 * ============================================================================
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';

import { useSummary } from './useSummary';
import { styles } from './styles';

const screenWidth = Dimensions.get('window').width;

export default function SummaryScreen() {
  const {
    theme,
    isDark,
    isVisible,
    toggleVisibility,
    formattedMonth,
    balance,
    categorySummaries,
    chartData,
    handlePrevMonth,
    handleNextMonth,
    renderValue,
  } = useSummary();

  const isNetPositive = balance.netBalance >= 0;

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
              size={22}
              color="#ffffff"
            />
          </TouchableOpacity>
        </View>

        {/* Seletor de Mês */}
        <View style={styles.monthSelector}>
          <TouchableOpacity onPress={handlePrevMonth} style={styles.monthNavBtn}>
            <MaterialIcons name="chevron-left" size={26} color="#ffffff" />
          </TouchableOpacity>

          <Text style={styles.monthTitle}>{formattedMonth}</Text>

          <TouchableOpacity onPress={handleNextMonth} style={styles.monthNavBtn}>
            <MaterialIcons name="chevron-right" size={26} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* --- CARDS DE BALANÇO DO PERÍODO --- */}
      <View style={styles.cardsContainer}>
        {/* Entradas */}
        <View style={[styles.balanceCard, { backgroundColor: theme.card }]}>
          <MaterialIcons name="arrow-upward" size={18} color="#13ec6d" />
          <Text style={[styles.cardLabel, { color: theme.subtext }]}>Entradas</Text>
          <Text style={[styles.cardValue, { color: '#13ec6d' }]}>
            {renderValue(balance.totalIncome)}
          </Text>
        </View>

        {/* Saídas */}
        <View style={[styles.balanceCard, { backgroundColor: theme.card }]}>
          <MaterialIcons name="arrow-downward" size={18} color="#ef4444" />
          <Text style={[styles.cardLabel, { color: theme.subtext }]}>Saídas</Text>
          <Text style={[styles.cardValue, { color: '#ef4444' }]}>
            {renderValue(balance.totalExpense)}
          </Text>
        </View>

        {/* Saldo Líquido */}
        <View style={[styles.balanceCard, { backgroundColor: theme.card }]}>
          <MaterialIcons
            name={isNetPositive ? 'trending-up' : 'trending-down'}
            size={18}
            color={isNetPositive ? '#3870d8' : '#ef4444'}
          />
          <Text style={[styles.cardLabel, { color: theme.subtext }]}>Líquido</Text>
          <Text
            style={[
              styles.cardValue,
              { color: isNetPositive ? theme.text : '#ef4444' },
            ]}
          >
            {renderValue(balance.netBalance)}
          </Text>
        </View>
      </View>

      {/* --- CONTEÚDO EM SCROLL --- */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Gráfico de Distribuição */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Distribuição de Gastos
          </Text>

          <View style={[styles.chartCard, { backgroundColor: theme.card }]}>
            {chartData.length > 0 ? (
              <PieChart
                data={chartData}
                width={screenWidth - 60}
                height={200}
                chartConfig={{
                  color: () => '#000',
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute={false}
              />
            ) : (
              <Text style={[styles.emptyText, { color: theme.subtext }]}>
                Sem despesas registradas neste mês.
              </Text>
            )}
          </View>
        </View>

        {/* Detalhamento por Categoria com Barras de Progresso */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Por Categoria
          </Text>

          {categorySummaries.length === 0 ? (
            <Text style={[styles.emptyText, { color: theme.subtext }]}>
              Nenhum gasto para listar no período selecionado.
            </Text>
          ) : (
            categorySummaries.map((cat, index) => (
              <View
                key={index}
                style={[styles.categoryCard, { backgroundColor: theme.card }]}
              >
                <View style={styles.categoryTopRow}>
                  <View style={styles.categoryLeft}>
                    <View style={[styles.colorDot, { backgroundColor: cat.color }]} />
                    <Text style={[styles.categoryName, { color: theme.text }]}>
                      {cat.name}
                    </Text>
                  </View>

                  <View style={styles.categoryValues}>
                    <Text style={[styles.categoryAmount, { color: theme.text }]}>
                      {renderValue(cat.total)}
                    </Text>
                    <Text style={[styles.categoryPercent, { color: theme.subtext }]}>
                      {isVisible ? `${cat.percentage}%` : '••%'}
                    </Text>
                  </View>
                </View>

                {/* Barra de Progresso Relativa */}
                <View
                  style={[
                    styles.progressBarBg,
                    { backgroundColor: isDark ? '#334155' : '#e2e8f0' },
                  ]}
                >
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${cat.percentage}%`,
                        backgroundColor: cat.color,
                      },
                    ]}
                  />
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}