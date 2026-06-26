'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { getEventColor } from '@/lib/colors'
import { BookOpen, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

export default function PortfolioPage() {
  const { events } = useStore()
  const router = useRouter()
  const allIds = events.map(e => e.id)
  const portfolio = events.filter(e => e.visibility === 'portfolio')
  const professional = portfolio.filter(e => e.category === 'professional' || e.category === 'both')
  const personal = portfolio.filter(e => e.category === 'personal' || e.category === 'both')

  function handleShare() {
    toast.success('Portfolio link copied! (demo)')
  }

  return (
    <div className="min-h-dvh pb-32" style={{ background: 'linear-gradient(160deg, #f0fdfa 0%, #fff7ed 50%, #f0fdf4 100%)' }}>
      <div className="px-4 pt-5 pb-4">
        <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-1">Portfolio</p>
        <h1 className="text-2xl font-black text-gray-900 mb-1">Your Public Story</h1>
        <p className="text-xs text-gray-400 mb-4">{portfolio.length} events marked public</p>
        <motion.button whileTap={{ scale: 0.97 }} onClick={handleShare}
          className="w-full text-white rounded-2xl py-3.5 font-semibold text-sm flex items-center justify-center gap-2 shadow-md"
          style={{ background: 'linear-gradient(135deg, #0F766E, #0891B2)' }}>
          <ExternalLink className="w-4 h-4" /> Share Portfolio Link
        </motion.button>
      </div>

      <div className="px-4 space-y-6">
        {[
          { label: 'Career & Education', items: professional },
          { label: 'Personal Growth', items: personal },
        ].map(section => section.items.length > 0 && (
          <div key={section.label}>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-3.5 h-3.5 text-teal-600" />
              <p className="text-xs font-bold uppercase tracking-widest text-teal-600">{section.label}</p>
            </div>
            <div className="space-y-3">
              {section.items.map((event, i) => {
                const color = getEventColor(allIds.indexOf(event.id))
                return (
                  <motion.div key={event.id}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    onClick={() => router.push(`/event/${event.id}`)}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer active:scale-[0.99] transition-transform">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center text-white font-black text-sm shadow-md"
                        style={{ background: color.bg }}>
                        {event.significance}★
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm text-gray-900">{event.title}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</p>
                        <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-2">{event.aiSummary}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {event.skills.slice(0, 3).map(s => (
                            <span key={s} className="text-[9px] px-2 py-0.5 rounded-full font-semibold" style={{ background: color.light, color: color.bg }}>{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
