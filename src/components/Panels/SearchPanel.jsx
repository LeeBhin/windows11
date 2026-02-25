import { useState } from 'react'
import { useDesktopStore } from '../../store/useDesktopStore'
import { useAnimatedPanel } from '../../hooks/useAnimatedPanel'

const recentApps = [
  { id: 'edge',     name: 'Microsoft Edge',    sub: '앱', icon: '🌐' },
  { id: 'vscode',   name: 'Visual Studio Code', sub: '앱', icon: '💻' },
  { id: 'chrome',   name: 'Google Chrome',     sub: '앱', icon: '🟡' },
  { id: 'settings', name: '설정',              sub: '앱', icon: '⚙️' },
  { id: 'notepad',  name: '메모장',            sub: '앱', icon: '📝' },
  { id: 'calc',     name: '계산기',            sub: '앱', icon: '🧮' },
  { id: 'photos',   name: '사진',              sub: '앱', icon: '🖼️' },
  { id: 'store',    name: 'Microsoft Store',   sub: '앱', icon: '🛍️' },
]

const quickTags = ['설정', '앱', '파일', '이미지', '웹', '음악']

const topApps = [
  { id: 'edge',    name: 'Edge',    icon: '🌐' },
  { id: 'chrome',  name: 'Chrome',  icon: '🟡' },
  { id: 'vscode',  name: 'VS Code', icon: '💻' },
  { id: 'word',    name: 'Word',    icon: '📘' },
  { id: 'excel',   name: 'Excel',   icon: '📗' },
  { id: 'discord', name: 'Discord', icon: '💬' },
]

export default function SearchPanel() {
  const isOpen = useDesktopStore((s) => s.panels.searchPanel)
  const phase  = useAnimatedPanel(isOpen)
  const [query, setQuery] = useState('')

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
        width: '680px',
        background: 'rgba(243,243,243,0.97)',
        backdropFilter: 'blur(40px)',
        border: '1px solid rgba(0,0,0,0.07)',
        zIndex: 50,
        ...animStyle,
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* 검색 바 */}
      <div className="px-5 pt-4 pb-3">
        <div
          className="flex items-center gap-3 rounded-full px-4 py-2.5"
          style={{
            background: 'rgba(255,255,255,0.9)',
            border: '1px solid rgba(0,0,0,0.1)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className="bg-transparent text-sm outline-none flex-1"
            style={{ color: '#1a1a1a' }}
            placeholder="검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-700 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* 두 컬럼 본문 */}
      <div className="flex" style={{ minHeight: '320px' }}>
        {/* 왼쪽: 최근 앱 목록 */}
        <div className="flex-1 px-3 pb-4 border-r border-black/[0.06]">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-2 py-2">최근</p>
          <div className="flex flex-col gap-0.5">
            {recentApps.map((app) => (
              <button
                key={app.id}
                className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-black/[0.06] transition-colors text-left w-full"
              >
                <span className="text-xl flex-shrink-0 w-7 text-center">{app.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-800 truncate leading-tight">{app.name}</p>
                  <p className="text-xs text-gray-400">{app.sub}</p>
                </div>
                <svg className="flex-shrink-0 text-gray-300" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* 오른쪽: 빠른 검색 + 최고의 앱 */}
        <div className="px-4 pb-4" style={{ width: '210px' }}>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-1 py-2">빠른 검색</p>
          <div className="flex flex-wrap gap-1.5 px-1 mb-4">
            {quickTags.map((tag) => (
              <button
                key={tag}
                className="px-2.5 py-1 text-xs rounded-full hover:bg-black/[0.06] transition-colors"
                style={{
                  background: 'rgba(255,255,255,0.85)',
                  border: '1px solid rgba(0,0,0,0.1)',
                  color: '#444',
                }}
              >
                {tag}
              </button>
            ))}
          </div>

          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-1 pb-2">최고의 앱</p>
          <div className="grid grid-cols-3 gap-1">
            {topApps.map((app) => (
              <button
                key={app.id}
                className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-black/[0.06] transition-colors"
              >
                <span className="text-xl leading-none">{app.icon}</span>
                <span className="text-[10px] text-gray-700 text-center leading-tight w-full truncate">{app.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
