<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="24" :md="12">
        <Gauge name="CPU" :percent="cpuUsage" />
      </el-col>
      <el-col :span="24" :md="12">
        <Gauge name="MEMORY" :percent="memoryUsage" />
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24" :md="12">
        <MonitorTableVue
          title="CPU"
          :table-data="cpuData"
          :row-one-label="t('monitor.attribute')"
          :row-two-label="t('monitor.system')"
        />
      </el-col>
      <el-col :span="24" :md="12">
        <MonitorTableVue
          :title="t('monitor.memory')"
          :table-data="memoryData"
          :row-one-label="t('monitor.attribute')"
          :row-two-label="t('monitor.memory')"
          :row-three-label="t('monitor.thisSystem')"
        />
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24" :md="12">
        <MonitorTableVue
          :title="t('monitor.serverInfo')"
          :table-data="serverData"
          :row-one-label="t('monitor.attribute')"
          :row-two-label="t('monitor.system')"
        />
      </el-col>
      <el-col :span="24" :md="12">
        <MonitorTableVue
          :title="t('monitor.serverInfo')"
          :table-data="programData"
          :row-one-label="t('monitor.attribute')"
          :row-two-label="t('monitor.system')"
          :row-three-label="t('monitor.thisSystem')"
        />
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <MonitorTableVue
          title="net work"
          :table-data="netData"
          row-one-label="name"
          row-two-label="received"
          row-three-label="total received"
          row-four-label="transmitted"
          row-five-label="total transmitted"
        />
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts" setup>
import { useIntervalFn } from '@vueuse/core'
import { onActivated, onDeactivated, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { ApiSysServiceMonitor } from '@/api/sysApis'
import Gauge from '@/components/echarts/gauge.vue'
import { useGet } from '@/hooks'
import type { MessageSchema } from '@/i18n'
import { systemMenus } from '@/router'
import type { MonitorTable, ServerMonitor } from '@/types/system/server-monitor'

import MonitorTableVue from './pages/monitor-table.vue'

const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })

const cpuData = ref<MonitorTable[]>([])
const memoryData = ref<MonitorTable[]>([])
const serverData = ref<MonitorTable[]>([])
const programData = ref<MonitorTable[]>([])
const netData = ref<MonitorTable[]>([])
const cpuUsage = ref(0)
const memoryUsage = ref(0)
const getServerData = async () => {
  const { data, execute } = useGet<ServerMonitor>(ApiSysServiceMonitor.getList)
  await execute()

  cpuUsage.value = parseFloat(
    (data.value?.cpu.total_use! / data.value?.cpu.processors!).toFixed(4)
  )
  memoryUsage.value = parseFloat(
    (
      (100 * data.value?.memory.used_memory!) /
      data.value?.memory.totol_memory!
    ).toFixed(4)
  )

  cpuData.value = [
    {
      rowOne: t('monitor.cores'),
      rowTwo: data.value?.cpu.cores,
    },
    {
      rowOne: t('monitor.processors'),
      rowTwo: data.value?.cpu.processors,
    },
    {
      rowOne: t('monitor.cpuUsage'),
      rowTwo: cpuUsage.value + '%',
    },
    {
      rowOne: 'Load Avg 5',
      rowTwo: data.value?.cpu_load.five.toFixed(4) + '%',
    },
    {
      rowOne: 'Load Avg 15',
      rowTwo: data.value?.cpu_load.fifteen.toFixed(4) + '%',
    },
  ]
  memoryData.value = [
    {
      rowOne: t('monitor.total'),
      rowTwo: memoryFormat(data.value?.memory.totol_memory),
    },
    {
      rowOne: t('monitor.used'),
      rowTwo: memoryFormat(data.value?.memory.used_memory),
      rowThree: memoryFormat(data.value?.process.used_memory),
    },
    {
      rowOne: t('monitor.swap'),
      rowTwo: memoryFormat(data.value?.memory.totol_swap),
    },
    {
      rowOne: t('monitor.usedSwap'),
      rowTwo: memoryFormat(data.value?.memory.used_swap),
      rowThree: memoryFormat(data.value?.process.used_virtual_memory),
    },
    {
      rowOne: t('monitor.usage'),
      rowTwo: memoryUsage.value + '%',
      rowThree:
        (
          (100 * data.value?.process.used_memory!) /
          data.value?.memory.totol_memory!
        ).toFixed(4) + '%',
    },
  ]
  serverData.value = [
    {
      rowOne: t('monitor.serverName'),
      rowTwo: data.value?.server.host_name,
    },
    {
      rowOne: 'CPU',
      rowTwo: data.value?.cpu.name,
    },
    {
      rowOne: 'arch',
      rowTwo: data.value?.cpu.arch,
    },
    {
      rowOne: 'system',
      rowTwo: data.value?.server.oper_sys_name,
    },
    {
      rowOne: 'system version',
      rowTwo: data.value?.server.system_version,
    },
    {
      rowOne: 'system kernel',
      rowTwo: data.value?.server.system_kerne,
    },
  ]
  programData.value = [
    {
      rowOne: 'program name',
      rowTwo: data.value?.process.name,
    },
    {
      rowOne: 'start time',
      rowTwo: new Date(data.value?.process.start_time! * 1000).toLocaleString(),
    },
    {
      rowOne: 'run time',
      rowTwo: timeFormat2DHMS(data.value?.process.run_time!),
    },
    {
      rowOne: 'cpu usage',
      rowTwo:
        (data.value?.process.cup_usage! / data.value?.cpu.processors!).toFixed(
          4
        ) + '%',
    },
    {
      rowOne: 'disk read',
      rowTwo: memoryFormat(data.value?.process.disk_usage.total_read_bytes!),
    },
    {
      rowOne: 'disk write',
      rowTwo: memoryFormat(data.value?.process.disk_usage.total_written_bytes!),
    },
  ]

  const netDataV: MonitorTable[] = []
  data.value?.network.forEach((v) => {
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

const memoryFormat = (size: any) => {
  size = parseFloat(size) / 1024
  let rank = 0
  let rankChar = 'Bytes'
  while (size > 1024 && rankChar != 'GB') {
    size = size / 1024
    rank++
    if (rank === 1) {
      rankChar = 'KB'
    } else if (rank === 2) {
      rankChar = 'MB'
    } else if (rank === 3) {
      rankChar = 'GB'
    }
  }
  return size.toFixed(2) + ' ' + rankChar
}

const timeFormat2DHMS = (sec: any) => {
  sec = parseInt(sec)
  let day = parseInt((sec / (24 * 3600)).toFixed(1))
  let hour = parseInt(((sec % (24 * 3600)) / 3600).toFixed(1))
  let min = parseInt(((sec % 3600) / 60).toFixed(1))
  let second = parseInt((sec % 60).toFixed(1))
  let res = ''

  if (day > 0) {
    res += day + '天'
  }
  if (hour > 0) {
    res += hour + '小时'
  }
  if (min > 0) {
    res += min + '分'
  }
  if (second > 0) {
    res += second + '秒'
  }
  return res
}

const { pause, resume } = useIntervalFn(() => getServerData(), 1500)
onActivated(() => {
  resume()
})
onDeactivated(() => {
  pause()
})
// 导出名称
defineOptions({
  name: systemMenus.serverMonitor.name,
})
</script>
