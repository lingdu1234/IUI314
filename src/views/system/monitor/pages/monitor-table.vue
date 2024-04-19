<script lang="ts" setup name="monitor-table">
import { ElTable, ElTableColumn } from 'element-plus'
import type { PropType } from 'vue'

import type { MonitorTable } from '@/types/system/server-monitor'

defineProps({
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
</script>

<template>
  <div>
    <a-card class="m-b-20px">
      <template #title>
        <div>
          <span>{{ title }}</span>
        </div>
      </template>
      <ElTable :data="tableData" tooltip-effect="light">
        <ElTableColumn
          v-if="rowOneLabel"
          prop="rowOne"
          :label="rowOneLabel"
          :show-overflow-tooltip="true"
        />
        <ElTableColumn
          v-if="rowTwoLabel"
          prop="rowTwo"
          :label="rowTwoLabel"
          :show-overflow-tooltip="true"
        />
        <ElTableColumn
          v-if="rowThreeLabel"
          prop="rowThree"
          :label="rowThreeLabel"
          :show-overflow-tooltip="true"
        />
        <ElTableColumn
          v-if="rowFourLabel"
          prop="rowFour"
          :label="rowFourLabel"
          :show-overflow-tooltip="true"
        />
        <ElTableColumn
          v-if="rowFiveLabel"
          prop="rowFive"
          :label="rowFiveLabel"
          :show-overflow-tooltip="true"
        />
      </ElTable>
    </a-card>
  </div>
</template>
