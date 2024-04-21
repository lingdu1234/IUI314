<script lang="ts" setup>
import { ref } from 'vue'

import { OnlineUserQuery, OnlineUserTable } from './pages/online-user'
import { ApiSysOnlineUser } from '@/api/apis'
import Pagination from '@/components/common/pagination.vue'
import RightToolBar from '@/components/common/right-tool-bar.vue'
import {
  type listType,
  useDicts,
  useGet,
} from '@/hooks'
import { systemMenus } from '@/router'
import { dictKey } from '@/types/system/dict'
import type { onlineUser, onlineUserQueryParam } from '@/types/system/online-user'

// 导出名称
defineOptions({
  name: systemMenus.onlineUser.path,
})

const showSearch = ref(true)

const dicts = useDicts(dictKey.sysCommonStatus)

const queryParams = ref<onlineUserQueryParam>({
  page_size: 10,
  page_num: 1,
})

const {
  data: dataList,
  execute: getList,
} = useGet<listType<onlineUser>>(
  ApiSysOnlineUser.getList,
  queryParams,
  { immediate: true },
)
</script>

<template>
  <div>
    <OnlineUserQuery
      v-model:query-params="queryParams"
      v-model:show-search="showSearch"
      :dicts="dicts"
      @get-list="getList"
    />
    <!-- 操作区域 -->
    <a-row :gutter="10" class="m-b-8px">
      <RightToolBar v-model:showSearch="showSearch" @query-table="getList" />
    </a-row>
    <!-- 表格区域 -->
    <OnlineUserTable
      :dicts="dicts"
      :table-data="dataList && dataList?.list"
      @get-list="getList"
    />
    <Pagination
      v-show="dataList?.total && dataList.total > 0"
      v-model:limit="queryParams.page_size"
      v-model:page="queryParams.page_num"
      :total="dataList?.total"
      @pagination="getList"
    />
  </div>
</template>
