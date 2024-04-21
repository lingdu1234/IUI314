<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import MonitorTableVue from './pages/monitor-table.vue'
import { ApiSysServiceMonitor } from '@/api/sysApis'
import type { MessageSchema } from '@/i18n'
import { systemMenus } from '@/router'
import type { MonitorTable, ServerMonitor } from '@/types/system/server-monitor'
import { useSSE } from '@/hooks'
import GaugeEcharts from '@/components/echarts/gauge-echarts.vue'

// 导出名称
defineOptions({
  name: systemMenus.serverMonitor.name,
})

const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })

const cpuData = ref<MonitorTable[]>([])
const memoryData = ref<MonitorTable[]>([])
const serverData = ref<MonitorTable[]>([])
const programData = ref<MonitorTable[]>([])
const netData = ref<MonitorTable[]>([])
const cpuUsage = ref(0)
const memoryUsage = ref(0)

function setServerData(data: ServerMonitor) {
  cpuUsage.value = Number.parseFloat(
    (data.cpu.total_use! / data.cpu.processors!).toFixed(4),
  )
  memoryUsage.value = Number.parseFloat(
    ((100 * data.memory.used_memory!) / data.memory.total_memory!).toFixed(4),
  )

  cpuData.value = [
    {
      rowOne: t('monitor.cores'),
      rowTwo: data.cpu.cores,
    },
    {
      rowOne: t('monitor.processors'),
      rowTwo: data.cpu.processors,
    },
    {
      rowOne: t('monitor.cpuUsage'),
      rowTwo: `${cpuUsage.value}%`,
    },
    {
      rowOne: 'Load Avg 5',
      rowTwo: `${data.cpu_load.five.toFixed(4)}%`,
    },
    {
      rowOne: 'Load Avg 15',
      rowTwo: `${data.cpu_load.fifteen.toFixed(4)}%`,
    },
  ]
  memoryData.value = [
    {
      rowOne: t('monitor.total'),
      rowTwo: memoryFormat(data.memory.total_memory),
    },
    {
      rowOne: t('monitor.used'),
      rowTwo: memoryFormat(data.memory.used_memory),
      rowThree: memoryFormat(data.process.used_memory),
    },
    {
      rowOne: t('monitor.swap'),
      rowTwo: memoryFormat(data.memory.total_swap),
    },
    {
      rowOne: t('monitor.usedSwap'),
      rowTwo: memoryFormat(data.memory.used_swap),
      rowThree: memoryFormat(data.process.used_virtual_memory),
    },
    {
      rowOne: t('monitor.usage'),
      rowTwo: `${memoryUsage.value}%`,
      rowThree:
        `${((100 * data.process.used_memory!) / data.memory.total_memory!).toFixed(
          4,
        )}%`,
    },
  ]
  serverData.value = [
    {
      rowOne: t('monitor.serverName'),
      rowTwo: data.server.host_name,
    },
    {
      rowOne: 'CPU',
      rowTwo: data.cpu.name,
    },
    {
      rowOne: 'arch',
      rowTwo: data.cpu.arch,
    },
    {
      rowOne: 'system',
      rowTwo: data.server.oper_sys_name,
    },
    {
      rowOne: 'system version',
      rowTwo: data.server.system_version,
    },
    {
      rowOne: 'system kernel',
      rowTwo: data.server.system_kerne,
    },
  ]
  programData.value = [
    {
      rowOne: 'program name',
      rowTwo: data.process.name,
    },
    {
      rowOne: 'start time',
      rowTwo: new Date(data.process.start_time! * 1000).toLocaleString(),
    },
    {
      rowOne: 'run time',
      rowTwo: timeFormat2DHMS(data.process.run_time!),
    },
    {
      rowOne: 'cpu usage',
      rowTwo: `${(data.process.cup_usage! / data.cpu.processors!).toFixed(4)}%`,
    },
    {
      rowOne: 'disk read',
      rowTwo: memoryFormat(data.process.disk_usage.total_read_bytes!),
    },
    {
      rowOne: 'disk write',
      rowTwo: memoryFormat(data.process.disk_usage.total_written_bytes!),
    },
  ]

  const netDataV: MonitorTable[] = []
  data.network.forEach((v) => {
    const item: MonitorTable = {
      rowOne: v.name,
      rowTwo: memoryFormat(v.received),
      rowThree: memoryFormat(v.total_received),
      rowFour: memoryFormat(v.transmitted),
      rowFive: memoryFormat(v.total_transmitted),
    }
    netDataV.push(item)
  })
  netData.value = netDataV
}

function memoryFormat(size: any) {
  size = Number.parseFloat(size)
  let rank = 0
  let rankChar = 'Bytes'
  while (size > 1024 && rankChar !== 'GB') {
    size = size / 1024
    rank++
    if (rank === 1)
      rankChar = 'KB'
    else if (rank === 2)
      rankChar = 'MB'
    else if (rank === 3)
      rankChar = 'GB'
  }
  return `${size.toFixed(2)} ${rankChar}`
}

function timeFormat2DHMS(sec: any) {
  sec = Number.parseInt(sec)
  const day = Number.parseInt((sec / (24 * 3600)).toFixed(1))
  const hour = Number.parseInt(((sec % (24 * 3600)) / 3600).toFixed(1))
  const min = Number.parseInt(((sec % 3600) / 60).toFixed(1))
  const second = Number.parseInt((sec % 60).toFixed(1))
  let res = ''

  if (day > 0)
    res += `${day}天`

  if (hour > 0)
    res += `${hour}小时`

  if (min > 0)
    res += `${min}分`

  if (second > 0)
    res += `${second}秒`

  return res
}

const { data } = useSSE(ApiSysServiceMonitor.getEvent)

// async function getServerData() {
//   const { data, execute } = useGet<ServerMonitor>(ApiSysServiceMonitor.getList)
//   await execute()
//   setServerData(data.value!)
// }
// const { pause, resume } = useIntervalFn(() => getServerData(), 2000)
// onActivated(() => resume())
// onDeactivated(() => pause())
// onUnmounted(() => pause())

watch(
  () => data.value,
  v => setServerData(JSON.parse(v!)),
)
</script>

<template>
  <div>
    <a-grid :col-gap="20" :cols="{ xs: 1, sm: 1, md: 1, lg: 2, xl: 2, xxl: 2 }">
      <a-grid-item>
        <GaugeEcharts name="CPU" :percent="cpuUsage" />
      </a-grid-item>
      <a-grid-item>
        <GaugeEcharts name="MEMORY" :percent="memoryUsage" />
      </a-grid-item>
    </a-grid>
    <a-grid :col-gap="20" :cols="{ xs: 1, sm: 1, md: 1, lg: 2, xl: 2, xxl: 2 }">
      <a-grid-item>
        <MonitorTableVue
          title="CPU"
          :table-data="cpuData"
          :row-one-label="t('monitor.attribute')"
          :row-two-label="t('monitor.system')"
        />
      </a-grid-item>
      <a-grid-item>
        <MonitorTableVue
          :title="t('monitor.memory')"
          :table-data="memoryData"
          :row-one-label="t('monitor.attribute')"
          :row-two-label="t('monitor.memory')"
          :row-three-label="t('monitor.thisSystem')"
        />
      </a-grid-item>
    </a-grid>
    <a-grid :col-gap="20" :cols="{ xs: 1, sm: 1, md: 1, lg: 2, xl: 2, xxl: 2 }">
      <a-grid-item>
        <MonitorTableVue
          :title="t('monitor.serverInfo')"
          :table-data="serverData"
          :row-one-label="t('monitor.attribute')"
          :row-two-label="t('monitor.system')"
        />
      </a-grid-item>
      <a-grid-item>
        <MonitorTableVue
          :title="t('monitor.serverInfo')"
          :table-data="programData"
          :row-one-label="t('monitor.attribute')"
          :row-two-label="t('monitor.system')"
        />
      </a-grid-item>
    </a-grid>
    <a-grid :col-gap="20" :cols="1">
      <a-grid-item>
        <MonitorTableVue
          title="net work"
          :table-data="netData"
          row-one-label="name"
          row-two-label="received"
          row-three-label="total received"
          row-four-label="transmitted"
          row-five-label="total transmitted"
        />
      </a-grid-item>
    </a-grid>
  </div>
</template>
