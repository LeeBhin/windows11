import { Wifi, WifiOff, Volume2, Volume1, VolumeX } from 'lucide-react'
import { useDesktopStore } from '../../../store/useDesktopStore'
import TaskbarButton from '../TaskbarButton'
import TaskbarTooltip from '../TaskbarTooltip'

export default function NetworkSpeakerButton() {
  const network = useDesktopStore((s) => s.network)
  const volume = useDesktopStore((s) => s.volume)
  const isMuted = useDesktopStore((s) => s.isMuted)
  const togglePanel = useDesktopStore((s) => s.togglePanel)

  const isSilent = isMuted || volume === 0
  const iconColor = 'rgba(30,30,30,0.8)'
  const networkTooltip = network.isConnected ? '인터넷 액세스' : '인터넷에 연결되어 있지 않음'
  const speakerTooltip = isSilent ? '스피커(ABKO N550): 음소거' : `스피커(ABKO N550): ${volume}%`

  return (
    <TaskbarButton
      onClick={(e) => { e.stopPropagation(); togglePanel('actionCenter') }}
      className="h-9 px-2"
    >
      <div className="flex items-center gap-2">
        <TaskbarTooltip tooltip={networkTooltip}>
          <div className="flex items-center justify-center">
            {network.isConnected
              ? <Wifi size={15} color={iconColor} strokeWidth={2} />
              : <WifiOff size={15} color="rgba(30,30,30,0.35)" strokeWidth={2} />
            }
          </div>
        </TaskbarTooltip>
        <TaskbarTooltip tooltip={speakerTooltip}>
          <div className="flex items-center justify-center">
            {isSilent
              ? <VolumeX size={15} color={iconColor} strokeWidth={2} />
              : volume > 50
                ? <Volume2 size={15} color={iconColor} strokeWidth={2} />
                : <Volume1 size={15} color={iconColor} strokeWidth={2} />
            }
          </div>
        </TaskbarTooltip>
      </div>
    </TaskbarButton>
  )
}
