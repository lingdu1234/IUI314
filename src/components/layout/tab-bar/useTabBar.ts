import { useRouter } from 'vue-router'

import type { TagProps } from '@/types/base/router'

export enum TabAction {

  reload = 'reload',

  current = 'current',

  left = 'left',

  right = 'right',

  others = 'others',

  all = 'all',
}

export function useTabBar() {
  const router = useRouter()

  const goto = async (tag: TagProps) => {
    await router.push({ ...tag })
  }

  return {

    goto,

  }
}
