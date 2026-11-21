/**
 * @maataa/ui/forms
 * Category: forms
 * Form components for user input
 */

// Select
export {
  Select,
  type SelectProps,
  type SelectOption,
  type SelectOptionState,
  type SelectView,
} from "./Select";

// Checkbox
export { Checkbox, type CheckboxProps } from "./Checkbox";

// Radio
export { Radio, RadioGroup, type RadioProps, type RadioGroupProps } from "./Radio";

// Toggle
export { Toggle, type ToggleProps } from "./Toggle";

// ToggleGroup
export { ToggleGroup, type ToggleGroupProps, type ToggleGroupOption } from "./ToggleGroup";

// Core form components (MUI-03)
export { FieldShell, type FieldShellProps } from "./FieldShell";
export { Textarea, type TextareaProps } from "./Textarea";
export { SearchInput, type SearchInputProps } from "./SearchInput";
export { Slider, type SliderProps } from "./Slider";
export { FileInput, type FileInputProps } from "./FileInput";
export { Form, type FormProps } from "./Form";
export { FormRow, type FormRowProps } from "./FormRow";
export { FormSection, type FormSectionProps } from "./FormSection";
export {
  ValidationMessage,
  type ValidationMessageProps,
  type ValidationMessageType,
} from "./ValidationMessage";
export { FormActions, type FormActionsProps } from "./FormActions";

// Date & time components (MUI-03 extension)
export { DatePicker, type DatePickerProps } from "./DatePicker";
export { TimePicker, type TimePickerProps } from "./TimePicker";
export { DateTimePicker, type DateTimePickerProps } from "./DateTimePicker";
export { DateRangePicker, type DateRangePickerProps, type DateRange } from "./DateRangePicker";

// Core workflow inputs
export { DurationPicker, formatMinutes, type DurationPickerProps } from "./DurationPicker";
export {
  FileDropzone,
  formatBytes,
  fileMatchesAccept,
  type FileDropzoneProps,
  type FileRejection,
} from "./FileDropzone";
export {
  AttachmentUploader,
  type AttachmentUploaderProps,
  type Attachment,
} from "./AttachmentUploader";
export { AvatarUpload, type AvatarUploadProps } from "./AvatarUpload";
export { ConsentToggle, type ConsentToggleProps } from "./ConsentToggle";
export {
  ReviewerSelector,
  validateReviewers,
  type ReviewerSelectorProps,
  type ReviewerRole,
  type ReviewerCandidate,
  type ReviewerAssignment,
} from "./ReviewerSelector";

// Catalogue A: search, auth, onboarding
export {
  SearchWithResults,
  type SearchWithResultsProps,
  type SearchResult,
} from "./SearchWithResults";
export { ErrorSummary, type ErrorSummaryProps, type FormError } from "./ErrorSummary";
export {
  PasswordInput,
  defaultPasswordRules,
  type PasswordInputProps,
  type PasswordRule,
} from "./PasswordInput";
export {
  SignInForm,
  SignUpForm,
  PasswordResetRequestForm,
  PasswordResetConfirmForm,
  type SignInFormProps,
  type SignInValues,
  type SignUpFormProps,
  type SignUpValues,
  type PasswordResetRequestFormProps,
  type PasswordResetConfirmFormProps,
} from "./authForms";
export { MFAChallenge, type MFAChallengeProps } from "./MFAChallenge";
export {
  InvitationAcceptance,
  InvitationRecoveryPanel,
  type InvitationAcceptanceProps,
  type InvitationRecoveryPanelProps,
  type InvitationDetails,
  type InvitationProblem,
} from "./Invitation";
export {
  ChoiceCards,
  AccountTypeSelector,
  RoleSelectionGrid,
  accountTypeOptions,
  productionRoleOptions,
  type ChoiceCardsProps,
  type ChoiceCardOption,
  type AccountTypeSelectorProps,
  type RoleSelectionGridProps,
} from "./ChoiceCards";
export {
  LanguageSelector,
  CountrySelector,
  RegionSelector,
  CurrencySelector,
  type RegionValue,
  type RegionSelectorProps,
} from "./LocaleSelectors";
export {
  indianLanguages,
  indianStates,
  countryCodes,
  commonCurrencies,
  displayName,
} from "./localeData";

// Catalogue B
export { FilterBar, type FilterBarProps, type FilterDef } from "./FilterBar";
export {
  VisibilitySelector,
  type VisibilitySelectorProps,
  type Visibility,
} from "./VisibilitySelector";
export {
  ApplicationForm,
  type ApplicationFormProps,
  type ApplicationValues,
} from "./ApplicationForm";
export { InviteForm, parseEmails, type InviteFormProps } from "./InviteForm";
export {
  RoleAssignmentTable,
  type RoleAssignmentTableProps,
  type RoleMember,
} from "./RoleAssignmentTable";
export { PersonForm, type PersonFormProps, type PersonValues } from "./PersonForm";
export { VersionSelector, type VersionSelectorProps, type VersionOption } from "./VersionSelector";
export { BudgetLineEditor, type BudgetLineEditorProps, type BudgetLine } from "./BudgetLineEditor";

// Catalogue C
export { SlotPicker, type SlotPickerProps, type Slot } from "./SlotPicker";
export { JobPostingForm, type JobPostingFormProps, type JobPostingValues } from "./JobPostingForm";
export {
  ReferenceCheckPanel,
  type ReferenceCheckPanelProps,
  type ReferenceCheck,
} from "./ReferenceCheckPanel";
export { PinSelector, parseLatLng, type PinSelectorProps, type Pin } from "./PinSelector";
export {
  AvailabilityCalendar,
  type AvailabilityCalendarProps,
  type DateRangeValue,
} from "./AvailabilityCalendar";
export { BookingForm, type BookingFormProps, type BookingValues } from "./BookingForm";
export {
  EquipmentCheckoutSheet,
  type EquipmentCheckoutSheetProps,
  type CheckoutLine,
  type GearCondition,
} from "./EquipmentCheckoutSheet";
export {
  CallSheetEditor,
  type CallSheetEditorProps,
  type CallSheetDay,
  type SceneRow,
} from "./CallSheetEditor";
export {
  DistributionListSelector,
  type DistributionListSelectorProps,
  type Recipient,
} from "./DistributionListSelector";
export {
  TimesheetEntryForm,
  OvertimeIndicator,
  hoursWorked,
  formatHM,
  type TimesheetEntryFormProps,
  type TimesheetDay,
  type OvertimeIndicatorProps,
} from "./TimesheetEntryForm";
export { WrapForm, WrapSummary, type WrapFormProps, type WrapValues } from "./WrapForm";
export { IncidentForm, type IncidentFormProps, type IncidentValues } from "./IncidentForm";

// Catalogue D: script
export {
  ScriptEditor,
  FormatToolbar,
  SceneNavigator,
  CharacterTracker,
  scenesOf,
  charactersOf,
  elementLabels,
  nextElementType,
  type ScriptEditorProps,
  type ScriptElement,
  type ScriptElementType,
  type FormatToolbarProps,
  type SceneNavigatorProps,
} from "./ScriptEditor";

// Catalogue E
export {
  TerritoryMatrix,
  WindowEditor,
  windowConflicts,
  type RightsState,
  type TerritoryMatrixProps,
  type ReleaseWindow,
  type WindowEditorProps,
} from "./DistributionEditors";
export {
  ScreeningFeedbackForm,
  type ScreeningFeedbackFormProps,
  type FeedbackValues,
} from "./ScreeningFeedbackForm";
export { AssumptionEditor, type AssumptionEditorProps, type Assumption } from "./AssumptionEditor";
export {
  EvidencePackBuilder,
  SharePermissions,
  type PackDocument,
  type EvidencePackBuilderProps,
  type ShareGrant,
  type SharePermissionsProps,
} from "./EvidencePack";
export {
  CrowdfundingCampaignBuilder,
  campaignProblems,
  type CampaignDraft,
  type RewardTier,
  type CrowdfundingCampaignBuilderProps,
} from "./CrowdfundingCampaignBuilder";
export {
  PricingSourceTable,
  PricingWorksheet,
  priceSteps,
  type PriceSource,
  type PricingLine,
  type PricingSourceTableProps,
  type PricingWorksheetProps,
} from "./Pricing";
export {
  AccountSettingsForm,
  type AccountSettings,
  type AccountSettingsFormProps,
} from "./AccountSettingsForm";
export {
  ReadingFontToggle,
  readingFontStacks,
  type ReadingFont,
  type ReadingFontToggleProps,
} from "./ReadingFontToggle";

// Component metadata for Storybook and docs
export {
  AppliedFilterChips,
  SortSelector,
  type AppliedFilterChipsProps,
  type AppliedFilter,
  type SortSelectorProps,
  type SortField,
  type SortValue,
} from "./ListControls";

export const formComponents = [
  {
    id: "field-shell",
    name: "FieldShell",
    component: "FieldShell",
    category: "Forms",
    description: "Shared label / helper-text / error-message wrapper for custom form controls",
  },
  {
    id: "textarea",
    name: "Textarea",
    component: "Textarea",
    category: "Forms",
    description: "A multi-line text input with label, error, and helper text support",
  },
  {
    id: "search-input",
    name: "SearchInput",
    component: "SearchInput",
    category: "Forms",
    description: "A text input specialized for search, with a search icon and clear button",
  },
  {
    id: "slider",
    name: "Slider",
    component: "Slider",
    category: "Forms",
    description: "A range slider input with an optional live value readout",
  },
  {
    id: "file-input",
    name: "FileInput",
    component: "FileInput",
    category: "Forms",
    description: "A styled file picker button backed by a native, visually-hidden input",
  },
  {
    id: "form",
    name: "Form",
    component: "Form",
    category: "Forms",
    description:
      "A form wrapper with consistent vertical field spacing and default-submit prevention",
  },
  {
    id: "form-row",
    name: "FormRow",
    component: "FormRow",
    category: "Forms",
    description: "Lays multiple fields out side by side, wrapping on narrow widths",
  },
  {
    id: "form-section",
    name: "FormSection",
    component: "FormSection",
    category: "Forms",
    description: "Groups related fields under a heading and optional description",
  },
  {
    id: "validation-message",
    name: "ValidationMessage",
    component: "ValidationMessage",
    category: "Forms",
    description: "A standalone inline validation feedback message",
    variants: ["error", "warning", "success", "info"],
  },
  {
    id: "form-actions",
    name: "FormActions",
    component: "FormActions",
    category: "Forms",
    description: "A footer row for a form's submit/cancel buttons",
  },
  {
    id: "date-picker",
    name: "DatePicker",
    component: "DatePicker",
    category: "Forms",
    description: "A single-date field backed by a floating month calendar",
  },
  {
    id: "time-picker",
    name: "TimePicker",
    component: "TimePicker",
    category: "Forms",
    description: "A time-of-day field built on the native time input",
  },
  {
    id: "date-time-picker",
    name: "DateTimePicker",
    component: "DateTimePicker",
    category: "Forms",
    description: "Combines DatePicker and TimePicker into a single date+time value",
  },
  {
    id: "date-range-picker",
    name: "DateRangePicker",
    component: "DateRangePicker",
    category: "Forms",
    description: "A start/end date range field backed by a floating month calendar",
  },
];

// UI element catalog batch F
export { FieldFrame, controlStyle, type FieldFrameProps, type FieldIds } from "./fieldKit";
export {
  UrlInput,
  TelInput,
  PercentageInput,
  validateUrl,
  normalizeTel,
  commonDialCodes,
  type UrlInputProps,
  type TelInputProps,
  type TelValue,
  type DialCode,
  type PercentageInputProps,
} from "./TypedInputs";
export {
  MonthPicker,
  WeekPicker,
  isoWeek,
  isoWeekStart,
  weeksInYear,
  parseMonth,
  parseWeek,
  formatMonthValue,
  formatWeekValue,
  type MonthPickerProps,
  type WeekPickerProps,
} from "./PeriodPickers";
export {
  ImageCropUpload,
  clampCrop,
  type ImageCropUploadProps,
  type CropArea,
} from "./ImageCropUpload";
export {
  CoordinateInput,
  formatCoordinates,
  type CoordinateInputProps,
  type Coordinates,
} from "./CoordinateInput";
export { SignaturePad, type SignaturePadProps, type SignatureValue } from "./SignaturePad";
export { OtpInput, type OtpInputProps } from "./OtpInput";
export { TagInput, type TagInputProps } from "./TagInput";
export {
  MentionInput,
  mentionedIn,
  type MentionInputProps,
  type Mentionable,
} from "./MentionInput";
export { RichTextEditor, renderMarkdown, type RichTextEditorProps } from "./RichTextEditor";
export { CodeEditor, caretPosition, type CodeEditorProps } from "./CodeEditor";
export {
  FormulaInput,
  evaluateFormula,
  type FormulaInputProps,
  type FormulaResult,
  type FormulaVariable,
} from "./FormulaInput";
export {
  CascadingSelect,
  FilterPills,
  SegmentedControl,
  NumberStepper,
  type CascadingSelectProps,
  type CascadeOption,
  type FilterPillsProps,
  type FilterPill,
  type SegmentedControlProps,
  type SegmentOption,
  type NumberStepperProps,
} from "./SelectionControls";
export { TreeSelect, leavesOf, type TreeSelectProps, type TreeNode } from "./TreeSelect";
export {
  GazeSelectionGrid,
  DwellRing,
  ScanningSelector,
  YesNoButtons,
  useDwell,
  type GazeSelectionGridProps,
  type GazeItem,
  type DwellRingProps,
  type ScanningSelectorProps,
  type YesNoButtonsProps,
} from "./AlternativeInput";
