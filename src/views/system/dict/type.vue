<script lang="ts" setup>
import { ref } from 'vue'

import { ApiSysDictType, ApiSysPost } from '@/api/apis'
import Pagination from '@/components/common/pagination.vue'
import {
  type listType,
  useDeleteFn,
  useDicts,
  useGet,
  useTableUtil,
} from '@/hooks'
import { dictKey, type dictType, type dictTypeQueryParam } from '@/types/system/dict'
import RightToolBar from '@/components/common/right-tool-bar.vue'
import { systemMenus } from '@/router'
import DictTypeManageQuery from '@/views/system/dict/pages/type/dict-type-mannage-query.vue'
import DictTypeManageOperator from '@/views/system/dict/pages/type/dict-type-manage-operator.vue'
import DictTypeManageTable from '@/views/system/dict/pages/type/dict-type-manage-table.vue'
import DictTypeManageModal from '@/views/system/dict/pages/type/dict-type-manage-modal.vue'

// 导出名称
defineOptions({
  name: systemMenus.dict.path,
})

const showSearch = ref(true)

const modalRef = ref<InstanceType<typeof DictTypeManageModal>>()

const dicts = useDicts(
  dictKey.sysNormalDisable,
)

const { useTableSelectChange } = useTableUtil()
const { handleSelectionChangeFnX, ids, values, single, selected }
    = useTableSelectChange()

const queryParams = ref<dictTypeQueryParam>({
  page_size: 10,
  page_num: 1,
})

const {
  isFetching: isLoading,
  data: dataList,
  execute: getList,
} = useGet<listType<dictType>>(
  ApiSysDictType.getList,
  queryParams,
  { immediate: true },
)

const handAdd = () => modalRef.value?.handleAdd()
const handleUpdate = (row?: dictType) => modalRef.value?.handleUpdate(row)

async function handleDelete(row?: dictType) {
  await useDeleteFn(
    ApiSysPost.delete,
    'dict_type_id',
    ids,
    'dict_name',
    values,
    'dict_type_ids',
    row,
    getList,
  )
}
</script>

<template>
  <div>
    <DictTypeManageQuery
      v-model:query-params="queryParams"
      v-model:show-search="showSearch"
      :dicts="dicts"
      @get-list="getList"
    />
    <!-- 操作区域 -->
    <a-row :gutter="10" class="m-b-8px">
      <DictTypeManageOperator
        :selected="selected"
        :single="single"
        @handle-delete="handleDelete"
        @handle-update="handleUpdate"
        @hand-add="handAdd"
      />
      <RightToolBar v-model:showSearch="showSearch" @query-table="getList" />
    </a-row>
    <!-- 表格区域 -->
    <DictTypeManageTable
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
    <DictTypeManageModal
      ref="modalRef"
      :ids="ids"
      :dicts="dicts"
      @get-list="getList"
    />
  </div>
</template>
