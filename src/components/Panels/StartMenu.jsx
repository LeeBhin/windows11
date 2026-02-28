import { useState, useEffect } from "react";
import { useDesktopStore } from "../../store/useDesktopStore";
import { useAnimatedPanel } from "../../hooks/useAnimatedPanel";

function calcMenuSize(screenW) {
  // 16인치(1707px) → 642×720 / 24인치(1920px) → 830×850
  const t = Math.max(0, Math.min(1, (screenW - 1707) / (1920 - 1707)));
  return {
    width: Math.round(642 + t * (833 - 642)),
    height: Math.round(720 + t * (860 - 720)),
  };
}72

const pinnedApps = [
  { id: "edge", name: "Edge", icon: "🌐" },
  { id: "word", name: "Word", icon: "📘" },
  { id: "excel", name: "Excel", icon: "📗" },
  { id: "powerpoint", name: "PowerPoint", icon: "📙" },
  { id: "copilot", name: "Microsoft 365 Copilot", icon: "🤖" },
  { id: "outlook", name: "Outlook", icon: "📬" },
  { id: "store", name: "Microsoft Store", icon: "🛍️" },
  { id: "photos", name: "Photos", icon: "🖼️" },
  { id: "settings", name: "설정", icon: "⚙️" },
  { id: "solitaire", name: "Solitaire & Casual Games", icon: "♠️" },
  { id: "disney", name: "Disney+", icon: "🏰" },
  { id: "whatsapp", name: "WhatsApp", icon: "📱" },
  { id: "messenger", name: "Messenger", icon: "💬" },
  { id: "calc", name: "Calculator", icon: "🧮" },
  { id: "clock", name: "Clock", icon: "🕐" },
  { id: "notepad", name: "Notepad", icon: "📝" },
];

const recommended = [
  { name: "uTable", icon: "📱", sub: "최근 추가 항목" },
  { name: "Claude", icon: "🤖", sub: "최근 추가 항목" },
  { name: "task_view", icon: "📋", sub: "3시간 전" },
  { name: "Recording 2026-02-26 011131", icon: "🎙️", sub: "21시간 전" },
  { name: "Screenshot 2026-02-26 0109...", icon: "📸", sub: "21시간 전" },
  { name: "start", icon: "🚀", sub: "22시간 전" },
];

const appCategories = [
  { name: "기타", icons: ["🌐", "📸", "♠️", "🎭"] },
  { name: "개발자 도구", icons: ["💻", "📄", "🔧", "🎨"] },
  { name: "유틸리티 및 도구", icons: ["👥", "⚙️", "📊", "🔒"] },
  { name: "생산성", icons: ["📁", "📝", "💬", "🏗️"] },
];

export default function StartMenu() {
  const isOpen = useDesktopStore((s) => s.panels.startMenu);
  const togglePanel = useDesktopStore((s) => s.togglePanel);
  const phase = useAnimatedPanel(isOpen);
  const [skipExit, setSkipExit] = useState(false);
  const [menuSize, setMenuSize] = useState(() =>
    calcMenuSize(window.innerWidth),
  );

  useEffect(() => {
    const update = () => setMenuSize(calcMenuSize(window.innerWidth));
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const handleSearchClick = () => {
    setSkipExit(true);
    useDesktopStore.setState({ _skipNextPanelAnim: true });
    togglePanel("searchPanel");
    setTimeout(() => setSkipExit(false), 400);
  };

  const animStyle = (() => {
    const TX = (y) => `translateX(-50%) translateY(${y})`;
    const EASE_OUT = "transform 0.2s ease";
    const EASE_IN = "transform 0.2s cubic-bezier(0.88, 0, 0.88, 1)";

    if (skipExit && (phase === "exiting" || phase === "closed")) {
      return {
        transform: TX("calc(100% + 60px)"),
        transition: "none",
        pointerEvents: "none",
      };
    }

    if (phase === "closed")
      return {
        transform: TX("calc(100% + 60px)"),
        transition: "none",
        pointerEvents: "none",
      };
    if (phase === "open")
      return { transform: TX("0"), transition: "none", pointerEvents: "auto" };
    if (phase === "entering")
      return {
        transform: TX("0"),
        transition: EASE_OUT,
        pointerEvents: "auto",
      };
    return {
      transform: TX("calc(100% + 60px)"),
      transition: EASE_IN,
      pointerEvents: "none",
    };
  })();

  return (
    <div
      className="fixed left-1/2 rounded-[8px]"
      style={{
        bottom: "58px",
        width: `${menuSize.width}px`,
        height: `${menuSize.height}px`,
        border: "1.5px solid rgba(89, 80, 80, 0.35)",
        boxShadow: "0 8px 14px -2px rgba(0,0,0,0.22)",
        zIndex: 50,
        ...animStyle,
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div
        className="rounded-[8px] overflow-hidden flex flex-col w-full h-full"
        style={{
          background: "rgba(243,243,243,0.97)",
          backdropFilter: "blur(40px)",
        }}
      >
        {/* 검색 바 */}
        <div className="px-7 pt-5 pb-3">
          <div
            className="flex items-center gap-3 rounded-full px-4 py-2 cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(0,0,0,0.08)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
            onClick={handleSearchClick}
          >
            <svg
              viewBox="0 0 292 300"
              width="15"
              height="15"
              className="flex-shrink-0"
            >
              {/* 파란 링 */}
              <path
                fill="#0071D1"
                fillRule="evenodd"
                d="M254 128A126 126 0 1 1 2 128A126 126 0 1 1 254 128ZM222 128A94 94 0 1 0 34 128A94 94 0 1 0 222 128Z"
              />
              {/* 녹색 arc — SearchButton 애니메이션 완료 상태 (243°, 160° span) */}
              <path
                fill="rgba(91,226,115,0.85)"
                d="M 69.9 14 A 128 128 0 0 1 221.6 215.3 L 195.3 190.7 A 92 92 0 0 0 86.2 46 Z"
              />
              {/* 파란 핸들 */}
              <g transform="rotate(45 206 206)">
                <rect
                  x="198"
                  y="207.5"
                  width="118"
                  height="37"
                  rx="18.5"
                  fill="#0071D1"
                />
              </g>
            </svg>
            <span className="text-[13px] text-gray-400 flex-1 select-none">
              앱, 설정 및 문서 검색
            </span>
          </div>
        </div>

        {/* 스크롤 가능한 콘텐츠 영역 */}
        <div
          className="flex-1 overflow-y-auto"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(0,0,0,0.12) transparent",
          }}
        >
          {/* 고정됨 */}
          <div className="px-7 pb-2">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[14px] font-semibold text-gray-800">
                고정됨
              </span>
              <button className="text-[12px] text-gray-500 px-2.5 py-0.5 rounded hover:bg-black/[0.06] transition-colors flex items-center gap-0.5">
                모두 표시
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-8 gap-y-1">
              {pinnedApps.map((app) => (
                <button
                  key={app.id}
                  className="flex flex-col items-center gap-1.5 py-3 px-1 rounded-lg transition-colors hover:bg-black/[0.05]"
                >
                  <span className="text-[30px] leading-none">{app.icon}</span>
                  <span
                    className="text-[11px] text-gray-600 text-center leading-tight w-full"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {app.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 구분선 */}
          <div className="mx-7 border-t border-black/[0.05] my-2" />

          {/* 맞춤 */}
          <div className="px-7 py-2">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[14px] font-semibold text-gray-800">
                맞춤
              </span>
              <button className="text-[12px] text-gray-500 px-2.5 py-0.5 rounded hover:bg-black/[0.06] transition-colors flex items-center gap-0.5">
                모두 표시
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-3 gap-x-1 gap-y-0.5">
              {recommended.map((item) => (
                <button
                  key={item.name}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-black/[0.05] transition-colors text-left"
                >
                  <span className="text-[22px] flex-shrink-0">{item.icon}</span>
                  <div className="min-w-0">
                    <p className="text-[12px] text-gray-800 truncate font-medium leading-tight">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {item.sub}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 구분선 */}
          <div className="mx-7 border-t border-black/[0.05] my-2" />

          {/* 모두 */}
          <div className="px-7 py-2 pb-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-semibold text-gray-800">
                모두
              </span>
              <button className="text-[12px] text-gray-500 px-2.5 py-0.5 rounded hover:bg-black/[0.06] transition-colors flex items-center gap-1">
                보기: 범주
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {appCategories.map((cat) => (
                <button
                  key={cat.name}
                  className="rounded-xl p-4 hover:bg-white/90 transition-colors text-center"
                  style={{
                    background: "rgba(255,255,255,0.55)",
                    border: "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  <div className="grid grid-cols-2 gap-2 mb-2.5 justify-items-center">
                    {cat.icons.map((icon, i) => (
                      <span key={i} className="text-[20px] leading-none">
                        {icon}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-gray-600 font-medium truncate">
                    {cat.name}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 하단 바 */}
        <div
          className="flex items-center justify-between px-7 py-3"
          style={{
            background: "rgba(0,0,0,0.025)",
            borderTop: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <button className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-black/[0.06] transition-colors">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(60,60,60,0.65)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="text-[13px] text-gray-700 font-medium">이빈</span>
          </button>
          <button className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-black/[0.06] transition-colors">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(60,60,60,0.65)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
              <line x1="12" y1="2" x2="12" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
