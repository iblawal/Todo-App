import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '../../theme/ThemeContext';
import { styles } from './FAB.styles';

interface Props {
  onAddPress: () => void;
  onVoicePress: () => void;
}

export const FAB: React.FC<Props> = ({ onAddPress, onVoicePress }) => {
  const { theme } = useAppTheme();
  const [expanded, setExpanded] = useState(false);
  const progress = useSharedValue(0);
  const mainRotate = useSharedValue(0);

  const toggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const next = !expanded;
    setExpanded(next);
    progress.value = withTiming(next ? 1 : 0, { duration: 220 });
    mainRotate.value = withSpring(next ? 45 : 0, { damping: 10, stiffness: 200 });
  };

  const handleType = () => {
    toggle();
    onAddPress();
  };

  const handleVoice = () => {
    toggle();
    onVoicePress();
  };

  const mainAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${mainRotate.value}deg` }],
  }));

  const typeAnimatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { translateY: -progress.value * 76 },
      { scale: 0.6 + progress.value * 0.4 },
    ],
  }));

  const voiceAnimatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { translateY: -progress.value * 140 },
      { scale: 0.6 + progress.value * 0.4 },
    ],
  }));

  return (
    <View style={styles.container} pointerEvents="box-none">
      <Animated.View style={[styles.miniWrap, voiceAnimatedStyle]} pointerEvents={expanded ? 'auto' : 'none'}>
        <TouchableOpacity
          onPress={handleVoice}
          accessibilityRole="button"
          accessibilityLabel="Add task by voice"
          activeOpacity={0.85}
          style={[styles.mini, { backgroundColor: theme.accentTeal }]}
        >
          <Feather name="mic" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={[styles.miniLabel, { color: theme.textSecondary }]}>Speak it</Text>
      </Animated.View>

      <Animated.View style={[styles.miniWrap, typeAnimatedStyle]} pointerEvents={expanded ? 'auto' : 'none'}>
        <TouchableOpacity
          onPress={handleType}
          accessibilityRole="button"
          accessibilityLabel="Add task by typing"
          activeOpacity={0.85}
          style={[styles.mini, { backgroundColor: theme.accentYellow }]}
        >
          <Feather name="edit-3" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={[styles.miniLabel, { color: theme.textSecondary }]}>Type it</Text>
      </Animated.View>

      <TouchableOpacity
        onPress={toggle}
        accessibilityRole="button"
        accessibilityLabel={expanded ? 'Close add task menu' : 'Add new task'}
        activeOpacity={0.9}
        style={[styles.main, { backgroundColor: theme.accentGreenDark }]}
      >
        <Animated.View style={mainAnimatedStyle}>
          <Feather name="plus" size={28} color="#FFFFFF" />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};