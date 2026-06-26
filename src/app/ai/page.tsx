'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useStore } from '@/lib/store'

const CHIPS = [
  { id: 'bio', label: 'Write my bio', icon: '✍️' },
  { id: 'best', label: 'What am I best at?', icon: '🏆' },
  { id: 'growth', label: 'Summarize my growth', icon: '📈' },
  { id: 'resume', label: 'Resume language', icon: '💼' },
  { id: 'connect', label: 'Connect personal + professional', icon: '🔗' },
  { id: 'reflect', label: 'Help me reflect', icon: '🪞' },
]

const RESPONSES: Record<string, string> = {
  bio: `Claire Kleedorfer is a Finance and Data Science student at Boston College whose story spans boardrooms and starting lines alike. She found a $40,000 error as a 19-year-old intern at Brightpath Capital, won a collegiate hackathon building financial tools for first-gen students, and delivered a TEDx talk on the hidden emotional labor of being the first in your family to go to college — earning a standing ovation.\n\nShe ran the Boston Marathon in 4:07:33. She reconciled with her sister. She learned guitar from YouTube on a $45 secondhand acoustic. She has a 3.91 GPA and 100 days of consecutive journaling.\n\nClaire is not the kind of person who waits for permission. She builds the thing that should exist, says the thing that needs to be said, and finds the error everyone else missed. She is, in every sense, a proof of skill.`,
  best: `Looking across your entire ledger, three things stand out above everything else:\n\n**1. You execute under pressure.** The $40K error, the hackathon win, the VP presentation — each one happened in high-stakes conditions that would stop most people cold.\n\n**2. You build things that don't exist yet.** Speak Easy BC, the financial literacy app, the Python tool, the study group. You see a gap and fill it.\n\n**3. You lead with honesty.** Your TEDx talk, your op-ed, your sister conversation — each required you to say the true thing instead of the easy thing. That's rare and it's recognizable.`,
  growth: `Your ledger tells a clear arc: a student who arrived somewhere new, proved herself academically, and then refused to stop there.\n\nIn your first year: Dean's List, Finance Club, first intern experience. In your second: a hackathon win, a Python project, a mental health campaign, a TEDx stage. Running a marathon while maintaining a 3.91 GPA and healing a family relationship in December.\n\nThe through-line isn't any single skill. It's the consistent choice to raise the stakes for yourself — academically, professionally, and personally — and to document it honestly.`,
  resume: `Here are high-impact phrases drawn directly from your ledger:\n\n• "Identified a $40,200 fee calculation error in a legacy portfolio model, resulting in client credit and cross-team review"\n• "Co-founded campus mental health initiative reaching 600+ students; secured institutional partnership with BC Counseling Services"\n• "Won 1st place ($2,500) at New England Collegiate Hackathon; delivered unanimous judges' decision for human-centered financial literacy product"\n• "Delivered TEDx talk to 400+ attendees; standing ovation; selected as most-read student op-ed of the month"\n• "Completed Boston Marathon (4:07:33) while maintaining 3.91 GPA and conducting summer internship"\n\nThese aren't resume lines. They're proof points.`,
  connect: `The most interesting thing about your ledger is that the personal and professional don't actually live in separate boxes.\n\nYour TEDx talk was personal — but it built professional credibility. The marathon was personal — but it demonstrates the same discipline that produced the hackathon win. The sister conversation happened in December — and she showed up to your TEDx talk in February.\n\nThe financial literacy hackathon app? You said yourself the idea came from watching your family navigate college without guidance. Your most technically impressive professional work is rooted in lived personal experience.\n\nYou don't have two separate stories. You have one story about a person who brings their whole self to everything.`,
  reflect: `A few questions worth sitting with:\n\nYou've documented 14 events and 36 micro-wins. Which one are you most proud of that nobody else has noticed?\n\nThe marathon entry mentions you thought about your TEDx talk at mile 17. What does it mean that even during a physical challenge, your mind went to your work?\n\nYour most significant personal event — reconciling with your sister — is marked private. Is there a version of that story you'd want the world to hear someday?\n\nAnd finally: what's the thing you're most afraid to add to this ledger? That might be the next chapter.`,
}

export default function AIPage() {
  const { events } = useStore()
  const [selected, setSelected] = useState<string | null>(null)

  const totalSubs = events.reduce((acc, e) => acc + e.subEvents.length, 0)

  return (
    <div className="min-h-dvh pb-32 px-4 pt-5" style={{ background: 'linear-gradient(160deg, #f0fdfa 0%, #fff7ed 100%)' }}>
      <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-1">AI Copilot</p>
      <h1 className="text-2xl font-black text-gray-900 mb-1">Your Story, Analyzed</h1>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-5 flex gap-3 items-start">
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #0F766E, #0891B2)' }}>
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          Hi Claire! ✦ I've read your full Proof-of-Skill Ledger — {events.length} events, {totalSubs} micro-wins, spanning everything from Boston College to the Boston Marathon. Ask me anything.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {CHIPS.map(chip => (
          <motion.button key={chip.id} whileTap={{ scale: 0.95 }}
            onClick={() => setSelected(selected === chip.id ? null : chip.id)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold border transition-all"
            style={selected === chip.id
              ? { background: 'linear-gradient(135deg, #0F766E, #0891B2)', color: 'white', border: 'none', boxShadow: '0 4px 12px rgba(15,118,110,0.3)' }
              : { background: 'white', color: '#374151', borderColor: '#E5E7EB' }}>
            <span>{chip.icon}</span> {chip.label}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selected && (
          <motion.div key={selected}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0F766E, #0891B2)' }}>
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wide">Copilot</span>
            </div>
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {RESPONSES[selected]}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!selected && (
        <div className="text-center py-8 text-gray-300 text-sm">
          Tap a prompt above to get started ↑
        </div>
      )}
    </div>
  )
}
