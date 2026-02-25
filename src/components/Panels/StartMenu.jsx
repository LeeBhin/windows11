import { useDesktopStore } from '../../store/useDesktopStore'
import { useAnimatedPanel } from '../../hooks/useAnimatedPanel'

const pinnedApps = [
  { id: 'edge',     name: 'Edge',    icon: '🌐' },
  { id: 'word',     name: 'Word',    icon: '📘' },
  { id: 'excel',    name: 'Excel',   icon: '📗' },
  { id: 'settings', name: '설정',   icon: '⚙️' },
  { id: 'store',    name: 'Store',   icon: '🛍️' },
  { id: 'photos',   name: '사진',   icon: '🖼️' },
  { id: 'calc',     name: '계산기', icon: '🧮' },
  { id: 'notepad',  name: '메모장', icon: '📝' },
  { id: 'mail',     name: '메일',   icon: '📧' },
  { id: 'maps',     name: '지도',   icon: '🗺️' },
  { id: 'music',    name: '음악',   icon: '🎵' },
  { id: 'clock',    name: '알람',   icon: '⏰' },
  { id: 'teams',    name: 'Teams',   icon: '👥' },
  { id: 'news',     name: '뉴스',   icon: '📰' },
  { id: 'paint',    name: 'Paint',   icon: '🎨' },
  { id: 'terminal', name: '터미널', icon: '🖥️' },
]

const recommended = [
  { name: '최근 문서.docx',    icon: '📄', time: '방금' },
  { name: '프로젝트.xlsx',     icon: '📊', time: '1시간 전' },
  { name: '사진_2024.jpg',     icon: '🖼️', time: '어제' },
  { name: '메모.txt',          icon: '📝', time: '2일 전' },
  { name: '프레젠테이션.pptx', icon: '📑', time: '3일 전' },
  { name: '보고서.pdf',        icon: '📕', time: '일주일 전' },
]

export default function StartMenu() {
  const isOpen = useDesktopStore((s) => s.panels.startMenu)
  const phase  = useAnimatedPanel(isOpen)

  const animStyle = (() => {
    const TX = (y) => `translateX(-50%) translateY(${y})`
    const EASE_OUT = 'transform 0.2s ease'
    const EASE_IN  = 'transform 0.2s cubic-bezier(0.88, 0, 0.88, 1)'
    if (phase === 'closed')   return { transform: TX('calc(100% + 60px)'), transition: 'none',    pointerEvents: 'none' }
    if (phase === 'open')     return { transform: TX('0'),                 transition: 'none',    pointerEvents: 'auto' }
    if (phase === 'entering') return { transform: TX('0'),                 transition: EASE_OUT,  pointerEvents: 'auto' }
    return                           { transform: TX('calc(100% + 60px)'), transition: EASE_IN,   pointerEvents: 'none' }
  })()

  return (
    <div
      className="fixed left-1/2 rounded-xl shadow-2xl overflow-hidden"
      style={{
        bottom: '52px',
        width: '660px',
        background: 'rgba(243,243,243,0.97)',
        backdropFilter: 'blur(40px)',
        border: '1px solid rgba(0,0,0,0.07)',
        zIndex: 50,
        ...animStyle,
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* 검색 바 */}
      <div className="px-6 pt-5 pb-4">
        <div
          className="flex items-center gap-3 rounded-full px-4 py-2.5"
          style={{
            background: 'rgba(255,255,255,0.9)',
            border: '1px solid rgba(0,0,0,0.1)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className="bg-transparent text-sm outline-none flex-1"
            style={{ color: '#1a1a1a' }}
            placeholder="앱, 설정, 파일 검색"
          />
        </div>
      </div>

      {/* 고정됨 */}
      <div className="px-6 pb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-800">고정됨</span>
          <button className="text-xs text-gray-500 px-3 py-1 rounded-full hover:bg-black/[0.06] transition-colors">
            모두 앱 ›
          </button>
        </div>
        <div className="grid grid-cols-8 gap-0.5">
          {pinnedApps.map((app) => (
            <button
              key={app.id}
              className="flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl transition-colors hover:bg-black/[0.06]"
            >
              <span className="text-2xl leading-none">{app.icon}</span>
              <span className="text-[11px] text-gray-700 text-center leading-tight mt-0.5">{app.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 구분선 */}
      <div className="mx-6 border-t border-black/[0.06] my-1" />

      {/* 추천 */}
      <div className="px-6 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-800">추천</span>
          <button className="text-xs text-gray-500 px-3 py-1 rounded-full hover:bg-black/[0.06] transition-colors">
            자세히 ›
          </button>
        </div>
        <div className="grid grid-cols-3 gap-0.5">
          {recommended.map((item) => (
            <button
              key={item.name}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/[0.06] transition-colors text-left"
            >
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              <div className="min-w-0">
                <p className="text-xs text-gray-800 truncate font-medium leading-tight">{item.name}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{item.time}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 하단 바 */}
      <div
        className="flex items-center justify-between px-5 py-2.5"
        style={{ background: 'rgba(0,0,0,0.04)', borderTop: '1px solid rgba(0,0,0,0.06)' }}
      >
        <button className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-black/[0.07] transition-colors">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">U</div>
          <span className="text-sm text-gray-700 font-medium">사용자</span>
        </button>
        <button className="flex items-center justify-center w-8 h-8 rounded-xl hover:bg-black/[0.07] transition-colors">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(60,60,60,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18.36 6.64a9 9 0 1 1-12.73 0" /><line x1="12" y1="2" x2="12" y2="12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
