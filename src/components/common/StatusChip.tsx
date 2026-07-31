// StatusChip.tsx
import React from 'react';
import { Text, View } from 'react-native';
import { useAppTheme } from '../../theme/ThemeContext';
import { styles } from './StatusChip.styles';

interface Props {
  label: string;
  tone: 'green' | 'yellow' | 'pink' | 'teal';
}

export const StatusChip: React.FC<Props> = ({ label, tone }) => {
  const { theme } = useAppTheme();
  const toneColor = {
    green: theme.accentGreen,
    yellow: theme.accentYellow,
    pink: theme.accentPink,
    teal: theme.accentTeal,
  }[tone];

  return (
    <View style={[styles.chip, { backgroundColor: toneColor }]}>
      <Text style={[styles.label, { color: theme.mode === 'light' ? '#1B2420' : '#0F1512' }]}>{label}</Text>
    </View>
  );
};