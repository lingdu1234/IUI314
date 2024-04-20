<script lang="ts" setup>
import { type PropType, ref, watchEffect } from 'vue'

import type { TableColumnData } from '@arco-design/web-vue'
import type { MonitorTable } from '@/types/system/server-monitor'

defineOptions({ name: 'MonitorTable' })

const props = defineProps({
  title: { type: String, required: true },
  tableData: {
    type: Array as PropType<MonitorTable[]>,
    required: true,
  },
  rowOneLabel: { type: String },
  rowTwoLabel: { type: String },
  rowThreeLabel: { type: String },
  rowFourLabel: { type: String },
  rowFiveLabel: { type: String },
})
const columns = ref<TableColumnData[]> ([
  {
    title: props.rowOneLabel,
    dataIndex: 'rowOne',
    ellipsis: true,
    tooltip: true,
  },
  {
    title: props.rowTwoLabel,
    dataIndex: 'rowTwo',
    ellipsis: true,
    tooltip: true,
  },

])

watchEffect(() => {
  if (props.rowThreeLabel) {
    columns.value.push(
      {
        title: props.rowThreeLabel,
        dataIndex: 'rowThree',
        ellipsis: true,
        tooltip: true,
      },
    )
  }
  if (props.rowFourLabel) {
    columns.value.push(
      {
        title: props.rowFourLabel,
        dataIndex: 'rowFour',
        ellipsis: true,
        tooltip: true,
      },
    )
  }
  if (props.rowFiveLabel) {
    columns.value.push(
      {
        title: props.rowFiveLabel,
        dataIndex: 'rowFive',
        ellipsis: true,
        tooltip: true,
      },
    )
  }
})
</script>

<template>
  <div>
    <a-card class="m-b-20px">
      <template #title>
        <div>
          <span>{{ title }}</span>
        </div>
      </template>
      <a-table :data="tableData" :columns="columns" :pagination="false" />
    </a-card>
  </div>
</template>
