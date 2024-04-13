export function useIuiIcons() {
  const IuiIcons: string[] = []
  const modules = import.meta.glob(`/public/assets/icons/**/*.svg`)
  for (const pathString in modules) {
    const p = pathString
      .split('/public/assets/icons/')[1]
      .split('.svg')[0]
    IuiIcons.push(p)
  }

  function getRandomIcon() {
    const icon = IuiIcons[Math.floor(Math.random() * IuiIcons.length)]
    if (icon.startsWith('color/'))
      return getRandomIcon()

    else
      return icon
  }

  return { IuiIcons, getRandomIcon }
}
