<template>
  <v-chart
    class="chart flex justify-center"
    ref="chartRef"
    :autoresize="true"
  />
</template>
<script lang="ts" setup name="gauge-echart">
import { type GaugeSeriesOption, GaugeChart } from 'echarts/charts'
import {
  type TooltipComponentOption,
  TooltipComponent,
} from 'echarts/components'
import { type ComposeOption, use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import type { ECBasicOption } from 'echarts/types/dist/shared'
import { ref, watch } from 'vue'
import VChart from 'vue-echarts'
type EChartsOption = ComposeOption<TooltipComponentOption | GaugeSeriesOption>

use([TooltipComponent, GaugeChart, CanvasRenderer])

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

const chartHeight = ref(props.height)

const option = ref<EChartsOption>()

const chartRef = ref<InstanceType<typeof VChart>>()

const initOption = (percent: number, name: string) => {
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
            name: name,
          },
        ],
      },
    ],
  }
}

const init_chart = () => {
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
  { deep: true, immediate: true }
)
</script>
<style scoped>
.chart {
  height: v-bind(chartHeight);
}
</style>
