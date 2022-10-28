<template>
  <div>
    <el-card class="m-b-20px">
      <template #header>
        <div>
          <span>{{ title }}</span>
        </div>
      </template>
      <el-table :data="tableData" tooltip-effect="light">
        <el-table-column
          v-if="rowOneLabel"
          prop="rowOne"
          :label="rowOneLabel"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          v-if="rowTwoLabel"
          prop="rowTwo"
          :label="rowTwoLabel"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          v-if="rowThreeLabel"
          prop="rowThree"
          :label="rowThreeLabel"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          v-if="rowFourLabel"
          prop="rowFour"
          :label="rowFourLabel"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          v-if="rowFiveLabel"
          prop="rowFive"
          :label="rowFiveLabel"
          :show-overflow-tooltip="true"
        />
      </el-table>
    </el-card>
  </div>
</template>
<script lang="ts" setup name="monitor-table">
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
