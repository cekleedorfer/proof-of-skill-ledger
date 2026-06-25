'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { useStore } from '@/lib/store'
import { PageShell } from '@/components/layout/PageShell'
import { getEventColor } from '@/lib/colors'

export default function SearchPage() {
  const { events } = useStore()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const allIds = events.map(e => e.id)

  const results = query.trim().length < 2 ? [] : events.filter(e =>
    e.title.toLowerCase().includes(query.toLowerCase()) ||
    e.description.toLowerCase().includes(query.toLowerCase()) ||
    e.skills.some(s => s.toLowerCase().includes(query.toLowerCase()))
  )

  return (
    <PageShell>
      <div className="mb-5">
        <p className="text-xs font-semibold text-violet-500 uppercase tracking-widest mb-1">Search</p>
        <h1 className="text-2xl font-bold text-gray-900">Find anything</h1>
      </div>

      <div className="flex items-center gap-2 bg-white rounded-2xl shadow-sm border border-gray-200 px-4 py-3 mb-5">
        <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Events, skills, reflections..."
          className="flex-1 text-sm text-gray-900 placeholder-gray-300 outline-none bg-transparent"
          autoFocus
        />
      </div>

      {query.trim().length >= 2 && results.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-10">No results for &ldquo;{query}&rdquo;</p>
      )}

      <div className="space-y-3">
        {results.map((event, i) => {
          const color = getEventColor(allIds.indexOf(event.id))
          return (
            <div
              key={event.id}
              onClick={() => router.push(`/event/${event.id}`)}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer active:scale-[0.98] transition-transform flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl flex-shrink-0" style={{ background: color.bg }} />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-gray-900 truncate">{event.title}</h3>
                <p className="text-[10px] text-gray-400">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
              </div>
            </div>
          )
        })}
      </div>
    </PageShell>
  )
}
