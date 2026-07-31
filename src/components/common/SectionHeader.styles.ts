import { StyleSheet } from 'react-native';
import { spacing } from '../../theme/colors';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  sortButton: {
    padding: 2,
  },
  deleteAllButton: {
    padding: 2,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '600',
  },
});