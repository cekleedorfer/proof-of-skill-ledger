'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { useStore } from '@/lib/store'
import { PageShell } from '@/components/layout/PageShell'
import { TimelineView } from '@/components/timeline/TimelineView'
import { Category } from '@/types'

type Filter = 'all' | Category | 'portfolio'

const filters: { label: string; value: Filter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Professional', value: 'professional' },
  { label: 'Personal', value: 'personal' },
  { label: 'Portfolio', value: 'portfolio' },
]

export default function HomePage() {
  const { events } = useStore()
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState<Filter>('all')

  const filtered = events.filter(e => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'portfolio') return e.visibility === 'portfolio'
    return e.category === activeFilter || e.category === 'both'
  })

  return (
    <PageShell>
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-violet-500 uppercase tracking-widest mb-1">Your Story</p>
        <h1 className="text-2xl font-bold text-gray-900">Proof-of-Skill Ledger</h1>
        <p className="text-sm text-gray-400 mt-0.5">Every milestone. Every win. Documented.</p>
      </div>

      {/* Segmented control */}
      <div className="bg-white rounded-2xl p-1 flex mb-6 shadow-sm border border-gray-100 overflow-x-auto scrollbar-hide">
        {filters.map(f => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={`relative flex-1 min-w-max px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap ${
              activeFilter === f.value ? 'text-white' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {activeFilter === f.value && (
              <motion.div
                layoutId="segment-pill"
                className="absolute inset-0 bg-gradient-to-r from-violet-500 to-blue-500 rounded-xl"
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              />
            )}
            <span className="relative z-10">{f.label}</span>
          </button>
        ))}
      </div>

      {/* Timeline */}
      <TimelineView events={filtered} />

      {/* FAB */}
      <motion.button
        onClick={() => router.push('/add')}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-28 right-4 w-14 h-14 bg-gradient-to-br from-violet-500 to-blue-500 rounded-2xl shadow-xl shadow-violet-300 flex items-center justify-center z-40"
        aria-label="Add new event"
      >
        <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
      </motion.button>
    </PageShell>
  )
}
