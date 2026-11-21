/**
 * @maataa/ui/whiteboard/ShotPickers
 * Shot size and camera angle choosers with small framing diagrams
 */

import React from "react";
import { ChoiceCards, type ChoiceCardOption } from "../forms/ChoiceCards";

const frameIcon = (inner: React.ReactNode) => (
  <svg width="48" height="28" viewBox="0 0 48 28" aria-hidden="true" focusable="false">
    <rect x="0.5" y="0.5" width="47" height="27" rx="2" fill="none" stroke="currentColor" />
    {inner}
  </svg>
);
const head = (cx: number, cy: number, r: number) => (
  <circle cx={cx} cy={cy} r={r} fill="currentColor" opacity="0.8" />
);
const body = (cx: number, top: number, w: number, h: number) => (
  <rect x={cx - w / 2} y={top} width={w} height={h} rx={w / 3} fill="currentColor" opacity="0.55" />
);

export const shotTypes: ChoiceCardOption[] = [
  {
    value: "EWS",
    label: "Extreme wide",
    description: "Place dominates; people are tiny",
    icon: frameIcon(
      <>
        {head(24, 18, 1.2)}
        {body(24, 19.5, 1.6, 3)}
      </>
    ),
  },
  {
    value: "WS",
    label: "Wide",
    description: "Whole body with surroundings",
    icon: frameIcon(
      <>
        {head(24, 9, 2.5)}
        {body(24, 12, 4, 13)}
      </>
    ),
  },
  {
    value: "MS",
    label: "Medium",
    description: "Waist up",
    icon: frameIcon(
      <>
        {head(24, 9, 4)}
        {body(24, 14, 14, 16)}
      </>
    ),
  },
  {
    value: "MCU",
    label: "Medium close-up",
    description: "Chest up",
    icon: frameIcon(
      <>
        {head(24, 11, 6)}
        {body(24, 18, 22, 12)}
      </>
    ),
  },
  {
    value: "CU",
    label: "Close-up",
    description: "Face fills the frame",
    icon: frameIcon(<>{head(24, 15, 10)}</>),
  },
  {
    value: "ECU",
    label: "Extreme close-up",
    description: "Eyes, hands, a detail",
    icon: frameIcon(
      <>
        <ellipse cx="16" cy="14" rx="6" ry="3.5" fill="currentColor" opacity=".8" />
        <ellipse cx="32" cy="14" rx="6" ry="3.5" fill="currentColor" opacity=".8" />
      </>
    ),
  },
  {
    value: "OTS",
    label: "Over the shoulder",
    description: "From behind one person, looking at another",
    icon: frameIcon(
      <>
        {head(32, 11, 4)}
        <ellipse cx="10" cy="22" rx="11" ry="9" fill="currentColor" opacity=".35" />
      </>
    ),
  },
  {
    value: "POV",
    label: "Point of view",
    description: "What a character sees",
    icon: frameIcon(
      <>
        <circle cx="24" cy="14" r="8" fill="none" stroke="currentColor" />
        <circle cx="24" cy="14" r="2" fill="currentColor" />
      </>
    ),
  },
];

export const cameraAngles: ChoiceCardOption[] = [
  { value: "eye", label: "Eye level", description: "Neutral, at the subject's eye line" },
  { value: "high", label: "High angle", description: "Looking down; subject feels smaller" },
  { value: "low", label: "Low angle", description: "Looking up; subject feels powerful" },
  { value: "birds", label: "Bird’s eye", description: "Straight down from above" },
  { value: "worms", label: "Worm’s eye", description: "From the ground, looking up" },
  { value: "dutch", label: "Dutch tilt", description: "Horizon tilted; unease" },
  { value: "overhead", label: "Top shot", description: "Overhead on a table or bed" },
];

export interface ShotTypeSelectorProps {
  value: string | undefined;
  onChange: (v: string) => void;
  legend?: string;
}

/** ShotTypeSelector: industry abbreviations (MCU, OTS) with plain names and descriptions. */
export const ShotTypeSelector = ({
  value,
  onChange,
  legend = "Shot size",
}: ShotTypeSelectorProps) => (
  <ChoiceCards
    legend={legend}
    options={shotTypes.map((o) => ({ ...o, label: `${o.label} (${o.value})` }))}
    value={value}
    onChange={onChange}
    minWidth={150}
  />
);
ShotTypeSelector.displayName = "ShotTypeSelector";

/** CameraAnglePicker */
export const CameraAnglePicker = ({
  value,
  onChange,
  legend = "Camera angle",
}: ShotTypeSelectorProps) => (
  <ChoiceCards
    legend={legend}
    options={cameraAngles}
    value={value}
    onChange={onChange}
    minWidth={150}
  />
);
CameraAnglePicker.displayName = "CameraAnglePicker";
