import { ReactNode } from 'react'

export function PageShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={`min-h-dvh pb-32 bg-[#f5f5f7] px-4 pt-5 ${className ?? ''}`}>
      {children}
    </div>
  )
}
