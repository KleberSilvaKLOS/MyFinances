/**
 * ============================================================================
 * TELA HOME (Restaurada e Otimizada)
 * Ícone de configurações, layout refinado e card de pendências em preto.
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
import { useNavigation } from '@react-navigation/native';

import { useHome } from './useHome';
import { styles } from './styles';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const {
    theme,
    isDark,
    isVisible,
    toggleVisibility,
    currentBalance,
    totalIncome,
    totalExpense,
    totalFixedBills,
    totalCardInstallments,
    totalMonthlyCommitments,
    pendingBills,
    cardInstallments,
    todayDay,
    renderValue,
  } = useHome();

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
          <View>
            <Text style={styles.greetingText}>Visão Geral</Text>
            <Text style={styles.headerTitle}>Meu Balanço</Text>
          </View>

          {/* Botões de Ação do Header */}
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={toggleVisibility} style={styles.headerIconBtn}>
              <Ionicons
                name={isVisible ? 'eye' : 'eye-off'}
                size={20}
                color="#ffffff"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                // Navega para configurações ou abre menu se houver rota configurada
                if (navigation.canGoBack && navigation.getState().routeNames.includes('Settings')) {
                  navigation.navigate('Settings');
                }
              }}
              style={styles.headerIconBtn}
            >
              <Feather name="settings" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.balanceLabel}>Saldo em Caixa</Text>
        <Text style={styles.balanceValue}>{renderValue(currentBalance)}</Text>

        <View style={styles.indicatorsRow}>
          <View style={styles.indicatorItem}>
            <MaterialIcons name="arrow-upward" size={16} color="#13ec6d" />
            <Text style={styles.indicatorLabel}>Entradas:</Text>
            <Text style={[styles.indicatorVal, { color: '#13ec6d' }]}>
              {renderValue(totalIncome)}
            </Text>
          </View>

          <View style={styles.indicatorItem}>
            <MaterialIcons name="arrow-downward" size={16} color="#ef4444" />
            <Text style={styles.indicatorLabel}>Saídas:</Text>
            <Text style={[styles.indicatorVal, { color: '#ef4444' }]}>
              {renderValue(totalExpense)}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* --- CARD DE COMPROMISSOS DO MÊS --- */}
        <View style={[styles.summaryBox, { backgroundColor: theme.card }]}>
          <View style={styles.summaryBoxTop}>
            <Text style={[styles.summaryBoxTitle, { color: theme.text }]}>
              Compromissos Previstos
            </Text>
            <Text style={[styles.summaryBoxTotal, { color: '#ef4444' }]}>
              {renderValue(totalMonthlyCommitments)}
            </Text>
          </View>

          <View style={styles.summarySplitRow}>
            <TouchableOpacity
              style={styles.summarySplitItem}
              onPress={() => navigation.navigate('Fixas')}
            >
              <Text style={[styles.splitLabel, { color: theme.subtext }]}>Contas Fixas</Text>
              <Text style={[styles.splitValue, { color: theme.text }]}>
                {renderValue(totalFixedBills)}
              </Text>
            </TouchableOpacity>

            <View style={[styles.splitDivider, { backgroundColor: theme.border }]} />

            <TouchableOpacity
              style={styles.summarySplitItem}
              onPress={() => navigation.navigate('Cartoes')}
            >
              <Text style={[styles.splitLabel, { color: theme.subtext }]}>Faturas de Cartão</Text>
              <Text style={[styles.splitValue, { color: theme.text }]}>
                {renderValue(totalCardInstallments)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- BLOCO EM PRETO: CONTAS FIXAS PENDENTES --- */}
        <View style={styles.blackSectionContainer}>
          <View style={styles.blackCardWrapper}>
            <View style={styles.blackCardHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={styles.blackDotIndicator} />
                <Text style={styles.blackCardTitle}>Contas Pendentes</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('Fixas')}>
                <Text style={styles.blackCardLink}>Gerenciar</Text>
              </TouchableOpacity>
            </View>

            {pendingBills.length === 0 ? (
              <View style={styles.blackEmptyRow}>
                <MaterialIcons name="verified" size={20} color="#13ec6d" />
                <Text style={styles.blackEmptyText}>Tudo liquidado este mês!</Text>
              </View>
            ) : (
              pendingBills.slice(0, 4).map((bill) => {
                const isLate = bill.dueDay < todayDay;
                return (
                  <View key={bill.id} style={styles.blackItemRow}>
                    <View style={styles.blackItemLeft}>
                      <Text style={styles.blackItemTitle} numberOfLines={1}>
                        {bill.title}
                      </Text>
                      <Text
                        style={[
                          styles.blackItemSub,
                          isLate && { color: '#f87171', fontWeight: 'bold' },
                        ]}
                      >
                        {isLate ? `Atrasada • Venceu dia ${bill.dueDay}` : `Vence dia ${bill.dueDay}`}
                      </Text>
                    </View>

                    <Text
                      style={[
                        styles.blackItemValue,
                        isLate && { color: '#f87171' },
                      ]}
                    >
                      {renderValue(bill.value)}
                    </Text>
                  </View>
                );
              })
            )}
          </View>
        </View>

        {/* --- PARCELAMENTOS ATIVOS EM CARTÕES --- */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Parcelamentos em Cartões
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Cartoes')}>
              <Text style={styles.seeAllText}>Ver faturas</Text>
            </TouchableOpacity>
          </View>

          {cardInstallments.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: theme.card }]}>
              <Ionicons name="card-outline" size={24} color={theme.subtext} />
              <Text style={[styles.emptyCardText, { color: theme.subtext }]}>
                Nenhuma compra parcelada ativa.
              </Text>
            </View>
          ) : (
            cardInstallments.map((inst, index) => (
              <View
                key={`${inst.purchaseId}-${index}`}
                style={[styles.itemCard, { backgroundColor: theme.card }]}
              >
                <View style={styles.itemInfo}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={[styles.itemTitle, { color: theme.text }]}>
                      {inst.description}
                    </Text>
                    <View
                      style={{
                        backgroundColor: inst.cardColor,
                        paddingHorizontal: 6,
                        paddingVertical: 1,
                        borderRadius: 4,
                      }}
                    >
                      <Text style={{ color: '#fff', fontSize: 9, fontWeight: 'bold' }}>
                        {inst.cardName}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.itemSubtext, { color: theme.subtext }]}>
                    Parcela {inst.currentInstallment} de {inst.totalInstallments} • Venc. dia {inst.dueDay}
                  </Text>
                </View>
                <Text style={[styles.itemValue, { color: theme.text }]}>
                  {renderValue(inst.value)}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}