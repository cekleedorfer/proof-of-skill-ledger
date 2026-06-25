// Vibrant per-event color palette matching the mockup
export const EVENT_COLORS = [
  { bg: '#7C3AED', light: '#EDE9FE', text: '#fff' }, // violet
  { bg: '#EC4899', light: '#FCE7F3', text: '#fff' }, // pink
  { bg: '#10B981', light: '#D1FAE5', text: '#fff' }, // emerald
  { bg: '#F59E0B', light: '#FEF3C7', text: '#fff' }, // amber
  { bg: '#3B82F6', light: '#DBEAFE', text: '#fff' }, // blue
  { bg: '#EF4444', light: '#FEE2E2', text: '#fff' }, // red
  { bg: '#8B5CF6', light: '#EDE9FE', text: '#fff' }, // purple
  { bg: '#06B6D4', light: '#CFFAFE', text: '#fff' }, // cyan
]

export function getEventColor(index: number) {
  return EVENT_COLORS[index % EVENT_COLORS.length]
}

export function getEventColorById(id: string, allIds: string[]) {
  const index = allIds.indexOf(id)
  return getEventColor(index === -1 ? 0 : index)
}
