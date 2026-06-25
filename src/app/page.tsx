'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Plus, Flame, Star, Zap } from 'lucide-react'
import { useStore } from '@/lib/store'
import { PageShell } from '@/components/layout/PageShell'
import { TimelineView } from '@/components/timeline/TimelineView'
import { Category } from '@/types'
import { getEventColor } from '@/lib/colors'

type Filter = 'all' | Category | 'portfolio'

const filters: { label: string; value: Filter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Professional', value: 'professional' },
  { label: 'Personal', value: 'personal' },
  { label: 'Portfolio', value: 'portfolio' },
]

// Floating ambient orbs behind everything
function AmbientOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" style={{ maxWidth: 430, margin: '0 auto' }}>
      {[
        { color: '#c4b5fd', x: '10%', y: '8%', size: 180, dur: 8 },
        { color: '#93c5fd', x: '70%', y: '20%', size: 140, dur: 10 },
        { color: '#f9a8d4', x: '50%', y: '55%', size: 160, dur: 9 },
        { color: '#6ee7b7', x: '20%', y: '75%', size: 120, dur: 11 },
        { color: '#fde68a', x: '80%', y: '70%', size: 100, dur: 7 },
      ].map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: orb.x, top: orb.y,
            width: orb.size, height: orb.size,
            background: `radial-gradient(circle, ${orb.color}55 0%, transparent 70%)`,
            filter: 'blur(32px)',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{ x: [0, 18, -12, 0], y: [0, -14, 10, 0], scale: [1, 1.08, 0.96, 1] }}
          transition={{ duration: orb.dur, repeat: Infinity, ease: 'easeInOut', delay: i * 1.4 }}
        />
      ))}
    </div>
  )
}

export default function HomePage() {
  const { events } = useStore()
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState<Filter>('all')

  const totalSkills = new Set(events.flatMap(e => e.skills)).size
  const totalWins = events.reduce((s, e) => s + e.subEvents.length, 0)
  const topEvent = [...events].sort((a, b) => b.significance - a.significance)[0]
  const topColor = topEvent ? getEventColor(events.map(e => e.id).indexOf(topEvent.id)).bg : '#7C3AED'

  const filtered = events.filter(e => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'portfolio') return e.visibility === 'portfolio'
    return e.category === activeFilter || e.category === 'both'
  })

  return (
    <div className="relative min-h-dvh pb-32" style={{ background: 'linear-gradient(160deg, #f3f0ff 0%, #eff6ff 40%, #fdf2f8 100%)' }}>
      <AmbientOrbs />

      <div className="relative z-10 px-4 pt-5">
        {/* Header */}
        <div className="mb-5">
          <p className="text-[10px] font-black text-violet-400 uppercase tracking-[0.2em] mb-1">Your Story</p>
          <h1 className="text-2xl font-black text-gray-900 leading-tight">Proof-of-Skill Ledger</h1>
          <p className="text-xs text-gray-400 mt-0.5">Every milestone. Every win. Forever.</p>
        </div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-5"
        >
          {[
            { icon: <Star className="w-3.5 h-3.5" />, value: events.length, label: 'Events', color: '#7C3AED' },
            { icon: <Zap className="w-3.5 h-3.5" />, value: totalWins, label: 'Micro-wins', color: '#EC4899' },
            { icon: <Flame className="w-3.5 h-3.5" />, value: totalSkills, label: 'Skills', color: '#F59E0B' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.06 }}
              className="flex-1 rounded-2xl p-2.5 flex flex-col items-center gap-0.5 border border-white/60 backdrop-blur-sm"
              style={{ background: `${s.color}12` }}
            >
              <div style={{ color: s.color }}>{s.icon}</div>
              <span className="text-lg font-black text-gray-900">{s.value}</span>
              <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wide">{s.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Segmented control */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-1 flex mb-6 shadow-sm border border-white/80 overflow-x-auto scrollbar-hide">
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`relative flex-1 min-w-max px-3 py-1.5 text-[11px] font-bold rounded-xl transition-colors whitespace-nowrap ${
                activeFilter === f.value ? 'text-white' : 'text-gray-400'
              }`}
            >
              {activeFilter === f.value && (
                <motion.div
                  layoutId="seg-pill"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: `linear-gradient(135deg, #7C3AED, #3B82F6)` }}
                  transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                />
              )}
              <span className="relative z-10">{f.label}</span>
            </button>
          ))}
        </div>

        {/* Timeline */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <TimelineView events={filtered} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* FAB */}
      <motion.button
        onClick={() => router.push('/add')}
        whileTap={{ scale: 0.88 }}
        animate={{ boxShadow: ['0 0 0 0 #7C3AED44', '0 0 0 14px #7C3AED00', '0 0 0 0 #7C3AED44'] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
        className="fixed bottom-28 right-4 w-14 h-14 rounded-2xl flex items-center justify-center z-40"
        style={{ background: 'linear-gradient(135deg, #7C3AED, #3B82F6)' }}
        aria-label="Add new event"
      >
        <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
      </motion.button>
    </div>
  )
}
