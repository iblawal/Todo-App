import React, { useEffect, useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { useAppTheme } from '../../theme/ThemeContext';
import { FilterOption } from '../../types/task';
import { styles } from './StatBadges.styles';

interface Props {
  total: number;
  completed: number;
  inProgress: number;
  bookmarked: number;
  overdue: number;
  activeFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
}

type DashboardFilter = 'all' | 'completed' | 'inProgress' | 'overdue';

const CARDS: {
  key: DashboardFilter;
  label: string;
  icon: keyof typeof Feather.glyphMap;
  colorKey: 'accentGreen' | 'accentYellow' | 'accentTeal' | 'accentPink';
}[] = [
  {
    key: 'all',
    label: 'Total',
    icon: 'clipboard',
    colorKey: 'accentTeal',
  },
  {
    key: 'completed',
    label: 'Completed',
    icon: 'check-circle',
    colorKey: 'accentGreen',
  },
  {
    key: 'inProgress',
    label: 'Active',
    icon: 'clock',
    colorKey: 'accentYellow',
  },
  {
    key: 'overdue',
    label: 'Overdue',
    icon: 'alert-triangle',
    colorKey: 'accentPink',
  },
];

interface CardProps {
  card: (typeof CARDS)[number];
  count: number;
  active: boolean;
  color: string;
  onPress: () => void;
}

const StatCard = ({
  card,
  count,
  active,
  color,
  onPress,
}: CardProps) => {
  const { theme } = useAppTheme();

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.cardWrapper, animatedStyle]}>
      <Pressable
        style={[
          styles.card,
          {
            backgroundColor: theme.surface,
            borderColor: active ? color : theme.border,
          },
        ]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        onPressIn={() => {
          scale.value = withSpring(0.97);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
      >
        <View
          style={[
            styles.iconCircle,
            {
              backgroundColor: `${color}20`,
            },
          ]}
        >
          <Feather
            name={card.icon}
            size={16}
            color={color}
          />
        </View>

        <Text
          style={[
            styles.count,
            {
              color: theme.textPrimary,
            },
          ]}
        >
          {count}
        </Text>

        <Text
          style={[
            styles.label,
            {
              color: theme.textSecondary,
            },
          ]}
        >
          {card.label}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

export const StatBadges: React.FC<Props> = ({
  total,
  completed,
  inProgress,
  bookmarked,
  overdue,
  activeFilter,
  onFilterChange,
}) => {
  const { theme } = useAppTheme();

 const counts = useMemo(
  () => ({
    all: total,
    completed,
    inProgress,
    bookmarked,
    overdue,
  }),
  [total, completed, inProgress, bookmarked, overdue]
);

  const percent =
    total > 0
      ? Math.round((completed / total) * 100)
      : 0;

  const progress = useSharedValue(percent);

  useEffect(() => {
    progress.value = withTiming(percent, {
      duration: 500,
    });
  }, [percent]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  const handleFilter = (filter: FilterOption) => {
    onFilterChange(
      activeFilter === filter && filter !== 'all'
        ? 'all'
        : filter
    );
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            {
              color: theme.textPrimary,
            },
          ]}
        >
          Task Overview
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              color: theme.textSecondary,
            },
          ]}
        >
          {total} Tasks
        </Text>
      </View>

      <View style={styles.grid}>
        {CARDS.map((card) => (
          <StatCard
            key={card.key}
            card={card}
            count={counts[card.key]}
            active={activeFilter === card.key}
            color={theme[card.colorKey]}
            onPress={() => handleFilter(card.key)}
          />
        ))}
      </View>

      <Pressable
        style={[
          styles.bookmarkChip,
          {
            backgroundColor: theme.chipBackground,
          },
        ]}
        onPress={() => handleFilter('bookmarked')}
      >
        <Feather
          name="bookmark"
          size={14}
          color={theme.accentPink}
        />

        <Text
          style={[
            styles.bookmarkText,
            {
              color: theme.textPrimary,
            },
          ]}
        >
          Bookmarked
        </Text>

        <View
          style={[
            styles.bookmarkCount,
            {
              backgroundColor: theme.accentPink,
            },
          ]}
        >
          <Text style={styles.bookmarkCountText}>
            {bookmarked}
          </Text>
        </View>
      </Pressable>

      <View
        style={[
          styles.progressCard,
          {
            backgroundColor: theme.surface,
          },
        ]}
      >
        <View style={styles.progressHeader}>
          <Text
            style={[
              styles.progressTitle,
              {
                color: theme.textPrimary,
              },
            ]}
          >
            Today's Progress
          </Text>

          <Text
            style={[
              styles.progressPercent,
              {
                color: theme.accentGreenDark,
              },
            ]}
          >
            {percent}%
          </Text>
        </View>

        <View
          style={[
            styles.progressTrack,
            {
              backgroundColor: theme.chipBackground,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.progressFill,
              fillStyle,
              {
                backgroundColor:
                  theme.accentGreenDark,
              },
            ]}
          />
        </View>

        <Text
          style={[
            styles.progressText,
            {
              color: theme.textSecondary,
            },
          ]}
        >
          {completed} of {total} tasks completed
        </Text>
      </View>
    </View>
  );
};