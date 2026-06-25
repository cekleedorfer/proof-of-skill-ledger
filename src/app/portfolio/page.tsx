'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Share2, Sparkles, BookOpen } from 'lucide-react'
import { useStore } from '@/lib/store'
import { PageShell } from '@/components/layout/PageShell'
import { getEventColor } from '@/lib/colors'
import { toast } from 'sonner'

type PortfolioTab = 'highlights' | 'projects' | 'skills' | 'story'

export default function PortfolioPage() {
  const { events } = useStore()
  const router = useRouter()
  const [tab, setTab] = useState<PortfolioTab>('highlights')

  const allIds = events.map(e => e.id)
  const portfolioEvents = events.filter(e => e.visibility === 'portfolio')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const professional = portfolioEvents.filter(e => e.category === 'professional' || e.category === 'both')
  const personal = portfolioEvents.filter(e => e.category === 'personal')

  // Aggregate skills from portfolio events
  const skillCount: Record<string, number> = {}
  portfolioEvents.forEach(e => e.skills.forEach(s => { skillCount[s] = (skillCount[s] || 0) + 1 }))
  const topSkills = Object.entries(skillCount).sort((a, b) => b[1] - a[1])

  function handleShare() {
    navigator.clipboard.writeText('https://proof-of-skill.app/portfolio/claire')
    toast.success('Portfolio link copied!')
  }

  const tabs: { id: PortfolioTab; label: string }[] = [
    { id: 'highlights', label: 'Highlights' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'story', label: 'Story' },
  ]

  if (portfolioEvents.length === 0) {
    return (
      <PageShell>
        <div className="text-center py-24">
          <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400 text-sm">No portfolio events yet.</p>
          <p className="text-gray-300 text-xs mt-1">Toggle portfolio visibility on any event.</p>
        </div>
      </PageShell>
    )
  }

  return (
    <div className="min-h-dvh pb-32 bg-[#f5f5f7]">
      {/* Hero header */}
      <div className="relative bg-gradient-to-br from-violet-600 to-blue-500 px-4 pt-8 pb-6 overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 75% 15%, white, transparent 55%)' }} />
        <div className="relative">
          <p className="text-xs font-bold text-violet-200 uppercase tracking-widest mb-1">Portfolio</p>
          <h1 className="text-2xl font-bold text-white mb-0.5">My Highlights</h1>
          <p className="text-sm text-violet-200 mb-4">A curated view of my proudest moments and growth.</p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-2xl px-4 py-2.5 text-sm font-semibold"
          >
            <Share2 className="w-4 h-4" />
            Share Portfolio
          </motion.button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="bg-white border-b border-gray-100 px-4 flex gap-1 sticky top-0 z-10">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`relative px-3 py-3.5 text-xs font-bold transition-colors ${tab === t.id ? 'text-violet-600' : 'text-gray-400'}`}
          >
            {t.label}
            {tab === t.id && (
              <motion.div layoutId="portfolio-tab-line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      <div className="px-4 pt-4">
        <AnimatePresence mode="wait">
          {/* Highlights */}
          {tab === 'highlights' && (
            <motion.div key="highlights" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
              {portfolioEvents.map((event, i) => {
                const color = getEventColor(allIds.indexOf(event.id))
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    onClick={() => router.push(`/event/${event.id}`)}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer active:scale-[0.98] transition-transform flex items-center gap-3"
                  >
                    <div
                      className="w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center text-white font-bold text-xs shadow-md"
                      style={{ background: color.bg, boxShadow: `0 4px 12px ${color.bg}55` }}
                    >
                      {event.significance}★
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-gray-900 leading-snug">{event.title}</h3>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {event.skills.slice(0, 2).map(s => (
                          <span key={s} className="text-[9px] px-2 py-0.5 rounded-full font-semibold" style={{ background: color.light, color: color.bg }}>{s}</span>
                        ))}
                      </div>
                    </div>
                    <div className="text-xs font-bold text-gray-200 capitalize">{event.significance === 5 ? 'High' : event.significance >= 3 ? 'Medium' : 'Low'}</div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}

          {/* Projects */}
          {tab === 'projects' && (
            <motion.div key="projects" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              {professional.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <span className="w-1 h-4 rounded-full bg-blue-500 inline-block" />
                    Professional
                  </p>
                  <div className="space-y-3">
                    {professional.map((event, i) => {
                      const color = getEventColor(allIds.indexOf(event.id))
                      return (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.07 }}
                          onClick={() => router.push(`/event/${event.id}`)}
                          className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer active:scale-[0.98] transition-transform"
                        >
                          <h3 className="font-semibold text-sm text-gray-900 mb-1">{event.title}</h3>
                          <p className="text-[10px] text-gray-400 mb-2">{new Date(event.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                          <div className="flex items-start gap-2 rounded-xl p-2.5" style={{ background: color.light }}>
                            <Sparkles className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: color.bg }} />
                            <p className="text-[10px] leading-relaxed line-clamp-2" style={{ color: color.bg }}>{event.aiSummary}</p>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              )}
              {personal.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <span className="w-1 h-4 rounded-full bg-violet-500 inline-block" />
                    Personal
                  </p>
                  <div className="space-y-3">
                    {personal.map((event, i) => {
                      const color = getEventColor(allIds.indexOf(event.id))
                      return (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.07 }}
                          onClick={() => router.push(`/event/${event.id}`)}
                          className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer active:scale-[0.98] transition-transform"
                        >
                          <h3 className="font-semibold text-sm text-gray-900 mb-1">{event.title}</h3>
                          <p className="text-[10px] text-gray-400 mb-2">{new Date(event.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                          <div className="flex items-start gap-2 rounded-xl p-2.5" style={{ background: color.light }}>
                            <Sparkles className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: color.bg }} />
                            <p className="text-[10px] leading-relaxed line-clamp-2" style={{ color: color.bg }}>{event.aiSummary}</p>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Skills */}
          {tab === 'skills' && (
            <motion.div key="skills" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Skills in this Portfolio</p>
                <div className="space-y-3">
                  {topSkills.map(([skill, count], i) => (
                    <div key={skill} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: ['#7C3AED','#EC4899','#10B981','#F59E0B','#3B82F6'][i % 5] }}>
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-xs font-semibold text-gray-800">{skill}</span>
                          <span className="text-[10px] text-gray-400">{count}×</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(count / (topSkills[0][1] || 1)) * 100}%` }}
                            transition={{ delay: 0.1 + i * 0.06, duration: 0.5 }}
                            className="h-full rounded-full"
                            style={{ background: ['#7C3AED','#EC4899','#10B981','#F59E0B','#3B82F6'][i % 5] }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Story */}
          {tab === 'story' && (
            <motion.div key="story" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="relative bg-white rounded-2xl p-5 shadow-sm border border-gray-100 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-blue-50 opacity-50" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-violet-600 uppercase tracking-wide">AI Narrative</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    This portfolio tells the story of someone who doesn&apos;t wait for opportunities — they create them. From building their first Python project to leading a 400-person mental health campaign, every entry reflects a consistent pattern: identify a challenge, commit fully, and extract the lesson.
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed mt-3">
                    What makes this story distinctive isn&apos;t any single achievement — it&apos;s the thread that connects them. Personal growth and professional growth aren&apos;t separate here. They reinforce each other.
                  </p>
                  <div className="mt-4 pt-4 border-t border-violet-100">
                    <p className="text-[10px] text-violet-400 font-medium">Generated from {portfolioEvents.length} portfolio events</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
