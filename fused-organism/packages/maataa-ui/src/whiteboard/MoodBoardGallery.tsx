/**
 * @maataa/ui/whiteboard/MoodBoardGallery
 * Reference images with captions, alt text, ordering and an image drop zone
 */

import React, { useState } from "react";
import { FileDropzone } from "../forms/FileDropzone";
import { VisuallyHidden } from "../primitives/VisuallyHidden";
import { moveItem } from "./FrameTimelineStrip";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface MoodImage {
  id: string;
  url: string;
  /** What the image shows (alt text) */
  alt: string;
  /** Why it's on the board, e.g. "Colour of the monsoon evenings" */
  caption?: string;
  /** e.g. "Pinterest", a film title */
  source?: string;
}

export interface MoodBoardGalleryProps {
  title: string;
  images: MoodImage[];
  onChange: (images: MoodImage[]) => void;
  /** Called with dropped/chosen image files; return them as MoodImages via onChange */
  onAddFiles?: (files: File[]) => void;
  readOnly?: boolean;
}

/**
 * MoodBoardGallery
 * Masonry-like grid of figures. Each image's alt text and caption are
 * editable in place; images without alt text are flagged. Move earlier /
 * later buttons reorder without dragging.
 */
export function MoodBoardGallery({
  title,
  images,
  onChange,
  onAddFiles,
  readOnly,
}: MoodBoardGalleryProps) {
  const [msg, setMsg] = useState("");
  const upd = (id: string, patch: Partial<MoodImage>) =>
    onChange(images.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  const missing = images.filter((i) => !i.alt.trim()).length;
  const small: React.CSSProperties = {
    minWidth: 30,
    minHeight: 30,
    border: `1px solid ${colorTokens.border.control}`,
    borderRadius: 4,
    background: colorTokens.background.primary,
    cursor: "pointer",
    color: colorTokens.text.primary,
  };
  return (
    <section
      aria-label={title}
      style={{ display: "flex", flexDirection: "column", gap: spacingTokens.md }}
    >
      <VisuallyHidden role="status">{msg}</VisuallyHidden>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          flexWrap: "wrap",
          gap: spacingTokens.sm,
        }}
      >
        <h3 style={{ margin: 0, fontSize: typographyTokens.fontSize.lg }}>{title}</h3>
        <span
          style={{
            fontSize: typographyTokens.fontSize.sm,
            color: missing ? colorTokens.interactive.warning : colorTokens.text.secondary,
          }}
        >
          {images.length} images{missing ? ` · ${missing} need a description` : ""}
        </span>
      </div>
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          columns: "220px",
          columnGap: spacingTokens.sm,
        }}
      >
        {images.map((img, i) => (
          <li key={img.id} style={{ breakInside: "avoid", marginBottom: spacingTokens.sm }}>
            <figure
              style={{
                margin: 0,
                border: `1px solid ${colorTokens.border.primary}`,
                borderRadius: 8,
                overflow: "hidden",
                background: colorTokens.background.primary,
              }}
            >
              <img
                src={img.url}
                alt={img.alt}
                style={{
                  display: "block",
                  width: "100%",
                  background: colorTokens.background.tertiary,
                  minHeight: 80,
                }}
              />
              <figcaption
                style={{
                  padding: spacingTokens.xs,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  fontSize: typographyTokens.fontSize.sm,
                }}
              >
                {readOnly ? (
                  <>
                    {img.caption && <span>{img.caption}</span>}
                    {img.source && (
                      <span
                        style={{
                          color: colorTokens.text.secondary,
                          fontSize: typographyTokens.fontSize.xs,
                        }}
                      >
                        Source: {img.source}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <label
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        fontSize: typographyTokens.fontSize.xs,
                        color: img.alt.trim()
                          ? colorTokens.text.secondary
                          : colorTokens.interactive.warning,
                        fontWeight: 600,
                      }}
                    >
                      What it shows
                      <input
                        value={img.alt}
                        onChange={(e) => upd(img.id, { alt: e.target.value })}
                        style={{
                          padding: 4,
                          border: `1px solid ${img.alt.trim() ? colorTokens.border.control : colorTokens.interactive.warning}`,
                          borderRadius: 4,
                          font: "inherit",
                          fontWeight: 400,
                          fontSize: typographyTokens.fontSize.sm,
                        }}
                      />
                    </label>
                    <label
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        fontSize: typographyTokens.fontSize.xs,
                        color: colorTokens.text.secondary,
                        fontWeight: 600,
                      }}
                    >
                      Why it’s here
                      <input
                        value={img.caption ?? ""}
                        onChange={(e) => upd(img.id, { caption: e.target.value })}
                        style={{
                          padding: 4,
                          border: `1px solid ${colorTokens.border.control}`,
                          borderRadius: 4,
                          font: "inherit",
                          fontWeight: 400,
                          fontSize: typographyTokens.fontSize.sm,
                        }}
                      />
                    </label>
                    <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                      <button
                        type="button"
                        style={small}
                        disabled={i === 0}
                        aria-label={`Move image ${i + 1} earlier`}
                        onClick={() => {
                          onChange(moveItem(images, i, i - 1));
                          setMsg(`Moved to position ${i}`);
                        }}
                      >
                        <span aria-hidden="true">←</span>
                      </button>
                      <button
                        type="button"
                        style={small}
                        disabled={i === images.length - 1}
                        aria-label={`Move image ${i + 1} later`}
                        onClick={() => {
                          onChange(moveItem(images, i, i + 1));
                          setMsg(`Moved to position ${i + 2}`);
                        }}
                      >
                        <span aria-hidden="true">→</span>
                      </button>
                      <button
                        type="button"
                        style={small}
                        aria-label={`Remove image ${i + 1}${img.alt ? `, ${img.alt}` : ""}`}
                        onClick={() => {
                          onChange(images.filter((x) => x.id !== img.id));
                          setMsg("Image removed");
                        }}
                      >
                        <span aria-hidden="true">×</span>
                      </button>
                    </div>
                  </>
                )}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
      {onAddFiles && !readOnly && (
        <FileDropzone
          label="Add reference images"
          accept="image/*"
          hint="JPEG, PNG or WebP. You'll be asked what each one shows."
          onFiles={onAddFiles}
        />
      )}
    </section>
  );
}
MoodBoardGallery.displayName = "MoodBoardGallery";
