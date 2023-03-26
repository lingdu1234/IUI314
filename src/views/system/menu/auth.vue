<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-15 09:32:17
 * @LastEditors: lingdu waong2005@126.com
 * @FilePath: \IUI314\src\views\system\menu\auth.vue
 * @Description: 
-->
<template>
  <div>
    <el-form
      v-show="showSearch"
      ref="queryRef"
      :inline="true"
      :model="queryParams"
      class="base-form"
      label-width="80px"
    >
      <el-form-item :label="t('menu.name')" prop="menu_name">
        <el-input
          v-model="queryParams.menu_name"
          :placeholder="t('menu.nameTip')"
          clearable
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
      <el-form-item :label="t('menu.method')" prop="method">
        <el-select
          v-model="queryParams.method"
          :placeholder="t('menu.method')"
          clearable
        >
          <el-option
            v-for="dict in dicts[dictKey.sysApiMethod]"
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
    <!-- 表格区域 -->
    <el-table :data="menu_list" tooltip-effect="light">
      <el-table-column
        :label="t('menu.id')"
        align="center"
        prop="order_sort"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        :label="t('menu.name')"
        align="center"
        prop="menu_name"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        label="api"
        show-overflow-tooltip
        width="150px"
      >
        <template #default="scope">
          <el-popover placement="top-start" title="API" trigger="hover">
            <template #reference>
              <span>{{ scope.row.api }}</span>
            </template>
            {{ scope.row.api }}
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column :label="t('menu.method')" align="center" prop="method">
        <template #default="scope">
          <DictTag
            :options="dicts[dictKey.sysApiMethod]"
            :value="scope.row.method"
          />
        </template>
      </el-table-column>
      <el-table-column
        :label="t('menu.dataScope')"
        align="center"
        prop="data_scope"
        width="100"
      >
        <template #default="scope">
          <DictTag
            v-if="scope.row.method == 'GET'"
            :options="dicts[dictKey.sysNormalDisable]"
            :value="scope.row.data_scope"
          />
          <el-tag v-else>not support</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('menu.database')" align="center" width="160px">
        <template #default="scope">
          <el-popover
            :title="t('menu.database')"
            :width="get_max_length(scope.row.dbs) * 9 + 5"
            placement="top-start"
            trigger="hover"
          >
            <template #reference>
              <span>
                {{
                  scope.row.dbs.length > 1
                    ? scope.row.dbs[0] + ' ↑ '
                    : scope.row.dbs.length == 0
                    ? ''
                    : scope.row.dbs[0]
                }}</span
              >
            </template>
            <li v-for="(it, index) in scope.row.dbs" :key="it + index">
              {{ it }}
            </li>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" label="APIs" width="200">
        <template #default="scope">
          <el-popover
            :width="get_max_length(scope.row.apis) * 9 + 5"
            placement="top-start"
            title="APIs"
            trigger="hover"
          >
            <template #reference>
              <span>
                {{
                  scope.row.apis.length > 1
                    ? scope.row.apis[0] + ' ↑ '
                    : scope.row.apis.length == 0
                    ? ''
                    : scope.row.apis[0]
                }}</span
              >
            </template>
            <li v-for="(it, index) in scope.row.apis" :key="it + index">
              {{ it }}
            </li>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        :label="t('common.log')"
        align="center"
        prop="log_method"
      >
        <template #default="scope">
          <DictTag
            :options="dicts[dictKey.apiLogMethod]"
            :value="scope.row.log_method"
          />
        </template>
      </el-table-column>
      <el-table-column
        :label="t('common.cache')"
        align="center"
        prop="data_cache_method"
      >
        <template #default="scope">
          <div v-if="scope.row.method !== 'GET'" />
          <DictTag
            v-else
            :options="dicts[dictKey.apiCacheMethod]"
            :value="scope.row.data_cache_method"
          />
        </template>
      </el-table-column>
      <el-table-column :label="t('common.status')" align="center" prop="status">
        <template #default="scope">
          <DictTag
            :options="dicts[dictKey.sysNormalDisable]"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>
      <el-table-column
        :label="t('common.createTime')"
        align="center"
        prop="created_at"
        width="180"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.created_at) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="hasPermission(ApiSysMenu.updateLogCache, ApiSysDbApi.edit)"
        :label="t('common.operation')"
        align="center"
        class-name="small-padding fixed-width"
        width="200"
      >
        <template #default="scope">
          <el-tooltip
            v-if="scope.row.menu_type == 'F'"
            :content="t('menu.dbRelation')"
            effect="light"
            placement="top"
          >
            <el-button
              :icon="DataBoard"
              link
              style="color: green"
              @click="handleDbRelation(scope.row)"
            >
              {{ t('menu.dbRelation') }}
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      v-show="total > 0"
      v-model:limit="queryParams.page_size"
      v-model:page="queryParams.page_num"
      :total="total"
      @pagination="getList"
    />
    <!-- 数据库关联组件 -->
    <AuthDialog
      v-if="open"
      :form-data="formData"
      :open="open"
      :title="title"
      @close-dialog="closeDialog"
    />
  </div>
</template>
<script lang="ts" setup>
import { DataBoard, Refresh, Search } from '@element-plus/icons-vue'
import {
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElOption,
  ElPopover,
  ElSelect,
  ElTable,
  ElTableColumn,
  ElTag,
  ElTooltip,
  type FormInstance,
} from 'element-plus'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { ApiSysDbApi, ApiSysMenu } from '@/api/apis'
import DictTag from '@/components/common/dict-tag.vue'
import Pagination from '@/components/common/pagination.vue'
import {
  hasPermission,
  parseTime,
  useDicts,
  useFormUtil,
  useListData,
} from '@/hooks'
import type { MessageSchema } from '@/i18n'
import { systemMenus } from '@/router'
import { MenuType } from '@/types/base/router'
import { dictKey } from '@/types/system/dict'
import type { authMenu, menuQueryParam } from '@/types/system/menu'

import AuthDialog from './pages/auth-dialog.vue'

const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
const queryRef = ref<FormInstance>()
const { formReset } = useFormUtil()
// 字典数据
const dicts = useDicts(
  dictKey.sysNormalDisable,
  dictKey.sysApiMethod,
  dictKey.apiCacheMethod,
  dictKey.apiLogMethod
)
const showSearch = ref(true)
const open = ref(false)
const title = ref('')
const formData = ref<authMenu>({})
const queryParams = ref<menuQueryParam>({
  page_num: 1,
  page_size: 10,
  menu_type: MenuType.F,
})

const {
  list: menu_list,
  getListFn: getList,
  total,
} = useListData<menuQueryParam, authMenu>(ApiSysMenu.getAuthList, queryParams)

const get_max_length = (v: string[]) => {
  let l = 0
  v.forEach((element) => {
    l = Math.max(l, element.length)
  })
  return l
}

const resetQuery = () => {
  formReset(queryRef.value)
  getList()
}

const handleDbRelation = (row: authMenu) => {
  formData.value = row
  title.value = row.menu_name + '  数据库关联+日志+缓存'
  open.value = true
}
const closeDialog = () => {
  open.value = false
  getList()
}

// 导出名称
defineOptions({
  name: systemMenus.menu_auth.path,
})
</script>
