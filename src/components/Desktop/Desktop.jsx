import { useRef, useState, useCallback } from 'react'
import { useDesktopStore } from '../../store/useDesktopStore'
import DesktopBackground from './DesktopBackground'
import DesktopIcon from './DesktopIcon'

function rectsIntersect(a, b) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
}

export default function Desktop() {
  const icons = useDesktopStore((s) => s.icons)
  const closeAllPanels = useDesktopStore((s) => s.closeAllPanels)
  const selectIcon = useDesktopStore((s) => s.selectIcon)
  const selectIcons = useDesktopStore((s) => s.selectIcons)
  const setTempSelectedIconIds = useDesktopStore((s) => s.setTempSelectedIconIds)

  const containerRef = useRef(null)
  const [dragRect, setDragRect] = useState(null)
  const dragStart = useRef(null)
  const isDragging = useRef(false)
  const wasDragging = useRef(false)

  const getSelectionRect = useCallback((startX, startY, currentX, currentY) => {
    return {
      left: Math.min(startX, currentX),
      top: Math.min(startY, currentY),
      right: Math.max(startX, currentX),
      bottom: Math.max(startY, currentY),
    }
  }, [])

  const getIntersectingIcons = useCallback((rect) => {
    if (!containerRef.current) return []
    const containerRect = containerRef.current.getBoundingClientRect()
    const hits = []
    const iconEls = containerRef.current.querySelectorAll('[data-icon-id]')
    iconEls.forEach((el) => {
      const r = el.getBoundingClientRect()
      const iconRect = {
        left: r.left - containerRect.left,
        top: r.top - containerRect.top,
        right: r.right - containerRect.left,
        bottom: r.bottom - containerRect.top,
      }
      if (rectsIntersect(rect, iconRect)) {
        hits.push(el.dataset.iconId)
      }
    })
    return hits
  }, [])

  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('[data-icon-id]')) return
    const containerRect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - containerRect.left
    const y = e.clientY - containerRect.top
    dragStart.current = { x, y }
    isDragging.current = false
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (!dragStart.current) return
    const containerRect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - containerRect.left
    const y = e.clientY - containerRect.top
    const dx = x - dragStart.current.x
    const dy = y - dragStart.current.y

    if (!isDragging.current && Math.abs(dx) < 4 && Math.abs(dy) < 4) return
    if (!isDragging.current) selectIcon(null)
    isDragging.current = true

    const rect = getSelectionRect(dragStart.current.x, dragStart.current.y, x, y)
    setDragRect(rect)

    const hits = getIntersectingIcons(rect)
    setTempSelectedIconIds(hits)
  }, [getSelectionRect, getIntersectingIcons, setTempSelectedIconIds, selectIcon])

  const handleMouseUp = useCallback(() => {
    if (isDragging.current) {
      const tempIds = useDesktopStore.getState().tempSelectedIconIds
      if (tempIds.length > 0) {
        selectIcons(tempIds)
      } else {
        selectIcon(null)
      }
      wasDragging.current = true
    }
    dragStart.current = null
    isDragging.current = false
    setDragRect(null)
    setTempSelectedIconIds([])
  }, [selectIcons, selectIcon, setTempSelectedIconIds])

  return (
    <div
      ref={containerRef}
      className="relative flex-1 overflow-hidden"
      onClick={() => {
        if (wasDragging.current) {
          wasDragging.current = false
          return
        }
        closeAllPanels()
        selectIcon(null)
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <DesktopBackground />
      <div className="flex flex-col flex-wrap gap-8 pt-1.5 h-full content-start">
        {icons.map((icon) => (
          <DesktopIcon key={icon.id} {...icon} />
        ))}
      </div>
      {/* 드래그 선택 오버레이 */}
      {dragRect && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: dragRect.left,
            top: dragRect.top,
            width: dragRect.right - dragRect.left,
            height: dragRect.bottom - dragRect.top,
            backgroundColor: 'rgba(11, 105, 182, 0.3)',
            border: '1px solid #1280da',
            zIndex: 50,
          }}
        />
      )}
    </div>
  )
}
