'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useProfile, SocialLink } from '@/lib/profile'
import { useStore } from '@/lib/store'
import { THEMES, getTheme, getThemedColor, getBubbleColor, textColorForBg } from '@/lib/themes'
import { toast } from 'sonner'
import { useRef } from 'react'
import {
  Linkedin, Github, Twitter, Globe, Mail, Instagram,
  ExternalLink, Pencil, Check, MapPin, X, ChevronRight, Camera,
} from 'lucide-react'


const PLATFORM_META: Record<SocialLink['platform'], { icon: React.ElementType; label: string; placeholder: string; base: string }> = {
  linkedin: { icon: Linkedin, label: 'LinkedIn', placeholder: 'linkedin.com/in/yourname', base: 'https://' },
  github:   { icon: Github,   label: 'GitHub',   placeholder: 'github.com/yourname',        base: 'https://' },
  twitter:  { icon: Twitter,  label: 'Twitter / X', placeholder: 'x.com/yourhandle',        base: 'https://' },
  website:  { icon: Globe,    label: 'Website',  placeholder: 'yoursite.com',               base: 'https://' },
  instagram:{ icon: Instagram,label: 'Instagram',placeholder: 'instagram.com/yourname',     base: 'https://' },
  email:    { icon: Mail,     label: 'Email',    placeholder: 'you@email.com',              base: 'mailto:' },
}

function normalizeUrl(url: string, base: string) {
  if (!url) return ''
  if (url.startsWith('http') || url.startsWith('mailto:')) return url
  return base + url
}

export default function ProfilePage() {
  const { profile, updateProfile, updateLink } = useProfile()
  const { events } = useStore()
  const router = useRouter()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editingLink, setEditingLink] = useState<SocialLink['platform'] | null>(null)
  const [tempValues, setTempValues] = useState<Record<string, string>>({})
  const [showDesign, setShowDesign] = useState(false)

  const portfolioEvents = events.filter(e => e.visibility === 'portfolio')
  const allIds = events.map(e => e.id)
  const theme = getTheme(profile.themeId)
  const ac = theme.accent

  function startEdit(field: string, current: string) {
    setEditingField(field)
    setTempValues(v => ({ ...v, [field]: current }))
  }

  function saveField(field: string) {
    const val = tempValues[field]?.trim()
    if (val !== undefined) updateProfile({ [field]: val } as any)
    setEditingField(null)
  }

  function startLinkEdit(platform: SocialLink['platform'], current: string) {
    setEditingLink(platform)
    setTempValues(v => ({ ...v, [platform]: current }))
  }

  function saveLinkEdit(platform: SocialLink['platform']) {
    updateLink(platform, tempValues[platform]?.trim() ?? '')
    setEditingLink(null)
    toast.success('Link saved')
  }

  function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => updateProfile({ avatarUrl: reader.result as string })
    reader.readAsDataURL(file)
  }

  function openLink(url: string, base: string) {
    const full = normalizeUrl(url, base)
    if (full) window.open(full, '_blank')
  }

  const filledLinks = profile.links.filter(l => l.url)
  const emptyLinks = profile.links.filter(l => !l.url)

  return (
    <div className="min-h-dvh pb-36" style={{ background: `linear-gradient(160deg, ${ac}18 0%, #fff7ed 60%, #f5f5f7 100%)` }}>

      {/* Hero */}
      <div className="relative overflow-hidden pb-6 px-4 pt-6" style={{ background: `linear-gradient(150deg, ${ac} 0%, ${ac}bb 100%)` }}>
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle at 75% 15%, white, transparent 55%)' }} />

        <div className="relative flex items-start justify-between mb-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-0.5">Proof of Skill</p>
            <p className="text-xs font-semibold text-white/70">Your Profile</p>
          </div>
          <button onClick={() => setShowDesign(v => !v)}
            className="flex items-center gap-1.5 bg-white/20 rounded-xl px-3 py-1.5 text-white text-xs font-semibold">
            <Pencil className="w-3 h-3" /> Customize
          </button>
        </div>

        {/* Hidden file input */}
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />

        {/* Avatar */}
        <div className="flex items-end gap-4 mb-4">
          <button onClick={() => fileInputRef.current?.click()}
            className="relative w-20 h-20 rounded-3xl shadow-lg border-2 border-white/30 overflow-hidden flex-shrink-0 group"
            style={{ background: `${ac}99` }}>
            {profile.avatarUrl
              ? <img src={profile.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              : <span className="text-2xl font-black text-white w-full h-full flex items-center justify-center">{profile.avatarInitials}</span>
            }
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </button>
          <div className="flex-1 pb-1">
            {/* Name */}
            {editingField === 'name' ? (
              <div className="flex items-center gap-2">
                <input autoFocus value={tempValues.name ?? profile.name}
                  onChange={e => setTempValues(v => ({ ...v, name: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && saveField('name')}
                  className="bg-white/20 text-white font-black text-xl rounded-lg px-2 py-0.5 outline-none flex-1 placeholder-white/50"
                  style={{ minWidth: 0 }} />
                <button onClick={() => saveField('name')} className="text-white"><Check className="w-4 h-4" /></button>
              </div>
            ) : (
              <button onClick={() => startEdit('name', profile.name)} className="text-left group flex items-center gap-1.5">
                <h1 className="text-xl font-black text-white leading-tight">{profile.name}</h1>
                <Pencil className="w-3 h-3 text-white/40 group-hover:text-white/80 transition-colors" />
              </button>
            )}
            {/* Title */}
            {editingField === 'title' ? (
              <div className="flex items-center gap-2 mt-1">
                <input autoFocus value={tempValues.title ?? profile.title}
                  onChange={e => setTempValues(v => ({ ...v, title: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && saveField('title')}
                  className="bg-white/20 text-white/90 text-xs rounded-lg px-2 py-0.5 outline-none flex-1"
                  style={{ minWidth: 0 }} />
                <button onClick={() => saveField('title')} className="text-white"><Check className="w-4 h-4" /></button>
              </div>
            ) : (
              <button onClick={() => startEdit('title', profile.title)} className="text-left group flex items-center gap-1 mt-0.5">
                <p className="text-xs text-white/75 font-medium">{profile.title}</p>
                <Pencil className="w-2.5 h-2.5 text-white/30 group-hover:text-white/70 transition-colors" />
              </button>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-white/60 text-xs">
          <MapPin className="w-3 h-3" />
          {editingField === 'location' ? (
            <div className="flex items-center gap-2 flex-1">
              <input autoFocus value={tempValues.location ?? profile.location}
                onChange={e => setTempValues(v => ({ ...v, location: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && saveField('location')}
                className="bg-white/20 text-white text-xs rounded px-2 py-0.5 outline-none flex-1" />
              <button onClick={() => saveField('location')} className="text-white"><Check className="w-3 h-3" /></button>
            </div>
          ) : (
            <button onClick={() => startEdit('location', profile.location)} className="group flex items-center gap-1">
              <span>{profile.location}</span>
              <Pencil className="w-2.5 h-2.5 opacity-0 group-hover:opacity-60 transition-opacity" />
            </button>
          )}
        </div>

        {/* Social links row */}
        {filledLinks.length > 0 && (
          <div className="flex gap-2 mt-4 flex-wrap">
            {filledLinks.map(link => {
              const meta = PLATFORM_META[link.platform]
              const Icon = meta.icon
              return (
                <button key={link.platform}
                  onClick={() => openLink(link.url, meta.base)}
                  className="flex items-center gap-1.5 bg-white/20 rounded-xl px-3 py-1.5 text-white text-xs font-semibold active:scale-95 transition-transform">
                  <Icon className="w-3.5 h-3.5" />
                  {meta.label}
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="px-4 pt-4 space-y-4">

        {/* Design panel */}
        <AnimatePresence>
          {showDesign && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Customize</p>
                  <button onClick={() => setShowDesign(false)}><X className="w-4 h-4 text-gray-400" /></button>
                </div>

                {/* Theme picker */}
                <p className="text-xs font-semibold text-gray-500 mb-2">Color theme</p>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {THEMES.map(t => {
                    const active = profile.themeId === t.id
                    return (
                      <button key={t.id}
                        onClick={() => { updateProfile({ themeId: t.id, accentColor: t.accent }); toast.success(`${t.name} theme applied`) }}
                        className="rounded-2xl p-2.5 border-2 transition-all text-left"
                        style={{ borderColor: active ? t.accent : '#E5E7EB', background: active ? `${t.accent}10` : 'transparent' }}>
                        <div className="flex gap-1 mb-1.5">
                          {t.colors.slice(0, 4).map((c, i) => (
                            <div key={i} className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: c.bg }} />
                          ))}
                        </div>
                        <p className="text-[11px] font-bold" style={{ color: active ? t.accent : '#6B7280' }}>{t.name}</p>
                      </button>
                    )
                  })}
                </div>

                {/* Avatar */}
                <p className="text-xs font-semibold text-gray-500 mb-2">Profile photo</p>
                <div className="flex items-center gap-3 mb-4">
                  <button onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-gray-200 text-gray-600 active:scale-95 transition-transform">
                    <Camera className="w-3.5 h-3.5" /> Upload photo
                  </button>
                  {profile.avatarUrl && (
                    <button onClick={() => updateProfile({ avatarUrl: '' })}
                      className="text-xs text-red-400 font-semibold">Remove</button>
                  )}
                </div>

                {/* Initials */}
                <p className="text-xs font-semibold text-gray-500 mb-2">Avatar initials (shown without photo)</p>
                <div className="flex items-center gap-2 mb-4">
                  <input value={profile.avatarInitials} maxLength={3}
                    onChange={e => updateProfile({ avatarInitials: e.target.value.toUpperCase() })}
                    className="w-16 text-center font-black text-lg border border-gray-200 rounded-xl py-1.5 outline-none"
                    style={{ color: ac }} />
                  <p className="text-xs text-gray-400">Up to 3 characters</p>
                </div>

                {/* Social links management */}
                <p className="text-xs font-semibold text-gray-500 mb-2">Social links</p>
                <div className="space-y-2">
                  {profile.links.map(link => {
                    const meta = PLATFORM_META[link.platform]
                    const Icon = meta.icon
                    return (
                      <div key={link.platform}>
                        {editingLink === link.platform ? (
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <input autoFocus value={tempValues[link.platform] ?? link.url}
                              onChange={e => setTempValues(v => ({ ...v, [link.platform]: e.target.value }))}
                              onKeyDown={e => e.key === 'Enter' && saveLinkEdit(link.platform)}
                              placeholder={meta.placeholder}
                              className="flex-1 text-xs border-b border-gray-200 py-1 outline-none text-gray-700 placeholder-gray-300 bg-transparent" />
                            <button onClick={() => saveLinkEdit(link.platform)}
                              className="w-6 h-6 rounded-full flex items-center justify-center text-white flex-shrink-0"
                              style={{ background: ac }}>
                              <Check className="w-3 h-3" />
                            </button>
                            <button onClick={() => setEditingLink(null)} className="text-gray-300"><X className="w-3.5 h-3.5" /></button>
                          </div>
                        ) : (
                          <button onClick={() => startLinkEdit(link.platform, link.url)}
                            className="w-full flex items-center gap-2 py-1.5 text-left group">
                            <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-xs flex-1 truncate" style={{ color: link.url ? ac : '#9CA3AF' }}>
                              {link.url || meta.placeholder}
                            </span>
                            <Pencil className="w-3 h-3 text-gray-300 group-hover:text-gray-500 flex-shrink-0" />
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bio */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Bio</p>
            {editingField === 'bio'
              ? <button onClick={() => saveField('bio')} className="text-xs font-semibold" style={{ color: ac }}>Save</button>
              : <button onClick={() => startEdit('bio', profile.bio)} className="text-gray-300 hover:text-gray-500"><Pencil className="w-3.5 h-3.5" /></button>
            }
          </div>
          {editingField === 'bio' ? (
            <textarea autoFocus rows={4} value={tempValues.bio ?? profile.bio}
              onChange={e => setTempValues(v => ({ ...v, bio: e.target.value }))}
              className="w-full text-sm text-gray-700 leading-relaxed outline-none resize-none bg-transparent" />
          ) : (
            <p className="text-sm text-gray-600 leading-relaxed">{profile.bio}</p>
          )}
        </div>

        {/* Links — empty ones as add prompts */}
        {emptyLinks.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Add links</p>
            <div className="space-y-1">
              {emptyLinks.map(link => {
                const meta = PLATFORM_META[link.platform]
                const Icon = meta.icon
                return (
                  <div key={link.platform}>
                    {editingLink === link.platform ? (
                      <div className="flex items-center gap-2 py-1">
                        <Icon className="w-4 h-4 flex-shrink-0" style={{ color: ac }} />
                        <input autoFocus value={tempValues[link.platform] ?? ''}
                          onChange={e => setTempValues(v => ({ ...v, [link.platform]: e.target.value }))}
                          onKeyDown={e => e.key === 'Enter' && saveLinkEdit(link.platform)}
                          placeholder={meta.placeholder}
                          className="flex-1 text-sm border-b py-1 outline-none text-gray-700 placeholder-gray-300 bg-transparent"
                          style={{ borderColor: ac }} />
                        <button onClick={() => saveLinkEdit(link.platform)}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-white flex-shrink-0"
                          style={{ background: ac }}>
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setEditingLink(null)} className="text-gray-300"><X className="w-3.5 h-3.5" /></button>
                      </div>
                    ) : (
                      <button onClick={() => startLinkEdit(link.platform, '')}
                        className="w-full flex items-center gap-2.5 py-2 text-left group rounded-xl px-2 hover:bg-gray-50 transition-colors">
                        <Icon className="w-4 h-4 text-gray-300 group-hover:text-gray-500 flex-shrink-0" />
                        <span className="text-sm text-gray-300 group-hover:text-gray-400 flex-1">Add {meta.label}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-200 group-hover:text-gray-400" />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Portfolio projects */}
        {portfolioEvents.length > 0 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: ac }}>Featured Projects</p>
            <div className="space-y-3">
              {portfolioEvents.map((event, i) => {
                const idx = allIds.indexOf(event.id)
                const color = getThemedColor(theme, idx)
                const bubbleColor = getBubbleColor(theme, idx, event.significance)
                return (
                  <motion.div key={event.id}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    onClick={() => router.push(`/event/${event.id}`)}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer active:scale-[0.99] transition-transform">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center font-black text-sm"
                        style={{ background: bubbleColor, color: textColorForBg(bubbleColor) }}>
                        {event.significance}★
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-bold text-sm text-gray-900 truncate">{event.title}</h3>
                          <span className="text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full flex-shrink-0 capitalize"
                            style={{ background: color.light, color: color.bg }}>{event.category}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                          {event.subEvents.length > 0 && ` · ${event.subEvents.length} micro-win${event.subEvents.length > 1 ? 's' : ''}`}
                        </p>
                        <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-2">{event.aiSummary}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {event.skills.slice(0, 3).map(s => (
                            <span key={s} className="text-[9px] px-2 py-0.5 rounded-full font-semibold"
                              style={{ background: color.light, color: color.bg }}>{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
