import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const PANEL_SHADOW = "0 8px 14px -2px rgba(0,0,0,0.22)";

export function panelBorder(opacity = 0.35) {
  return `1.5px solid rgba(89, 80, 80, ${opacity})`;
}

/** 정적 패널 서피스 (툴팁 등 애니메이션 없는 패널용) */
export function PanelSurface({ children, borderOpacity = 0.35, className = "", style = {} }) {
  return (
    <div
      className={`rounded-[8px] overflow-hidden ${className}`}
      style={{
        border: panelBorder(borderOpacity),
        boxShadow: PANEL_SHADOW,
        backdropFilter: "blur(50px)",
        backgroundColor: "#f0f7fce7",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/**
 * 슬라이딩 패널 셸 (StartMenu, SearchPanel 등)
 *
 * Props:
 *   isOpen         — 열림/닫힘 상태
 *   skipTransition — true 이면 애니메이션 즉시 (duration 0)
 *   width, height  — 픽셀 크기
 *   bottom         — CSS bottom 값 (기본 "58px")
 *   borderOpacity  — 테두리 opacity (기본 0.35, 태스크바 버튼은 0.05)
 *   onMouseDown    — motion.div 의 onMouseDown 핸들러
 */
export default function PanelShell({
  children,
  isOpen,
  skipTransition = false,
  width,
  height,
  bottom = "58px",
  borderOpacity = 0.35,
  onMouseDown,
}) {
  const [backdropReady, setBackdropReady] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setBackdropReady(false);
      return;
    }
    const delay = skipTransition ? 0 : 100;
    const t = setTimeout(() => setBackdropReady(true), delay);
    return () => clearTimeout(t);
  }, [isOpen, skipTransition]);

  const transition = skipTransition
    ? { duration: 0 }
    : isOpen
      ? { type: "tween", duration: 0.18, ease: [0.1, 0.9, 0.2, 1] }
      : { type: "tween", duration: 0.18, ease: [0.7, 0, 1, 0.5] };

  return (
    <motion.div
      className="fixed left-1/2 rounded-[8px]"
      style={{
        bottom,
        width: `${width}px`,
        height: `${height}px`,
        border: panelBorder(borderOpacity),
        boxShadow: PANEL_SHADOW,
        zIndex: 50,
        x: "-50%",
        pointerEvents: isOpen ? "auto" : "none",
      }}
      initial={false}
      animate={{ y: isOpen ? 0 : height + 60 }}
      transition={transition}
      onMouseDown={onMouseDown}
    >
      <div
        className="rounded-[8px] overflow-hidden flex flex-col w-full h-full"
        style={{
          backdropFilter: backdropReady ? "blur(50px)" : "blur(0px)",
          backgroundColor: backdropReady ? "#f0f7fce7" : "#D8E7FF",
          transition: "backdrop-filter 0.15s, background-color 0.15s",
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}
