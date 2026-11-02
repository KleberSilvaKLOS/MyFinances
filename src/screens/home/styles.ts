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

  // --- CABEÇALHO ---
  header: {
    padding: 20,
    paddingTop: 15,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingBottom: 25,
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
    marginBottom: 15,
  },
  greetingText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerActions: {
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
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  indicatorsRow: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 10,
    paddingTop: 12,
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

  // --- CARD COMPROMISSOS DO MÊS ---
  summaryBox: {
    marginHorizontal: 20,
    marginTop: -15,
    borderRadius: 18,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  summaryBoxTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryBoxTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  summaryBoxTotal: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  summarySplitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.15)',
  },
  summarySplitItem: {
    flex: 1,
    alignItems: 'center',
  },
  splitLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  splitValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  splitDivider: {
    width: 1,
    height: 28,
  },

  // --- CARD PRETO PREMIUM (CONTAS PENDENTES) ---
  blackSectionContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  blackCardWrapper: {
    backgroundColor: '#0f172a', // Preto / Dark Slate profundo
    borderRadius: 20,
    padding: 18,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  blackCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  blackDotIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fbbf24', // Dourado / Amarelo de atenção
  },
  blackCardTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  blackCardLink: {
    color: '#60a5fa',
    fontSize: 12,
    fontWeight: '600',
  },
  blackEmptyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  blackEmptyText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '500',
  },
  blackItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  blackItemLeft: {
    flex: 1,
    marginRight: 10,
  },
  blackItemTitle: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  blackItemSub: {
    color: '#94a3b8',
    fontSize: 11,
  },
  blackItemValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // --- SEÇÃO PARCELAMENTOS ---
  sectionContainer: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 13,
    color: '#3870d8',
    fontWeight: '600',
  },
  emptyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 18,
    borderRadius: 14,
  },
  emptyCardText: {
    fontSize: 13,
    fontWeight: '500',
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  itemInfo: {
    flex: 1,
    marginRight: 10,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 3,
  },
  itemSubtext: {
    fontSize: 12,
  },
  itemValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});