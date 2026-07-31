import React from 'react';
import { StyleSheet, View, ViewStyle, StatusBar } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';

interface ScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  edges?: Edge[];
  noPadding?: boolean;
  statusBarStyle?: 'light-content' | 'dark-content';
}

export function Screen({
  children,
  style,
  edges = ['top', 'bottom'],
  noPadding,
  statusBarStyle,
}: ScreenProps) {
  const { colors, isDark } = useTheme();

  return (
    <SafeAreaView
      edges={edges}
      style={[styles.container, { backgroundColor: colors.background }, style]}
    >
      <StatusBar barStyle={statusBarStyle ?? (isDark ? 'light-content' : 'dark-content')} />
      <View style={[styles.content, !noPadding && styles.padded]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: 20,
  },
});