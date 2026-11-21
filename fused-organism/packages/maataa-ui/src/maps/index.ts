/**
 * @maataa/ui/maps
 * Category: maps
 * Venue floor-plan and geographic map components
 */

export {
  VenueFloorPlan,
  type VenueFloorPlanProps,
  type FloorPlanZone,
  type FloorPlanZoneStatus,
} from "./VenueFloorPlan";
export { GeoMap, type GeoMapProps, type GeoMapPin, type GeoMapPinStatus } from "./GeoMap";

// Component metadata for Storybook and docs
// UI element catalog batch I
export {
  MapCanvas,
  useMap,
  usePercent,
  boundsAround,
  OrbPin,
  ClusteredMarkers,
  clusterPoints,
  RoutePolyline,
  pathLengthKm,
  AreaPolygon,
  RadiusCircle,
  AreaLabel,
  Graticule,
  QuadtreeGrid,
  CameraAngleAnnotation,
  WindLayer,
  CloudLayer,
  SatelliteOrbitPath,
  orbitGroundTrack,
  TrackerLayer,
  MapFeatureList,
  MapPopup,
  type LatLng,
  type MapCanvasProps,
  type MapPoint,
  type Cluster,
  type WindSample,
  type CloudCell,
  type TrackedVehicle,
  type MapFeatureListProps,
  type MapPopupProps,
} from "./MapCanvas";
export {
  MapLayerToggle,
  WeatherOverlayToggle,
  weatherLayers,
  ZoomSlider,
  MapLegend,
  CompassRose,
  ScaleBar,
  niceScale,
  GeoSearchBox,
  LocationThumbnailCard,
  type MapLayerOption,
  type MapLayerToggleProps,
  type ZoomSliderProps,
  type LegendEntry,
  type GeoResult,
  type GeoSearchBoxProps,
  type LocationThumbnailCardProps,
} from "./MapControls";
export {
  SunPositionWidget,
  MoonPositionWidget,
  TerrainProfile,
  RocketLaunch,
  type SunPositionWidgetProps,
  type MoonPositionWidgetProps,
  type ElevationSample,
  type RocketLaunchProps,
} from "./SkyWidgets";
export {
  sunPosition,
  sunTimes,
  moonPosition,
  moonIllumination,
  moonPhaseName,
  compassWord,
  haversineKm,
  bearingDeg,
  type SkyPosition,
  type SunTimes,
  type MoonIllumination,
} from "./skyMath";

export const mapsComponents = [
  {
    id: "venue-floor-plan",
    name: "VenueFloorPlan",
    component: "VenueFloorPlan",
    category: "Maps",
    description: "A zoomable/pannable floor-plan canvas with placeable, selectable zones",
  },
  {
    id: "geo-map",
    name: "GeoMap",
    component: "GeoMap",
    category: "Maps",
    description: "A lat/lng pin map with no external tile-service dependency",
  },
];
