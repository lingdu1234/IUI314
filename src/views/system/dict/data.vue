<script lang="ts" setup>
import { ref } from 'vue'

import { useRoute } from 'vue-router'
import { ApiSysDictData } from '@/api/apis'
import Pagination from '@/components/common/pagination.vue'
import {
  type listType,
  useDeleteFn,
  useDicts,
  useGet,
  useTableUtil,
} from '@/hooks'
import { type dictData, type dictDataQueryParam, dictKey } from '@/types/system/dict'
import RightToolBar from '@/components/common/right-tool-bar.vue'
import DictDataManageQuery from '@/views/system/dict/pages/data/dict-data-mannage-query.vue'
import DictDataManageOperator from '@/views/system/dict/pages/data/dict-data-manage-operator.vue'
import DictDataManageTable from '@/views/system/dict/pages/data/dict-data-manage-table.vue'
import DictDataManageModal from '@/views/system/dict/pages/data/dict-data-manage-modal.vue'

// 导出名称
defineOptions({ name: 'DictData' })

const showSearch = ref(true)

const modalRef = ref<InstanceType<typeof DictDataManageModal>>()

const dicts = useDicts(
  dictKey.sysNormalDisable,
)
const route = useRoute()

const { useTableSelectChange } = useTableUtil()
const { handleSelectionChangeFnX, ids, values, single, selected }
    = useTableSelectChange()

const queryParams = ref<dictDataQueryParam>({
  page_size: 10,
  page_num: 1,
  dict_type: route.query.dict_type as string,
})

const {
  isFetching: isLoading,
  data: dataList,
  execute: getList,
} = useGet<listType<dictData>>(
  ApiSysDictData.getList,
  queryParams,
  { immediate: true },
)

const handleAdd = () => modalRef.value?.handleAdd()
const handleUpdate = (row?: dictData) => modalRef.value?.handleUpdate(row)

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
</script>

<template>
  <div>
    <DictDataManageQuery
      v-model:query-params="queryParams"
      v-model:show-search="showSearch"
      :dicts="dicts"
      @get-list="getList"
    />
    <!-- 操作区域 -->
    <a-row :gutter="10" class="m-b-8px">
      <DictDataManageOperator
        :selected="selected"
        :single="single"
        @handle-delete="handleDelete"
        @handle-update="handleUpdate"
        @handle-add="handleAdd"
      />
      <RightToolBar v-model:showSearch="showSearch" @query-table="getList" />
    </a-row>
    <!-- 表格区域 -->
    <DictDataManageTable
      :is-loading="isLoading"
      :dicts="dicts"
      :table-data="dataList && dataList?.list"
      @handle-delete="handleDelete"
      @handle-update="handleUpdate"
      @handle-selection-change-fn="handleSelectionChangeFnX"
    />
    <Pagination
      v-show="dataList?.total && dataList.total > 0"
      v-model:limit="queryParams.page_size"
      v-model:page="queryParams.page_num"
      :total="dataList?.total"
      @pagination="getList"
    />
    <DictDataManageModal
      ref="modalRef"
      :ids="ids"
      :dict-type="queryParams.dict_type as string"
      :dicts="dicts"
      @get-list="getList"
    />
  </div>
</template>
