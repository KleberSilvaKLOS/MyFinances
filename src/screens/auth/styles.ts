import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    paddingBottom: 40,
    paddingTop: 20,
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logoBadge: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: '#3870d8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#3870d8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  appTagline: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  cardForm: {
    borderRadius: 24,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 14,
    paddingHorizontal: 14,
    gap: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  btnPrimary: {
    height: 50,
    borderRadius: 14,
    backgroundColor: '#3870d8',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  btnPrimaryText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  socialButtonsCol: {
    gap: 12,
  },
  socialButton: {
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
    gap: 12,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  footerNote: {
    marginTop: 28,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});