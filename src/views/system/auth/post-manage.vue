<script lang="ts" setup>
import { ref } from 'vue'

import { ApiSysPost } from '@/api/apis'
import Pagination from '@/components/common/pagination.vue'
import {
  type listType,
  useDeleteFn,
  useDicts,
  useGet,
  useTableUtil,
} from '@/hooks'
import { dictKey } from '@/types/system/dict'
import RightToolBar from '@/components/common/right-tool-bar.vue'
import { systemMenus } from '@/router'
import type { post, postQueryParam } from '@/types/system/post'
import PostManageTable from '@/views/system/auth/pages/post/post-manage-table.vue'
import PostManageOperator from '@/views/system/auth/pages/post/post-manage-operator.vue'
import PostManageQuery from '@/views/system/auth/pages/post/post-mannage-query.vue'
import PostManageModal from '@/views/system/auth/pages/post/post-manage-modal.vue'

// 导出名称
defineOptions({
  name: systemMenus.postManage.path,
})

const showSearch = ref(true)

const modalRef = ref<InstanceType<typeof PostManageModal>>()

const dicts = useDicts(
  dictKey.sysNormalDisable,
)

const { useTableSelectChange } = useTableUtil()
const { handleSelectionChangeFnX, ids, values, single, selected }
    = useTableSelectChange()

const queryParams = ref<postQueryParam>({
  page_size: 10,
  page_num: 1,
})

const {
  isFetching: isLoading,
  data: dataList,
  execute: getList,
} = useGet<listType<post>>(
  ApiSysPost.getList,
  queryParams,
  { immediate: true },
)

const handAdd = () => modalRef.value?.handleAdd()
const handleUpdate = (row?: post) => modalRef.value?.handleUpdate(row)

async function handleDelete(row?: post) {
  await useDeleteFn(
    ApiSysPost.delete,
    'post_id',
    ids,
    'post_name',
    values,
    'post_ids',
    row,
    getList,
  )
}
</script>

<template>
  <div>
    <PostManageQuery
      v-model:query-params="queryParams"
      v-model:show-search="showSearch"
      :dicts="dicts"
      @get-list="getList"
    />
    <!-- 操作区域 -->
    <a-row :gutter="10" class="m-b-8px">
      <PostManageOperator
        :selected="selected"
        :single="single"
        @handle-delete="handleDelete"
        @handle-update="handleUpdate"
        @hand-add="handAdd"
      />
      <RightToolBar v-model:showSearch="showSearch" @query-table="getList" />
    </a-row>
    <!-- 表格区域 -->
    <PostManageTable
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
    <PostManageModal
      ref="modalRef"
      :ids="ids"
      :dicts="dicts"
      @get-list="getList"
    />
  </div>
</template>
