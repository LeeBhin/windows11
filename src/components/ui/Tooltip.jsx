import { useState, useEffect, useRef } from 'react'
import { PanelSurface } from './PanelShell'

const DELAY    = 600
const FADE     = 400
const COOLDOWN = 200

let activeId    = null
let isFadingOut = false
let fadeEndTime = 0

export default function Tooltip({ label, children }) {
  const id       = useRef(Symbol())
  const [mounted,  setMounted]  = useState(false)
  const [visible,  setVisible]  = useState(false)
  const delayRef = useRef(null)
  const animRef  = useRef(null)

  const clearTimers = () => {
    clearTimeout(delayRef.current)
    clearTimeout(animRef.current)
  }

  const doShow = () => {
    setMounted(true)
    animRef.current = setTimeout(() => setVisible(true), 20)
  }

  const onEnter = () => {
    clearTimers()

    if (isFadingOut && activeId !== id.current) {
      const remaining = Math.max(0, fadeEndTime - Date.now())
      delayRef.current = setTimeout(doShow, remaining + COOLDOWN)
    } else {
      delayRef.current = setTimeout(doShow, DELAY)
    }
  }

  const onLeave = () => {
    clearTimers()
    if (!mounted) return

    activeId    = id.current
    isFadingOut = true
    fadeEndTime = Date.now() + FADE

    setVisible(false)
    animRef.current = setTimeout(() => {
      setMounted(false)
      isFadingOut = false
    }, FADE)
  }

  useEffect(() => () => clearTimers(), [])

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onMouseDownCapture={onLeave}
    >
      {children}

      {mounted && label && (
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: 'calc(100% + 8px)',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 200,
            opacity: visible ? 1 : 0,
            transition: `opacity ${FADE}ms ease`,
          }}
        >
          <PanelSurface>
            <div
              className="px-2.5 py-1.5 rounded-[8px] text-xs whitespace-nowrap"
              style={{ color: '#1a1a1a', fontWeight: 400 }}
            >
              {label}
            </div>
          </PanelSurface>
        </div>
      )}
    </div>
  )
}
