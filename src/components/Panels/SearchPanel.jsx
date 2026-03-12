import { useState, useEffect, useRef } from "react";
import { useDesktopStore } from "../../store/useDesktopStore";
import SearchInput from "./SearchInput";
import PanelShell from "../ui/PanelShell";
import { recentApps, quickTags, topApps } from "../../data/searchPanelData";

const appIcon = (name) =>
  new URL(`../../assets/icons/applications/${name}.ico`, import.meta.url).href;

function calcPanelSize(screenW, screenH) {
  const t = Math.max(0, Math.min(1, (screenW - 1707) / (1920 - 1707)));
  const baseW = 777 + t * (833 - 777);
  const baseH = 795 + t * (930 - 795);
  const wFactor = screenW < 1707 ? screenW / 1707 : screenW > 1920 ? screenW / 1920 : 1;
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
  const [panelSize, setPanelSize] = useState(() =>
    calcPanelSize(window.innerWidth, window.innerHeight),
  );
  const inputRef = useRef(null);
  const wasBlurredRef = useRef(false);

  useEffect(() => {
    const update = () => setPanelSize(calcPanelSize(window.innerWidth, window.innerHeight));
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
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )
          }
        />
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
                <img src={appIcon(app.icon)} className="w-7 h-7 object-contain flex-shrink-0" alt={app.name} />
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
                <img src={appIcon(app.icon)} className="w-[34px] h-[34px] object-contain" alt={app.name} />
                <span className="text-[12px] text-gray-700 text-center leading-tight w-full truncate">
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
