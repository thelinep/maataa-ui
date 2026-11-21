/**
 * @maataa/ui/whiteboard
 * Category: whiteboard
 * Storyboard drawing, shot planning and mood boards
 */

export {
  DrawingToolPalette,
  drawingToolLabels,
  type DrawingTool,
  type DrawingToolPaletteProps,
} from "./DrawingToolPalette";
export {
  BrushColorPicker,
  storyboardSwatches,
  type BrushColorPickerProps,
  type Swatch,
} from "./BrushColorPicker";
export { FrameCanvas, type FrameCanvasProps, type FrameCanvasHandle } from "./FrameCanvas";
export {
  ShotTypeSelector,
  CameraAnglePicker,
  shotTypes,
  cameraAngles,
  type ShotTypeSelectorProps,
} from "./ShotPickers";
export {
  FrameTimelineStrip,
  moveItem,
  type FrameTimelineStripProps,
  type StoryFrame,
} from "./FrameTimelineStrip";
export { MoodBoardGallery, type MoodBoardGalleryProps, type MoodImage } from "./MoodBoardGallery";
export {
  ColorPaletteStrip,
  contrastRatio,
  type ColorPaletteStripProps,
  type PaletteColor,
} from "./ColorPaletteStrip";

// UI element catalog batch H
export {
  ShapeToolPicker,
  LayerStack,
  EffectsLibrary,
  LiveDrawingOverlay,
  RenderProgressRow,
  RenderQueue,
  type ShapeKind,
  type ShapeToolPickerProps,
  type Layer,
  type LayerStackProps,
  type EffectItem,
  type EffectsLibraryProps,
  type Annotation,
  type LiveDrawingOverlayProps,
  type RenderJob,
  type RenderState,
  type RenderProgressRowProps,
  type RenderQueueProps,
} from "./EditorPanels";
