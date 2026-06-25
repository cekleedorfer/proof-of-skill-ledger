'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, Sparkles, Lock, BookOpen } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Event } from '@/types'
import { useStore } from '@/lib/store'
import { getEventColor } from '@/lib/colors'
import { toast } from 'sonner'

interface EventTabsProps {
  event: Event
  eventColor: string
  eventLightColor: string
  allIds: string[]
}

function SignificanceDots({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: i <= value ? color : '#E5E7EB' }} />
      ))}
    </div>
  )
}

function lightenHex(hex: string): string {
  const n = parseInt(hex.replace('#',''), 16)
  const r = Math.min(255, (n >> 16) + 55)
  const g = Math.min(255, ((n >> 8) & 0xff) + 55)
  const b = Math.min(255, (n & 0xff) + 55)
  return `rgb(${r},${g},${b})`
}

// Orbital layout: place sub-event bubbles around the central event
function OrbitalLayout({ event, allIds, onSubClick }: { event: Event; allIds: string[]; onSubClick: (subId: string) => void }) {
  const subs = event.subEvents
  const centerColor = getEventColor(allIds.indexOf(event.id)).bg

  // Positions for up to 6 sub-bubbles arranged around center
  const positions = [
    { x: -125, y: -65 },
    { x: 115, y: -75 },
    { x: -135, y: 55 },
    { x: 120, y: 60 },
    { x: -20, y: -125 },
    { x: 15, y: 115 },
  ]

  const subColors = ['#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#06B6D4']

  return (
    <div className="relative flex items-center justify-center" style={{ height: 280 }}>
      {/* Subtle orbit ring */}
      <div className="absolute rounded-full border border-dashed border-gray-200" style={{ width: 220, height: 220 }} />

      {/* Sub-event bubbles */}
      {subs.map((sub, i) => {
        const pos = positions[i % positions.length]
        const subColor = subColors[i % subColors.length]
        const sizeMap: Record<number, number> = { 1: 54, 2: 70, 3: 88, 4: 100, 5: 118 }
        const size = sizeMap[sub.significance] ?? 70
        return (
          <motion.button
            key={sub.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.08, type: 'spring', stiffness: 300, damping: 22 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onSubClick(sub.id)}
            className="absolute rounded-full flex items-center justify-center text-white font-semibold text-center leading-tight cursor-pointer overflow-hidden"
            style={{
              width: size,
              height: size,
              background: `radial-gradient(circle at 35% 30%, ${subColor}dd, ${subColor} 70%)`,
              boxShadow: `0 8px 28px ${subColor}70, 0 2px 8px ${subColor}40, inset 0 1px 0 rgba(255,255,255,0.25)`,
              top: '50%',
              left: '50%',
              marginTop: -size / 2 + pos.y,
              marginLeft: -size / 2 + pos.x,
              fontSize: size > 90 ? 10 : 9,
              padding: 8,
            }}
          >
            <div className="absolute rounded-full pointer-events-none" style={{ width: size * 0.45, height: size * 0.28, background: 'radial-gradient(ellipse, rgba(255,255,255,0.35) 0%, transparent 100%)', top: '13%', left: '18%' }} />
            <span className="relative leading-tight z-10">{sub.title.length > 14 ? sub.title.slice(0, 12) + '…' : sub.title}</span>
          </motion.button>
        )
      })}

      {/* Central bubble */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        className="relative z-10 rounded-full flex items-center justify-center text-white font-bold text-center leading-tight overflow-hidden"
        style={{
          width: 120,
          height: 120,
          background: `radial-gradient(circle at 35% 30%, ${lightenHex(centerColor)}, ${centerColor} 65%)`,
          boxShadow: `0 12px 40px ${centerColor}80, 0 4px 12px ${centerColor}50, inset 0 1px 0 rgba(255,255,255,0.3)`,
          fontSize: 11,
          padding: 14,
        }}
      >
        <div className="absolute rounded-full pointer-events-none" style={{ width: 54, height: 34, background: 'radial-gradient(ellipse, rgba(255,255,255,0.3) 0%, transparent 100%)', top: '13%', left: '18%' }} />
        <span className="relative leading-tight z-10">{event.title.length > 20 ? event.title.slice(0, 18) + '…' : event.title}</span>
      </motion.div>
    </div>
  )
}

export function EventTabs({ event, eventColor, eventLightColor, allIds }: EventTabsProps) {
  const router = useRouter()
  const { toggleVisibility } = useStore()

  return (
    <Tabs defaultValue="subevents" className="w-full">
      <TabsList className="w-full bg-white border border-gray-100 rounded-2xl p-1 mb-4 shadow-sm h-auto">
        {['overview', 'subevents', 'notes', 'ai'].map((v, i) => (
          <TabsTrigger
            key={v}
            value={v}
            className="flex-1 rounded-xl text-[11px] font-semibold py-2 data-[state=active]:text-white data-[state=inactive]:text-gray-400"
            style={{ '--active-bg': eventColor } as React.CSSProperties}
          >
            <span className="data-[state=active]:hidden">{['Overview', 'Sub-events', 'Notes', 'AI Story'][i]}</span>
            <span className="hidden data-[state=active]:inline">{['Overview', 'Sub-events', 'Notes', 'AI Story'][i]}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Override active tab styles via inline */}
      <style>{`
        [data-state="active"][role="tab"] {
          background: ${eventColor} !important;
          color: white !important;
        }
      `}</style>

      {/* Overview */}
      <TabsContent value="overview" className="space-y-3 mt-0">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">About this event</p>
          <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Impact Level</span>
            <SignificanceDots value={event.significance} color={eventColor} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Category</span>
            <span className="text-xs font-semibold rounded-full px-3 py-1 capitalize" style={{ background: eventLightColor, color: eventColor }}>
              {event.category}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1">
                {event.visibility === 'portfolio' ? <BookOpen className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                Portfolio
              </span>
              <p className="text-[10px] text-gray-300 mt-0.5">Visible in your shared portfolio</p>
            </div>
            <Switch
              checked={event.visibility === 'portfolio'}
              onCheckedChange={() => {
                toggleVisibility(event.id)
                toast.success(event.visibility === 'portfolio' ? 'Removed from portfolio' : 'Added to portfolio')
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 block">Skills</span>
          <div className="flex flex-wrap gap-2">
            {event.skills.map(skill => (
              <span key={skill} className="text-xs font-semibold rounded-full px-3 py-1" style={{ background: eventLightColor, color: eventColor }}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push(`/event/${event.id}/add-sub`)}
          className="w-full text-white rounded-2xl py-3.5 font-semibold text-sm flex items-center justify-center gap-2 shadow-md"
          style={{ background: eventColor, boxShadow: `0 4px 14px ${eventColor}55` }}
        >
          <Plus className="w-4 h-4" />
          Add Sub-event
        </motion.button>
      </TabsContent>

      {/* Sub-events — orbital layout */}
      <TabsContent value="subevents" className="mt-0">
        {event.subEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🌱</div>
            <p className="text-sm text-gray-400">No sub-events yet.</p>
          </div>
        ) : (
          <OrbitalLayout
            event={event}
            allIds={allIds}
            onSubClick={(subId) => router.push(`/event/${event.id}/sub/${subId}`)}
          />
        )}

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push(`/event/${event.id}/add-sub`)}
          className="w-full text-white rounded-2xl py-3.5 font-semibold text-sm flex items-center justify-center gap-2 shadow-md mt-4"
          style={{ background: eventColor, boxShadow: `0 4px 14px ${eventColor}55` }}
        >
          <Plus className="w-4 h-4" />
          Add Sub-event
        </motion.button>
      </TabsContent>

      {/* Notes */}
      <TabsContent value="notes" className="mt-0">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 min-h-[200px]">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Reflection Notes</p>
          <p className="text-sm text-gray-300 italic">Your private notes and reflections will live here.</p>
        </div>
      </TabsContent>

      {/* AI Story */}
      <TabsContent value="ai" className="mt-0">
        <div className="relative bg-white rounded-2xl p-5 shadow-sm border border-gray-100 overflow-hidden">
          <div className="absolute inset-0 opacity-40" style={{ background: `linear-gradient(135deg, ${eventLightColor} 0%, white 100%)` }} />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: eventColor }}>
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: eventColor }}>AI Story</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{event.aiSummary}</p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-[10px] text-gray-400 font-medium">Generated by Proof-of-Skill AI · Based on your entry</p>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
