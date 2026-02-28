import { useState } from 'react'
import { Moon, User, Share2, Monitor, Copy, Leaf, Volume2, VolumeX, Settings, ChevronRight } from 'lucide-react'
import { useDesktopStore } from '../../store/useDesktopStore'
import { useAnimatedPanel } from '../../hooks/useAnimatedPanel'
import Tooltip from '../ui/Tooltip'

const quickSettings = [
  { id: 'night',   label: '야간 모드',      Icon: Moon,    expandable: true,  defaultOn: false },
  { id: 'access',  label: '접근성',         Icon: User,    expandable: true,  defaultOn: false },
  { id: 'share',   label: '근거리 공유',    Icon: Share2,  expandable: false, defaultOn: false },
  { id: 'display', label: '유선 디스플레이', Icon: Monitor, expandable: true,  defaultOn: true  },
  { id: 'project', label: '다른 화면에 표시', Icon: Copy,  expandable: true,  defaultOn: false },
  { id: 'power',   label: '절전 모드',      Icon: Leaf,    expandable: false, defaultOn: false },
]

function Slider({ value, onChange, icon: Icon, onIconClick }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5">
      <button onClick={onIconClick} className="flex-shrink-0 text-gray-500 hover:text-gray-800 transition-colors">
        <Icon size={18} />
      </button>
      <div className="flex-1 relative h-1.5 cursor-pointer">
        <div className="absolute inset-0 rounded-full bg-gray-200" />
        <div className="absolute inset-y-0 left-0 rounded-full bg-blue-500" style={{ width: `${value}%` }} />
        <input
          type="range" min={0} max={100} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
        />
        {/* 슬라이더 핸들 */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-blue-500 shadow-sm pointer-events-none"
          style={{ left: `calc(${value}% - 7px)` }}
        />
      </div>
      <button className="flex-shrink-0 flex items-center gap-0.5 text-gray-400 hover:text-gray-700 transition-colors">
        <ChevronRight size={13} />
      </button>
    </div>
  )
}

export default function ActionCenter() {
  const isOpen     = useDesktopStore((s) => s.panels.actionCenter)
  const volume     = useDesktopStore((s) => s.volume)
  const isMuted    = useDesktopStore((s) => s.isMuted)
  const setVolume  = useDesktopStore((s) => s.setVolume)
  const toggleMute = useDesktopStore((s) => s.toggleMute)
  const phase      = useAnimatedPanel(isOpen)

  const [toggles, setToggles] = useState(
    Object.fromEntries(quickSettings.map((t) => [t.id, t.defaultOn]))
  )
  const [brightness, setBrightness] = useState(80)
  const flip = (id) => setToggles((p) => ({ ...p, [id]: !p[id] }))
  const displayVolume = isMuted ? 0 : volume

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
      className="fixed rounded-[8px] shadow-2xl overflow-hidden"
      style={{
        bottom: '52px',
        right: '8px',
        width: '360px',
        background: 'rgba(243,243,243,0.97)',
        backdropFilter: 'blur(40px)',
        border: '1px solid rgba(0,0,0,0.07)',
        zIndex: 50,
        ...animStyle,
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* 빠른 설정 3×2 그리드 */}
      <div className="p-3 grid grid-cols-3 gap-2">
        {quickSettings.map(({ id, label, Icon, expandable }) => {
          const isOn = toggles[id]
          return (
            <Tooltip key={id} label={label}>
              <div
                className="flex rounded-xl overflow-hidden w-full"
                style={{
                  background: isOn ? '#0078d4' : 'rgba(255,255,255,0.85)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                }}
              >
                <button
                  onClick={() => flip(id)}
                  className="flex-1 flex flex-col items-start gap-2 p-3 min-w-0"
                >
                  <Icon size={20} color={isOn ? '#fff' : '#222'} strokeWidth={1.8} />
                  <span className="text-xs font-medium leading-tight text-left truncate w-full" style={{ color: isOn ? '#fff' : '#222' }}>
                    {label}
                  </span>
                </button>
                {expandable && (
                  <button
                    className="flex items-center justify-center px-1.5"
                    style={{ borderLeft: `1px solid ${isOn ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.07)'}`, color: isOn ? 'rgba(255,255,255,0.85)' : '#888' }}
                  >
                    <ChevronRight size={12} />
                  </button>
                )}
              </div>
            </Tooltip>
          )
        })}
      </div>

      <div className="mx-3 border-t border-black/[0.06]" />

      {/* 볼륨 슬라이더 */}
      <Slider
        value={displayVolume}
        onChange={setVolume}
        icon={isMuted || volume === 0 ? VolumeX : Volume2}
        onIconClick={toggleMute}
      />

      {/* 밝기 슬라이더 */}
      <Slider
        value={brightness}
        onChange={setBrightness}
        icon={() => (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4"/>
            <line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        )}
        onIconClick={() => {}}
      />

      <div className="mx-3 border-t border-black/[0.06]" />

      {/* 하단 설정 버튼 */}
      <div className="flex justify-end px-3 py-2">
        <Tooltip label="설정">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-black/8 transition-colors text-gray-500 hover:text-gray-800">
            <Settings size={16} />
          </button>
        </Tooltip>
      </div>
    </div>
  )
}
