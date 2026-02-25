import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'

export default function TaskbarTooltip({ children, tooltip, className = '' }) {
  const [visible, setVisible] = useState(false)
  const [show, setShow] = useState(false)
  const [pos, setPos] = useState({ left: 0, top: 0 })
  const timerRef = useRef(null)
  const hideTimerRef = useRef(null)
  const containerRef = useRef(null)
  const tooltipRef = useRef(null)

  const adjustPosition = useCallback(() => {
    if (!containerRef.current || !tooltipRef.current) return
    const container = containerRef.current.getBoundingClientRect()
    const tip = tooltipRef.current.getBoundingClientRect()

    const taskbar = containerRef.current.closest('[data-taskbar]')
    const taskbarTop = taskbar ? taskbar.getBoundingClientRect().top : container.top

    let left = container.left + container.width / 2 - tip.width / 2
    if (left < 4) left = 4
    if (left + tip.width > window.innerWidth - 4) left = window.innerWidth - 4 - tip.width

    setPos({ left, top: taskbarTop - tip.height - 12 })
  }, [])

  useEffect(() => {
    if (visible) {
      requestAnimationFrame(() => {
        adjustPosition()
        requestAnimationFrame(() => setShow(true))
      })
    }
  }, [visible, adjustPosition])

  const cancelHide = () => {
    clearTimeout(hideTimerRef.current)
  }

  const handleEnter = () => {
    cancelHide()
    timerRef.current = setTimeout(() => setVisible(true), 400)
  }

  const handleLeave = () => {
    clearTimeout(timerRef.current)
    setShow(false)
    hideTimerRef.current = setTimeout(() => setVisible(false), 200)
  }

  const handleTooltipEnter = () => {
    cancelHide()
    setShow(true)
  }

  const handleTooltipLeave = () => {
    setShow(false)
    hideTimerRef.current = setTimeout(() => setVisible(false), 200)
  }

  if (!tooltip) return children

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {children}
      {visible && createPortal(
        <div
          ref={tooltipRef}
          onMouseEnter={handleTooltipEnter}
          onMouseLeave={handleTooltipLeave}
          className="fixed px-2.5 py-1.5 rounded-[4px] whitespace-pre text-[11.5px] leading-[1.5] z-[200] transition-opacity duration-200"
          style={{
            background: 'rgba(243, 243, 243, 0.98)',
            border: '0.5px solid rgba(0,0,0,0.3)',
            boxShadow: '0px 3px 6px rgba(0,0,0,0.08), -1px 1.5px 2px rgba(0,0,0,0.05)',
            color: 'rgba(30,30,30,0.9)',
            left: pos.left,
            top: pos.top,
            opacity: show ? 1 : 0,
          }}
        >
          {tooltip}
        </div>,
        document.body
      )}
    </div>
  )
}
