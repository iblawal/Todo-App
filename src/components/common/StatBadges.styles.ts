import { StyleSheet } from 'react-native';
import { radii, spacing } from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: spacing.md,
  },

  header: {
    marginBottom: spacing.md,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
  },

  subtitle: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '500',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.sm,
    columnGap: spacing.sm,
  },

  cardWrapper: {
    width: '48%',
  },

  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: spacing.md,
    minHeight: 96,

    justifyContent: 'space-between',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },

  count: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: spacing.sm,
  },

  label: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },

  bookmarkChip: {
    marginTop: spacing.md,

    borderRadius: radii.full,

    paddingVertical: 12,
    paddingHorizontal: 16,

    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },

  bookmarkText: {
    marginLeft: 8,
    fontSize: 13,
    fontWeight: '600',
  },

  bookmarkCount: {
    marginLeft: 10,

    minWidth: 24,
    height: 24,

    borderRadius: 12,

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 6,
  },

  bookmarkCountText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },

  progressCard: {
    marginTop: spacing.md,

    borderRadius: 18,

    padding: spacing.md,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginBottom: spacing.sm,
  },

  progressTitle: {
    fontSize: 14,
    fontWeight: '700',
  },

  progressPercent: {
    fontSize: 16,
    fontWeight: '800',
  },

  progressTrack: {
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: 999,
  },

  progressText: {
    marginTop: spacing.sm,
    fontSize: 12,
    fontWeight: '500',
  },
});