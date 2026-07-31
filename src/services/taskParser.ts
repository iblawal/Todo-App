/**
 * Splits a raw voice transcript into individual task titles.
 * Handles multiple tasks spoken in one breath, e.g.:
 *   "buy milk, call the dentist and finish the report"
 *   -> ["Buy milk", "Call the dentist", "Finish the report"]
 */

const SEPARATOR_REGEX = /,|\band\b|\bthen\b|;/gi;
const FILLER_PREFIXES = [
  /^remind me to\s+/i,
  /^i need to\s+/i,
  /^i have to\s+/i,
  /^add a task to\s+/i,
  /^add task\s+/i,
  /^create a task to\s+/i,
  /^don't forget to\s+/i,
];

function stripFillers(text: string): string {
  let result = text.trim();
  for (const pattern of FILLER_PREFIXES) {
    result = result.replace(pattern, '');
  }
  return result.trim();
}

function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function parseTasksFromTranscript(transcript: string): string[] {
  if (!transcript || !transcript.trim()) return [];

  const cleaned = stripFillers(transcript.trim());

  const rawSegments = cleaned
    .split(SEPARATOR_REGEX)
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0);

  const segments = rawSegments.length > 0 ? rawSegments : [cleaned];

  const titles = segments
    .map((segment) => stripFillers(segment))
    .map((segment) => segment.replace(/[.!?]+$/g, '').trim())
    .filter((segment) => segment.length > 0)
    .map(capitalize);

  // De-duplicate while preserving order
  const seen = new Set<string>();
  return titles.filter((title) => {
    const key = title.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}