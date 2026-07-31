import React from 'react';
import { FlatList, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '../../theme/ThemeContext';
import { Task } from '../../types/task';
import { formatTimestamp, isOverdue } from '../../utils/date';
import { styles } from './NotificationsPanel.styles';

interface Props {
  visible: boolean;
  onClose: () => void;
  tasks: Task[];
  onSelectTask: (task: Task) => void;
}

export const NotificationsPanel: React.FC<Props> = ({ visible, onClose, tasks, onSelectTask }) => {
  const { theme } = useAppTheme();

  const remindersOnly = tasks
    .filter((task) => !!task.reminderAt && !task.completed)
    .sort((a, b) => new Date(a.reminderAt!).getTime() - new Date(b.reminderAt!).getTime());

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose} accessibilityLabel="Close notifications">
        <Pressable style={[styles.sheet, { backgroundColor: theme.surface }]} onPress={(e) => e.stopPropagation()}>
          <View style={[styles.handle, { backgroundColor: theme.border }]} />

          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>Reminders</Text>
            <TouchableOpacity onPress={onClose} accessibilityRole="button" accessibilityLabel="Close">
              <Feather name="x" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {remindersOnly.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="bell-off" size={32} color={theme.textMuted} />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No reminders set. Add a due date and reminder time to a task to see it here.
              </Text>
            </View>
          ) : (
            <FlatList
              data={remindersOnly}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const overdue = isOverdue(item.reminderAt, item.completed);
                return (
                  <TouchableOpacity
                    onPress={() => onSelectTask(item)}
                    style={[styles.row, { borderBottomColor: theme.divider }]}
                    accessibilityRole="button"
                    accessibilityLabel={`Reminder for ${item.title}`}
                  >
                    <View
                      style={[
                        styles.iconWrap,
                        { backgroundColor: overdue ? 'rgba(225,122,93,0.15)' : theme.chipBackground },
                      ]}
                    >
                      <Feather name="bell" size={16} color={overdue ? theme.danger : theme.accentGreenDark} />
                    </View>
                    <View style={styles.rowContent}>
                      <Text style={[styles.rowTitle, { color: theme.textPrimary }]} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text
                        style={[styles.rowSubtitle, { color: overdue ? theme.danger : theme.textSecondary }]}
                      >
                        {formatTimestamp(item.reminderAt!)}
                      </Text>
                    </View>
                    <Feather name="chevron-right" size={16} color={theme.textMuted} />
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};