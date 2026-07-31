import React, { useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../components/ui/Screen';
import { Header } from '../components/ui/Header';
import { useTasks } from '../context/TaskContext';
import { useAppTheme } from '../theme/ThemeContext';
import { RootStackParamList } from '../navigation/RootNavigator';
import { formatDueDate } from '../utils/date';
import { gradients } from '../theme/colors';
import { styles } from './AddTaskScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'AddTask'>;

function formatTime(date: Date): string {
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

export function AddTaskScreen({ navigation, route }: Props) {
  const { addTask, updateTask, deleteTask, getTaskById } = useTasks();
  const { theme } = useAppTheme();

  const taskId = route.params?.taskId;
  const taskToEdit = taskId ? getTaskById(taskId) : undefined;
  const isEditing = !!taskToEdit;

  const [title, setTitle] = useState(taskToEdit?.title ?? '');
  const [description, setDescription] = useState(taskToEdit?.description ?? '');
  const [dueDate, setDueDate] = useState<Date | undefined>(
    taskToEdit?.dueDate ? new Date(taskToEdit.dueDate) : undefined
  );
  const [reminderTime, setReminderTime] = useState<Date | undefined>(
    taskToEdit?.reminderAt ? new Date(taskToEdit.reminderAt) : undefined
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [titleError, setTitleError] = useState<string | undefined>();

  const handleDateChange = (event: DateTimePickerEvent, selected?: Date) => {
    setShowDatePicker(false);
    if (event.type === 'set' && selected) {
      setDueDate(selected);
      if (!reminderTime) {
        const defaultReminder = new Date(selected);
        defaultReminder.setHours(9, 0, 0, 0);
        setReminderTime(defaultReminder);
      }
    }
  };

  const handleTimeChange = (event: DateTimePickerEvent, selected?: Date) => {
    setShowTimePicker(false);
    if (event.type === 'set' && selected) {
      setReminderTime(selected);
    }
  };

  const handleClearDueDate = () => {
    setDueDate(undefined);
    setReminderTime(undefined);
  };

  const buildReminderAt = (): string | undefined => {
    if (!dueDate || !reminderTime) return undefined;
    const combined = new Date(dueDate);
    combined.setHours(reminderTime.getHours(), reminderTime.getMinutes(), 0, 0);
    return combined.toISOString();
  };

  const handleSave = () => {
    Keyboard.dismiss();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setTitleError('Give your task a title.');
      return;
    }

    const draft = {
      title: trimmedTitle,
      description: description.trim() || undefined,
      dueDate: dueDate?.toISOString(),
      reminderAt: buildReminderAt(),
    };

    if (isEditing && taskToEdit) {
      updateTask(taskToEdit.id, draft);
    } else {
      addTask(draft);
    }

    navigation.goBack();
  };

  const handleDelete = () => {
    if (!taskToEdit) return;
    Alert.alert('Delete task', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteTask(taskToEdit.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <Screen edges={['top', 'bottom']} noPadding>
      <Header
        title={isEditing ? 'Edit Task' : 'New Task'}
        variant="plain"
        onBack={() => navigation.goBack()}
        rightIcon={isEditing ? 'trash-2' : undefined}
        onRightPress={isEditing ? handleDelete : undefined}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Title</Text>
              <View style={[styles.inputCard, { backgroundColor: theme.chipBackground }]}>
                <Feather name="edit-3" size={16} color={theme.textSecondary} style={styles.inputIcon} />
                <TextInput
                  value={title}
                  onChangeText={(text) => {
                    setTitle(text);
                    if (titleError) setTitleError(undefined);
                  }}
                  placeholder="e.g. Buy groceries"
                  placeholderTextColor={theme.textMuted}
                  autoFocus={!isEditing}
                  returnKeyType="next"
                  style={[styles.plainInput, { color: theme.textPrimary }]}
                />
              </View>
              {titleError ? (
                <Text style={[styles.errorText, { color: theme.danger }]}>{titleError}</Text>
              ) : null}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Description (optional)</Text>
              <View
                style={[
                  styles.inputCard,
                  styles.inputCardMultiline,
                  { backgroundColor: theme.chipBackground },
                ]}
              >
                <Feather
                  name="align-left"
                  size={16}
                  color={theme.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Add more detail..."
                  placeholderTextColor={theme.textMuted}
                  multiline
                  numberOfLines={4}
                  style={[
                    styles.plainInput,
                    { color: theme.textPrimary, minHeight: 88, textAlignVertical: 'top' },
                  ]}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Due date</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                accessibilityRole="button"
                accessibilityLabel={
                  dueDate ? `Due date: ${formatDueDate(dueDate.toISOString())}` : 'Set due date'
                }
                style={[styles.dateRow, { backgroundColor: theme.chipBackground }]}
              >
                <View style={styles.dateLabelWrap}>
                  <Feather name="calendar" size={18} color={theme.accentGreenDark} />
                  <Text style={[styles.dateLabel, { color: theme.textPrimary }]}>
                    {dueDate ? formatDueDate(dueDate.toISOString()) : 'Set a due date'}
                  </Text>
                </View>

                {dueDate ? (
                  <TouchableOpacity
                    onPress={handleClearDueDate}
                    accessibilityRole="button"
                    accessibilityLabel="Clear due date"
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Feather name="x-circle" size={18} color={theme.textMuted} />
                  </TouchableOpacity>
                ) : (
                  <Feather name="chevron-right" size={18} color={theme.textMuted} />
                )}
              </TouchableOpacity>

              {showDatePicker ? (
                <DateTimePicker
                  value={dueDate ?? new Date()}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                />
              ) : null}
            </View>

            {dueDate && (
              <View style={styles.fieldGroup}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>Remind me at</Text>
                <TouchableOpacity
                  onPress={() => setShowTimePicker(true)}
                  accessibilityRole="button"
                  accessibilityLabel={
                    reminderTime ? `Reminder time: ${formatTime(reminderTime)}` : 'Set reminder time'
                  }
                  style={[styles.dateRow, { backgroundColor: theme.chipBackground }]}
                >
                  <View style={styles.dateLabelWrap}>
                    <Feather name="bell" size={18} color={theme.accentGreenDark} />
                    <Text style={[styles.dateLabel, { color: theme.textPrimary }]}>
                      {reminderTime ? formatTime(reminderTime) : 'Set a reminder time'}
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={18} color={theme.textMuted} />
                </TouchableOpacity>

                {showTimePicker ? (
                  <DateTimePicker
                    value={reminderTime ?? new Date()}
                    mode="time"
                    display="default"
                    onChange={handleTimeChange}
                  />
                ) : null}
              </View>
            )}
          </ScrollView>
        </TouchableWithoutFeedback>

        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleSave}
            activeOpacity={0.9}
            accessibilityRole="button"
            accessibilityLabel={isEditing ? 'Save changes' : 'Add task'}
          >
            <LinearGradient
              colors={gradients.cta}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonText}>{isEditing ? 'Save Changes' : 'Add Task'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}