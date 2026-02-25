import { useClock } from '../../../hooks/useClock'
import { useDesktopStore } from '../../../store/useDesktopStore'
import TaskbarButton from '../TaskbarButton'

export default function ClockWidget() {
  const { time, date, tooltipLine1, tooltipLine2 } = useClock()
  const toggleCalendarView = useDesktopStore((s) => s.toggleCalendarView)

  const clockTooltip = (
    <div className="flex flex-col">
      <span>{tooltipLine1}</span>
      <span className="mt-2">{tooltipLine2}</span>
    </div>
  )

  return (
    <TaskbarButton
      onClick={(e) => { e.stopPropagation(); toggleCalendarView() }}
      className="pr-2 pl-2.5 h-9"
      tooltip={clockTooltip}
    >
      <div className="flex flex-col items-end justify-center gap-[6px]">
        <span className="text-[11.5px] font-medium leading-none" style={{ color: 'rgba(30,30,30,0.9)' }}>{time}</span>
        <span className="text-[11.5px] leading-none" style={{ color: 'rgba(30,30,30,0.9)', transform: 'scaleY(0.92)' }}>{date}</span>
      </div>
    </TaskbarButton>
  )
}
