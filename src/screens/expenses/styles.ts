import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // --- CABEÇALHO ---
  header: {
    padding: 20,
    paddingTop: 15,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingBottom: 22,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  balanceValue: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  indicatorsRow: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
  },
  indicatorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  indicatorLabel: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 12,
  },
  indicatorVal: {
    fontSize: 13,
    fontWeight: 'bold',
  },

  // --- FORMULÁRIO ---
  formCard: {
    marginHorizontal: 16,
    marginTop: -12,
    borderRadius: 20,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  formTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  typeSelectorRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: 'rgba(150, 150, 150, 0.12)',
  },
  typeButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  inputsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  fieldMiniLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  categoryTrigger: {
    flex: 1.3,
    minHeight: 54,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
  },
  categoryTriggerText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  valueInputBox: {
    flex: 1.1,
    minHeight: 54,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    justifyContent: 'center',
    borderWidth: 1,
  },
  inputInner: {
    fontSize: 15,
    fontWeight: 'bold',
    padding: 0,
    margin: 0,
    height: Platform.OS === 'android' ? 28 : 24,
    textAlignVertical: 'center',
  },
  categoryDropdownContainer: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 8,
    marginBottom: 10,
  },
  categoryDropdownScroll: {
    gap: 6,
    paddingVertical: 2,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  input: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  btnAction: {
    height: 44,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  btnActionText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // --- BUSCA ---
  searchContainer: {
    paddingHorizontal: 16,
    marginTop: 14,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 42,
    borderRadius: 12,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    height: '100%',
  },

  // --- LISTAGEM ---
  scrollList: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 100,
  },
  listHeaderTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    borderRadius: 16,
    gap: 8,
    marginTop: 10,
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '500',
  },

  // --- CARDS DE TRANSAÇÃO ---
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  typeIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  txInfo: {
    flex: 1,
    marginRight: 10,
  },
  txDescription: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 3,
  },
  txMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryBadge: {
    backgroundColor: 'rgba(150, 150, 150, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
  },
  txDate: {
    fontSize: 11,
  },
  txValueCol: {
    alignItems: 'flex-end',
    gap: 4,
  },
  txValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  txActions: {
    flexDirection: 'row',
    gap: 10,
  },

  // --- MODAL DE GERENCIAMENTO ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    borderRadius: 22,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalIconBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  modalSubtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 3,
  },
  modalAddRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  modalAddBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCategoriesList: {
    maxHeight: 220,
    marginBottom: 14,
  },
  modalCatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  modalCatName: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  modalCatActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  orderBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseBtn: {
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});