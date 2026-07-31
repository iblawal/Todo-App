import { StyleSheet } from 'react-native';
import { radii, spacing } from '../../theme/colors';

const MAIN_SIZE = 60;
const MINI_SIZE = 46;

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: spacing.lg,
    alignSelf: 'center',
    alignItems: 'center',
  },
  main: {
    width: MAIN_SIZE,
    height: MAIN_SIZE,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 6,
  },
  miniWrap: {
    position: 'absolute',
    bottom: 6,
    alignItems: 'center',
    gap: 6,
  },
  mini: {
    width: MINI_SIZE,
    height: MINI_SIZE,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  miniLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
});