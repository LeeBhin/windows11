import { useDesktopStore } from '../../store/useDesktopStore'

export default function DesktopIcon({ id, name, icon }) {
  const selectedIconIds = useDesktopStore((s) => s.selectedIconIds)
  const tempSelectedIconIds = useDesktopStore((s) => s.tempSelectedIconIds)
  const selectIcon = useDesktopStore((s) => s.selectIcon)
  const closeAllPanels = useDesktopStore((s) => s.closeAllPanels)

  const isSelected = selectedIconIds.includes(id)
  const isTempSelected = tempSelectedIconIds.includes(id)
  const showSelected = isSelected || isTempSelected

  return (
    <div
      data-icon-id={id}
      className="group flex flex-col items-center p-[0.3px] gap-1 select-none w-18 relative"
      style={{
        cursor: 'default',
        borderRadius: '3px',
      }}
      onClick={(e) => {
        e.stopPropagation()
        closeAllPanels()
        selectIcon(id)
      }}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      {/* 선택 배경: 호버 시 숨김 */}
      {showSelected && (
        <div
          className="absolute inset-0 rounded-[3px] group-hover:opacity-0 pointer-events-none"
          style={{
            backgroundColor: 'rgba(250, 250, 250, 0.19)',
            border: '1px solid rgba(165, 190, 210, 0.5)',
          }}
        />
      )}
      {/* 호버 배경 */}
      <div
        className="absolute inset-0 rounded-[3px] opacity-0 group-hover:opacity-100 pointer-events-none"
        style={{
          backgroundColor: 'rgba(250, 250, 250, 0.15)',
          border: '1px solid rgba(165, 190, 210, 0.5)',
        }}
      />
      <img src={icon} alt={name} className="w-12 h-12 relative object-contain" draggable={false} />
      <span
        className="text-white text-[11px] text-center leading-tight"
        style={{ fontFamily: 'Dotum, 돋움, sans-serif'}}
      >
        {name.split('').map((char, i) => (
          <span
            key={i}
            style={{
              textShadow: '0 0.8px 2px rgb(0, 0, 0), 0 2px 3.5px rgb(0, 0, 0)',
            }}
          >
            {char}
          </span>
        ))}
      </span>
    </div>
  )
}
