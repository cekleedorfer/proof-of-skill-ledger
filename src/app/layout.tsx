import type { Metadata } from 'next'
import './globals.css'
import { StoreProvider } from '@/lib/store'
import { ProfileProvider } from '@/lib/profile'
import { BottomNav } from '@/components/layout/BottomNav'
import { AppWrapper } from '@/components/layout/AppWrapper'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'Proof-of-Skill Ledger',
  description: 'Every milestone. Every win. Forever.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <ProfileProvider>
            <AppWrapper>
              {children}
              <BottomNav />
              <Toaster position="top-center" richColors />
            </AppWrapper>
          </ProfileProvider>
        </StoreProvider>
      </body>
    </html>
  )
}
