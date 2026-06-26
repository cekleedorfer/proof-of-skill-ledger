'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { Category, Significance } from '@/types'
import { toast } from 'sonner'
import { ArrowLeft, Briefcase, Heart, Sparkles } from 'lucide-react'

type FieldPrompts = { title: string; description: string; descPlaceholder: string; impact: string }

const PROMPTS: Record<Category, FieldPrompts> = {
  professional: {
    title: 'e.g. Internship at a startup, Won a case competition...',
    description: 'What was this opportunity? What role did you play?',
    descPlaceholder: 'I spent the summer as a data analyst intern at XYZ Corp, where I...',
    impact: 'What skill, outcome, or opportunity came from this? (e.g. return offer, new skill, confidence)',
  },
  personal: {
    title: 'e.g. Ran my first marathon, Reconciled with a family member...',
    description: 'What happened? Why did it matter to you?',
    descPlaceholder: 'This summer I trained for 5 months and ran my first half-marathon...',
    impact: 'How did this shape you? What did you learn about yourself?',
  },
  both: {
    title: 'e.g. Gave a TEDx talk, Published an op-ed, Led a campus campaign...',
    description: 'What did you do, and how did it blend personal meaning with professional impact?',
    descPlaceholder: 'I gave a talk on the hidden emotional labor of first-gen students...',
    impact: 'What was the outcome — both for your career and your sense of self?',
  },
}

const SIG_LABELS: Record<number, string> = {
  1: 'Small win — meaningful to me',
  2: 'Notable — worth remembering',
  3: 'Significant — changed something',
  4: 'Major — shaped my direction',
  5: 'Life-defining — core to my story',
}

const CAT_OPTIONS: { value: Category; icon: typeof Briefcase; label: string; desc: string }[] = [
  { value: 'professional', icon: Briefcase, label: 'Career', desc: 'Work, school, skills' },
  { value: 'personal', icon: Heart, label: 'Personal', desc: 'Life, growth, relationships' },
  { value: 'both', icon: Sparkles, label: 'Both', desc: 'Bridges career & life' },
]

export default function AddPage() {
  const router = useRouter()
  const { addEvent } = useStore()
  const [category, setCategory] = useState<Category>('professional')
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [description, setDescription] = useState('')
  const [significance, setSignificance] = useState<Significance>(3)
  const [skills, setSkills] = useState('')
  const [visibility, setVisibility] = useState<'portfolio' | 'private'>('portfolio')

  const prompts = PROMPTS[category]

  function handleSave() {
    if (!title.trim()) { toast.error('Give it a title first'); return }
    addEvent({
      id: `user-${Date.now()}`,
      title: title.trim(),
      category,
      date,
      description: description.trim() || prompts.descPlaceholder,
      significance,
      visibility,
      skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      aiSummary: `This event reflects ${title.trim()} — a moment of real significance in your story.`,
      subEvents: [],
      photos: [],
    })
    toast.success('Event added to your ledger ✦')
    router.push('/')
  }

  return (
    <div className="min-h-dvh pb-36" style={{ background: 'linear-gradient(160deg, #f0fdfa 0%, #fff7ed 50%, #f0fdf4 100%)' }}>
      <div className="px-4 pt-5 pb-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-white/80 flex items-center justify-center shadow-sm">
          <ArrowLeft className="w-4 h-4 text-gray-500" />
        </button>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-teal-600">New Entry</p>
          <h1 className="text-xl font-black text-gray-900">Add an Event</h1>
        </div>
      </div>

      <div className="px-4 space-y-4">
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Category</p>
          <div className="grid grid-cols-3 gap-2">
            {CAT_OPTIONS.map(opt => {
              const active = category === opt.value
              return (
                <motion.button key={opt.value} whileTap={{ scale: 0.95 }} onClick={() => setCategory(opt.value)}
                  className="rounded-2xl p-3 flex flex-col items-center gap-1 border-2 transition-all"
                  style={active ? { background: '#f0fdfa', borderColor: '#0F766E' } : { background: 'white', borderColor: '#E5E7EB' }}>
                  <opt.icon className="w-4 h-4" style={{ color: active ? '#0F766E' : '#9CA3AF' }} />
                  <span className="text-[11px] font-bold" style={{ color: active ? '#0F766E' : '#6B7280' }}>{opt.label}</span>
                  <span className="text-[9px] text-gray-400 text-center leading-tight">{opt.desc}</span>
                </motion.button>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder={prompts.title}
              className="w-full text-sm text-gray-900 placeholder-gray-300 outline-none border-b border-gray-100 pb-2 bg-transparent" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              className="w-full text-sm text-gray-700 outline-none border-b border-gray-100 pb-2 bg-transparent" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">{prompts.description}</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
              placeholder={prompts.descPlaceholder}
              className="w-full text-sm text-gray-900 placeholder-gray-300 outline-none resize-none bg-transparent" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-3">Significance</label>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(n => (
              <motion.button key={n} whileTap={{ scale: 0.97 }} onClick={() => setSignificance(n as Significance)}
                className="w-full flex items-center gap-3 rounded-xl p-2.5 text-left transition-all"
                style={significance === n ? { background: '#f0fdfa' } : { background: 'transparent' }}>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => <div key={i} className="w-2 h-2 rounded-full" style={{ background: i <= n ? '#0F766E' : '#E5E7EB' }} />)}
                </div>
                <span className="text-xs text-gray-600 font-medium">{SIG_LABELS[n]}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Skills (comma-separated)</label>
          <input value={skills} onChange={e => setSkills(e.target.value)}
            placeholder="e.g. Leadership, Data Analysis, Public Speaking"
            className="w-full text-sm text-gray-900 placeholder-gray-300 outline-none bg-transparent" />
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-700">Add to Portfolio</p>
            <p className="text-xs text-gray-400 mt-0.5">{prompts.impact}</p>
          </div>
          <button onClick={() => setVisibility(v => v === 'portfolio' ? 'private' : 'portfolio')}
            className="w-12 h-7 rounded-full transition-all flex-shrink-0 ml-3 relative"
            style={{ background: visibility === 'portfolio' ? '#0F766E' : '#E5E7EB' }}>
            <div className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all" style={{ left: visibility === 'portfolio' ? '50%' : '2px' }} />
          </button>
        </div>

        <motion.button whileTap={{ scale: 0.97 }} onClick={handleSave}
          className="w-full text-white rounded-2xl py-4 font-bold text-sm shadow-lg"
          style={{ background: 'linear-gradient(135deg, #0F766E, #0891B2)', boxShadow: '0 8px 24px rgba(15,118,110,0.35)' }}>
          Add to My Ledger ✦
        </motion.button>
      </div>
    </div>
  )
}
