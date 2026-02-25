import { useState, useEffect, useRef } from 'react'

/**
 * Manages enter/exit animation phases for a panel.
 * Returns one of: 'closed' | 'entering' | 'open' | 'exiting'
 *
 * @param {boolean} isOpen
 * @param {number}  enterMs  - enter animation duration (must match CSS keyframe duration)
 * @param {number}  exitMs   - exit animation duration (must match CSS keyframe duration)
 */
export function useAnimatedPanel(isOpen, enterMs = 200, exitMs = 200) {
  const [phase, setPhase] = useState(isOpen ? 'open' : 'closed')
  const timerRef = useRef(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    // Skip the effect on first render — initial phase is already set in useState
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    clearTimeout(timerRef.current)

    if (isOpen) {
      setPhase('entering')
      timerRef.current = setTimeout(() => setPhase('open'), enterMs)
    } else {
      setPhase('exiting')
      timerRef.current = setTimeout(() => setPhase('closed'), exitMs)
    }

    return () => clearTimeout(timerRef.current)
  }, [isOpen, enterMs, exitMs])

  return phase
}
