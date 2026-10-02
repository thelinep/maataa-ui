import React, { useId, useRef, useState } from "react";
import { colorTokens, radiusTokens, spacingTokens } from "@maataa/tokens";

export type CanvasObjectKind = "rectangle" | "note" | "ellipse";

export interface CanvasObject {
  id: string;
  kind: CanvasObjectKind;
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  color?: string;
}

export interface CanvasPoint {
  x: number;
  y: number;
}

export interface CanvasSurfaceProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  items?: CanvasObject[];
  defaultItems?: CanvasObject[];
  onItemsChange?: (items: CanvasObject[]) => void;
  label?: string;
  readOnly?: boolean;
}

const WORLD_WIDTH = 1200;
const WORLD_HEIGHT = 760;
const GRID_SIZE = 24;
const itemColors = ["#E8A66A", "#AFC3B0", "#C5B5D8", "#E7C86D"];

/** Converts a pointer location to world coordinates while respecting SVG letterboxing. */
export function pointerToCanvasPoint(
  clientX: number,
  clientY: number,
  rect: Pick<DOMRect, "left" | "top" | "width" | "height">,
  viewBox: { x: number; y: number; width: number; height: number },
): CanvasPoint {
  const scale = Math.min(rect.width / viewBox.width, rect.height / viewBox.height) || 1;
  const drawnWidth = viewBox.width * scale;
  const drawnHeight = viewBox.height * scale;
  return {
    x: (clientX - rect.left - (rect.width - drawnWidth) / 2) / scale + viewBox.x,
    y: (clientY - rect.top - (rect.height - drawnHeight) / 2) / scale + viewBox.y,
  };
}

function nextId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `canvas-${Date.now()}-${Math.round(Math.random() * 1_000_000)}`;
}

function makeItem(kind: CanvasObjectKind, count: number): CanvasObject {
  const title =
    kind === "note" ? `Note ${count}` : kind === "ellipse" ? `Ellipse ${count}` : `Shape ${count}`;
  return {
    id: nextId(),
    kind,
    x: 420 + ((count - 1) % 4) * 32,
    y: 270 + ((count - 1) % 4) * 28,
    width: kind === "note" ? 220 : 180,
    height: kind === "note" ? 148 : 120,
    title,
    color: itemColors[(count - 1) % itemColors.length],
  };
}

/** A general-purpose, keyboard-accessible vector canvas with move, pan, zoom, and selection. */
export const CanvasSurface = React.forwardRef<HTMLDivElement, CanvasSurfaceProps>(function CanvasSurface(
  {
    items: controlledItems,
    defaultItems = [],
    onItemsChange,
    label = "Canvas",
    readOnly = false,
    style,
    ...props
  },
  ref,
) {
  const patternId = useId().replace(/:/g, "");
  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<
    | { kind: "move"; id: string; start: CanvasPoint; origin: CanvasPoint }
    | { kind: "pan"; startX: number; startY: number; originX: number; originY: number }
    | null
  >(null);
  const [localItems, setLocalItems] = useState(defaultItems);
  const items = controlledItems ?? localItems;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const viewBox = {
    x: (WORLD_WIDTH - WORLD_WIDTH / zoom) / 2 - pan.x,
    y: (WORLD_HEIGHT - WORLD_HEIGHT / zoom) / 2 - pan.y,
    width: WORLD_WIDTH / zoom,
    height: WORLD_HEIGHT / zoom,
  };
  const selected = items.find((item) => item.id === selectedId) ?? null;

  const commit = (next: CanvasObject[]) => {
    if (controlledItems === undefined) setLocalItems(next);
    onItemsChange?.(next);
  };
  const addObject = (kind: CanvasObjectKind) => {
    const next = [...items, makeItem(kind, items.length + 1)];
    commit(next);
    setSelectedId(next[next.length - 1].id);
  };
  const updateObject = (id: string, changes: Partial<CanvasObject>) => {
    commit(items.map((item) => (item.id === id ? { ...item, ...changes } : item)));
  };
  const removeSelected = () => {
    if (!selectedId || readOnly) return;
    commit(items.filter((item) => item.id !== selectedId));
    setSelectedId(null);
  };
  const pointFromClient = (clientX: number, clientY: number) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return pointerToCanvasPoint(clientX, clientY, rect, viewBox);
  };
  const startPan = (event: React.PointerEvent<SVGSVGElement>) => {
    if (readOnly || event.button !== 0) return;
    dragRef.current = {
      kind: "pan",
      startX: event.clientX,
      startY: event.clientY,
      originX: pan.x,
      originY: pan.y,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };
  const startMove = (event: React.PointerEvent<SVGGElement>, item: CanvasObject) => {
    if (readOnly || event.button !== 0) return;
    event.stopPropagation();
    setSelectedId(item.id);
    const point = pointFromClient(event.clientX, event.clientY);
    dragRef.current = {
      kind: "move",
      id: item.id,
      start: point,
      origin: { x: item.x, y: item.y },
    };
    svgRef.current?.setPointerCapture?.(event.pointerId);
  };
  const movePointer = (event: React.PointerEvent<SVGSVGElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    if (drag.kind === "pan") {
      const rect = event.currentTarget.getBoundingClientRect();
      const scale = Math.min(rect.width / viewBox.width, rect.height / viewBox.height) || 1;
      setPan({
        x: drag.originX + (event.clientX - drag.startX) / scale,
        y: drag.originY + (event.clientY - drag.startY) / scale,
      });
      return;
    }
    const point = pointFromClient(event.clientX, event.clientY);
    const item = items.find((candidate) => candidate.id === drag.id);
    if (!item) return;
    updateObject(drag.id, {
      x: Math.max(0, Math.min(WORLD_WIDTH - item.width, drag.origin.x + point.x - drag.start.x)),
      y: Math.max(0, Math.min(WORLD_HEIGHT - item.height, drag.origin.y + point.y - drag.start.y)),
    });
  };
  const handleKeyDown = (event: React.KeyboardEvent<SVGSVGElement>) => {
    if (!selected || readOnly) return;
    const step = event.shiftKey ? 10 : 1;
    const offsets: Record<string, CanvasPoint> = {
      ArrowLeft: { x: -step, y: 0 },
      ArrowRight: { x: step, y: 0 },
      ArrowUp: { x: 0, y: -step },
      ArrowDown: { x: 0, y: step },
    };
    const offset = offsets[event.key];
    if (offset) {
      event.preventDefault();
      updateObject(selected.id, {
        x: Math.max(0, Math.min(WORLD_WIDTH - selected.width, selected.x + offset.x)),
        y: Math.max(0, Math.min(WORLD_HEIGHT - selected.height, selected.y + offset.y)),
      });
    } else if (event.key === "Delete" || event.key === "Backspace") {
      event.preventDefault();
      removeSelected();
    }
  };

  const buttonStyle: React.CSSProperties = {
    minHeight: 36,
    padding: `0 ${spacingTokens.sm}`,
    border: `1px solid ${colorTokens.border.primary}`,
    borderRadius: radiusTokens.md,
    background: colorTokens.background.primary,
    color: colorTokens.text.primary,
    font: "inherit",
    cursor: "pointer",
  };

  return (
    <section
      ref={ref}
      aria-label={`${label} editor`}
      style={{
        color: colorTokens.text.primary,
        background: colorTokens.background.primary,
        border: `1px solid ${colorTokens.border.primary}`,
        borderRadius: radiusTokens.lg,
        overflow: "hidden",
        ...style,
      }}
      {...props}
    >
      <style>{`.maataa-canvas-toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:12px 14px;border-bottom:1px solid ${colorTokens.border.secondary};background:${colorTokens.background.secondary}}.maataa-canvas-main{display:grid;grid-template-columns:minmax(0,1fr) 220px;min-height:460px}.maataa-canvas-stage{min-width:0;min-height:460px;overflow:hidden;background:${colorTokens.background.primary}}.maataa-canvas-inspector{padding:16px;border-left:1px solid ${colorTokens.border.secondary};background:${colorTokens.background.secondary}}.maataa-canvas-inspector label{display:block;margin:12px 0 5px;font-size:12px;color:${colorTokens.text.secondary}}.maataa-canvas-inspector input{box-sizing:border-box;width:100%;min-height:36px;padding:6px 8px;border:1px solid ${colorTokens.border.primary};border-radius:${radiusTokens.md};font:inherit;color:${colorTokens.text.primary};background:${colorTokens.background.primary}}.maataa-canvas-stage svg:focus-visible{outline:3px solid ${colorTokens.interactive.info};outline-offset:-3px}@media(max-width:760px){.maataa-canvas-main{grid-template-columns:1fr}.maataa-canvas-inspector{border-left:0;border-top:1px solid ${colorTokens.border.secondary}}.maataa-canvas-stage{min-height:360px}}`}</style>
      <div className="maataa-canvas-toolbar" role="toolbar" aria-label="Canvas tools">
        <button type="button" style={buttonStyle} disabled={readOnly} onClick={() => addObject("rectangle")}>
          Add shape
        </button>
        <button type="button" style={buttonStyle} disabled={readOnly} onClick={() => addObject("note")}>
          Add note
        </button>
        <button type="button" style={buttonStyle} disabled={readOnly} onClick={() => addObject("ellipse")}>
          Add ellipse
        </button>
        <span aria-hidden="true" style={{ flex: 1 }} />
        <button
          type="button"
          style={buttonStyle}
          aria-label="Zoom out"
          onClick={() => setZoom((value) => Math.max(0.5, Number((value - 0.25).toFixed(2))))}
        >
          −
        </button>
        <output
          aria-label="Canvas zoom"
          style={{ minWidth: 42, textAlign: "center", fontVariantNumeric: "tabular-nums" }}
        >
          {Math.round(zoom * 100)}%
        </output>
        <button
          type="button"
          style={buttonStyle}
          aria-label="Zoom in"
          onClick={() => setZoom((value) => Math.min(2.5, Number((value + 0.25).toFixed(2))))}
        >
          +
        </button>
        <button
          type="button"
          style={buttonStyle}
          onClick={() => {
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
        >
          Fit canvas
        </button>
      </div>
      <div className="maataa-canvas-main">
        <div className="maataa-canvas-stage">
          <svg
            ref={svgRef}
            viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
            role="application"
            aria-label={`${label}. ${items.length} objects. Select an object, then use arrow keys to move it; hold Shift to move farther.`}
            tabIndex={0}
            onPointerDown={startPan}
            onPointerMove={movePointer}
            onPointerUp={() => {
              dragRef.current = null;
            }}
            onPointerCancel={() => {
              dragRef.current = null;
            }}
            onKeyDown={handleKeyDown}
            style={{
              width: "100%",
              height: "100%",
              minHeight: 460,
              display: "block",
              touchAction: "none",
              cursor: dragRef.current?.kind === "pan" ? "grabbing" : "grab",
            }}
          >
            <defs>
              <pattern id={patternId} width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill={colorTokens.border.primary} opacity="0.72" />
              </pattern>
            </defs>
            <rect
              x={viewBox.x}
              y={viewBox.y}
              width={viewBox.width}
              height={viewBox.height}
              fill={colorTokens.background.primary}
            />
            <rect
              x={viewBox.x}
              y={viewBox.y}
              width={viewBox.width}
              height={viewBox.height}
              fill={`url(#${patternId})`}
              pointerEvents="none"
            />
            {items.length === 0 && (
              <g pointerEvents="none" textAnchor="middle" fill={colorTokens.text.secondary}>
                <text x={WORLD_WIDTH / 2} y={WORLD_HEIGHT / 2 - 10} fontSize="22" fontWeight="600">
                  Your canvas is clear
                </text>
                <text x={WORLD_WIDTH / 2} y={WORLD_HEIGHT / 2 + 24} fontSize="15">
                  Add a shape or note to start arranging ideas.
                </text>
              </g>
            )}
            {items.map((item) => {
              const selectedItem = item.id === selectedId;
              const fill = item.color ?? itemColors[0];
              return (
                <g
                  key={item.id}
                  role="button"
                  aria-label={`${item.title}, ${item.kind}`}
                  aria-pressed={selectedItem}
                  tabIndex={0}
                  onFocus={() => setSelectedId(item.id)}
                  onPointerDown={(event) => startMove(event, item)}
                  onDoubleClick={() => setSelectedId(item.id)}
                  style={{ cursor: readOnly ? "default" : "move", outline: "none" }}
                >
                  {item.kind === "ellipse" ? (
                    <ellipse
                      cx={item.x + item.width / 2}
                      cy={item.y + item.height / 2}
                      rx={item.width / 2}
                      ry={item.height / 2}
                      fill={fill}
                      opacity="0.88"
                    />
                  ) : (
                    <rect
                      x={item.x}
                      y={item.y}
                      width={item.width}
                      height={item.height}
                      rx={item.kind === "note" ? 5 : 12}
                      fill={fill}
                      opacity="0.9"
                    />
                  )}
                  {selectedItem && (
                    <rect
                      x={item.x - 5}
                      y={item.y - 5}
                      width={item.width + 10}
                      height={item.height + 10}
                      rx="14"
                      fill="none"
                      stroke={colorTokens.interactive.primary}
                      strokeWidth="3"
                      strokeDasharray="8 6"
                      pointerEvents="none"
                    />
                  )}
                  <text
                    x={item.x + 16}
                    y={item.y + 30}
                    fill={colorTokens.text.primary}
                    fontSize="18"
                    fontWeight="600"
                    pointerEvents="none"
                  >
                    {item.title}
                  </text>
                  {item.kind === "note" && (
                    <text
                      x={item.x + 16}
                      y={item.y + 58}
                      fill={colorTokens.text.primary}
                      fontSize="14"
                      opacity="0.8"
                      pointerEvents="none"
                    >
                      Double-click or rename in the inspector
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
        <aside className="maataa-canvas-inspector" aria-label="Canvas inspector">
          <strong style={{ fontSize: 13, letterSpacing: "0.02em" }}>Selection</strong>
          {selected ? (
            <>
              <label htmlFor={`${patternId}-title`}>Object name</label>
              <input
                id={`${patternId}-title`}
                value={selected.title}
                disabled={readOnly}
                onChange={(event) => updateObject(selected.id, { title: event.target.value })}
              />
              <p
                style={{ margin: "12px 0", fontSize: 12, lineHeight: 1.5, color: colorTokens.text.secondary }}
              >
                Position {Math.round(selected.x)}, {Math.round(selected.y)} · {selected.kind}
              </p>
              <button
                type="button"
                style={{ ...buttonStyle, width: "100%" }}
                disabled={readOnly}
                onClick={removeSelected}
              >
                Delete object
              </button>
              <p style={{ fontSize: 12, lineHeight: 1.5, color: colorTokens.text.secondary }}>
                Use arrow keys to nudge. Hold Shift for a larger step.
              </p>
            </>
          ) : (
            <p style={{ marginTop: 12, fontSize: 12, lineHeight: 1.5, color: colorTokens.text.secondary }}>
              Select an object to rename, move, or remove it. Drag the open canvas to pan.
            </p>
          )}
        </aside>
      </div>
    </section>
  );
});

CanvasSurface.displayName = "CanvasSurface";
export const Canvas = CanvasSurface;
export const SpatialCanvas = CanvasSurface;
