'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Sparkles } from 'lucide-react'
import { useStore } from '@/lib/store'
import { PageShell } from '@/components/layout/PageShell'

export default function SubEventDetailPage({
  params,
}: {
  params: Promise<{ id: string; subId: string }>
}) {
  const { id, subId } = use(params)
  const { events } = useStore()
  const router = useRouter()

  const event = events.find(e => e.id === id)
  const sub = event?.subEvents.find(s => s.id === subId)

  if (!event || !sub) {
    return (
      <PageShell>
        <div className="text-center py-20">
          <p className="text-gray-400">Sub-event not found.</p>
        </div>
      </PageShell>
    )
  }

  const tagColors = [
    'bg-violet-100 text-violet-700',
    'bg-blue-100 text-blue-700',
    'bg-emerald-100 text-emerald-700',
    'bg-amber-100 text-amber-700',
    'bg-rose-100 text-rose-700',
  ]

  return (
    <PageShell className="bg-gradient-to-b from-violet-50 to-white">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-violet-600 font-semibold text-sm mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        {event.title}
      </button>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-blue-500 flex items-center justify-center shadow-md shadow-violet-200">
            <span className="text-white font-bold text-sm">{sub.significance}</span>
          </div>
          <div>
            <p className="text-[11px] text-violet-500 font-semibold uppercase tracking-wide">Sub-event</p>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">{sub.title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-gray-400 ml-12">
          <Calendar className="w-3.5 h-3.5" />
          <span className="text-xs">
            {new Date(sub.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        {/* What happened */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">What happened</p>
          <p className="text-sm text-gray-700 leading-relaxed">{sub.whatHappened}</p>
        </div>

        {/* Skill growth */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">What skill or growth did this show?</p>
          <p className="text-sm text-gray-700 leading-relaxed">{sub.skillGrowth}</p>
        </div>

        {/* Skill tags */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Skills Demonstrated</p>
          <div className="flex flex-wrap gap-2">
            {sub.skillTags.map((tag, i) => (
              <span
                key={tag}
                className={`text-xs font-semibold rounded-full px-3 py-1 ${tagColors[i % tagColors.length]}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Significance */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Significance</p>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map(i => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full ${i <= sub.significance ? 'bg-gradient-to-r from-violet-500 to-blue-500' : 'bg-gray-100'}`}
              />
            ))}
          </div>
        </div>

        {/* AI summary */}
        <div className="relative bg-white rounded-2xl p-5 shadow-sm border border-gray-100 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-blue-50 opacity-60" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-xs font-semibold text-violet-600 uppercase tracking-wide">AI Copilot Summary</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{sub.aiSummary}</p>
          </div>
        </div>

        {sub.evidenceUrl && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Evidence</p>
            <p className="text-xs text-violet-600 truncate">{sub.evidenceUrl}</p>
          </div>
        )}
      </motion.div>
    </PageShell>
  )
}
