// Folha de estilos isolada (StyleSheet)

import { StyleSheet, Dimensions } from 'react-native';

export const styles = StyleSheet.create({
  // --- ESTRUTURA GLOBAL ---
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  emptyText: {
    color: '#94a3b8',
    textAlign: 'center',
    marginVertical: 10,
  },

  // --- CABEÇALHO (HEADER) ---
  header: {
    padding: 20,
    paddingTop: 15,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  greeting: {
    color: '#ffffffaa',
    fontSize: 14,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelBalance: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  balanceValue: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 5,
  },

  // --- BOTÕES DE AÇÃO RÁPIDA (RECEITA / DESPESA) ---
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: -25,
    height: 55,
  },
  actionBtn: {
    flex: 0.48,
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    elevation: 4,
  },
  iconCircle: {
    width: 35,
    height: 35,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontWeight: 'bold',
    fontSize: 13,
  },

  // --- SEÇÕES E CARDS ---
  sectionContainer: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    elevation: 2,
  },
  cardDark: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },

  // --- GRÁFICO DONUT E LEGENDA ---
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutHole: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    left: 45,
  },
  donutText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: 'bold',
  },
  legendContainer: {
    flex: 1,
    marginLeft: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendText: {
    flex: 1,
    fontSize: 12,
  },
  legendValue: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  totalExpenseValue: {
    fontWeight: 'bold',
    fontSize: 16,
  },

  // --- CONTAS FIXAS E PENDÊNCIAS ---
  fixedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fixedLabel: {
    color: '#94a3b8',
    fontSize: 12,
  },
  fixedValue: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  fixedDivider: {
    height: 1,
    marginVertical: 15,
  },
  nextBillLabel: {
    color: '#ef4444',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  billItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  nextBillTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  nextBillValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextBillDateText: {
    color: '#94a3b8',
    fontSize: 11,
  },
  lateBadge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  lateBadgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },

  // --- MENU LATERAL (MODAL) ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  drawerContainer: {
    width: '75%',
    height: '100%',
    padding: 20,
    elevation: 10,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    borderBottomWidth: 1,
    paddingBottom: 15,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  drawerContent: {
    flex: 1,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    gap: 15,
  },
  drawerItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    paddingVertical: 20,
    borderTopWidth: 1,
    marginBottom: 10,
  },
  logoutBtnText: {
    fontSize: 16,
    color: '#ef4444',
    fontWeight: 'bold',
  },
});