interface PageShellProps {
  children: React.ReactNode
  className?: string
}

export function PageShell({ children, className = '' }: PageShellProps) {
  return (
    <main className={`pt-4 pb-32 px-4 min-h-dvh ${className}`}>
      {children}
    </main>
  )
}
