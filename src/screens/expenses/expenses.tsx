/**
 * ============================================================================
 * TELA DE LANÇAMENTOS E GASTOS (Atualizada e Padronizada)
 * Registro de receitas/despesas, busca textual e listagem detalhada.
 * ============================================================================
 */

import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';

import { useExpenses } from './useExpenses';
import { styles } from './styles';

const DEFAULT_CATEGORIES = [
  'Alimentação',
  'Moradia',
  'Transporte',
  'Lazer',
  'Saúde',
  'Educação',
  'Outros',
];

export default function ExpensesScreen() {
  const {
    theme,
    isDark,
    isVisible,
    toggleVisibility,
    filteredTransactions,
    search,
    setSearch,
    description,
    setDescription,
    value,
    setValue,
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
  } = useExpenses();

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
          <Text style={styles.headerTitle}>Lançamentos</Text>
          <TouchableOpacity onPress={toggleVisibility} style={styles.headerIconBtn}>
            <Ionicons
              name={isVisible ? 'eye' : 'eye-off'}
              size={20}
              color="#ffffff"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.balanceLabel}>Balanço de Movimentações</Text>
        <Text style={styles.balanceValue}>{renderValue(balance)}</Text>

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

      {/* --- FORMULÁRIO DE LANÇAMENTO --- */}
      <View style={[styles.formCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.formTitle, { color: theme.text }]}>
          {editingId ? 'Editar Movimentação' : 'Nova Movimentação'}
        </Text>

        {/* Alternador: Despesa / Receita */}
        <View style={styles.typeSelectorRow}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'expense' && { backgroundColor: '#ef4444' },
            ]}
            onPress={() => setType('expense')}
          >
            <MaterialIcons
              name="arrow-downward"
              size={16}
              color={type === 'expense' ? '#fff' : theme.subtext}
            />
            <Text
              style={[
                styles.typeButtonText,
                { color: type === 'expense' ? '#fff' : theme.subtext },
              ]}
            >
              Despesa
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'income' && { backgroundColor: '#13ec6d' },
            ]}
            onPress={() => setType('income')}
          >
            <MaterialIcons
              name="arrow-upward"
              size={16}
              color={type === 'income' ? '#fff' : theme.subtext}
            />
            <Text
              style={[
                styles.typeButtonText,
                { color: type === 'income' ? '#fff' : theme.subtext },
              ]}
            >
              Receita
            </Text>
          </TouchableOpacity>
        </View>

        {/* Inputs Descrição e Valor */}
        <View style={styles.inputsRow}>
          <TextInput
            style={[
              styles.input,
              { flex: 2, backgroundColor: theme.input, color: theme.text },
            ]}
            placeholder="Descrição (ex: Mercado, Salário)"
            placeholderTextColor={theme.subtext}
            value={description}
            onChangeText={setDescription}
          />

          <TextInput
            style={[
              styles.input,
              { flex: 1.2, backgroundColor: theme.input, color: theme.text },
            ]}
            placeholder="Valor R$"
            placeholderTextColor={theme.subtext}
            keyboardType="numeric"
            value={value}
            onChangeText={setValue}
          />
        </View>

        {/* Pílulas de Categoria Rápida */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {DEFAULT_CATEGORIES.map((cat) => {
            const isSelected = category === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: isSelected
                      ? '#3870d8'
                      : isDark
                      ? '#1e293b'
                      : '#f1f5f9',
                  },
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    { color: isSelected ? '#ffffff' : theme.subtext },
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Botões Salvar / Cancelar */}
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
          {editingId && (
            <TouchableOpacity
              style={[styles.btnAction, { flex: 1, backgroundColor: '#64748b' }]}
              onPress={handleCancelEdit}
            >
              <Text style={styles.btnActionText}>Cancelar</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.btnAction,
              { flex: 2 },
              editingId ? { backgroundColor: '#fbbf24' } : { backgroundColor: '#3870d8' },
            ]}
            onPress={handleSaveTransaction}
          >
            <MaterialIcons
              name={editingId ? 'check' : 'add'}
              size={20}
              color="#fff"
            />
            <Text style={styles.btnActionText}>
              {editingId ? 'Salvar Alteração' : 'Registrar Lançamento'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* --- CAMPO DE BUSCA --- */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBox, { backgroundColor: theme.card }]}>
          <Feather name="search" size={18} color={theme.subtext} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Filtrar lançamentos..."
            placeholderTextColor={theme.subtext}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={theme.subtext} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* --- LISTAGEM DE MOVIMENTAÇÕES --- */}
      <ScrollView
        contentContainerStyle={styles.scrollList}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.listHeaderTitle, { color: theme.text }]}>
          Histórico ({filteredTransactions.length})
        </Text>

        {filteredTransactions.length === 0 ? (
          <View style={[styles.emptyContainer, { backgroundColor: theme.card }]}>
            <Feather name="inbox" size={30} color={theme.subtext} />
            <Text style={[styles.emptyText, { color: theme.subtext }]}>
              Nenhum lançamento encontrado.
            </Text>
          </View>
        ) : (
          filteredTransactions.map((item) => {
            const isExpense = item.type === 'expense';
            const numVal = Number(item.value ?? (item as any).amount ?? 0);

            return (
              <View
                key={item.id}
                style={[styles.transactionCard, { backgroundColor: theme.card }]}
              >
                <View
                  style={[
                    styles.typeIconBox,
                    {
                      backgroundColor: isExpense
                        ? 'rgba(239, 68, 68, 0.12)'
                        : 'rgba(19, 236, 109, 0.12)',
                    },
                  ]}
                >
                  <MaterialIcons
                    name={isExpense ? 'arrow-downward' : 'arrow-upward'}
                    size={20}
                    color={isExpense ? '#ef4444' : '#13ec6d'}
                  />
                </View>

                <View style={styles.txInfo}>
                  <Text style={[styles.txDescription, { color: theme.text }]} numberOfLines={1}>
                    {item.description}
                  </Text>
                  <View style={styles.txMetaRow}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>
                        {item.category || 'Geral'}
                      </Text>
                    </View>
                    <Text style={[styles.txDate, { color: theme.subtext }]}>
                      {item.date || 'Hoje'}
                    </Text>
                  </View>
                </View>

                <View style={styles.txValueCol}>
                  <Text
                    style={[
                      styles.txValue,
                      { color: isExpense ? '#ef4444' : '#13ec6d' },
                    ]}
                  >
                    {isExpense ? '- ' : '+ '}
                    {renderValue(numVal)}
                  </Text>

                  <View style={styles.txActions}>
                    <TouchableOpacity onPress={() => handleStartEdit(item)}>
                      <MaterialIcons name="edit" size={17} color="#fbbf24" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteTransaction(item.id)}>
                      <MaterialIcons name="delete" size={17} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}