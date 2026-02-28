import { create } from 'zustand'
import { desktopIcons } from '../data/desktopIcons'

export const useDesktopStore = create((set) => ({
  panels: {
    startMenu: false,
    searchPanel: false,
    taskView: false,
    hiddenIcons: false,
    actionCenter: false,
    calendarPanel: false,
    notificationPanel: false,
  },

  togglePanel: (panelName) =>
    set((state) => {
      const isOpen = state.panels[panelName]
      const allClosed = Object.fromEntries(
        Object.keys(state.panels).map((k) => [k, false])
      )
      return { panels: { ...allClosed, [panelName]: !isOpen } }
    }),

  // 시계 클릭: 알림 패널 + 달력 패널 동시 토글 (각각 분리된 패널)
  toggleCalendarView: () =>
    set((state) => {
      const isOpen = state.panels.calendarPanel
      const allClosed = Object.fromEntries(
        Object.keys(state.panels).map((k) => [k, false])
      )
      return {
        panels: { ...allClosed, calendarPanel: !isOpen, notificationPanel: !isOpen },
      }
    }),

  closeAllPanels: () =>
    set((state) => ({
      panels: Object.fromEntries(
        Object.keys(state.panels).map((k) => [k, false])
      ),
    })),

  selectedIconId: null,
  icons: desktopIcons,
  selectIcon: (id) => set({ selectedIconId: id }),

  language: 'ko',
  toggleLanguage: () =>
    set((state) => ({ language: state.language === 'ko' ? 'en' : 'ko' })),

  volume: 60,
  isMuted: false,
  setVolume: (volume) => set({ volume, isMuted: false }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

  network: { isConnected: true, type: 'wifi' },

  _skipNextPanelAnim: false,
}))
