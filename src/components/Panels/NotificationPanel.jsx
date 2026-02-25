import { Bell, Settings } from 'lucide-react'
import { useDesktopStore } from '../../store/useDesktopStore'

export default function NotificationPanel() {
  const isOpen = useDesktopStore((s) => s.panels.notificationPanel)

  return (
    <div
      className="fixed rounded-2xl shadow-2xl overflow-hidden transition-all duration-150 flex flex-col"
      style={{
        bottom: '52px',
        right: '376px', // CalendarPanel(360) + gap(8) + margin(8)
        width: '360px',
        height: '460px',
        background: 'rgba(243, 243, 243, 0.97)',
        backdropFilter: 'blur(40px)',
        border: '1px solid rgba(0,0,0,0.06)',
        zIndex: 50,
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.97)',
        pointerEvents: isOpen ? 'auto' : 'none',
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <span className="text-sm font-semibold text-gray-800">알림</span>
        <button className="text-gray-400 hover:text-gray-700 transition-colors">
          <Settings size={14} />
        </button>
      </div>

      {/* 알림 목록 영역 */}
      <div className="flex-1 mx-4 mb-4 rounded-xl flex flex-col items-center justify-center gap-2" style={{ background: 'rgba(255,255,255,0.6)' }}>
        <Bell size={32} color="#ccc" strokeWidth={1.5} />
        <span className="text-gray-400 text-sm">새 알림 없음</span>
      </div>
    </div>
  )
}
