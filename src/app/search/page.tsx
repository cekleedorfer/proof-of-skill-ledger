'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { useStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { useProfile } from '@/lib/profile'
import { getTheme, getThemedColor, getBubbleColor, textColorForBg } from '@/lib/themes'

export default function SearchPage() {
  const { events } = useStore()
  const router = useRouter()
  const { profile } = useProfile()
  const theme = getTheme(profile.themeId)
  const [query, setQuery] = useState('')
  const allIds = events.map(e => e.id)

  const results = query.trim().length < 2 ? [] : events.filter(e =>
    e.title.toLowerCase().includes(query.toLowerCase()) ||
    e.skills.some(s => s.toLowerCase().includes(query.toLowerCase())) ||
    e.description.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="min-h-dvh pb-32 bg-[#f5f5f7] px-4 pt-5">
      <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-1">Search</p>
      <h1 className="text-2xl font-black text-gray-900 mb-5">Find anything</h1>

      <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100 mb-5">
        <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <input
          autoFocus
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search events, skills, moments..."
          className="flex-1 text-sm text-gray-900 placeholder-gray-300 outline-none bg-transparent"
        />
      </div>

      {query.trim().length >= 2 && results.length === 0 && (
        <p className="text-center text-sm text-gray-400 py-12">No results for "{query}"</p>
      )}

      <div className="space-y-3">
        {results.map((event, i) => {
          const idx = allIds.indexOf(event.id)
          const color = getThemedColor(theme, idx)
          const bubbleColor = getBubbleColor(theme, idx, event.significance)
          return (
            <motion.div key={event.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => router.push(`/event/${event.id}`)}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer active:scale-[0.98] transition-transform flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center font-bold text-xs shadow-md" style={{ background: bubbleColor, color: textColorForBg(bubbleColor) }}>
                {event.significance}★
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-gray-900">{event.title}</h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  {event.skills.slice(0, 3).map(s => <span key={s} className="text-[9px] px-2 py-0.5 rounded-full font-semibold" style={{ background: color.light, color: color.bg }}>{s}</span>)}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
