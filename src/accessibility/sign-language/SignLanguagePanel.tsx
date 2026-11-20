/**
 * Sign language help: a floating, non-modal panel that plays the human-signed
 * ISL video for the page you are on (with captions and picture-in-picture),
 * and always shows the written transcript. It does not trap focus, so the
 * page stays usable while a video plays.
 */

import React, { useEffect, useId, useRef, useState } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router';
import { colorTokens, spacing, typography } from '@/utils/tokens';
import { useA11y } from '../preferences';
import {
  SIGN_LANGUAGE_TOPICS,
  loadManifest,
  topicForPath,
  type RecordedVideo,
  type SignLanguageManifest,
} from './topics';

const Panel = styled.section<{ $large: boolean }>`
  position: fixed;
  right: ${spacing.md};
  bottom: ${spacing.md};
  z-index: 1050;
  width: ${(p) => (p.$large ? 'min(720px, calc(100vw - 32px))' : 'min(380px, calc(100vw - 32px))')};
  max-height: calc(100vh / var(--a11y-zoom, 1) - 32px);
  overflow-y: auto;
  padding: ${spacing.md};
  border: 2px solid ${colorTokens.text.primary};
  border-radius: 12px;
  background: ${colorTokens.background.primary};
  color: ${colorTokens.text.primary};
  box-shadow: 0 8px 28px rgba(61, 40, 23, 0.25);
`;

const Head = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${spacing.sm};
  margin-bottom: ${spacing.sm};

  h2 {
    margin: 0;
    font-size: ${typography.heading3?.fontSize ?? '1.125rem'};
  }
`;

const SmallButton = styled.button`
  min-width: 32px;
  min-height: 32px;
  padding: 4px 10px;
  border: 1px solid ${colorTokens.text.secondary};
  border-radius: 6px;
  background: transparent;
  color: ${colorTokens.text.primary};
  font: inherit;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${colorTokens.text.primary};
    outline-offset: 2px;
  }
`;

const VideoFrame = styled.div`
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  overflow: hidden;
  background: ${colorTokens.background.secondary};
  display: flex;
  align-items: center;
  justify-content: center;

  video {
    width: 100%;
    height: 100%;
    background: #000;
  }
`;

const Placeholder = styled.p`
  margin: 0;
  padding: ${spacing.md};
  text-align: center;
  color: ${colorTokens.text.secondary};
`;

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${spacing.sm};
  margin: ${spacing.sm} 0;

  label {
    font-weight: 500;
  }
  select {
    flex: 1 1 160px;
    min-width: 0;
    max-width: 100%;
    min-height: 32px;
    border: 1px solid ${colorTokens.text.secondary};
    border-radius: 6px;
    background: ${colorTokens.background.primary};
    color: ${colorTokens.text.primary};
    font: inherit;
  }
`;

const Transcript = styled.div`
  font-size: ${typography.body.fontSize};
  line-height: 1.6;

  h3 {
    margin: ${spacing.sm} 0 ${spacing.xs};
    font-size: ${typography.body.fontSize};
  }
  p {
    margin: 0;
  }
`;

export const SignLanguagePanel: React.FC = () => {
  const { signLanguageOpen, setSignLanguageOpen } = useA11y();
  const location = useLocation();
  const ids = useId();
  const [manifest, setManifest] = useState<SignLanguageManifest | null>(null);
  const [topicId, setTopicId] = useState(() => topicForPath(location.pathname).id);
  const [large, setLarge] = useState(false);
  const [transcriptLang, setTranscriptLang] = useState<'en' | 'hi'>('en');
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const opener = useRef<Element | null>(null);

  // Follow the page the person is on.
  useEffect(() => {
    setTopicId(topicForPath(location.pathname).id);
  }, [location.pathname]);

  // Load the list of recorded videos once, when first opened.
  useEffect(() => {
    if (signLanguageOpen && !manifest) void loadManifest().then(setManifest);
  }, [signLanguageOpen, manifest]);

  // Move focus into the panel on open; give it back on close.
  useEffect(() => {
    if (signLanguageOpen) {
      opener.current = document.activeElement;
      headingRef.current?.focus();
    } else if (opener.current instanceof HTMLElement && document.contains(opener.current)) {
      opener.current.focus();
    }
  }, [signLanguageOpen]);

  if (!signLanguageOpen) return null;

  const topic = SIGN_LANGUAGE_TOPICS.find((t) => t.id === topicId) ?? SIGN_LANGUAGE_TOPICS[0];
  const video: RecordedVideo | undefined = manifest?.videos.find((v) => v.id === topic.id);
  const pipSupported = typeof document !== 'undefined' && 'pictureInPictureEnabled' in document && document.pictureInPictureEnabled;
  const headingId = `${ids}-heading`;

  return (
    <Panel
      $large={large}
      role="dialog"
      aria-modal="false"
      aria-labelledby={headingId}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.stopPropagation();
          setSignLanguageOpen(false);
        }
      }}
    >
      <Head>
        <h2 id={headingId} ref={headingRef} tabIndex={-1}>
          Sign language help (ISL): {topic.title}
        </h2>
        <SmallButton type="button" aria-label="Close sign language help" onClick={() => setSignLanguageOpen(false)}>
          ×
        </SmallButton>
      </Head>

      <VideoFrame>
        {video ? (
          <video
            key={topic.id}
            ref={videoRef}
            controls
            playsInline
            preload="metadata"
            src={`/isl/${topic.id}.mp4`}
            poster={video.poster ? `/isl/${topic.id}.jpg` : undefined}
            aria-label={`Indian Sign Language video: ${topic.title}`}
          >
            {(video.captions ?? ['en']).map((lang, i) => (
              <track
                key={lang}
                kind="captions"
                srcLang={lang}
                label={lang === 'hi' ? 'हिन्दी' : 'English'}
                src={`/isl/${topic.id}.${lang}.vtt`}
                default={i === 0}
              />
            ))}
          </video>
        ) : (
          <Placeholder>
            {manifest ? 'The sign language video for this topic has not been recorded yet. The transcript is below.' : 'Loading…'}
          </Placeholder>
        )}
      </VideoFrame>
      {video?.signer && (
        <p style={{ margin: `${spacing.xs} 0 0`, fontSize: typography.bodySmall.fontSize, color: colorTokens.text.secondary }}>
          Signed by {video.signer}
        </p>
      )}

      <Controls>
        <label htmlFor={`${ids}-topic`}>Topic</label>
        <select id={`${ids}-topic`} value={topic.id} onChange={(e) => setTopicId(e.target.value)}>
          {SIGN_LANGUAGE_TOPICS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
              {manifest && !manifest.videos.some((v) => v.id === t.id) ? ' (transcript only)' : ''}
            </option>
          ))}
        </select>
        <SmallButton type="button" aria-pressed={large} onClick={() => setLarge((v) => !v)}>
          Larger video
        </SmallButton>
        {video && pipSupported && (
          <SmallButton type="button" onClick={() => void videoRef.current?.requestPictureInPicture?.()}>
            Picture in picture
          </SmallButton>
        )}
      </Controls>

      <Transcript>
        <h3>
          Transcript{' '}
          <SmallButton
            type="button"
            onClick={() => setTranscriptLang((l) => (l === 'en' ? 'hi' : 'en'))}
            lang={transcriptLang === 'en' ? 'hi' : 'en'}
          >
            {transcriptLang === 'en' ? 'हिन्दी' : 'English'}
          </SmallButton>
        </h3>
        <p lang={transcriptLang === 'en' ? 'en' : 'hi'}>{transcriptLang === 'en' ? topic.script : topic.scriptHi}</p>
      </Transcript>
    </Panel>
  );
};
