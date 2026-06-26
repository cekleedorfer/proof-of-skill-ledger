'use client'

import { useEffect, useState } from 'react'

const TITANIUM = {
  outer: 'linear-gradient(160deg, #C8C8CC 0%, #98989D 30%, #AEAEB2 60%, #C8C8CC 100%)',
  edge: '#8E8E93',
  button: 'linear-gradient(to right, #A0A0A5, #8C8C91)',
  buttonR: 'linear-gradient(to left, #A0A0A5, #8C8C91)',
  highlight: 'rgba(255,255,255,0.45)',
  shadow: 'rgba(0,0,0,0.18)',
}

export default function DemoPage() {
  const [time, setTime] = useState('9:41')

  useEffect(() => {
    function update() {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }))
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  const btn = (style: React.CSSProperties) => (
    <div style={{
      position: 'absolute',
      width: 4,
      borderRadius: 3,
      background: TITANIUM.button,
      boxShadow: `inset 0 1px 0 ${TITANIUM.highlight}, inset 0 -1px 0 ${TITANIUM.shadow}`,
      ...style,
    }} />
  )

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: `
        radial-gradient(ellipse 800px 500px at 50% 52%, rgba(15,118,110,0.14) 0%, transparent 65%),
        radial-gradient(ellipse 500px 300px at 25% 20%, rgba(234,88,12,0.06) 0%, transparent 60%),
        linear-gradient(160deg, #0a0d12 0%, #0f1318 50%, #0a0d12 100%)
      `,
      padding: '28px 20px 36px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
      userSelect: 'none',
    }}>

      {/* Header */}
      <div style={{ marginBottom: 22, textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.22)', fontSize: 10, fontWeight: 600, letterSpacing: 5, textTransform: 'uppercase', margin: '0 0 7px' }}>
          Live Demo
        </p>
        <h1 style={{ color: 'rgba(255,255,255,0.82)', fontSize: 21, fontWeight: 700, letterSpacing: -0.5, margin: 0 }}>
          Proof-of-Skill Ledger
        </h1>
      </div>

      {/* Phone */}
      <div style={{ position: 'relative', width: 393, flexShrink: 0 }}>

        {/* Left buttons */}
        {btn({ left: -4, top: 118, height: 33, background: TITANIUM.buttonR })}
        {btn({ left: -4, top: 166, height: 66, background: TITANIUM.buttonR })}
        {btn({ left: -4, top: 244, height: 66, background: TITANIUM.buttonR })}
        {/* Right button */}
        {btn({ right: -4, top: 194, height: 86, background: TITANIUM.button })}

        {/* Outer titanium frame */}
        <div style={{
          background: TITANIUM.outer,
          borderRadius: 54,
          padding: 13,
          boxShadow: `
            inset 0 1px 0 rgba(255,255,255,0.5),
            inset 0 -1px 0 rgba(0,0,0,0.15),
            0 0 0 0.5px rgba(0,0,0,0.4),
            0 40px 100px rgba(0,0,0,0.85),
            0 16px 40px rgba(0,0,0,0.6),
            0 0 60px rgba(15,118,110,0.1)
          `,
        }}>

          {/* Inner screen bezel */}
          <div style={{
            background: '#000',
            borderRadius: 44,
            overflow: 'hidden',
            height: 852,
            position: 'relative',
          }}>

            {/* App iframe — stays contained, never navigates parent */}
            <iframe
              src="/"
              title="Proof of Skill Ledger"
              sandbox="allow-scripts allow-same-origin allow-forms"
              style={{
                position: 'absolute',
                top: 0, left: 0,
                width: '100%',
                height: '100%',
                border: 'none',
              }}
            />

            {/* Home indicator */}
            <div style={{
              position: 'absolute',
              bottom: 8,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 134,
              height: 5,
              background: 'rgba(255,255,255,0.88)',
              borderRadius: 100,
              zIndex: 200,
              pointerEvents: 'none',
            }} />

            {/* Screen glare */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 45%)',
              borderRadius: 44,
              pointerEvents: 'none',
              zIndex: 1,
            }} />
          </div>
        </div>

        {/* Desk reflection glow */}
        <div style={{
          position: 'absolute',
          bottom: -50,
          left: '15%', right: '15%',
          height: 50,
          background: 'radial-gradient(ellipse, rgba(15,118,110,0.2) 0%, transparent 70%)',
          filter: 'blur(18px)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Footer */}
      <div style={{ marginTop: 28, textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: 11, fontWeight: 500, letterSpacing: 3, textTransform: 'uppercase', margin: 0 }}>
          Next.js · Framer Motion · TypeScript
        </p>
      </div>
    </div>
  )
}
