import { useDesktopStore } from '../../../store/useDesktopStore'
import TaskbarButton from '../TaskbarButton'

export default function TaskbarIconButton({ id, icon, tooltip }) {
  const isActive = useDesktopStore((s) => s.panels[id])
  const togglePanel = useDesktopStore((s) => s.togglePanel)

  return (
    <TaskbarButton
      onClick={(e) => { e.stopPropagation(); togglePanel(id) }}
      isActive={isActive}
      className="w-9.5 h-9.5"
      tooltip={tooltip}
    >
      <img src={icon} alt={tooltip} width={24.5} height={24.5} draggable={false} />
    </TaskbarButton>
  )
}
