import TaskbarButton from '../TaskbarButton'
import fileExploreIcon from '../../../assets/icons/file-explore.png'

export default function FileExplorerButton() {
  return (
    <TaskbarButton
      className="w-10 h-10"
      tooltip="파일 탐색기"
    >
      <img src={fileExploreIcon} alt="파일 탐색기" width={24.5} height={24.5} draggable={false} />
    </TaskbarButton>
  )
}
