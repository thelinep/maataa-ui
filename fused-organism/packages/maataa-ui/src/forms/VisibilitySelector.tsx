/**
 * @maataa/ui/forms/VisibilitySelector
 * Who can see a listing: public, unlisted or private
 */

import React from "react";
import { ChoiceCards } from "./ChoiceCards";

export type Visibility = "public" | "unlisted" | "private";

export interface VisibilitySelectorProps {
  value: Visibility;
  onChange: (value: Visibility) => void;
  /** What's being shared, e.g. "this production" @default 'this listing' */
  subject?: string;
  legend?: string;
}

/**
 * VisibilitySelector
 * Three radio cards that say exactly who sees what. Private is the safe
 * default the app should start from.
 */
export function VisibilitySelector({
  value,
  onChange,
  subject = "this listing",
  legend = "Who can see it?",
}: VisibilitySelectorProps) {
  return (
    <ChoiceCards
      legend={legend}
      value={value}
      onChange={(v) => onChange(v as Visibility)}
      options={[
        {
          value: "private",
          label: "Private",
          icon: "🔒",
          description: `Only your team sees ${subject}.`,
        },
        {
          value: "unlisted",
          label: "Unlisted",
          icon: "🔗",
          description: "Anyone with the link can see it. It isn't in Dispatch search.",
        },
        {
          value: "public",
          label: "Public",
          icon: "🌐",
          description:
            "Listed in Dispatch. Contact details stay hidden until you accept an application.",
        },
      ]}
    />
  );
}
VisibilitySelector.displayName = "VisibilitySelector";
