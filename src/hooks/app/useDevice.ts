import { useWindowSize } from '@vueuse/core'
import { ref, watch } from 'vue'

import { useAppStore } from '@/stores'

export const useMobile = () => {
  const appStore = useAppStore()
  const { width } = useWindowSize()
  const isMobile = ref(false)
  const mobileWidth = 1024
  watch(
    () => width.value,
    (v: number) => {
      isMobile.value = v > mobileWidth ? false : true
      appStore.setIsMobile(isMobile.value)
    }
  )
  return {
    isMobile,
  }
}
