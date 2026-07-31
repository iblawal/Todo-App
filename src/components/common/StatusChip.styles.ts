// StatusChip.styles.ts
import { StyleSheet } from 'react-native';
import { radii } from '../../theme/colors';

export const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radii.pill,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});