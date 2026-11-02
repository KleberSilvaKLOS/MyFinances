/**
 * ============================================================================
 * TELA DE CONTAS FIXAS & PARCELAMENTOS (Com Navegação Mensal)
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
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

import { useFixedBills } from './useFixedBills';
import { styles } from './styles';

export default function FixedBillsScreen() {
  const {
    theme,
    isDark,
    isVisible,
    toggleVisibility,
    bills,
    cardInstallments,
    grandTotalAmount,
    totalBillsAmount,
    totalCardInstallments,
    formattedMonth,
    handlePrevMonth,
    handleNextMonth,
    title,
    setTitle,
    value,
    setValue,
    dueDay,
    setDueDay,
    editingId,
    handleSaveBill,
    handleStartEdit,
    handleCancelEdit,
    handleDeleteBill,
    handleTogglePayment,
    isBillPaid,
    isItemOverdue,
    renderValue,
  } = useFixedBills();

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
          <Text style={styles.headerTitle}>Contas & Recorrências</Text>
          <View style={styles.headerRightActions}>
            <TouchableOpacity onPress={toggleVisibility} style={styles.headerIconBtn}>
              <Ionicons
                name={isVisible ? 'eye' : 'eye-off'}
                size={22}
                color="#ffffff"
              />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.headerLabel}>Total Comprometido no Mês</Text>
        <Text style={styles.headerTotal}>{renderValue(grandTotalAmount)}</Text>

        <View style={{ flexDirection: 'row', gap: 15, marginTop: 6 }}>
          <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 12 }}>
            Fixas: {renderValue(totalBillsAmount)}
          </Text>
          <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 12 }}>
            Cartões: {renderValue(totalCardInstallments)}
          </Text>
        </View>

        {/* --- SELETOR MENSAL --- */}
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

      {/* --- FORMULÁRIO DE NOVA CONTA FIXA --- */}
      <View style={[styles.inputCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.inputCardTitle, { color: theme.text }]}>
          {editingId ? 'Editar Conta' : 'Nova Conta Fixa'}
        </Text>

        <View style={styles.inputsRow}>
          <TextInput
            style={[
              styles.input,
              { flex: 1.5, backgroundColor: theme.input, color: theme.text },
            ]}
            placeholder="Nome (ex: Internet, Aluguel)"
            placeholderTextColor={theme.subtext}
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            style={[
              styles.input,
              { flex: 1, backgroundColor: theme.input, color: theme.text },
            ]}
            placeholder="Valor"
            placeholderTextColor={theme.subtext}
            keyboardType="numeric"
            value={value}
            onChangeText={setValue}
          />

          <TextInput
            style={[
              styles.input,
              { width: 65, backgroundColor: theme.input, color: theme.text, textAlign: 'center' },
            ]}
            placeholder="Dia"
            placeholderTextColor={theme.subtext}
            keyboardType="numeric"
            maxLength={2}
            value={dueDay}
            onChangeText={setDueDay}
          />
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          {editingId && (
            <TouchableOpacity
              style={[styles.btnSubmit, { flex: 1, backgroundColor: '#64748b' }]}
              onPress={handleCancelEdit}
            >
              <Text style={styles.btnSubmitText}>Cancelar</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.btnSubmit,
              { flex: 2 },
              editingId ? { backgroundColor: '#fbbf24' } : null,
            ]}
            onPress={handleSaveBill}
          >
            <MaterialIcons
              name={editingId ? 'check' : 'add'}
              size={22}
              color="#fff"
            />
            <Text style={styles.btnSubmitText}>
              {editingId ? 'Atualizar Conta' : 'Adicionar Conta'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* --- LISTA DE CONTAS FIXAS TRADICIONAIS --- */}
        <View style={styles.listContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Boletos & Despesas Fixas ({formattedMonth})
          </Text>

          {bills.length === 0 ? (
            <Text style={[styles.emptyText, { color: theme.subtext }]}>
              Nenhuma conta fixa cadastrada.
            </Text>
          ) : (
            bills.map((bill) => {
              const paid = isBillPaid(bill.id);
              const late = isItemOverdue(bill.dueDay, paid);
              const isEditing = editingId === bill.id;

              return (
                <View
                  key={bill.id}
                  style={[
                    styles.billCard,
                    { backgroundColor: theme.card },
                    isEditing && styles.billCardEditing,
                  ]}
                >
                  <TouchableOpacity
                    style={[styles.checkButton, paid && styles.checkButtonActive]}
                    onPress={() => handleTogglePayment(bill.id)}
                  >
                    {paid && <MaterialIcons name="check" size={18} color="#fff" />}
                  </TouchableOpacity>

                  <View style={styles.billInfo}>
                    <View style={styles.billTitleRow}>
                      <Text
                        style={[
                          styles.billTitle,
                          { color: theme.text },
                          paid && [styles.billPaidText, { color: theme.subtext }],
                        ]}
                      >
                        {bill.title}
                      </Text>
                      {late && (
                        <View style={styles.badgeLate}>
                          <Text style={styles.badgeLateText}>ATRASADA</Text>
                        </View>
                      )}
                    </View>

                    <Text
                      style={[
                        styles.billSubtext,
                        { color: theme.subtext },
                        late && { color: '#ef4444', fontWeight: 'bold' },
                      ]}
                    >
                      {paid
                        ? 'Liquidada neste mês'
                        : `Vence no dia ${bill.dueDay}`}
                    </Text>
                  </View>

                  <View style={styles.billValueContainer}>
                    <Text
                      style={[
                        styles.billValue,
                        { color: theme.text },
                        paid && { color: theme.subtext, textDecorationLine: 'line-through' },
                        late && { color: '#ef4444' },
                      ]}
                    >
                      {renderValue(bill.value)}
                    </Text>

                    <View style={styles.billActions}>
                      <TouchableOpacity onPress={() => handleStartEdit(bill)}>
                        <MaterialIcons name="edit" size={18} color="#fbbf24" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDeleteBill(bill.id)}>
                        <MaterialIcons name="delete" size={18} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* --- LISTA DE PARCELAS DE CARTÕES NO MÊS SELECIONADO --- */}
        {cardInstallments.length > 0 && (
          <View style={[styles.listContainer, { marginTop: 20 }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Parcelamentos em Cartão ({formattedMonth})
            </Text>

            {cardInstallments.map((inst, index) => {
              const paid = isBillPaid(inst.purchaseId);
              const late = isItemOverdue(inst.dueDay, paid);

              return (
                <View
                  key={`${inst.purchaseId}-${index}`}
                  style={[styles.billCard, { backgroundColor: theme.card }]}
                >
                  <TouchableOpacity
                    style={[styles.checkButton, paid && styles.checkButtonActive]}
                    onPress={() => handleTogglePayment(inst.purchaseId)}
                  >
                    {paid && <MaterialIcons name="check" size={18} color="#fff" />}
                  </TouchableOpacity>

                  <View style={styles.billInfo}>
                    <View style={styles.billTitleRow}>
                      <Text
                        style={[
                          styles.billTitle,
                          { color: theme.text },
                          paid && [styles.billPaidText, { color: theme.subtext }],
                        ]}
                      >
                        {inst.description}
                      </Text>
                      <View
                        style={{
                          backgroundColor: inst.cardColor,
                          paddingHorizontal: 7,
                          paddingVertical: 2,
                          borderRadius: 6,
                        }}
                      >
                        <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>
                          {inst.cardName}
                        </Text>
                      </View>
                    </View>

                    <Text
                      style={[
                        styles.billSubtext,
                        { color: theme.subtext },
                        late && { color: '#ef4444', fontWeight: 'bold' },
                      ]}
                    >
                      {paid
                        ? 'Liquidada neste mês'
                        : `Parcela ${inst.currentInstallment} de ${inst.totalInstallments} • Vence dia ${inst.dueDay}`}
                    </Text>
                  </View>

                  <View style={styles.billValueContainer}>
                    <Text
                      style={[
                        styles.billValue,
                        { color: theme.text },
                        paid && { color: theme.subtext, textDecorationLine: 'line-through' },
                        late && { color: '#ef4444' },
                      ]}
                    >
                      {renderValue(inst.value)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}