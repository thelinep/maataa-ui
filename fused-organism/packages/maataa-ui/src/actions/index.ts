/**
 * @maataa/ui/actions
 * Category: actions
 * Action components for buttons and interactive triggers
 */

// Core action components (MUI-04)
export { IconButton, type IconButtonProps } from "./IconButton";
export { ButtonGroup, type ButtonGroupProps } from "./ButtonGroup";
export { LinkButton, type LinkButtonProps, type LinkButtonVariant } from "./LinkButton";
export { FAB, type FABProps, type FABPosition } from "./FAB";
export { ConfirmButton, type ConfirmButtonProps } from "./ConfirmButton";
export { ArchiveButton, type ArchiveButtonProps } from "./ArchiveButton";
export { AnonymizeButton, type AnonymizeButtonProps } from "./AnonymizeButton";
export { CopyButton, type CopyButtonProps } from "./CopyButton";
export { SignOutButton, type SignOutButtonProps } from "./SignOutButton";
export {
  ProviderSignInButtons,
  type ProviderSignInButtonsProps,
  type SignInProvider,
} from "./ProviderSignInButtons";
export { QuickActionPanel, type QuickActionPanelProps, type QuickAction } from "./QuickActionPanel";
export { ExportControl, type ExportControlProps, type ExportFormat } from "./ExportControl";
export { CallSheetPublishBar, type CallSheetPublishBarProps } from "./CallSheetPublishBar";
export { ApprovalActions, type ApprovalActionsProps } from "./ApprovalActions";

// UI element catalog batch F
export {
  MenuButton,
  MenuPopup,
  SplitButton,
  ShareMenu,
  FabMenu,
  defaultShareTargets,
  type MenuAction,
  type MenuButtonProps,
  type MenuPopupProps,
  type SplitButtonProps,
  type ShareMenuProps,
  type FabMenuProps,
} from "./MenuButton";
export { ContextMenu, type ContextMenuProps } from "./ContextMenu";
export {
  SaveDraftButton,
  BulkActionBar,
  savedAgo,
  type SaveDraftButtonProps,
  type BulkActionBarProps,
  type BulkAction,
} from "./WorkActions";

// Component metadata for Storybook and docs
export const actionComponents = [
  {
    id: "icon-button",
    name: "IconButton",
    component: "IconButton",
    category: "Actions",
    description: "An icon-only button for compact, high-frequency actions",
    variants: ["primary", "secondary", "tertiary", "danger"],
    sizes: ["sm", "md", "lg"],
  },
  {
    id: "button-group",
    name: "ButtonGroup",
    component: "ButtonGroup",
    category: "Actions",
    description: "Groups related buttons together, visually connected or spaced apart",
  },
  {
    id: "link-button",
    name: "LinkButton",
    component: "LinkButton",
    category: "Actions",
    description: "A navigational, button-weight link styled as text rather than a filled button",
    variants: ["primary", "secondary", "danger"],
  },
  {
    id: "fab",
    name: "FAB",
    component: "FAB",
    category: "Actions",
    description: "A floating action button for a screen's primary, most-frequent action",
    sizes: ["md", "lg"],
  },
  {
    id: "confirm-button",
    name: "ConfirmButton",
    component: "ConfirmButton",
    category: "Actions",
    description: "A button that requires an inline second confirmation before firing",
  },
];
