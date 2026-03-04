import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDesktopStore } from '../../store/useDesktopStore'
import wallpaper from '../../assets/wallpapers/wallpaper_light.jpg'

export default function TaskView() {
  const isOpen = useDesktopStore((s) => s.panels.taskView)
  const closeAllPanels = useDesktopStore((s) => s.closeAllPanels)
  const [desktops, setDesktops] = useState([{ id: 1, name: '데스크톱 1' }])
  const nextIdRef = useRef(2)
  const mountedRef = useRef(false)

  useEffect(() => {
    mountedRef.current = true
  }, [])

  const addDesktop = (e) => {
    e.stopPropagation()
    const newId = nextIdRef.current++
    setDesktops((prev) => [
      ...prev,
      { id: newId, name: `데스크톱 ${prev.length + 1}` },
    ])
  }

  const removeDesktop = (e, id) => {
    e.stopPropagation()
    if (desktops.length <= 1) return
    setDesktops((prev) => {
      const filtered = prev.filter((d) => d.id !== id)
      return filtered.map((d, i) => ({ ...d, name: `데스크톱 ${i + 1}` }))
    })
  }

  return (
    <div
      className="fixed inset-0 flex flex-col"
      style={{
        zIndex: 65,
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none',
        transition: 'opacity 0.25s ease',
      }}
      onClick={closeAllPanels}
    >
      {/* Blurred wallpaper background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${wallpaper})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 53%',
          filter: 'blur(40px) brightness(0.65)',
          transform: 'scale(1.15)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.15)' }}
      />

      {/* Empty space (no windows) */}
      <div className="flex-1" />

      {/* Bottom desktop bar */}
      <div
        className="relative flex items-center justify-center"
        style={{ paddingBottom: '32px', paddingTop: '16px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-start"
          style={{ gap: '20px', overflow: 'visible' }}
        >
          <AnimatePresence mode="popLayout">
            {desktops.map((desktop) => (
              <motion.div
                key={desktop.id}
                layout
                initial={
                  mountedRef.current
                    ? { y: -50, opacity: 0, scale: 0.92 }
                    : false
                }
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                  transition: { duration: 0.2 },
                }}
                transition={{
                  layout: { duration: 0.35, ease: [0.25, 1, 0.5, 1] },
                  y: { duration: 0.35, ease: [0.25, 1, 0.5, 1] },
                  opacity: { duration: 0.25 },
                  scale: { duration: 0.3 },
                }}
                className="flex flex-col items-center gap-2 cursor-pointer group"
              >
                <span className="text-white/80 text-[13px] font-medium">
                  {desktop.name}
                </span>
                <div
                  className="rounded-[6px] overflow-hidden relative"
                  style={{
                    width: '160px',
                    height: '100px',
                    border: '2px solid rgba(255,255,255,0.15)',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
                  }}
                >
                  <img
                    src={wallpaper}
                    alt={desktop.name}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                  {/* Hover highlight */}
                  <div className="absolute inset-0 rounded-[4px] border-2 border-transparent group-hover:border-white/50 transition-colors" />
                  {/* Close button */}
                  {desktops.length > 1 && (
                    <button
                      className="absolute -top-[7px] -right-[7px] w-[18px] h-[18px] rounded-full text-white/80 text-[9px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-500/90"
                      style={{ background: 'rgba(60,60,60,0.85)' }}
                      onClick={(e) => removeDesktop(e, desktop.id)}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* 새 데스크톱 button */}
          <motion.div
            layout
            transition={{
              layout: { duration: 0.35, ease: [0.25, 1, 0.5, 1] },
            }}
            className="flex flex-col items-center gap-2 cursor-pointer group"
            onClick={addDesktop}
          >
            <span className="text-white/80 text-[13px] font-medium">
              새 데스크톱
            </span>
            <div
              className="rounded-[6px] flex items-center justify-center transition-all group-hover:bg-white/15"
              style={{
                width: '160px',
                height: '100px',
                background: 'rgba(255,255,255,0.08)',
                border: '2px dashed rgba(255,255,255,0.2)',
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
