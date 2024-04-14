import ids from 'virtual:svg-icons-names'

export function useIuiIcons() {
  const IuiIcons: string[] = ids.map((id: string) => id.replace('icon-', ''))

  return { IuiIcons }
}
