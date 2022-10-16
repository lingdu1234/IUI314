<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-07 16:26:54
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-15 16:27:19
 * @FilePath: \IUI314\src\views\system\menu\menu-manage.vue
 * @Description: 
-->
<template>
  <div>
    <el-form
      v-show="showSearch"
      ref="queryRef"
      :inline="true"
      :model="queryParams"
      label-width="68px"
      class="base-form"
    >
      <el-form-item label="菜单名称" prop="menu_name">
        <el-input
          v-model="queryParams.menu_name"
          clearable
          placeholder="请输入字典名称"
          @keyup.enter="getList"
        />
      </el-form-item>
      <el-form-item label="菜单状态" prop="status">
        <el-select
          v-model="queryParams.status"
          :clearable="true"
          placeholder="字典状态"
        >
          <el-option
            v-for="dict in dicts[dictKey.sysNormalDisable]"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button :icon="Search" type="primary" @click="getList">
          搜索
        </el-button>
        <el-button :icon="Refresh" @click="resetQuery()"> 重置 </el-button>
      </el-form-item>
    </el-form>

    <!-- 操作区域 -->
    <el-row :gutter="10" class="m-b-8px" style="height: 35px">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          :icon="Plus"
          @click="handleAdd"
          v-if="hasPermission(ApiSysMenu.add)"
        >
          新增
        </el-button>
      </el-col>
      <RightToolBar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>
    <!-- 表格区域 -->
    <Suspense>
      <MenuTable ref="menuTableRef" :queryParam="queryParams" />
      <template #fallback>
        <el-skeleton :rows="6" animated />
      </template>
    </Suspense>
  </div>
</template>
<script lang="ts" setup>
import { Plus, Refresh, Search } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { ref } from 'vue'

import { ApiSysMenu } from '@/api/apis'
import RightToolBar from '@/components/common/right-tool-bar.vue'
import { hasPermission, useDicts, useFormUtil } from '@/hooks'
import { systemMenus } from '@/router'
import { dictKey } from '@/types/system/dict'
import type { menuQueryParam } from '@/types/system/menu'

import MenuTable from './components/menu-table.vue'

const { formReset } = useFormUtil()
const showSearch = ref(true)

const menuTableRef = ref<InstanceType<typeof MenuTable>>()
const queryRef = ref<FormInstance>()
// 字典数据
const dicts = useDicts(dictKey.sysNormalDisable)
// 查询参数
const queryParams = ref<menuQueryParam>({
  menu_name: undefined,
  status: undefined,
})

const resetQuery = () => {
  formReset(queryRef.value)
  getList()
}
const getList = () => {
  menuTableRef.value?.getList()
}
const handleAdd = () => {
  menuTableRef.value?.handleAdd()
}
defineOptions({
  name: systemMenus.menu.path,
})
</script>
