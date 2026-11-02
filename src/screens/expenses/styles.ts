import { StyleSheet, Platform, StatusBar } from 'react-native';

export const styles = StyleSheet.create({
  // --- ESTRUTURA GLOBAL ---
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // --- CABEÇALHO E RESUMO (SUMMARY) ---
  summaryContainer: {
    padding: 20,
    paddingTop: 15,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingBottom: 40,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    position: 'relative',
    marginBottom: 15,
  },
  headerRightActions: {
    position: 'absolute',
    right: 0,
    top: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  btnEyeHeader: {
    padding: 5,
  },
  btnAddHeader: {
    backgroundColor: '#fff',
    width: 45,
    height: 45,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryLabel: {
    color: '#ffffffcc',
    fontSize: 14,
    textTransform: 'uppercase',
  },
  summaryAmount: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    gap: 15,
    justifyContent: 'center',
  },
  summaryMiniCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 5,
  },
  miniCardText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },

  // --- ÁREA DE ENTRADA PRINCIPAL (MAIN INPUT) ---
  mainInputContainer: {
    marginHorizontal: 20,
    marginTop: -30,
    borderRadius: 20,
    padding: 20,
    elevation: 8,
    zIndex: 100,
  },
  quickTypeSelector: {
    flexDirection: 'row',
    marginBottom: 15,
    gap: 10,
  },
  quickTypeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    gap: 5,
  },
  quickIncomeActive: {
    backgroundColor: '#13ec6d',
    borderColor: '#13ec6d',
  },
  quickExpenseActive: {
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
  },
  quickTypeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  valueInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingBottom: 5,
    marginBottom: 15,
  },
  currencyPrefix: {
    fontSize: 24,
    color: '#94a3b8',
    fontWeight: '600',
    marginRight: 10,
  },
  mainValueInput: {
    flex: 1,
    fontSize: 30,
    fontWeight: 'bold',
  },
  descInputWrapper: {
    flexDirection: 'row',
    gap: 10,
  },
  descInput: {
    flex: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 16,
  },
  descInputCat: {
    flex: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 15,
  },
  confirmBtn: {
    width: 50,
    height: 50,
    backgroundColor: '#3870d8',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // --- AUTOCOMPLETE / SUGESTÕES ---
  suggestionsBox: {
    position: 'absolute',
    top: 202,
    left: 20,
    right: 20,
    borderRadius: 8,
    borderWidth: 1,
    elevation: 5,
    maxHeight: 200,
    zIndex: 100,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
  },

  // --- LISTAGEM DE ITENS ---
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    zIndex: 0,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
  },
  itemCardEditing: {
    borderWidth: 2,
    borderColor: '#fbbf24',
  },
  itemIconContainer: {
    padding: 10,
    borderRadius: 12,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 15,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemDetail: {
    fontSize: 12,
    marginBottom: 2,
  },
  itemCategory: {
    color: '#a5a5a7',
    fontSize: 12,
  },
  itemValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  // --- MENU LATERAL / MODAL (CATEGORIAS) ---
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalBackdrop: {
    flex: 1,
  },
  sideMenu: {
    width: '85%',
    padding: 25,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputLabel: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  addCategoryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  modalInput: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
  },
  btnAddCategory: {
    width: 50,
    backgroundColor: '#13ec6d',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryListContainer: {
    flex: 1,
    marginTop: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
  },
  categoryItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnDelete: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 10,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
});