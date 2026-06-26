'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface SocialLink {
  platform: 'linkedin' | 'github' | 'twitter' | 'website' | 'instagram' | 'email'
  url: string
}

export interface ProfileData {
  name: string
  title: string
  bio: string
  location: string
  accentColor: string
  avatarInitials: string
  avatarUrl: string
  themeId: string
  links: SocialLink[]
}

const DEFAULT_PROFILE: ProfileData = {
  name: 'Claire Kleedorfer',
  title: 'Finance & Data Science · Boston College',
  bio: 'First-gen college student building at the intersection of finance, tech, and human stories. TEDx speaker. Marathon runner. Believer that the whole story matters.',
  location: 'Boston, MA',
  accentColor: '#0F766E',
  avatarInitials: 'CK',
  avatarUrl: '',
  themeId: 'tidal',
  links: [
    { platform: 'linkedin', url: '' },
    { platform: 'github', url: '' },
    { platform: 'twitter', url: '' },
    { platform: 'website', url: '' },
  ],
}

interface ProfileContextType {
  profile: ProfileData
  updateProfile: (updates: Partial<ProfileData>) => void
  updateLink: (platform: SocialLink['platform'], url: string) => void
}

const ProfileContext = createContext<ProfileContextType | null>(null)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('pos-profile')
      if (saved) setProfile({ ...DEFAULT_PROFILE, ...JSON.parse(saved) })
    } catch {}
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    try { localStorage.setItem('pos-profile', JSON.stringify(profile)) } catch {}
  }, [profile, loaded])

  function updateProfile(updates: Partial<ProfileData>) {
    setProfile(prev => ({ ...prev, ...updates }))
  }

  function updateLink(platform: SocialLink['platform'], url: string) {
    setProfile(prev => ({
      ...prev,
      links: prev.links.map(l => l.platform === platform ? { ...l, url } : l),
    }))
  }

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, updateLink }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfile must be inside ProfileProvider')
  return ctx
}
