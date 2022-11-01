<template>
  <v-chart class="chart flex justify-center" :option="option" />
</template>
<script lang="ts" setup name="gauge-echart">
import { type GaugeSeriesOption, GaugeChart } from 'echarts/charts'
import {
  type TooltipComponentOption,
  TooltipComponent,
} from 'echarts/components'
import { type ComposeOption, use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { ref, watch } from 'vue'
import VChart from 'vue-echarts'
type EChartsOption = ComposeOption<TooltipComponentOption | GaugeSeriesOption>

use([TooltipComponent, GaugeChart, CanvasRenderer])

const props = defineProps({
  name: {
    type: String,
  },
  percent: {
    type: Number,
  },
  height: {
    type: String,
    default: '400px',
  },
})

const chartHeight = ref(props.height)

const option = ref<EChartsOption>()

const initOption = () => {
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
            value: props.percent,
            name: props.name,
          },
        ],
      },
    ],
  }
}

watch(
  () => props.percent,
  () => {
    initOption()
  },
  { deep: true }
)
</script>
<style scoped>
.chart {
  height: v-bind(chartHeight);
}
</style>
