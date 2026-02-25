import { Volume2, Volume1, VolumeX } from 'lucide-react'
import { useDesktopStore } from '../../../store/useDesktopStore'
import TaskbarButton from '../TaskbarButton'

export default function SpeakerIcon() {
  const volume = useDesktopStore((s) => s.volume)
  const isMuted = useDesktopStore((s) => s.isMuted)
  const togglePanel = useDesktopStore((s) => s.togglePanel)

  const isSilent = isMuted || volume === 0
  const iconColor = 'rgba(30,30,30,0.8)'

  return (
    <TaskbarButton
      onClick={(e) => { e.stopPropagation(); togglePanel('actionCenter') }}
      className="w-8 h-8"
      tooltip={isSilent ? '스피커(ABKO N550): 음소거' : `스피커(ABKO N550): ${volume}%`}
    >
      {isSilent
        ? <VolumeX size={15} color={iconColor} strokeWidth={2} />
        : volume > 50
          ? <Volume2 size={15} color={iconColor} strokeWidth={2} />
          : <Volume1 size={15} color={iconColor} strokeWidth={2} />
      }
    </TaskbarButton>
  )
}
