import wallpaper from '../../assets/wallpapers/wallpaper_light.jpg'

export default function DesktopBackground() {
  return (
    <div
      className="fixed inset-0"
      style={{
        backgroundImage: `url(${wallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 53%',
        zIndex: -1,
      }}
    />
  )
}
