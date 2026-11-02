import { StyleSheet } from 'react-native';

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
    marginVertical: 25,
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
    marginBottom: 15,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // --- SELETOR DE MÊS ---
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  monthNavBtn: {
    padding: 6,
  },
  monthTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },

  // --- CARDS DE RESUMO (ENTRADA / SAÍDA / LÍQUIDO) ---
  cardsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: -20,
    gap: 10,
  },
  balanceCard: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    elevation: 4,
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  cardValue: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
  },

  // --- SEÇÃO DE GRÁFICO ---
  sectionContainer: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  chartCard: {
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
  },

  // --- LISTA DE CATEGORIAS ---
  categoryCard: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    elevation: 1,
  },
  categoryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '600',
  },
  categoryValues: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  categoryPercent: {
    fontSize: 11,
    marginTop: 2,
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});