<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-13 09:59:51
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-16 13:11:57
 * @FilePath: \IUI314\src\views\system\menu\components\menu-table.vue
 * @Description: 
-->
<template>
  <div>
    <!-- 表格区域 -->
    <el-table
      v-if="show_menu_table"
      ref="menuTableRef"
      :data="menuTree"
      row-key="id"
      lazy
      :load="load"
      tooltip-effect="light"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column
        prop="menu_name"
        label="菜单名称"
        :show-overflow-tooltip="true"
        width="200"
      />
      <el-table-column prop="icon" label="图标" align="center" width="100">
        <template #default="scope">
          <el-icon>
            <svg-icon :name="scope.row.icon" />
          </el-icon>
        </template>
      </el-table-column>
      <el-table-column prop="order_sort" label="排序" width="100" />
      <el-table-column
        prop="api"
        label="唯一标识"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="component"
        label="组件路径"
        :show-overflow-tooltip="true"
      />
      <el-table-column prop="method" label="方法" width="80">
        <template #default="scope">
          <dict-tag
            :options="dicts[dictKey.sysApiMethod]"
            :value="scope.row.method"
          />
        </template>
      </el-table-column>
      <el-table-column prop="method" label="数据权限" width="80">
        <template #default="scope">
          <dict-tag
            v-if="scope.row.method == 'GET'"
            :options="dicts[dictKey.sysNormalDisable]"
            :value="scope.row.data_scope"
          />
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="60">
        <template #default="scope">
          <dict-tag
            :options="dicts[dictKey.sysNormalDisable]"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>
      <el-table-column prop="visible" label="显示" width="60">
        <template #default="scope">
          <dict-tag
            :options="dicts[dictKey.sysShowHide]"
            :value="scope.row.visible"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="created_at"
        show-overflow-tooltip
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.created_at) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="200"
        class-name="small-padding fixed-width"
        v-if="hasPermission(ApiSysMenu.edit, ApiSysMenu.add, ApiSysMenu.delete)"
      >
        <template #default="scope">
          <el-tooltip
            content="修改"
            placement="top"
            effect="light"
            v-if="hasPermission(ApiSysMenu.edit)"
          >
            <el-button
              link
              :icon="Edit"
              style="color: chocolate"
              @click="handleUpdate(scope.row)"
            />
          </el-tooltip>
          <el-tooltip
            content="复制"
            placement="top"
            effect="light"
            v-if="hasPermission(ApiSysMenu.edit)"
          >
            <el-button
              link
              :icon="CopyDocument"
              style="color: violet"
              @click="handleAddByCopy(scope.row)"
            />
          </el-tooltip>
          <el-tooltip
            content="新增"
            placement="top"
            effect="light"
            v-if="hasPermission(ApiSysMenu.add)"
          >
            <el-button link :icon="FolderAdd" @click="handleAdd(scope.row)" />
          </el-tooltip>
          <el-tooltip
            content="删除"
            placement="top"
            effect="light"
            v-if="hasPermission(ApiSysMenu.delete)"
          >
            <el-button
              style="color: red"
              link
              :icon="Delete"
              @click="handleDelete(scope.row)"
            />
          </el-tooltip>
          <!-- <el-tooltip
            v-if="scope.row.menu_type == 'F'"
            content="数据库关联"
            placement="top"
          >
            <el-button
              style="color: green"
              link
              :icon="DataBoard"
              @click="handleDbRelation(scope.row)"
            />
          </el-tooltip> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 修改对话框 -->
    <MenuDialog
      ref="menuDialogRef"
      :open="open"
      :title="title"
      :form-data="formData"
      :menu-select-tree="menuSelectTree"
      @closeDialog="closeDialog"
      @getList="getList"
      @updateDom="updateDom"
    />
    <!-- 数据库关联对话框 -->
  </div>
</template>
<script lang="ts" setup name="menu-table">
import { CopyDocument, Delete, Edit, FolderAdd } from '@element-plus/icons-vue'
import { type TableInstance, ElMessage, ElMessageBox } from 'element-plus'
import { type PropType, nextTick, ref } from 'vue'

import { ApiSysMenu } from '@/api/apis'
import { hasPermission, parseTime, useDelete, useDicts } from '@/hooks'
import { MenuType } from '@/types/base/router'
import { dictKey } from '@/types/system/dict'
import type { menu, menuQueryParam } from '@/types/system/menu'

import MenuDialog from './menu-dialog.vue'
import { getSelectTree, useHandleMenuLazy } from './useMenu'

// menuDialogRef
const menuDialogRef = ref<InstanceType<typeof MenuDialog>>()
const menuTableRef = ref<TableInstance>()
// 对话框相关参数
const open = ref(false)
const title = ref('')
// 菜单选择树
const menuSelectTree = ref<menu[]>([])

const closeDialog = () => (open.value = false)
const formData = ref<menu>({
  pid: '0',
  menu_name: '',
  menu_type: MenuType.M,
  order_sort: 0,
  status: '1',
  visible: '1',
  log_method: '3',
  data_cache_method: '1',
  is_frame: '0',
  is_cache: '1',
  data_scope: '0',
  remark: '',
})

// 字典数据
const dicts = useDicts(
  dictKey.sysNormalDisable,
  dictKey.sysApiMethod,
  dictKey.apiCacheMethod,
  dictKey.apiLogMethod,
  dictKey.sysShowHide,
  dictKey.db
)

const props = defineProps({
  queryParam: {
    type: Object as PropType<menuQueryParam>,
    required: true,
  },
})

const editPid = ref<string>()
//  表格操作

const resetFormData = () => {
  formData.value = {
    pid: '0',
    menu_name: '',
    menu_type: MenuType.M,
    order_sort: 0,
    status: '1',
    visible: '1',
    log_method: '3',
    data_cache_method: '1',
    is_frame: '0',
    is_cache: '1',
    data_scope: '0',
    remark: '',
  }
}
const getList = async () => {
  await getLazyMenu()
}
// 新增
const handleAdd = (row?: menu) => {
  menuDialogRef.value?.resetMenuForm()
  resetFormData()

  editPid.value = row?.pid
  // 获取菜单选择树
  getMenuSelectTree()
  // 设置pid
  if (row) {
    formData.value!.pid = row.id!
  } else {
    formData.value!.pid = '0'
  }
  // 设置 菜单名称
  formData.value.menu_name =
    row?.menu_type === MenuType.C ? row?.menu_name + '-' : undefined
  // 设置菜单类型
  let type = undefined
  if (row?.menu_type === undefined) {
    type = MenuType.M
  } else if (row?.menu_type === MenuType.M) {
    type = MenuType.C
  } else {
    type = MenuType.F
  }
  formData.value.menu_type = type
  formData.value.id = ''
  open.value = true
  title.value = '添加菜单'
}
// 将方法开放给父组件
defineExpose({ handleAdd, getList })
// 通过复制新增
const handleAddByCopy = (row: menu) => {
  menuDialogRef.value?.resetMenuForm()
  resetFormData()

  editPid.value = row.pid!
  // 获取菜单选择树
  getMenuSelectTree()
  formData.value = row
  formData.value.id = ''
  open.value = true
  title.value = '复制添加菜单'
}
// 编辑
const handleUpdate = (row: menu) => {
  menuDialogRef.value?.resetMenuForm()
  resetFormData()

  editPid.value = row.pid!
  // 获取菜单选择树
  getMenuSelectTree()
  formData.value = row
  open.value = true
  title.value = `更新菜单-${row.menu_name}`
}
// 删除
const handleDelete = async (row: menu) => {
  const id = row.id!
  await ElMessageBox.confirm(
    `你是否确定删除数据:${row.menu_name!}`,
    '删除确认',
    {
      type: 'warning',
    }
  )
    .then(async () => {
      const { execute } = useDelete(ApiSysMenu.delete, { id })
      await execute()
      await getList()
      await updateChildrenDom(row.pid!)
      ElMessage.success('删除成功')
    })
    .catch(() => {
      ElMessage.info('取消删除')
    })
}
// 数据库关联
// const handleDbRelation = (row: menu) => {
//   console.log('row.id :>> ', row.id!)
// }

const show_menu_table = ref(true)

const {
  getLazyMenu,
  mainTree: menuTree,
  menuTreeMap,
  menuList,
} = useHandleMenuLazy(props.queryParam)

//  获取菜单选择树
const getMenuSelectTree = () => {
  const menu = getSelectTree(menuList.value)
  menuSelectTree.value = [
    {
      id: '0',
      menu_name: '主类目',
      children: menu,
    },
  ]
}

// 保存树节点数据
const tree_map = new Map()
// 更新懒加载的目录节点数据
async function updateChildrenDom(parentId: string) {
  let v = tree_map.get(parentId)
  if (v) {
    const { tree, treeNode, resolve } = v //根据pid取出对应的节
    load(tree, treeNode, resolve)
  } else {
    show_menu_table.value = false
    nextTick(() => {
      show_menu_table.value = true
    })
  }
  console.log(menuTableRef.value)
}
// 懒加载方法
const load = (tree: menu, treeNode: unknown, resolve: any) => {
  const pid = tree.id!
  tree_map.set(pid, { tree, treeNode, resolve })
  if (menuTreeMap.value[pid]) {
    setTimeout(() => {
      resolve(menuTreeMap.value[pid])
    }, 1)
  } else {
    show_menu_table.value = false
    nextTick(() => {
      show_menu_table.value = true
    })
  }
}
// 提交数据后更新视图
const updateDom = async (pid: string) => {
  await getList()
  // 这里比较坑，一定要等数据获取完成后，再更新懒加载视图
  // 由于是异步，需要注意获取的数据值，是否提前获取了数据
  await updateChildrenDom(pid)
  // 编辑操作可能更改父级目录，如果两个目录不一致，需同时更新
  //  editPid 为获取row数据时 拿到的pid
  if (pid !== editPid.value!) {
    await updateChildrenDom(editPid.value!)
  }
}
await getList()
</script>
