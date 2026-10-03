import type { OrnamentId } from "./geometry";

// Timing belongs to three overlapping waves, never to individual rings.
// Members share opacity, focus, and highlight timing; their opposing turns
// and scales give each wave depth without introducing a layer-by-layer stagger.
export const ENTRANCE_WAVES = {
  core: { delay: 0, duration: 2 },
  mantle: { delay: 0.5, duration: 2.35 },
  perimeter: { delay: 0.95, duration: 2.65 },
} as const;

export const ENTRANCES = {
  heart: { wave: "core", turn: -0.8, scale: 0.9 },
  wheel: { wave: "core", turn: 1.15, scale: 1.1 },
  braid: { wave: "core", turn: -0.65, scale: 0.94 },
  crown: { wave: "mantle", turn: 0.72, scale: 1.075 },
  lace: { wave: "mantle", turn: -1.05, scale: 0.96 },
  cardinal: { wave: "perimeter", turn: 0.5, scale: 1.07 },
  outer: { wave: "perimeter", turn: -0.65, scale: 0.92 },
} satisfies Record<
  OrnamentId,
  {
    wave: keyof typeof ENTRANCE_WAVES;
    turn: number;
    scale: number;
  }
>;

export const ENTRANCE_DURATION = Math.max(
  ...Object.values(ENTRANCE_WAVES).map(
    ({ delay, duration }) => delay + duration,
  ),
);

export function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function smoothstep(value: number) {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

const SETTLED = { opacity: 1, rotation: 0, scale: 1, blur: 0, flare: 0 };

export function getLayerEntrance(id: OrnamentId, seconds: number) {
  const cue = ENTRANCES[id];
  const wave = ENTRANCE_WAVES[cue.wave];
  const progress = clamp01((seconds - wave.delay) / wave.duration);
  // An exact endpoint prevents residual rotation, blur, or flashes on resize.
  if (seconds >= wave.delay + wave.duration) return SETTLED;
  const remaining = (1 - progress) ** 3;
  return {
    opacity: smoothstep(progress / 0.38),
    rotation: cue.turn * remaining,
    scale: 1 + (cue.scale - 1) * remaining,
    blur: 1 - smoothstep((progress - 0.04) / 0.64),
    flare: Math.sin(Math.PI * progress) ** 4,
  };
}

export function getIgnition(seconds: number) {
  const progress = clamp01(seconds / ENTRANCE_DURATION);
  return {
    radius: 25 + 1740 * (1 - (1 - progress) ** 1.65),
    opacity: Math.sin(Math.PI * progress) ** 2 * 0.28,
  };
}
