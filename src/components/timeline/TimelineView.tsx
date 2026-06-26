'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Event } from '@/types'
import { useProfile } from '@/lib/profile'
import { getTheme, getThemedColor, getBubbleColor } from '@/lib/themes'

interface TimelineViewProps { events: Event[] }

const SIZE: Record<number, number> = { 1: 76, 2: 90, 3: 106, 4: 122, 5: 142 }

function lighten(hex: string): string {
  const n = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, (n >> 16) + 60)
  const g = Math.min(255, ((n >> 8) & 0xff) + 60)
  const b = Math.min(255, (n & 0xff) + 60)
  return `rgb(${r},${g},${b})`
}

function fontSize(title: string, size: number): number {
  const chars = title.length
  if (chars <= 8) return Math.min(13, size * 0.13)
  if (chars <= 14) return Math.min(12, size * 0.115)
  if (chars <= 20) return Math.min(11, size * 0.105)
  if (title.split(' ').length <= 4) return Math.min(10, size * 0.095)
  return Math.min(9.5, size * 0.088)
}

function ProgressRing({ size, count, color }: { size: number; count: number; color: string }) {
  if (count === 0) return null
  const r = size / 2 + 7
  const circ = 2 * Math.PI * r
  const filled = Math.min(count / 5, 1) * circ
  return (
    <svg className="absolute pointer-events-none" style={{ left: -7, top: -7 }} width={size + 14} height={size + 14}>
      <circle cx={(size + 14) / 2} cy={(size + 14) / 2} r={r} fill="none" stroke={`${color}22`} strokeWidth={3} />
      <motion.circle
        cx={(size + 14) / 2} cy={(size + 14) / 2} r={r}
        fill="none" stroke={color} strokeWidth={3} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={circ - filled}
        style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - filled }}
        transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
        opacity={0.8}
      />
    </svg>
  )
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
  const { profile } = useProfile()
  const theme = getTheme(profile.themeId)

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} className="text-6xl mb-4">🫧</motion.div>
        <p className="text-gray-400 text-sm">No events yet. Tap + to add your first milestone.</p>
      </div>
    )
  }

  const allIds = events.map(e => e.id)
  const byYear = groupByYear(events)
  let globalIndex = 0

  return (
    <div className="space-y-10">
      {byYear.map(([year, yearEvents]) => {
        const sorted = [...yearEvents].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        return (
          <div key={year}>
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 mb-6">
              <span className="text-sm font-black text-gray-300 tracking-widest">{year}</span>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
            </motion.div>
            <div className="relative">
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-teal-200 via-teal-100 to-transparent" />
              <div className="space-y-2">
                {sorted.map((event, i) => {
                  const idx = globalIndex++
                  const colorIdx = allIds.indexOf(event.id)
                  const color = getThemedColor(theme, colorIdx)
                  const bubbleColor = getBubbleColor(theme, colorIdx, event.significance)
                  const size = SIZE[event.significance]
                  const isLeft = i % 2 === 0
                  const floatDuration = 3.4 + (idx % 4) * 0.5
                  const floatDelay = (idx * 0.41) % 2.8
                  const month = new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  const fs = fontSize(event.title, size)

                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: isLeft ? -40 : 40, scale: 0.7 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ delay: idx * 0.06, duration: 0.45, type: 'spring', stiffness: 240, damping: 22 }}
                      className={`flex items-center gap-2 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
                      style={{ minHeight: size + 32 }}
                    >
                      <div className={`flex-1 flex ${isLeft ? 'justify-end pr-3' : 'justify-start pl-3'}`}>
                        <motion.div
                          className="flex flex-col items-center"
                          animate={{ y: [0, -7, 0] }}
                          transition={{ duration: floatDuration, delay: floatDelay, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          <div className="absolute rounded-full pointer-events-none" style={{ width: size + 28, height: size + 28, background: `radial-gradient(circle, ${bubbleColor}28 0%, transparent 70%)`, filter: 'blur(10px)', top: -14, left: -14 }} />
                          <div className="relative cursor-pointer" onClick={() => router.push(`/event/${event.id}`)}>
                            <ProgressRing size={size} count={event.subEvents.length} color={bubbleColor} />
                            <motion.div
                              whileTap={{ scale: 0.91 }} whileHover={{ scale: 1.06 }}
                              transition={{ type: 'spring', stiffness: 380, damping: 20 }}
                              className="relative rounded-full flex items-center justify-center font-semibold text-center overflow-hidden"
                              style={{
                                width: size, height: size,
                                color: color.text,
                                background: `radial-gradient(circle at 35% 28%, ${lighten(bubbleColor)}, ${bubbleColor} 68%)`,
                                boxShadow: `0 10px 36px ${bubbleColor}75, 0 3px 10px ${bubbleColor}45, inset 0 1px 0 rgba(255,255,255,0.28)`,
                                fontSize: fs, lineHeight: 1.25, padding: '14px',
                              }}
                            >
                              <div className="absolute rounded-full pointer-events-none" style={{ width: size * 0.44, height: size * 0.28, background: 'radial-gradient(ellipse, rgba(255,255,255,0.38) 0%, transparent 100%)', top: '13%', left: '17%' }} />
                              <span className="relative z-10 leading-snug">{event.title}</span>
                            </motion.div>
                          </div>
                          <div className="mt-2 flex flex-col items-center gap-1">
                            <span className="text-[10px] font-semibold text-gray-400">{month}</span>
                            {event.subEvents.length > 0 && (
                              <div className="flex gap-0.5">
                                {Array.from({ length: Math.min(event.subEvents.length, 5) }).map((_, di) => (
                                  <motion.div key={di} className="w-1 h-1 rounded-full" style={{ background: bubbleColor, opacity: 0.55 }}
                                    animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2, delay: di * 0.3, repeat: Infinity }} />
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </div>

                      <div className="flex-shrink-0 flex flex-col items-center z-10">
                        <motion.div className="w-3 h-3 rounded-full border-2 border-white shadow-md"
                          style={{ background: bubbleColor, boxShadow: `0 0 8px ${bubbleColor}80` }}
                          animate={{ scale: [1, 1.2, 1] }} transition={{ duration: floatDuration, delay: floatDelay, repeat: Infinity }} />
                      </div>

                      <div className={`flex-1 ${isLeft ? 'pl-3' : 'pr-3 text-right'}`}>
                        <motion.div whileTap={{ scale: 0.97 }} onClick={() => router.push(`/event/${event.id}`)} className="inline-block cursor-pointer">
                          <div className="flex flex-wrap gap-1 mb-1" style={{ justifyContent: isLeft ? 'flex-start' : 'flex-end' }}>
                            {event.skills.slice(0, 2).map(s => (
                              <span key={s} className="text-[9px] px-2 py-0.5 rounded-full font-semibold" style={{ background: color.light, color: color.bg }}>{s}</span>
                            ))}
                          </div>
                          {event.visibility === 'portfolio' && (
                            <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color: color.bg }}>✦ Portfolio</span>
                          )}
                          {event.subEvents.length > 0 && (
                            <p className="text-[10px] text-gray-400 mt-0.5">{event.subEvents.length} micro-win{event.subEvents.length > 1 ? 's' : ''}</p>
                          )}
                        </motion.div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
