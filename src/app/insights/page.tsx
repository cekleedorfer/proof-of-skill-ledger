'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/lib/store'
import { PageShell } from '@/components/layout/PageShell'

type InsightTab = 'skills' | 'growth' | 'trends'

const BAR_COLORS = ['#7C3AED', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#06B6D4', '#8B5CF6']

export default function InsightsPage() {
  const { events } = useStore()
  const [tab, setTab] = useState<InsightTab>('skills')

  const skillCount: Record<string, number> = {}
  events.forEach(e => {
    e.skills.forEach(s => { skillCount[s] = (skillCount[s] || 0) + 1 })
    e.subEvents.forEach(se => se.skillTags.forEach(s => { skillCount[s] = (skillCount[s] || 0) + 1 }))
  })
  const sortedSkills = Object.entries(skillCount).sort((a, b) => b[1] - a[1])
  const totalMentions = sortedSkills.reduce((s, [, c]) => s + c, 0)

  const sigCount: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  events.forEach(e => { sigCount[e.significance]++ })

  const totalSubEvents = events.reduce((s, e) => s + e.subEvents.length, 0)
  const portfolioCount = events.filter(e => e.visibility === 'portfolio').length
  const catCount = { professional: 0, personal: 0, both: 0 }
  events.forEach(e => { catCount[e.category]++ })

  const tabs: { id: InsightTab; label: string }[] = [
    { id: 'skills', label: 'Skills' },
    { id: 'growth', label: 'Growth' },
    { id: 'trends', label: 'Trends' },
  ]

  return (
    <PageShell>
      <div className="mb-5">
        <p className="text-xs font-semibold text-violet-500 uppercase tracking-widest mb-1">Your Growth</p>
        <h1 className="text-2xl font-bold text-gray-900">Insights</h1>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {[
          { label: 'Events', value: events.length, color: '#7C3AED' },
          { label: 'Micro-wins', value: totalSubEvents, color: '#EC4899' },
          { label: 'Portfolio', value: portfolioCount, color: '#10B981' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 text-center"
          >
            <div className="text-2xl font-bold text-gray-900" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[10px] text-gray-400 font-semibold mt-0.5">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Tab switcher */}
      <div className="bg-white rounded-2xl p-1 flex mb-5 shadow-sm border border-gray-100">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`relative flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${tab === t.id ? 'text-white' : 'text-gray-400'}`}
          >
            {tab === t.id && (
              <motion.div
                layoutId="insight-pill"
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-600 to-blue-500"
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              />
            )}
            <span className="relative z-10">{t.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'skills' && (
          <motion.div key="skills" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Skill Growth</p>
              <p className="text-[11px] text-gray-300 mb-4">See how your skills have grown over time.</p>
              <div className="space-y-3.5">
                {sortedSkills.slice(0, 8).map(([skill, count], i) => {
                  const pct = Math.round((count / (sortedSkills[0][1] || 1)) * 100)
                  return (
                    <div key={skill}>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-xs font-semibold text-gray-800">{skill}</span>
                        <span className="text-xs font-bold" style={{ color: BAR_COLORS[i % BAR_COLORS.length] }}>{pct}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.1 + i * 0.06, duration: 0.6, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{ background: BAR_COLORS[i % BAR_COLORS.length] }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
              <button className="w-full mt-4 py-2.5 border border-gray-200 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1">
                View All Skills →
              </button>
            </div>
          </motion.div>
        )}

        {tab === 'growth' && (
          <motion.div key="growth" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Impact Distribution</p>
              <div className="flex items-end gap-2 h-28">
                {[1, 2, 3, 4, 5].map((sig, i) => {
                  const maxSig = Math.max(...Object.values(sigCount), 1)
                  const h = (sigCount[sig] / maxSig) * 88
                  return (
                    <div key={sig} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs font-bold text-gray-700">{sigCount[sig]}</span>
                      <div className="w-full rounded-t-lg overflow-hidden bg-gray-100" style={{ height: 88 }}>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: h }}
                          transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: 'easeOut' }}
                          className="w-full rounded-t-lg"
                          style={{ background: BAR_COLORS[i], marginTop: 88 - h }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-400">L{sig}</span>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Category Mix</p>
              <div className="flex gap-2">
                {[
                  { k: 'professional', label: 'Professional', color: '#3B82F6' },
                  { k: 'personal', label: 'Personal', color: '#7C3AED' },
                  { k: 'both', label: 'Both', color: '#EC4899' },
                ].map(c => (
                  <div key={c.k} className="flex-1 rounded-2xl p-3 text-white text-center" style={{ background: c.color }}>
                    <div className="text-xl font-bold">{catCount[c.k as keyof typeof catCount]}</div>
                    <div className="text-[9px] font-semibold opacity-80 mt-0.5">{c.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {tab === 'trends' && (
          <motion.div key="trends" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">✨ Top Skills</p>
              <div className="space-y-3">
                {sortedSkills.slice(0, 5).map(([skill, count], i) => (
                  <div key={skill} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: BAR_COLORS[i] }}>
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">{skill}</p>
                      <p className="text-[10px] text-gray-400">{count} mention{count > 1 ? 's' : ''} · {Math.round((count / totalMentions) * 100)}% of story</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative bg-white rounded-2xl p-4 shadow-sm border border-gray-100 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-blue-50 opacity-50" />
              <div className="relative">
                <p className="text-xs font-semibold text-violet-600 uppercase tracking-wide mb-2">Growth Themes</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['Resilience', 'Leadership', 'Self-Directed Learning', 'Communication', 'Technical Depth'].map(theme => (
                    <span key={theme} className="text-xs bg-violet-100 text-violet-700 rounded-full px-3 py-1 font-semibold">{theme}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  )
}
