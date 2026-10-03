import { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  Layers2,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import type { CollectionConfig } from "../../types/collection";
import {
  createSealRenderer,
  DEFAULT_SEAL_OPTIONS,
  SEAL_LAYERS,
  type SealOptions,
} from "./solar-seal/renderer";
import { ENTRANCE_DURATION } from "./solar-seal/entrance";
import "./solar-seal/solar-seal.css";

export const config = {
  name: "Solar seal",
  description:
    "Seven concentric ornaments, each built from an intricate slice repeated four, six, twelve, or twenty-four times.",
  author: "Jeff UI Collections",
  version: "2.0.0",
  url: "",
  license: "MIT",
  tags: ["canvas", "generative", "light", "symmetry"],
  category: "experiments",
} satisfies CollectionConfig;

export default function SolarSeal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [options, setOptions] = useState<SealOptions>(DEFAULT_SEAL_OPTIONS);
  const [playing, setPlaying] = useState(
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [panelOpen, setPanelOpen] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const optionsRef = useRef(options);
  const playingRef = useRef(playing);
  const redrawRef = useRef<((settleEntrance?: boolean) => void) | null>(null);

  useEffect(() => {
    const changedView = optionsRef.current !== options;
    optionsRef.current = options;
    playingRef.current = playing;
    // Controls stay immediate. Inspecting a layer finishes the initial entrance
    // instead of replaying it or rotating an enlarged unit slice offscreen.
    redrawRef.current?.(changedView);
  }, [options, playing]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = createSealRenderer(canvas);
    if (!renderer) {
      setUnavailable(true);
      return;
    }
    let frame = 0;
    let elapsed = 0;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let entrance = motion.matches ? ENTRANCE_DURATION : 0;
    let last = 0;
    let disposed = false;
    let ready = false;
    let inView = typeof IntersectionObserver === "undefined";
    const draw = (now: number) => {
      frame = 0;
      if (disposed || !ready || !inView || document.hidden) return;
      if (last && playingRef.current) {
        const delta = Math.min(now - last, 64) / 1000;
        elapsed += delta;
        entrance = Math.min(ENTRANCE_DURATION, entrance + delta);
      }
      last = now;
      renderer.render(elapsed, optionsRef.current, entrance);
      if (playingRef.current && !document.hidden)
        frame = requestAnimationFrame(draw);
    };
    const invalidate = (settleEntrance = false) => {
      if (settleEntrance) entrance = ENTRANCE_DURATION;
      if (!frame && !disposed && ready && inView && !document.hidden) {
        last = 0;
        frame = requestAnimationFrame(draw);
      }
    };
    redrawRef.current = invalidate;
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) {
        renderer.resize(width, height);
        ready = true;
        invalidate();
      }
    });
    observer.observe(canvas);
    const onVisibility = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (!document.hidden) invalidate();
    };
    const intersection =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            ([entry]) => {
              inView = entry?.isIntersecting ?? false;
              cancelAnimationFrame(frame);
              frame = 0;
              // Retain the timeline when scrolling away; re-entry never restarts it.
              if (inView) invalidate();
            },
            { threshold: 0.08 },
          )
        : null;
    intersection?.observe(canvas);
    const onMotion = () => {
      if (motion.matches) {
        playingRef.current = false;
        setPlaying(false);
        invalidate(true);
      }
    };
    motion.addEventListener("change", onMotion);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      disposed = true;
      redrawRef.current = null;
      cancelAnimationFrame(frame);
      observer.disconnect();
      intersection?.disconnect();
      motion.removeEventListener("change", onMotion);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <section className="solar-seal" aria-label="Solar seal canvas experience">
      <div className="solar-seal__stage">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Seven intricate golden ornaments arranged in concentric circles: a lotus heart, serpentine spiral, interwoven band, six flame palmettes, orbital lace, and two outer fourfold crowns."
        />
        {unavailable && (
          <p className="solar-seal__fallback" role="status">
            This browser could not start the canvas. Try a browser with Canvas
            2D support.
          </p>
        )}
        <div className="solar-seal__caption" aria-hidden="true">
          <span className="solar-seal__eyebrow">
            Seven studies in radial symmetry
          </span>
          <span className="solar-seal__title">Solar seal</span>
        </div>
        <span className="solar-seal__view-label">
          {options.isolated
            ? `${SEAL_LAYERS.find((layer) => layer.id === options.isolated)?.label}${options.sliceOnly ? " · Single slice" : ""}`
            : options.framing === "reference"
              ? "Reference framing"
              : "Complete geometry"}
        </span>
      </div>

      <div className="solar-seal__toolbar">
        <div
          className="solar-seal__views"
          role="group"
          aria-label="Canvas framing"
        >
          <button
            type="button"
            aria-pressed={options.framing === "reference" && !options.sliceOnly}
            onClick={() =>
              setOptions((o) => ({
                ...o,
                framing: "reference",
                sliceOnly: false,
                isolated: null,
              }))
            }
          >
            Close-up
          </button>
          <button
            type="button"
            aria-pressed={options.framing === "complete" && !options.sliceOnly}
            onClick={() =>
              setOptions((o) => ({
                ...o,
                framing: "complete",
                sliceOnly: false,
              }))
            }
          >
            {options.isolated ? "Full layer" : "Full seal"}
          </button>
          {options.isolated && (
            <button
              type="button"
              aria-pressed={options.sliceOnly}
              onClick={() => setOptions((o) => ({ ...o, sliceOnly: true }))}
            >
              One slice
            </button>
          )}
        </div>
        <div className="solar-seal__actions">
          <button
            type="button"
            className="solar-seal__icon-button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause animation" : "Play animation"}
            title={playing ? "Pause animation" : "Play animation"}
          >
            {playing ? <Pause size={15} /> : <Play size={15} />}
          </button>
          <span className="solar-seal__divider" />
          <button
            type="button"
            className="solar-seal__layers-button"
            aria-expanded={panelOpen}
            aria-controls="seal-layers"
            onClick={() => setPanelOpen((p) => !p)}
          >
            <Layers2 size={15} /> Layers{" "}
            <ChevronDown size={13} className={panelOpen ? "is-open" : ""} />
          </button>
        </div>
      </div>

      {panelOpen && (
        <div className="solar-seal__panel" id="seal-layers">
          <fieldset className="solar-seal__layer-list">
            <legend>Visible layers</legend>
            {SEAL_LAYERS.map(({ id, label, repeats }) => (
              <div
                key={id}
                className="solar-seal__layer-row"
                data-isolated={options.isolated === id}
              >
                <label>
                  <input
                    type="checkbox"
                    checked={options.layers[id]}
                    onChange={() =>
                      setOptions((o) => ({
                        ...o,
                        isolated: id === "light" ? o.isolated : null,
                        sliceOnly: id === "light" ? o.sliceOnly : false,
                        layers: { ...o.layers, [id]: !o.layers[id] },
                      }))
                    }
                  />
                  <span className="solar-seal__checkbox" aria-hidden="true">
                    {options.layers[id] && <Check size={12} />}
                  </span>
                  {label}
                </label>
                {repeats && (
                  <span
                    className="solar-seal__repeat"
                    title={`${repeats} repetitions of one slice`}
                  >
                    ×{repeats}
                  </span>
                )}
                {id !== "light" && (
                  <button
                    type="button"
                    className="solar-seal__solo"
                    aria-label={`Solo ${label}`}
                    aria-pressed={options.isolated === id}
                    onClick={() =>
                      setOptions((o) => ({
                        ...o,
                        framing: "complete",
                        isolated: o.isolated === id ? null : id,
                        sliceOnly: o.isolated === id ? false : o.sliceOnly,
                      }))
                    }
                  >
                    Solo
                  </button>
                )}
              </div>
            ))}
          </fieldset>
          <div className="solar-seal__light-controls">
            <label htmlFor="seal-glow">
              Bloom{" "}
              <output htmlFor="seal-glow">
                {Math.round(options.glow * 100)}%
              </output>
            </label>
            <input
              id="seal-glow"
              type="range"
              min="0"
              max="1.5"
              step="0.05"
              value={options.glow}
              disabled={!options.layers.light}
              onChange={(event) =>
                setOptions((o) => ({ ...o, glow: Number(event.target.value) }))
              }
            />
            <button
              type="button"
              className="solar-seal__reset"
              onClick={() => setOptions(DEFAULT_SEAL_OPTIONS)}
            >
              <RotateCcw size={12} /> Reset view
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
