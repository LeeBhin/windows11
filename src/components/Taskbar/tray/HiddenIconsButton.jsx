import { HiOutlineChevronUp,HiOutlineChevronDown } from "react-icons/hi2";

import { useDesktopStore } from '../../../store/useDesktopStore'
import TaskbarButton from '../TaskbarButton'

export default function HiddenIconsButton() {
  const isActive = useDesktopStore((s) => s.panels.hiddenIcons)
  const togglePanel = useDesktopStore((s) => s.togglePanel)

  return (
    <TaskbarButton
      onClick={(e) => { e.stopPropagation(); togglePanel('hiddenIcons') }}
      isActive={isActive}
      className="w-8 h-9"
      tooltip="숨겨진 아이콘 표시"
    >
      {isActive
        ? <HiOutlineChevronDown size={15} color="rgba(20,20,20,0.9)" strokeWidth={2.8} />
        : <HiOutlineChevronUp size={15} color="rgba(20,20,20,0.9)" strokeWidth={2.8} />
      }
    </TaskbarButton>
  )
}
