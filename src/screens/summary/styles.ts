import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110,
  },

  // --- CABEÇALHO ---
  header: {
    padding: 20,
    paddingTop: 15,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingBottom: 20,
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
    marginBottom: 16,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // --- SELETOR DE MÊS ---
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  monthNavBtn: {
    padding: 6,
  },
  monthText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },

  // --- CARDS PRINCIPAIS DE BALANÇO ---
  cardsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 20,
    marginTop: -12,
  },
  metricCard: {
    flex: 1,
    borderRadius: 18,
    padding: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  // --- CARD DE EFICIÊNCIA / POUPANÇA ---
  healthCard: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 20,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  healthTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  healthTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  healthBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  healthBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressBarBg: {
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(150, 150, 150, 0.15)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  healthSubtitle: {
    fontSize: 12,
    marginTop: 8,
  },

  // --- SEÇÃO CATEGORIAS ---
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 14,
  },
  categoryCard: {
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  categoryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoryValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  categoryBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(150, 150, 150, 0.15)',
    overflow: 'hidden',
  },
  categoryBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  categoryPercentText: {
    fontSize: 11,
    marginTop: 6,
    textAlign: 'right',
  },

  // --- VAZIO ---
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    borderRadius: 18,
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '500',
  },
});