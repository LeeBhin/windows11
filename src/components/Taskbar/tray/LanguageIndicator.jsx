import { useDesktopStore } from '../../../store/useDesktopStore'
import TaskbarButton from '../TaskbarButton'

export default function LanguageIndicator() {
  const language = useDesktopStore((s) => s.language)
  const toggleLanguage = useDesktopStore((s) => s.toggleLanguage)

  return (
    <TaskbarButton
      onClick={(e) => { e.stopPropagation(); toggleLanguage() }}
      className="w-8 h-9"
      tooltip="한/영 전환"
    >
      <span className="text-[16px] font-bold" style={{ color: 'rgba(20,20,20,0.9)' }}>
        {language === 'ko' ? '가' : 'A'}
      </span>
    </TaskbarButton>
  )
}
