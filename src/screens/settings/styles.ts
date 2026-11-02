import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // --- CABEÇALHO SAMSUNG ONE UI ---
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -8,
  },
  headerLargeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 13,
    marginTop: 2,
  },

  // --- GRUPOS DE CONFIGURAÇÕES (CARDS ONE UI) ---
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginHorizontal: 24,
    marginBottom: 8,
    marginTop: 18,
  },
  groupCard: {
    marginHorizontal: 16,
    borderRadius: 22,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },

  // --- ITEM INDIVIDUAL ---
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  itemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  itemSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  itemRightAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemStatusText: {
    fontSize: 13,
    fontWeight: '500',
  },
});