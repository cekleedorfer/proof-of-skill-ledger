import { seedEvents } from '@/data/seed'
import AddSubClient from './AddSubClient'

export function generateStaticParams() {
  return seedEvents.map(e => ({ id: e.id }))
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <AddSubClient params={params} />
}
