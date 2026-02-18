import React, { useRef, useState, useCallback } from 'react'
import type { RecreationConfig } from '../../types/recreation'
import { motion, AnimatePresence, cubicBezier } from 'motion/react'

const PROXIMITY_RADIUS = 160
const BASE_SIZE = 42
const MAX_SIZE = BASE_SIZE * 1.3
const PADDING = 10
const BORDER_RADIUS = 8

export const config = {
  name: 'MacDock',
  description: 'A recreation of the Mac dock',
  author: 'John Doe',
  version: '1.0.0',
  url: 'https://github.com/john-doe/mac-dock',
  license: 'MIT',
  tags: ['mac', 'dock', 'recreation'],
  category: 'recreations',
} satisfies RecreationConfig

export type MacDockItem = {
  name: string
  icon: React.ReactNode
}

function AppIcon({ src, name }: { src: string; name: string }) {
  return <img src={src} alt={name} width="100%" height="100%" style={{ display: 'block' }} />
}

const EASE_OUT_QUAD = cubicBezier(0.25, 0.46, 0.45, 0.94);
const EASE_IN_QUAD = cubicBezier(0.55, 0.085, 0.68, 0.53);

// ─── Dock ─────────────────────────────────────────────────────────────────────

const MacDock = ({
  items,
  openingItemIndices,
  openedItemIndices,
  handleClick,
}: {
  items: MacDockItem[];
  openingItemIndices?: Set<number>;
  openedItemIndices?: Set<number>;
  handleClick?: ({
    name,
    index,
  }: {
    name: string;
    index: number;
  }) => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [sizes, setSizes] = useState<number[]>(() => items.map(() => BASE_SIZE))
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const container = containerRef.current
      if (!container) return
      const children = Array.from(container.children)
      const newSizes = children.map((el) => {
        const rect = (el as HTMLElement).getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const dist = Math.abs(e.clientX - centerX)
        if (dist >= PROXIMITY_RADIUS) return BASE_SIZE
        const t = 1 - dist / PROXIMITY_RADIUS
        return BASE_SIZE + (MAX_SIZE - BASE_SIZE) * t
      })
      setSizes(newSizes)
    },
    [items.length],
  )

  const handleMouseLeave = useCallback(() => {
    setSizes(items.map(() => BASE_SIZE))
    setHoveredIndex(null)
  }, [items.length])

  return (
    <div className="flex flex-col items-center justify-end" style={{ minHeight: MAX_SIZE + 80 }}>
      <div className="relative flex flex-col items-center">
        {/* Dock */}
        <div
          ref={containerRef}
          className="flex items-end bg-accent"
          style={{
            padding: PADDING,
            gap: PADDING,
            height: BASE_SIZE + PADDING * 2,
            borderRadius: BORDER_RADIUS + PADDING,
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {items.map((item, i) => {
            const itemElement = (
              <motion.div
                className="overflow-hidden"
                style={{
                  borderRadius: BORDER_RADIUS,
                }}
                initial={{
                  width: BASE_SIZE,
                  height: BASE_SIZE,
                }}
                animate={{
                  width: sizes[i] ?? BASE_SIZE,
                  height: sizes[i] ?? BASE_SIZE,
                }}
                transition={{
                  type: "tween", duration: 0.12,
                }}
                onMouseEnter={() => setHoveredIndex(i)}
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  handleClick?.({ name: item.name, index: i })
                }}
              >
                {item.icon}
              </motion.div>
            )
            return (
              <div key={item.name} className="relative flex flex-col items-center shrink-0">
                <AnimatePresence>
                  {hoveredIndex === i && (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 5, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.95 }}
                      transition={{ duration: 0.09 }}
                      className="pointer-events-none absolute bg-accent backdrop-blur-sm rounded-md px-2.5 py-1.5 text-xs font-normal w-fit whitespace-nowrap"
                      style={{
                        bottom: '100%',
                        marginBottom: 8,
                        borderRadius: BORDER_RADIUS,
                      }}
                    >
                      {item.name}
                    </motion.div>
                  )}
                </AnimatePresence>
                <motion.div
                  animate={openingItemIndices?.has(i)
                    ? { y: [0, -BASE_SIZE / 2, 0] }
                    : { y: 0 }
                  }
                  transition={openingItemIndices?.has(i)
                    ? {
                      times: [0, 0.5, 1],
                      ease: [EASE_OUT_QUAD, EASE_IN_QUAD],
                      repeat: Infinity,
                      duration: 0.8,
                    }
                    : { duration: 0.2, ease: EASE_OUT_QUAD }
                  }
                >
                  {itemElement}
                </motion.div>
                {openedItemIndices?.has(i) && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 rounded-full bg-foreground/50"
                    style={{ bottom: -PADDING / 1.5, width: 4, height: 4 }}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Example ──────────────────────────────────────────────────────────────────

const DOCK_ITEMS: MacDockItem[] = [
  { name: 'Finder', icon: <AppIcon src="/icons/finder.png" name="Finder" /> },
  { name: 'iMessage', icon: <AppIcon src="/icons/imessage.png" name="iMessage" /> },
  { name: 'Notes', icon: <AppIcon src="/icons/notes.png" name="Notes" /> },
  { name: 'Microsoft Edge', icon: <AppIcon src="/icons/edge.png" name="Microsoft Edge" /> },
  { name: 'Google Chrome', icon: <AppIcon src="/icons/chrome.png" name="Google Chrome" /> },
  { name: 'Brave Browser', icon: <AppIcon src="/icons/brave.png" name="Brave Browser" /> },
  { name: 'ChatGPT', icon: <AppIcon src="/icons/chatgpt.png" name="ChatGPT" /> },
  { name: 'Cursor', icon: <AppIcon src="/icons/cursor.png" name="Cursor" /> },
  { name: 'Ghostty', icon: <AppIcon src="/icons/ghostty.png" name="Ghostty" /> },
  { name: 'Superhuman', icon: <AppIcon src="/icons/superhuman.png" name="Superhuman" /> },
]

const MacDockExample = () => {
  const [openingItemIndices, setOpeningItemIndices] = useState<Set<number>>(() => new Set())
  const [openedItemIndices, setOpenedItemIndices] = useState<Set<number>>(() => new Set())

  const handleItemClick = ({ index }: { index: number }) => {
    setOpeningItemIndices((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })

    setTimeout(() => {
      setOpenedItemIndices((prev) => {
        const next = new Set(prev)
        if (next.has(index)) next.delete(index)
        else next.add(index)
        return next
      })
      setOpeningItemIndices((prev) => {
        const next = new Set(prev)
        next.delete(index)
        return next
      })
    }, Math.random() * (3000 - 500) + 500)
  }

  return (
    <div className='h-[61.8vh] w-full flex items-center justify-center'>
      <MacDock
        items={DOCK_ITEMS}
        openingItemIndices={openingItemIndices}
        openedItemIndices={openedItemIndices}
        handleClick={handleItemClick}
      />
    </div>
  )
}

export default MacDockExample