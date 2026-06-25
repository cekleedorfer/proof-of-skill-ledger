'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Event } from '@/types'
import { getEventColor } from '@/lib/colors'

interface TimelineViewProps {
  events: Event[]
}

// Bubble diameter by significance
const SIZE: Record<number, number> = { 1: 82, 2: 100, 3: 118, 4: 138, 5: 162 }

// Staggered x-positions so bubbles float in an organic wave
const X_OFFSETS = [8, 52, 12, 60, 4, 56, 16, 48]

function FloatingBubble({
  event,
  color,
  index,
  onClick,
}: {
  event: Event
  color: { bg: string; light: string }
  index: number
  onClick: () => void
}) {
  const size = SIZE[event.significance]
  const xOffset = X_OFFSETS[index % X_OFFSETS.length]
  const floatDelay = (index * 0.37) % 2.4
  const floatDuration = 3.2 + (index % 3) * 0.6

  const month = new Date(event.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

  return (
    <motion.div
      className="flex flex-col items-center cursor-pointer select-none"
      style={{ marginLeft: xOffset, width: size }}
      initial={{ opacity: 0, scale: 0.4, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.5, type: 'spring', stiffness: 260, damping: 22 }}
    >
      {/* Floating animation wrapper */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: floatDuration, delay: floatDelay, repeat: Infinity, ease: 'easeInOut' }}
        className="flex flex-col items-center"
      >
        {/* Glow ring */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: size + 20,
            height: size + 20,
            background: `radial-gradient(circle, ${color.bg}30 0%, transparent 70%)`,
            filter: 'blur(8px)',
          }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: floatDuration, delay: floatDelay, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Main bubble */}
        <motion.button
          onClick={onClick}
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.07 }}
          transition={{ type: 'spring', stiffness: 380, damping: 22 }}
          className="relative rounded-full flex items-center justify-center text-white font-semibold text-center leading-tight"
          style={{
            width: size,
            height: size,
            background: `radial-gradient(circle at 35% 30%, ${lighten(color.bg)}, ${color.bg} 65%)`,
            boxShadow: `0 8px 32px ${color.bg}70, 0 2px 8px ${color.bg}40, inset 0 1px 0 rgba(255,255,255,0.25)`,
            fontSize: size > 130 ? 12 : size > 100 ? 10 : 9,
            padding: 14,
          }}
          aria-label={event.title}
        >
          {/* Shine highlight */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: size * 0.45,
              height: size * 0.3,
              background: 'radial-gradient(ellipse, rgba(255,255,255,0.35) 0%, transparent 100%)',
              top: '14%',
              left: '18%',
            }}
          />
          <span className="relative leading-tight z-10 text-center">
            {event.title.length > 18 ? event.title.slice(0, 16) + '…' : event.title}
          </span>
        </motion.button>

        {/* Date label */}
        <div className="mt-2 flex flex-col items-center">
          <span className="text-[10px] font-semibold text-gray-400">{month}</span>
          {event.subEvents.length > 0 && (
            <div className="flex gap-0.5 mt-1">
              {Array.from({ length: Math.min(event.subEvents.length, 4) }).map((_, i) => (
                <div key={i} className="w-1 h-1 rounded-full" style={{ background: color.bg, opacity: 0.6 }} />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// Lighten a hex color slightly for the radial highlight
function lighten(hex: string): string {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.min(255, (n >> 16) + 60)
  const g = Math.min(255, ((n >> 8) & 0xff) + 60)
  const b = Math.min(255, (n & 0xff) + 60)
  return `rgb(${r},${g},${b})`
}

function groupByYear(events: Event[]) {
  const groups: Record<string, Event[]> = {}
  events.forEach(e => {
    const year = new Date(e.date).getFullYear().toString()
    if (!groups[year]) groups[year] = []
    groups[year].push(e)
  })
  return Object.entries(groups).sort((a, b) => Number(b[0]) - Number(a[0]))
}

export function TimelineView({ events }: TimelineViewProps) {
  const router = useRouter()

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="text-6xl mb-4"
        >
          🫧
        </motion.div>
        <p className="text-gray-400 text-sm">No events yet. Tap + to add your first milestone.</p>
      </div>
    )
  }

  const allIds = events.map(e => e.id)
  const byYear = groupByYear(events)
  let globalIndex = 0

  return (
    <div className="space-y-8">
      {byYear.map(([year, yearEvents]) => {
        const sorted = [...yearEvents].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )

        return (
          <div key={year}>
            {/* Year label */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 mb-5 px-1"
            >
              <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">{year}</span>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
            </motion.div>

            {/* Bubble cluster — wrap naturally with stagger */}
            <div className="flex flex-wrap gap-y-6 gap-x-1 items-end">
              {sorted.map(event => {
                const idx = globalIndex++
                const color = getEventColor(allIds.indexOf(event.id))
                return (
                  <FloatingBubble
                    key={event.id}
                    event={event}
                    color={color}
                    index={idx}
                    onClick={() => router.push(`/event/${event.id}`)}
                  />
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
