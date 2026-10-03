import {
  ORNAMENT_LAYERS,
  drawRepeatedSlice,
  type OrnamentId,
} from "./geometry";
import {
  clamp01,
  ENTRANCE_DURATION,
  getIgnition,
  getLayerEntrance,
} from "./entrance";

export const SEAL_LAYERS = [
  ...ORNAMENT_LAYERS.map(({ id, label, repeats }) => ({ id, label, repeats })),
  { id: "light", label: "Light & embers", repeats: null },
] as const;
export type LayerId = OrnamentId | "light";
export type SealOptions = {
  framing: "reference" | "complete";
  glow: number;
  isolated: OrnamentId | null;
  sliceOnly: boolean;
  layers: Record<LayerId, boolean>;
};

export const DEFAULT_SEAL_OPTIONS: SealOptions = {
  framing: "complete",
  glow: 0.65,
  isolated: null,
  sliceOnly: false,
  layers: {
    heart: true,
    wheel: true,
    braid: true,
    crown: true,
    lace: true,
    cardinal: true,
    outer: true,
    light: true,
  },
};

const TAU = Math.PI * 2;
const EXTENT = 1790;
type Plate = {
  image: HTMLCanvasElement;
  bloom: HTMLCanvasElement;
  defocus: HTMLCanvasElement | null;
  bounds: [number, number, number, number];
  layer: (typeof ORNAMENT_LAYERS)[number];
};

function circle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
}

function makePlate(
  layer: (typeof ORNAMENT_LAYERS)[number],
  quality: number,
  sliceOnly = false,
): Plate {
  const extent = layer.radius + 96;
  // Tight bounds keep both the complete layers and enlarged unit slices sharp.
  const halfWidth = layer.radius * Math.sin(Math.PI / layer.repeats) + 30;
  const bounds: Plate["bounds"] = sliceOnly
    ? [
        -halfWidth,
        -layer.radius - 30,
        halfWidth * 2,
        layer.radius -
          layer.innerRadius * Math.cos(Math.PI / layer.repeats) +
          60,
      ]
    : [-extent, -extent, extent * 2, extent * 2];
  const [left, top, w, h] = bounds;
  const pixelsPerUnit = sliceOnly
    ? quality / Math.max(w, h)
    : Math.max(192 / w, quality / (EXTENT * 2));
  const image = document.createElement("canvas");
  image.width = Math.ceil(w * pixelsPerUnit);
  image.height = Math.ceil(h * pixelsPerUnit);
  const ctx = image.getContext("2d")!;
  ctx.scale(pixelsPerUnit, pixelsPerUnit);
  ctx.translate(-left, -top);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  if (sliceOnly) layer.drawSlice(ctx);
  else drawRepeatedSlice(ctx, layer);

  const bloom = document.createElement("canvas");
  bloom.width = Math.ceil(image.width / 2);
  bloom.height = Math.ceil(image.height / 2);
  const bloomCtx = bloom.getContext("2d")!;
  bloomCtx.filter = `blur(${Math.max(1.2, 5 * pixelsPerUnit)}px)`;
  bloomCtx.drawImage(image, 0, 0, bloom.width, bloom.height);
  // Preblur once, then dissolve from this plate into the sharp plate. No
  // animated full-canvas filter or path rebuilding in the render loop.
  let defocus: HTMLCanvasElement | null = null;
  if (!sliceOnly) {
    defocus = document.createElement("canvas");
    defocus.width = Math.ceil(image.width / 3);
    defocus.height = Math.ceil(image.height / 3);
    const defocusCtx = defocus.getContext("2d")!;
    defocusCtx.filter = `blur(${Math.max(1, 12 * pixelsPerUnit)}px)`;
    defocusCtx.drawImage(image, 0, 0, defocus.width, defocus.height);
  }
  return { image, bloom, defocus, bounds, layer };
}

function random(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function createSealRenderer(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return null;
  let width = 1;
  let height = 1;
  let pixelRatio = 1;
  let plates: Plate[] = [];
  let plateQuality = 0;
  let slicePlate: Plate | null = null;

  function resize(w: number, h: number) {
    width = w;
    height = h;
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * pixelRatio);
    canvas.height = Math.round(h * pixelRatio);
    const quality = Math.min(
      3200,
      Math.max(1600, Math.ceil(h * pixelRatio * 2.8)),
    );
    if (quality !== plateQuality) {
      plateQuality = quality;
      plates = ORNAMENT_LAYERS.map((layer) => makePlate(layer, quality));
      slicePlate = null;
    }
  }

  function render(
    seconds: number,
    options: SealOptions,
    entranceSeconds = ENTRANCE_DURATION,
  ) {
    if (!ctx || !plates.length) return;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#10090a";
    ctx.fillRect(0, 0, width, height);
    const complete = options.framing === "complete";
    const selected =
      options.isolated &&
      ORNAMENT_LAYERS.find((layer) => layer.id === options.isolated);
    const showSlice = selected && options.sliceOnly;
    const arrival = selected ? ENTRANCE_DURATION : entranceSeconds;
    // Inspect a slice upright, independent of the phase used in the full seal.
    const sliceBottom = selected
      ? selected.innerRadius * Math.cos(Math.PI / selected.repeats)
      : 0;
    const sliceCenter = selected ? (selected.radius + sliceBottom) / 2 : 0;
    const sliceWidth = selected
      ? selected.radius * Math.sin(Math.PI / selected.repeats) * 2 + 60
      : 1;
    const sliceHeight = selected ? selected.radius - sliceBottom + 80 : 1;
    const visibleExtent = selected ? selected.radius + 85 : EXTENT;
    const scale = showSlice
      ? Math.min((width - 80) / sliceWidth, (height - 150) / sliceHeight)
      : complete
        ? Math.min(width - 24, height - 30) / (visibleExtent * 2)
        : Math.max(height / 1810, width / 3500);
    const cx = width * 0.5;
    const cy = showSlice
      ? height * 0.53 + sliceCenter * scale
      : height * (complete ? 0.5 : 0.89);
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    const atmosphere = ctx.createRadialGradient(0, 0, 0, 0, 0, EXTENT * 1.4);
    atmosphere.addColorStop(0, "#4e2215");
    atmosphere.addColorStop(0.26, "#32130f");
    atmosphere.addColorStop(0.62, "#1c0c0b");
    atmosphere.addColorStop(1, "#10090a");
    ctx.fillStyle = atmosphere;
    ctx.fillRect(-cx / scale, -cy / scale, width / scale, height / scale);

    if (
      arrival < ENTRANCE_DURATION &&
      options.layers.light &&
      options.glow > 0
    ) {
      const ignition = getIgnition(arrival);
      const radius = ignition.radius;
      const wave = ctx.createRadialGradient(
        0,
        0,
        Math.max(0, radius - 70),
        0,
        0,
        radius + 35,
      );
      wave.addColorStop(0, "#ffb83b00");
      wave.addColorStop(0.6, "#e69b3440");
      wave.addColorStop(0.78, "#ffe6a0a0");
      wave.addColorStop(1, "#ffbd4a00");
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = ignition.opacity * options.glow;
      ctx.fillStyle = wave;
      circle(ctx, 0, 0, radius + 35);
      ctx.fill();
    }

    const breath = 0.98 + Math.sin(seconds * 0.8) * 0.02;
    if (showSlice && selected && slicePlate?.layer.id !== selected.id) {
      slicePlate = makePlate(selected, plateQuality, true);
    }
    const visiblePlates = showSlice && slicePlate ? [slicePlate] : plates;
    for (const plate of visiblePlates) {
      const { layer, bounds } = plate;
      if (
        options.isolated
          ? options.isolated !== layer.id
          : !options.layers[layer.id]
      )
        continue;
      const entrance = getLayerEntrance(layer.id, arrival);
      if (entrance.opacity === 0) continue;
      ctx.save();
      ctx.rotate(entrance.rotation);
      ctx.scale(entrance.scale, entrance.scale);
      if (options.layers.light && options.glow > 0) {
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = Math.min(
          1,
          options.glow *
            layer.bloom *
            breath *
            1.9 *
            entrance.opacity *
            (1 + entrance.flare * 2.4),
        );
        ctx.drawImage(plate.bloom, ...bounds);
      }
      ctx.globalCompositeOperation = "source-over";
      if (plate.defocus && entrance.blur > 0) {
        ctx.globalAlpha = breath * entrance.opacity * entrance.blur;
        ctx.drawImage(plate.defocus, ...bounds);
      }
      ctx.globalAlpha = breath * entrance.opacity * (1 - entrance.blur);
      ctx.drawImage(plate.image, ...bounds);
      // A single highlight crest travels through each ring as it comes into
      // focus. It resolves completely, leaving the original drawing intact.
      if (options.layers.light && entrance.flare > 0) {
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = Math.min(
          1,
          entrance.opacity *
            entrance.flare *
            (1 - entrance.blur) *
            options.glow *
            0.65,
        );
        ctx.drawImage(plate.image, ...bounds);
      }
      ctx.restore();
    }

    if (options.layers.light) {
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < 45; i++) {
        const x = (random(i + 1) - 0.5) * EXTENT * 2.4;
        const y =
          EXTENT -
          ((random(i + 200) * EXTENT * 2 +
            seconds * (9 + random(i + 400) * 18)) %
            (EXTENT * 2));
        const a = random(i + 500);
        ctx.globalAlpha =
          (0.1 + a * 0.35) *
          (0.7 + Math.sin(seconds + i) * 0.2) *
          clamp01(arrival / 2.5);
        ctx.fillStyle = "#eec882";
        circle(ctx, x + Math.sin(seconds * 0.15 + i) * 12, y, 0.9 + a * 1.8);
        ctx.fill();
      }
      // A small luminous heart; broad bloom never obscures the fine geometry.
      if (!options.isolated && options.layers.heart) {
        const core = ctx.createRadialGradient(0, 0, 0, 0, 0, 55);
        core.addColorStop(0, "#fff1b475");
        core.addColorStop(0.12, "#ffdc6360");
        core.addColorStop(1, "#ffbb3000");
        ctx.globalAlpha =
          options.glow * breath * getLayerEntrance("heart", arrival).opacity;
        ctx.fillStyle = core;
        circle(ctx, 0, 0, 55);
        ctx.fill();
      }
    }
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
  }

  return { resize, render };
}
