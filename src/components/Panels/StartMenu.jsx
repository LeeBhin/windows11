import { useState, useEffect, useRef } from "react";
import { useDesktopStore } from "../../store/useDesktopStore";
import { useAnimatedPanel } from "../../hooks/useAnimatedPanel";
import SearchInput from "./SearchInput";

const appIcon = (name) =>
  new URL(`../../assets/icons/applications/${name}.ico`, import.meta.url).href;

function calcMenuSize(screenW, screenH) {
  const t = Math.max(0, Math.min(1, (screenW - 1707) / (1920 - 1707)));
  const baseW = 642 + t * (833 - 642);
  const baseH = 790 + t * (930 - 790);
  const wFactor = screenW < 1707 ? screenW / 1707 : screenW > 1920 ? screenW / 1920 : 1;
  const hFactor = Math.max(0.7, Math.min(1.25, screenH / 1080));
  return {
    width: Math.max(380, Math.min(1100, Math.round(baseW * wFactor))),
    height: Math.max(520, Math.min(960, Math.round(baseH * hFactor))),
  };
}

const pinnedApps = [
  { id: "edge", name: "Edge", icon: "edge" },
  { id: "word", name: "Word", icon: "word" },
  { id: "excel", name: "Excel", icon: "excel" },
  { id: "powerpoint", name: "PowerPoint", icon: "powerpoint" },
  { id: "copilot", name: "Copilot", icon: "assist" },
  { id: "outlook", name: "Outlook", icon: "outlook" },
  { id: "store", name: "Microsoft Store", icon: "store" },
  { id: "photos", name: "Photos", icon: "photos" },
  { id: "settings", name: "설정", icon: "settings" },
  { id: "solitaire", name: "Solitaire", icon: "solitaire" },
  { id: "movies", name: "Movies & TV", icon: "movies" },
  { id: "skype", name: "Skype", icon: "skype" },
  { id: "teams", name: "Teams", icon: "teams" },
  { id: "calc", name: "Calculator", icon: "calculator" },
  { id: "clock", name: "Alarm & Clock", icon: "alarm" },
  { id: "notepad", name: "Notepad", icon: "notepad" },
];

const recommended = [
  { name: "Snipping Tool", icon: "snippingtool", sub: "최근 추가 항목" },
  { name: "Cortana", icon: "cortana", sub: "최근 추가 항목" },
  { name: "Task View", icon: "taskview", sub: "3시간 전" },
  { name: "Voice Recorder", icon: "voice", sub: "21시간 전" },
  { name: "Snip & Sketch", icon: "snipandsketch", sub: "21시간 전" },
  { name: "Start", icon: "start", sub: "22시간 전" },
];

const appCategories = [
  { name: "기타", icons: ["edge", "photos", "solitaire", "movies"] },
  { name: "개발자 도구", icons: ["terminal", "notepad", "visualcode", "visualstudio"] },
  { name: "유틸리티 및 도구", icons: ["people", "settings", "tasks", "protection"] },
  { name: "생산성", icons: ["onedrive", "stickynotes", "teams", "project"] },
];

export default function StartMenu() {
  const isOpen = useDesktopStore((s) => s.panels.startMenu);
  const togglePanel = useDesktopStore((s) => s.togglePanel);
  const phase = useAnimatedPanel(isOpen, 280, 220);
  const [skipExit, setSkipExit] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [menuSize, setMenuSize] = useState(() =>
    calcMenuSize(window.innerWidth, window.innerHeight),
  );
  const inputRef = useRef(null);
  const justOpenedRef = useRef(false);

  useEffect(() => {
    const update = () => setMenuSize(calcMenuSize(window.innerWidth, window.innerHeight));
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      justOpenedRef.current = false;
      inputRef.current?.blur();
      return;
    }
    justOpenedRef.current = true;
    const t = setTimeout(() => inputRef.current?.focus(), 120);
    return () => clearTimeout(t);
  }, [isOpen]);

  const openSearchPanel = () => {
    setSkipExit(true);
    useDesktopStore.setState({ _skipNextPanelAnim: true });
    togglePanel("searchPanel");
    setTimeout(() => setSkipExit(false), 400);
  };

  const handleInputFocus = () => {
    if (justOpenedRef.current) {
      justOpenedRef.current = false;
      setInputFocused(true);
      return;
    }
    openSearchPanel();
  };

  // 이미 포커싱 상태에서 클릭 시 SearchPanel로 전환
  const handleInputClick = () => {
    if (inputFocused) openSearchPanel();
  };

  const handleInputBlur = () => setInputFocused(false);

  const handleKeyDown = (e) => {
    if (e.key.length === 1) {
      e.preventDefault();
      useDesktopStore.setState({ _skipNextPanelAnim: true });
      togglePanel("searchPanel");
    }
  };

  const animStyle = (() => {
    const TX = (y) => `translateX(-50%) translateY(${y})`;
    const EASE_OPEN = "transform 0.23s cubic-bezier(0.1, 0.9, 0.2, 1)";
    const EASE_CLOSE = "transform 0.15s cubic-bezier(0.7, 0, 1, 0.5)";

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
        transition: EASE_OPEN,
        pointerEvents: "none",
      };
    if (phase === "open")
      return { transform: TX("0"), transition: EASE_CLOSE, pointerEvents: "auto" };
    if (phase === "entering")
      return {
        transform: TX("0"),
        transition: EASE_OPEN,
        pointerEvents: "auto",
      };
    return {
      transform: TX("calc(100% + 60px)"),
      transition: EASE_CLOSE,
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
        willChange: "transform",
        ...animStyle,
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div
        className="rounded-[8px] overflow-hidden flex flex-col w-full h-full"
        style={{
          backdropFilter: 'blur(50px)',
          backgroundColor: '#f0f7fce7',
        }}
      >
        {/* 검색 바 */}
        <div className="px-7 pt-5 pb-3" onClick={handleInputClick}>
          <SearchInput
            placeholder="앱, 설정 및 문서 검색"
            isFocused={inputFocused}
            inputRef={inputRef}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
          />
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
                  <img src={appIcon(app.icon)} className="w-[30px] h-[30px] object-contain" alt={app.name} />
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
                  <img src={appIcon(item.icon)} className="w-[22px] h-[22px] object-contain flex-shrink-0" alt={item.name} />
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
                      <img key={i} src={appIcon(icon)} className="w-[20px] h-[20px] object-contain" alt="" />
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
    </div >
  );
}
