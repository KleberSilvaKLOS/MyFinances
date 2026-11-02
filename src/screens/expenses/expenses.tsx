/**
 * ============================================================================
 * TELA DE GASTOS / LANÇAMENTOS
 * Camada de apresentação visual conectada ao hook useExpenses.
 * ============================================================================
 */

import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

import { useExpenses } from './useExpenses';
import { styles } from './styles';

export default function ExpensesScreen() {
  const {
    theme,
    isDark,
    isVisible,
    toggleVisibility,
    list,
    customCategories,
    balance,
    totalIncome,
    totalExpense,
    modalVisible,
    setModalVisible,
    editingId,
    value,
    setValue,
    description,
    detail,
    setDetail,
    type,
    setType,
    newCategoryName,
    setNewCategoryName,
    editingCategoryIndex,
    filteredSuggestions,
    showSuggestions,
    handleDescriptionChange,
    selectSuggestion,
    handleSaveTransaction,
    handleStartEdit,
    handleDeleteTransaction,
    handleAddOrUpdateCategory,
    handleEditCategory,
    handleDeleteCategory,
    handleResetApp,
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

      {/* --- MODAL LATERAL DE CATEGORIAS --- */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setModalVisible(false)}
          />
          <View style={[styles.sideMenu, { backgroundColor: theme.modal }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Categorias</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.inputLabel, { color: theme.text }]}>
              {editingCategoryIndex !== null ? 'Editar Categoria' : 'Nova Categoria'}
            </Text>

            <View style={styles.addCategoryRow}>
              <TextInput
                style={[
                  styles.modalInput,
                  { backgroundColor: theme.input, color: theme.text },
                ]}
                placeholder="Ex: Pet Shop"
                placeholderTextColor={theme.subtext}
                value={newCategoryName}
                onChangeText={setNewCategoryName}
              />
              <TouchableOpacity
                style={styles.btnAddCategory}
                onPress={handleAddOrUpdateCategory}
              >
                <MaterialIcons
                  name={editingCategoryIndex !== null ? 'check' : 'add'}
                  size={24}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.categoryListContainer,
                { borderColor: theme.border, backgroundColor: theme.card },
              ]}
            >
              <ScrollView showsVerticalScrollIndicator={false}>
                {customCategories.length === 0 ? (
                  <Text style={{ color: theme.subtext, textAlign: 'center', marginVertical: 20 }}>
                    Nenhuma categoria personalizada.
                  </Text>
                ) : (
                  customCategories.map((cat, index) => (
                    <View
                      key={index}
                      style={[styles.categoryItem, { borderBottomColor: theme.border }]}
                    >
                      <Text style={{ color: theme.text, fontSize: 16 }}>{cat}</Text>
                      <View style={{ flexDirection: 'row', gap: 10 }}>
                        <TouchableOpacity onPress={() => handleEditCategory(index)}>
                          <MaterialIcons name="edit" size={20} color="#fbbf24" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDeleteCategory(index)}>
                          <MaterialIcons name="delete" size={20} color="#ef4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                )}
              </ScrollView>
            </View>

            <TouchableOpacity style={styles.btnDelete} onPress={handleResetApp}>
              <MaterialIcons name="delete-forever" size={22} color="#ef4444" />
              <Text style={{ color: '#ef4444', fontWeight: 'bold' }}>Resetar App</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* --- CABEÇALHO COM RESUMO FINANCEIRO --- */}
      <View style={[styles.summaryContainer, { backgroundColor: theme.header }]}>
        <View style={styles.headerContent}>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.summaryLabel}>Saldo Atual</Text>
            <Text style={styles.summaryAmount}>{renderValue(balance)}</Text>
          </View>

          <View style={styles.headerRightActions}>
            <TouchableOpacity onPress={toggleVisibility} style={styles.btnEyeHeader}>
              <Ionicons
                name={isVisible ? 'eye' : 'eye-off'}
                size={24}
                color="#ffffff"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={styles.btnAddHeader}
            >
              <MaterialIcons name="category" size={22} color="#3870d8" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.summaryMiniCard}>
            <MaterialIcons name="arrow-upward" size={16} color="#13ec6d" />
            <Text style={styles.miniCardText}>{renderValue(totalIncome)}</Text>
          </View>

          <View style={styles.summaryMiniCard}>
            <MaterialIcons name="arrow-downward" size={16} color="#ef4444" />
            <Text style={styles.miniCardText}>{renderValue(totalExpense)}</Text>
          </View>
        </View>
      </View>

      {/* --- FORMULÁRIO DE ENTRADA RÁPIDA --- */}
      <View style={[styles.mainInputContainer, { backgroundColor: theme.card }]}>
        <View style={styles.quickTypeSelector}>
          <TouchableOpacity
            style={[
              styles.quickTypeBtn,
              { borderColor: theme.border },
              type === 'income' && styles.quickIncomeActive,
            ]}
            onPress={() => setType('income')}
          >
            <MaterialIcons
              name="arrow-upward"
              size={18}
              color={type === 'income' ? '#fff' : '#13ec6d'}
            />
            <Text
              style={[
                styles.quickTypeText,
                { color: type === 'income' ? '#fff' : theme.text },
              ]}
            >
              Entrada
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.quickTypeBtn,
              { borderColor: theme.border },
              type === 'expense' && styles.quickExpenseActive,
            ]}
            onPress={() => setType('expense')}
          >
            <MaterialIcons
              name="arrow-downward"
              size={18}
              color={type === 'expense' ? '#fff' : '#ef4444'}
            />
            <Text
              style={[
                styles.quickTypeText,
                { color: type === 'expense' ? '#fff' : theme.text },
              ]}
            >
              Saída
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.valueInputWrapper, { borderBottomColor: theme.border }]}>
          <Text style={styles.currencyPrefix}>R$</Text>
          <TextInput
            style={[styles.mainValueInput, { color: theme.text }]}
            placeholder="0,00"
            placeholderTextColor={theme.subtext}
            keyboardType="numeric"
            value={value}
            onChangeText={setValue}
          />
        </View>

        <View style={styles.descInputWrapper}>
          <TextInput
            style={[
              styles.descInputCat,
              { backgroundColor: theme.input, color: theme.text },
            ]}
            placeholder="Categoria"
            placeholderTextColor={theme.subtext}
            value={description}
            onChangeText={handleDescriptionChange}
          />

          <TextInput
            style={[
              styles.descInput,
              { backgroundColor: theme.input, color: theme.text },
            ]}
            placeholder="Descrição (opcional)"
            placeholderTextColor={theme.subtext}
            value={detail}
            onChangeText={setDetail}
          />

          <TouchableOpacity
            style={[
              styles.confirmBtn,
              editingId ? { backgroundColor: '#fbbf24' } : null,
            ]}
            onPress={handleSaveTransaction}
          >
            <MaterialIcons
              name={editingId ? 'check' : 'add'}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* --- DROPDOWN DE AUTOCOMPLETE DE CATEGORIAS --- */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <View
          style={[
            styles.suggestionsBox,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <ScrollView keyboardShouldPersistTaps="handled">
            {filteredSuggestions.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.suggestionItem, { borderBottomColor: theme.border }]}
                onPress={() => selectSuggestion(item)}
              >
                <Text style={{ color: theme.text }}>{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* --- LISTAGEM DE LANÇAMENTOS --- */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.listContainer}>
          <Text style={[styles.listTitle, { color: theme.text }]}>Lançamentos</Text>

          {list.length === 0 ? (
            <Text style={{ color: theme.subtext, textAlign: 'center', marginTop: 30 }}>
              Nenhuma transação cadastrada.
            </Text>
          ) : (
            list.map((item) => {
              const isIncome = item.type === 'income';
              const isEditing = item.id === editingId;

              return (
                <View
                  key={item.id}
                  style={[
                    styles.itemCard,
                    { backgroundColor: theme.itemCard },
                    isEditing && styles.itemCardEditing,
                  ]}
                >
                  <View
                    style={[
                      styles.itemIconContainer,
                      { backgroundColor: theme.itemIconBg },
                    ]}
                  >
                    <MaterialIcons
                      name={isIncome ? 'arrow-upward' : 'arrow-downward'}
                      size={20}
                      color={isIncome ? '#13ec6d' : '#ef4444'}
                    />
                  </View>

                  <View style={styles.itemInfo}>
                    <Text style={[styles.itemTitle, { color: '#fff' }]}>
                      {item.description}
                    </Text>
                    {item.detail ? (
                      <Text style={[styles.itemDetail, { color: '#ffffffaa' }]}>
                        {item.detail}
                      </Text>
                    ) : null}
                    <Text style={styles.itemCategory}>
                      {item.date} {item.time ? `às ${item.time}` : ''}
                    </Text>
                  </View>

                  <View style={{ alignItems: 'flex-end', gap: 6 }}>
                    <Text
                      style={[
                        styles.itemValue,
                        { color: isIncome ? '#13ec6d' : '#fff' },
                      ]}
                    >
                      {isIncome ? '+ ' : '- '}
                      {renderValue(item.value)}
                    </Text>

                    <View style={{ flexDirection: 'row', gap: 12 }}>
                      <TouchableOpacity onPress={() => handleStartEdit(item)}>
                        <MaterialIcons name="edit" size={18} color="#ffffffcc" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeleteTransaction(item.id)}
                      >
                        <MaterialIcons name="delete" size={18} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}