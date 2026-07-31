import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { Task } from '../../types/task';
import { getCardColors } from '../../theme/colors';
import { formatDueDate, isOverdue } from '../../utils/date';
import { styles } from './TaskCard.styles';

interface Props {
  task: Task;
  index: number;
  onToggle: (id: string) => void;
  onMenuPress: (task: Task) => void;
  selectionMode?: boolean;
  selected?: boolean;
}

function darken(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0x00ff) - amount);
  const b = Math.max(0, (num & 0x0000ff) - amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

export const TaskCard: React.FC<Props> = ({
  task,
  index,
  onToggle,
  onMenuPress,
  selectionMode = false,
  selected = false,
}) => {
  const overdue = isOverdue(task.dueDate, task.completed);
  const card = getCardColors(index);
  const accentColor = darken(card.bg, 35);
  const checkScale = useSharedValue(1);

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const handleToggle = () => {
    if (selectionMode) return;
    checkScale.value = withSpring(0.8, { damping: 8, stiffness: 300 }, () => {
      checkScale.value = withSpring(1, { damping: 8, stiffness: 300 });
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle(task.id);
  };

  return (
    <Animated.View
      entering={FadeIn.duration(250)}
      exiting={FadeOut.duration(200)}
      layout={Layout.springify()}
      style={[
        styles.container,
        { backgroundColor: card.bg, opacity: task.completed ? 0.55 : 1 },
        selected && styles.selectedRing,
      ]}
    >
      <View style={[styles.accentBar, { backgroundColor: accentColor }]} />

      <View style={styles.inner}>
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: task.completed }}
          onPress={handleToggle}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Animated.View
            style={[
              styles.checkbox,
              checkAnimatedStyle,
              {
                borderColor: 'rgba(255,255,255,0.55)',
                backgroundColor: task.completed ? '#FFFFFF' : 'transparent',
              },
            ]}
          >
            {task.completed && <Feather name="check" size={16} color={card.bg} />}
          </Animated.View>
        </Pressable>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text
              style={[
                styles.title,
                {
                  color: card.text,
                  textDecorationLine: task.completed ? 'line-through' : 'none',
                },
              ]}
              numberOfLines={2}
            >
              {task.title}
            </Text>
            {task.bookmarked && <Feather name="bookmark" size={13} color={card.text} />}
          </View>

          {!!task.description && (
            <Text style={[styles.description, { color: card.text, opacity: 0.75 }]} numberOfLines={2}>
              {task.description}
            </Text>
          )}

          {!!task.dueDate && (
            <View style={styles.dateRow}>
              <Feather
                name="calendar"
                size={12}
                color={overdue ? '#FFD4CB' : card.text}
                style={{ opacity: overdue ? 1 : 0.7 }}
              />
              <Text
                style={[
                  styles.date,
                  { color: overdue ? '#FFD4CB' : card.text, opacity: overdue ? 1 : 0.7 },
                ]}
              >
                {formatDueDate(task.dueDate)}
              </Text>
            </View>
          )}
        </View>

        {selectionMode ? (
          <View style={styles.selectionIndicator}>
            <Feather
              name={selected ? 'check-circle' : 'circle'}
              size={22}
              color={selected ? '#FFFFFF' : 'rgba(255,255,255,0.6)'}
            />
          </View>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Options for ${task.title}`}
            style={styles.menuButton}
            onPress={() => onMenuPress(task)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather name="more-vertical" size={18} color={card.text} style={{ opacity: 0.85 }} />
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
};