<script lang="ts" setup>
import { computed, markRaw, ref } from 'vue'

import { Message, Modal, type TableRowSelection } from '@arco-design/web-vue'
import { IconDelete } from '@arco-design/web-vue/es/icon'
import { useI18n } from 'vue-i18n'
import { ApiSysDictType, ApiSysLoginLog } from '@/api/apis'
import Pagination from '@/components/common/pagination.vue'
import RightToolBar from '@/components/common/right-tool-bar.vue'
import {
  hasPermission,
  type listType,
  useDelete,
  useDeleteFn,
  useGet,
  useTableUtil,
} from '@/hooks'
import { systemMenus } from '@/router'
import IuQueryForm from '@/components/iui/iu-query-form.vue'
import IuButton from '@/components/iui/iu-button.vue'
import type { MessageSchema } from '@/i18n'
import type { loginLog, loginLogQueryParam } from '@/types/system/login-log'
import { useLoginLog } from '@/views/system/monitor/hooks/useLoginLog'

// 导出名称
defineOptions({
  name: systemMenus.loginLog.path,
})

const showSearch = ref(true)
const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
const { useTableSelectChange } = useTableUtil()
const { handleSelectionChangeFnX, ids, values, selected }
    = useTableSelectChange()

const {
  queryFormItems,
  columns,
} = useLoginLog()
const queryParams = ref<loginLogQueryParam>({
  page_num: 1,
  page_size: 10,
})

const {
  isFetching: isLoading,
  data: dataList,
  execute: getList,
} = useGet<listType<loginLog>>(
  ApiSysLoginLog.getList,
  queryParams,
  { immediate: true },
)

const operateButtons = ref<{ [key: string]: any }[]>([
  {
    label: t('common.delete'),
    icon: markRaw(IconDelete),
    auth: computed(() => hasPermission(ApiSysLoginLog.delete)),
    disabled: computed(() => !selected.value),
    fn: handleDelete,
    buttonType: 'primary',
    buttonStatus: 'warning',
  },
  {
    label: t('common.clean'),
    icon: markRaw(IconDelete),
    auth: computed(() => hasPermission(ApiSysLoginLog.clean)),
    disabled: false,
    fn: handleClean,
    buttonType: 'primary',
    buttonStatus: 'danger',
  },
])

const rowSelection = ref<TableRowSelection>({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false,
})

function handleSelectionChange(keys: string[]) {
  return handleSelectionChangeFnX(keys, dataList.value?.list, 'info_id', 'info_id')
}

// 删除数据
async function handleDelete(row?: loginLog) {
  await useDeleteFn(
    ApiSysLoginLog.delete,
    'info_id',
    ids,
    'info_id',
    values,
    'info_ids',
    row,
    getList,
  )
}

// 清空日志
function handleClean() {
  Modal.warning({
    title: '确认清空',
    hideCancel: false,
    titleAlign: 'start',
    content: '是否确认清空所有登录日志数据项?',
    okText: '确认',
    cancelText: '取消',
    draggable: true,
    onOk: async () => {
      const { execute } = useDelete(ApiSysLoginLog.clean)
      await execute()
      Message.success('清空登录日志成功')
      await getList()
    },
    onCancel: async () => Message.info('取消清空操作'),
  })
}
</script>

<template>
  <div>
    <IuQueryForm
      v-show="showSearch"
      v-model:form-value="queryParams"
      v-model:form-items="queryFormItems"
      @query="getList"
    />
    <!-- 操作区域 -->
    <a-row :gutter="10" class="m-b-8px">
      <a-col v-for="(item, index) in operateButtons" :key="index" :span="1.5">
        <IuButton
          :auth="item.auth"
          :label="item.label"
          :icon="item.icon"
          :disabled="item.disabled"
          :type="item.buttonType"
          :status="item.buttonStatus"
          :fn="item.fn"
        />
      </a-col>
      <RightToolBar v-model:showSearch="showSearch" @query-table="getList" />
    </a-row>

    <a-table
      :columns="columns"
      :data="dataList?.list"
      :row-selection="rowSelection"
      :loading="isLoading"
      row-key="info_id"
      :scroll="{ minWidth: 800 }"
      :pagination="false"
      @selection-change="handleSelectionChange"
    >
      <template #operation="{ record }">
        <a-button
          v-if="hasPermission(ApiSysDictType.delete)"
          type="text"
          shape="round"
          status="danger"
          @click="handleDelete(record)"
        >
          {{ t('common.delete') }}
          <template #icon>
            <IconDelete />
          </template>
        </a-button>
      </template>
    </a-table>
    <Pagination
      v-show="dataList?.total && dataList.total > 0"
      v-model:limit="queryParams.page_size"
      v-model:page="queryParams.page_num"
      :total="dataList?.total"
      @pagination="getList"
    />
  </div>
</template>
