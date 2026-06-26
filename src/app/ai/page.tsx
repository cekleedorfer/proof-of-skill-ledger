'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles } from 'lucide-react'
import { useStore } from '@/lib/store'

interface Message {
  id: string
  role: 'user' | 'ai'
  text: string
}

const PROMPTS = [
  { icon: '🌟', label: 'Summarize my growth', text: 'Summarize my growth' },
  { icon: '💪', label: 'My top skills', text: 'Identify my top skills' },
  { icon: '🔗', label: 'Connect my dots', text: 'Connect my personal and professional growth' },
  { icon: '🪞', label: 'Help me reflect', text: 'Help me reflect on my journey' },
  { icon: '📄', label: 'Write my bio', text: 'Write a professional bio from my story' },
  { icon: '🎯', label: 'What am I best at?', text: 'What am I best at?' },
]

const RESPONSES: Record<string, string> = {
  default: "Good question. Based on your documented story, you've consistently shown up in two ways: you go after hard things before you feel ready, and you extract meaning from everything that happens. That's a rare combination — and it makes your story genuinely compelling to read.",

  'Summarize my growth': "You've documented 14 milestones — and looking across all of them, one theme is unmistakable: you don't wait to be ready.\n\nYou registered for a marathon before you could run 5 miles. You wrote a college essay about something that actually hurt. You flagged a $40K error as the most junior intern in the building.\n\nThe through-line isn't talent. It's a pattern of choosing the harder option and staying with it. That's not a skill you learned — it's who you've become.",

  'Identify my top skills': "Based on your documented events, your three standout skills are:\n\n🧠 Strategic Communication — From your TEDx rehearsals to your VP presentation to the letter you wrote your sister. You know how to choose the right message and deliver it clearly.\n\n⚡ Initiative — Almost every major milestone in your ledger was self-started. The Python project, the study group, the mental health campaign, the hackathon. You don't wait for permission.\n\n💎 Resilience Under Pressure — Mile 16 of a 20-mile run. A 6-hour debugging session before finals. A projector failure mid-pitch. Every time, you found a way.",

  'Connect my personal and professional growth': "Your personal and professional lives aren't separate stories — they're the same story told in different rooms.\n\nThe discipline that got you through 120 days of marathon training is the same discipline that made you a standout intern. The emotional courage you built writing that letter to your sister is the same courage that made you speak up about a $40K error as the most junior person in the room.\n\nMost people keep these stories in separate boxes. Your portfolio works because you don't.\n\nYour strongest professional asset isn't any single skill on your resume. It's the person you've built yourself into — and that person shows up everywhere.",

  'Help me reflect on my journey': "Three questions worth sitting with tonight:\n\n1. Which event surprised you most — not because of what happened, but because of how you handled it? That surprise usually points to a strength you haven't fully claimed yet.\n\n2. What's the hardest thing you've done that doesn't appear anywhere in your portfolio? The things we don't document are often the things that shaped us most.\n\n3. If the version of you from two years ago could read your Proof-of-Skill Ledger right now, what do you think they'd feel?\n\nTake your time with these. The answers are in the ledger — you just have to look.",

  'Write a professional bio from my story': "Here's a professional bio draft based on your documented journey:\n\n---\n\nClaire is a Boston College student studying Economics and Sociology with a track record of turning ambitious ideas into measurable outcomes. She has led a 12-event campus mental health campaign that reached 400 students, built data dashboards used in executive decision-making during her internship at Brightpath Analytics, and won a university startup hackathon with a product she helped build in 54 hours.\n\nBeyond her professional work, Claire ran her first marathon as a charity fundraiser, gave a TEDx talk at 18, and traveled solo through Portugal. She believes the same qualities that help you finish a marathon at mile 22 are the ones that make you effective in a boardroom.\n\n---\n\nWant me to adjust the tone, length, or emphasis?",

  'What am I best at?': "Looking across your full story — not just your resume — here's what you're genuinely best at:\n\nStarting things that matter. The study group, the mental health campaign, the Python scraper, the op-ed. You saw a gap and filled it. That's the rarest professional skill there is.\n\nHolding your ground in high-stakes rooms. VP presentation. Dean meeting. Hackathon pitch after a projector failure. You've been tested and you've held.\n\nMaking people feel seen. The letter to your sister. The 14 volunteers who all showed up. The roommates who asked for your scraper. You bring people in.\n\nIf you had to put it on a résumé: Initiative, Communication, Resilience. But the real answer is: you're best at deciding something matters and seeing it through.",
}

export default function AIPage() {
  const { events } = useStore()
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'ai', text: `Hi Claire! ✦ I've read your full Proof-of-Skill Ledger — ${14} events, ${14} milestones, and a lot of micro-wins in between.\n\nWhat would you like to explore?` }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  function sendMessage(text: string) {
    if (!text.trim()) return
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const responseText = RESPONSES[text] ?? RESPONSES['default']
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'ai', text: responseText }])
      setIsTyping(false)
    }, 1400)
  }

  return (
    <div className="flex flex-col min-h-dvh bg-[#f5f5f7]">
      {/* Header */}
      <div className="px-4 pt-6 pb-3">
        <p className="text-xs font-semibold text-violet-500 uppercase tracking-widest mb-1">AI Copilot</p>
        <h1 className="text-2xl font-bold text-gray-900">Reflect &amp; Articulate</h1>
        <p className="text-xs text-gray-400 mt-0.5">Powered by {events.length} documented events</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}
            >
              {msg.role === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center flex-shrink-0 mt-auto mb-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-violet-600 to-blue-500 text-white rounded-br-sm'
                    : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-bl-sm'
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div key="typing" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-gray-100 flex gap-1 items-center">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 bg-violet-400 rounded-full"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Prompt chips */}
      <div className="px-4 pb-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {PROMPTS.map(p => (
            <button
              key={p.label}
              onClick={() => sendMessage(p.text)}
              className="flex-shrink-0 flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:border-violet-300 hover:text-violet-600 transition-colors"
            >
              <span>{p.icon}</span>
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input bar */}
      <div className="px-4 pb-32">
        <div className="flex items-center gap-2 bg-white rounded-2xl shadow-sm border border-gray-200 px-4 py-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
            placeholder="Ask anything about your journey..."
            className="flex-1 text-sm text-gray-900 placeholder-gray-300 outline-none bg-transparent"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => sendMessage(input)}
            disabled={!input.trim()}
            className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center disabled:opacity-30 transition-opacity"
          >
            <Send className="w-3.5 h-3.5 text-white" />
          </motion.button>
        </div>
      </div>
    </div>
  )
}
