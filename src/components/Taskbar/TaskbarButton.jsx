import { useState } from 'react'
import TaskbarTooltip from './TaskbarTooltip'

const BG_STYLE = {
  backgroundColor: '#f2f6ff98',
  boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 0.5px 2px rgba(0,0,0,0.02)',
  border: '0.5px solid rgba(0,0,0,0.08)',
}

export default function TaskbarButton({ children, onClick, tooltip, className = '', isActive = false }) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  const showBg = hovered || isActive
  const bgOpacity = pressed ? 0.7 : showBg ? 1 : 0
  const iconScale = pressed ? 'scale(0.77)' : 'scale(1)'

  return (
    <TaskbarTooltip tooltip={tooltip}>
      <button
        onClick={onClick}
        onMouseDown={(e) => { e.stopPropagation(); setPressed(true) }}
        onMouseUp={() => setPressed(false)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setPressed(false) }}
        className={`relative flex items-center justify-center rounded-[4px] ${className}`}
      >
        <div
          className="absolute inset-0 rounded-[4px] transition-opacity duration-150"
          style={{ ...BG_STYLE, opacity: bgOpacity }}
        />
        <span
          className="relative flex items-center justify-center"
          style={{ transform: iconScale, transition: 'transform 0.13s ease-out' }}
        >
          {children}
        </span>
      </button>
    </TaskbarTooltip>
  )
}
