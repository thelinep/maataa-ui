/**
 * @maataa/ui/data
 * Category: data
 * Data visualization components — tables, metrics, and charts (MUI-07 start)
 */

export { Legend, type LegendProps, type LegendItem } from "./Legend";
export { EmptyState, type EmptyStateProps } from "./EmptyState";
export { Sparkline, type SparklineProps } from "./Sparkline";
export { MetricCard, type MetricCardProps } from "./MetricCard";
export { LineChart, type LineChartProps, type ChartSeries } from "./LineChart";
export { BarChart, type BarChartProps } from "./BarChart";
export { AreaChart, type AreaChartProps } from "./AreaChart";
export { DonutChart, type DonutChartProps, type DonutSlice } from "./DonutChart";
export { DataTable, type DataTableProps, type DataTableColumn } from "./DataTable";

// Core people, record and history components
export {
  Avatar,
  initialsOf,
  type AvatarProps,
  type AvatarSize,
  type PresenceStatus,
} from "./Avatar";
export { PersonRow, type PersonRowProps } from "./PersonRow";
export { Checklist, type ChecklistProps, type ChecklistItem } from "./Checklist";
export { ScenarioCard, type ScenarioCardProps, type ScenarioFigure } from "./ScenarioCard";
export {
  ReceiptDisplay,
  type ReceiptDisplayProps,
  type ReceiptLine,
  type ReceiptStatus,
} from "./ReceiptDisplay";
export { SourceAttribution, type SourceAttributionProps } from "./SourceAttribution";
export { Timeline, type TimelineProps, type TimelineEvent } from "./Timeline";
export {
  DeviceInfoCard,
  detectDevice,
  type DeviceInfoCardProps,
  type DeviceInfo,
} from "./DeviceInfoCard";
export { SummaryReview, type SummaryReviewProps, type SummarySection } from "./SummaryReview";

// Catalogue B: dispatch, dashboard, people, assets, budget, schedule, documents
export {
  ProductionListingCard,
  ProductionListingGrid,
  type ProductionListingItem,
  type ProductionListingCardProps,
  type ProductionListingGridProps,
} from "./ProductionListing";
export {
  RecordHeader,
  DetailList,
  type RecordHeaderProps,
  type DetailListProps,
} from "./RecordHeader";
export { DeadlineList, relativeDue, type DeadlineListProps, type Deadline } from "./DeadlineList";
export {
  ProjectSummaryCard,
  type ProjectSummaryCardProps,
  type ProjectSummary,
} from "./ProjectSummaryCard";
export { InvitationList, type InvitationListProps, type PendingInvitation } from "./InvitationList";
export {
  PeopleDirectory,
  type PeopleDirectoryProps,
  type DirectoryPerson,
} from "./PeopleDirectory";
export {
  AssetPreview,
  AssetGrid,
  type Asset,
  type AssetPreviewProps,
  type AssetGridProps,
} from "./AssetPreview";
export { VarianceBars, type VarianceBarsProps, type VarianceRow } from "./VarianceBars";
export {
  EventCalendar,
  eventsOn,
  type EventCalendarProps,
  type CalendarEvent,
  type CalendarView,
} from "./EventCalendar";
export {
  GanttTimeline,
  MilestoneMarker,
  type GanttTimelineProps,
  type GanttTask,
  type Milestone,
} from "./GanttTimeline";
export { TimezoneDisplay, zoneAbbr, type TimezoneDisplayProps } from "./TimezoneDisplay";
export {
  DocumentList,
  CleanDownloadButton,
  QuarantinePanel,
  ScannerFailureNotice,
  type DocumentItem,
  type DocumentListProps,
  type CleanDownloadButtonProps,
  type QuarantinePanelProps,
  type ScannerFailureNoticeProps,
} from "./DocumentList";
export { ScrollTable, type ScrollTableProps } from "./ScrollTable";

// Catalogue C: casting, locations, call sheets, timesheets, filming, drones, rehearsals
export {
  RoleBreakdownCard,
  type RoleBreakdownCardProps,
  type RoleBreakdown,
} from "./RoleBreakdownCard";
export {
  PipelineBoard,
  type PipelineBoardProps,
  type PipelineStage,
  type PipelineCard,
} from "./PipelineBoard";
export { ApplicantDetail, type ApplicantDetailProps, type Applicant } from "./ApplicantDetail";
export { CallbackList, type CallbackListProps, type Callback } from "./CallbackList";
export {
  OfferLetterPreview,
  templateFields,
  type OfferLetterPreviewProps,
} from "./OfferLetterPreview";
export {
  LocationGallery,
  LocationDetail,
  type FilmLocation,
  type LocationGalleryProps,
  type LocationDetailProps,
} from "./LocationGallery";
export { PermitStatusCard, type PermitStatusCardProps, type Permit } from "./PermitStatusCard";
export {
  EquipmentCatalog,
  type EquipmentCatalogProps,
  type EquipmentItem,
} from "./EquipmentCatalog";
export { ShareLinkDisplay, type ShareLinkDisplayProps } from "./ShareLinkDisplay";
export {
  DeliveryStatusList,
  type DeliveryStatusListProps,
  type DeliveryRecord,
} from "./DeliveryStatusList";
export {
  CallSheetPrintView,
  type CallSheetPrintViewProps,
  type CallContact,
} from "./CallSheetPrintView";
export {
  TimesheetList,
  TimesheetWeekSummary,
  type TimesheetListProps,
  type TimesheetSummary,
  type TimesheetWeekSummaryProps,
} from "./TimesheetViews";
export {
  SceneProgressTracker,
  type SceneProgressTrackerProps,
  type TrackedScene,
} from "./SceneProgressTracker";
export {
  DroneFlightLog,
  AltitudeDisplay,
  OperatorSelector,
  type DroneFlight,
  type DroneFlightLogProps,
  type AltitudeDisplayProps,
  type DroneOperator,
  type OperatorSelectorProps,
} from "./DroneViews";
export {
  RehearsalSceneList,
  AttendanceGrid,
  DirectorNotesPanel,
  RescheduleRequest,
  type RehearsalScene,
  type Attendance,
  type AttendanceGridProps,
  type DirectorNote,
  type DirectorNotesPanelProps,
  type RescheduleRequestProps,
} from "./RehearsalViews";

// Catalogue D: post-production
export {
  VersionHistoryList,
  type VersionHistoryListProps,
  type VersionEntry,
} from "./VersionHistoryList";
export { ReviewThread, type ReviewThreadProps, type ReviewNote } from "./ReviewThread";
export { VfxShotTable, type VfxShotTableProps, type VfxShot } from "./VfxShotTable";
export { CueList, cueLength, type CueListProps, type Cue } from "./CueList";

// Catalogue E: business workflows
export {
  MarketingCampaignCard,
  MarketingAssetLibrary,
  type MarketingCampaign,
  type MarketingCampaignCardProps,
  type MarketingAsset,
  type MarketingAssetLibraryProps,
} from "./MarketingViews";
export {
  DeliveryTracker,
  ScreeningAttendeeList,
  LegalMatterList,
  SignatureStatusList,
  SubsidyProgrammeList,
  type DeliveryItem,
  type Attendee,
  type LegalMatter,
  type Signatory,
  type SubsidyProgramme,
} from "./BusinessLists";
export {
  PitchRecipientSelector,
  PitchDeliveryReceipt,
  type PitchContact,
  type PitchRecipientSelectorProps,
  type PitchDeliveryReceiptProps,
} from "./PitchViews";
export {
  NetworkingContactList,
  PrivateNotes,
  type NetworkContact,
  type NetworkingContactListProps,
  type PrivateNote,
  type PrivateNotesProps,
} from "./NetworkingViews";

// UI element catalog batch G
export {
  ChartFigure,
  LegendList,
  CHART_COLORS,
  chartColor,
  type ChartFigureProps,
  type ChartTable,
} from "./chartKit";
export {
  HorizontalBarChart,
  GroupedBarChart,
  ThresholdBarChart,
  PieChart,
  FunnelChart,
  WaterfallChart,
  RadarChart,
  Heatmap,
  type Datum,
  type HorizontalBarChartProps,
  type GroupedBarChartProps,
  type ThresholdBarChartProps,
  type PieChartProps,
  type FunnelChartProps,
  type WaterfallChartProps,
  type RadarChartProps,
  type HeatmapProps,
} from "./MoreCharts";
export {
  AnimatedCounter,
  StackedProgressBar,
  ProgressRing,
  Gauge,
  type AnimatedCounterProps,
  type StackedProgressBarProps,
  type ProgressSegment,
  type ProgressRingProps,
  type GaugeProps,
  type GaugeBand,
} from "./Meters";
export {
  AgendaView,
  InlineEditGrid,
  ComparisonTable,
  DiffView,
  diffLines,
  type AgendaViewProps,
  type InlineEditGridProps,
  type GridColumn,
  type ComparisonTableProps,
  type ComparisonOption,
  type ComparisonRow,
  type DiffViewProps,
  type DiffLine,
} from "./TableViews";

// UI element catalog batch H: media
export {
  TimecodeReadout,
  MediaScrubber,
  TimelinePlayhead,
  AudioPlayer,
  Slate,
  formatTimecode,
  parseTimecode,
  clock,
  type TimecodeReadoutProps,
  type MediaScrubberProps,
  type ScrubMarker,
  type TimelinePlayheadProps,
  type AudioPlayerProps,
  type SlateProps,
} from "./MediaPlayback";
export {
  Waveform,
  SpectrumAnalyzer,
  VUMeter,
  peaksFrom,
  levelZone,
  spectrumBandHz,
  type WaveformProps,
  type SpectrumAnalyzerProps,
  type VUMeterProps,
} from "./AudioViz";
export {
  CameraPreview,
  ScreenRecordingBar,
  ScreenshotButton,
  AudioRecorder,
  VoiceCommandButton,
  LiveTranscript,
  VideoCallTile,
  type CameraPreviewProps,
  type ScreenRecordingBarProps,
  type ScreenshotButtonProps,
  type AudioRecorderProps,
  type VoiceCommandButtonProps,
  type LiveTranscriptProps,
  type TranscriptSegment,
  type VideoCallTileProps,
} from "./MediaCapture";

// UI element catalog batch J: domain composites
export {
  ScriptAnalysisChart,
  pagesFromEighths,
  CastingProfileCard,
  CallTimeBadge,
  SidesViewer,
  WardrobeScheduleCard,
  PerDiemTable,
  WaiverSignatureBlock,
  DeliverySpecCard,
  ApprovalFrameMarker,
  type SceneStat,
  type CastingProfileCardProps,
  type CallTimeBadgeProps,
  type SideLine,
  type SidesViewerProps,
  type WardrobeChange,
  type PerDiemRow,
  type WaiverSignatureBlockProps,
  type DeliverySpec,
  type ApprovalFrameMarkerProps,
} from "./ProductionComposites";
export {
  WeatherWidget,
  LocationComparisonCard,
  PermitTimelineStrip,
  VehicleCapacityCard,
  VehicleRateRow,
  CraftServiceMealCard,
  DietaryBadge,
  CrewPositionRow,
  DepartmentCoverageGrid,
  SkillMeter,
  PackageSummaryBar,
  DEPARTMENT_COLORS,
  type WeatherHour,
  type WeatherWidgetProps,
  type LocationOption,
  type PermitStep,
  type VehicleCapacityCardProps,
  type VehicleRate,
  type Diet,
  type CraftServiceMealCardProps,
  type CrewPosition,
  type PackageLine,
} from "./LogisticsComposites";
export {
  CostDriverRow,
  ScenarioSwitcher,
  ContractExpiryPill,
  daysUntil,
  inrShort,
  TokenBalanceCard,
  SmartContractStatusCard,
  ProfitDistributionRing,
  GovernanceVoteCard,
  PitchSlideThumbnail,
  InvestorRow,
  CrowdfundingProgressBar,
  RewardTierCard,
  AudienceRecommendationMeter,
  type CostDriver,
  type Scenario,
  type ContractState,
  type Share,
  type VoteOption,
  type Investor,
} from "./FinanceComposites";
export {
  ChakraCategoryRow,
  CHAKRAS,
  LanguageCulturalTimeline,
  AncestralChainFlow,
  TLPClassificationCard,
  type ChakraId,
  type ChakraCategoryRowProps,
  type CulturalEra,
  type Ancestor,
  type TLPLevel,
} from "./CultureComposites";

// Component metadata for Storybook and docs
export const dataComponents = [
  {
    id: "legend",
    name: "Legend",
    component: "Legend",
    category: "Data",
    description: "Series identity key for a chart with two or more series",
  },
  {
    id: "empty-state",
    name: "EmptyState",
    component: "EmptyState",
    category: "Data",
    description: "Placeholder for a table, chart, or list with nothing to show",
  },
  {
    id: "sparkline",
    name: "Sparkline",
    component: "Sparkline",
    category: "Data",
    description: "A compact, axis-free inline trend line",
  },
  {
    id: "metric-card",
    name: "MetricCard",
    component: "MetricCard",
    category: "Data",
    description: "A stat tile: label, headline value, optional delta and trend sparkline",
  },
  {
    id: "line-chart",
    name: "LineChart",
    component: "LineChart",
    category: "Data",
    description: "A multi-series line chart with gridlines, legend, and hover tooltip",
  },
  {
    id: "bar-chart",
    name: "BarChart",
    component: "BarChart",
    category: "Data",
    description: "A grouped bar chart with gridlines, legend, and hover tooltip",
  },
  {
    id: "area-chart",
    name: "AreaChart",
    component: "AreaChart",
    category: "Data",
    description: "A line chart with a soft fill wash under each series",
  },
  {
    id: "donut-chart",
    name: "DonutChart",
    component: "DonutChart",
    category: "Data",
    description: "Categorical share-of-total, as a ring of stroke segments",
  },
  {
    id: "data-table",
    name: "DataTable",
    component: "DataTable",
    category: "Data",
    description: "A sortable table — also the table view backing any chart's raw data",
  },
];
