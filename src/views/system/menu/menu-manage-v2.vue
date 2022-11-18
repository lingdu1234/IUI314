<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-07 16:26:54
 * @LastEditors: lingdu waong2005@126.com
 * @FilePath: \IUI314\src\views\system\menu\menu-manage-v2.vue
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
      <el-form-item :label="t('menu.name')" prop="menu_name">
        <el-input
          v-model="queryParams.menu_name"
          clearable
          :placeholder="t('menu.nameTip')"
          @keyup.enter="getList"
        />
      </el-form-item>
      <el-form-item :label="t('menu.status')" prop="status">
        <el-select
          v-model="queryParams.status"
          :clearable="true"
          :placeholder="t('menu.status')"
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
          {{ t('common.search') }}
        </el-button>
        <el-button :icon="Refresh" @click="resetQuery()">
          {{ t('common.reset') }}
        </el-button>
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
          {{ t('common.add') }}
        </el-button>
      </el-col>
      <RightToolBar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>
    <!-- 表格区域 -->
    <Suspense>
      <MenuTableV2 ref="menuTableRef" :queryParam="queryParams" />
      <template #fallback>
        <el-skeleton :rows="6" animated />
      </template>
    </Suspense>
  </div>
</template>
<script lang="ts" setup>
import { Plus, Refresh, Search } from '@element-plus/icons-vue'
import {
  type FormInstance,
  ElButton,
  ElCol,
  ElForm,
  ElFormItem,
  ElInput,
  ElOption,
  ElRow,
  ElSelect,
  ElSkeleton,
} from 'element-plus'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { ApiSysMenu } from '@/api/apis'
import RightToolBar from '@/components/common/right-tool-bar.vue'
import { hasPermission, useDicts, useFormUtil } from '@/hooks'
import type { MessageSchema } from '@/i18n'
import { systemMenus } from '@/router'
import { dictKey } from '@/types/system/dict'
import type { menuQueryParam } from '@/types/system/menu'

import MenuTableV2 from './pages/menu-table-v2.vue'

const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })

const { formReset } = useFormUtil()
const showSearch = ref(true)

const menuTableRef = ref<InstanceType<typeof MenuTableV2>>()
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
  name: systemMenus.menuV2.path,
})
</script>
