import { useState, useEffect, useRef } from 'react'

const DELAY    = 600   // ms: 첫 호버 대기 시간
const FADE     = 400   // ms: fade in/out 시간
const COOLDOWN = 200   // ms: fade-out 완료 후 다음 툴팁 까지 대기

// Module-level: 어떤 컴포넌트의 툴팁이 마지막으로 활성화됐는지 추적
let activeId    = null   // Symbol — 마지막 툴팁 소유자
let isFadingOut = false  // 현재 fade-out 중인지
let fadeEndTime = 0      // fade-out 완료 예정 시각 (Date.now 기준)

export default function Tooltip({ label, children }) {
  const id       = useRef(Symbol())       // 이 컴포넌트의 고유 ID
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
      // 다른 요소로 이동하는 중 (fade-out 진행 중) → 남은 fade + COOLDOWN 후 표시
      const remaining = Math.max(0, fadeEndTime - Date.now())
      delayRef.current = setTimeout(doShow, remaining + COOLDOWN)
    } else {
      // 처음 호버이거나 같은 요소 재호버 → 항상 DELAY
      delayRef.current = setTimeout(doShow, DELAY)
    }
  }

  const onLeave = () => {
    clearTimers()
    if (!mounted) return  // delay 중이었으면 그냥 취소

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
          <div
            className="px-2.5 py-1.5 rounded text-xs whitespace-nowrap"
            style={{
              background: 'rgba(255,255,255,0.97)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.14), 0 1px 4px rgba(0,0,0,0.08)',
              border: '1px solid rgba(0,0,0,0.06)',
              color: '#1a1a1a',
              fontWeight: 400,
            }}
          >
            {label}
          </div>
        </div>
      )}
    </div>
  )
}
