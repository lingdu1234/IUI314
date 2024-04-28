<script lang="ts" setup>
import { onMounted, ref, toRaw } from 'vue'

import { Message, Modal } from '@arco-design/web-vue'
import { ApiSysMenu } from '@/api/apis'
import {
  deleteEmptyChildren,
  filterObjectArray,
  useDelete,
  useDicts,
  useGet,
} from '@/hooks'
import { dictKey } from '@/types/system/dict'
import RightToolBar from '@/components/common/right-tool-bar.vue'
import { ApiManageRouteName, router, systemMenus } from '@/router'
import MenuManageQuery from '@/views/system/menu/pages/menu/menu-manage-query.vue'
import MenuManageOperator from '@/views/system/menu/pages/menu/menu-manage-operator.vue'
import MenuManageTable from '@/views/system/menu/pages/menu/menu-manage-table.vue'
import MenuManageModal from '@/views/system/menu/pages/menu/menu-manage-modal.vue'
import type { menu, menuQueryParam } from '@/types/system/menu'
import { MenuType } from '@/types/base/router'
import { useMenuData } from '@/stores'

// 导出名称
defineOptions({
  name: systemMenus.menu.path,
})

const showSearch = ref(true)
// 菜单树数据
const menuData = ref<menu[]>()

// 目录上级菜单选择树
const menuSelectTree = ref<menu[]>([])

const modalRef = ref<InstanceType<typeof MenuManageModal>>()

const dicts = useDicts(
  dictKey.sysNormalDisable,
  dictKey.sysApiMethod,
  dictKey.apiCacheMethod,
  dictKey.apiLogMethod,
  dictKey.sysShowHide,
)

const queryParams = ref<menuQueryParam>({})

async function getList() {
  // 添加参数只查询菜单和目录，不查询api
  queryParams.value.menu_types = [MenuType.C, MenuType.M].join(',')
  const { data, execute } = useGet<menu[]>(
    ApiSysMenu.getEnabledTree,
    queryParams,
  )
  await execute()
  menuData.value = deleteEmptyChildren(data.value as menu[], 'children')
  return menuData.value
}

const handAdd = (row?: menu, pid?: string) => modalRef.value?.handleAdd(row, pid)
const handleAddByCopy = (row: menu) => modalRef.value?.handleAddByCopy(row)
const handleUpdate = (row: menu) => modalRef.value?.handleUpdate(row)

async function getMenuSelectTree() {
  // const queryParam: menuQueryParam = {
  //   // 查询所有目录菜单，只有目录才能才能作为上级菜单
  //   menu_type: MenuType.M,
  // }
  // const { data, execute } = useGet<menu[]>(
  //   ApiSysMenu.getEnabledTree,
  //   queryParam,
  // )
  // await execute()

  const data = await getList()
  // 深度复制，防止修改原数据,而且只能复制原始值
  const _data = structuredClone(toRaw(data))
  // 对菜单警醒筛选
  const m_data = filterObjectArray(_data, ['id', 'menu_name'], 'children')
  menuSelectTree.value = [
    {
      id: '0',
      menu_name: '主目录',
      children: m_data,
    },
  ]
  // 蒋数据保存到store
  useMenuData().setMenuTreeSelect(menuSelectTree.value)
}

async function handleDelete(row?: menu) {
  if (row) {
    const id = row.id
    const content = `你确认要删除 '${row.menu_name}' 吗？`
    Modal.confirm({
      title: '菜单删除确认',
      hideCancel: false,
      titleAlign: 'start',
      content,
      okText: '确认',
      cancelText: '取消',
      draggable: true,
      onOk: async () => {
        const { execute } = useDelete(ApiSysMenu.delete, { id })
        await execute()
        await getList()
        Message.success(`你成功删除了菜单: '${row.menu_name}'`)
      },
      onCancel: () => {
        Message.info('你取消了删除操作')
      },
    })
  }
}

function goto_api(row?: menu) {
  router.push({
    name: ApiManageRouteName,
    query: { id: row ? row.id : undefined },
    params: {
      menu_tree: menuSelectTree.value as any,
    },
  })
}
onMounted(async () => {
  await getMenuSelectTree()
})
</script>

<template>
  <div>
    <MenuManageQuery
      v-model:query-params="queryParams"
      v-model:show-search="showSearch"
      :dicts="dicts"
      @get-list="getList"
    />
    <!-- 操作区域 -->
    <a-row :gutter="10" class="m-b-8px">
      <MenuManageOperator
        @hand-add="handAdd"
        @goto-api="goto_api"
      />
      <RightToolBar v-model:showSearch="showSearch" @query-table="getList" />
    </a-row>
    <!-- 表格区域 -->
    <MenuManageTable
      :is-loading="false"
      :dicts="dicts"
      :table-data="menuData || []"
      @handle-delete="handleDelete"
      @handle-update="handleUpdate"
      @handle-add="handAdd"
      @handle-add-by-copy="handleAddByCopy"
      @go-to-api="goto_api"
    />
    <MenuManageModal
      ref="modalRef"
      :dicts="dicts"
      :menu-tree="menuSelectTree as menu[]"
      @get-list="getList"
    />
  </div>
</template>
