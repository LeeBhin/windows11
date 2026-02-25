import { useDesktopStore } from '../../store/useDesktopStore'

export default function DesktopIcon({ id, name, icon }) {
  const selectedIconId = useDesktopStore((s) => s.selectedIconId)
  const selectIcon = useDesktopStore((s) => s.selectIcon)
  const closeAllPanels = useDesktopStore((s) => s.closeAllPanels)

  const isSelected = selectedIconId === id

  return (
    <div
      className="flex flex-col items-center gap-1 p-2 rounded-lg cursor-pointer select-none w-20"
      style={{
        background: isSelected ? 'rgba(255,255,255,0.2)' : 'transparent',
      }}
      onClick={(e) => {
        e.stopPropagation()
        closeAllPanels()
        selectIcon(id)
      }}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <span className="text-4xl drop-shadow-md">{icon}</span>
      <span
        className="text-white text-xs text-center leading-tight drop-shadow"
        style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
      >
        {name}
      </span>
    </div>
  )
}
