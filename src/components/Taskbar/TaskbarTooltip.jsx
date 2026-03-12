import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { PanelSurface } from '../ui/PanelShell'

export default function TaskbarTooltip({ children, tooltip, className = '', hideRef }) {
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

  const hide = useCallback(() => {
    clearTimeout(timerRef.current)
    setShow(false)
    hideTimerRef.current = setTimeout(() => setVisible(false), 200)
  }, [])

  const handleEnter = () => {
    cancelHide()
    timerRef.current = setTimeout(() => setVisible(true), 400)
  }

  const handleLeave = () => {
    hide()
  }

  const handleTooltipEnter = () => {
    cancelHide()
    setShow(true)
  }

  const handleTooltipLeave = () => {
    setShow(false)
    hideTimerRef.current = setTimeout(() => setVisible(false), 200)
  }

  useEffect(() => {
    if (hideRef) hideRef.current = hide
  }, [hide, hideRef])

  if (!tooltip) return children

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      {...(!hideRef && { onMouseDownCapture: hide })}
    >
      {children}
      {visible && createPortal(
        <div
          ref={tooltipRef}
          onMouseEnter={handleTooltipEnter}
          onMouseLeave={handleTooltipLeave}
          className="fixed z-[200] transition-opacity duration-200"
          style={{
            left: pos.left,
            top: pos.top,
            opacity: show ? 1 : 0,
          }}
        >
          <PanelSurface>
            <div
              className="px-2.5 py-1.5 whitespace-pre text-[11.5px] leading-[1.5]"
              style={{ color: 'rgba(30,30,30,0.9)' }}
            >
              {tooltip}
            </div>
          </PanelSurface>
        </div>,
        document.body
      )}
    </div>
  )
}
