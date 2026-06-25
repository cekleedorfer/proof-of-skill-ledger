'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Event } from '@/types'
import { EventBubble } from './EventBubble'
import { getEventColor } from '@/lib/colors'

interface TimelineViewProps {
  events: Event[]
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
        <div className="text-5xl mb-4">🌱</div>
        <p className="text-gray-400 text-sm">No events yet. Tap + to add your first milestone.</p>
      </div>
    )
  }

  const allIds = events.map(e => e.id)
  const byYear = groupByYear(events)

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-[28px] top-6 bottom-0 w-0.5 bg-gradient-to-b from-violet-300 via-blue-200 to-transparent z-0" />

      <div className="space-y-6">
        {byYear.map(([year, yearEvents]) => {
          const sorted = [...yearEvents].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          return (
            <div key={year}>
              {/* Year label */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-6 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-400 bg-[#f5f5f7] px-1 relative z-10">{year}</span>
                </div>
              </div>

              {/* Events in this year */}
              <div className="space-y-3">
                {sorted.map((event, i) => {
                  const color = getEventColor(allIds.indexOf(event.id)).bg
                  const month = new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.35, ease: 'easeOut' }}
                      className="flex items-center gap-3"
                    >
                      {/* Dot on line */}
                      <div className="flex-shrink-0 flex items-center justify-center z-10" style={{ width: 56 }}>
                        <div className="w-3 h-3 rounded-full border-2 border-white shadow-sm" style={{ background: color }} />
                      </div>

                      {/* Bubble + card row */}
                      <div
                        className="flex-1 flex items-center gap-3 cursor-pointer"
                        onClick={() => router.push(`/event/${event.id}`)}
                      >
                        {/* Mini bubble */}
                        <div
                          className="flex-shrink-0 rounded-full flex items-center justify-center shadow-md text-white font-bold text-center leading-tight"
                          style={{
                            width: 48 + event.significance * 6,
                            height: 48 + event.significance * 6,
                            background: color,
                            boxShadow: `0 4px 14px ${color}55`,
                            fontSize: 9,
                            padding: 4,
                          }}
                        >
                          <span className="leading-tight text-center">
                            {event.title.length > 14 ? event.title.slice(0, 12) + '…' : event.title}
                          </span>
                        </div>

                        {/* Card */}
                        <motion.div
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 bg-white rounded-2xl p-3 shadow-sm border border-gray-100 min-w-0"
                        >
                          <div className="flex items-start justify-between gap-1 mb-0.5">
                            <h3 className="font-semibold text-[13px] text-gray-900 leading-snug">{event.title}</h3>
                            {event.visibility === 'portfolio' && (
                              <span className="text-[9px] bg-violet-50 text-violet-600 border border-violet-100 rounded-full px-1.5 py-0.5 flex-shrink-0 font-semibold">Portfolio</span>
                            )}
                          </div>
                          <p className="text-[10px] text-gray-400 font-medium mb-1.5">{month}</p>
                          <div className="flex items-center gap-1 flex-wrap">
                            {event.skills.slice(0, 2).map(s => (
                              <span key={s} className="text-[9px] px-2 py-0.5 rounded-full font-medium" style={{ background: getEventColor(allIds.indexOf(event.id)).light, color: getEventColor(allIds.indexOf(event.id)).bg }}>
                                {s}
                              </span>
                            ))}
                            {event.subEvents.length > 0 && (
                              <span className="text-[9px] text-gray-400 ml-auto">{event.subEvents.length} wins</span>
                            )}
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
