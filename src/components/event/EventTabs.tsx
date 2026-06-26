'use client'

import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Sparkles, Lock, BookOpen, Camera, X, ImageIcon } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Event } from '@/types'
import { useStore } from '@/lib/store'
import { useProfile } from '@/lib/profile'
import { getTheme, getBubbleColor, textColorForBg } from '@/lib/themes'
import { useState } from 'react'
import { toast } from 'sonner'

interface EventTabsProps { event: Event; eventColor: string; eventLightColor: string; allIds: string[] }

function lightenHex(hex: string): string {
  const n = parseInt(hex.replace('#',''), 16)
  const r = Math.min(255, (n >> 16) + 55)
  const g = Math.min(255, ((n >> 8) & 0xff) + 55)
  const b = Math.min(255, (n & 0xff) + 55)
  return `rgb(${r},${g},${b})`
}

function bubbleFontSize(title: string, size: number): number {
  const chars = title.length
  const base = size * 0.115
  if (chars <= 6) return Math.min(13, base * 1.1)
  if (chars <= 10) return Math.min(12, base)
  if (chars <= 16) return Math.min(11, base * 0.92)
  if (chars <= 22) return Math.min(10, base * 0.84)
  if (chars <= 30) return Math.min(9.5, base * 0.78)
  return Math.min(8.5, base * 0.72)
}

function OrbitalLayout({ event, allIds, onSubClick, theme }: { event: Event; allIds: string[]; onSubClick: (subId: string) => void; theme: ReturnType<typeof getTheme> }) {
  const subs = event.subEvents
  const eventIdx = allIds.indexOf(event.id)
  const centerColor = getBubbleColor(theme, eventIdx, event.significance)
  const positions = [
    { x: -140, y: -70 }, { x: 125, y: -80 }, { x: -148, y: 62 },
    { x: 132, y: 68 }, { x: -18, y: -138 }, { x: 14, y: 128 },
  ]

  return (
    <div className="relative flex items-center justify-center" style={{ height: 320 }}>
      <div className="absolute rounded-full border border-dashed opacity-20" style={{ width: 240, height: 240, borderColor: centerColor }} />
      <div className="absolute rounded-full border opacity-10" style={{ width: 170, height: 170, borderColor: centerColor }} />
      {subs.map((sub, i) => {
        const pos = positions[i % positions.length]
        const subColor = getBubbleColor(theme, eventIdx, sub.significance)
        const sizeMap: Record<number, number> = { 1: 60, 2: 76, 3: 94, 4: 108, 5: 124 }
        const size = sizeMap[sub.significance] ?? 76
        const fs = bubbleFontSize(sub.title, size)
        return (
          <motion.button key={sub.id}
            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.08, type: 'spring', stiffness: 300, damping: 22 }}
            whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.06 }}
            onClick={() => onSubClick(sub.id)}
            className="absolute rounded-full flex items-center justify-center font-semibold text-center leading-tight cursor-pointer overflow-hidden"
            style={{
              width: size, height: size,
              color: textColorForBg(subColor),
              background: `radial-gradient(circle at 35% 30%, ${lightenHex(subColor)}, ${subColor} 70%)`,
              boxShadow: `0 8px 28px ${subColor}70, 0 2px 8px ${subColor}40, inset 0 1px 0 rgba(255,255,255,0.25)`,
              top: '50%', left: '50%',
              marginTop: -size / 2 + pos.y, marginLeft: -size / 2 + pos.x,
              fontSize: fs, padding: 10,
            }}
          >
            <div className="absolute rounded-full pointer-events-none" style={{ width: size * 0.45, height: size * 0.28, background: 'radial-gradient(ellipse, rgba(255,255,255,0.38) 0%, transparent 100%)', top: '13%', left: '18%' }} />
            <span className="relative leading-tight z-10">{sub.title}</span>
          </motion.button>
        )
      })}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        className="relative z-10 rounded-full flex items-center justify-center font-bold text-center leading-tight overflow-hidden"
        style={{
          width: 130, height: 130,
          color: textColorForBg(centerColor),
          background: `radial-gradient(circle at 35% 30%, ${lightenHex(centerColor)}, ${centerColor} 65%)`,
          boxShadow: `0 12px 40px ${centerColor}80, 0 4px 12px ${centerColor}50, inset 0 1px 0 rgba(255,255,255,0.3)`,
          fontSize: bubbleFontSize(event.title, 130), padding: 16,
        }}
      >
        <div className="absolute rounded-full pointer-events-none" style={{ width: 58, height: 36, background: 'radial-gradient(ellipse, rgba(255,255,255,0.32) 0%, transparent 100%)', top: '13%', left: '18%' }} />
        <span className="relative leading-tight z-10">{event.title}</span>
      </motion.div>
    </div>
  )
}

export function EventTabs({ event, eventColor, eventLightColor, allIds }: EventTabsProps) {
  const router = useRouter()
  const { toggleVisibility, addEventPhoto, removeEventPhoto } = useStore()
  const { profile } = useProfile()
  const theme = getTheme(profile.themeId)
  const photoInputRef = useRef<HTMLInputElement>(null)
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = () => addEventPhoto(event.id, reader.result as string)
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  const photos = event.photos ?? []

  return (
    <Tabs defaultValue="subevents" className="w-full">
      {/* hidden multi-file input */}
      <input ref={photoInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} />

      <TabsList className="w-full bg-white border border-gray-100 rounded-2xl p-1 mb-4 shadow-sm h-auto">
        {['overview', 'subevents', 'photos', 'ai'].map((v, i) => (
          <TabsTrigger key={v} value={v} className="flex-1 rounded-xl text-[11px] font-semibold py-2 data-[state=active]:text-white data-[state=inactive]:text-gray-400 relative">
            {['Overview', 'Sub-events', 'Photos', 'AI Story'][i]}
            {v === 'photos' && photos.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white" style={{ background: eventColor }}>{photos.length}</span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
      <style>{`[data-state="active"][role="tab"] { background: ${eventColor} !important; color: white !important; }`}</style>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightboxIdx(null)}>
            <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
              <X className="w-5 h-5" />
            </button>
            <img src={photos[lightboxIdx]} alt="" className="max-w-full max-h-full object-contain rounded-2xl" onClick={e => e.stopPropagation()} />
            <button className="absolute bottom-6 right-6 bg-red-500/80 text-white text-xs font-semibold px-4 py-2 rounded-full"
              onClick={e => { e.stopPropagation(); removeEventPhoto(event.id, lightboxIdx); setLightboxIdx(null) }}>
              Delete photo
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <TabsContent value="overview" className="space-y-3 mt-0">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">About this event</p>
          <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Category</span>
            <span className="text-xs font-semibold rounded-full px-3 py-1 capitalize" style={{ background: eventLightColor, color: eventColor }}>{event.category}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Impact</span>
            <div className="flex gap-1">{[1,2,3,4,5].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: i <= event.significance ? eventColor : '#E5E7EB' }} />)}</div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1">
                {event.visibility === 'portfolio' ? <BookOpen className="w-3 h-3" /> : <Lock className="w-3 h-3" />} Portfolio
              </span>
              <p className="text-[10px] text-gray-300 mt-0.5">Visible in your shared portfolio</p>
            </div>
            <Switch checked={event.visibility === 'portfolio'} onCheckedChange={() => { toggleVisibility(event.id); toast.success(event.visibility === 'portfolio' ? 'Removed from portfolio' : 'Added to portfolio') }} />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 block">Skills</span>
          <div className="flex flex-wrap gap-2">
            {event.skills.map(skill => <span key={skill} className="text-xs font-semibold rounded-full px-3 py-1" style={{ background: eventLightColor, color: eventColor }}>{skill}</span>)}
          </div>
        </div>
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => router.push(`/event/${event.id}/add-sub`)}
          className="w-full text-white rounded-2xl py-3.5 font-semibold text-sm flex items-center justify-center gap-2 shadow-md"
          style={{ background: eventColor, boxShadow: `0 4px 14px ${eventColor}55` }}>
          <Plus className="w-4 h-4" /> Add Sub-event
        </motion.button>
      </TabsContent>

      <TabsContent value="subevents" className="mt-0">
        {event.subEvents.length === 0 ? (
          <div className="text-center py-12"><div className="text-4xl mb-3">🌱</div><p className="text-sm text-gray-400">No sub-events yet.</p></div>
        ) : (
          <OrbitalLayout event={event} allIds={allIds} theme={theme} onSubClick={(subId) => router.push(`/event/${event.id}/sub/${subId}`)} />
        )}
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => router.push(`/event/${event.id}/add-sub`)}
          className="w-full text-white rounded-2xl py-3.5 font-semibold text-sm flex items-center justify-center gap-2 shadow-md mt-4"
          style={{ background: eventColor, boxShadow: `0 4px 14px ${eventColor}55` }}>
          <Plus className="w-4 h-4" /> Add Sub-event
        </motion.button>
      </TabsContent>

      <TabsContent value="photos" className="mt-0">
        {photos.length === 0 ? (
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => photoInputRef.current?.click()}
            className="w-full border-2 border-dashed rounded-2xl py-14 flex flex-col items-center gap-3 transition-colors"
            style={{ borderColor: `${eventColor}55` }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: eventLightColor }}>
              <Camera className="w-6 h-6" style={{ color: eventColor }} />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-700">Add photos</p>
              <p className="text-xs text-gray-400 mt-0.5">Tap to upload from your camera roll</p>
            </div>
          </motion.button>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {photos.map((src, i) => (
                <motion.button key={i} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setLightboxIdx(i)}
                  className="aspect-square rounded-2xl overflow-hidden bg-gray-100 active:scale-95 transition-transform">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </motion.button>
              ))}
              {/* Add more tile */}
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => photoInputRef.current?.click()}
                className="aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 border-2 border-dashed transition-colors"
                style={{ borderColor: `${eventColor}55` }}>
                <ImageIcon className="w-5 h-5" style={{ color: eventColor }} />
                <span className="text-[10px] font-semibold" style={{ color: eventColor }}>Add more</span>
              </motion.button>
            </div>
            <p className="text-[10px] text-gray-400 text-center">Tap a photo to view · tap delete to remove</p>
          </>
        )}
      </TabsContent>

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
