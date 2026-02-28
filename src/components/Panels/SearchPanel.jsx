import { useState, useEffect } from "react";
import { useDesktopStore } from "../../store/useDesktopStore";
import { useAnimatedPanel } from "../../hooks/useAnimatedPanel";

const recentApps = [
  { id: "utable", name: "uTable", icon: "📱" },
  { id: "kakao", name: "카카오톡", icon: "💬" },
];

const quickTags = [
  "포커스 설정",
  "소리 설정",
  "Bluetooth 및 장치",
  "디스플레이 설정",
  "색 설정",
  "검색 설정",
];

const topApps = [
  { id: "gamebar", name: "Game Bar", icon: "🎮" },
  { id: "whale", name: "네이버 웨일", icon: "🌊" },
  { id: "explorer", name: "파일 탐색기", icon: "📁" },
  { id: "vscode", name: "Visual Studio Code", icon: "💻" },
  { id: "discord", name: "Discord", icon: "💬" },
  { id: "snipping", name: "Snipping Tool", icon: "✂️" },
];

function calcPanelSize(screenW) {
  const t = Math.max(0, Math.min(1, (screenW - 1707) / (1920 - 1707)));
  return {
    width: Math.round(777 + t * (833 - 777)),
    height: Math.round(725 + t * (860 - 725)),
  };
}

export default function SearchPanel() {
  const isOpen = useDesktopStore((s) => s.panels.searchPanel);
  const skipAnim = useDesktopStore((s) => s._skipNextPanelAnim);
  const phase = useAnimatedPanel(isOpen);
  const [query, setQuery] = useState("");
  const [panelSize, setPanelSize] = useState(() =>
    calcPanelSize(window.innerWidth),
  );

  useEffect(() => {
    const update = () => setPanelSize(calcPanelSize(window.innerWidth));
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (skipAnim && phase === "open") {
      useDesktopStore.setState({ _skipNextPanelAnim: false });
    }
  }, [skipAnim, phase]);

  const animStyle = (() => {
    const TX = (y) => `translateX(-50%) translateY(${y})`;
    const EASE_OUT = "transform 0.2s ease";
    const EASE_IN = "transform 0.2s cubic-bezier(0.88, 0, 0.88, 1)";

    if (skipAnim && (phase === "entering" || phase === "open")) {
      return { transform: TX("0"), transition: "none", pointerEvents: "auto" };
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
        width: `${panelSize.width}px`,
        height: `${panelSize.height}px`,
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
          background: "rgba(244,243,240,0.97)",
          backdropFilter: "blur(40px)",
        }}
      >
        {/* 검색 바 */}
        <div className="px-6 pt-5 pb-3">
          <div
            className="flex items-center gap-3 rounded-full px-4 py-2"
            style={{
              background: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(0,0,0,0.08)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <svg
              viewBox="0 0 292 300"
              width="15"
              height="15"
              className="flex-shrink-0"
            >
              <path
                fill="#0078D4"
                fillRule="evenodd"
                d="M254 128A126 126 0 1 1 2 128A126 126 0 1 1 254 128ZM222 128A94 94 0 1 0 34 128A94 94 0 1 0 222 128Z"
              />
              <g transform="rotate(45 206 206)">
                <rect
                  x="198"
                  y="207.5"
                  width="118"
                  height="37"
                  rx="18.5"
                  fill="#0078D4"
                />
              </g>
            </svg>
            <input
              className="bg-transparent text-[13px] outline-none flex-1"
              style={{ color: "#1a1a1a" }}
              placeholder="검색"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-gray-400 hover:text-gray-700 transition-colors"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* 두 컬럼 본문 */}
        <div className="flex flex-1 overflow-hidden">
          {/* 왼쪽: 최근 */}
          <div
            className="pb-4 pl-6 pr-3 flex-shrink-0"
            style={{ width: "210px" }}
          >
            <p className="text-[13px] font-semibold text-gray-700 px-2 py-2">
              최근
            </p>
            <div className="flex flex-col gap-0.5">
              {recentApps.map((app) => (
                <button
                  key={app.id}
                  className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-black/[0.05] transition-colors text-left w-full"
                >
                  <span className="text-[22px] flex-shrink-0 w-7 text-center">
                    {app.icon}
                  </span>
                  <span className="text-[13px] text-gray-800">{app.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 오른쪽: 빠른 검색 + 최고의 앱 */}
          <div className="flex-1 px-5 pb-4 border-l border-black/[0.05]">
            {/* 빠른 검색 헤더 */}
            <div className="flex items-center justify-between py-2 mb-2">
              <p className="text-[13px] font-semibold text-gray-700">
                빠른 검색
              </p>
              <div className="flex items-center gap-2">
                <span
                  className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                  style={{ background: "#0078D4" }}
                >
                  B
                </span>
                <button className="w-[22px] h-[22px] rounded-full hover:bg-black/[0.06] flex items-center justify-center text-gray-400 text-[11px] font-bold">
                  ···
                </button>
              </div>
            </div>

            {/* 빠른 검색 태그 */}
            <div
              className="rounded-xl p-3.5 mb-5"
              style={{
                background: "rgba(255,255,255,0.5)",
                border: "1px solid rgba(0,0,0,0.04)",
              }}
            >
              <div className="flex flex-wrap gap-2">
                {quickTags.map((tag) => (
                  <button
                    key={tag}
                    className="px-3 py-1.5 text-[12px] rounded-full hover:bg-white transition-colors"
                    style={{
                      background: "rgba(255,255,255,0.8)",
                      border: "1px solid rgba(0,0,0,0.1)",
                      color: "#333",
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* 최고의 앱 */}
            <p className="text-[13px] font-semibold text-gray-700 mb-3">
              최고의 앱
            </p>
            <div className="grid grid-cols-3 gap-3">
              {topApps.map((app) => (
                <button
                  key={app.id}
                  className="flex flex-col items-center justify-center gap-2.5 py-5 px-3 rounded-xl hover:bg-white/90 transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.5)",
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  <span className="text-[34px] leading-none">{app.icon}</span>
                  <span className="text-[12px] text-gray-700 text-center leading-tight w-full truncate">
                    {app.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
