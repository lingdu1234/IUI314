<template>
  <el-dialog
    :model-value="open"
    :before-close="cancel"
    :title="t('vueCron.title')"
    append-to-body
    width="800px"
  >
    <el-tabs v-model="activeTab" class="cronTabs">
      <el-tab-pane :label="t('vueCron.secondTitle')" name="second">
        <SecondOrMinute
          :cron-type-v="CronType.SECOND"
          @set-cron-data="setCronData"
        />
      </el-tab-pane>
      <el-tab-pane :label="t('vueCron.minuteTitle')" name="minute">
        <SecondOrMinute
          :cron-type-v="CronType.MINUTE"
          @set-cron-data="setCronData"
        />
      </el-tab-pane>
      <el-tab-pane :label="t('vueCron.hourTitle')" name="hour">
        <Hour :cron-type-v="CronType.HOUR" @set-cron-data="setCronData" />
      </el-tab-pane>
      <el-tab-pane :label="t('vueCron.dayTitle')" name="day">
        <Day :cron-type-v="CronType.DAY" @set-cron-data="setCronData" />
      </el-tab-pane>
      <el-tab-pane :label="t('vueCron.monthTitle')" name="month">
        <Month :cron-type-v="CronType.MONTH" @set-cron-data="setCronData" />
      </el-tab-pane>
      <el-tab-pane :label="t('vueCron.weekTitle')" name="week">
        <Week :cron-type-v="CronType.WEEK" @set-cron-data="setCronData" />
      </el-tab-pane>
      <el-tab-pane :label="t('vueCron.yearTitle')" name="year">
        <Year :cron-type-v="CronType.YEAR" @set-cron-data="setCronData" />
      </el-tab-pane>
    </el-tabs>
    <el-table
      :data="tableData"
      :span-method="arraySpanMethod"
      border
      tooltip-effect="light"
      style="width: 100%"
    >
      <el-table-column prop="id" label="#" align="center" width="130" />
      <el-table-column
        prop="second"
        :label="t('vueCron.secondTitle')"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="minute"
        :label="t('vueCron.minuteTitle')"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="hour"
        :label="t('vueCron.hourTitle')"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="day"
        :label="t('vueCron.dayTitle')"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="month"
        :label="t('vueCron.monthTitle')"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="week"
        :label="t('vueCron.weekTitle')"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="year"
        :label="t('vueCron.yearTitle')"
        align="center"
        show-overflow-tooltip
      />
    </el-table>
    <el-card class="m-t-10px cronCard">
      <template #header>
        <div>
          <span>next run time</span>
        </div>
      </template>
      <el-col>
        <el-row v-for="i in 3" :key="i">
          <div
            v-for="j in 4"
            :key="i + '' + j"
            :class="j !== 4 ? 'm-r-50px' : ''"
          >
            {{ next_ten[(i - 1) * 4 + (j - 1)] }}
          </div>
        </el-row>
      </el-col>
    </el-card>
    <div class="m-t-10px">
      <el-alert
        :title="validTip"
        :type="validType"
        show-icon
        :closable="false"
      />
    </div>
    <template #footer>
      <div class="flex justify-center">
        <el-button type="warning" @click="validateCron">
          {{ t('common.validate') }}
        </el-button>
        <el-button type="primary" @click="submitForm">
          {{ t('common.submit') }}
        </el-button>
        <el-button @click="cancel">
          {{ t('common.cancel') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup name="vue-cron">
import {
  ElAlert,
  ElButton,
  ElCard,
  ElCol,
  ElDialog,
  ElMessage,
  ElRow,
  ElTable,
  ElTableColumn,
  ElTabPane,
  ElTabs,
} from 'element-plus'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { ErrorFlag } from '@/api/apis'
import { ApiSysScheduledTasks } from '@/api/sysApis'
import { usePost } from '@/hooks'
import type { MessageSchema } from '@/i18n'
import { CronType } from '@/types/system/cron'
import type { validateRes } from '@/types/system/scheduled-tasks'

import Day from './pages/day.vue'
import Hour from './pages/hour.vue'
import Month from './pages/month.vue'
import SecondOrMinute from './pages/second-or-minute.vue'
import Week from './pages/week.vue'
import Year from './pages/year.vue'

interface cronTable {
  id: string
  second?: string
  minute?: string
  hour?: string
  day?: string
  month?: string
  week?: string
  year?: string
}
interface SpanMethodProps {
  rowIndex: number
  columnIndex: number
}

defineProps({
  open: {
    type: Boolean,
    default: false,
  },
})
const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
const emits = defineEmits(['closeDialog', 'setCronExp'])
const activeTab = ref('second')
const cronArray = ['second', 'minute', 'hour', 'day', 'month', 'week', 'year']
const cronData = ref<cronTable>({
  id: t('vueCron.expressionField'),
  second: '*',
  minute: '*',
  hour: '*',
  day: '*',
  month: '*',
  week: '?',
  year: '',
})
const cronExpression = ref<cronTable>({
  id: t('vueCron.expression'),
  second: '* * * * * ?',
})
const valid = ref(false)
const validType = ref<'success' | 'warning' | 'info' | 'error'>('info')
const validTip = ref(t('vueCron.validateTipInfo'))
const next_ten = ref<string[]>([])

watch(
  () => cronData.value,
  (x) => {
    cronExpression.value.second = cronArray
      .map((v) => x[v as keyof cronTable])
      .join(' ')
      .trim()
    valid.value = false
    validType.value = 'info'
    validTip.value = t('vueCron.validateTipInfo')
    next_ten.value = []
  },
  { deep: true },
)

const tableData = ref<cronTable[]>([cronData.value, cronExpression.value])

const arraySpanMethod = ({ rowIndex, columnIndex }: SpanMethodProps) => {
  if (rowIndex === 1) {
    if (columnIndex === 0) {
      return [1, 1]
    } else if (columnIndex === 1) {
      return [1, 7]
    }
  }
}
const setCronData = (cronType: CronType, v: string) => {
  switch (cronType) {
    case CronType.SECOND:
      cronData.value.second = v
      break
    case CronType.MINUTE:
      cronData.value.minute = v
      break
    case CronType.HOUR:
      cronData.value.hour = v
      break
    case CronType.DAY:
      cronData.value.day = v
      break
    case CronType.MONTH:
      cronData.value.month = v
      break
    case CronType.WEEK:
      cronData.value.week = v
      break
    case CronType.YEAR:
      cronData.value.year = v
      break
  }
}
const cancel = () => {
  emits('closeDialog')
}

const validateCron = async () => {
  valid.value = false
  const { data, execute } = usePost<validateRes>(
    ApiSysScheduledTasks.validateCronStr,
    {
      cron_str: cronExpression.value.second,
    },
  )
  await execute()
  // @ts-ignore
  if (data.value === ErrorFlag) return
  if (!data.value?.validate) {
    validType.value = 'error'
    validTip.value = t('vueCron.validateTipError')
    return
  }
  validType.value = 'success'
  valid.value = true
  validTip.value = t('vueCron.validateTipSuccess')
  next_ten.value = data.value.next_ten!
}
const submitForm = () => {
  if (!valid.value) return ElMessage.info(t('vueCron.validateTip'))
  emits('setCronExp', cronExpression.value.second)
  cancel()
}
</script>
<style lang="scss">
.cronCard {
  .el-card__header,
  .el-card__body {
    padding-top: 5px !important;
    padding-bottom: 5px !important;
  }
}
.cronTabs .el-form {
  .el-form-item--default,
  .el-form-item--small,
  .el-form-item--large {
    margin-bottom: 10px !important;
  }
}
</style>
