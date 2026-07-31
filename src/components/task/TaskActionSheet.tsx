import React from 'react';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '../../theme/ThemeContext';
import { Task } from '../../types/task';
import { styles } from './TaskActionSheet.styles';

interface Props {
  task: Task | null;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onToggleBookmark: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const TaskActionSheet: React.FC<Props> = ({
  task,
  onClose,
  onEdit,
  onToggleBookmark,
  onDelete,
}) => {
  const { theme } = useAppTheme();

  return (
    <Modal visible={!!task} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose} accessibilityLabel="Close menu">
        <Pressable
          style={[styles.sheet, { backgroundColor: theme.surface }]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={[styles.handle, { backgroundColor: theme.border }]} />
          {task && (
            <Text style={[styles.taskTitle, { color: theme.textSecondary }]} numberOfLines={1}>
              {task.title}
            </Text>
          )}

          <TouchableOpacity
            style={styles.row}
            onPress={() => task && onEdit(task)}
            accessibilityRole="button"
            accessibilityLabel="Edit task"
          >
            <View style={[styles.iconWrap, { backgroundColor: theme.chipBackground }]}>
              <Feather name="edit-3" size={16} color={theme.textPrimary} />
            </View>
            <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.row}
            onPress={() => task && onToggleBookmark(task)}
            accessibilityRole="button"
            accessibilityLabel={task?.bookmarked ? 'Remove bookmark' : 'Bookmark task'}
          >
            <View style={[styles.iconWrap, { backgroundColor: theme.chipBackground }]}>
              <Feather
                name="bookmark"
                size={16}
                color={task?.bookmarked ? theme.accentYellow : theme.textPrimary}
              />
            </View>
            <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>
              {task?.bookmarked ? 'Remove Bookmark' : 'Bookmark'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.row}
            onPress={() => task && onDelete(task)}
            accessibilityRole="button"
            accessibilityLabel="Delete task"
          >
            <View style={[styles.iconWrap, { backgroundColor: 'rgba(225,122,93,0.15)' }]}>
              <Feather name="trash-2" size={16} color={theme.danger} />
            </View>
            <Text style={[styles.rowLabel, { color: theme.danger }]}>Delete</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};