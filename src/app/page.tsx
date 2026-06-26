'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { TimelineView } from '@/components/timeline/TimelineView'

type Filter = 'all' | 'professional' | 'personal' | 'portfolio'
const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'professional', label: 'Career' },
  { key: 'personal', label: 'Personal' },
  { key: 'portfolio', label: 'Portfolio' },
]

export default function Home() {
  const { events } = useStore()
  const router = useRouter()
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = events.filter(e => {
    if (filter === 'all') return true
    if (filter === 'portfolio') return e.visibility === 'portfolio'
    return e.category === filter || e.category === 'both'
  })

  const totalSubs = events.reduce((acc, e) => acc + e.subEvents.length, 0)
  const portfolioCount = events.filter(e => e.visibility === 'portfolio').length
  const topSkills = [...new Set(events.flatMap(e => e.skills))].slice(0, 3)

  return (
    <div className="min-h-dvh pb-32 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #f0fdfa 0%, #fff7ed 50%, #f0fdf4 100%)' }}>
      <div className="absolute top-[-80px] left-[-60px] w-64 h-64 rounded-full opacity-30 pointer-events-none" style={{ background: 'radial-gradient(circle, #0d9488 0%, transparent 70%)', filter: 'blur(48px)' }} />
      <div className="absolute top-[120px] right-[-80px] w-72 h-72 rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #fb923c 0%, transparent 70%)', filter: 'blur(56px)' }} />
      <div className="absolute top-[420px] left-[-40px] w-56 h-56 rounded-full opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle, #4ade80 0%, transparent 70%)', filter: 'blur(40px)' }} />

      <div className="relative px-4 pt-6 pb-4">
        <div className="flex items-start justify-between mb-1">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#0F766E' }}>Proof of Skill</p>
            <h1 className="text-3xl font-black text-gray-900 leading-tight">Your Ledger</h1>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => router.push('/add')}
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal-300/40 mt-1"
            style={{ background: 'linear-gradient(135deg, #0F766E, #0891B2)' }}
          >
            <Plus className="w-5 h-5" strokeWidth={2.5} />
          </motion.button>
        </div>

        <div className="mt-4 rounded-2xl px-4 py-3 flex items-center justify-between text-white shadow-lg"
          style={{ background: 'linear-gradient(135deg, #0F766E 0%, #0891B2 100%)' }}>
          <div className="text-center">
            <p className="text-xl font-black">{events.length}</p>
            <p className="text-[10px] font-semibold opacity-75">Events</p>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center">
            <p className="text-xl font-black">{totalSubs}</p>
            <p className="text-[10px] font-semibold opacity-75">Micro-Wins</p>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center">
            <p className="text-xl font-black">{portfolioCount}</p>
            <p className="text-[10px] font-semibold opacity-75">Portfolio</p>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center flex-1 min-w-0 pl-2">
            <div className="flex flex-wrap gap-0.5 justify-center">
              {topSkills.map(s => <span key={s} className="text-[8px] bg-white/20 rounded-full px-1.5 py-0.5 font-semibold">{s}</span>)}
            </div>
            <p className="text-[10px] font-semibold opacity-75 mt-0.5">Top Skills</p>
          </div>
        </div>

        <div className="flex gap-2 mt-4 overflow-x-auto pb-1 hide-scrollbar">
          {FILTERS.map(f => (
            <motion.button key={f.key} onClick={() => setFilter(f.key)} whileTap={{ scale: 0.95 }}
              className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all"
              style={filter === f.key
                ? { background: 'linear-gradient(135deg, #0F766E, #0891B2)', color: 'white', boxShadow: '0 4px 12px rgba(15,118,110,0.35)' }
                : { background: 'white', color: '#6B7280', border: '1px solid #E5E7EB' }
              }>
              {f.label}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="relative px-4">
        <AnimatePresence mode="wait">
          <motion.div key={filter} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <TimelineView events={filtered} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
