import type { Metadata } from 'next'
import './globals.css'
import { StoreProvider } from '@/lib/store'
import { BottomNav } from '@/components/layout/BottomNav'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: 'Proof-of-Skill Ledger',
  description: 'Document your growth, one event at a time.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased">
        <StoreProvider>
          <div className="app-container">
            {children}
            <BottomNav />
          </div>
        </StoreProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
