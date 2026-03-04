import { useDesktopStore } from '../../../store/useDesktopStore'
import TaskbarButton from '../TaskbarButton'
import taskViewIcon from '../../../assets/icons/task_view.png'

export default function TaskViewButton() {
  const isActive = useDesktopStore((s) => s.panels.taskView)
  const togglePanel = useDesktopStore((s) => s.togglePanel)

  return (
    <TaskbarButton
      onClick={(e) => { e.stopPropagation(); togglePanel('taskView') }}
      isActive={isActive}
      className="w-9.5 h-9.5"
      tooltip="작업 보기"
    >
      <img src={taskViewIcon} alt="작업 보기" width={24.5} height={24.5} draggable={false} />
    </TaskbarButton>
  )
}
