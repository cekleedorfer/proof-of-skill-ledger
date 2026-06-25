'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, X } from 'lucide-react'
import { useStore } from '@/lib/store'
import { PageShell } from '@/components/layout/PageShell'
import { Category, Significance, Visibility } from '@/types'
import { toast } from 'sonner'

const suggestedSkills = ['Leadership', 'Resilience', 'Communication', 'Technical Skill', 'Problem Solving', 'Collaboration', 'Creativity', 'Initiative', 'Emotional Intelligence', 'Discipline']

export default function AddEventPage() {
  const router = useRouter()
  const { addEvent } = useStore()

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<Category>('personal')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [significance, setSignificance] = useState<Significance>(3)
  const [visibility, setVisibility] = useState<Visibility>('private')
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState('')

  function addSkill(skill: string) {
    const trimmed = skill.trim()
    if (trimmed && !skills.includes(trimmed)) {
      setSkills(prev => [...prev, trimmed])
    }
    setSkillInput('')
  }

  function removeSkill(skill: string) {
    setSkills(prev => prev.filter(s => s !== skill))
  }

  function handleSave() {
    if (!title.trim() || !date) {
      toast.error('Please fill in title and date.')
      return
    }
    addEvent({
      id: `e-${Date.now()}`,
      title: title.trim(),
      category,
      date,
      description,
      significance,
      visibility,
      skills,
      subEvents: [],
      aiSummary: 'Your AI story will appear here after you add more details and reflections.',
    })
    toast.success('Event saved!')
    router.push('/')
  }

  return (
    <PageShell>
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-violet-600 font-semibold text-sm mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="mb-6">
        <p className="text-xs font-semibold text-violet-500 uppercase tracking-widest mb-1">New Event</p>
        <h1 className="text-2xl font-bold text-gray-900">Add a Milestone</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Title */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-2">Event Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Got into Boston College"
            className="w-full text-sm text-gray-900 placeholder-gray-300 outline-none font-medium"
          />
        </div>

        {/* Category */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-3">Category</label>
          <div className="flex gap-2">
            {(['professional', 'personal', 'both'] as Category[]).map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                  category === c
                    ? 'bg-gradient-to-r from-violet-500 to-blue-500 text-white shadow-md shadow-violet-200'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Date */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-2">Date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full text-sm text-gray-900 outline-none"
          />
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-2">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="What happened? Why does this matter to you?"
            rows={4}
            className="w-full text-sm text-gray-900 placeholder-gray-300 outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Significance */}
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

        {/* Skills */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-3">Skills / Tags</label>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {skills.map(skill => (
              <span key={skill} className="flex items-center gap-1 text-xs bg-violet-100 text-violet-700 rounded-full px-3 py-1 font-medium">
                {skill}
                <button onClick={() => removeSkill(skill)}><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addSkill(skillInput)}
              placeholder="Add a skill..."
              className="flex-1 text-sm text-gray-900 placeholder-gray-300 outline-none bg-gray-50 rounded-xl px-3 py-2"
            />
            <button
              onClick={() => addSkill(skillInput)}
              className="w-9 h-9 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {suggestedSkills.filter(s => !skills.includes(s)).map(s => (
              <button
                key={s}
                onClick={() => addSkill(s)}
                className="text-[11px] bg-gray-100 text-gray-500 rounded-full px-2.5 py-1 hover:bg-violet-50 hover:text-violet-600 transition-colors"
              >
                + {s}
              </button>
            ))}
          </div>
        </div>

        {/* Visibility */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-3">Visibility</label>
          <div className="flex gap-2">
            {(['private', 'portfolio'] as Visibility[]).map(v => (
              <button
                key={v}
                onClick={() => setVisibility(v)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                  visibility === v
                    ? 'bg-gradient-to-r from-violet-500 to-blue-500 text-white shadow-md shadow-violet-200'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {v === 'private' ? '🔒 Private' : '📖 Portfolio'}
              </button>
            ))}
          </div>
        </div>

        {/* Evidence placeholder */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 border-dashed">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-2">Evidence</label>
          <button className="w-full py-6 rounded-xl bg-gray-50 text-gray-400 text-sm flex flex-col items-center gap-1">
            <span className="text-2xl">📎</span>
            <span>Upload a photo, certificate, or link</span>
            <span className="text-xs text-gray-300">Coming soon</span>
          </button>
        </div>

        {/* Save */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-violet-500 to-blue-500 text-white rounded-2xl py-4 font-bold text-base shadow-lg shadow-violet-200"
        >
          Save Event
        </motion.button>
      </motion.div>
    </PageShell>
  )
}
