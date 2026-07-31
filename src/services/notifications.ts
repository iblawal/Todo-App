import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Task } from '../types/task';
/**
 * Local (on-device) scheduled notifications for task reminders. No backend
 * or push service is involved — everything is scheduled and fired entirely
 * by the OS notification system, so this works fine in Expo Go.
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

let channelConfigured = false;

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android' || channelConfigured) return;
  await Notifications.setNotificationChannelAsync('task-reminders', {
    name: 'Task Reminders',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
  });
  channelConfigured = true;
}

export async function requestNotificationPermission(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  if (existingStatus === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleTaskReminder(task: Task): Promise<string | null> {
  if (!task.reminderAt) return null;

  const triggerDate = new Date(task.reminderAt);
  if (triggerDate.getTime() <= Date.now()) return null;

  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) return null;

  await ensureAndroidChannel();

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Task Reminder',
      body: task.title,
      data: { taskId: task.id },
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
      channelId: Platform.OS === 'android' ? 'task-reminders' : undefined,
    },
  });

  return identifier;
}

export async function cancelTaskReminder(notificationId?: string): Promise<void> {
  if (!notificationId) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.warn('Failed to cancel reminder notification', error);
  }
}