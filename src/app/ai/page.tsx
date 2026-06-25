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
  { icon: '💪', label: 'Identify my top skills', text: 'Identify my top skills' },
  { icon: '🔗', label: 'Connect my dots', text: 'Connect my personal and professional growth' },
  { icon: '🪞', label: 'Help me reflect', text: 'Help me reflect on my journey' },
]

const RESPONSES: Record<string, string> = {
  default: "That's a great question. Based on your documented events, you've shown consistent growth across both professional and personal domains. Your story highlights resilience, communication, and the ability to turn challenges into learning moments.",
  'Summarize my growth': "Over the course of your documented journey, you've captured 8 meaningful milestones — from getting into Boston College to building your first Python project to running a marathon. What stands out is the through-line: you consistently do hard things and find the lesson in them. That's a rare and powerful trait.",
  'Identify my top skills': "Your story reveals three standout skills:\n\n1. Resilience — You show up after setbacks, whether it's hitting the wall at mile 16 or debugging for 6 hours straight.\n\n2. Communication — From your college essay to your VP presentation, you consistently make complex things clear.\n\n3. Self-Direction — Almost everything in your ledger was self-initiated. You don't wait for permission to grow.",
  'Connect my personal and professional growth': "Your personal and professional growth aren't separate stories — they're the same one. The discipline that trained you for 26.2 miles is the same discipline that made you stay up fixing a broken scraper. The courage you built reconciling with your sister is the same courage that made you flag a $40K error as the most junior person in the room.\n\nYour strongest professional asset isn't a skill. It's the person you've become through all of it.",
  'Help me reflect on my journey': "Here are three questions worth sitting with:\n\n1. Which event surprised you most — and why? Often what surprises us reveals something we didn't know we were capable of.\n\n2. What's the hardest thing you've done that doesn't appear in your portfolio yet?\n\n3. If you could write a letter to yourself from a year ago, what would you most want them to know?",
}

export default function AIPage() {
  const { events } = useStore()
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'ai', text: `Hi! 👋 What would you like to explore?` }
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
