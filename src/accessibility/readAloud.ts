/**
 * Read aloud: the browser's own text-to-speech (Web Speech API), for people
 * with low vision or reading difficulties who do not use a screen reader.
 * Screen-reader users already have speech and can ignore this.
 */

import type { ReadAloudLang } from './preferences';

export const READ_ALOUD_LANGS: Array<{ value: ReadAloudLang; label: string }> = [
  { value: 'en-IN', label: 'English (India)' },
  { value: 'hi-IN', label: 'हिन्दी (Hindi)' },
  { value: 'en-GB', label: 'English (UK)' },
  { value: 'en-US', label: 'English (US)' },
];

/** Longest text sent to the speech engine in one go. */
export const MAX_SPEECH_CHARS = 4000;

export function isReadAloudSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

/** Best installed voice for a language ("hi-IN" falls back to any "hi-*"). */
export function pickVoice(lang: ReadAloudLang): SpeechSynthesisVoice | undefined {
  if (!isReadAloudSupported()) return undefined;
  const voices = window.speechSynthesis.getVoices();
  const base = lang.split('-')[0];
  return (
    voices.find((v) => v.lang === lang) ??
    voices.find((v) => v.lang.replace('_', '-').toLowerCase() === lang.toLowerCase()) ??
    voices.find((v) => v.lang.toLowerCase().startsWith(base))
  );
}

export function hasVoiceFor(lang: ReadAloudLang): boolean {
  return Boolean(pickVoice(lang));
}

export interface SpeakOptions {
  lang: ReadAloudLang;
  rate: number;
  onEnd?: () => void;
}

/** Speaks text, replacing anything currently being read. Returns false if unsupported or empty. */
export function speak(text: string, { lang, rate, onEnd }: SpeakOptions): boolean {
  if (!isReadAloudSupported()) return false;
  const clean = text.replace(/\s+/g, ' ').trim().slice(0, MAX_SPEECH_CHARS);
  if (!clean) return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.lang = lang;
  utterance.rate = Math.min(2, Math.max(0.5, rate));
  const voice = pickVoice(lang);
  if (voice) utterance.voice = voice;
  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }
  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking() {
  if (isReadAloudSupported()) window.speechSynthesis.cancel();
}

/** Visible text of an element, skipping hidden and aria-hidden parts. */
function visibleText(root: Element): string {
  const parts: string[] = [];
  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      parts.push(node.textContent ?? '');
      return;
    }
    if (!(node instanceof Element)) return;
    if (node.getAttribute('aria-hidden') === 'true' || node.hasAttribute('hidden')) return;
    if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE'].includes(node.tagName)) return;
    const block = /^(P|DIV|LI|H[1-6]|TR|SECTION|ARTICLE|HEADER|FOOTER|LABEL|BUTTON)$/.test(node.tagName);
    node.childNodes.forEach(walk);
    if (block) parts.push('. ');
  };
  walk(root);
  return parts
    .join(' ')
    .replace(/\s+/g, ' ')
    .replace(/(\s*\.\s*){2,}/g, '. ')
    .trim();
}

/** The page's heading and main content, as one readable string. */
export function pageText(doc: Document = document): string {
  const main = doc.querySelector('main') ?? doc.body;
  return visibleText(main);
}

/** Text the person has selected on the page, if any. */
export function selectionText(): string {
  return window.getSelection?.()?.toString().trim() ?? '';
}

/** All error messages currently shown (role="alert"), joined. */
export function errorText(doc: Document = document): string {
  return [...doc.querySelectorAll('[role="alert"]')]
    .map((el) => el.textContent?.trim())
    .filter(Boolean)
    .join('. ');
}
