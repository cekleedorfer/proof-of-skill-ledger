'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Star } from 'lucide-react'
import { useStore } from '@/lib/store'
import { PageShell } from '@/components/layout/PageShell'
import { EventTabs } from '@/components/event/EventTabs'
import { getEventColor } from '@/lib/colors'

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { events } = useStore()
  const router = useRouter()
  const event = events.find(e => e.id === id)
  const allIds = events.map(e => e.id)

  if (!event) {
    return (
      <PageShell>
        <div className="text-center py-20">
          <p className="text-gray-400">Event not found.</p>
        </div>
      </PageShell>
    )
  }

  const color = getEventColor(allIds.indexOf(id))

  return (
    <div className="min-h-dvh pb-32" style={{ background: `linear-gradient(160deg, ${color.light} 0%, #f5f5f7 35%)` }}>
      <div className="px-4 pt-4">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 font-semibold text-sm mb-6"
          style={{ color: color.bg }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-xl font-bold text-gray-900 leading-snug mb-2">{event.title}</h1>
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center gap-1 text-gray-400">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-xs">
                {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: event.significance }).map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-current" style={{ color: color.bg }} />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
        >
          <EventTabs event={event} eventColor={color.bg} eventLightColor={color.light} allIds={allIds} />
        </motion.div>
      </div>
    </div>
  )
}
