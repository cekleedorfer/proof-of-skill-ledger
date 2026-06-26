import { seedEvents } from '@/data/seed'
import SubEventClient from './SubEventClient'

export function generateStaticParams() {
  return seedEvents.flatMap(e =>
    e.subEvents.map(s => ({ id: e.id, subId: s.id }))
  )
}

export default function Page({ params }: { params: Promise<{ id: string; subId: string }> }) {
  return <SubEventClient params={params} />
}
