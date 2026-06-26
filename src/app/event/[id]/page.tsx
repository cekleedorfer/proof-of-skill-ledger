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
    <div className="min-h-dvh pb-32 bg-[#f5f5f7]">
      {/* Hero header */}
      <div className="relative overflow-hidden pb-6" style={{ background: `linear-gradient(150deg, ${color.bg} 0%, ${color.bg}cc 100%)` }}>
        {/* Shine overlay */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 70% 10%, white, transparent 55%)' }} />
        {/* Ambient glow */}
        <div className="absolute -bottom-8 -right-8 w-48 h-48 rounded-full opacity-20" style={{ background: `radial-gradient(circle, white, transparent 70%)` }} />

        <div className="relative px-4 pt-5">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 font-semibold text-sm text-white/80 mb-5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 capitalize">{event.category}</span>
              {event.visibility === 'portfolio' && (
                <span className="text-[9px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full uppercase tracking-wide">✦ Portfolio</span>
              )}
            </div>
            <h1 className="text-2xl font-black text-white leading-tight mb-3">{event.title}</h1>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-white/70">
                <Calendar className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">
                  {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < event.significance ? 'fill-white text-white' : 'text-white/25'}`} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tabs — slightly overlapping hero */}
      <div className="px-4 -mt-1">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <EventTabs event={event} eventColor={color.bg} eventLightColor={color.light} allIds={allIds} />
        </motion.div>
      </div>
    </div>
  )
}
