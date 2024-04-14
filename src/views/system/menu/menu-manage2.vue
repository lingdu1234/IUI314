<script lang="ts" setup>
import { Plus, Refresh, Search } from '@element-plus/icons-vue'
import {
  ElButton,
  ElCol,
  ElForm,
  ElFormItem,
  ElInput,
  ElOption,
  ElRow,
  ElSelect,
  ElSkeleton,
  type FormInstance,
} from 'element-plus'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import MenuTable from './pages/menu-table.vue'
import { ApiSysMenu } from '@/api/apis'
import RightToolBar from '@/components/common/right-tool-bar.vue'
import { hasPermission, useDicts, useFormUtil } from '@/hooks'
import type { MessageSchema } from '@/i18n'
import { systemMenus } from '@/router'
import { dictKey } from '@/types/system/dict'
import type { menuQueryParam } from '@/types/system/menu'

defineOptions({
  name: systemMenus.menu.path,
})

const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })

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

function resetQuery() {
  formReset(queryRef.value)
  getList()
}
function getList() {
  menuTableRef.value?.getList()
}
function handleAdd() {
  menuTableRef.value?.handleAdd()
}
</script>

<template>
  <div>
    <ElForm
      v-show="showSearch"
      ref="queryRef"
      :inline="true"
      :model="queryParams"
      class="base-form"
      label-width="80px"
    >
      <ElFormItem :label="t('menu.name')" prop="menu_name">
        <ElInput
          v-model="queryParams.menu_name"
          :placeholder="t('menu.nameTip')"
          clearable
          @keyup.enter="getList"
        />
      </ElFormItem>
      <ElFormItem :label="t('menu.status')" prop="status">
        <ElSelect
          v-model="queryParams.status"
          :clearable="true"
          :placeholder="t('menu.status')"
        >
          <ElOption
            v-for="dict in dicts[dictKey.sysNormalDisable]"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem>
        <ElButton :icon="Search" type="primary" @click="getList">
          {{ t('common.search') }}
        </ElButton>
        <ElButton :icon="Refresh" @click="resetQuery()">
          {{ t('common.reset') }}
        </ElButton>
      </ElFormItem>
    </ElForm>

    <!-- 操作区域 -->
    <ElRow :gutter="10" class="m-b-8px">
      <ElCol :span="1.5">
        <ElButton
          v-if="hasPermission(ApiSysMenu.add)"
          :icon="Plus"
          plain
          type="primary"
          @click="handleAdd"
        >
          {{ t('common.add') }}
        </ElButton>
      </ElCol>
      <RightToolBar v-model:showSearch="showSearch" @query-table="getList" />
    </ElRow>
    <!-- 表格区域 -->
    <Suspense>
      <MenuTable ref="menuTableRef" :query-param="queryParams" />
      <template #fallback>
        <ElSkeleton :rows="6" animated />
      </template>
    </Suspense>
  </div>
</template>
