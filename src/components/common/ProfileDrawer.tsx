import React, { useEffect } from 'react';
import { Image, Modal, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useAppTheme } from '../../theme/ThemeContext';
import { useProfile } from '../../context/ProfileContext';
import { styles } from './ProfileDrawer.styles';

interface Props {
  visible: boolean;
  onClose: () => void;
  bookmarkCount?: number;
  onBookmarksPress?: () => void;
  notificationCount?: number;
  onNotificationsPress?: () => void;
}

const DRAWER_WIDTH = 300;

export const ProfileDrawer: React.FC<Props> = ({
  visible,
  onClose,
  bookmarkCount = 0,
  onBookmarksPress,
  notificationCount = 0,
  onNotificationsPress,
}) => {
  const { theme, isDark, toggleTheme } = useAppTheme();
  const { name, avatarUri, setName, setAvatarUri } = useProfile();
  const translateX = useSharedValue(-DRAWER_WIDTH);

  useEffect(() => {
    translateX.value = withTiming(visible ? 0 : -DRAWER_WIDTH, {
      duration: 260,
      easing: Easing.out(Easing.cubic),
    });
  }, [visible]);

  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close profile menu" />

      <Animated.View
        style={[styles.panel, panelStyle, { backgroundColor: theme.surface, width: DRAWER_WIDTH }]}
      >
        <TouchableOpacity
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close menu"
          style={styles.closeButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="x" size={22} color={theme.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handlePickImage}
          accessibilityRole="button"
          accessibilityLabel="Change profile picture"
          style={styles.avatarWrap}
        >
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: theme.chipBackground }]}>
              <Feather name="user" size={32} color={theme.textSecondary} />
            </View>
          )}
          <View style={[styles.cameraBadge, { backgroundColor: theme.accentGreenDark }]}>
            <Feather name="camera" size={12} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        <Text style={[styles.label, { color: theme.textSecondary }]}>Your name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor={theme.textMuted}
          style={[styles.input, { backgroundColor: theme.chipBackground, color: theme.textPrimary }]}
          returnKeyType="done"
        />

        <View style={styles.divider} />

        <TouchableOpacity
          onPress={onBookmarksPress}
          accessibilityRole="button"
          accessibilityLabel={bookmarkCount > 0 ? `Bookmarks, ${bookmarkCount} saved` : 'Bookmarks'}
          style={styles.themeRow}
        >
          <View style={styles.themeRowLeft}>
            <Feather name="bookmark" size={18} color={theme.textPrimary} />
            <Text style={[styles.themeLabel, { color: theme.textPrimary }]}>Bookmarks</Text>
          </View>
          {bookmarkCount > 0 ? (
            <View style={[styles.notificationBadge, { backgroundColor: theme.accentYellow }]}>
              <Text style={styles.notificationBadgeText}>
                {bookmarkCount > 9 ? '9+' : bookmarkCount}
              </Text>
            </View>
          ) : (
            <Feather name="chevron-right" size={16} color={theme.textMuted} />
          )}
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          onPress={onNotificationsPress}
          accessibilityRole="button"
          accessibilityLabel={
            notificationCount > 0 ? `Notifications, ${notificationCount} upcoming` : 'Notifications'
          }
          style={styles.themeRow}
        >
          <View style={styles.themeRowLeft}>
            <Feather name="bell" size={18} color={theme.textPrimary} />
            <Text style={[styles.themeLabel, { color: theme.textPrimary }]}>Notifications</Text>
          </View>
          {notificationCount > 0 ? (
            <View style={[styles.notificationBadge, { backgroundColor: theme.danger }]}>
              <Text style={styles.notificationBadgeText}>
                {notificationCount > 9 ? '9+' : notificationCount}
              </Text>
            </View>
          ) : (
            <Feather name="chevron-right" size={16} color={theme.textMuted} />
          )}
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          onPress={toggleTheme}
          accessibilityRole="button"
          accessibilityLabel="Toggle dark mode"
          style={styles.themeRow}
        >
          <View style={styles.themeRowLeft}>
            <Feather name={isDark ? 'moon' : 'sun'} size={18} color={theme.textPrimary} />
            <Text style={[styles.themeLabel, { color: theme.textPrimary }]}>
              {isDark ? 'Dark Mode' : 'Light Mode'}
            </Text>
          </View>
          <View
            style={[styles.switchTrack, { backgroundColor: isDark ? theme.accentGreenDark : theme.border }]}
          >
            <View style={[styles.switchThumb, { transform: [{ translateX: isDark ? 18 : 2 }] }]} />
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
};