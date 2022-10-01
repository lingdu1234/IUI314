import { useWindowSize } from '@vueuse/core';
import { ref, watch } from 'vue';

import { useAppStore } from '@/stores';
const appStore = useAppStore();

export const useMobile = () => {
  const { width } = useWindowSize();
  const isMobile = ref(false);
  const mobileWidth = 1024;
  watch(
    () => width.value,
    (v: number) => {
      isMobile.value = v > mobileWidth ? false : true;
      appStore.setIsMobile(isMobile.value);
    }
  );
  return {
    isMobile,
  };
};
