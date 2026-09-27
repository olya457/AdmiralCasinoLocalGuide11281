import { Platform, StyleSheet } from 'react-native';
export const colors = {
  background: '#061710',
  navy: '#0b281c',
  blue: '#123d2b',
  border: '#28513d',
  gold: '#ffda19',
  muted: '#98a9c0',
  text: '#f4f6fc',
  teal: '#007c80',
};
export const serif = Platform.select({ ios: 'Georgia', android: 'serif' });
export const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: { fontFamily: serif, color: colors.text, fontSize: 27 },
  subtitle: { fontFamily: serif, color: colors.text, fontSize: 21 },
  text: { color: colors.text, fontSize: 14, lineHeight: 23 },
  muted: { color: colors.muted, fontSize: 13, lineHeight: 22 },
  label: {
    color: colors.muted,
    fontSize: 10,
    letterSpacing: 2,
    lineHeight: 18,
  },
  card: {
    backgroundColor: colors.navy,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    color: colors.text,
    backgroundColor: colors.background,
    paddingHorizontal: 14,
    paddingVertical: 13,
    minHeight: 48,
  },
  image: { width: '100%', height: 200, borderRadius: 6 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 6 },
});
