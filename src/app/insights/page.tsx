'use client'

import { motion } from 'framer-motion'
import { useStore } from '@/lib/store'

export default function InsightsPage() {
  const { events } = useStore()

  const allSkills = events.flatMap(e => e.skills)
  const skillCounts: Record<string, number> = {}
  allSkills.forEach(s => { skillCounts[s] = (skillCounts[s] || 0) + 1 })
  const topSkills = Object.entries(skillCounts).sort((a, b) => b[1] - a[1]).slice(0, 8)
  const maxCount = topSkills[0]?.[1] ?? 1

  const sigCounts = [1,2,3,4,5].map(n => ({ sig: n, count: events.filter(e => e.significance === n).length }))
  const proCount = events.filter(e => e.category === 'professional' || e.category === 'both').length
  const personalCount = events.filter(e => e.category === 'personal' || e.category === 'both').length
  const portfolioCount = events.filter(e => e.visibility === 'portfolio').length
  const totalSubs = events.reduce((acc, e) => acc + e.subEvents.length, 0)

  const colors = ['#0F766E', '#EA580C', '#BE185D', '#0369A1', '#15803D', '#B45309', '#9F1239', '#0E7490']

  return (
    <div className="min-h-dvh pb-32 bg-[#f5f5f7] px-4 pt-5">
      <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-1">Insights</p>
      <h1 className="text-2xl font-black text-gray-900 mb-5">Your Growth Map</h1>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: 'Total Events', value: events.length, color: '#0F766E' },
          { label: 'Micro-Wins', value: totalSubs, color: '#EA580C' },
          { label: 'Portfolio Items', value: portfolioCount, color: '#BE185D' },
          { label: 'Unique Skills', value: topSkills.length, color: '#0369A1' },
        ].map(stat => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-3xl font-black" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-xs text-gray-400 font-semibold mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Top Skills</p>
        <div className="space-y-3">
          {topSkills.map(([skill, count], i) => (
            <div key={skill}>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-gray-700">{skill}</span>
                <span className="text-gray-400 font-medium">{count}×</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div className="h-full rounded-full"
                  style={{ background: colors[i % colors.length] }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(count / maxCount) * 100}%` }}
                  transition={{ duration: 0.8, delay: i * 0.08, ease: 'easeOut' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Significance Distribution</p>
        <div className="flex items-end justify-between gap-2 h-24">
          {sigCounts.map(({ sig, count }) => (
            <div key={sig} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs font-bold text-gray-600">{count}</span>
              <motion.div className="w-full rounded-t-lg"
                style={{ background: colors[sig - 1] }}
                initial={{ height: 0 }}
                animate={{ height: count > 0 ? `${Math.max(8, (count / events.length) * 80)}px` : '4px' }}
                transition={{ duration: 0.8, delay: sig * 0.1, ease: 'easeOut' }} />
              <span className="text-[10px] text-gray-400">{sig}★</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Category Split</p>
        <div className="flex gap-4">
          {[
            { label: 'Career', count: proCount, color: '#0F766E' },
            { label: 'Personal', count: personalCount, color: '#EA580C' },
          ].map(c => (
            <div key={c.label} className="flex-1 rounded-2xl p-3 text-center" style={{ background: `${c.color}15` }}>
              <p className="text-2xl font-black" style={{ color: c.color }}>{c.count}</p>
              <p className="text-xs font-semibold" style={{ color: c.color }}>{c.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
