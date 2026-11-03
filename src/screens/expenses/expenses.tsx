/**
 * ============================================================================
 * TELA DE LANÇAMENTOS E GASTOS
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
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';

import { useExpenses } from './useExpenses';
import { styles } from './styles';

export default function ExpensesScreen() {
  const {
    theme,
    isDark,
    isVisible,
    toggleVisibility,
    filteredTransactions,
    search,
    setSearch,
    categories,
    isCategoryModalVisible,
    setIsCategoryModalVisible,
    isCategoryPickerOpen,
    setIsCategoryPickerOpen,
    newCategoryName,
    setNewCategoryName,
    handleAddCategory,
    handleMoveCategory,
    handleDeleteCategory,
    description,
    setDescription,
    value,
    handleValueChange,
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

          <View style={styles.headerActionsRow}>
            {/* Gerenciar categorias cadastradas */}
            <TouchableOpacity
              onPress={() => setIsCategoryModalVisible(true)}
              style={styles.headerIconBtn}
              activeOpacity={0.8}
            >
              <MaterialIcons name="bookmarks" size={19} color="#ffffff" />
            </TouchableOpacity>

            {/* Alternar visibilidade de valores */}
            <TouchableOpacity
              onPress={toggleVisibility}
              style={styles.headerIconBtn}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isVisible ? 'eye' : 'eye-off'}
                size={19}
                color="#ffffff"
              />
            </TouchableOpacity>
          </View>
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

      {/* --- FORMULÁRIO --- */}
      <View style={[styles.formCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.formTitle, { color: theme.text }]}>
          {editingId ? 'Editar Movimentação' : 'Nova Movimentação'}
        </Text>

        {/* Tipo: Despesa / Receita */}
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

        {/* Linha 1: Seletor de Categoria e Input de Valor R$ */}
        <View style={styles.inputsRow}>
          <TouchableOpacity
            style={[
              styles.categoryTrigger,
              { backgroundColor: theme.input, borderColor: theme.border },
            ]}
            onPress={() => setIsCategoryPickerOpen(!isCategoryPickerOpen)}
            activeOpacity={0.7}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.fieldMiniLabel, { color: theme.subtext }]}>
                Categoria
              </Text>
              <Text
                style={[styles.categoryTriggerText, { color: theme.text }]}
                numberOfLines={1}
              >
                {category}
              </Text>
            </View>
            <MaterialIcons
              name={isCategoryPickerOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
              size={20}
              color={theme.subtext}
            />
          </TouchableOpacity>

          <View
            style={[
              styles.valueInputBox,
              { backgroundColor: theme.input, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.fieldMiniLabel, { color: theme.subtext }]}>
              Valor
            </Text>
            <TextInput
              style={[styles.inputInner, { color: theme.text }]}
              placeholder="R$ 0,00"
              placeholderTextColor={theme.subtext}
              keyboardType="numeric"
              value={value}
              onChangeText={handleValueChange}
            />
          </View>
        </View>

        {/* Seção retrátil aberta ao clicar em Categoria */}
        {isCategoryPickerOpen && (
          <View
            style={[
              styles.categoryDropdownContainer,
              { backgroundColor: theme.input, borderColor: theme.border },
            ]}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryDropdownScroll}
            >
              {categories.map((cat) => {
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
                          : '#e2e8f0',
                      },
                    ]}
                    onPress={() => {
                      setCategory(cat);
                      setIsCategoryPickerOpen(false);
                    }}
                    onLongPress={() => setIsCategoryModalVisible(true)}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        { color: isSelected ? '#ffffff' : theme.text },
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Linha 2: Descrição */}
        <View style={styles.inputsRow}>
          <TextInput
            style={[
              styles.input,
              { flex: 1, backgroundColor: theme.input, color: theme.text },
            ]}
            placeholder="Descrição (ex: Mercado, Combustível, Salário)"
            placeholderTextColor={theme.subtext}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Botões de Ação */}
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
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

      {/* --- BUSCA --- */}
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

      {/* --- HISTÓRICO --- */}
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

      {/* --- MODAL DE GERENCIAMENTO DE CATEGORIAS --- */}
      <Modal
        visible={isCategoryModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsCategoryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <View style={[styles.modalIconBox, { backgroundColor: 'rgba(56, 112, 216, 0.15)' }]}>
                <MaterialIcons name="bookmarks" size={24} color="#3870d8" />
              </View>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                Gerenciar Categorias
              </Text>
              <Text style={[styles.modalSubtitle, { color: theme.subtext }]}>
                Adicione, reordene e remova categorias da sua lista.
              </Text>
            </View>

            {/* Input para nova categoria */}
            <View style={styles.modalAddRow}>
              <TextInput
                style={[
                  styles.input,
                  { flex: 1, backgroundColor: theme.input, color: theme.text },
                ]}
                placeholder="Nova categoria..."
                placeholderTextColor={theme.subtext}
                value={newCategoryName}
                onChangeText={setNewCategoryName}
              />
              <TouchableOpacity
                style={[styles.modalAddBtn, { backgroundColor: '#3870d8' }]}
                onPress={handleAddCategory}
              >
                <MaterialIcons name="add" size={22} color="#ffffff" />
              </TouchableOpacity>
            </View>

            {/* Lista ordenada com botões de movimentação e exclusão */}
            <ScrollView style={styles.modalCategoriesList} showsVerticalScrollIndicator={false}>
              {categories.map((cat, index) => (
                <View
                  key={cat}
                  style={[
                    styles.modalCatRow,
                    { borderBottomColor: theme.border },
                  ]}
                >
                  <Text style={[styles.modalCatName, { color: theme.text }]}>
                    {cat}
                  </Text>

                  <View style={styles.modalCatActions}>
                    <TouchableOpacity
                      disabled={index === 0}
                      onPress={() => handleMoveCategory(cat, -1)}
                      style={[styles.orderBtn, index === 0 && { opacity: 0.25 }]}
                    >
                      <MaterialIcons name="arrow-upward" size={18} color={theme.text} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      disabled={index === categories.length - 1}
                      onPress={() => handleMoveCategory(cat, 1)}
                      style={[styles.orderBtn, index === categories.length - 1 && { opacity: 0.25 }]}
                    >
                      <MaterialIcons name="arrow-downward" size={18} color={theme.text} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleDeleteCategory(cat)}
                      style={[styles.orderBtn, { marginLeft: 4 }]}
                    >
                      <MaterialIcons name="delete" size={18} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={[styles.modalCloseBtn, { backgroundColor: theme.input }]}
              onPress={() => setIsCategoryModalVisible(false)}
            >
              <Text style={[styles.modalCloseBtnText, { color: theme.text }]}>
                Concluir
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}