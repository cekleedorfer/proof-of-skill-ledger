'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Clock, BarChart2, Plus, User, Sparkles } from 'lucide-react'

const tabs = [
  { href: '/', icon: Clock, label: 'Timeline' },
  { href: '/insights', icon: BarChart2, label: 'Insights' },
  { href: '/add', icon: Plus, label: '', primary: true },
  { href: '/profile', icon: User, label: 'Profile' },
  { href: '/ai', icon: Sparkles, label: 'Copilot' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-4 pb-6 z-50 pointer-events-none">
      <nav className="bg-white/90 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-xl px-2 py-2 flex items-center justify-around pointer-events-auto">
        {tabs.map((tab) => {
          const isActive = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href)
          if (tab.primary) {
            return (
              <Link key={tab.href} href={tab.href}>
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-300/50"
                  style={{ background: 'linear-gradient(135deg, #0F766E, #0891B2)' }}
                >
                  <tab.icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                </motion.div>
              </Link>
            )
          }
          return (
            <Link key={tab.href} href={tab.href} className="flex flex-col items-center gap-0.5 px-3 py-1 min-w-[52px]">
              <motion.div whileTap={{ scale: 0.9 }} className="flex flex-col items-center gap-0.5">
                <tab.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-teal-700' : 'text-gray-400'}`} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[10px] font-semibold transition-colors ${isActive ? 'text-teal-700' : 'text-gray-400'}`}>{tab.label}</span>
              </motion.div>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
