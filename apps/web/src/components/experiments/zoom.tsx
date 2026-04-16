import {
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"
import type { RecreationConfig } from "../../types/recreation"

export const config = {
  name: "Zoom",
  description:
    "Interactive demo: scaling a thousand chips without re-rendering the list—CSS variables, memo, and practical tips.",
  author: "Jeff UI Collections",
  version: "1.0.0",
  url: "",
  license: "MIT",
  tags: ["experiment", "layout", "performance", "react"],
  category: "experiments",
} satisfies RecreationConfig

const ROW_CONTAINER_WIDTH = 800
const MAX_ITEM_WIDTH = 400
/** gap-1.5 — horizontal spacing between chips; scales with zoom */
const ROW_GAP_PX = 6

const CHIP_HEIGHT_PX = 36
/** matches px-2 */
const CHIP_PAD_X_PX = 8
const CHIP_FONT_SIZE_PX = 12

type Item = {
  id: string
  title: string
  width: number // fraction 0–1 → pixel width before max cap
  description: string
  bucket: number
}

const BUCKET_COUNT = 20

const generateItems = (count: number) => {
  return Array.from({ length: count }, (_, index) => ({
    id: index.toString(),
    title: `Item ${index + 1}`,
    width: Math.random(),
    description: `Description ${index + 1}`,
    bucket: Math.floor(Math.random() * BUCKET_COUNT),
  }))
}

const ZOOM_MIN = 0.25
const ZOOM_MAX = 2.5
const ZOOM_STEP = 0.01

const PERFORMANCE_TIPS = [
  {
    headline: "Keep “visual params” off the heavy subtree",
    body: "If zoom, density, or font scale lives in React state and is passed into every row or cell, each update re-renders the whole list. Cost should not scale with item count.",
  },
  {
    headline: "Encode the multiplier on one ancestor",
    body: "Set a custom property once (e.g. --zoom) on a wrapper. Children use calc(... * var(--zoom)) for widths, gaps, or type so the browser recomputes layout without React walking thousands of nodes.",
  },
  {
    headline: "Stabilize props + memo the list",
    body: "Wrap the big list in React.memo and avoid passing the live multiplier as a prop. Data props (ids, labels, buckets) stay stable; only the ancestor’s style changes. React skips the subtree; reflow happens in the engine.",
  },
  {
    headline: "Know what still re-renders",
    body: "The shell that owns state (slider, labels, the node that sets --param) still commits—O(1) in list size. That is the intended tradeoff.",
  },
  {
    headline: "When CSS is not enough",
    body: "If the parameter changes structure (sorting, virtualization window, conditional components), you need React updates or targeted imperative work for those parts—not every chip.",
  },
  {
    headline: "Cousin pattern: transform scale",
    body: "A single transform: scale() around already-laid-out content can also avoid per-item prop churn. Mind blur, hit targets, and scroll overflow.",
  },
] as const

/** Paste into an assistant when refactoring a similar UI. */
const ZOOM_OPTIMIZATION_AI_PROMPT = `Refactor my React UI so that adjusting a visual-only parameter (e.g. zoom, density, font scale, row height multiplier) does not re-render a large list or grid.

Constraints:
- Work should stay O(1) in the number of list items when only that parameter changes (only the small control shell may re-render).
- Put the live multiplier on a single ancestor as a CSS custom property (e.g. --zoom) via inline style on that wrapper.
- Express scaled sizes and gaps using calc(... * var(--zoom)) [or the relevant variable name] in child styles so the browser recomputes layout, not React.
- Wrap the heavy list in React.memo (or equivalent) and do NOT pass the live multiplier as a prop to list rows/items; keep data props referentially stable when only the multiplier changes.
- If some behavior cannot be expressed in CSS (sorting, virtualization window, structural branches), isolate React updates to that part only—do not fan multiplier props into every cell.

Apply this to my code. Show the before/after mental model in one short paragraph, then implement.`

type ZoomRowProps = {
  rowItems: Item[]
}

/**
 * Layout scales via inherited `--zoom` on an ancestor (no `zoom` prop).
 * When only zoom changes, a memoized parent skips re-rendering this subtree;
 * the browser recomputes widths/gaps from `var(--zoom)`.
 */
function ZoomRow({ rowItems }: ZoomRowProps) {
  return (
    <div
      className="flex shrink-0 flex-row flex-nowrap items-stretch"
      style={{
        gap: `calc(${ROW_GAP_PX}px * var(--zoom))`,
        width: "fit-content",
        minWidth: "100%",
        minHeight: CHIP_HEIGHT_PX,
      }}
    >
      {rowItems.map((item) => (
        <div
          key={item.id}
          className="min-w-0 shrink-0 truncate rounded-md bg-neutral-700 flex items-center justify-center text-neutral-200"
          style={{
            width: `min(calc(${item.width} * ${ROW_CONTAINER_WIDTH}px * var(--zoom)), calc(${MAX_ITEM_WIDTH}px * var(--zoom)))`,
            height: CHIP_HEIGHT_PX,
            paddingLeft: CHIP_PAD_X_PX,
            paddingRight: CHIP_PAD_X_PX,
            fontSize: CHIP_FONT_SIZE_PX,
          }}
          title={item.description}
        >
          {item.title}
        </div>
      ))}
    </div>
  )
}

type BucketedZoomRowsProps = {
  buckets: Item[][]
}

const BucketedZoomRows = memo(function BucketedZoomRows({ buckets }: BucketedZoomRowsProps) {
  return (
    <>
      {buckets.map((rowItems, rowIndex) => (
        <ZoomRow key={rowIndex} rowItems={rowItems} />
      ))}
    </>
  )
})

function SectionTitle({
  id,
  children,
  className = "",
}: {
  id: string
  children: ReactNode
  className?: string
}) {
  return (
    <h2
      id={id}
      className={`text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 ${className}`}
    >
      {children}
    </h2>
  )
}

function CopyPromptBox({ text, subtitle }: { text: string; subtitle?: string }) {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        setCopied(false)
        timeoutRef.current = null
      }, 2000)
    } catch {
      setCopied(false)
    }
  }, [text])

  return (
    <div
      className="overflow-hidden rounded-xl border border-sky-200/90 bg-linear-to-b from-sky-50/80 to-white/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)] dark:border-sky-900/70 dark:from-sky-950/50 dark:to-neutral-950/80 dark:shadow-none"
      role="region"
      aria-label="AI prompt, copy to clipboard"
    >
      <div className="flex items-start justify-between gap-3 border-b border-sky-200/60 bg-sky-100/40 px-4 py-3 dark:border-sky-900/50 dark:bg-sky-950/40">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-900 dark:text-sky-200">
            Prompt box
          </p>
          {subtitle ? (
            <p className="mt-0.5 text-xs leading-snug text-sky-800/80 dark:text-sky-300/85">{subtitle}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 rounded-lg border border-sky-300/90 bg-white px-3 py-1.5 text-xs font-medium text-sky-950 shadow-sm transition-[color,background-color,border-color,box-shadow] hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:border-sky-700 dark:bg-sky-950 dark:text-sky-100 dark:hover:bg-sky-900/80 dark:focus-visible:outline-sky-400"
          aria-label={copied ? "Copied to clipboard" : "Copy prompt to clipboard"}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="max-h-[min(40vh,320px)] overflow-auto whitespace-pre-wrap wrap-break-word p-4 font-mono text-[13px] leading-relaxed text-neutral-800 dark:text-neutral-200">
        {text}
      </pre>
    </div>
  )
}

function TipCard({ index, headline, body }: { index: number; headline: string; body: string }) {
  return (
    <li className="flex gap-3 rounded-lg border border-neutral-200/90 bg-neutral-50/90 p-4 dark:border-neutral-700/90 dark:bg-neutral-900/50">
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-neutral-800 text-xs font-semibold text-neutral-100 dark:bg-neutral-200 dark:text-neutral-900"
        aria-hidden
      >
        {index}
      </span>
      <div className="min-w-0 space-y-1">
        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{headline}</p>
        <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{body}</p>
      </div>
    </li>
  )
}

const DEMO_ITEM_COUNT = 1000

const Zoom = () => {
  const [items] = useState<Item[]>(() => generateItems(DEMO_ITEM_COUNT))
  const [zoom, setZoom] = useState(1)

  const buckets = useMemo(() => {
    const rows: Item[][] = Array.from({ length: BUCKET_COUNT }, () => [])
    for (const item of items) {
      const b = Math.min(Math.max(item.bucket, 0), BUCKET_COUNT - 1)
      rows[b].push(item)
    }
    return rows
  }, [items])

  const demoWidthStyle = { width: `min(100%, ${ROW_CONTAINER_WIDTH}px)` } as const

  return (
    <article className="relative mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-10 pb-16 text-left">
      <header className="space-y-3 border-b border-neutral-200/80 pb-8 dark:border-neutral-800/80">
        <p className="text-xs font-medium uppercase tracking-widest text-neutral-500 dark:text-neutral-500">
          Experiment
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl dark:text-neutral-50">
          Zoom without re-rendering the list
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
          A bucketed row of chips where horizontal zoom is driven by CSS variables and a memoized
          subtree—so sliders stay smooth even with a thousand items.
        </p>
      </header>

      <section className="space-y-3" aria-labelledby="experience-heading">
        <SectionTitle id="experience-heading">The experience</SectionTitle>
        <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          Items are grouped into {BUCKET_COUNT} rows by bucket. The slider scales chip widths and
          gaps horizontally ({ZOOM_MIN * 100}%–{ZOOM_MAX * 100}%). There are{" "}
          <span className="tabular-nums font-medium text-neutral-800 dark:text-neutral-200">
            {DEMO_ITEM_COUNT.toLocaleString()}
          </span>{" "}
          chips in total—enough that a naive React approach would hurt on every drag.
        </p>
      </section>

      <section className="space-y-3" aria-labelledby="problem-heading">
        <SectionTitle id="problem-heading">The problem</SectionTitle>
        <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          If <code className="rounded bg-neutral-200/80 px-1 py-0.5 text-xs dark:bg-neutral-800/80">zoom</code>{" "}
          lives in state and is passed into every row, each tick re-renders the page shell and every
          row and chip. Work grows with{" "}
          <span className="whitespace-nowrap">rows × items</span>, not with O(1) UI chrome.
        </p>
        <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          This demo does the opposite: zoom is published as{" "}
          <code className="rounded bg-neutral-200/80 px-1 py-0.5 text-xs dark:bg-neutral-800/80">
            --zoom
          </code>{" "}
          on one container, chips use{" "}
          <code className="rounded bg-neutral-200/80 px-1 py-0.5 text-xs dark:bg-neutral-800/80">
            var(--zoom)
          </code>{" "}
          in <code className="rounded bg-neutral-200/80 px-1 py-0.5 text-xs dark:bg-neutral-800/80">calc()</code>
          , and the list is wrapped in{" "}
          <code className="rounded bg-neutral-200/80 px-1 py-0.5 text-xs dark:bg-neutral-800/80">memo</code>{" "}
          with stable <code className="rounded bg-neutral-200/80 px-1 py-0.5 text-xs dark:bg-neutral-800/80">buckets</code>{" "}
          so React skips the heavy subtree when only zoom changes.
        </p>
      </section>

      <section className="space-y-4" aria-labelledby="demo-heading">
        <SectionTitle id="demo-heading">Interactive demo</SectionTitle>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Drag the slider and watch layout update in the browser, not across a thousand reconciled
          chips.
        </p>

        <div
          className="mx-auto flex w-full flex-col gap-2 rounded-xl border border-border bg-neutral-50/80 px-4 py-3 dark:bg-neutral-900/40"
          style={demoWidthStyle}
        >
          <label className="flex min-w-0 flex-1 flex-col gap-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-200">
            <span className="flex items-center justify-between gap-2">
              Horizontal zoom
              <span className="tabular-nums text-neutral-500 dark:text-neutral-400">
                {Math.round(zoom * 100)}%
              </span>
            </span>
            <input
              type="range"
              min={ZOOM_MIN}
              max={ZOOM_MAX}
              step={ZOOM_STEP}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="h-2 w-full cursor-pointer accent-neutral-800 dark:accent-neutral-200"
              aria-valuemin={ZOOM_MIN}
              aria-valuemax={ZOOM_MAX}
              aria-valuenow={zoom}
            />
          </label>
        </div>

        <div
          className="mx-auto flex max-h-[min(55vh,420px)] flex-col gap-2 overflow-auto rounded-xl border border-border bg-neutral-50/40 p-4 dark:bg-neutral-950/30"
          style={
            {
              ...demoWidthStyle,
              "--zoom": zoom,
            } as CSSProperties
          }
        >
          <BucketedZoomRows buckets={buckets} />
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="lessons-heading">
        <SectionTitle id="lessons-heading">Lessons</SectionTitle>
        <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          The pattern is general: any scalar that only scales geometry or spacing can often live in
          CSS on an ancestor while data-driven children stay memoized with stable props.
        </p>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Tips</h3>
          <ol className="list-none space-y-3 p-0">
            {PERFORMANCE_TIPS.map((tip, i) => (
              <TipCard key={tip.headline} index={i + 1} headline={tip.headline} body={tip.body} />
            ))}
          </ol>
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="ai-prompts-heading">
        <SectionTitle id="ai-prompts-heading">AI prompts</SectionTitle>
        <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          Use the block below as a single message to a coding assistant when you want the same
          optimization applied elsewhere—CSS variable on an ancestor,{" "}
          <code className="rounded bg-neutral-200/80 px-1 py-0.5 text-xs dark:bg-neutral-800/80">memo</code>{" "}
          on the list, no multiplier props on every row.
        </p>
        <CopyPromptBox
          text={ZOOM_OPTIMIZATION_AI_PROMPT}
          subtitle="General refactor brief; edit names (--zoom, component paths) after pasting if needed."
        />
      </section>

      <section
        className="rounded-lg border border-dashed border-neutral-300/90 bg-neutral-50/50 p-4 dark:border-neutral-600/80 dark:bg-neutral-900/30"
        aria-labelledby="reference-heading"
      >
        <h3 id="reference-heading" className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Quick reference
        </h3>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-neutral-600 dark:text-neutral-400">
          <li>
            <strong className="font-medium text-neutral-800 dark:text-neutral-200">Invariant:</strong>{" "}
            stable list props + CSS variable on an ancestor +{" "}
            <code className="rounded bg-neutral-200/70 px-1 text-xs dark:bg-neutral-800/80">memo</code>{" "}
            on the list.
          </li>
          <li>
            <strong className="font-medium text-neutral-800 dark:text-neutral-200">Payoff:</strong>{" "}
            zoom-style updates stay cheap regardless of list size; only the shell re-renders.
          </li>
        </ul>
      </section>
    </article>
  )
}

export default Zoom
