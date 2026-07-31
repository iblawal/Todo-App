import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '../../theme/ThemeContext';
import { styles } from './SectionHeader.styles';

interface Props {
  title: string;
  onSeeAllPress?: () => void;
  showSeeAll?: boolean;
  seeAllLabel?: string;
  showDeleteAll?: boolean;
  onDeleteAllPress?: () => void;
  sortActive?: boolean;
  onSortPress?: () => void;
}

export const SectionHeader: React.FC<Props> = ({
  title,
  onSeeAllPress,
  showSeeAll = false,
  seeAllLabel = 'See All',
  showDeleteAll = false,
  onDeleteAllPress,
  sortActive = false,
  onSortPress,
}) => {
  const { theme } = useAppTheme();

  return (
    <View style={styles.row}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>

      <View style={styles.actionsRow}>
        {onSortPress && (
          <TouchableOpacity
            onPress={onSortPress}
            accessibilityRole="button"
            accessibilityLabel={sortActive ? 'Sort by newest first' : 'Sort by due date'}
            style={styles.sortButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather
              name="calendar"
              size={15}
              color={sortActive ? theme.accentGreenDark : theme.textMuted}
            />
          </TouchableOpacity>
        )}

        {showDeleteAll && (
          <TouchableOpacity
            onPress={onDeleteAllPress}
            accessibilityRole="button"
            accessibilityLabel="Delete all tasks"
            style={styles.deleteAllButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather name="trash-2" size={15} color={theme.danger} />
          </TouchableOpacity>
        )}

        {showSeeAll && (
          <TouchableOpacity
            onPress={onSeeAllPress}
            accessibilityRole="button"
            accessibilityLabel={seeAllLabel}
          >
            <Text style={[styles.seeAll, { color: theme.accentGreenDark }]}>{seeAllLabel}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};