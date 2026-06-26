import { seedEvents } from '@/data/seed'
import EventDetailClient from './EventDetailClient'

export function generateStaticParams() {
  return seedEvents.map(e => ({ id: e.id }))
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <EventDetailClient params={params} />
}
