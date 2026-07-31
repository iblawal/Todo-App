import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '../../theme/ThemeContext';
import { styles } from './SelectionBar.styles';

interface Props {
  selectedCount: number;
  totalCount: number;
  onCancel: () => void;
  onSelectAll: () => void;
  onDeleteSelected: () => void;
}

export const SelectionBar: React.FC<Props> = ({
  selectedCount,
  totalCount,
  onCancel,
  onSelectAll,
  onDeleteSelected,
}) => {
  const { theme } = useAppTheme();
  const allSelected = totalCount > 0 && selectedCount === totalCount;

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <TouchableOpacity onPress={onCancel} accessibilityRole="button" accessibilityLabel="Cancel selection">
        <Text style={[styles.cancelText, { color: theme.textSecondary }]}>Cancel</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onSelectAll}
        accessibilityRole="button"
        accessibilityLabel={allSelected ? 'Deselect all' : 'Select all'}
      >
        <Text style={[styles.countText, { color: theme.textPrimary }]}>
          {allSelected ? 'Deselect All' : `${selectedCount} selected`}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onDeleteSelected}
        disabled={selectedCount === 0}
        accessibilityRole="button"
        accessibilityLabel="Delete selected tasks"
        style={[
          styles.deleteButton,
          { backgroundColor: theme.danger, opacity: selectedCount === 0 ? 0.5 : 1 },
        ]}
      >
        <Feather name="trash-2" size={15} color="#FFFFFF" />
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};