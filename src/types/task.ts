export type SortOption = 'newest' | 'oldest' | 'dueDate' | 'alphabetical';
export type FilterOption = 'all' | 'completed' | 'inProgress' | 'bookmarked' | 'overdue';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  reminderAt?: string;
  notificationId?: string;
  bookmarked?: boolean;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaskDraft {
  title: string;
  description?: string;
  dueDate?: string;
  reminderAt?: string;
}