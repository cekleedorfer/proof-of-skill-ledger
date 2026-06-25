'use client'

import { motion } from 'framer-motion'
import { Event } from '@/types'

interface EventBubbleProps {
  event: Event
  color: string
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
  label?: boolean
}

const significanceSizes: Record<number, number> = {
  1: 52,
  2: 64,
  3: 78,
  4: 92,
  5: 108,
}

export function EventBubble({ event, color, onClick, size, label = false }: EventBubbleProps) {
  const px = size === 'lg' ? 110 : size === 'md' ? 72 : significanceSizes[event.significance]

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.93 }}
      whileHover={{ scale: 1.06, y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="relative flex flex-col items-center cursor-pointer select-none"
      style={{ width: px }}
      aria-label={event.title}
    >
      <motion.div
        className="rounded-full flex items-center justify-center shadow-lg text-white font-bold text-center leading-tight px-2"
        style={{
          width: px,
          height: px,
          background: color,
          boxShadow: `0 8px 24px ${color}55`,
        }}
      >
        <span style={{ fontSize: px > 80 ? 11 : 9 }} className="leading-tight">
          {event.title.length > 18 ? event.title.slice(0, 16) + '…' : event.title}
        </span>
      </motion.div>
      {label && (
        <span className="mt-1 text-[10px] text-gray-400 font-medium text-center leading-tight whitespace-nowrap">
          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      )}
    </motion.button>
  )
}
