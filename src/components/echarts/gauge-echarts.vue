<script lang="ts" setup>
import { GaugeChart, type GaugeSeriesOption } from 'echarts/charts'
import {
  TooltipComponent,
  type TooltipComponentOption,
} from 'echarts/components'
import { type ComposeOption, use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import type { ECBasicOption } from 'echarts/types/dist/shared'
import { ref, watch } from 'vue'
import VChart from 'vue-echarts'

defineOptions({ name: 'GaugeEcharts' })

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  percent: {
    type: Number,
    required: true,
  },
  height: {
    type: String,
    default: '400px',
  },
})

type EChartsOption = ComposeOption<TooltipComponentOption | GaugeSeriesOption>

use([TooltipComponent, GaugeChart, CanvasRenderer])

const option = ref<EChartsOption>()

const chartRef = ref<InstanceType<typeof VChart>>()

function initOption(percent: number, name: string) {
  option.value = {
    tooltip: {
      formatter: '{a} <br/>{b} : {c}%',
    },
    series: [
      {
        name: props.name,
        type: 'gauge',
        progress: {
          show: true,
        },
        detail: {
          valueAnimation: true,
          formatter: '{value}',
        },
        data: [
          {
            value: percent,
            name,
          },
        ],
      },
    ],
  }
}

function init_chart() {
  initOption(props.percent, props.name)
  chartRef.value?.setOption(option.value as ECBasicOption, {
    notMerge: true,
  })
}

watch(
  [() => props.percent, () => props.name],
  () => {
    init_chart()
  },
  { deep: true, immediate: true },
)
</script>

<template>
  <VChart
    ref="chartRef"
    :style="{ height: props.height }"
    class="flex justify-center"
    :autoresize="true"
  />
</template>
