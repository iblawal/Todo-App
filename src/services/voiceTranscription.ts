import { requestRecordingPermissionsAsync, setAudioModeAsync } from 'expo-audio';


const ASSEMBLYAI_BASE = 'https://api.assemblyai.com/v2';

export async function requestMicrophonePermission(): Promise<boolean> {
  const { status } = await requestRecordingPermissionsAsync();
  return status === 'granted';
}

export async function enableRecordingMode(): Promise<void> {
  await setAudioModeAsync({
    allowsRecording: true,
    playsInSilentMode: true,
  });
}

export async function disableRecordingMode(): Promise<void> {
  await setAudioModeAsync({
    allowsRecording: false,
  });
}

async function uploadAudio(uri: string, apiKey: string): Promise<string> {
  const fileResponse = await fetch(uri);
  const audioBlob = await fileResponse.blob();

  const response = await fetch(`${ASSEMBLYAI_BASE}/upload`, {
    method: 'POST',
    headers: {
      authorization: apiKey,
      'content-type': 'application/octet-stream',
    },
    body: audioBlob,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Audio upload failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.upload_url as string;
}

async function requestTranscript(audioUrl: string, apiKey: string): Promise<string> {
  const response = await fetch(`${ASSEMBLYAI_BASE}/transcript`, {
    method: 'POST',
    headers: {
      authorization: apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ audio_url: audioUrl }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Transcript request failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.id as string;
}

async function pollTranscript(transcriptId: string, apiKey: string): Promise<string> {
  const maxAttempts = 30; // ~30s max wait at 1s intervals, fine for short voice clips
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const response = await fetch(`${ASSEMBLYAI_BASE}/transcript/${transcriptId}`, {
      headers: { authorization: apiKey },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`Transcript polling failed (${response.status}): ${errorText}`);
    }

    const data = await response.json();

    if (data.status === 'completed') {
      return (data.text as string) ?? '';
    }
    if (data.status === 'error') {
      throw new Error(data.error ?? 'Transcription failed.');
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error('Transcription timed out. Please try again.');
}

export async function transcribeAudio(uri: string, apiKey: string): Promise<string> {
  if (!apiKey) {
    throw new Error('Missing AssemblyAI API key for transcription.');
  }

  const uploadUrl = await uploadAudio(uri, apiKey);
  const transcriptId = await requestTranscript(uploadUrl, apiKey);
  return pollTranscript(transcriptId, apiKey);
}