<script lang="ts"  setup>
import { computed, markRaw, onActivated, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { Message, type TableRowSelection } from '@arco-design/web-vue'
import { IconClose, IconDelete, IconEdit, IconPlus } from '@arco-design/web-vue/es/icon'
import { ApiSysDictData, ErrorFlag } from '@/api/apis'
import Pagination from '@/components/common/pagination.vue'
import RightToolBar from '@/components/common/right-tool-bar.vue'
import { TabAction } from '@/components/layout/tab-bar/useTabBar'
import {
  hasPermission,
  parseTime,
  setTabBarEmitter,
  useDeleteFn,
  useGet,
  usePost,
  usePut,
  useTableUtil,
} from '@/hooks'
import type { MessageSchema } from '@/i18n'
import { router } from '@/router'
import {
  type dictData,
  dictKey,
} from '@/types/system/dict'
import IuQueryForm from '@/components/iui/iu-query-form.vue'
import { useDictData } from '@/views/system/dict/useDictData'
import IuButton from '@/components/iui/iu-button.vue'
import IuModal from '@/components/iui/iu-modal.vue'
import DictTag from '@/components/common/dict-tag.vue'

defineOptions({ name: 'DictData' })

const { t } = useI18n<{ message: MessageSchema }>()

const {
  dicts,
  queryFormItems,
  queryParams,
  editFormItems,
  columns,
  getTypeList,
  isLoading,
  dictDataList,
  getList,
} = useDictData()

const { useTableSelectChange } = useTableUtil()
const { handleSelectionChangeFnX, ids, values, single, selected }
  = useTableSelectChange()

function handleSelectionChange(keys: (string | number) []) {
  return handleSelectionChangeFnX(
    keys,
    dictDataList.value?.list,
    'dict_data_id',
    'dict_label',
  )
}

const showSearch = ref(true)

const modalIcon = ref()
const open = ref(false)
const title = ref('')
const form = ref<dictData>({
  status: '1',
  dict_sort: 1,
  is_default: 'N',
})

const rowSelection = ref<TableRowSelection>({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false,
})

const operateButtons = ref<{ [key: string]: any }[]>([
  {
    label: t('common.add'),
    icon: markRaw(IconPlus),
    auth: computed(() => hasPermission(ApiSysDictData.add)),
    disabled: false,
    fn: handleAdd,
    buttonType: 'primary',
    buttonStatus: 'normal',
  },
  {
    label: t('common.edit'),
    icon: markRaw(IconEdit),
    auth: computed(() => hasPermission(ApiSysDictData.edit)),
    disabled: computed(() => !single.value),
    fn: handleUpdate,
    buttonType: 'primary',
    buttonStatus: 'warning',
  },
  {
    label: t('common.delete'),
    icon: markRaw(IconDelete),
    auth: computed(() => hasPermission(ApiSysDictData.delete)),
    disabled: computed(() => !selected.value),
    fn: handleDelete,
    buttonType: 'primary',
    buttonStatus: 'danger',
  },
  {
    label: t('common.close'),
    icon: markRaw(IconClose),
    auth: true,
    disabled: false,
    fn: handleClose,
    buttonType: 'primary',
    buttonStatus: 'normal',
  },
])

function handleAdd() {
  modalIcon.value = markRaw(IconPlus)
  open.value = true
  form.value.dict_type = queryParams.value.dict_type
  title.value = t('common.add') + t('dict.dictData')
}
async function handleUpdate(row?: dictData) {
  modalIcon.value = markRaw(IconEdit)
  open.value = true
  const dict_data_id = row?.dict_data_id || ids.value[0]
  const { data, execute } = useGet(ApiSysDictData.getById, { dict_data_id })
  await execute()
  form.value = data.value as dictData
  title.value = t('common.update') + t('dict.dictData')
}

async function handleDelete(row?: dictData) {
  await useDeleteFn(
    ApiSysDictData.delete,
    'dict_data_id',
    ids,
    'dict_label',
    values,
    'dict_data_ids',
    row,
    getList,
  )
}

async function submitForm() {
  if (form.value.dict_data_id !== undefined) {
    const { execute, data } = usePut(ApiSysDictData.edit, form)
    await execute()
    if (data.value === ErrorFlag)
      return
    Message.success(t('commonTip.updateSuccess'))
  }
  else {
    const { execute, data } = usePost(ApiSysDictData.add, form)
    await execute()
    if (data.value === ErrorFlag)
      return
    Message.success(t('commonTip.addSuccess'))
  }
  open.value = false
  await getList()
}

function handleClose() {
  // 路由回退
  router.back()
  // 关闭当前便签
  setTabBarEmitter(TabAction.current)
}

onActivated(() => {
  getTypeList()
})
onMounted(() => {
  getTypeList()
})
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
      :data="dictDataList?.list"
      :row-selection="rowSelection"
      :loading="isLoading"
      row-key="dict_data_id"
      :scroll="{ minWidth: 800 }"
      :pagination="false"
      @selection-change="handleSelectionChange"
    >
      <template #dictLabel="{ record }">
        <span v-if="record.css_class && record.css_class !== ''">
          <a-tag :color="record.css_class">{{ record.dict_label }}</a-tag>
        </span>
        <span v-else-if="record.list_class && record.list_class !== ''">
          <a-tag :color="record.list_class">{{ record.dict_label }}</a-tag>
        </span>
        <span v-else>
          {{ record.dict_label }}
        </span>
      </template>
      <template #status="{ record }">
        <DictTag
          :options="dicts[dictKey.sysNormalDisable]"
          :value="record.status"
        />
      </template>
      <template #created_at="{ record }">
        <span>{{ parseTime(record.created_at) }}</span>
      </template>
      <template #operation="{ record }">
        <a-button
          v-if="hasPermission(ApiSysDictData.edit)"
          type="text"
          shape="round"
          @click="handleUpdate(record)"
        >
          {{ t('common.edit') }}
          <template #icon>
            <IconEdit />
          </template>
        </a-button>
        <a-button
          v-if="hasPermission(ApiSysDictData.delete)"
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
      v-show="dictDataList?.total && dictDataList.total > 0"
      v-model:limit="queryParams.page_size"
      v-model:page="queryParams.page_num"
      :total="dictDataList?.total"
      @pagination="getList"
    />
    <!-- 添加或修改参数配置对话框 -->
    <IuModal
      v-model:visible="open"
      v-model:form-value="form"
      :form-items="editFormItems"
      :icon="modalIcon"
      :title="title"
      @handle-ok="submitForm"
    />
  </div>
</template>
