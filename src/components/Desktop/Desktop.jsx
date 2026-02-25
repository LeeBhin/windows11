import { useDesktopStore } from '../../store/useDesktopStore'
import DesktopBackground from './DesktopBackground'
import DesktopIcon from './DesktopIcon'

export default function Desktop() {
  const icons = useDesktopStore((s) => s.icons)
  const closeAllPanels = useDesktopStore((s) => s.closeAllPanels)
  const selectIcon = useDesktopStore((s) => s.selectIcon)

  return (
    <div
      className="relative flex-1 overflow-hidden"
      onClick={() => {
        closeAllPanels()
        selectIcon(null)
      }}
    >
      <DesktopBackground />
      <div className="flex flex-col flex-wrap gap-1 p-3 h-full content-start">
        {icons.map((icon) => (
          <DesktopIcon key={icon.id} {...icon} />
        ))}
      </div>
    </div>
  )
}
