import { StyleSheet } from 'react-native';
import { radii, spacing } from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: radii.lg,
    marginHorizontal: 20,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  accentBar: {
    width: 5,
    alignSelf: 'stretch',
  },
  inner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    flexShrink: 1,
  },
  description: {
    fontSize: 13,
    marginTop: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  date: {
    fontSize: 12,
    marginLeft: 4,
  },
  menuButton: {
    marginLeft: spacing.sm,
    marginTop: 2,
    padding: 4,
  },
  selectedRing: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  selectionIndicator: {
    marginLeft: 8,
    marginTop: 2,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});