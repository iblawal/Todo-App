import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Task, TaskDraft } from '../types/task';
import { loadTasks, saveTasks } from '../storage/taskStorage';
import { generateId } from '../utils/id';
import { nowISO } from '../utils/date';
import { scheduleTaskReminder, cancelTaskReminder } from '../services/notifications';

interface TaskContextValue {
  tasks: Task[];
  isHydrated: boolean;
  addTask: (draft: TaskDraft) => Task;
  addTasksFromTitles: (titles: string[]) => Task[];
  toggleTask: (id: string) => void;
  toggleBookmark: (id: string) => void;
  deleteTask: (id: string) => void;
  deleteTasks: (ids: string[]) => void;
  deleteAllTasks: () => void;
  updateTask: (id: string, updates: Partial<TaskDraft>) => void;
  getTaskById: (id: string) => Task | undefined;
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      const stored = await loadTasks();
      setTasks(stored);
      setIsHydrated(true);
    })();
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    saveTasks(tasks);
  }, [tasks, isHydrated]);

  const addTask = useCallback((draft: TaskDraft): Task => {
    const timestamp = nowISO();
    const id = generateId();
    const baseTask: Task = {
      id,
      title: draft.title.trim(),
      description: draft.description?.trim(),
      dueDate: draft.dueDate,
      reminderAt: draft.reminderAt,
      completed: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    setTasks((prev) => [baseTask, ...prev]);

    scheduleTaskReminder(baseTask).then((notificationId) => {
      if (!notificationId) return;
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, notificationId } : task))
      );
    });

    return baseTask;
  }, []);

  const addTasksFromTitles = useCallback((titles: string[]): Task[] => {
    const timestamp = nowISO();
    const newTasks: Task[] = titles
      .map((title) => title.trim())
      .filter(Boolean)
      .map((title) => ({
        id: generateId(),
        title,
        completed: false,
        createdAt: timestamp,
        updatedAt: timestamp,
      }));
    if (newTasks.length > 0) {
      setTasks((prev) => [...newTasks, ...prev]);
    }
    return newTasks;
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;

        const nextCompleted = !task.completed;

        if (nextCompleted && task.notificationId) {
          cancelTaskReminder(task.notificationId);
          return {
            ...task,
            completed: nextCompleted,
            notificationId: undefined,
            updatedAt: nowISO(),
          };
        }

        return { ...task, completed: nextCompleted, updatedAt: nowISO() };
      })
    );
  }, []);

  const toggleBookmark = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, bookmarked: !task.bookmarked, updatedAt: nowISO() } : task
      )
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => {
      const target = prev.find((task) => task.id === id);
      if (target?.notificationId) cancelTaskReminder(target.notificationId);
      return prev.filter((task) => task.id !== id);
    });
  }, []);

  const deleteTasks = useCallback((ids: string[]) => {
    const idSet = new Set(ids);
    setTasks((prev) => {
      prev.forEach((task) => {
        if (idSet.has(task.id) && task.notificationId) {
          cancelTaskReminder(task.notificationId);
        }
      });
      return prev.filter((task) => !idSet.has(task.id));
    });
  }, []);

  const deleteAllTasks = useCallback(() => {
    setTasks((prev) => {
      prev.forEach((task) => {
        if (task.notificationId) cancelTaskReminder(task.notificationId);
      });
      return [];
    });
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<TaskDraft>) => {
    setTasks((prev) => {
      const target = prev.find((task) => task.id === id);
      if (!target) return prev;

      const reminderChanged = 'reminderAt' in updates && updates.reminderAt !== target.reminderAt;

      if (reminderChanged && target.notificationId) {
        cancelTaskReminder(target.notificationId);
      }

      const updated: Task = {
        ...target,
        ...updates,
        notificationId: reminderChanged ? undefined : target.notificationId,
        updatedAt: nowISO(),
      };

      if (reminderChanged && updates.reminderAt) {
        scheduleTaskReminder(updated).then((notificationId) => {
          if (!notificationId) return;
          setTasks((current) =>
            current.map((task) => (task.id === id ? { ...task, notificationId } : task))
          );
        });
      }

      return prev.map((task) => (task.id === id ? updated : task));
    });
  }, []);

  const getTaskById = useCallback(
    (id: string) => tasks.find((task) => task.id === id),
    [tasks]
  );

  const value = useMemo<TaskContextValue>(
    () => ({
      tasks,
      isHydrated,
      addTask,
      addTasksFromTitles,
      toggleTask,
      toggleBookmark,
      deleteTask,
      deleteTasks,
      deleteAllTasks,
      updateTask,
      getTaskById,
    }),
    [
      tasks,
      isHydrated,
      addTask,
      addTasksFromTitles,
      toggleTask,
      toggleBookmark,
      deleteTask,
      deleteTasks,
      deleteAllTasks,
      updateTask,
      getTaskById,
    ]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks(): TaskContextValue {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within a TaskProvider');
  return ctx;
}