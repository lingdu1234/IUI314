<script lang="ts" setup>
import { ref } from 'vue'

import { Message, Modal } from '@arco-design/web-vue'
import { IconDelete } from '@arco-design/web-vue/es/icon'
import { useI18n } from 'vue-i18n'
import { ApiSysOnlineUser } from '@/api/apis'
import Pagination from '@/components/common/pagination.vue'
import RightToolBar from '@/components/common/right-tool-bar.vue'
import {
  hasPermission,
  type listType,
  useDelete,
  useGet,
} from '@/hooks'
import { systemMenus } from '@/router'
import IuQueryForm from '@/components/iui/iu-query-form.vue'
import type { MessageSchema } from '@/i18n'
import { useOnlineUser } from '@/views/system/monitor/hooks/useOnlineUser'
import type { onlineUser, onlineUserQueryParam } from '@/types/system/online-user'

// 导出名称
defineOptions({
  name: systemMenus.onlineUser.path,
})

const showSearch = ref(true)
const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })

const {
  queryFormItems,
  columns,
} = useOnlineUser()
const queryParams = ref<onlineUserQueryParam>({
  page_num: 1,
  page_size: 10,
})

const {
  isFetching: isLoading,
  data: dataList,
  execute: getList,
} = useGet<listType<onlineUser>>(
  ApiSysOnlineUser.getList,
  queryParams,
  { immediate: true },
)

// 清空日志
function handleForceLogout(row?: onlineUser) {
  if (row) {
    Modal.warning({
      title: '确认清空',
      hideCancel: false,
      titleAlign: 'start',
      content: `是否确认强退用户 ${row?.user_name}?`,
      okText: '确认',
      cancelText: '取消',
      draggable: true,
      onOk: async () => {
        const ids = [row?.id]
        const { execute } = useDelete(ApiSysOnlineUser.delete, { ids })
        await execute()
        Message.success(`强退用户 ${row?.user_name} 成功!`)
        await getList()
      },
      onCancel: async () => Message.info('取消操作'),
    })
  }
  else {
    Message.info('用户不存在')
  }
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
      <RightToolBar v-model:showSearch="showSearch" @query-table="getList" />
    </a-row>

    <a-table
      :columns="columns"
      :data="dataList?.list"
      :loading="isLoading"
      row-key="id"
      :scroll="{ minWidth: 800 }"
      :pagination="false"
    >
      <template #operation="{ record }">
        <a-button
          v-if="hasPermission(ApiSysOnlineUser.delete)"
          type="text"
          shape="round"
          status="danger"
          @click="handleForceLogout(record)"
        >
          {{ t('common.kickOff') }}
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
