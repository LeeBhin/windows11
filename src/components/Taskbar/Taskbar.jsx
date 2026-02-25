import { useDesktopStore } from '../../store/useDesktopStore'
import StartButton from './buttons/StartButton'
import SearchButton from './buttons/SearchButton'
import TaskViewButton from './buttons/TaskViewButton'
import FileExplorerButton from './buttons/FileExplorerButton'
import HiddenIconsButton from './tray/HiddenIconsButton'
import LanguageIndicator from './tray/LanguageIndicator'
import NetworkSpeakerButton from './tray/NetworkSpeakerButton'
import ClockWidget from './tray/ClockWidget'
import TaskbarTooltip from './TaskbarTooltip'

export default function Taskbar() {
  const closeAllPanels = useDesktopStore((s) => s.closeAllPanels)

  return (
    <div
      data-taskbar
      className="relative flex items-center flex-shrink-0"
      style={{
        height: '45.5px',
        background: 'radial-gradient(circle, #D5DDF1, #E3EEF9)',
        boxShadow: '0px -1px 0px 0.1px #B6BDC4',
        position: 'relative',
        zIndex: 60,
      }}
      onMouseDown={closeAllPanels}
    >
      {/* 중앙: 시작 ~ 파일탐색기 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-center gap-[4.5px]">
          <StartButton />
          <SearchButton />
          <TaskViewButton />
          <FileExplorerButton />
        </div>
      </div>

      {/* 우측: 시스템 트레이 */}
      <div className="absolute right-1 flex items-center gap-0.5">
        <HiddenIconsButton />
        <LanguageIndicator />
        <NetworkSpeakerButton />
        <ClockWidget />
        <TaskbarTooltip tooltip="바탕 화면 보기">
          <div className="w-[5px] h-9 flex items-center justify-center group cursor-default">
            <div className="w-px h-[15px] opacity-0 group-hover:opacity-100 transition-opacity duration-150" style={{ background: '#7D848A' }} />
          </div>
        </TaskbarTooltip>
      </div>
    </div>
  )
}
