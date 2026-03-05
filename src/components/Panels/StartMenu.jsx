import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronUp, ChevronDown, ChevronRight, ChevronLeft, Check, UserRound, RotateCcw, Power, Lock, Moon } from "lucide-react";
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

const recommendedAll = [
  { name: "task_view", path: "C:\\Users\\user\\Desktop\\WINDOWS\\windows11\\src\\assets\\icons", date: "2월 26일", icon: "taskview" },
  { name: "Recording 2026-02-26 011131", path: "C:\\Users\\user\\Downloads", date: "2월 25일", icon: "voice" },
  { name: "Screenshot 2026-02-26 010926", path: "C:\\Users\\user\\Pictures\\Screenshots", date: "2월 25일", icon: "photos" },
  { name: "start", path: "C:\\사용자\\user\\바탕 화면\\WINDOWS\\windows11\\src\\assets\\icons", date: "2월 25일", icon: "start" },
  { name: "search2", path: "C:\\Users\\user\\Downloads\\WindowsIcons-main\\WindowsIcons-main...", date: "2월 25일", icon: "photos" },
  { name: "search", path: "C:\\Users\\user\\Downloads\\WindowsIcons-main\\WindowsIcons-main...", date: "2월 25일", icon: "photos" },
  { name: "README", path: "C:\\Users\\user\\Downloads\\WindowsIcons-main", date: "2월 25일", icon: "notepad" },
  { name: "search", path: "C:\\Users\\user\\Desktop\\WINDOWS\\windows11\\src\\assets\\icons", date: "2월 25일", icon: "photos" },
  { name: "Screenshot 2026-02-25 224723", path: "C:\\Users\\user\\Pictures\\Screenshots", date: "2월 25일", icon: "photos" },
  { name: "그림1", path: "C:\\Users\\user\\Desktop", date: "2월 25일", icon: "paint" },
  { name: "Screenshot 2026-02-24 220229", path: "C:\\Users\\user\\Pictures\\Screenshots", date: "2월 24일", icon: "photos" },
  { name: "#5325", path: "C:\\사용자\\user\\다운로드\\W11_icon_files\\imageres-icons", date: "2월 24일", icon: "photos" },
  { name: "logo", path: "C:\\Users\\user\\Desktop\\WINDOWS\\windows11\\src\\assets\\icons", date: "2월 24일", icon: "photos" },
  { name: "battery-report", path: "C:\\사용자\\user", date: "2월 22일", icon: "edge" },
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
  const [dropdownReady, setDropdownReady] = useState(false);
  const [powerDropdown, setPowerDropdown] = useState(false);
  const [powerDropdownReady, setPowerDropdownReady] = useState(false);
  const [recommendedExpanded, setRecommendedExpanded] = useState(false);
  const viewBtnRef = useRef(null);
  const powerBtnRef = useRef(null);
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
      setRecommendedExpanded(false);
      return;
    }
    justOpenedRef.current = true;
    setInputFocused(true);
    const t = setTimeout(() => inputRef.current?.focus(), 120);
    return () => clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    if (!viewDropdown) { setDropdownReady(false); return; }
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setDropdownReady(true));
    });
    const handle = (e) => {
      if (!viewBtnRef.current?.contains(e.target)) setViewDropdown(false);
    };
    document.addEventListener("mousedown", handle, true);
    return () => { cancelAnimationFrame(raf); document.removeEventListener("mousedown", handle, true); };
  }, [viewDropdown]);

  useEffect(() => {
    if (!powerDropdown) { setPowerDropdownReady(false); return; }
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setPowerDropdownReady(true));
    });
    const handle = (e) => {
      if (!powerBtnRef.current?.contains(e.target)) setPowerDropdown(false);
    };
    document.addEventListener("mousedown", handle, true);
    return () => { cancelAnimationFrame(raf); document.removeEventListener("mousedown", handle, true); };
  }, [powerDropdown]);

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
          backdropFilter: backdropReady ? 'blur(50px)' : 'blur(0px)',
          backgroundColor: backdropReady ? '#f0f7fce7' : '#D8E7FF',
          transition: 'backdrop-filter 0.15s, background-color 0.15s',
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

        {/* 슬라이딩 콘텐츠 영역 */}
        <div className="flex-1 overflow-hidden relative">
          <motion.div
            className="flex h-full"
            animate={{ x: recommendedExpanded ? '-100%' : '0%' }}
            transition={{ type: "tween", duration: 0.6, ease: [0.1, 0.9, 0.2, 1] }}
          >
            {/* 패널 1: 메인 */}
            <div
              className="w-full flex-shrink-0 overflow-y-auto overflow-x-hidden px-14"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(0,0,0,0.12) transparent",
                willChange: "transform",
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
                    onClick={() => setRecommendedExpanded(true)}
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
                        className="absolute left-1/2 -translate-x-1/2 mt-1 rounded-md z-10"
                        style={{
                          overflow: "hidden",
                          minWidth: "97%",
                          boxShadow: dropdownReady ? "rgba(0, 0, 0, 0.22) 0px 10px 25px -15px" : "rgba(0, 0, 0, 0) 0px 9px 18px -10px",
                          transition: "box-shadow 0.9s ease",
                        }}
                      >
                        <div
                          className="rounded-md 1px solid rgba(0, 0, 0, 0.06)"
                          style={{
                            background: "#F3F8FB",
                            border: "1px solid rgba(0,0,0,0.06)",
                            transform: dropdownReady ? "translateY(0)" : "translateY(-100%)",
                            transition: "transform 0.3s cubic-bezier(0.1, 0.9, 0.2, 1)",
                          }}
                        >
                          <div className="flex flex-col gap-0.5 p-1">
                            {viewModes.map((mode) => (
                              <button
                                key={mode}
                                onClick={() => { setViewMode(mode); setViewDropdown(false); }}
                                className="group w-full flex justify-between items-center gap-4 py-1 px-2.5 text-[13px] text-gray-700 rounded-md hover:bg-black/[0.03]"
                              >
                                <span className="w-3.5 flex-shrink-0 text-[#777] group-hover:text-black transition-colors">
                                  {viewMode === mode && (
                                    <Check size={12.5} />
                                  )}
                                </span>
                                <span className="flex-1 text-left">{mode}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid gap-y-4 justify-between" style={{ gridTemplateColumns: "repeat(4, 157px)" }}>
                  {appCategories.map((cat) => (
                    <div key={cat.name} className="flex flex-col items-center gap-1.5 w-full">
                      <div
                        className="w-full rounded-lg grid grid-cols-2 overflow-hidden"
                        style={{ border: "1px solid rgba(0,0,0,0.06)", aspectRatio: "1", background: "rgba(255,255,255,0.12)" }}
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

            {/* 패널 2: 맞춤 상세 */}
            <div
              className="w-full flex-shrink-0 overflow-y-auto overflow-x-hidden px-14"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(0,0,0,0.12) transparent",
              }}
            >
              <div className="flex items-center justify-between pt-5 pb-3">
                <span className="text-[14px] font-semibold text-gray-800">
                  맞춤
                </span>
                <button
                  onClick={() => setRecommendedExpanded(false)}
                  className="text-[14px] text-gray-800 px-3 py-1.5 mr-[-4px] rounded-[4px] hover:bg-[#ffffffa6] active:opacity-60 transition-all duration-[120ms] flex items-center gap-1"
                >
                  <ChevronLeft size={14} strokeWidth={1.5} />
                  뒤로
                </button>
              </div>
              <div className="flex flex-col">
                {recommendedAll.map((item, i) => (
                  <button
                    key={i}
                    className="flex items-center gap-4 px-3 py-1.5 rounded-[4px] hover:bg-[#ffffffa6] active:bg-[#ffffff60] transition-all duration-[120ms] text-left"
                  >
                    <img src={appIcon(item.icon)} className="w-[20px] h-[20px] object-contain flex-shrink-0" alt={item.name} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] text-gray-800 truncate font-medium leading-tight">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-gray-400 truncate mt-0.5">
                        {item.path}
                      </p>
                    </div>
                    <span className="text-[11px] text-gray-400 flex-shrink-0 ml-2">
                      {item.date}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* 하단 바 */}
        <div
          className="flex items-center justify-between pl-11 pr-14 py-3"
          style={{
            height: "63px",
            background: "rgba(0,0,0,0.025)",
            borderTop: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <button className="group flex items-center gap-2.5 px-3 py-1 rounded-[4px] hover:bg-[#ffffffa6] transition-all duration-[120ms]">
            <div className="w-[33px] h-[33px] border 1px border-[#dadada] rounded-full bg-[#E6E6E6] flex items-center justify-center">
              <UserRound size={20} stroke="rgba(60,60,60,0.65)" strokeWidth={1.8} />
            </div>
            <span className="text-[12px] text-gray-700 font-medium group-active:opacity-60 transition-opacity duration-[120ms]">이빈</span>
          </button>
          <div className="relative" ref={powerBtnRef}>
            <button
              onClick={() => setPowerDropdown((v) => !v)}
              className="flex items-center justify-center w-9 h-9 rounded-[4px] hover:bg-[#ffffffa6] active:opacity-60 transition-all duration-[120ms]"
            >
              <Power size={20} strokeWidth={1} color="black" />
            </button>
            {powerDropdown && (
              <div
                className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 rounded-md z-10"
                style={{
                  overflow: "hidden",
                  minWidth: "140px",
                  boxShadow: powerDropdownReady ? "rgba(0, 0, 0, 0.22) 0px 10px 25px -15px" : "rgba(0, 0, 0, 0) 0px 9px 18px -10px",
                  transition: "box-shadow 0.9s ease",
                }}
              >
                <div
                  className="rounded-md"
                  style={{
                    background: "#F3F8FB",
                    border: "1px solid rgba(0,0,0,0.06)",
                    transform: powerDropdownReady ? "translateY(0)" : "translateY(100%)",
                    transition: "transform 0.3s cubic-bezier(0.1, 0.9, 0.2, 1)",
                  }}
                >
                  <div className="flex flex-col gap-1 p-1">
                    {[
                      { label: "잠금", icon: <Lock size={20} strokeWidth={1} color="black" /> },
                      { label: "절전", icon: <Moon size={20} strokeWidth={1} color="black" style={{ transform: "scaleX(-1)" }} /> },
                      { label: "시스템 종료", icon: <Power size={20} strokeWidth={1} color="black" /> },
                      { label: "다시 시작", icon: <RotateCcw size={20} strokeWidth={1} color="black" /> },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={() => setPowerDropdown(false)}
                        className="w-full flex items-center gap-3 py-1 px-3 text-[13.5px] rounded-md hover:bg-black/[0.03]"
                      >
                        <span className="text-gray-500">{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
