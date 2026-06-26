'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { Event, SubEvent } from '@/types'
import { seedEvents } from '@/data/seed'

interface StoreContextType {
  events: Event[]
  addEvent: (event: Event) => void
  addSubEvent: (eventId: string, subEvent: SubEvent) => void
  toggleVisibility: (eventId: string) => void
  addEventPhoto: (eventId: string, dataUrl: string) => void
  removeEventPhoto: (eventId: string, index: number) => void
}

const StoreContext = createContext<StoreContextType | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>(seedEvents)

  function addEvent(event: Event) {
    setEvents(prev => [event, ...prev])
  }

  function addSubEvent(eventId: string, subEvent: SubEvent) {
    setEvents(prev =>
      prev.map(e =>
        e.id === eventId ? { ...e, subEvents: [...e.subEvents, subEvent] } : e
      )
    )
  }

  function toggleVisibility(eventId: string) {
    setEvents(prev =>
      prev.map(e =>
        e.id === eventId
          ? { ...e, visibility: e.visibility === 'portfolio' ? 'private' : 'portfolio' }
          : e
      )
    )
  }

  function addEventPhoto(eventId: string, dataUrl: string) {
    setEvents(prev =>
      prev.map(e =>
        e.id === eventId ? { ...e, photos: [...(e.photos ?? []), dataUrl] } : e
      )
    )
  }

  function removeEventPhoto(eventId: string, index: number) {
    setEvents(prev =>
      prev.map(e =>
        e.id === eventId
          ? { ...e, photos: e.photos.filter((_, i) => i !== index) }
          : e
      )
    )
  }

  return (
    <StoreContext.Provider value={{ events, addEvent, addSubEvent, toggleVisibility, addEventPhoto, removeEventPhoto }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
