import { useDesktopStore } from '../../store/useDesktopStore'
import { useAnimatedPanel } from '../../hooks/useAnimatedPanel'
import Tooltip from '../ui/Tooltip'

const appIcon = (name) =>
  new URL(`../../assets/icons/applications/${name}.ico`, import.meta.url).href

const hiddenIcons = [
  { id: 'protection', name: 'Windows 보안', icon: 'protection' },
  { id: 'onedrive', name: 'OneDrive', icon: 'onedrive' },
  { id: 'teams', name: 'Microsoft Teams', icon: 'teams' },
  { id: 'yourphone', name: 'Phone Link', icon: 'yourphone' },
  { id: 'terminal', name: 'Windows Terminal', icon: 'terminal' },
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
      className="fixed rounded-[8px]"
      style={{
        bottom: '56px',
        right: '120px',
        background: '#f0f7fce7',
        backdropFilter: 'blur(50px)',
        border: '1.5px solid rgba(89, 80, 80, 0.35)',
        boxShadow: '0 8px 14px -2px rgba(0,0,0,0.22)',
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
              <img src={appIcon(icon.icon)} alt={icon.name} className="w-[18px] h-[18px] object-contain" draggable={false} />
            </button>
          </Tooltip>
        ))}
      </div>
    </div>
  )
}
