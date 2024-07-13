export function getNormalPath(path: string): string {
  if (path.length === 0 || !path || path === 'undefined')
    return path

  const res = path.replace('//', '/')
  if (res[res.length - 1] === '/')
    return res.slice(0, res.length - 1)
  return res
}

export function isExternal(path: string): boolean {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function isHttp(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://')
}
