export const getNormalPath = (path: string): string => {
  if (path.length === 0 || !path || path == 'undefined') {
    return path
  }
  const res = path.replace('//', '/')
  if (res[res.length - 1] === '/') {
    return res.slice(0, res.length - 1)
  }
  return res
}

export const isExternal = (path: string): Boolean => {
  return /^(https?:|mailto:|tel:)/.test(path)
}
