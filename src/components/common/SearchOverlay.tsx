import React, { useMemo, useState } from 'react';
import { FlatList, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '../../theme/ThemeContext';
import { Task } from '../../types/task';
import { formatDueDate } from '../../utils/date';
import { VoiceInputModal } from '../voice/VoiceInputModal';
import { styles } from './SearchOverlay.styles';

interface Props {
  visible: boolean;
  onClose: () => void;
  tasks: Task[];
  apiKey: string;
  onSelectTask: (task: Task) => void;
}

export const SearchOverlay: React.FC<Props> = ({ visible, onClose, tasks, apiKey, onSelectTask }) => {
  const { theme } = useAppTheme();
  const [query, setQuery] = useState('');
  const [voiceVisible, setVoiceVisible] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length === 0) return [];
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(q) || task.description?.toLowerCase().includes(q)
    );
  }, [tasks, query]);

  const handleClose = () => {
    setQuery('');
    onClose();
  };

  return (
    <>
      <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={styles.headerRow}>
            <View
              style={[
                styles.inputWrap,
                { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 },
              ]}
            >
              <Feather name="search" size={18} color={theme.textSecondary} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search your tasks..."
                placeholderTextColor={theme.textMuted}
                style={[styles.input, { color: theme.textPrimary }]}
                autoFocus
                returnKeyType="search"
              />
              {query.length > 0 && (
                <TouchableOpacity
                  onPress={() => setQuery('')}
                  accessibilityRole="button"
                  accessibilityLabel="Clear search"
                >
                  <Feather name="x-circle" size={18} color={theme.textMuted} />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => setVoiceVisible(true)}
                accessibilityRole="button"
                accessibilityLabel="Search by voice"
              >
                <Feather name="mic" size={18} color={theme.accentGreenDark} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleClose}
              accessibilityRole="button"
              accessibilityLabel="Cancel search"
              style={styles.cancelButton}
            >
              <Text style={[styles.cancelText, { color: theme.accentGreenDark }]}>Cancel</Text>
            </TouchableOpacity>
          </View>

          {query.trim().length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="search" size={32} color={theme.textMuted} />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                Start typing or tap the mic to search your tasks.
              </Text>
            </View>
          ) : results.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="frown" size={32} color={theme.textMuted} />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No tasks match "{query}".
              </Text>
            </View>
          ) : (
            <FlatList
              data={results}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    handleClose();
                    onSelectTask(item);
                  }}
                  style={[styles.resultRow, { borderBottomColor: theme.divider }]}
                  accessibilityRole="button"
                  accessibilityLabel={`Open ${item.title}`}
                >
                  <Feather
                    name={item.completed ? 'check-circle' : 'circle'}
                    size={18}
                    color={item.completed ? theme.accentGreenDark : theme.textMuted}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.resultTitle, { color: theme.textPrimary }]} numberOfLines={1}>
                      {item.title}
                    </Text>
                    {!!item.dueDate && (
                      <Text style={[styles.resultSubtitle, { color: theme.textSecondary }]}>
                        {formatDueDate(item.dueDate)}
                      </Text>
                    )}
                  </View>
                  <Feather name="chevron-right" size={16} color={theme.textMuted} />
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </Modal>

      <VoiceInputModal
        visible={voiceVisible}
        onClose={() => setVoiceVisible(false)}
        apiKey={apiKey}
        promptTitle="Say what you're looking for"
        promptSubtitle="Speak a task name or keyword."
        onComplete={(transcript) => setQuery(transcript.trim())}
      />
    </>
  );
};