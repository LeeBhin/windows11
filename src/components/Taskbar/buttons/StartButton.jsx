import { useDesktopStore } from '../../../store/useDesktopStore'
import TaskbarButton from '../TaskbarButton'
import startIcon from '../../../assets/icons/start.png'

export default function StartButton() {
  const isActive = useDesktopStore((s) => s.panels.startMenu)
  const togglePanel = useDesktopStore((s) => s.togglePanel)

  return (
    <TaskbarButton
      onClick={(e) => { e.stopPropagation(); togglePanel('startMenu') }}
      isActive={isActive}
      className="w-9.5 h-9.5"
      tooltip="시작"
    >
      <img src={startIcon} alt="시작" width={24.5} height={24.5} draggable={false} />
    </TaskbarButton>
  )
}
