import { useDesktopStore } from '../../store/useDesktopStore'
import { useAnimatedPanel } from '../../hooks/useAnimatedPanel'
import Tooltip from '../ui/Tooltip'

const hiddenIcons = [
  { id: 'whale', name: 'NAVER Whale', emoji: '🌊' },
  { id: 'zoom', name: 'Zoom', emoji: '📹' },
  { id: 'discord', name: 'Discord', emoji: '💬' },
  { id: 'intellij', name: 'IntelliJ IDEA', emoji: '🧠' },
  { id: 'obs', name: 'OBS Studio', emoji: '🎙️' },
  { id: 'defender', name: 'Windows 보안', emoji: '🛡️' },
  { id: 'storage', name: 'USB 스토리지', emoji: '💾' },
  { id: 'steam', name: 'Steam', emoji: '🎮' },
]

export default function HiddenIconsTray() {
  const isOpen = useDesktopStore((s) => s.panels.hiddenIcons)
  const phase  = useAnimatedPanel(isOpen)

  const EASE_OUT = 'transform 0.2s ease'
  const EASE_IN  = 'transform 0.2s cubic-bezier(0.88, 0, 0.88, 1)'
  const animStyle = (() => {
    if (phase === 'closed')   return { transform: 'translateY(calc(100% + 60px))', transition: 'none',    pointerEvents: 'none' }
    if (phase === 'open')     return { transform: 'translateY(0)',                 transition: 'none',    pointerEvents: 'auto' }
    if (phase === 'entering') return { transform: 'translateY(0)',                 transition: EASE_OUT,  pointerEvents: 'auto' }
    return                           { transform: 'translateY(calc(100% + 60px))', transition: EASE_IN,   pointerEvents: 'none' }
  })()

  return (
    <div
      className="fixed rounded-xl shadow-xl"
      style={{
        bottom: '56px',
        right: '120px',
        background: 'rgba(248, 248, 248, 0.97)',
        backdropFilter: 'blur(40px)',
        border: '1px solid rgba(0,0,0,0.08)',
        zIndex: 50,
        padding: '10px',
        overflow: 'visible',
        ...animStyle,
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="grid grid-cols-5 gap-1.5">
        {hiddenIcons.map((icon) => (
          <Tooltip key={icon.id} label={icon.name}>
            <button className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-black/8 transition-colors">
              <span className="text-xl leading-none">{icon.emoji}</span>
            </button>
          </Tooltip>
        ))}
      </div>
    </div>
  )
}
