import { useState } from 'react'
import { ChevronUp, ChevronDown, Play, ChevronRight, Settings } from 'lucide-react'
import { useDesktopStore } from '../../store/useDesktopStore'
import { useAnimatedPanel } from '../../hooks/useAnimatedPanel'

const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토']
const MONTH_NAMES = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']

function getCalendarDays(year, month) {
  const firstDow    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev  = new Date(year, month, 0).getDate()
  const days = []
  for (let i = firstDow - 1; i >= 0; i--)  days.push({ day: daysInPrev - i, type: 'prev' })
  for (let i = 1; i <= daysInMonth; i++)    days.push({ day: i, type: 'current' })
  const rem = 42 - days.length
  for (let i = 1; i <= rem; i++)            days.push({ day: i, type: 'next' })
  return days
}

const PANEL_STYLE = {
  background: 'rgba(240,240,240,0.97)',
  backdropFilter: 'blur(40px)',
  border: '1px solid rgba(0,0,0,0.07)',
  borderRadius: '10px',
  width: '360px',
  overflow: 'hidden',
}

export default function ClockPanel() {
  const isOpen = useDesktopStore((s) => s.panels.calendarPanel)
  const phase  = useAnimatedPanel(isOpen)
  const today  = new Date()
  const [viewYear,  setViewYear]  = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [focusMin,  setFocusMin]  = useState(30)

  const days = getCalendarDays(viewYear, viewMonth)
  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
  const isToday  = (d) => d.type === 'current' && `${viewYear}-${viewMonth}-${d.day}` === todayKey

  const dateLabel = today.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' })

  const prevMonth = () => viewMonth === 0  ? (setViewMonth(11), setViewYear(y => y-1)) : setViewMonth(m => m-1)
  const nextMonth = () => viewMonth === 11 ? (setViewMonth(0),  setViewYear(y => y+1)) : setViewMonth(m => m+1)

  const EASE_OUT = 'transform 0.2s ease'
  const EASE_IN  = 'transform 0.2s cubic-bezier(0.88, 0, 0.88, 1)'
  const animStyle = (() => {
    if (phase === 'closed')   return { transform: 'translateX(calc(100% + 20px))', transition: 'none',    pointerEvents: 'none' }
    if (phase === 'open')     return { transform: 'translateX(0)',                 transition: 'none',    pointerEvents: 'auto' }
    if (phase === 'entering') return { transform: 'translateX(0)',                 transition: EASE_OUT,  pointerEvents: 'auto' }
    return                           { transform: 'translateX(calc(100% + 20px))', transition: EASE_IN,   pointerEvents: 'none' }
  })()

  return (
    <div
      className="fixed flex flex-col gap-2"
      style={{
        bottom: '52px',
        right: '8px',
        zIndex: 50,
        ...animStyle,
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* ── 알림 패널 (위) ── */}
      <div style={PANEL_STYLE}>
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <span className="text-sm font-semibold text-gray-800">알림</span>
          <button className="text-gray-400 hover:text-gray-700 transition-colors">
            <Settings size={14} />
          </button>
        </div>
        <div
          className="mx-4 mb-4 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.6)', height: '110px' }}
        >
          <span className="text-gray-400 text-sm">새 알림 없음</span>
        </div>
      </div>

      {/* ── 달력 패널 (아래) ── */}
      <div style={PANEL_STYLE}>
        {/* 날짜 헤더 */}
        <div className="flex items-center justify-between px-4 pt-4 pb-1">
          <span className="text-sm font-medium text-gray-700">{dateLabel}</span>
          <ChevronRight size={14} color="#999" />
        </div>

        {/* 연/월 + 네비게이션 */}
        <div className="flex items-center justify-between px-4 pb-2">
          <span className="text-sm font-semibold text-gray-800">{viewYear}년 {MONTH_NAMES[viewMonth]}</span>
          <div className="flex gap-0.5">
            <button onClick={prevMonth} className="w-6 h-6 flex items-center justify-center rounded hover:bg-black/8 text-gray-500">
              <ChevronUp size={14} />
            </button>
            <button onClick={nextMonth} className="w-6 h-6 flex items-center justify-center rounded hover:bg-black/8 text-gray-500">
              <ChevronDown size={14} />
            </button>
          </div>
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 px-4">
          {WEEK_DAYS.map((w) => (
            <div key={w} className="text-center text-xs text-gray-400 py-1 font-medium">{w}</div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7 px-4 pb-2">
          {days.map((d, i) => (
            <button
              key={i}
              className="flex items-center justify-center h-8 rounded-full text-xs transition-colors hover:bg-black/8"
              style={{
                background: isToday(d) ? '#0078d4' : 'transparent',
                color: isToday(d) ? '#fff' : d.type !== 'current' ? '#c0c0c0' : '#1a1a1a',
                fontWeight: isToday(d) ? 600 : 400,
              }}
            >
              {d.day}
            </button>
          ))}
        </div>

        <div className="mx-4 border-t border-black/[0.06]" />

        {/* 집중 타이머 */}
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFocusMin(m => Math.max(5, m - 5))}
              className="w-7 h-7 rounded-full flex items-center justify-center text-gray-500 hover:bg-black/8 text-lg font-light leading-none"
            >−</button>
            <span className="text-sm font-medium text-gray-800 w-14 text-center">{focusMin} 분</span>
            <button
              onClick={() => setFocusMin(m => Math.min(120, m + 5))}
              className="w-7 h-7 rounded-full flex items-center justify-center text-gray-500 hover:bg-black/8 text-lg font-light leading-none"
            >+</button>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium text-white" style={{ background: '#0078d4' }}>
            <Play size={10} fill="white" />
            집중
          </button>
        </div>
      </div>
    </div>
  )
}
