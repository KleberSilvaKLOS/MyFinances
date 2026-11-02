import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  // --- ESTRUTURA GLOBAL ---
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 14,
  },

  // --- CABEÇALHO ---
  header: {
    padding: 20,
    paddingTop: 15,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingBottom: 25,
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
  headerActions: {
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

  // --- CARTÃO VISUAL ESTILIZADO ---
  cardPreviewWrapper: {
    paddingHorizontal: 20,
    marginTop: -20,
  },
  virtualCard: {
    borderRadius: 20,
    padding: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardDatesRow: {
    flexDirection: 'row',
    gap: 15,
  },
  cardDateText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  limitBarBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    marginVertical: 12,
    overflow: 'hidden',
  },
  limitBarFill: {
    height: '100%',
    backgroundColor: '#13ec6d',
    borderRadius: 4,
  },
  limitLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  limitLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    textTransform: 'uppercase',
  },
  limitAmount: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // --- SELETOR DE FATURA (MÊS) ---
  invoiceNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 10,
    elevation: 2,
  },
  invoiceTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  invoiceNavBtn: {
    padding: 4,
  },

  // --- FORMULÁRIO / MODAL ---
  formCard: {
    marginHorizontal: 20,
    marginTop: 15,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
    fontSize: 14,
    marginBottom: 10,
  },
  formRow: {
    flexDirection: 'row',
    gap: 10,
  },
  btnSubmit: {
    height: 46,
    borderRadius: 10,
    backgroundColor: '#3870d8',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  btnSubmitText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // --- LISTA DE COMPRAS NA FATURA ---
  sectionContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  purchaseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    elevation: 1,
  },
  purchaseInfo: {
    flex: 1,
  },
  purchaseDesc: {
    fontSize: 15,
    fontWeight: '600',
  },
  installmentBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(56, 112, 216, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  installmentText: {
    color: '#3870d8',
    fontSize: 11,
    fontWeight: 'bold',
  },
  purchaseValues: {
    alignItems: 'flex-end',
    gap: 4,
  },
  purchaseAmount: {
    fontSize: 15,
    fontWeight: 'bold',
  },

  // --- SELETOR DE CARTEIRA (HORIZONTAL) ---
  walletScroll: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 10,
  },
  walletCardTab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  walletCardTabText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  walletBadgeActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
});

