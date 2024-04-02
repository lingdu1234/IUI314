export function useUnoIcons() {
  const UnoIcons: string[] = []
  const modules = import.meta.glob('/public/icons/**/*.svg')
  for (const pathString in modules) {
    const p = pathString
      .split('/public/icons/')[1]
      .split('.svg')[0]
    UnoIcons.push(p)
  }

  return { UnoIcons }
}
