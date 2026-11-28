/**
 * @maataa/ui/ai/speech
 * Reading replies aloud and talking instead of typing, using the browser's
 * own speech features (nothing is sent anywhere by this code; note that some
 * browsers do their speech recognition online). Both degrade to "not
 * available" where the browser lacks them.
 */

import { useCallback, useEffect, useRef, useState } from "react";

/** Plain words to read aloud: drops code, tables, links' addresses and Markdown marks. */
export function speakableText(markdown: string): string {
  return markdown
    .replace(/(`{3,}|~{3,})[\s\S]*?(\1|$)/g, " ")
    .replace(/^\s*\|.*\|\s*$/gm, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^\s*#{1,6}\s+/gm, "")
    .replace(/^\s*[-*+]\s+\[[ xX]\]\s+/gm, "")
    .replace(/^\s*([-*+]|\d+[.)])\s+/gm, "")
    .replace(/[*_~>#]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

interface RecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onresult:
    | ((e: {
        resultIndex: number;
        results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }>;
      }) => void)
    | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
}

function recognitionClass(): (new () => RecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as Record<string, unknown>;
  return (w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null) as
    (new () => RecognitionLike) | null;
}

/** Picks the best installed voice for a language, e.g. "hi-IN". */
function pickVoice(lang: string): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  const base = lang.split("-")[0]!.toLowerCase();
  return (
    voices.find((v) => v.lang.toLowerCase() === lang.toLowerCase()) ??
    voices.find((v) => v.lang.toLowerCase().startsWith(base))
  );
}

/**
 * useSpeech
 *
 * @example
 * ```tsx
 * const speech = useSpeech("hi-IN");
 * speech.speak("नमस्ते", "m1");
 * speech.listen((text) => setDraft(text));
 * ```
 */
export function useSpeech(lang: string) {
  const canSpeak = typeof window !== "undefined" && "speechSynthesis" in window;
  const canListen = !!recognitionClass();
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<RecognitionLike | null>(null);

  const stopSpeaking = useCallback(() => {
    if (canSpeak) window.speechSynthesis.cancel();
    setSpeakingId(null);
  }, [canSpeak]);

  const speak = useCallback(
    (text: string, id: string) => {
      if (!canSpeak) return;
      window.speechSynthesis.cancel();
      const words = speakableText(text);
      if (!words) return;
      const u = new SpeechSynthesisUtterance(words);
      u.lang = lang;
      const voice = pickVoice(lang);
      if (voice) u.voice = voice;
      u.onend = () => setSpeakingId((cur) => (cur === id ? null : cur));
      u.onerror = () => setSpeakingId((cur) => (cur === id ? null : cur));
      setSpeakingId(id);
      window.speechSynthesis.speak(u);
    },
    [canSpeak, lang]
  );

  const stopListening = useCallback(() => {
    recRef.current?.stop();
  }, []);

  /** Starts listening; `onText` gets the words so far (interim, then final). */
  const listen = useCallback(
    (onText: (text: string, final: boolean) => void) => {
      const Rec = recognitionClass();
      if (!Rec) return;
      recRef.current?.abort();
      const rec = new Rec();
      rec.lang = lang;
      rec.interimResults = true;
      rec.continuous = false;
      let finalText = "";
      rec.onresult = (e) => {
        let interim = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const r = e.results[i]!;
          if (r.isFinal) finalText += r[0]!.transcript;
          else interim += r[0]!.transcript;
        }
        onText((finalText + interim).trim(), !interim);
      };
      rec.onerror = (e) => setError(e.error);
      rec.onend = () => {
        setListening(false);
        recRef.current = null;
      };
      setError(null);
      recRef.current = rec;
      setListening(true);
      try {
        rec.start();
      } catch {
        setListening(false);
      }
    },
    [lang]
  );

  useEffect(
    () => () => {
      recRef.current?.abort();
      if (canSpeak) window.speechSynthesis.cancel();
    },
    [canSpeak]
  );

  return {
    canSpeak,
    canListen,
    speakingId,
    listening,
    error,
    speak,
    stopSpeaking,
    listen,
    stopListening,
  };
}
