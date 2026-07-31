import React from 'react';
import { Text, View } from 'react-native';
import { useAppTheme } from '../../theme/ThemeContext';
import { styles } from './EmptyState.styles';

interface Props {
  title: string;
  subtitle: string;
}

export const EmptyState: React.FC<Props> = ({ title, subtitle }) => {
  const { theme } = useAppTheme();
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🌿</Text>
      <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
    </View>
  );
};