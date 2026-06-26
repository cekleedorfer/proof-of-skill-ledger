'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Plus, X, Briefcase, Heart, Sparkles } from 'lucide-react'
import { useStore } from '@/lib/store'
import { Category, Significance, Visibility } from '@/types'
import { toast } from 'sonner'

const professionalSkills = ['Leadership', 'Communication', 'Problem Solving', 'Technical Skill', 'Data Analysis', 'Project Management', 'Strategic Thinking', 'Collaboration', 'Initiative', 'Presentation']
const personalSkills = ['Resilience', 'Emotional Intelligence', 'Discipline', 'Creativity', 'Curiosity', 'Self-Awareness', 'Adaptability', 'Vulnerability', 'Patience', 'Independence']

const PROMPTS: Record<Category, { title: string; description: string; descPlaceholder: string; impact: string }> = {
  professional: {
    title: 'e.g. Internship at a startup, Won a hackathon, Led a project team',
    description: 'What was the goal or challenge? What did you do? What was the outcome?',
    descPlaceholder: 'Describe what happened and why it was significant. What did you build, lead, or solve? Who did it impact?',
    impact: 'What skill or quality did this moment prove you have?',
  },
  personal: {
    title: 'e.g. Ran my first marathon, Reconciled with a friend, Learned to paint',
    description: 'What happened? Why did it matter to you personally?',
    descPlaceholder: 'Tell the story honestly. What changed inside you? What did you learn about yourself that you couldn\'t have known before this happened?',
    impact: 'How did this moment change you as a person?',
  },
  both: {
    title: 'e.g. Gave a TEDx talk, Led a community campaign, Traveled solo',
    description: 'What happened, and how did it affect both your professional path and personal growth?',
    descPlaceholder: 'Describe the experience — what you did, what it cost you, and what it gave you. The best milestones cross the line between professional achievement and personal meaning.',
    impact: 'What did this teach you that carries into every part of your life?',
  },
}

const CATEGORY_META = {
  professional: { icon: Briefcase, label: 'Professional', color: '#3B82F6', desc: 'Internships, projects, academic wins, leadership' },
  personal: { icon: Heart, label: 'Personal', color: '#EC4899', desc: 'Growth, health, relationships, creativity' },
  both: { icon: Sparkles, label: 'Both', color: '#7C3AED', desc: 'Milestones that cross professional and personal' },
}

export default function AddEventPage() {
  const router = useRouter()
  const { addEvent } = useStore()

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<Category>('professional')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [significance, setSignificance] = useState<Significance>(3)
  const [visibility, setVisibility] = useState<Visibility>('private')
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState('')

  const prompts = PROMPTS[category]
  const suggestedSkills = category === 'personal' ? personalSkills : professionalSkills

  const SIG_LABELS: Record<number, { label: string; color: string }> = {
    1: { label: 'Minor win', color: '#9CA3AF' },
    2: { label: 'Solid moment', color: '#10B981' },
    3: { label: 'Meaningful', color: '#3B82F6' },
    4: { label: 'Major milestone', color: '#7C3AED' },
    5: { label: 'Life-defining', color: '#EC4899' },
  }

  function addSkill(skill: string) {
    const trimmed = skill.trim()
    if (trimmed && !skills.includes(trimmed)) setSkills(prev => [...prev, trimmed])
    setSkillInput('')
  }

  function handleSave() {
    if (!title.trim() || !date) {
      toast.error('Please fill in a title and date.')
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
      aiSummary: `This milestone — ${title.trim()} — reflects a meaningful moment in your journey. Add more details and sub-events to unlock your AI-generated story.`,
    })
    toast.success('Milestone saved! ✦')
    router.push('/')
  }

  return (
    <div className="min-h-dvh pb-32 bg-[#f5f5f7]">
      {/* Header */}
      <div className="relative overflow-hidden px-4 pt-5 pb-6" style={{ background: 'linear-gradient(150deg, #7C3AED 0%, #3B82F6 100%)' }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 70% 10%, white, transparent 55%)' }} />
        <div className="relative">
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-white/70 font-semibold text-sm mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1">New Milestone</p>
          <h1 className="text-2xl font-black text-white">Add an Event</h1>
          <p className="text-sm text-white/60 mt-0.5">Every win deserves a record.</p>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-4">
        {/* Category first */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-3">What kind of milestone?</label>
          <div className="space-y-2">
            {(Object.entries(CATEGORY_META) as [Category, typeof CATEGORY_META[Category]][]).map(([c, meta]) => {
              const Icon = meta.icon
              const active = category === c
              return (
                <motion.button
                  key={c}
                  onClick={() => setCategory(c)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all"
                  style={{
                    background: active ? `${meta.color}12` : '#F9FAFB',
                    border: `1.5px solid ${active ? meta.color + '55' : 'transparent'}`,
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: active ? meta.color : '#E5E7EB' }}>
                    <Icon className="w-4 h-4" style={{ color: active ? 'white' : '#9CA3AF' }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: active ? meta.color : '#374151' }}>{meta.label}</p>
                    <p className="text-[10px] text-gray-400">{meta.desc}</p>
                  </div>
                  {active && (
                    <motion.div layoutId="cat-check" className="ml-auto w-5 h-5 rounded-full flex items-center justify-center" style={{ background: meta.color }}>
                      <span className="text-white text-[10px]">✓</span>
                    </motion.div>
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Title */}
        <AnimatePresence mode="wait">
          <motion.div key={category} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Event Title</label>
            <p className="text-[10px] text-gray-300 mb-3 leading-relaxed">{prompts.title}</p>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Name this milestone..."
              className="w-full text-sm text-gray-900 placeholder-gray-300 outline-none font-semibold"
            />
          </motion.div>
        </AnimatePresence>

        {/* Date */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">When did this happen?</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full text-sm text-gray-900 outline-none" />
        </div>

        {/* Description — contextual prompt */}
        <AnimatePresence mode="wait">
          <motion.div key={`desc-${category}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
              {prompts.description}
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder={prompts.descPlaceholder}
              rows={5}
              className="w-full text-sm text-gray-900 placeholder-gray-300 outline-none resize-none leading-relaxed mt-2"
            />
            <div className="text-right mt-1">
              <span className="text-[10px] text-gray-300">{description.length}/600</span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Impact prompt */}
        <AnimatePresence mode="wait">
          <motion.div key={`impact-${category}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="rounded-2xl p-4 border border-dashed border-violet-200" style={{ background: '#7C3AED08' }}>
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-violet-500 mb-1">AI Story Prompt</p>
                <p className="text-xs text-violet-400 leading-relaxed">{prompts.impact}</p>
                <p className="text-[10px] text-violet-300 mt-2">Your AI story will be generated from what you write above. The more honest and specific you are, the better.</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Significance */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">How significant was this?</label>
          <p className="text-[10px] text-gray-300 mb-3">Think about the lasting impact — on your path, your thinking, or your identity.</p>
          <div className="flex gap-2 mb-2">
            {([1, 2, 3, 4, 5] as Significance[]).map(n => (
              <motion.button
                key={n}
                onClick={() => setSignificance(n)}
                whileTap={{ scale: 0.9 }}
                className="flex-1 h-11 rounded-xl text-sm font-bold transition-all relative overflow-hidden"
                style={{
                  background: significance >= n ? `${SIG_LABELS[significance].color}22` : '#F3F4F6',
                  color: significance >= n ? SIG_LABELS[significance].color : '#9CA3AF',
                  border: significance === n ? `2px solid ${SIG_LABELS[significance].color}` : '2px solid transparent',
                }}
              >
                {n}
              </motion.button>
            ))}
          </div>
          <p className="text-center text-xs font-semibold" style={{ color: SIG_LABELS[significance].color }}>
            {SIG_LABELS[significance].label}
          </p>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Skills this moment proved</label>
          <p className="text-[10px] text-gray-300 mb-3">These become searchable tags in your portfolio and insights.</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {skills.map(skill => (
              <span key={skill} className="flex items-center gap-1 text-xs bg-violet-100 text-violet-700 rounded-full px-3 py-1 font-medium">
                {skill}
                <button onClick={() => setSkills(s => s.filter(x => x !== skill))}><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addSkill(skillInput)}
              placeholder="Type a skill and press Enter..."
              className="flex-1 text-sm text-gray-900 placeholder-gray-300 outline-none bg-gray-50 rounded-xl px-3 py-2"
            />
            <button onClick={() => addSkill(skillInput)} className="w-9 h-9 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {suggestedSkills.filter(s => !skills.includes(s)).map(s => (
              <button key={s} onClick={() => addSkill(s)}
                className="text-[11px] bg-gray-100 text-gray-500 rounded-full px-2.5 py-1 hover:bg-violet-50 hover:text-violet-600 transition-colors">
                + {s}
              </button>
            ))}
          </div>
        </div>

        {/* Visibility */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-3">Who can see this?</label>
          <div className="flex gap-2">
            {([['private', '🔒 Private', 'Only you'], ['portfolio', '✦ Portfolio', 'Shared publicly']] as const).map(([v, label, sub]) => (
              <button
                key={v}
                onClick={() => setVisibility(v)}
                className="flex-1 py-3 rounded-xl text-xs font-bold transition-all text-center"
                style={{
                  background: visibility === v ? 'linear-gradient(135deg, #7C3AED, #3B82F6)' : '#F3F4F6',
                  color: visibility === v ? 'white' : '#6B7280',
                }}
              >
                <div>{label}</div>
                <div className="text-[10px] opacity-70 font-normal mt-0.5">{sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Save */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          className="w-full text-white rounded-2xl py-4 font-black text-base shadow-lg"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #3B82F6)', boxShadow: '0 8px 24px #7C3AED44' }}
        >
          Save Milestone ✦
        </motion.button>
      </div>
    </div>
  )
}
