import { defineStore } from 'pinia'

import type { menu } from '@/types/system/menu'

interface menuStore {
  menuTreeSelect: menu[]
}

export const useMenuData = defineStore('menuData', {
  state: (): menuStore => ({
    menuTreeSelect: [],
  }),
  persist: {
    paths: ['menuTreeSelect'],
  },
  getters: {
    getMenuTreeSelect(): menu[] {
      return this.menuTreeSelect
    },
  },
  actions: {
    setMenuTreeSelect(menuTreeSelect: menu[]) {
      this.menuTreeSelect = menuTreeSelect
    },

  },
})
