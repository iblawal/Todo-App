import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useAudioRecorder, RecordingPresets } from 'expo-audio';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useAppTheme } from '../../theme/ThemeContext';
import {
  requestMicrophonePermission,
  enableRecordingMode,
  disableRecordingMode,
  transcribeAudio,
} from '../../services/voiceTranscription';
import { styles } from './VoiceInputModal.styles';

interface Props {
  visible: boolean;
  onClose: () => void;
  onComplete: (transcript: string) => void;
  apiKey: string;
  promptTitle?: string;
  promptSubtitle?: string;
}

type ModalState = 'listening' | 'transcribing' | 'error';

export const VoiceInputModal: React.FC<Props> = ({
  visible,
  onClose,
  onComplete,
  apiKey,
  promptTitle = "I'm listening...",
  promptSubtitle = 'Say one or more tasks, then tap done.',
}) => {
  const { theme } = useAppTheme();
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [state, setState] = useState<ModalState>('listening');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (!visible) return;

    setState('listening');
    setErrorMessage(null);
    pulse.value = withRepeat(
      withTiming(1.35, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    (async () => {
      try {
        const hasPermission = await requestMicrophonePermission();
        if (!hasPermission) {
          throw new Error('Microphone permission was not granted.');
        }
        await enableRecordingMode();
        await audioRecorder.prepareToRecordAsync();
        audioRecorder.record();
      } catch (error) {
        setState('error');
        setErrorMessage(error instanceof Error ? error.message : 'Could not start recording.');
      }
    })();

    return () => {
      pulse.value = 1;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const handleCancel = useCallback(async () => {
    try {
      await audioRecorder.stop();
    } catch (error) {
      console.warn('Failed to cleanly cancel recording', error);
    }
    await disableRecordingMode();
    onClose();
  }, [audioRecorder, onClose]);

  const handleStop = useCallback(async () => {
    setState('transcribing');
    try {
      await audioRecorder.stop();
      const uri = audioRecorder.uri;
      await disableRecordingMode();

      if (!uri) {
        throw new Error('No recording was captured.');
      }

      const transcript = await transcribeAudio(uri, apiKey);
      onComplete(transcript);
      onClose();
    } catch (error) {
      setState('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Something went wrong transcribing your task.'
      );
    }
  }, [audioRecorder, onClose, onComplete, apiKey]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 2 - pulse.value,
  }));

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleCancel}>
      <BlurView intensity={30} tint={theme.mode === 'dark' ? 'dark' : 'light'} style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: theme.surface }]}>
          {state === 'error' ? (
            <>
              <Feather name="alert-triangle" size={40} color={theme.danger} />
              <Text style={[styles.title, { color: theme.textPrimary }]}>
                {errorMessage ?? 'Something went wrong.'}
              </Text>
              <TouchableOpacity
                onPress={onClose}
                style={[styles.button, { backgroundColor: theme.accentGreenDark, marginTop: 24 }]}
                accessibilityRole="button"
                accessibilityLabel="Close"
              >
                <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Close</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.pulseWrap}>
                <Animated.View
                  style={[styles.pulseRing, pulseStyle, { backgroundColor: theme.accentGreenDark }]}
                />
                <View style={[styles.micCircle, { backgroundColor: theme.accentGreenDark }]}>
                  <Feather name="mic" size={28} color="#FFFFFF" />
                </View>
              </View>

              <Text style={[styles.title, { color: theme.textPrimary }]}>
                {state === 'listening' ? promptTitle : 'Transcribing...'}
              </Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                {state === 'listening' ? promptSubtitle : 'Converting your speech to text.'}
              </Text>

              <View style={styles.actionsRow}>
                <TouchableOpacity
                  onPress={handleCancel}
                  disabled={state === 'transcribing'}
                  style={[styles.button, { backgroundColor: theme.chipBackground }]}
                  accessibilityRole="button"
                  accessibilityLabel="Cancel voice input"
                >
                  <Text style={{ color: theme.textPrimary, fontWeight: '600' }}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleStop}
                  disabled={state === 'transcribing'}
                  style={[
                    styles.button,
                    { backgroundColor: theme.accentGreenDark, opacity: state === 'transcribing' ? 0.6 : 1 },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Done recording"
                >
                  <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Done</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </BlurView>
    </Modal>
  );
};