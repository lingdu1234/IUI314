import { onMounted, ref } from 'vue'

import { useAppStore } from '@/stores'

export function useAnimation() {
  const animationList = [
    { label: '渐显', value: 'fade' },
    { label: '缩放', value: 'scale' },
    { label: '滑动', value: 'slide' },
    { label: 'zoom-fade', value: 'zoom-fade' },
    { label: 'zoom-out', value: 'zoom-out' },
    { label: '缩放滑动', value: 'scale-slide' },
    { label: '渐显滑动', value: 'fade-slide' },
    { label: '渐显缩放', value: 'fade-scale' },
  ]
  const appStore = useAppStore()
  const setAnimation = (v: string) => {
    appStore.setAnimation(v)
  }
  return {
    animationList,
    setAnimation,
  }
}

export function useSetVh() {
  const vHeight = ref(window.innerHeight)
  const setVh = () => {
    vHeight.value = window.innerHeight
    const vh = vHeight.value * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }
  // 监控屏幕高度 设置 --vh
  window.addEventListener('resize', () => setVh())
  onMounted(() => setVh())
  return { setVh, vHeight }
}
