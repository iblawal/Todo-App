import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { TaskProvider } from './src/context/TaskContext';
import { ProfileProvider } from './src/context/ProfileContext';
import { RootNavigator, navigationRef } from './src/navigation/RootNavigator';

function AppShell() {
  const { isDark } = useTheme();
  const paperTheme = isDark ? { dark: true } : { dark: false };

  useEffect(() => {
    // App was fully closed and opened by tapping a notification.
    Notifications.getLastNotificationResponseAsync().then((response) => {
      const taskId = response?.notification.request.content.data?.taskId as string | undefined;
      if (taskId && navigationRef.isReady()) {
        navigationRef.navigate('AddTask', { taskId });
      }
    });

    // App was already running (foreground or backgrounded) when tapped.
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const taskId = response.notification.request.content.data?.taskId as string | undefined;
      if (taskId && navigationRef.isReady()) {
        navigationRef.navigate('AddTask', { taskId });
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <PaperProvider theme={paperTheme as any}>
      <ProfileProvider>
        <TaskProvider>
          <RootNavigator />
        </TaskProvider>
      </ProfileProvider>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AppShell />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}