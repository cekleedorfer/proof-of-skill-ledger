export const EVENT_COLORS = [
  { bg: '#0F766E', light: '#CCFBF1', text: '#fff' }, // deep teal
  { bg: '#EA580C', light: '#FFEDD5', text: '#fff' }, // burnt orange
  { bg: '#BE185D', light: '#FCE7F3', text: '#fff' }, // deep rose
  { bg: '#0369A1', light: '#E0F2FE', text: '#fff' }, // ocean blue
  { bg: '#7C3AED', light: '#EDE9FE', text: '#fff' }, // plum
  { bg: '#15803D', light: '#DCFCE7', text: '#fff' }, // forest green
  { bg: '#B45309', light: '#FEF3C7', text: '#fff' }, // dark amber
  { bg: '#9F1239', light: '#FFE4E6', text: '#fff' }, // crimson
  { bg: '#0E7490', light: '#CFFAFE', text: '#fff' }, // dark cyan
  { bg: '#6D28D9', light: '#EDE9FE', text: '#fff' }, // violet
]

export function getEventColor(index: number) {
  return EVENT_COLORS[index % EVENT_COLORS.length]
}

export function getEventColorById(id: string, allIds: string[]) {
  const index = allIds.indexOf(id)
  return getEventColor(index === -1 ? 0 : index)
}
