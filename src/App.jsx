import { useDesktopStore } from './store/useDesktopStore'
import Desktop from './components/Desktop/Desktop'
import Taskbar from './components/Taskbar/Taskbar'
import StartMenu from './components/Panels/StartMenu'
import SearchPanel from './components/Panels/SearchPanel'
import ActionCenter from './components/Panels/ActionCenter'
import HiddenIconsTray from './components/Panels/HiddenIconsTray'
import TaskView from './components/Panels/TaskView'
import ClockPanel from './components/Panels/ClockPanel'

function PanelBackdrop() {
  const panels = useDesktopStore((s) => s.panels)
  const closeAllPanels = useDesktopStore((s) => s.closeAllPanels)

  const anyOpen =
    panels.startMenu ||
    panels.searchPanel ||
    panels.actionCenter ||
    panels.calendarPanel ||
    panels.hiddenIcons

  if (!anyOpen) return null

  return (
    <div
      className="fixed inset-0"
      style={{ zIndex: 30 }}
      onMouseDown={closeAllPanels}
    />
  )
}

export default function App() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden select-none">
      <Desktop />
      <Taskbar />

      <PanelBackdrop />

      <StartMenu />
      <SearchPanel />
      <ActionCenter />
      <HiddenIconsTray />
      <ClockPanel />
      <TaskView />
    </div>
  )
}
