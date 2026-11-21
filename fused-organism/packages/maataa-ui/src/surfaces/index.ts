/**
 * @maataa/ui/surfaces
 * Surface components - larger UI containers and layouts
 *
 * Includes: Modal, Toast, Tooltip, Popover, Dropdown
 */

// Core Surface Components
export { Modal, type ModalProps } from "./Modal";
export { Toast, ToastContainer, type ToastProps, type ToastType } from "./Toast";

// Overlay Components (MUI-03 Phase 2)
export { Tooltip, type TooltipProps } from "./Tooltip";
export { Popover, type PopoverProps } from "./Popover";
export { Dropdown, type DropdownProps, type DropdownItem } from "./Dropdown";

// Core surface components (MUI-05)
export { Panel, type PanelProps } from "./Panel";
export { Drawer, type DrawerProps, type DrawerPlacement } from "./Drawer";
export { Sheet, type SheetProps } from "./Sheet";

// Confirmation dialogs
export {
  ConfirmDialog,
  TypedConfirmDialog,
  type ConfirmDialogProps,
  type TypedConfirmDialogProps,
} from "./ConfirmDialog";

// Catalogue A: screens, recovery, palette, notifications, brand
export {
  StatusScreen,
  PermissionDeniedScreen,
  SessionExpiredScreen,
  OnboardingCompleteScreen,
  NotFoundScreen,
  type StatusScreenProps,
} from "./StatusScreen";
export {
  ErrorBoundary,
  ErrorFallback,
  type ErrorBoundaryProps,
  type ErrorFallbackProps,
} from "./ErrorBoundary";
export {
  ConflictResolutionPanel,
  type ConflictResolutionPanelProps,
  type ConflictField,
} from "./ConflictResolutionPanel";
export {
  CommandPalette,
  filterCommands,
  useCommandPaletteShortcut,
  type CommandPaletteProps,
  type Command,
} from "./CommandPalette";
export {
  NotificationPanel,
  NotificationDetail,
  type NotificationPanelProps,
  type NotificationDetailProps,
  type NotificationItem,
} from "./NotificationPanel";
export {
  BrandLogo,
  type BrandLogoProps,
  type BrandLogoVariant,
  type BrandLogoTone,
} from "./BrandLogo";
export { SplashScreen, type SplashScreenProps } from "./SplashScreen";
export { SettingsPanel, type SettingsPanelProps, type SettingsSection } from "./SettingsPanel";
export {
  MasterApprovalPanel,
  type MasterApprovalPanelProps,
  type Deliverable,
} from "./MasterApprovalPanel";

// Component metadata
export { UndoSnackbar, type UndoSnackbarProps } from "./UndoSnackbar";

export {
  ImageCard,
  ProfileCard,
  PricingTierCard,
  ServiceCard,
  InsetCard,
  GlassPanel,
  CompareGrid,
  PreviewFrame,
  FullScreenModal,
  type ImageCardProps,
  type ProfileCardProps,
  type PricingTierCardProps,
  type ServiceCardProps,
  type InsetCardProps,
  type GlassPanelProps,
  type CompareGridProps,
  type PreviewFrameProps,
  type FullScreenModalProps,
} from "./Containers";
export {
  ProgressToast,
  ConfettiBurst,
  type ProgressToastProps,
  type ConfettiBurstProps,
} from "./Celebrations";

export {
  ModeSwitch,
  ScreenReaderModeToggle,
  SimplifiedModeToggle,
  VoiceCommandGuide,
  EyeGazeCalibration,
  HapticFeedback,
  PictureBoard,
  vibrate,
  hapticPatterns,
  nineCalibrationPoints,
  type ModeSwitchProps,
  type VoiceCommand,
  type VoiceCommandGuideProps,
  type EyeGazeCalibrationProps,
  type CalibrationPoint,
  type HapticFeedbackProps,
  type HapticPattern,
  type PictureBoardProps,
  type PictureSymbol,
} from "./AccessibilityTools";

// UI element catalog batch K
export {
  Hero,
  FeatureCard,
  FeatureGrid,
  TestimonialCard,
  TestimonialCarousel,
  LogoStrip,
  StatsStrip,
  PricingCardRow,
  PricingTable,
  FAQAccordion,
  AnnouncementStrip,
  CookieConsentBanner,
  type HeroProps,
  type HeroAction,
  type Feature,
  type Testimonial,
  type PricingTableProps,
  type CookieChoices,
} from "./Marketing";
export { OnboardingTour, type OnboardingTourProps, type TourStep } from "./OnboardingTour";
export {
  ParticleSplash,
  GlassSplash,
  CameraScienceSplash,
  type SplashVariantProps,
} from "./SplashVariants";
export {
  ActionSheet,
  PullToRefresh,
  BackgroundSyncToast,
  PermissionPrompt,
  BiometricUnlock,
  type SheetAction,
  type ActionSheetProps,
  type PullToRefreshProps,
  type BackgroundSyncToastProps,
  type PermissionKind,
  type PermissionPromptProps,
  type BiometricUnlockProps,
} from "./MobilePatterns";

export const surfaceComponents = [
  {
    id: "modal",
    name: "Modal",
    component: "Modal",
    category: "Surfaces",
    description: "A dialog component for displaying content in a focused modal overlay",
    sizes: ["sm", "md", "lg"],
  },
  {
    id: "toast",
    name: "Toast",
    component: "Toast",
    category: "Surfaces",
    description: "A notification component that appears temporarily",
    variants: ["success", "error", "warning", "info"],
  },
  {
    id: "panel",
    name: "Panel",
    component: "Panel",
    category: "Surfaces",
    description: "A static layout region with an optional header, actions, and collapse toggle",
  },
  {
    id: "drawer",
    name: "Drawer",
    component: "Drawer",
    category: "Surfaces",
    description: "A slide-in overlay panel anchored to a screen edge",
    variants: ["left", "right", "top", "bottom"],
  },
  {
    id: "sheet",
    name: "Sheet",
    component: "Sheet",
    category: "Surfaces",
    description: "A bottom sheet overlay — the mobile-friendly counterpart to Modal/Drawer",
    sizes: ["sm", "md", "lg", "full"],
  },
];
