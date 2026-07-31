import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_STORAGE_KEY = '@taskapp/profile';

interface StoredProfile {
  name: string;
  avatarUri: string | null;
}

interface ProfileContextValue {
  name: string;
  avatarUri: string | null;
  isHydrated: boolean;
  setName: (name: string) => void;
  setAvatarUri: (uri: string | null) => void;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [name, setNameState] = useState('');
  const [avatarUri, setAvatarUriState] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
        if (raw) {
          const parsed: StoredProfile = JSON.parse(raw);
          setNameState(parsed.name ?? '');
          setAvatarUriState(parsed.avatarUri ?? null);
        }
      } catch (error) {
        console.warn('Failed to load profile', error);
      } finally {
        setIsHydrated(true);
      }
    })();
  }, []);

  const persist = useCallback((next: StoredProfile) => {
    AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(next)).catch((error) =>
      console.warn('Failed to save profile', error)
    );
  }, []);

  const setName = useCallback(
    (next: string) => {
      setNameState(next);
      persist({ name: next, avatarUri });
    },
    [avatarUri, persist]
  );

  const setAvatarUri = useCallback(
    (next: string | null) => {
      setAvatarUriState(next);
      persist({ name, avatarUri: next });
    },
    [name, persist]
  );

  const value = useMemo<ProfileContextValue>(
    () => ({ name, avatarUri, isHydrated, setName, setAvatarUri }),
    [name, avatarUri, isHydrated, setName, setAvatarUri]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within a ProfileProvider');
  return ctx;
}