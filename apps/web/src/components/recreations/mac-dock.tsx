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

// ─── App Icons ────────────────────────────────────────────────────────────────

function FinderIcon() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <linearGradient id="fi-l" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#76D2FF" />
          <stop offset="100%" stopColor="#2196F3" />
        </linearGradient>
        <linearGradient id="fi-r" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1565C0" />
          <stop offset="100%" stopColor="#0D47A1" />
        </linearGradient>
        <clipPath id="fi-lc">
          <rect x="0" y="0" width="50" height="100" />
        </clipPath>
        <clipPath id="fi-rc">
          <rect x="50" y="0" width="50" height="100" />
        </clipPath>
      </defs>
      <rect width="100" height="100" rx="22" fill="#2196F3" />
      <rect width="100" height="100" rx="22" fill="url(#fi-l)" clipPath="url(#fi-lc)" />
      <rect width="100" height="100" rx="22" fill="url(#fi-r)" clipPath="url(#fi-rc)" />
      <circle cx="36" cy="47" r="13" fill="white" />
      <circle cx="39" cy="47" r="8" fill="#0D47A1" />
      <circle cx="37" cy="44" r="3" fill="white" opacity="0.6" />
      <circle cx="64" cy="47" r="13" fill="white" />
      <circle cx="67" cy="47" r="8" fill="#76D2FF" />
      <circle cx="65" cy="44" r="3" fill="white" opacity="0.6" />
      <path d="M 34 66 Q 50 80 66 66" stroke="white" strokeWidth="4.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function SafariIcon() {
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const rad = (i * 30 * Math.PI) / 180
    return {
      x1: 50 + 31 * Math.cos(rad),
      y1: 50 + 31 * Math.sin(rad),
      x2: 50 + 26 * Math.cos(rad),
      y2: 50 + 26 * Math.sin(rad),
    }
  })
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <linearGradient id="sa-bg" x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#52C9F0" />
          <stop offset="100%" stopColor="#007AFF" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="22" fill="url(#sa-bg)" />
      <circle cx="50" cy="50" r="34" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      {ticks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" />
      ))}
      <polygon points="50,19 46.5,50 53.5,50" fill="#FF3B30" />
      <polygon points="50,81 46.5,50 53.5,50" fill="white" />
      <circle cx="50" cy="50" r="3.5" fill="white" />
      <text x="50" y="14" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="9" fontWeight="700" fontFamily="system-ui">N</text>
      <text x="50" y="87" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="9" fontWeight="700" fontFamily="system-ui">S</text>
      <text x="13" y="52" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="9" fontWeight="700" fontFamily="system-ui">W</text>
      <text x="87" y="52" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="9" fontWeight="700" fontFamily="system-ui">E</text>
    </svg>
  )
}

function MessagesIcon() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <linearGradient id="msg-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4CD964" />
          <stop offset="100%" stopColor="#34C759" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="22" fill="url(#msg-bg)" />
      <path d="M18 26 Q18 18 26 18 L74 18 Q82 18 82 26 L82 60 Q82 68 74 68 L44 68 L29 82 L32 68 L26 68 Q18 68 18 60 Z" fill="white" />
      <circle cx="36" cy="43" r="5.5" fill="#34C759" />
      <circle cx="50" cy="43" r="5.5" fill="#34C759" />
      <circle cx="64" cy="43" r="5.5" fill="#34C759" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <linearGradient id="mail-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5AC8FA" />
          <stop offset="100%" stopColor="#1D70F0" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="22" fill="url(#mail-bg)" />
      <rect x="14" y="30" width="72" height="46" rx="5" fill="white" />
      <path d="M14 35 L50 58 L86 35" stroke="#1D70F0" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PhotosIcon() {
  const petals = [
    { color: '#FF3B30', deg: 0 },
    { color: '#FF9500', deg: 45 },
    { color: '#FFCC00', deg: 90 },
    { color: '#4CD964', deg: 135 },
    { color: '#5AC8FA', deg: 180 },
    { color: '#007AFF', deg: 225 },
    { color: '#5856D6', deg: 270 },
    { color: '#FF2D55', deg: 315 },
  ]
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="100" height="100" rx="22" fill="white" />
      {petals.map((p, i) => {
        const rad = (p.deg * Math.PI) / 180
        const cx = 50 + 19 * Math.cos(rad)
        const cy = 50 + 19 * Math.sin(rad)
        return <ellipse key={i} cx={cx} cy={cy} rx="13" ry="9" fill={p.color} transform={`rotate(${p.deg} ${cx} ${cy})`} />
      })}
      <circle cx="50" cy="50" r="11" fill="white" />
    </svg>
  )
}

function CalendarIcon() {
  const now = new Date()
  const day = now.getDate()
  const month = now.toLocaleString('default', { month: 'short' }).toUpperCase()
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="100" height="100" rx="22" fill="white" />
      <rect x="0" y="0" width="100" height="36" rx="22" fill="#FF3B30" />
      <rect x="0" y="20" width="100" height="16" fill="#FF3B30" />
      <text x="50" y="25" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="13" fontWeight="600" fontFamily="-apple-system,system-ui">
        {month}
      </text>
      <text x="50" y="68" textAnchor="middle" dominantBaseline="middle" fill="#1C1C1E" fontSize="40" fontWeight="200" fontFamily="-apple-system,system-ui">
        {day}
      </text>
    </svg>
  )
}

function MusicIcon() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <linearGradient id="mus-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2C2C2E" />
          <stop offset="100%" stopColor="#1C1C1E" />
        </linearGradient>
        <linearGradient id="mus-note" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF6B9D" />
          <stop offset="100%" stopColor="#FF2D55" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="22" fill="url(#mus-bg)" />
      <path d="M40 68 L40 28 L74 22 L74 48" stroke="url(#mus-note)" strokeWidth="5.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="35" cy="70" r="10" fill="url(#mus-note)" />
      <circle cx="69" cy="50" r="10" fill="url(#mus-note)" />
    </svg>
  )
}

function MapsIcon() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <linearGradient id="maps-top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A8D8A8" />
          <stop offset="100%" stopColor="#4CD964" />
        </linearGradient>
        <linearGradient id="maps-bot" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5AC8FA" />
          <stop offset="100%" stopColor="#34AADC" />
        </linearGradient>
        <clipPath id="maps-bot-clip">
          <rect x="0" y="55" width="100" height="45" />
        </clipPath>
      </defs>
      <rect width="100" height="100" rx="22" fill="url(#maps-top)" />
      <rect width="100" height="100" rx="22" fill="url(#maps-bot)" clipPath="url(#maps-bot-clip)" />
      <path d="M8 82 Q28 62 50 56 Q72 50 92 32" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M8 82 Q28 62 50 56 Q72 50 92 32" stroke="#4CD964" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="9 9" />
      <path d="M56 22 Q56 10 66 10 Q76 10 76 22 Q76 34 66 44 Q56 34 56 22Z" fill="#FF3B30" />
      <circle cx="66" cy="22" r="5.5" fill="white" />
    </svg>
  )
}

function NotesIcon() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <linearGradient id="notes-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE600" />
          <stop offset="100%" stopColor="#FFD200" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="22" fill="url(#notes-bg)" />
      {[38, 52, 66, 80].map((y, i) => (
        <line key={i} x1="24" y1={y} x2="76" y2={y} stroke="rgba(0,0,0,0.12)" strokeWidth="2" />
      ))}
      <line x1="24" y1="38" x2="76" y2="38" stroke="rgba(0,0,0,0.22)" strokeWidth="2.5" />
      <line x1="36" y1="26" x2="36" y2="84" stroke="#FF8080" strokeWidth="2" opacity="0.65" />
    </svg>
  )
}

function AppStoreIcon() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <linearGradient id="as-bg" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#5AC8FA" />
          <stop offset="100%" stopColor="#007AFF" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="22" fill="url(#as-bg)" />
      <path d="M50 15 L28 75 L39 75 L44.5 58 L55.5 58 L61 75 L72 75 Z" fill="white" />
      <rect x="35" y="51" width="30" height="5" rx="2.5" fill="url(#as-bg)" />
      <path d="M46 15 L50 8 L54 15 Z" fill="rgba(255,255,255,0.55)" />
    </svg>
  )
}

function SystemSettingsIcon() {
  const teeth = Array.from({ length: 12 }, (_, i) => {
    const rad = (i * 30 * Math.PI) / 180
    return { cx: 50 + 34 * Math.cos(rad), cy: 50 + 34 * Math.sin(rad), deg: i * 30 }
  })
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <linearGradient id="ss-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8E8E93" />
          <stop offset="100%" stopColor="#636366" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="22" fill="url(#ss-bg)" />
      {teeth.map((t, i) => (
        <rect key={i} x={t.cx - 5} y={t.cy - 7.5} width="10" height="15" rx="4.5" fill="white" transform={`rotate(${t.deg} ${t.cx} ${t.cy})`} />
      ))}
      <circle cx="50" cy="50" r="27" fill="url(#ss-bg)" />
      <circle cx="50" cy="50" r="14" fill="white" />
      <circle cx="50" cy="50" r="7.5" fill="url(#ss-bg)" />
    </svg>
  )
}

function LaunchpadIcon() {
  const colors = ['#FF3B30', '#FF9500', '#FFCC00', '#4CD964', '#5AC8FA', '#007AFF', '#5856D6', '#FF2D55', '#8E8E93']
  const stars: [number, number][] = [[20, 14], [82, 18], [14, 48], [88, 44], [22, 76], [78, 80], [50, 9], [9, 30], [91, 68], [45, 88]]
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <radialGradient id="lp-bg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#1E4080" />
          <stop offset="100%" stopColor="#0A1020" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" rx="22" fill="url(#lp-bg)" />
      {stars.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.2" fill="white" opacity={0.25 + (i % 3) * 0.2} />
      ))}
      {colors.map((color, i) => (
        <rect key={i} x={22 + (i % 3) * 27} y={25 + Math.floor(i / 3) * 23} width="17" height="17" rx="4.5" fill={color} opacity="0.92" />
      ))}
    </svg>
  )
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
  { name: 'Finder', icon: <FinderIcon /> },
  { name: 'Safari', icon: <SafariIcon /> },
  { name: 'Messages', icon: <MessagesIcon /> },
  { name: 'Mail', icon: <MailIcon /> },
  { name: 'Photos', icon: <PhotosIcon /> },
  { name: 'Calendar', icon: <CalendarIcon /> },
  { name: 'Music', icon: <MusicIcon /> },
  { name: 'Maps', icon: <MapsIcon /> },
  { name: 'Notes', icon: <NotesIcon /> },
  { name: 'App Store', icon: <AppStoreIcon /> },
  { name: 'System Settings', icon: <SystemSettingsIcon /> },
  { name: 'Launchpad', icon: <LaunchpadIcon /> },
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