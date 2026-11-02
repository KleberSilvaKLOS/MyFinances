/**
 * ============================================================================
 * TELA DE GESTÃO DE CARTÕES E PARCELAMENTOS
 * Camada de apresentação visual conectada ao hook useCards.
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

import { useCards } from './useCards';
import { styles } from './styles';

export default function CardsScreen() {
  const {
    theme,
    isDark,
    isVisible,
    toggleVisibility,
    cards,
    activeCard,
    currentInvoice,
    formattedMonth,
    committedLimit,
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
  } = useCards();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={['top']}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.header}
      />

      {/* --- MODAL DE NOVO CARTÃO --- */}
      <Modal
        animationType="fade"
        transparent
        visible={showCardModal}
        onRequestClose={() => setShowCardModal(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            padding: 20,
          }}
          onPress={() => setShowCardModal(false)}
        >
          <Pressable
            style={[styles.formCard, { backgroundColor: theme.card }]}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={[styles.formTitle, { color: theme.text }]}>
              Novo Cartão de Crédito
            </Text>

            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.input, color: theme.text },
              ]}
              placeholder="Nome do cartão (ex: Nubank, Inter)"
              placeholderTextColor={theme.subtext}
              value={cardName}
              onChangeText={setCardName}
            />

            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.input, color: theme.text },
              ]}
              placeholder="Limite Total (R$)"
              placeholderTextColor={theme.subtext}
              keyboardType="numeric"
              value={cardLimit}
              onChangeText={setCardLimit}
            />

            <View style={styles.formRow}>
              <TextInput
                style={[
                  styles.input,
                  { flex: 1, backgroundColor: theme.input, color: theme.text },
                ]}
                placeholder="Dia Fechamento"
                placeholderTextColor={theme.subtext}
                keyboardType="numeric"
                maxLength={2}
                value={closingDay}
                onChangeText={setClosingDay}
              />

              <TextInput
                style={[
                  styles.input,
                  { flex: 1, backgroundColor: theme.input, color: theme.text },
                ]}
                placeholder="Dia Vencimento"
                placeholderTextColor={theme.subtext}
                keyboardType="numeric"
                maxLength={2}
                value={dueDay}
                onChangeText={setDueDay}
              />
            </View>

            <TouchableOpacity style={styles.btnSubmit} onPress={handleSaveCard}>
              <Text style={styles.btnSubmitText}>Salvar Cartão</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* --- CABEÇALHO --- */}
      <View style={[styles.header, { backgroundColor: theme.header }]}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Cartões de Crédito</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={toggleVisibility} style={styles.headerIconBtn}>
              <Ionicons
                name={isVisible ? 'eye' : 'eye-off'}
                size={22}
                color="#ffffff"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowCardModal(true)}
              style={styles.headerIconBtn}
            >
              <MaterialIcons name="add-card" size={22} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* --- CARTÃO VISUAL --- */}
        <View style={styles.cardPreviewWrapper}>
          {activeCard ? (
            <View style={[styles.virtualCard, { backgroundColor: activeCard.color }]}>
              <View style={styles.cardTopRow}>
                <Text style={styles.cardName}>{activeCard.name}</Text>
                <Ionicons name="card-outline" size={28} color="#ffffffcc" />
              </View>

              <View style={styles.cardDatesRow}>
                <Text style={styles.cardDateText}>
                  Fecha dia {activeCard.closingDay}
                </Text>
                <Text style={styles.cardDateText}>
                  Vence dia {activeCard.dueDay}
                </Text>
              </View>

              {/* Barra de Progresso do Limite */}
              <View style={styles.limitBarBg}>
                <View
                  style={[
                    styles.limitBarFill,
                    {
                      width: `${limitUsagePercentage}%`,
                      backgroundColor:
                        limitUsagePercentage > 85 ? '#ef4444' : '#13ec6d',
                    },
                  ]}
                />
              </View>

              <View style={styles.limitLabelsRow}>
                <View>
                  <Text style={styles.limitLabel}>Disponível</Text>
                  <Text style={styles.limitAmount}>{renderValue(availableLimit)}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.limitLabel}>Limite Total</Text>
                  <Text style={styles.limitAmount}>{renderValue(activeCard.limit)}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View
              style={[
                styles.virtualCard,
                { backgroundColor: theme.card, alignItems: 'center', paddingVertical: 30 },
              ]}
            >
              <Ionicons name="card-outline" size={40} color={theme.subtext} />
              <Text style={{ color: theme.text, marginTop: 10, fontWeight: 'bold' }}>
                Nenhum cartão cadastrado
              </Text>
              <TouchableOpacity
                style={[styles.btnSubmit, { paddingHorizontal: 20, marginTop: 12 }]}
                onPress={() => setShowCardModal(true)}
              >
                <Text style={styles.btnSubmitText}>Cadastrar Primeiro Cartão</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {activeCard && (
          <>
            {/* --- SELETOR DA FATURA --- */}
            <View style={[styles.invoiceNav, { backgroundColor: theme.card }]}>
              <TouchableOpacity onPress={handlePrevMonth} style={styles.invoiceNavBtn}>
                <MaterialIcons name="chevron-left" size={24} color={theme.text} />
              </TouchableOpacity>

              <View style={{ alignItems: 'center' }}>
                <Text style={[styles.invoiceTitle, { color: theme.text }]}>
                  Fatura de {formattedMonth}
                </Text>
                <Text style={{ fontSize: 13, color: '#ef4444', fontWeight: 'bold' }}>
                  Total: {renderValue(currentInvoice.total)}
                </Text>
              </View>

              <TouchableOpacity onPress={handleNextMonth} style={styles.invoiceNavBtn}>
                <MaterialIcons name="chevron-right" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            {/* --- FORMULÁRIO DE LANÇAMENTO PARCELADO --- */}
            <View style={[styles.formCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.formTitle, { color: theme.text }]}>
                Lançar Compra no Cartão
              </Text>

              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: theme.input, color: theme.text },
                ]}
                placeholder="Descrição (ex: Smartphone)"
                placeholderTextColor={theme.subtext}
                value={desc}
                onChangeText={setDesc}
              />

              <View style={styles.formRow}>
                <TextInput
                  style={[
                    styles.input,
                    { flex: 1.5, backgroundColor: theme.input, color: theme.text },
                  ]}
                  placeholder="Valor Total (R$)"
                  placeholderTextColor={theme.subtext}
                  keyboardType="numeric"
                  value={val}
                  onChangeText={setVal}
                />

                <TextInput
                  style={[
                    styles.input,
                    { flex: 1, backgroundColor: theme.input, color: theme.text, textAlign: 'center' },
                  ]}
                  placeholder="Parcelas"
                  placeholderTextColor={theme.subtext}
                  keyboardType="numeric"
                  maxLength={2}
                  value={installments}
                  onChangeText={setInstallments}
                />
              </View>

              <TouchableOpacity style={styles.btnSubmit} onPress={handleAddPurchase}>
                <Text style={styles.btnSubmitText}>Adicionar Compra</Text>
              </TouchableOpacity>
            </View>

            {/* --- LISTAGEM DE COMPRAS / PARCELAS DA FATURA --- */}
            <View style={styles.sectionContainer}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Itens desta Fatura
              </Text>

              {currentInvoice.items.length === 0 ? (
                <Text style={[styles.emptyText, { color: theme.subtext }]}>
                  Nenhuma compra vinculada a esta fatura.
                </Text>
              ) : (
                currentInvoice.items.map((item, index) => (
                  <View
                    key={`${item.purchaseId}-${index}`}
                    style={[styles.purchaseCard, { backgroundColor: theme.card }]}
                  >
                    <View style={styles.purchaseInfo}>
                      <Text style={[styles.purchaseDesc, { color: theme.text }]}>
                        {item.description}
                      </Text>
                      <View style={styles.installmentBadge}>
                        <Text style={styles.installmentText}>
                          Parcela {item.currentInstallment} de {item.totalInstallments}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.purchaseValues}>
                      <Text style={[styles.purchaseAmount, { color: theme.text }]}>
                        {renderValue(item.value)}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleDeletePurchase(item.purchaseId)}
                      >
                        <MaterialIcons name="delete" size={18} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}