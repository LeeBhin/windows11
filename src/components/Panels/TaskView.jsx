import { useDesktopStore } from '../../store/useDesktopStore'

export default function TaskView() {
  const isOpen = useDesktopStore((s) => s.panels.taskView)
  const closeAllPanels = useDesktopStore((s) => s.closeAllPanels)

  return (
    <div
      className="fixed inset-0 transition-all duration-300 flex flex-col items-center justify-center gap-6"
      style={{
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        zIndex: 40,
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none',
      }}
      onClick={closeAllPanels}
    >
      <p className="text-white/40 text-sm">실행 중인 앱이 없습니다</p>
      <button onClick={closeAllPanels} className="text-white/60 text-xs px-4 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors">
        닫기
      </button>
    </div>
  )
}
