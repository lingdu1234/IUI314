/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-13 20:24:58
 * @LastEditors: lingdu waong2005@126.com
 * @FilePath: \IUI314\src\components\common\icon-select.ts
 * @Description: icon
 */

export const useIcons = () => {
  const icons: string[] = []
  const modules = import.meta.glob('@/assets/icons/*.svg')
  for (const path in modules) {
    const p = path.split('assets/icons/')[1].split('.svg')[0]
    icons.push(p)
  }
  return { icons }
}
