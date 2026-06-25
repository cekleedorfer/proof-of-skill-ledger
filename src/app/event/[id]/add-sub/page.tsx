'use client'

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, X } from 'lucide-react'
import { useStore } from '@/lib/store'
import { PageShell } from '@/components/layout/PageShell'
import { Significance } from '@/types'
import { toast } from 'sonner'

const suggestedTags = ['Leadership', 'Resilience', 'Communication', 'Technical Skill', 'Problem Solving', 'Collaboration', 'Emotional Intelligence', 'Initiative', 'Discipline', 'Creativity']

export default function AddSubEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { events, addSubEvent } = useStore()
  const event = events.find(e => e.id === id)

  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [whatHappened, setWhatHappened] = useState('')
  const [whyItMattered, setWhyItMattered] = useState('')
  const [significance, setSignificance] = useState<Significance>(2)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  function addTag(tag: string) {
    const t = tag.trim()
    if (t && !tags.includes(t)) setTags(prev => [...prev, t])
    setTagInput('')
  }

  function handleSave() {
    if (!title.trim() || !date) {
      toast.error('Please fill in title and date.')
      return
    }
    addSubEvent(id, {
      id: `se-${Date.now()}`,
      parentEventId: id,
      title: title.trim(),
      date,
      description: whatHappened,
      whatHappened,
      skillGrowth: whyItMattered,
      significance,
      skillTags: tags,
      aiSummary: 'AI summary will be generated based on your reflection.',
    })
    toast.success('Sub-event saved!')
    router.push(`/event/${id}`)
  }

  if (!event) return null

  return (
    <PageShell>
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-violet-600 font-semibold text-sm mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        {event.title}
      </button>

      <div className="mb-6">
        <p className="text-xs font-semibold text-violet-500 uppercase tracking-widest mb-1">New Sub-event</p>
        <h1 className="text-2xl font-bold text-gray-900">Add a Micro-win</h1>
        <p className="text-sm text-gray-400 mt-0.5">A step within <span className="font-medium text-gray-600">{event.title}</span></p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. First 20-Mile Training Run"
            className="w-full text-sm text-gray-900 placeholder-gray-300 outline-none font-medium"
          />
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-2">Date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full text-sm text-gray-900 outline-none"
          />
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-2">What happened?</label>
          <textarea
            value={whatHappened}
            onChange={e => setWhatHappened(e.target.value)}
            placeholder="Tell the story of this moment..."
            rows={4}
            className="w-full text-sm text-gray-900 placeholder-gray-300 outline-none resize-none leading-relaxed"
          />
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-2">Why did it matter?</label>
          <textarea
            value={whyItMattered}
            onChange={e => setWhyItMattered(e.target.value)}
            placeholder="What skill or growth did this show?"
            rows={3}
            className="w-full text-sm text-gray-900 placeholder-gray-300 outline-none resize-none leading-relaxed"
          />
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-3">
            Significance <span className="text-violet-500 font-bold">{significance}</span>/5
          </label>
          <div className="flex gap-2">
            {([1, 2, 3, 4, 5] as Significance[]).map(n => (
              <button
                key={n}
                onClick={() => setSignificance(n)}
                className={`flex-1 h-10 rounded-xl text-sm font-bold transition-all ${
                  significance === n
                    ? 'bg-gradient-to-br from-violet-500 to-blue-500 text-white shadow-md shadow-violet-200'
                    : significance > n
                    ? 'bg-violet-100 text-violet-500'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-3">Skill Tags</label>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 text-xs bg-violet-100 text-violet-700 rounded-full px-3 py-1 font-medium">
                {tag}
                <button onClick={() => setTags(p => p.filter(t => t !== tag))}><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTag(tagInput)}
              placeholder="Add a tag..."
              className="flex-1 text-sm text-gray-900 placeholder-gray-300 outline-none bg-gray-50 rounded-xl px-3 py-2"
            />
            <button onClick={() => addTag(tagInput)} className="w-9 h-9 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {suggestedTags.filter(t => !tags.includes(t)).map(t => (
              <button key={t} onClick={() => addTag(t)} className="text-[11px] bg-gray-100 text-gray-500 rounded-full px-2.5 py-1 hover:bg-violet-50 hover:text-violet-600 transition-colors">
                + {t}
              </button>
            ))}
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-violet-500 to-blue-500 text-white rounded-2xl py-4 font-bold text-base shadow-lg shadow-violet-200"
        >
          Save Sub-event
        </motion.button>
      </motion.div>
    </PageShell>
  )
}
