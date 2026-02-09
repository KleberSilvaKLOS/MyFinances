import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TextInput, TouchableOpacity, Keyboard, Platform, StatusBar, Alert, Modal, TouchableWithoutFeedback, FlatList
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext'; 

interface Transaction {
  id: string;
  description: string; 
  detail?: string;     
  value: number;
  type: 'income' | 'expense';
  date: string;
  time: string;
}

const DEFAULT_SUGGESTIONS = [
  
];

export default function ExpensesScreen() {
  const { isDark } = useTheme(); 
  const [list, setList] = useState<Transaction[]>([]);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  
  // Totais
  const [balance, setBalance] = useState<number>(0);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  
  // Estados de controle e Inputs
  const [modalVisible, setModalVisible] = useState<boolean>(false); 
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  
  // --- CAMPOS DO FORMULÁRIO ---
  const [value, setValue] = useState<string>('');
  const [description, setDescription] = useState<string>(''); // CATEGORIA
  const [detail, setDetail] = useState<string>('');           // DESCRIÇÃO/DETALHE
  const [type, setType] = useState<'income' | 'expense'>('expense'); 
  
  // --- GERENCIAMENTO DE CATEGORIAS ---
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [editingCategoryIndex, setEditingCategoryIndex] = useState<number | null>(null);

  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const theme = {
    background: isDark ? '#0f172a' : '#fefefe',
    header: isDark ? '#1e293b' : '#3870d8',
    card: isDark ? '#1e293b' : '#ffffff',
    text: isDark ? '#f8fafc' : '#334155',
    subtext: isDark ? '#94a3b8' : '#64748b',
    input: isDark ? '#334155' : '#f1f5f9',
    border: isDark ? '#334155' : '#e2e8f0',
    itemCard: isDark ? '#1e293b' : '#3870d8',
    itemIconBg: isDark ? '#0f172a' : '#233860'
  };

  useFocusEffect(
    useCallback(() => {
      const loadSyncData = async () => {
        const saved = await AsyncStorage.getItem('@myfinance:visibility');
        if (saved !== null) setIsVisible(JSON.parse(saved));
        loadData();
        loadCategories();
      };
      loadSyncData();
    }, [])
  );

  const toggleVisibility = async () => {
    const newValue = !isVisible;
    setIsVisible(newValue);
    await AsyncStorage.setItem('@myfinance:visibility', JSON.stringify(newValue));
  };

  useEffect(() => {
    calculateTotals(list);
  }, [list]);

  const handleDescriptionChange = (text: string) => {
    setDescription(text);
    if (text.length > 0) {
      const allOptions = [...DEFAULT_SUGGESTIONS, ...customCategories];
      const filtered = allOptions.filter(item => 
        item.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredSuggestions([...new Set(filtered)]);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setDescription(suggestion);
    setShowSuggestions(false);
  };

  async function loadData() {
    try {
      const jsonValue = await AsyncStorage.getItem('@myfinance:transactions');
      if (jsonValue != null) setList(JSON.parse(jsonValue));
    } catch (e) { console.log(e); }
  }

  async function loadCategories() {
    try {
      const jsonValue = await AsyncStorage.getItem('@myfinance:categories');
      if (jsonValue != null) setCustomCategories(JSON.parse(jsonValue));
    } catch (e) { console.log(e); }
  }

  async function saveData(newList: Transaction[]) {
    try { await AsyncStorage.setItem('@myfinance:transactions', JSON.stringify(newList)); } catch (e) { console.log(e); }
  }

  async function saveCategories(newCategories: string[]) {
    try { await AsyncStorage.setItem('@myfinance:categories', JSON.stringify(newCategories)); } catch (e) { console.log(e); }
  }

  function calculateTotals(currentList: Transaction[]) {
    let total = 0, income = 0, expense = 0;
    currentList.forEach((item) => {
      const val = Number(item.value);
      if (item.type === 'income') { total += val; income += val; } 
      else { total -= val; expense += val; }
    });
    setBalance(total);
    setTotalIncome(income);
    setTotalExpense(expense);
  }

  // --- NOVA LÓGICA: SEGURAR CLIQUE PARA APAGAR ---
  function handleDeleteTransaction(id: string) {
    Alert.alert(
      "Excluir Lançamento",
      "Tem certeza que deseja apagar este item permanentemente?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Apagar", 
          style: "destructive", 
          onPress: () => {
            const newList = list.filter(item => item.id !== id);
            setList(newList);
            saveData(newList);
            // Se estava editando esse item, cancela a edição
            if (editingId === id) {
              setEditingId(null);
              setValue(''); setDescription(''); setDetail('');
            }
          }
        }
      ]
    );
  }

  // --- LÓGICA DE CATEGORIAS (ADICIONAR / EDITAR / EXCLUIR) ---
  function handleAddOrUpdateCategory() {
    if (newCategoryName.trim() === '') return Alert.alert('Erro', 'Digite o nome');
    
    let updatedCategories = [...customCategories];

    if (editingCategoryIndex !== null) {
      // EDITAR
      updatedCategories[editingCategoryIndex] = newCategoryName;
      setEditingCategoryIndex(null); // Sai do modo edição
      Alert.alert('Sucesso', 'Categoria atualizada!');
    } else {
      // ADICIONAR
      if (updatedCategories.includes(newCategoryName)) {
        return Alert.alert('Erro', 'Categoria já existe');
      }
      updatedCategories.push(newCategoryName);
      Alert.alert('Sucesso', 'Categoria adicionada!');
    }

    setCustomCategories(updatedCategories);
    saveCategories(updatedCategories);
    setNewCategoryName('');
  }

  function handleEditCategory(index: number) {
    setNewCategoryName(customCategories[index]);
    setEditingCategoryIndex(index);
  }

  function handleDeleteCategory(index: number) {
    Alert.alert(
      "Excluir Categoria", 
      `Deseja apagar a categoria "${customCategories[index]}"?`,
      [
        { text: "Não", style: 'cancel' },
        { text: "Sim", style: 'destructive', onPress: () => {
            const updated = customCategories.filter((_, i) => i !== index);
            setCustomCategories(updated);
            saveCategories(updated);
            // Se estava editando a que foi excluída, limpa o form
            if (editingCategoryIndex === index) {
              setEditingCategoryIndex(null);
              setNewCategoryName('');
            }
        }}
      ]
    );
  }

  function handleSaveTransaction() {
    if (value === '' || description.trim() === '') return Alert.alert('Atenção', 'Preencha valor e categoria');
    
    const numericValue = parseFloat(value.replace(',', '.'));
    let newList = [...list];
    
    if (editingId) {
      newList = newList.map(item => item.id === editingId ? { 
        ...item, 
        description, 
        detail,      
        value: numericValue, 
        type 
      } : item);
      setEditingId(null);
    } else {
      const newTransaction: Transaction = {
        id: String(new Date().getTime()),
        description, 
        detail,     
        value: numericValue, 
        type,
        date: new Date().toLocaleDateString('pt-BR'),
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      newList = [newTransaction, ...newList];
    }
    setList(newList);
    saveData(newList);
    
    setValue(''); 
    setDescription(''); 
    setDetail('');
    setShowSuggestions(false); 
    Keyboard.dismiss();
  }

  const formatCurrency = (val: number) => Number(val).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const renderValue = (val: number) => isVisible ? formatCurrency(val) : '••••••';

  const renderItem = ({ item }: { item: Transaction }) => (
    <TouchableOpacity 
      style={[styles.itemCard, { backgroundColor: theme.itemCard }, editingId === item.id && styles.itemCardEditing]} 
      onPress={() => { 
        setEditingId(item.id); 
        setDescription(item.description); 
        setDetail(item.detail || ''); 
        setValue(String(item.value)); 
        setType(item.type); 
      }}
      // LÓGICA DO CLIQUE LONGO AQUI
      onLongPress={() => handleDeleteTransaction(item.id)}
      delayLongPress={500} // Meio segundo segurando
    >
      <View style={[styles.itemIconContainer, { backgroundColor: theme.itemIconBg }]}>
        <MaterialIcons 
          name={item.type === 'income' ? 'arrow-upward' : 'arrow-downward'} 
          size={24} color={item.type === 'income' ? '#13ec6d' : '#ef4444'} 
        />
      </View>
      
      <View style={styles.itemInfo}>
        <Text style={[styles.itemTitle, { color: isDark ? theme.text : '#fff' }]}>{item.description}</Text>
        {item.detail ? (
           <Text style={[styles.itemDetail, { color: theme.subtext }]} numberOfLines={1}>{item.detail}</Text>
        ) : null}
        <Text style={styles.itemCategory}>{item.date} às {item.time}</Text>
      </View>
      <Text style={[styles.itemValue, { color: item.type === 'income' ? '#13ec6d' : '#ef4444' }]}>
        {item.type === 'income' ? '+ ' : '- '}{renderValue(item.value)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={{marginBottom:40 + (Platform.OS==='android'?StatusBar.currentHeight||0:0)}} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
      
        <StatusBar barStyle="light-content" backgroundColor={theme.header} />
        
        <View style={[styles.summaryContainer, { backgroundColor: theme.header }]}>
          <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.header} />
          <View style={styles.headerContent}>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.summaryLabel}>Saldo total</Text>
              <Text style={styles.summaryAmount}>{renderValue(balance)}</Text>
            </View>
            <View style={styles.headerRightActions}>
                <TouchableOpacity onPress={toggleVisibility} style={styles.btnEyeHeader}>
                  <Ionicons name={isVisible ? "eye" : "eye-off"} size={24} color="#ffffffcc" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnAddHeader} onPress={() => setModalVisible(true)}>
                  <MaterialIcons name="list" size={30} color={theme.header} />
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

        <View style={[styles.mainInputContainer, { backgroundColor: theme.card }]}>
          <View style={styles.quickTypeSelector}>
            <TouchableOpacity style={[styles.quickTypeBtn, type === 'income' ? styles.quickIncomeActive : {borderColor: theme.border, backgroundColor: theme.background}]} onPress={() => setType('income')}>
              <MaterialIcons name="arrow-upward" size={20} color={type === 'income' ? '#fff' : '#13ec6d'} />
              <Text style={[styles.quickTypeText, {color: type === 'income' ? '#fff' : '#13ec6d'}]}>Entrada</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.quickTypeBtn, type === 'expense' ? styles.quickExpenseActive : {borderColor: theme.border, backgroundColor: theme.background}]} onPress={() => setType('expense')}>
              <MaterialIcons name="arrow-downward" size={20} color={type === 'expense' ? '#fff' : '#ef4444'} />
              <Text style={[styles.quickTypeText, {color: type === 'expense' ? '#fff' : '#ef4444'}]}>Saída</Text>
            </TouchableOpacity>
          </View>
          
          <View style={[styles.valueInputWrapper, { borderBottomColor: theme.border }]}>
            <Text style={styles.currencyPrefix}>R$</Text>
            <TextInput style={[styles.mainValueInput, { color: theme.text }]} placeholder="0,00" placeholderTextColor={theme.subtext} keyboardType="numeric" value={value} onChangeText={setValue} />
          </View>

          <View style={styles.descInputWrapper}>
            <TextInput 
              style={[styles.descInput, { backgroundColor: theme.input, color: theme.text }]} 
              placeholder="Categoria (ex: Pix, Mercado)" 
              placeholderTextColor={theme.subtext} 
              value={description} 
              onChangeText={handleDescriptionChange} 
            />
          </View>

          <View style={[styles.descInputWrapper, { marginTop: 10 }]}>
            <TextInput 
              style={[styles.descInputCat, { backgroundColor: theme.input, color: theme.text }]} 
              placeholder="Descrição (ex: para fulano)" 
              placeholderTextColor={theme.subtext} 
              value={detail} 
              onChangeText={setDetail} 
            />
             <TouchableOpacity style={styles.confirmBtn} onPress={handleSaveTransaction}>
                <MaterialIcons name="check" size={24} color="#fff" />
             </TouchableOpacity>
          </View>

          {showSuggestions && (
            <View style={[styles.suggestionsBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
              {filteredSuggestions.map((item, index) => (
                <TouchableOpacity key={index} style={[styles.suggestionItem, { borderBottomColor: theme.border }]} onPress={() => selectSuggestion(item)}>
                  <Text style={{ color: theme.text }}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.listContainer}>
          <Text style={[styles.listTitle, { color: theme.subtext }]}>{editingId ? 'Editando item...' : 'Últimas atividades'}</Text>
          
          <View style={{ marginBottom: 40 + (Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0) }}>
            {list.length === 0 ? (
              <Text style={{ textAlign: 'center', marginTop: 20, color: theme.subtext }}>
                  Nenhuma atividade recente.
              </Text>
            ) : (
              list.map((item) => (
                <View key={item.id}>
                  {renderItem({ item })} 
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* --- MENU LATERAL (MODAL DE CATEGORIAS) --- */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}><View style={styles.modalBackdrop} /></TouchableWithoutFeedback>
          <View style={[styles.sideMenu, { backgroundColor: theme.card }]}>
            
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: '#3870d8' }]}>Gerenciar Categorias</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={theme.subtext} />
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.inputLabel, { color: '#3870d8' }]}>
              {editingCategoryIndex !== null ? 'Editar Categoria' : 'Nova Categoria'}
            </Text>
            
            <View style={styles.addCategoryRow}>
              <TextInput 
                style={[styles.modalInput, { backgroundColor: theme.input, color: theme.text }]} 
                placeholder="Nome..." 
                placeholderTextColor={theme.subtext} 
                value={newCategoryName} 
                onChangeText={setNewCategoryName} 
              />
              <TouchableOpacity 
                style={[styles.btnAddCategory, editingCategoryIndex !== null && { backgroundColor: '#fbbf24' }]} 
                onPress={handleAddOrUpdateCategory}
              >
                {/* Muda o ícone se estiver editando */}
                <MaterialIcons name={editingCategoryIndex !== null ? "check" : "add"} size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* LISTA DAS CATEGORIAS CRIADAS */}
            <Text style={[styles.inputLabel, { color: theme.subtext, marginTop: 10 }]}>Minhas Categorias:</Text>
            <View style={[styles.categoryListContainer, { borderColor: theme.border }]}>
              {customCategories.length === 0 ? (
                <Text style={{ color: theme.subtext, fontStyle: 'italic', padding: 10 }}>Nenhuma categoria criada.</Text>
              ) : (
                <ScrollView style={{ maxHeight: 300 }}>
                  {customCategories.map((cat, index) => (
                    <View key={index} style={[styles.categoryItem, { borderBottomColor: theme.border }]}>
                      <Text style={{ color: theme.text, flex: 1 }}>{cat}</Text>
                      <View style={{ flexDirection: 'row', gap: 15 }}>
                        <TouchableOpacity onPress={() => handleEditCategory(index)}>
                          <MaterialIcons name="edit" size={20} color="#fbbf24" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDeleteCategory(index)}>
                          <MaterialIcons name="delete-outline" size={20} color="#ef4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>

            <TouchableOpacity style={styles.btnDelete} onPress={() => { Alert.alert("Resetar", "Apagar TUDO (Lançamentos e Categorias)?", [{text: "Não"}, {text: "Sim", onPress: () => { setList([]); setCustomCategories([]); }}]) }}>
              <MaterialIcons name="delete-forever" size={24} color="#ef4444" /><Text style={{ color: '#ef4444', fontWeight: 'bold' }}>Resetar App</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // --- ESTRUTURA GLOBAL ---
  container: { 
    flex: 1, 
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
  },

  // --- CABEÇALHO E RESUMO (SUMMARY) ---
  summaryContainer: { 
    padding: 20, 
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30, 
    paddingBottom: 40, 
    elevation: 5 
  },
  headerContent: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'flex-start', 
    position: 'relative', 
    marginBottom: 15 
  },
  headerRightActions: { 
    position: 'absolute', 
    right: 0, 
    top: 0, 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12 
  },
  btnEyeHeader: { 
    padding: 5 
  },
  btnAddHeader: { 
    backgroundColor: '#fff', 
    width: 45, 
    height: 45, 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  summaryLabel: { 
    color: '#ffffffcc', 
    fontSize: 14, 
    textTransform: 'uppercase' 
  },
  summaryAmount: { 
    color: '#ffffff', 
    fontSize: 32, 
    fontWeight: 'bold' 
  },
  row: { 
    flexDirection: 'row', 
    gap: 15, 
    justifyContent: 'center' 
  },
  summaryMiniCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255, 255, 255, 0.15)', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 20, 
    gap: 5 
  },
  miniCardText: { 
    color: '#fff', 
    fontSize: 12, 
    fontWeight: '500' 
  },

  // --- ÁREA DE ENTRADA PRINCIPAL (MAIN INPUT) ---
  mainInputContainer: { 
    marginHorizontal: 20, 
    marginTop: -30, 
    borderRadius: 20, 
    padding: 20, 
    elevation: 8 ,
    zIndex: 100

  },
  quickTypeSelector: { 
    flexDirection: 'row', 
    marginBottom: 15, 
    gap: 10 
  },
  quickTypeBtn: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 8, 
    borderRadius: 10, 
    borderWidth: 1, 
    gap: 5 
  },
  quickIncomeActive: { 
    backgroundColor: '#13ec6d', 
    borderColor: '#13ec6d' 
  },
  quickExpenseActive: { 
    backgroundColor: '#ef4444', 
    borderColor: '#ef4444' 
  },
  quickTypeText: { 
    fontSize: 14, 
    fontWeight: 'bold' 
  },
  valueInputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderBottomWidth: 1, 
    paddingBottom: 5, 
    marginBottom: 15 
  },
  currencyPrefix: { 
    fontSize: 24, 
    color: '#94a3b8', 
    fontWeight: '600', 
    marginRight: 10
  },
  mainValueInput: { 
    flex: 1, 
    fontSize: 30, 
    fontWeight: 'bold' 
  },
  descInputWrapper: { 
    flexDirection: 'row', 
    gap: 10
  },
  descInput: { 
    flex: 1, 
    borderRadius: 10, 
    paddingHorizontal: 15, 
    height: 50, 
    fontSize: 16 
  },
  descInputCat: { 
    flex: 1, 
    borderRadius: 10, 
    paddingHorizontal: 15, 
    height: 50, 
    fontSize: 15
  },
  confirmBtn: { 
    width: 50, 
    height: 50, 
    backgroundColor: '#3870d8', 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },

  // --- AUTOCOMPLETE / SUGESTÕES ---
  suggestionsBox: { 
    position: 'absolute', 
    top: 202, // Ajustado para aparecer logo abaixo da categoria
    left: 20, 
    right: 20, 
    borderRadius: 8, 
    borderWidth: 1, 
    elevation: 5, 
    maxHeight: 1500, 
    zIndex: 100
  },
  suggestionItem: { 
    padding: 10, 
    borderBottomWidth: 1 
  },

  // --- LISTAGEM DE ITENS ---
  listContainer: { 
    
    flex: 1, 
    paddingHorizontal: 20, 
    paddingTop: 10,
    zIndex: 0
  },
  listTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 5 
  },
  itemCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 15, 
    borderRadius: 15, 
    marginBottom: 12 
  },
  itemCardEditing: { 
    borderWidth: 2, 
    borderColor: '#fbbf24' 
  },
  itemIconContainer: { 
    padding: 10, 
    borderRadius: 12 
  },
  itemInfo: { 
    flex: 1, 
    marginLeft: 15 
  },
  itemTitle: { 
    fontSize: 16, 
    fontWeight: '600' 
  },
  itemDetail: {
    fontSize: 12,
    marginBottom: 2
  },
  itemCategory: { 
    color: '#a5a5a7', 
    fontSize: 12 
  },
  itemValue: { 
    fontSize: 14, 
    fontWeight: 'bold' 
  },

  // --- MENU LATERAL / MODAL (SIDE MENU) ---
  modalOverlay: { 
    flex: 1, 
    flexDirection: 'row', 
    backgroundColor: 'rgba(0,0,0,0.5)' 
  },
  modalBackdrop: { 
    flex: 1 
  },
  sideMenu: { 
    width: '85%', 
    padding: 25, 
    borderTopLeftRadius: 20, 
    borderBottomLeftRadius: 20, 
    elevation: 10 
  },
  modalHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 30 
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  inputLabel: { 
    marginBottom: 5, 
    fontWeight: 'bold' 
  },
  addCategoryRow: { 
    flexDirection: 'row', 
    gap: 10, 
    marginBottom: 10 
  },
  modalInput: { 
    flex: 1, 
    padding: 15, 
    borderRadius: 10, 
    fontSize: 16 
  },
  btnAddCategory: { 
    width: 50, 
    backgroundColor: '#13ec6d', 
    borderRadius: 10, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  // ESTILOS DA LISTA DE CATEGORIAS
  categoryListContainer: {
    flex: 1,
    marginTop: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 10,
    padding: 5
  },
  categoryItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  btnDelete: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 8, 
    padding: 10, 
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9'
  }
});