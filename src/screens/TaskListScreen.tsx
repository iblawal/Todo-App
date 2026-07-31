import React, { useMemo, useState } from 'react';
import { Alert, FlatList, TouchableOpacity, View } from 'react-native';
import Constants from 'expo-constants';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../components/ui/Screen';
import { Header } from '../components/ui/Header';
import { SectionHeader } from '../components/common/SectionHeader';
import { EmptyState } from '../components/common/EmptyState';
import { TaskCard } from '../components/task/TaskCard';
import { TaskActionSheet } from '../components/task/TaskActionSheet';
import { StatBadges } from '../components/common/StatBadges';
import { FAB } from '../components/voice/FAB';
import { SelectionBar } from '../components/common/SelectionBar';
import { VoiceInputModal } from '../components/voice/VoiceInputModal';
import { ProfileDrawer } from '../components/common/ProfileDrawer';
import { NotificationsPanel } from '../components/common/NotificationsPanel';
import { BookmarksPanel } from '../components/common/BookmarksPanel';
import { SearchOverlay } from '../components/common/SearchOverlay';
import { useTasks } from '../context/TaskContext';
import { useProfile } from '../context/ProfileContext';
import { parseTasksFromTranscript } from '../services/taskParser';
import { isOverdue } from '../utils/date';
import { Task, FilterOption, SortOption } from '../types/task';
import { RootStackParamList } from '../navigation/RootNavigator';
import { styles } from './TaskListScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskList'>;

const ASSEMBLYAI_API_KEY = (Constants.expoConfig?.extra?.assemblyAiApiKey as string) ?? '';
const COLLAPSED_LIMIT = 3;

export function TaskListScreen({ navigation }: Props) {
  const { tasks, toggleTask, toggleBookmark, deleteTask, deleteTasks, deleteAllTasks, addTasksFromTitles } =
    useTasks();
  const { name, avatarUri } = useProfile();

  const [filter, setFilter] = useState<FilterOption>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [voiceModalVisible, setVoiceModalVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [notificationsPanelVisible, setNotificationsPanelVisible] = useState(false);
  const [bookmarksPanelVisible, setBookmarksPanelVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [menuTask, setMenuTask] = useState<Task | null>(null);

  const filteredTasks = useMemo(() => {
    const result = tasks.filter((task) => {
      switch (filter) {
        case 'completed':
          return task.completed;
        case 'inProgress':
          return !task.completed && !isOverdue(task.dueDate, task.completed);
        case 'overdue':
          return !task.completed && isOverdue(task.dueDate, task.completed);
        case 'bookmarked':
          return !!task.bookmarked;
        default:
          return true;
      }
    });

    if (sortOption === 'dueDate') {
      return [...result].sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    }

    return [...result].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [tasks, filter, sortOption]);

  const visibleTasks = showAll ? filteredTasks : filteredTasks.slice(0, COLLAPSED_LIMIT);

  const counts = useMemo(
    () => ({
      all: tasks.length,
      completed: tasks.filter((t) => t.completed).length,
      inProgress: tasks.filter((t) => !t.completed && !isOverdue(t.dueDate, t.completed)).length,
      bookmarked: tasks.filter((t) => !!t.bookmarked).length,
      overdue: tasks.filter((t) => !t.completed && isOverdue(t.dueDate, t.completed)).length,
    }),
    [tasks]
  );

  const upcomingReminderCount = useMemo(
    () => tasks.filter((t) => !!t.reminderAt && !t.completed).length,
    [tasks]
  );

  const handleTaskPress = (task: Task) => {
    if (selectionMode) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(task.id)) {
          next.delete(task.id);
        } else {
          next.add(task.id);
        }
        if (next.size === 0) setSelectionMode(false);
        return next;
      });
      return;
    }
    navigation.navigate('AddTask', { taskId: task.id });
  };

  const handleTaskLongPress = (task: Task) => {
    if (selectionMode) return;
    setSelectionMode(true);
    setSelectedIds(new Set([task.id]));
  };

  const handleSelectAll = () => {
    const allSelected = selectedIds.size === visibleTasks.length && visibleTasks.length > 0;
    if (allSelected) {
      setSelectedIds(new Set());
      setSelectionMode(false);
    } else {
      setSelectedIds(new Set(visibleTasks.map((t) => t.id)));
    }
  };

  const handleDeleteSelected = () => {
    const count = selectedIds.size;
    Alert.alert(
      'Delete selected tasks',
      `Delete ${count} task${count === 1 ? '' : 's'}? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteTasks(Array.from(selectedIds));
            setSelectedIds(new Set());
            setSelectionMode(false);
          },
        },
      ]
    );
  };

  const handleCancelSelection = () => {
    setSelectionMode(false);
    setSelectedIds(new Set());
  };

  const handleDeleteAll = () => {
    if (tasks.length === 0) return;
    Alert.alert('Delete all tasks', 'This will remove every task and cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete All',
        style: 'destructive',
        onPress: () => {
          deleteAllTasks();
          setSelectionMode(false);
          setSelectedIds(new Set());
        },
      },
    ]);
  };

  const handleMenuDelete = (task: Task) => {
    setMenuTask(null);
    Alert.alert('Delete task', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteTask(task.id) },
    ]);
  };

  const renderItem = ({ item, index }: { item: Task; index: number }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => handleTaskPress(item)}
      onLongPress={() => handleTaskLongPress(item)}
      delayLongPress={350}
    >
      <TaskCard
        task={item}
        index={index}
        onToggle={toggleTask}
        onMenuPress={setMenuTask}
        selectionMode={selectionMode}
        selected={selectedIds.has(item.id)}
      />
    </TouchableOpacity>
  );

  const listHeader = (
    <View>
      <View style={{ paddingHorizontal: 20, marginTop: 20, marginBottom: 12 }}>
        <StatBadges
          total={counts.all}
          completed={counts.completed}
          inProgress={counts.inProgress}
          bookmarked={counts.bookmarked}
          overdue={counts.overdue}
          activeFilter={filter}
          onFilterChange={setFilter}
        />
      </View>

      <SectionHeader
        title="Today Tasks"
        showSeeAll={filteredTasks.length > COLLAPSED_LIMIT}
        seeAllLabel={showAll ? 'Show Less' : 'See All'}
        onSeeAllPress={() => setShowAll((prev) => !prev)}
        showDeleteAll={tasks.length > 0}
        onDeleteAllPress={handleDeleteAll}
        sortActive={sortOption === 'dueDate'}
        onSortPress={() => setSortOption((prev) => (prev === 'dueDate' ? 'newest' : 'dueDate'))}
      />
    </View>
  );

  return (
    <Screen noPadding edges={['bottom']} statusBarStyle="light-content">
      <Header
        greeting
        subtitle="Manage your daily task"
        userName={name}
        avatarUri={avatarUri}
        onAvatarPress={() => setDrawerVisible(true)}
        showSearchButton
        onSearchPress={() => setSearchVisible(true)}
        showBookmarkButton
        bookmarkCount={counts.bookmarked}
        onBookmarkPress={() => setBookmarksPanelVisible(true)}
        showNotificationBell
        notificationCount={upcomingReminderCount}
        onNotificationPress={() => setNotificationsPanelVisible(true)}
      />

      <FlatList
        data={visibleTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            title={filter !== 'all' ? 'No matching tasks' : 'No tasks yet'}
            subtitle={
              filter !== 'all'
                ? 'Try a different filter.'
                : 'Tap the + button to add your first task, or use your voice.'
            }
          />
        }
      />

      {selectionMode ? (
        <SelectionBar
          selectedCount={selectedIds.size}
          totalCount={visibleTasks.length}
          onCancel={handleCancelSelection}
          onSelectAll={handleSelectAll}
          onDeleteSelected={handleDeleteSelected}
        />
      ) : (
        <FAB
          onAddPress={() => navigation.navigate('AddTask')}
          onVoicePress={() => setVoiceModalVisible(true)}
        />
      )}

      <VoiceInputModal
        visible={voiceModalVisible}
        onClose={() => setVoiceModalVisible(false)}
        apiKey={ASSEMBLYAI_API_KEY}
        promptTitle="I'm listening..."
        promptSubtitle="Say one or more tasks, then tap done."
        onComplete={(transcript) => addTasksFromTitles(parseTasksFromTranscript(transcript))}
      />

      <ProfileDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        bookmarkCount={counts.bookmarked}
        onBookmarksPress={() => {
          setDrawerVisible(false);
          setBookmarksPanelVisible(true);
        }}
        notificationCount={upcomingReminderCount}
        onNotificationsPress={() => {
          setDrawerVisible(false);
          setNotificationsPanelVisible(true);
        }}
      />

      <NotificationsPanel
        visible={notificationsPanelVisible}
        onClose={() => setNotificationsPanelVisible(false)}
        tasks={tasks}
        onSelectTask={(task) => {
          setNotificationsPanelVisible(false);
          navigation.navigate('AddTask', { taskId: task.id });
        }}
      />

      <BookmarksPanel
        visible={bookmarksPanelVisible}
        onClose={() => setBookmarksPanelVisible(false)}
        tasks={tasks}
        onSelectTask={(task) => {
          setBookmarksPanelVisible(false);
          navigation.navigate('AddTask', { taskId: task.id });
        }}
      />

      <SearchOverlay
        visible={searchVisible}
        onClose={() => setSearchVisible(false)}
        tasks={tasks}
        apiKey={ASSEMBLYAI_API_KEY}
        onSelectTask={(task) => navigation.navigate('AddTask', { taskId: task.id })}
      />

      <TaskActionSheet
        task={menuTask}
        onClose={() => setMenuTask(null)}
        onEdit={(task) => {
          setMenuTask(null);
          navigation.navigate('AddTask', { taskId: task.id });
        }}
        onToggleBookmark={(task) => {
          toggleBookmark(task.id);
          setMenuTask(null);
        }}
        onDelete={handleMenuDelete}
      />
    </Screen>
  );
}