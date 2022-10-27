/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-12 18:47:56
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-27 16:58:14
 * @FilePath: \IUI314\src\views\system\menu\pages\useMenu.ts
 * @Description:
 */

import { ref } from 'vue'

import { ApiSysMenu } from '@/api/apis'
import { useGet } from '@/hooks'
import { MenuType } from '@/types/base/router'
import type { menu, menuList, menuQueryParam } from '@/types/system/menu'

export const useHandleMenuLazy = (queryParams: menuQueryParam) => {
  const mainTree = ref<menu[]>([])
  const menuTreeMap = ref<{ [key: string]: menu[] }>({})
  const menuList = ref<menu[]>([])
  const getLazyMenu = async () => {
    // 初始化数据
    const _mainTree = ref<menu[]>([])
    const _menuTreeMap = ref<{ [key: string]: menu[] }>({})
    const { data, execute } = useGet<menuList>(ApiSysMenu.getList, queryParams)
    await execute()

    const list = data.value?.list!
    // 赋值 menuList
    menuList.value = list

    // 1.先是制作字典能够获得每一行的信息
    const newArr = []
    const map: { [key: string]: menu } = {}
    list.forEach((item) => {
      // 为了方便给每一项都添加上children
      // 对象是直接.就可以添加属性的
      item.children = [] as menu[]
      const key = item.id!
      map[key] = item
    })
    // 2.遍历每一项,然后有父级的添加到父级的children中,没有父级的直接添加到新的数组中
    list.forEach((item) => {
      const parent = map[item.pid!]
      if (parent) {
        parent.children?.push(item)
      } else {
        newArr.push(item)
      }
    })
    list.forEach((item) => {
      if (map[item.id!]?.children?.length === 0) {
        delete map[item.id!].children
      } else {
        map[item.id!].hasChildren = true
      }
      const parent = map[item.pid!]
      if (!parent) {
        const it = { ...item }
        delete it.children
        _mainTree.value.push(it)
      } else {
        const parent = _menuTreeMap.value[item.pid!]
        if (parent) {
          parent.push(item)
        } else {
          _menuTreeMap.value[item.pid!] = [item]
        }
      }
    })
    mainTree.value = _mainTree.value
    menuTreeMap.value = _menuTreeMap.value
  }
  // getLazyMenu()
  return {
    getLazyMenu,
    mainTree,
    menuTreeMap,
    menuList,
  }
}

export const getSelectTree = (list: menu[]): menu[] => {
  const childrenListMap: { [key: string]: any } = {}
  const nodeIds: { [key: string]: any } = {}
  const menuSelectTree: menu[] = []

  for (const d of list) {
    const parentId = d.pid!
    if (childrenListMap[parentId] == null) {
      childrenListMap[parentId] = []
    }
    nodeIds[d.id!] = d
    // 禁用 菜单类型为F的作为上级菜单
    if (d.menu_type === MenuType.F) {
      d.disabled = true
    }
    childrenListMap[parentId].push(d)
  }

  for (const d of list) {
    const parentId = d.pid!
    if (nodeIds[parentId] == null) {
      menuSelectTree.push(d)
    }
  }

  for (const t of menuSelectTree) {
    adaptToChildrenList(t)
  }

  function adaptToChildrenList(o: menu) {
    if (childrenListMap[o.id!] !== null) {
      o.children = childrenListMap[o.id!]
    }
    if (o.children) {
      for (const c of o.children) {
        adaptToChildrenList(c)
      }
    }
  }

  return menuSelectTree
}
