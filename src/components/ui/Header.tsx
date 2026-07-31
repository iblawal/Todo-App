import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeContext';
import { radius, spacing, typography } from '../../theme/colors';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  rightIcon?: keyof typeof Feather.glyphMap;
  onRightPress?: () => void;
  variant?: 'hero' | 'plain';
  greeting?: boolean;
  userName?: string;
  avatarUri?: string | null;
  onAvatarPress?: () => void;
  showSearchButton?: boolean;
  onSearchPress?: () => void;
  showBookmarkButton?: boolean;
  bookmarkCount?: number;
  onBookmarkPress?: () => void;
  showNotificationBell?: boolean;
  notificationCount?: number;
  onNotificationPress?: () => void;
}

export function Header({
  title,
  subtitle,
  onBack,
  rightIcon,
  onRightPress,
  variant = 'hero',
  greeting = false,
  userName,
  avatarUri,
  onAvatarPress,
  showSearchButton = false,
  onSearchPress,
  showBookmarkButton = false,
  bookmarkCount = 0,
  onBookmarkPress,
  showNotificationBell = false,
  notificationCount = 0,
  onNotificationPress,
}: HeaderProps) {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const isHero = variant === 'hero';
  const textColor = isHero ? colors.heroText : colors.text;
  const waveRotate = useSharedValue(0);

  useEffect(() => {
    if (!greeting) return;
    waveRotate.value = withRepeat(
      withSequence(
        withTiming(20, { duration: 200, easing: Easing.inOut(Easing.ease) }),
        withTiming(-10, { duration: 200, easing: Easing.inOut(Easing.ease) }),
        withTiming(20, { duration: 200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, [greeting]);

  const waveStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${waveRotate.value}deg` }],
  }));

  const content = (
    <>
      <View style={styles.topRow}>
        {onBack ? (
          <TouchableOpacity
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={[styles.iconButton, isHero && { backgroundColor: 'rgba(255,255,255,0.12)' }]}
          >
            <Feather name="chevron-left" size={22} color={textColor} />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconButton} />
        )}

        <View style={styles.rightGroup}>
          {greeting && showSearchButton && (
            <TouchableOpacity
              onPress={onSearchPress}
              accessibilityRole="button"
              accessibilityLabel="Search tasks"
              style={[styles.iconButton, { backgroundColor: 'rgba(255,255,255,0.12)' }]}
            >
              <Feather name="search" size={18} color={textColor} />
            </TouchableOpacity>
          )}

          {greeting && showBookmarkButton && (
            <TouchableOpacity
              onPress={onBookmarkPress}
              accessibilityRole="button"
              accessibilityLabel={
                bookmarkCount > 0 ? `Bookmarks, ${bookmarkCount} saved` : 'Bookmarks'
              }
              style={[styles.iconButton, { backgroundColor: 'rgba(255,255,255,0.12)' }]}
            >
              <Feather name="bookmark" size={18} color={textColor} />
              {bookmarkCount > 0 && (
                <View style={[styles.badge, { backgroundColor: colors.accentYellow }]}>
                  <Text style={styles.badgeText}>{bookmarkCount > 9 ? '9+' : bookmarkCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}

          {greeting && showNotificationBell && (
            <TouchableOpacity
              onPress={onNotificationPress}
              accessibilityRole="button"
              accessibilityLabel={
                notificationCount > 0
                  ? `Notifications, ${notificationCount} upcoming`
                  : 'Notifications'
              }
              style={[styles.iconButton, { backgroundColor: 'rgba(255,255,255,0.12)' }]}
            >
              <Feather name="bell" size={18} color={textColor} />
              {notificationCount > 0 && (
                <View style={[styles.badge, { backgroundColor: colors.danger }]}>
                  <Text style={styles.badgeText}>
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}

          {rightIcon ? (
            <TouchableOpacity
              onPress={onRightPress}
              accessibilityRole="button"
              accessibilityLabel="Header action"
              style={[styles.iconButton, isHero && { backgroundColor: 'rgba(255,255,255,0.12)' }]}
            >
              <Feather name={rightIcon} size={20} color={textColor} />
            </TouchableOpacity>
          ) : greeting ? (
            <TouchableOpacity
              onPress={onAvatarPress}
              accessibilityRole="button"
              accessibilityLabel="Open profile menu"
              style={styles.avatarTouchable}
            >
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
              ) : (
                <View style={[styles.avatar, { backgroundColor: 'rgba(255,255,255,0.14)' }]}>
                  <Feather name="user" size={20} color={textColor} />
                </View>
              )}
            </TouchableOpacity>
          ) : (
            <View style={styles.iconButton} />
          )}
        </View>
      </View>

      {greeting ? (
        <View style={styles.greetingRow}>
          <Text style={[typography.hero, { color: textColor }]}>
            Hello {userName && userName.trim().length > 0 ? userName.trim() : 'User'}{' '}
          </Text>
          <Animated.Text style={[styles.wave, waveStyle]}>👋</Animated.Text>
        </View>
      ) : (
        <Text style={[typography.hero, styles.title, { color: textColor }]}>{title}</Text>
      )}

      {subtitle ? (
        <Text style={[typography.body, styles.subtitle, { color: textColor, opacity: 0.78 }]}>
          {subtitle}
        </Text>
      ) : null}
    </>
  );

  if (!isHero) {
    return <View style={styles.container}>{content}</View>;
  }

  return (
    <View style={styles.shadowWrapper}>
      <LinearGradient
        colors={isDark ? ['#16241A', '#0B120C'] : ['#274E38', '#152A1D']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.container, styles.heroContainer, { paddingTop: insets.top + spacing.sm }]}
      >
        {content}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 8,
  },
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  heroContainer: {
    borderBottomLeftRadius: radius.lg + 4,
    borderBottomRightRadius: radius.lg + 4,
    paddingHorizontal: spacing.lg + 20,
    marginHorizontal: -20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  avatarTouchable: {
    width: 36,
    height: 36,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  wave: {
    fontSize: 28,
    marginLeft: 4,
  },
  title: {
    marginTop: spacing.xs,
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 6,
  },
});