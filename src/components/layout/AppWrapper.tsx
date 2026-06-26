'use client'

import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

export function AppWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isDemo = pathname.startsWith('/demo')
  if (isDemo) return <>{children}</>
  return <div className="app-container">{children}</div>
}
