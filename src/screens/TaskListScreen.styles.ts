import { StyleSheet } from 'react-native';
import { spacing } from '../theme/colors';

export const styles = StyleSheet.create({
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controls: {
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.lg,
  },
  chipRow: {
    paddingRight: spacing.lg,
    paddingBottom: 4,
  },
  listContent: {
    paddingTop: spacing.xs,
    paddingBottom: 140,
    flexGrow: 1,
  },
  themeToggle: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});