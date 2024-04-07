<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'

import type { TableRowSelection } from '@arco-design/web-vue'
import { IconDelete, IconEdit } from '@arco-design/web-vue/es/icon'
import { ApiSysUser } from '@/api/apis'
import Pagination from '@/components/common/pagination.vue'
import RightToolBar from '@/components/common/right-tool-bar.vue'
import {
  emitter,
  hasPermission,
} from '@/hooks'
import IuQueryForm from '@/components/iui/iu-query-form.vue'
import IuButton from '@/components/iui/iu-button.vue'
import IuModal from '@/components/iui/iu-modal.vue'
import { useUserForm } from '@/views/system/auth/hooks/useUserForm'

// 导出名称
defineOptions({
  name: 'UserManageForm',
})
const props = defineProps({
  deptId: {
    type: String,
  },
})
onUnmounted(() => emitter.off('dept_tree'))
const showSearch = ref(true)

const {
  open,
  title,
  form,
  modalIcon,
  queryParams,
  isLoading,
  dataList,
  getList,
  queryFormItems,
  modalFormItems,
  columns,
  operateButtons,
  handleSelectionChangeFnX,
  handleDelete,
  handleResetPwd,
  handleUpdate,
  submitForm,
  optionsInit,
} = useUserForm()

const rowSelection = ref<TableRowSelection>({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false,
})

function handleSelectionChange(keys: (string | number)[]) {
  return handleSelectionChangeFnX(keys, dataList.value?.list, 'id', 'user_name')
}

onMounted(() => optionsInit())

watch(
  () => props.deptId,
  (v) => {
    queryParams.value.dept_id = v
    getList()
  },
)
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
      row-key="id"
      :scroll="{ minWidth: 800 }"
      :pagination="false"
      @selection-change="handleSelectionChange"
    >
      <template #operation="{ record }">
        <a-button
          v-if="hasPermission(ApiSysUser.edit)"
          type="text"
          shape="round"
          @click="handleUpdate(record)"
        >
          <template #icon>
            <IconEdit />
          </template>
        </a-button>
        <a-button
          v-if="hasPermission(ApiSysUser.delete)"
          type="text"
          shape="round"
          status="danger"
          @click="handleDelete(record)"
        >
          <template #icon>
            <IconDelete />
          </template>
        </a-button>
        <a-button
          v-if="hasPermission(ApiSysUser.resetPwd)"
          type="text"
          shape="round"
          status="danger"
          @click="handleResetPwd(record)"
        >
          <template #icon>
            <IconTool />
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
    <IuModal
      v-model:visible="open"
      v-model:form-value="form"
      :form-items="modalFormItems"
      :icon="modalIcon"
      :title="title"
      :item-width="250"
      :default-col="2"
      @handle-ok="submitForm"
    />
  </div>
</template>
