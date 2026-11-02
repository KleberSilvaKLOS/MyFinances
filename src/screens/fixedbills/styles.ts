import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // --- ESTRUTURA GERAL ---
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 14,
  },

  // --- CABEÇALHO (HEADER) ---
  header: {
    padding: 20,
    paddingTop: 15,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingBottom: 35,
    elevation: 5,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLabel: {
    color: '#ffffffaa',
    fontSize: 13,
    textTransform: 'uppercase',
  },
  headerTotal: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 2,
  },

  // --- FORMULÁRIO DE ENTRADA RÁPIDA ---
  inputCard: {
    marginHorizontal: 20,
    marginTop: -25,
    borderRadius: 20,
    padding: 20,
    elevation: 6,
  },
  inputCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  inputsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  input: {
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 48,
    fontSize: 15,
  },
  btnSubmit: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#3870d8',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  btnSubmitText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },

  // --- LISTA DE CONTAS ---
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  billCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
  },
  billCardEditing: {
    borderWidth: 2,
    borderColor: '#fbbf24',
  },
  checkButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#94a3b8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkButtonActive: {
    backgroundColor: '#13ec6d',
    borderColor: '#13ec6d',
  },
  billInfo: {
    flex: 1,
  },
  billTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  billTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  billPaidText: {
    textDecorationLine: 'line-through',
  },
  badgeLate: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeLateText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  billSubtext: {
    fontSize: 12,
    marginTop: 2,
  },
  billValueContainer: {
    alignItems: 'flex-end',
    gap: 6,
  },
  billValue: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  billActions: {
    flexDirection: 'row',
    gap: 10,
  },
});