import React, { useEffect, useMemo, useRef, useState } from "react";
import { colorTokens, radiusTokens } from "@maataa/tokens";
import { Camera3D, defaultCamera3D } from "./Camera3D";
import { Environment, Environment3D } from "./Environment";
import { createGeometry3D } from "./geometry3d";
import { Lighting, Lighting3D } from "./Lighting";
import { modelMatrix, multiply4, perspective4, viewMatrix } from "./math3d";
import { createModel3D, Model3D } from "./Model3D";
import { OrbitControl } from "./OrbitControl";
import { Snapshot } from "./Snapshot";
import { TransformControl } from "./TransformControl";
import { Viewport } from "./Viewport";

export interface Scene3DProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  models?: Model3D[];
  defaultModels?: Model3D[];
  onModelsChange?: (models: Model3D[]) => void;
  camera?: Camera3D;
  environment?: Environment3D;
  lighting?: Lighting3D;
  label?: string;
  readOnly?: boolean;
  onSnapshot?: (dataUrl: string) => void;
}

const vertexShader = `attribute vec3 aPosition; attribute vec3 aNormal; uniform mat4 uMvp; uniform mat4 uModel; varying vec3 vNormal; void main(){ gl_Position=uMvp*vec4(aPosition,1.0); vNormal=normalize(mat3(uModel)*aNormal); }`;
const fragmentShader = `precision mediump float; varying vec3 vNormal; uniform vec4 uColor; uniform vec3 uLight; uniform float uAmbient; uniform bool uUnlit; void main(){ float diffuse=max(dot(normalize(vNormal),normalize(uLight)),0.0); float shade=uUnlit?1.0:clamp(uAmbient+diffuse*(1.0-uAmbient),0.0,1.0); gl_FragColor=vec4(uColor.rgb*shade,uColor.a); }`;

function compile(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("The browser could not allocate a graphics shader.");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const error = gl.getShaderInfoLog(shader) ?? "Unknown shader error";
    gl.deleteShader(shader);
    throw new Error(`3D shader compilation failed: ${error}`);
  }
  return shader;
}

function hexColor(value: string): [number, number, number] {
  const hex = value.replace("#", "");
  const normalized =
    hex.length === 3
      ? hex
          .split("")
          .map((part) => part + part)
          .join("")
      : hex;
  const number = Number.parseInt(normalized, 16);
  if (!Number.isFinite(number)) return [0.98, 0.96, 0.93];
  return [((number >> 16) & 255) / 255, ((number >> 8) & 255) / 255, (number & 255) / 255];
}

function makeGrid(): Float32Array {
  const values: number[] = [];
  for (let step = -10; step <= 10; step += 1) {
    values.push(step, -0.76, -10, step, -0.76, 10, -10, -0.76, step, 10, -0.76, step);
  }
  return new Float32Array(values);
}

function makeAxes(): Float32Array {
  return new Float32Array([0, -0.75, 0, 2, -0.75, 0, 0, -0.75, 0, 0, 1.25, 0, 0, -0.75, 0, 0, -0.75, 2]);
}

/** A small WebGL scene editor for previews, spatial concepts, and simple object layout. */
export function Scene3D({
  models: controlledModels,
  defaultModels,
  onModelsChange,
  camera: initialCamera,
  environment: initialEnvironment,
  lighting: initialLighting,
  label = "3D scene",
  readOnly = false,
  onSnapshot,
  style,
  ...props
}: Scene3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderRef = useRef<(() => void) | null>(null);
  const stateRef = useRef<{
    models: Model3D[];
    camera: Camera3D;
    environment: Environment3D;
    lighting: Lighting3D;
  }>({
    models: [],
    camera: initialCamera ?? defaultCamera3D,
    environment: Environment(initialEnvironment),
    lighting: Lighting(initialLighting),
  });
  const [localModels, setLocalModels] = useState<Model3D[]>(
    () => defaultModels ?? [createModel3D({ id: "sample-cube", name: "Sample cube" })],
  );
  const models = controlledModels ?? localModels;
  const [camera, setCamera] = useState<Camera3D>(initialCamera ?? defaultCamera3D);
  const [environment] = useState<Environment3D>(() => Environment(initialEnvironment));
  const [lighting] = useState<Lighting3D>(() => Lighting(initialLighting));
  const [selectedId, setSelectedId] = useState<string | null>(models[0]?.id ?? null);
  const [mode, setMode] = useState<"orbit" | "pan">("orbit");
  const [error, setError] = useState<string | null>(null);
  const [contextEpoch, setContextEpoch] = useState(0);
  const pointerRef = useRef<{ id: number; x: number; y: number } | null>(null);
  const selected = models.find((model) => model.id === selectedId) ?? null;
  stateRef.current = { models, camera, environment, lighting };

  const buttonStyle = useMemo<React.CSSProperties>(
    () => ({
      minHeight: 34,
      padding: "0 10px",
      border: `1px solid ${colorTokens.border.primary}`,
      borderRadius: radiusTokens.md,
      background: colorTokens.background.primary,
      color: colorTokens.text.primary,
      font: "inherit",
      cursor: "pointer",
    }),
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    let gl: WebGLRenderingContext | null = null;
    try {
      gl = canvas.getContext("webgl", { alpha: false, antialias: true, preserveDrawingBuffer: true });
      if (!gl)
        throw new Error(
          "WebGL is unavailable in this browser. Try a browser with hardware acceleration enabled.",
        );
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "WebGL is unavailable in this browser.");
      return undefined;
    }
    let program: WebGLProgram | null = null;
    let positionBuffer: WebGLBuffer | null = null;
    let normalBuffer: WebGLBuffer | null = null;
    let gridBuffer: WebGLBuffer | null = null;
    let axesBuffer: WebGLBuffer | null = null;
    const geometryBuffers = new Map<
      string,
      { positions: WebGLBuffer; normals: WebGLBuffer; count: number }
    >();
    try {
      const vertex = compile(gl, gl.VERTEX_SHADER, vertexShader);
      const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentShader);
      program = gl.createProgram();
      if (!program) throw new Error("The browser could not allocate a 3D scene program.");
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        throw new Error(
          `3D program linking failed: ${gl.getProgramInfoLog(program) ?? "Unknown program error"}`,
        );
      positionBuffer = gl.createBuffer();
      normalBuffer = gl.createBuffer();
      gridBuffer = gl.createBuffer();
      axesBuffer = gl.createBuffer();
      if (!positionBuffer || !normalBuffer || !gridBuffer || !axesBuffer)
        throw new Error("The browser could not allocate scene geometry buffers.");
      const grid = makeGrid();
      gl.bindBuffer(gl.ARRAY_BUFFER, gridBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, grid, gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, axesBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, makeAxes(), gl.STATIC_DRAW);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      const render = () => {
        if (!program || !positionBuffer || !normalBuffer || !gridBuffer || !axesBuffer) return;
        const state = stateRef.current;
        const rect = canvas.getBoundingClientRect();
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        const width = Math.max(1, Math.round(rect.width * ratio));
        const height = Math.max(1, Math.round(rect.height * ratio));
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }
        gl!.viewport(0, 0, width, height);
        const background = hexColor(state.environment.background);
        gl!.clearColor(background[0], background[1], background[2], 1);
        gl!.clear(gl!.COLOR_BUFFER_BIT | gl!.DEPTH_BUFFER_BIT);
        gl!.useProgram(program);
        const positionLocation = gl!.getAttribLocation(program, "aPosition");
        const normalLocation = gl!.getAttribLocation(program, "aNormal");
        const mvpLocation = gl!.getUniformLocation(program, "uMvp");
        const modelLocation = gl!.getUniformLocation(program, "uModel");
        const colorLocation = gl!.getUniformLocation(program, "uColor");
        const lightLocation = gl!.getUniformLocation(program, "uLight");
        const ambientLocation = gl!.getUniformLocation(program, "uAmbient");
        const unlitLocation = gl!.getUniformLocation(program, "uUnlit");
        const viewProjection = multiply4(
          perspective4(state.camera.fieldOfView, width / height),
          viewMatrix(state.camera),
        );
        if (state.environment.grid) {
          gl!.bindBuffer(gl!.ARRAY_BUFFER, gridBuffer);
          gl!.enableVertexAttribArray(positionLocation);
          gl!.vertexAttribPointer(positionLocation, 3, gl!.FLOAT, false, 0, 0);
          gl!.disableVertexAttribArray(normalLocation);
          gl!.vertexAttrib3f(normalLocation, 0, 1, 0);
          gl!.uniformMatrix4fv(mvpLocation, false, viewProjection);
          gl!.uniformMatrix4fv(
            modelLocation,
            false,
            new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
          );
          const gridColor = hexColor(state.environment.gridColor);
          gl!.uniform4f(colorLocation, gridColor[0], gridColor[1], gridColor[2], 0.56);
          gl!.uniform1f(ambientLocation, 1);
          gl!.uniform1i(unlitLocation, 1);
          gl!.drawArrays(gl!.LINES, 0, 84);
          if (state.environment.axes) {
            gl!.bindBuffer(gl!.ARRAY_BUFFER, axesBuffer);
            gl!.vertexAttribPointer(positionLocation, 3, gl!.FLOAT, false, 0, 0);
            const axesColor = hexColor(state.environment.axesColor);
            gl!.uniform4f(colorLocation, axesColor[0], axesColor[1], axesColor[2], 0.95);
            gl!.drawArrays(gl!.LINES, 0, 6);
          }
        }
        state.models.forEach((model) => {
          let buffers = geometryBuffers.get(model.geometry);
          if (!buffers) {
            const geometry = createGeometry3D(model.geometry);
            const pBuffer = gl!.createBuffer();
            const nBuffer = gl!.createBuffer();
            if (!pBuffer || !nBuffer) return;
            gl!.bindBuffer(gl!.ARRAY_BUFFER, pBuffer);
            gl!.bufferData(gl!.ARRAY_BUFFER, geometry.positions, gl!.STATIC_DRAW);
            gl!.bindBuffer(gl!.ARRAY_BUFFER, nBuffer);
            gl!.bufferData(gl!.ARRAY_BUFFER, geometry.normals, gl!.STATIC_DRAW);
            buffers = { positions: pBuffer, normals: nBuffer, count: geometry.vertexCount };
            geometryBuffers.set(model.geometry, buffers);
          }
          const matrix = modelMatrix(model);
          const mvp = multiply4(viewProjection, matrix);
          const color = hexColor(model.material.color);
          gl!.bindBuffer(gl!.ARRAY_BUFFER, buffers.positions);
          gl!.enableVertexAttribArray(positionLocation);
          gl!.vertexAttribPointer(positionLocation, 3, gl!.FLOAT, false, 0, 0);
          gl!.bindBuffer(gl!.ARRAY_BUFFER, buffers.normals);
          gl!.enableVertexAttribArray(normalLocation);
          gl!.vertexAttribPointer(normalLocation, 3, gl!.FLOAT, false, 0, 0);
          gl!.uniformMatrix4fv(mvpLocation, false, mvp);
          gl!.uniformMatrix4fv(modelLocation, false, matrix);
          gl!.uniform4f(colorLocation, color[0], color[1], color[2], model.material.opacity);
          gl!.uniform3f(lightLocation, ...state.lighting.direction);
          gl!.uniform1f(ambientLocation, state.lighting.ambient);
          gl!.uniform1i(unlitLocation, model.material.unlit ? 1 : 0);
          gl!.drawArrays(gl!.TRIANGLES, 0, buffers.count);
        });
      };
      renderRef.current = render;
      const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(render);
      resizeObserver?.observe(canvas);
      if (!resizeObserver) window.addEventListener("resize", render);
      render();
      const onContextLost = (event: Event) => {
        event.preventDefault();
        setError(
          "The graphics context was interrupted. The 3D view will return when the browser restores it.",
        );
      };
      const onContextRestored = () => {
        setError(null);
        setContextEpoch((value) => value + 1);
      };
      canvas.addEventListener("webglcontextlost", onContextLost);
      canvas.addEventListener("webglcontextrestored", onContextRestored);
      setError(null);
      return () => {
        renderRef.current = null;
        resizeObserver?.disconnect();
        if (!resizeObserver) window.removeEventListener("resize", render);
        canvas.removeEventListener("webglcontextlost", onContextLost);
        canvas.removeEventListener("webglcontextrestored", onContextRestored);
        geometryBuffers.forEach((buffer) => {
          gl!.deleteBuffer(buffer.positions);
          gl!.deleteBuffer(buffer.normals);
        });
        if (positionBuffer) gl!.deleteBuffer(positionBuffer);
        if (normalBuffer) gl!.deleteBuffer(normalBuffer);
        if (gridBuffer) gl!.deleteBuffer(gridBuffer);
        if (axesBuffer) gl!.deleteBuffer(axesBuffer);
        if (program) gl!.deleteProgram(program);
      };
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The 3D scene could not start.");
      return undefined;
    }
  }, [contextEpoch]);

  useEffect(() => {
    renderRef.current?.();
  }, [models, camera, environment, lighting]);

  const commit = (next: Model3D[]) => {
    if (controlledModels === undefined) setLocalModels(next);
    onModelsChange?.(next);
  };
  const updateModel = (next: Model3D) => commit(models.map((model) => (model.id === next.id ? next : model)));
  const addModel = (geometry: "box" | "sphere") => {
    const next = [
      ...models,
      createModel3D({
        id: `model-${Date.now()}-${models.length}`,
        name: geometry === "box" ? "Cube" : "Sphere",
        geometry,
        position: [((models.length % 3) - 1) * 1.25, 0, 0],
      }),
    ];
    commit(next);
    setSelectedId(next[next.length - 1].id);
  };
  const removeSelected = () => {
    if (!selected || readOnly) return;
    const next = models.filter((model) => model.id !== selected.id);
    commit(next);
    setSelectedId(next[0]?.id ?? null);
  };
  const resetCamera = () => setCamera(defaultCamera3D);
  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (readOnly || event.button !== 0) return;
    pointerRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const pointer = pointerRef.current;
    if (!pointer || pointer.id !== event.pointerId) return;
    const dx = event.clientX - pointer.x;
    const dy = event.clientY - pointer.y;
    pointerRef.current = { ...pointer, x: event.clientX, y: event.clientY };
    setCamera((current) =>
      mode === "orbit"
        ? {
            ...current,
            yaw: current.yaw - dx * 0.008,
            pitch: Math.max(-1.35, Math.min(1.35, current.pitch + dy * 0.008)),
          }
        : {
            ...current,
            target: [
              current.target[0] - dx * current.distance * 0.002,
              current.target[1] + dy * current.distance * 0.002,
              current.target[2],
            ],
          },
    );
  };
  const handleWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    setCamera((current) => ({
      ...current,
      distance: Math.max(2.5, Math.min(18, current.distance * (event.deltaY > 0 ? 1.08 : 0.92))),
    }));
  };
  const takeSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      onSnapshot?.(canvas.toDataURL("image/png"));
    } catch {
      setError("This browser could not export a snapshot from the graphics canvas.");
    }
  };

  return (
    <Viewport
      label={label}
      {...props}
      className={`tlps-scene-viewport ${props.className ?? ""}`}
      style={{ color: colorTokens.text.primary, ...style }}
      toolbar={
        <>
          <button type="button" disabled={readOnly} onClick={() => addModel("box")} style={buttonStyle}>
            Add cube
          </button>
          <button type="button" disabled={readOnly} onClick={() => addModel("sphere")} style={buttonStyle}>
            Add sphere
          </button>
          <OrbitControl mode={mode} onModeChange={setMode} onReset={resetCamera} buttonStyle={buttonStyle} />
          <Snapshot onSnapshot={takeSnapshot} style={buttonStyle} />
        </>
      }
    >
      <style>{`.tlps-scene-layout{display:grid;grid-template-columns:minmax(0,1fr) minmax(200px,250px);min-height:480px}.tlps-scene-inspector{border-left:1px solid ${colorTokens.border.secondary};background:${colorTokens.background.secondary}}@media(max-width:760px){.tlps-scene-layout{grid-template-columns:minmax(0,1fr)}.tlps-scene-inspector{border-left:0;border-top:1px solid ${colorTokens.border.secondary}}}`}</style>
      <div className="tlps-scene-layout">
        <div
          style={{ position: "relative", minWidth: 0, minHeight: 480, background: environment.background }}
        >
          <canvas
            ref={canvasRef}
            aria-label={`${label} WebGL viewport`}
            role="img"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={() => {
              pointerRef.current = null;
            }}
            onPointerCancel={() => {
              pointerRef.current = null;
            }}
            onWheel={handleWheel}
            style={{
              width: "100%",
              height: "100%",
              minHeight: 480,
              display: "block",
              touchAction: "none",
              cursor: mode === "orbit" ? "grab" : "move",
            }}
          />
          {error && (
            <div
              role="status"
              style={{
                position: "absolute",
                inset: 12,
                display: "grid",
                placeContent: "center",
                gap: 8,
                textAlign: "center",
                padding: 20,
                borderRadius: radiusTokens.md,
                background: "rgba(250,246,241,.96)",
                color: colorTokens.text.primary,
              }}
            >
              <strong>3D preview unavailable</strong>
              <span>{error}</span>
            </div>
          )}
          <p
            aria-live="polite"
            style={{
              position: "absolute",
              left: 12,
              bottom: 4,
              fontSize: 11,
              color: colorTokens.text.secondary,
              pointerEvents: "none",
            }}
          >
            Drag to {mode === "orbit" ? "orbit" : "pan"} · Scroll to zoom
          </p>
        </div>
        <div className="tlps-scene-inspector">
          <div
            aria-label="Scene objects"
            style={{ padding: 12, borderBottom: `1px solid ${colorTokens.border.secondary}` }}
          >
            <strong style={{ fontSize: 12 }}>Scene objects</strong>
            {models.length === 0 ? (
              <p style={{ fontSize: 12, color: colorTokens.text.secondary }}>
                The scene is empty. Add a cube or sphere to start.
              </p>
            ) : (
              models.map((model) => (
                <button
                  key={model.id}
                  type="button"
                  aria-pressed={model.id === selectedId}
                  onClick={() => setSelectedId(model.id)}
                  style={{
                    display: "block",
                    width: "100%",
                    marginTop: 6,
                    padding: "7px 8px",
                    textAlign: "left",
                    border: `1px solid ${model.id === selectedId ? colorTokens.interactive.primary : colorTokens.border.primary}`,
                    borderRadius: radiusTokens.md,
                    background: colorTokens.background.primary,
                    color: colorTokens.text.primary,
                    font: "inherit",
                    cursor: "pointer",
                  }}
                >
                  {model.name}
                  <span style={{ float: "right", color: colorTokens.text.secondary, fontSize: 11 }}>
                    {model.geometry}
                  </span>
                </button>
              ))
            )}
          </div>
          <TransformControl model={selected} disabled={readOnly} onChange={updateModel} />
          {selected && (
            <div style={{ padding: "0 16px 16px" }}>
              <button
                type="button"
                disabled={readOnly}
                onClick={removeSelected}
                style={{ ...buttonStyle, width: "100%" }}
              >
                Remove object
              </button>
            </div>
          )}
        </div>
      </div>
    </Viewport>
  );
}
