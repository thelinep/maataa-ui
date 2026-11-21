/**
 * @maataa/ui/data/MediaCapture
 * CameraPreview, ScreenRecordingBar, ScreenshotButton, AudioRecorder,
 * VoiceCommandButton, LiveTranscript and VideoCallTile
 */

import React, { useEffect, useRef, useState } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
import { VisuallyHidden } from "../primitives/VisuallyHidden";
import { clock } from "./MediaPlayback";
import { VUMeter } from "./AudioViz";

const btn = (primary?: boolean, danger?: boolean): React.CSSProperties => ({
  minHeight: 44,
  padding: "0 14px",
  borderRadius: 8,
  border: primary || danger ? 0 : `1px solid ${colorTokens.border.control}`,
  background: danger
    ? colorTokens.interactive.error
    : primary
      ? colorTokens.interactive.primary
      : colorTokens.background.primary,
  color: primary || danger ? colorTokens.text.inverse : colorTokens.text.primary,
  font: "inherit",
  fontWeight: primary || danger ? 700 : 500,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
});

function permissionMessage(err: unknown, what: string): string {
  const name = (err as { name?: string })?.name;
  if (name === "NotAllowedError")
    return `${what} permission was refused. Allow it in your browser’s site settings and try again.`;
  if (name === "NotFoundError") return `No ${what.toLowerCase()} was found on this device.`;
  if (name === "NotReadableError") return `The ${what.toLowerCase()} is being used by another app.`;
  return `Couldn’t start the ${what.toLowerCase()}.`;
}

/* ───────────────────────── CameraPreview ───────────────────────── */

export interface CameraPreviewProps {
  label?: string;
  /** Called with a captured still (PNG) */
  onCapture?: (blob: Blob) => void;
  facingMode?: "user" | "environment";
  mirrored?: boolean;
}

/**
 * CameraPreview
 * Starts only when asked (never on load). States — off, asking, live,
 * refused — are written out; Stop releases the camera.
 */
export function CameraPreview({
  label = "Camera",
  onCapture,
  facingMode = "user",
  mirrored = facingMode === "user",
}: CameraPreviewProps) {
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const [state, setState] = useState<"off" | "asking" | "live" | "error">("off");
  const [msg, setMsg] = useState("Camera is off.");
  const stop = () => {
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
    setState("off");
    setMsg("Camera is off.");
  };
  useEffect(() => stop, []);
  const start = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setState("error");
      setMsg("This browser can’t use a camera.");
      return;
    }
    setState("asking");
    setMsg("Waiting for camera permission…");
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode }, audio: false });
      stream.current = s;
      if (video.current) video.current.srcObject = s;
      setState("live");
      setMsg("Camera is on.");
    } catch (e) {
      setState("error");
      setMsg(permissionMessage(e, "Camera"));
    }
  };
  const capture = () => {
    const v = video.current;
    if (!v || !onCapture) return;
    const c = document.createElement("canvas");
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    c.getContext("2d")?.drawImage(v, 0, 0);
    c.toBlob((b) => {
      if (b) {
        onCapture(b);
        setMsg("Photo taken.");
      }
    }, "image/png");
  };
  return (
    <section
      aria-label={label}
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.sm, maxWidth: 480 }}
    >
      <div
        style={{
          position: "relative",
          aspectRatio: "4 / 3",
          background: colorTokens.background.inverse,
          borderRadius: 10,
          overflow: "hidden",
          display: "grid",
          placeItems: "center",
        }}
      >
        <video
          ref={video}
          autoPlay
          playsInline
          muted
          aria-label={`${label} preview`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: mirrored ? "scaleX(-1)" : undefined,
            display: state === "live" ? "block" : "none",
          }}
        />
        {state !== "live" && (
          <span aria-hidden="true" style={{ color: colorTokens.text.inverse, opacity: 0.8 }}>
            {state === "asking" ? "Waiting for permission…" : "Camera off"}
          </span>
        )}
        {state === "live" && (
          <span
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              padding: "2px 8px",
              borderRadius: 999,
              background: colorTokens.interactive.error,
              color: "#FFFFFF",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            ● Live
          </span>
        )}
      </div>
      <div style={{ display: "flex", gap: spacingTokens.xs, flexWrap: "wrap" }}>
        {state === "live" ? (
          <>
            {onCapture && (
              <button type="button" style={btn(true)} onClick={capture}>
                Take photo
              </button>
            )}
            <button type="button" style={btn()} onClick={stop}>
              Turn camera off
            </button>
          </>
        ) : (
          <button type="button" style={btn(true)} onClick={start} disabled={state === "asking"}>
            Turn camera on
          </button>
        )}
      </div>
      <p
        role="status"
        style={{
          margin: 0,
          fontSize: typographyTokens.fontSize.sm,
          color: state === "error" ? colorTokens.interactive.error : colorTokens.text.secondary,
        }}
      >
        {msg}
      </p>
    </section>
  );
}

/* ───────────────────────── ScreenRecordingBar ───────────────────────── */

export interface ScreenRecordingBarProps {
  /** Called with the recording when stopped */
  onRecorded: (blob: Blob) => void;
  /** Include microphone audio @default false */
  withMicrophone?: boolean;
}

/**
 * ScreenRecordingBar
 * Start, Pause/Resume and Stop with elapsed time. The red "Recording" state
 * is spelled out, and the browser's own sharing indicator stays visible.
 */
export function ScreenRecordingBar({ onRecorded, withMicrophone }: ScreenRecordingBarProps) {
  const [state, setState] = useState<"idle" | "recording" | "paused">("idle");
  const [secs, setSecs] = useState(0);
  const [msg, setMsg] = useState("");
  const rec = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  useEffect(() => {
    if (state !== "recording") return undefined;
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [state]);
  const start = async () => {
    try {
      const display = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      const tracks = [...display.getTracks()];
      if (withMicrophone) {
        const mic = await navigator.mediaDevices.getUserMedia({ audio: true }).catch(() => null);
        mic?.getAudioTracks().forEach((t) => tracks.push(t));
      }
      const stream = new MediaStream(tracks);
      const r = new MediaRecorder(stream);
      chunks.current = [];
      r.ondataavailable = (e) => e.data.size && chunks.current.push(e.data);
      r.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        onRecorded(new Blob(chunks.current, { type: r.mimeType || "video/webm" }));
        setState("idle");
        setMsg("Recording saved.");
      };
      display
        .getVideoTracks()[0]
        ?.addEventListener("ended", () => r.state !== "inactive" && r.stop());
      r.start(1000);
      rec.current = r;
      setSecs(0);
      setState("recording");
      setMsg("Recording started.");
    } catch (e) {
      setMsg(permissionMessage(e, "Screen sharing"));
    }
  };
  return (
    <div
      role="group"
      aria-label="Screen recording"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: spacingTokens.sm,
        padding: 8,
        borderRadius: 999,
        background: colorTokens.background.inverse,
        color: colorTokens.text.inverse,
        flexWrap: "wrap",
      }}
    >
      {state === "idle" ? (
        <button type="button" style={{ ...btn(false, true), borderRadius: 999 }} onClick={start}>
          <span aria-hidden="true">●</span> Record screen
        </button>
      ) : (
        <>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "0 8px",
              fontWeight: 700,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: state === "recording" ? "#F5B5A6" : "#F5D547",
              }}
            />
            {state === "recording" ? "Recording" : "Paused"}
            <span style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{clock(secs)}</span>
          </span>
          <button
            type="button"
            style={{ ...btn(), borderRadius: 999 }}
            onClick={() => {
              if (state === "recording") {
                rec.current?.pause();
                setState("paused");
                setMsg("Recording paused.");
              } else {
                rec.current?.resume();
                setState("recording");
                setMsg("Recording resumed.");
              }
            }}
          >
            {state === "recording" ? "Pause" : "Resume"}
          </button>
          <button
            type="button"
            style={{ ...btn(false, true), borderRadius: 999 }}
            onClick={() => rec.current?.stop()}
          >
            <span aria-hidden="true">■</span> Stop
          </button>
        </>
      )}
      <VisuallyHidden role="status">{msg}</VisuallyHidden>
    </div>
  );
}

/* ───────────────────────── ScreenshotButton ───────────────────────── */

export interface ScreenshotButtonProps {
  /** Produce the image (e.g. draw a frame to canvas); resolve a Blob */
  capture: () => Promise<Blob>;
  onCaptured: (blob: Blob) => void;
  label?: string;
}

/**
 * ScreenshotButton
 * Grabs a frame via your `capture` function, shows a small flash (not with
 * reduced motion), a thumbnail, and announces "Screenshot taken".
 */
export function ScreenshotButton({
  capture,
  onCaptured,
  label = "Take screenshot",
}: ScreenshotButtonProps) {
  const [busy, setBusy] = useState(false);
  const [thumb, setThumb] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [flash, setFlash] = useState(false);
  useEffect(() => () => void (thumb && URL.revokeObjectURL(thumb)), [thumb]);
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: spacingTokens.sm }}>
      <button
        type="button"
        disabled={busy}
        aria-busy={busy || undefined}
        style={btn()}
        onClick={async () => {
          setBusy(true);
          try {
            const b = await capture();
            onCaptured(b);
            setThumb(URL.createObjectURL(b));
            setMsg("Screenshot taken.");
            if (!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
              setFlash(true);
              setTimeout(() => setFlash(false), 150);
            }
          } catch {
            setMsg("Couldn’t take the screenshot.");
          } finally {
            setBusy(false);
          }
        }}
      >
        <span aria-hidden="true">📷</span> {label}
      </button>
      {thumb && (
        <img
          src={thumb}
          alt="Latest screenshot"
          style={{ height: 40, borderRadius: 4, border: `1px solid ${colorTokens.border.primary}` }}
        />
      )}
      {flash && (
        <span
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "#FFFFFF",
            opacity: 0.6,
            pointerEvents: "none",
            zIndex: 2000,
          }}
        />
      )}
      <VisuallyHidden role="status">{msg}</VisuallyHidden>
    </div>
  );
}

/* ───────────────────────── AudioRecorder ───────────────────────── */

export interface AudioRecorderProps {
  onRecorded: (blob: Blob, seconds: number) => void;
  label?: string;
  /** Stop automatically after this many seconds */
  maxSeconds?: number;
}

/**
 * AudioRecorder
 * Record / Stop with elapsed time and a live level meter (role=meter), so
 * you can see the mic is working. Playback of the take follows.
 */
export function AudioRecorder({
  onRecorded,
  label = "Voice note",
  maxSeconds,
}: AudioRecorderProps) {
  const [state, setState] = useState<"idle" | "recording">("idle");
  const [secs, setSecs] = useState(0);
  const [db, setDb] = useState(-60);
  const [url, setUrl] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const rec = useRef<MediaRecorder | null>(null);
  const raf = useRef(0);
  const secsRef = useRef(0);
  secsRef.current = secs;
  useEffect(() => {
    if (state !== "recording") return undefined;
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [state]);
  useEffect(() => {
    if (maxSeconds && secs >= maxSeconds && state === "recording") rec.current?.stop();
  }, [secs, maxSeconds, state]);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new AudioContext();
      const an = ctx.createAnalyser();
      an.fftSize = 1024;
      ctx.createMediaStreamSource(stream).connect(an);
      const buf = new Float32Array(an.fftSize);
      const loop = () => {
        an.getFloatTimeDomainData(buf);
        let sum = 0;
        for (const v of buf) sum += v * v;
        setDb(Math.max(-60, 20 * Math.log10(Math.sqrt(sum / buf.length) || 1e-6)));
        raf.current = requestAnimationFrame(loop);
      };
      loop();
      const r = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      r.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      r.onstop = () => {
        cancelAnimationFrame(raf.current);
        stream.getTracks().forEach((t) => t.stop());
        void ctx.close();
        const blob = new Blob(chunks, { type: r.mimeType || "audio/webm" });
        setUrl(URL.createObjectURL(blob));
        onRecorded(blob, secsRef.current);
        setState("idle");
        setMsg(`Recorded ${clock(secsRef.current)}.`);
        setDb(-60);
      };
      r.start();
      rec.current = r;
      setSecs(0);
      setState("recording");
      setMsg("Recording.");
    } catch (e) {
      setMsg(permissionMessage(e, "Microphone"));
    }
  };
  return (
    <section
      aria-label={label}
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.sm }}
    >
      <div
        style={{ display: "flex", alignItems: "center", gap: spacingTokens.sm, flexWrap: "wrap" }}
      >
        {state === "idle" ? (
          <button type="button" style={btn(false, true)} onClick={start}>
            <span aria-hidden="true">●</span> Record
          </button>
        ) : (
          <button type="button" style={btn(true)} onClick={() => rec.current?.stop()}>
            <span aria-hidden="true">■</span> Stop
          </button>
        )}
        <span style={{ fontFamily: "ui-monospace, Menlo, monospace", fontWeight: 700 }}>
          {clock(secs)}
          {maxSeconds ? ` / ${clock(maxSeconds)}` : ""}
        </span>
        <VUMeter level={db} label="Microphone level" length={160} />
      </div>
      {url && (
        <audio controls src={url} aria-label={`${label} playback`} style={{ maxWidth: "100%" }} />
      )}
      <VisuallyHidden role="status">{msg}</VisuallyHidden>
      {msg && !msg.startsWith("Rec") && (
        <p
          style={{
            margin: 0,
            color: colorTokens.interactive.error,
            fontSize: typographyTokens.fontSize.sm,
          }}
        >
          {msg}
        </p>
      )}
    </section>
  );
}

/* ───────────────────────── VoiceCommandButton ───────────────────────── */

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult:
    | ((e: {
        results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }>;
      }) => void)
    | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
}

export interface VoiceCommandButtonProps {
  /** Called with what was heard */
  onCommand: (text: string) => void;
  /** BCP-47, e.g. "hi-IN" @default 'en-IN' */
  lang?: string;
  label?: string;
}

/**
 * VoiceCommandButton
 * Push to talk. Shows "Listening…" and what was heard. Hidden behind a clear
 * message when the browser has no speech recognition.
 */
export function VoiceCommandButton({
  onCommand,
  lang = "en-IN",
  label = "Voice command",
}: VoiceCommandButtonProps) {
  const w =
    typeof window !== "undefined"
      ? (window as unknown as {
          SpeechRecognition?: new () => SpeechRecognitionLike;
          webkitSpeechRecognition?: new () => SpeechRecognitionLike;
        })
      : {};
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState("");
  const [msg, setMsg] = useState("");
  const rec = useRef<SpeechRecognitionLike | null>(null);
  if (!Ctor) {
    return (
      <p
        style={{
          margin: 0,
          color: colorTokens.text.secondary,
          fontSize: typographyTokens.fontSize.sm,
        }}
      >
        Voice commands aren’t available in this browser.
      </p>
    );
  }
  const toggle = () => {
    if (listening) {
      rec.current?.stop();
      return;
    }
    const r = new Ctor();
    r.lang = lang;
    r.interimResults = true;
    r.continuous = false;
    r.onresult = (e) => {
      const res = e.results[e.results.length - 1]!;
      const text = res[0]!.transcript;
      setHeard(text);
      if (res.isFinal) {
        onCommand(text.trim());
        setMsg(`Heard: ${text.trim()}`);
      }
    };
    r.onerror = (e) =>
      setMsg(
        e.error === "not-allowed"
          ? "Microphone permission was refused."
          : "Didn’t catch that. Try again."
      );
    r.onend = () => setListening(false);
    rec.current = r;
    r.start();
    setHeard("");
    setListening(true);
    setMsg("Listening…");
  };
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: spacingTokens.sm }}>
      <button
        type="button"
        aria-pressed={listening}
        onClick={toggle}
        style={{
          ...btn(listening, false),
          borderRadius: 999,
          minWidth: 44,
          boxShadow: listening ? `0 0 0 4px ${colorTokens.semantic.warning.bg}` : undefined,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor" />
          <path
            d="M5 11a7 7 0 0 0 14 0M12 18v3"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
        </svg>
        {listening ? "Stop listening" : label}
      </button>
      {heard && (
        <span style={{ fontStyle: "italic", color: colorTokens.text.secondary }}>“{heard}”</span>
      )}
      <VisuallyHidden role="status">{msg}</VisuallyHidden>
    </div>
  );
}

/* ───────────────────────── LiveTranscript ───────────────────────── */

export interface TranscriptSegment {
  id: string;
  speaker?: string;
  text: string;
  /** Seconds from start */
  at?: number;
  /** Still being recognised */
  interim?: boolean;
}

export interface LiveTranscriptProps {
  segments: TranscriptSegment[];
  label?: string;
  /** Announce new final lines (off by default: screen-reader users can read the log) */
  announce?: boolean;
  height?: number;
}

/**
 * LiveTranscript
 * role=log that auto-scrolls only while you are at the bottom (so reading
 * back isn't interrupted), with a "Jump to latest" button otherwise.
 */
export function LiveTranscript({
  segments,
  label = "Live transcript",
  announce = false,
  height = 220,
}: LiveTranscriptProps) {
  const box = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(true);
  useEffect(() => {
    if (pinned && box.current) box.current.scrollTop = box.current.scrollHeight;
  }, [segments, pinned]);
  return (
    <section aria-label={label} style={{ position: "relative" }}>
      <div
        ref={box}
        role="log"
        aria-live={announce ? "polite" : "off"}
        aria-label={label}
        tabIndex={0}
        onScroll={(e) => {
          const el = e.currentTarget;
          setPinned(el.scrollHeight - el.scrollTop - el.clientHeight < 24);
        }}
        style={{
          height,
          overflowY: "auto",
          padding: spacingTokens.md,
          border: `1px solid ${colorTokens.border.primary}`,
          borderRadius: 10,
          background: colorTokens.background.primary,
          fontSize: typographyTokens.fontSize.md,
          lineHeight: 1.6,
        }}
      >
        {segments.map((s) => (
          <p
            key={s.id}
            style={{
              margin: "0 0 8px",
              color: s.interim ? colorTokens.text.secondary : colorTokens.text.primary,
              fontStyle: s.interim ? "italic" : undefined,
            }}
          >
            {s.at != null && (
              <span
                style={{
                  fontFamily: "ui-monospace, Menlo, monospace",
                  fontSize: 12,
                  color: colorTokens.text.secondary,
                  marginRight: 8,
                }}
              >
                {clock(s.at)}
              </span>
            )}
            {s.speaker && <strong style={{ marginRight: 6 }}>{s.speaker}:</strong>}
            {s.text}
          </p>
        ))}
      </div>
      {!pinned && (
        <button
          type="button"
          onClick={() => {
            setPinned(true);
            if (box.current) box.current.scrollTop = box.current.scrollHeight;
          }}
          style={{
            ...btn(true),
            position: "absolute",
            right: 12,
            bottom: 12,
            minHeight: 36,
            borderRadius: 999,
          }}
        >
          Jump to latest
        </button>
      )}
    </section>
  );
}

/* ───────────────────────── VideoCallTile ───────────────────────── */

export interface VideoCallTileProps {
  name: string;
  role?: string;
  /** A MediaStream to show; initials otherwise */
  stream?: MediaStream | null;
  muted?: boolean;
  cameraOff?: boolean;
  speaking?: boolean;
  /** Raised hand */
  handRaised?: boolean;
  isYou?: boolean;
  /** Has sign-language interpreter role, kept large */
  pinned?: boolean;
}

/**
 * VideoCallTile
 * Name, mute, camera and hand states are written in a status line, not
 * only icons. The speaking outline is thick and also labelled.
 */
export function VideoCallTile({
  name,
  role,
  stream,
  muted,
  cameraOff,
  speaking,
  handRaised,
  isYou,
  pinned,
}: VideoCallTileProps) {
  const v = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (v.current && stream) v.current.srcObject = stream;
  }, [stream]);
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const states = [
    muted ? "muted" : null,
    cameraOff ? "camera off" : null,
    handRaised ? "hand raised" : null,
    speaking ? "speaking" : null,
    pinned ? "pinned" : null,
  ].filter(Boolean);
  return (
    <figure
      aria-label={`${name}${isYou ? " (you)" : ""}${states.length ? `, ${states.join(", ")}` : ""}`}
      style={{
        margin: 0,
        position: "relative",
        aspectRatio: "16 / 9",
        borderRadius: 12,
        overflow: "hidden",
        background: "#2B1F14",
        outline: speaking ? `4px solid #F5D547` : `1px solid ${colorTokens.border.primary}`,
        outlineOffset: speaking ? -4 : -1,
      }}
    >
      {stream && !cameraOff ? (
        <video
          ref={v}
          autoPlay
          playsInline
          muted={isYou}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: isYou ? "scaleX(-1)" : undefined,
          }}
        />
      ) : (
        <div
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}
        >
          <span
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              background: colorTokens.interactive.primary,
              color: "#FFFFFF",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            {initials}
          </span>
        </div>
      )}
      {handRaised && (
        <span aria-hidden="true" style={{ position: "absolute", top: 8, left: 8, fontSize: 22 }}>
          ✋
        </span>
      )}
      <figcaption
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 8,
          bottom: 8,
          right: 8,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 6,
          padding: "4px 8px",
          borderRadius: 6,
          background: "rgba(20, 14, 8, 0.75)",
          color: "#FFFFFF",
          fontSize: 13,
        }}
      >
        <strong style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {name}
          {isYou ? " (you)" : ""}
        </strong>
        {role && <span style={{ opacity: 0.85 }}>· {role}</span>}
        <span style={{ marginLeft: "auto" }}>
          {muted ? "🔇 Muted" : speaking ? "🔊 Speaking" : ""}
        </span>
      </figcaption>
    </figure>
  );
}
