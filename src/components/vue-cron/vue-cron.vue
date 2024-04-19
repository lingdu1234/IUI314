<script lang="ts" setup name="vue-cron">
import {
  ElAlert,
  ElButton,
  ElCard,
  ElCol,
  ElDialog,
  ElMessage,
  ElRow,
  ElTabPane,
  ElTable,
  ElTableColumn,
  ElTabs,
} from 'element-plus'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import Day from './pages/day.vue'
import Hour from './pages/hour.vue'
import Month from './pages/month.vue'
import SecondOrMinute from './pages/second-or-minute.vue'
import Week from './pages/week.vue'
import Year from './pages/year.vue'
import { ErrorFlag } from '@/api/apis'
import { ApiSysScheduledTasks } from '@/api/sysApis'
import { usePost } from '@/hooks'
import type { MessageSchema } from '@/i18n'
import { CronType } from '@/types/system/cron'
import type { validateRes } from '@/types/system/scheduled-tasks'

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
const emits = defineEmits(['closeDialog', 'setCronExp'])
const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
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
      .map(v => x[v as keyof cronTable])
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

function arraySpanMethod({ rowIndex, columnIndex }: SpanMethodProps) {
  if (rowIndex === 1) {
    if (columnIndex === 0)
      return [1, 1]
    else if (columnIndex === 1)
      return [1, 7]
  }
}
function setCronData(cronType: CronType, v: string) {
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
function cancel() {
  emits('closeDialog')
}

async function validateCron() {
  valid.value = false
  const { data, execute } = usePost<validateRes>(
    ApiSysScheduledTasks.validateCronStr,
    {
      cron_str: cronExpression.value.second,
    },
  )
  await execute()
  // @ts-expect-error
  if (data.value === ErrorFlag)
    return
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
function submitForm() {
  if (!valid.value)
    return ElMessage.info(t('vueCron.validateTip'))
  emits('setCronExp', cronExpression.value.second)
  cancel()
}
</script>

<template>
  <ElDialog
    :model-value="open"
    :before-close="cancel"
    :title="t('vueCron.title')"
    append-to-body
    width="800px"
  >
    <ElTabs v-model="activeTab" class="cronTabs">
      <ElTabPane :label="t('vueCron.secondTitle')" name="second">
        <SecondOrMinute
          :cron-type-v="CronType.SECOND"
          @set-cron-data="setCronData"
        />
      </ElTabPane>
      <ElTabPane :label="t('vueCron.minuteTitle')" name="minute">
        <SecondOrMinute
          :cron-type-v="CronType.MINUTE"
          @set-cron-data="setCronData"
        />
      </ElTabPane>
      <ElTabPane :label="t('vueCron.hourTitle')" name="hour">
        <Hour :cron-type-v="CronType.HOUR" @set-cron-data="setCronData" />
      </ElTabPane>
      <ElTabPane :label="t('vueCron.dayTitle')" name="day">
        <Day :cron-type-v="CronType.DAY" @set-cron-data="setCronData" />
      </ElTabPane>
      <ElTabPane :label="t('vueCron.monthTitle')" name="month">
        <Month :cron-type-v="CronType.MONTH" @set-cron-data="setCronData" />
      </ElTabPane>
      <ElTabPane :label="t('vueCron.weekTitle')" name="week">
        <Week :cron-type-v="CronType.WEEK" @set-cron-data="setCronData" />
      </ElTabPane>
      <ElTabPane :label="t('vueCron.yearTitle')" name="year">
        <Year :cron-type-v="CronType.YEAR" @set-cron-data="setCronData" />
      </ElTabPane>
    </ElTabs>
    <ElTable
      :data="tableData"
      :span-method="arraySpanMethod"
      border
      tooltip-effect="light"
      style="width: 100%"
    >
      <ElTableColumn prop="id" label="#" align="center" width="130" />
      <ElTableColumn
        prop="second"
        :label="t('vueCron.secondTitle')"
        align="center"
        show-overflow-tooltip
      />
      <ElTableColumn
        prop="minute"
        :label="t('vueCron.minuteTitle')"
        align="center"
        show-overflow-tooltip
      />
      <ElTableColumn
        prop="hour"
        :label="t('vueCron.hourTitle')"
        align="center"
        show-overflow-tooltip
      />
      <ElTableColumn
        prop="day"
        :label="t('vueCron.dayTitle')"
        align="center"
        show-overflow-tooltip
      />
      <ElTableColumn
        prop="month"
        :label="t('vueCron.monthTitle')"
        align="center"
        show-overflow-tooltip
      />
      <ElTableColumn
        prop="week"
        :label="t('vueCron.weekTitle')"
        align="center"
        show-overflow-tooltip
      />
      <ElTableColumn
        prop="year"
        :label="t('vueCron.yearTitle')"
        align="center"
        show-overflow-tooltip
      />
    </ElTable>
    <ElCard class="m-t-10px cronCard">
      <template #header>
        <div>
          <span>next run time</span>
        </div>
      </template>
      <ElCol>
        <ElRow v-for="i in 3" :key="i">
          <div
            v-for="j in 4"
            :key="`${i}${j}`"
            :class="j !== 4 ? 'm-r-50px' : ''"
          >
            {{ next_ten[(i - 1) * 4 + (j - 1)] }}
          </div>
        </ElRow>
      </ElCol>
    </ElCard>
    <div class="m-t-10px">
      <ElAlert
        :title="validTip"
        :type="validType"
        show-icon
        :closable="false"
      />
    </div>
    <template #footer>
      <div class="flex justify-center">
        <ElButton type="warning" @click="validateCron">
          {{ t('common.validate') }}
        </ElButton>
        <ElButton type="primary" @click="submitForm">
          {{ t('common.submit') }}
        </ElButton>
        <ElButton @click="cancel">
          {{ t('common.cancel') }}
        </ElButton>
      </div>
    </template>
  </ElDialog>
</template>

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
