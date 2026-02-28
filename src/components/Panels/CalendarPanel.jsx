import { useState } from 'react'
import { ChevronUp, ChevronDown, Play, ChevronRight } from 'lucide-react'
import { useDesktopStore } from '../../store/useDesktopStore'

const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토']
const MONTH_NAMES = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']

function getCalendarDays(year, month) {
  const firstDow = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev = new Date(year, month, 0).getDate()
  const days = []

  for (let i = firstDow - 1; i >= 0; i--)
    days.push({ day: daysInPrev - i, type: 'prev' })
  for (let i = 1; i <= daysInMonth; i++)
    days.push({ day: i, type: 'current' })
  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++)
    days.push({ day: i, type: 'next' })

  return days
}

export default function CalendarPanel() {
  const isOpen = useDesktopStore((s) => s.panels.calendarPanel)
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [focusMin, setFocusMin] = useState(30)

  const days = getCalendarDays(viewYear, viewMonth)
  const todayStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
  const isToday = (d) =>
    d.type === 'current' && `${viewYear}-${viewMonth}-${d.day}` === todayStr

  const dateLabel = today.toLocaleDateString('ko-KR', {
    month: 'long', day: 'numeric', weekday: 'long',
  })

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1) }
    else setViewMonth((m) => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1) }
    else setViewMonth((m) => m + 1)
  }

  return (
    <div
      className="fixed rounded-[8px] shadow-2xl overflow-hidden transition-all duration-150"
      style={{
        bottom: '52px',
        right: '8px',
        width: '360px',
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
      {/* 날짜 헤더 */}
      <div className="px-4 pt-4 pb-1 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{dateLabel}</span>
        <ChevronRight size={14} className="text-gray-400" />
      </div>

      {/* 연/월 헤더 */}
      <div className="px-4 pb-1 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-800">
          {viewYear}년 {MONTH_NAMES[viewMonth]}
        </span>
        <div className="flex gap-1">
          <button onClick={prevMonth} className="w-6 h-6 flex items-center justify-center rounded hover:bg-black/8 transition-colors text-gray-500">
            <ChevronUp size={14} />
          </button>
          <button onClick={nextMonth} className="w-6 h-6 flex items-center justify-center rounded hover:bg-black/8 transition-colors text-gray-500">
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* 요일 헤더 */}
      <div className="px-4 grid grid-cols-7 mb-0.5">
        {WEEK_DAYS.map((w) => (
          <div key={w} className="text-center text-xs text-gray-400 py-1">{w}</div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="px-4 pb-2 grid grid-cols-7">
        {days.map((d, i) => (
          <button
            key={i}
            className="flex items-center justify-center h-8 rounded-full text-xs transition-colors hover:bg-black/8"
            style={{
              background: isToday(d) ? '#0078d4' : 'transparent',
              color: isToday(d) ? '#fff' : d.type !== 'current' ? '#bbb' : '#1a1a1a',
            }}
          >
            {d.day}
          </button>
        ))}
      </div>

      <div className="mx-4 border-t border-black/8" />

      {/* 집중 타이머 */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFocusMin((m) => Math.max(5, m - 5))}
            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-600 hover:bg-black/8 transition-colors text-lg font-light"
          >−</button>
          <span className="text-sm font-medium text-gray-800 w-12 text-center">{focusMin} 분</span>
          <button
            onClick={() => setFocusMin((m) => Math.min(120, m + 5))}
            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-600 hover:bg-black/8 transition-colors text-lg font-light"
          >+</button>
        </div>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white"
          style={{ background: '#0078d4' }}
        >
          <Play size={10} fill="white" />
          집중
        </button>
      </div>
    </div>
  )
}
