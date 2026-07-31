import React from 'react';
import { FlatList, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '../../theme/ThemeContext';
import { Task } from '../../types/task';
import { formatDueDate } from '../../utils/date';
import { styles } from './BookmarksPanel.styles';

interface Props {
  visible: boolean;
  onClose: () => void;
  tasks: Task[];
  onSelectTask: (task: Task) => void;
}

export const BookmarksPanel: React.FC<Props> = ({ visible, onClose, tasks, onSelectTask }) => {
  const { theme } = useAppTheme();

  const bookmarked = tasks
    .filter((task) => !!task.bookmarked)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose} accessibilityLabel="Close bookmarks">
        <Pressable
          style={[styles.sheet, { backgroundColor: theme.surface }]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={[styles.handle, { backgroundColor: theme.border }]} />

          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>Bookmarks</Text>
            <TouchableOpacity onPress={onClose} accessibilityRole="button" accessibilityLabel="Close">
              <Feather name="x" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {bookmarked.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="bookmark" size={32} color={theme.textMuted} />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No bookmarks yet. Tap the ⋯ menu on any task to save it here.
              </Text>
            </View>
          ) : (
            <FlatList
              data={bookmarked}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => onSelectTask(item)}
                  style={[styles.row, { borderBottomColor: theme.divider }]}
                  accessibilityRole="button"
                  accessibilityLabel={`Open ${item.title}`}
                >
                  <View style={[styles.iconWrap, { backgroundColor: theme.chipBackground }]}>
                    <Feather name="bookmark" size={16} color={theme.accentYellow} />
                  </View>
                  <View style={styles.rowContent}>
                    <Text
                      style={[
                        styles.rowTitle,
                        {
                          color: theme.textPrimary,
                          textDecorationLine: item.completed ? 'line-through' : 'none',
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                    {!!item.dueDate && (
                      <Text style={[styles.rowSubtitle, { color: theme.textSecondary }]}>
                        {formatDueDate(item.dueDate)}
                      </Text>
                    )}
                  </View>
                  <Feather name="chevron-right" size={16} color={theme.textMuted} />
                </TouchableOpacity>
              )}
            />
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};