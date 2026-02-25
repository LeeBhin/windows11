import { useRef, useEffect } from 'react'
import { useDesktopStore } from '../../../store/useDesktopStore'
import TaskbarButton from '../TaskbarButton'

const CX = 128, CY = 128
const OUTER_R = 128, INNER_R = 92
const ARC_DEG = 160
const ARC_RAD = ARC_DEG * Math.PI / 180
const ARC_FRAC = ARC_DEG / 360

function drawArc(ctx, angle) {
  ctx.clearRect(0, 0, 292, 300)

  const grad = ctx.createConicGradient(angle, CX, CY)
  grad.addColorStop(0, 'rgba(91,226,115,0)')
  grad.addColorStop(ARC_FRAC * 0.30, 'rgba(91,226,115,1)')
  grad.addColorStop(ARC_FRAC * 0.70, 'rgba(91,226,115,1)')
  grad.addColorStop(ARC_FRAC, 'rgba(91,226,115,0)')
  grad.addColorStop(ARC_FRAC + 0.001, 'rgba(0,0,0,0)')
  grad.addColorStop(1, 'rgba(0,0,0,0)')

  ctx.beginPath()
  ctx.arc(CX, CY, OUTER_R, angle, angle + ARC_RAD)
  ctx.arc(CX, CY, INNER_R, angle + ARC_RAD, angle, true)
  ctx.closePath()
  ctx.fillStyle = grad
  ctx.fill()
}

export default function SearchButton() {
  const isActive = useDesktopStore((s) => s.panels.searchPanel)
  const togglePanel = useDesktopStore((s) => s.togglePanel)
  const canvasRef = useRef(null)
  const color = isActive ? '#0071D1' : '#181817'

  useEffect(() => {
    if (!isActive || !canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')

    const FROM = 63 * Math.PI / 180
    const TO = 243 * Math.PI / 180
    const DUR = 200
    const t0 = performance.now()
    let raf

    function frame(now) {
      const p = Math.min((now - t0) / DUR, 1)
      const ease = 1 - (1 - p) * (1 - p)
      drawArc(ctx, FROM + (TO - FROM) * ease)
      if (p < 1) raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [isActive])

  return (
    <TaskbarButton
      onClick={(e) => { e.stopPropagation(); togglePanel('searchPanel') }}
      isActive={isActive}
      className="w-10 h-10"
      tooltip="검색"
    >
      <svg viewBox="0 0 292 300" width={24.5} height={24.5}>
        <path
          fill={color}
          fillRule="evenodd"
          d="M254 128A126 126 0 1 1 2 128A126 126 0 1 1 254 128ZM222 128A94 94 0 1 0 34 128A94 94 0 1 0 222 128Z"
        />

        {isActive && (
          <foreignObject x="0" y="0" width="292" height="300">
            <canvas
              ref={canvasRef}
              width={292}
              height={300}
              style={{ width: '100%', height: '100%' }}
            />
          </foreignObject>
        )}

        <g transform="rotate(45 206 206)">
          <rect x="198" y="207.5" width="118" height="37" rx="18.5" fill={color} />
        </g>
      </svg>
    </TaskbarButton>
  )
}
