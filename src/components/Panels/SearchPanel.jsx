import { useState, useEffect, useRef } from "react";
import { useDesktopStore } from "../../store/useDesktopStore";
import SearchInput from "./SearchInput";
import PanelShell from "../ui/PanelShell";
import Hoverable from "../ui/Hoverable";
import { recentApps, quickTags, topApps } from "../../data/searchPanelData";

const appIcon = (name) =>
  new URL(`../../assets/icons/applications/${name}.ico`, import.meta.url).href;

const CARD_STYLE = {
  background: "rgba(250,250,250,0.88)",
  border: "1.5px solid #85accc48",
};
const TAG_BG = "rgba(255,255,255,0.8)";
const TAG_BG_HOVER = "rgba(248,248,248,0.8)";

function calcPanelSize(screenW, screenH) {
  const t = Math.max(0, Math.min(1, (screenW - 1707) / (1920 - 1707)));
  const baseW = 777 + t * (833 - 777);
  const baseH = 795 + t * (930 - 795);
  const wFactor =
    screenW < 1707 ? screenW / 1707 : screenW > 1920 ? screenW / 1920 : 1;
  const hFactor = Math.max(0.7, Math.min(1.25, screenH / 1080));
  return {
    width: Math.max(420, Math.min(1100, Math.round(baseW * wFactor))),
    height: Math.max(520, Math.min(960, Math.round(baseH * hFactor))),
  };
}

export default function SearchPanel() {
  const isOpen = useDesktopStore((s) => s.panels.searchPanel);
  const skipAnim = useDesktopStore((s) => s._skipNextPanelAnim);
  const triggerSearchAnim = useDesktopStore((s) => s.triggerSearchAnim);
  const [query, setQuery] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [recents, setRecents] = useState(recentApps);
  const [panelSize, setPanelSize] = useState(() =>
    calcPanelSize(window.innerWidth, window.innerHeight),
  );
  const inputRef = useRef(null);
  const wasBlurredRef = useRef(false);

  useEffect(() => {
    const update = () =>
      setPanelSize(calcPanelSize(window.innerWidth, window.innerHeight));
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (skipAnim && isOpen) {
      useDesktopStore.setState({ _skipNextPanelAnim: false });
    }
  }, [skipAnim, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      inputRef.current?.blur();
      wasBlurredRef.current = false;
      return;
    }
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, [isOpen]);

  const handleInputFocus = () => {
    setInputFocused(true);
    if (wasBlurredRef.current) {
      wasBlurredRef.current = false;
      triggerSearchAnim();
    }
  };

  const handleInputBlur = () => {
    setInputFocused(false);
    wasBlurredRef.current = true;
  };

  return (
    <PanelShell
      isOpen={isOpen}
      skipTransition={skipAnim && isOpen}
      width={panelSize.width}
      height={panelSize.height}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* 검색 바 */}
      <div className="px-6 pt-5 pb-3">
        <SearchInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          isFocused={inputFocused}
          inputRef={inputRef}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          rightEl={
            query && (
              <button
                onClick={() => setQuery("")}
                className="text-gray-400 hover:text-gray-700 transition-colors flex-shrink-0"
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
            )
          }
        />
      </div>

      {/* 두 컬럼 본문 */}
      <div className="flex flex-1 overflow-hidden px-6">
        {/* 왼쪽: 최근 */}
        <div className="w-[40%] pb-4 pr-3">
          <p className="text-[14px] font-semibold px-2 py-2">최근</p>
          <div className="flex flex-col gap-1">
            {recents.map((app) => (
              <Hoverable
                as="button"
                type="none"
                key={app.id}
                className="group flex items-center gap-2.5 px-2 py-2 text-left w-full"
              >
                <img src={appIcon(app.icon)} className="w-[22px] h-[22px] object-contain flex-shrink-0" alt={app.name} />
                <span className="text-[13px] text-gray-800 flex-1 truncate group-active:opacity-70 transition-opacity">
                  {app.name}
                </span>
                <svg
                  onClick={(e) => { e.stopPropagation(); setRecents((prev) => prev.filter((a) => a.id !== app.id)); }}
                  className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 opacity-0 group-hover:opacity-100"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </Hoverable>
            ))}
          </div>
        </div>

        {/* 오른쪽: 빠른 검색 + 최고의 앱 */}
        <div className="w-[60%] pb-4 pl-3">
          {/* 빠른 검색 헤더 */}
          <div className="flex items-start justify-between pr-2 py-2">
            <p className="text-[14px] font-semibold">빠른 검색</p>
            <div className="flex items-center gap-1" style={{ margin: "-7px -7px -7px 0" }}>
              <Hoverable cursor="default" className="w-[38px] h-[38px] flex items-center justify-center">
                <span className="w-[20.5px] h-[20.5px] rounded-full flex items-center justify-center text-white text-[10px] font-bold bg-[#0078D4]">
                  B
                </span>
              </Hoverable>
              <Hoverable
                as="button"
                cursor="default"
                className="w-[34px] h-[34px] flex items-center justify-center text-[11px] font-bold"
                style={{ color: "#222", letterSpacing: "1.5px" }}
              >
                ···
              </Hoverable>
            </div>
          </div>

          {/* 빠른 검색 태그 */}
          <div className="rounded-[9px] p-3.5 mb-3" style={CARD_STYLE}>
            <div className="flex flex-wrap gap-2">
              {quickTags.map((tag) => (
                <button
                  key={tag}
                  className="px-3 py-1.5 text-[12.5px] rounded-full transition-colors cursor-pointer"
                  style={{ background: TAG_BG, border: "1px solid rgba(0,0,0,0.1)", color: "#111" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = TAG_BG_HOVER)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = TAG_BG)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* 최고의 앱 */}
          <p className="text-[14px] font-semibold mb-3">최고의 앱</p>
          <div className="grid grid-cols-3 gap-2">
            {topApps.map((app) => (
              <button
                key={app.id}
                className="flex flex-col items-center justify-center gap-2.5 py-5 px-3 rounded-[4.5px] hover:bg-white/90 transition-colors cursor-pointer"
                style={CARD_STYLE}
              >
                <img src={appIcon(app.icon)} className="w-[30px] h-[30px] object-contain" alt={app.name} />
                <span className="text-[12px] text-center leading-tight w-full truncate">
                  {app.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </PanelShell>
  );
}
