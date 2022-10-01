import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    siderBar: {
      isCollapse: false,
    },
    device: {
      isMobile: false,
    },
    app: {
      isDark: true,
    },
  }),
  persist: {
    paths: ['siderBar', 'device'],
  },
  actions: {
    toggleSiderBar(isMobile?: boolean) {
      this.siderBar.isCollapse = isMobile
        ? isMobile
        : !this.siderBar.isCollapse;
    },
    setIsMobile(isMobile: boolean) {
      this.device.isMobile = isMobile;
    },
    setIsDark(isDark: boolean) {
      this.app.isDark = isDark;
    },
  },
});
