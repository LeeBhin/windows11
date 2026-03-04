import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronUp, ChevronDown, ChevronRight } from "lucide-react";
import { useDesktopStore } from "../../store/useDesktopStore";
import SearchInput from "./SearchInput";

const viewModes = ["범주", "그리드", "간단히"];

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
  { id: "onedrive", name: "OneDrive", icon: "onedrive" },
  { id: "paint", name: "Paint", icon: "paint" },
  { id: "weather", name: "날씨", icon: "weather" },
  { id: "terminal", name: "Terminal", icon: "terminal" },
  { id: "cortana", name: "Cortana", icon: "cortana" },
  { id: "mail", name: "Mail", icon: "mail" },
  { id: "camera", name: "Camera", icon: "camera" },
  { id: "tips", name: "Tips", icon: "tips" },
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
  { name: "기타", icons: ["edge", "mail", "onenote", "outlook"] },
  { name: "개발자 도구", icons: ["visualcode", "terminal", "notepad", "visualstudio"] },
  { name: "유틸리티 및 도구", icons: ["snippingtool", "settings", "calculator", "tasks", "protection"] },
  { name: "생산성", icons: ["onedrive", "stickynotes", "teams", "project", "excel", "word"] },
  { name: "소셜", icons: ["skype", "cortana", "outlook", "teams"] },
  { name: "독창성", icons: ["photos", "camera", "paint", "snipandsketch", "movies", "voice"] },
  { name: "엔터테인먼트", icons: ["movies", "groove", "edge", "solitaire"] },
  { name: "게임", icons: ["solitaire", "gamebar", "store", "tips", "alarm", "maps"] },
];

export default function StartMenu() {
  const isOpen = useDesktopStore((s) => s.panels.startMenu);
  const togglePanel = useDesktopStore((s) => s.togglePanel);
  const [skipExit, setSkipExit] = useState(false);
  const [backdropReady, setBackdropReady] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [pinnedExpanded, setPinnedExpanded] = useState(false);
  const [viewMode, setViewMode] = useState("범주");
  const [viewDropdown, setViewDropdown] = useState(false);
  const viewBtnRef = useRef(null);
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
    if (!isOpen) { setBackdropReady(false); return; }
    const delay = skipExit ? 0 : 100;
    const t = setTimeout(() => setBackdropReady(true), delay);
    return () => clearTimeout(t);
  }, [isOpen, skipExit]);

  useEffect(() => {
    if (!isOpen) {
      justOpenedRef.current = false;
      inputRef.current?.blur();
      setInputFocused(false);
      return;
    }
    justOpenedRef.current = true;
    setInputFocused(true);
    const t = setTimeout(() => inputRef.current?.focus(), 120);
    return () => clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    if (!viewDropdown) return;
    const handle = (e) => {
      if (!viewBtnRef.current?.contains(e.target)) setViewDropdown(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [viewDropdown]);

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

  const transition = skipExit && !isOpen
    ? { duration: 0 }
    : isOpen
      ? { type: "tween", duration: 0.18, ease: [0.1, 0.9, 0.2, 1] }
      : { type: "tween", duration: 0.18, ease: [0.7, 0, 1, 0.5] };

  return (
    <motion.div
      className="fixed left-1/2 rounded-[8px]"
      style={{
        bottom: "58px",
        width: `${menuSize.width}px`,
        height: `${menuSize.height}px`,
        border: "1.5px solid rgba(89, 80, 80, 0.35)",
        boxShadow: "0 8px 14px -2px rgba(0,0,0,0.22)",
        zIndex: 50,
        x: "-50%",
        pointerEvents: isOpen ? "auto" : "none",
      }}
      initial={false}
      animate={{ y: isOpen ? 0 : menuSize.height + 60 }}
      transition={transition}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div
        className="rounded-[8px] overflow-hidden flex flex-col w-full h-full"
        style={{
          backdropFilter: backdropReady ? 'blur(50px)' : 'none',
          backgroundColor: backdropReady ? '#f0f7fce7' : '#D8E7FF',
        }}
      >
        {/* 검색 바 */}
        <div
          className="px-8 py-4"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
          onClick={handleInputClick}
        >
          <SearchInput
            placeholder="앱, 설정 및 문서 검색"
            isFocused={true}
            inputRef={inputRef}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            skipAnimation
          />
        </div>

        {/* 스크롤 가능한 콘텐츠 영역 */}
        <div
          className="flex-1 overflow-y-auto overflow-x-hidden px-14"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(0,0,0,0.12) transparent",
          }}
        >
          {/* 고정됨 */}
          <div className="pt-6 pb-2">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[14px] font-semibold text-gray-800">
                고정됨
              </span>
              <button
                onClick={() => setPinnedExpanded((v) => !v)}
                className="text-[14px] text-gray-800 px-3 py-1.5 mr-[-12px] rounded-[4px] hover:bg-[#ffffffa6] active:opacity-60 transition-all duration-[120ms] flex items-center gap-1"
              >
                {pinnedExpanded ? "간단히 표시" : "모두 표시"}
                {pinnedExpanded ? <ChevronUp size={14} strokeWidth={1.5} /> : <ChevronDown size={14} strokeWidth={1.5} />}
              </button>
            </div>
            <div
              className="grid grid-cols-8 gap-y-1"
              style={{ margin: '0 calc(15px - 100% / 16)' }}
            >
              {pinnedApps.slice(0, pinnedExpanded ? 24 : 16).map((app) => (
                <button
                  key={app.id}
                  className="flex flex-col items-center gap-[2px] pt-3 rounded-sm transition-colors hover:bg-[#ffffffa6] active:bg-[#ffffff50]"
                >
                  <img src={appIcon(app.icon)} className="w-[30px] h-[30px] object-contain" alt={app.name} />
                  <span
                    className="text-[13px] text-gray-600 text-center w-full"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      lineHeight: "1.7",
                      minHeight: "2.9em",
                    }}
                  >
                    {app.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 맞춤 */}
          <div className="py-2">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[14px] font-semibold text-gray-800">
                맞춤
              </span>
              <button
                className="text-[14px] text-gray-800 px-3 py-1.5 mr-[-12px] rounded-[4px] hover:bg-[#ffffffa6] active:opacity-60 transition-all duration-[120ms] flex items-center gap-1"
              >
                모두 표시
                <ChevronRight size={14} strokeWidth={1.5} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-x-1 gap-x-4 -mx-3">
              {recommended.map((item) => (
                <button
                  key={item.name}
                  className="flex items-center gap-3 px-3 py-2 rounded-[4px] hover:bg-[#ffffffa6] active:bg-[#ffffff60] transition-all duration-[120ms] text-left"
                >
                  <img src={appIcon(item.icon)} className="w-[23px] h-[23px] object-contain flex-shrink-0" alt={item.name} />
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

          {/* 모두 */}
          <div className="py-2 pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[14px] font-semibold text-gray-800">
                모두
              </span>
              <div className="relative mr-[-12px]" ref={viewBtnRef}>
                <button
                  onClick={() => setViewDropdown((v) => !v)}
                  className="text-[14px] text-gray-800 px-3 py-1.5 rounded-[4px] hover:bg-[#ffffffa6] active:opacity-60 transition-all duration-[120ms] flex items-center gap-1"
                >
                  보기: {viewMode}
                  {viewDropdown ? <ChevronUp size={14} strokeWidth={2.2} /> : <ChevronDown size={14} strokeWidth={2.2} />}
                </button>
                {viewDropdown && (
                  <div
                    className="absolute right-0 mt-1 py-1 rounded-md z-10"
                    style={{
                      background: "rgba(255,255,255,0.97)",
                      border: "1px solid rgba(0,0,0,0.08)",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                      minWidth: "100px",
                    }}
                  >
                    {viewModes.map((mode) => (
                      <button
                        key={mode}
                        onClick={() => { setViewMode(mode); setViewDropdown(false); }}
                        className="w-full text-left px-4 py-1.5 text-[12.5px] text-gray-700 hover:bg-black/[0.05] transition-colors"
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="grid gap-y-4 justify-between" style={{ gridTemplateColumns: "repeat(4, 157px)" }}>
              {appCategories.map((cat) => (
                <div key={cat.name} className="flex flex-col items-center gap-1.5 w-full">
                  <div
                    className="w-full rounded-lg grid grid-cols-2 overflow-hidden"
                    style={{ border: "1px solid rgba(0,0,0,0.06)", aspectRatio: "1" }}
                  >
                    {cat.icons.length <= 4
                      ? cat.icons.map((icon, i) => (
                          <div key={i} className="flex items-center justify-center">
                            <button className="group p-3.5 rounded-[4px] hover:bg-[#ffffffa6] active:bg-[#ffffff50] transition-all duration-[120ms]">
                              <img src={appIcon(icon)} className="w-[32px] h-[32px] object-contain group-active:scale-[0.8] transition-transform duration-[120ms]" alt="" />
                            </button>
                          </div>
                        ))
                      : <>
                          {cat.icons.slice(0, 3).map((icon, i) => (
                            <div key={i} className="flex items-center justify-center">
                              <button className="group p-3.5 rounded-[4px] hover:bg-[#ffffffa6] active:bg-[#ffffff50] transition-all duration-[120ms]">
                                <img src={appIcon(icon)} className="w-[32px] h-[32px] object-contain group-active:scale-[0.8] transition-transform duration-[120ms]" alt="" />
                              </button>
                            </div>
                          ))}
                          <div className="flex items-center justify-center">
                            <button className="group p-3.5 rounded-[4px] hover:bg-[#ffffffa6] active:bg-[#ffffff50] transition-all duration-[120ms]">
                              <div className="w-[32px] h-[32px] grid grid-cols-2 gap-[2px] place-items-center group-active:scale-[0.8] transition-transform duration-[120ms]">
                                {cat.icons.slice(3, 7).map((icon, i) => (
                                  <img key={i} src={appIcon(icon)} className="w-[14px] h-[14px] object-contain" alt="" />
                                ))}
                              </div>
                            </button>
                          </div>
                        </>
                    }
                  </div>
                  <p className="text-[11.5px] text-gray-800 font-medium truncate w-full text-center">
                    {cat.name}
                  </p>
                </div>
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
    </motion.div>
  );
}
