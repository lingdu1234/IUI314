<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { vCronItem, weekArray } from '@/components/v-cron/v-cron-const'
import type { vCronSecondValueType } from '@/components/v-cron/v-cron-type'

defineOptions({ name: 'CronComp' })
const props = defineProps<dataType>()
interface dataType {
  type: vCronItem
}
const data = defineModel<string | undefined>('data', { required: true })
const currentGroup = ref<'every' | 'cycle' | 'interval' | 'fix' | 'noFix' | 'noContent' | 'fixWeekDayOfMonth' | 'lastWeekOfMonth' | 'lastDayOfMonth' | 'closestWorkDayOfMonth'>('every')
const maxLimit = ref<number>(0)
const maxNum = ref<number>(24)
const typeString = ref<string>('秒')
const currentYear = new Date().getFullYear()
const cronValue = ref<vCronSecondValueType>({
  cycle: {
    from: 1,
    to: 2,
  },
  interval: {
    begin: 1,
    every: 1,
  },
  fix: [],
  closestWorkDayOfMonth: 1,
  lastWeekOfMonth: '1L',
  fixWeekDayOfMonth: {
    week: 1,
    day: 1,
  },
})

watch(() => [currentGroup.value, cronValue.value], () => {
  switch (currentGroup.value) {
    case 'noContent':{
      data.value = ''
      break
    }
    case 'every':{
      data.value = '*'
      break
    }
    case 'noFix':{
      data.value = '?'
      break
    }
    case 'cycle':{
      data.value = `${cronValue.value.cycle.from}-${cronValue.value.cycle.to}`
      break
    }
    case 'interval':{
      data.value = `${cronValue.value.interval.begin}/${cronValue.value.interval.every}`
      break
    }
    case 'fix':{
      cronValue.value.fix.sort()
      data.value = cronValue.value.fix.join(',')
      break
    }
    case 'lastDayOfMonth':{
      data.value = 'L'
      break
    }
    case 'lastWeekOfMonth':{
      data.value = cronValue.value.lastWeekOfMonth
      break
    }
    case 'closestWorkDayOfMonth':{
      data.value = `${cronValue.value.closestWorkDayOfMonth}W`
      break
    }
    case 'fixWeekDayOfMonth':{
      data.value = `${cronValue.value.fixWeekDayOfMonth.week}#${cronValue.value.fixWeekDayOfMonth.day}`
      break
    }
  }
}, { deep: true })

function getCronValue() {
  const v = data.value
  if (v) {
    if (v === '' && props.type === vCronItem.year) {
      // 这个可能永远也执行不到，留着预防万一执行到了
      currentGroup.value = 'noContent'
    }
    else if (v === '*') {
      currentGroup.value = 'every'
    }
    else if (v === 'L') {
      currentGroup.value = 'lastDayOfMonth'
    }
    else if (v === '?') {
      currentGroup.value = 'noFix'
    }
    else if (v.includes('-')) {
      const vv: string[] = v.split('-')
      currentGroup.value = 'cycle'
      cronValue.value.cycle.from = Number.parseInt(vv[0], 10)
      cronValue.value.cycle.to = Number.parseInt(vv[1], 10)
    }
    else if (v.includes('/')) {
      const vv: string[] = v.split('/')
      currentGroup.value = 'interval'
      cronValue.value.interval.begin = Number.parseInt(vv[0], 10)
      cronValue.value.interval.every = Number.parseInt(vv[1], 10)
    }
    else if (v.includes('#')) {
      const vv: string[] = v.split('#')
      currentGroup.value = 'fixWeekDayOfMonth'
      cronValue.value.fixWeekDayOfMonth.week = Number.parseInt(vv[0], 10)
      cronValue.value.fixWeekDayOfMonth.day = Number.parseInt(vv[1], 10)
    }
    else if (v.endsWith('W')) {
      currentGroup.value = 'closestWorkDayOfMonth'
      const vv = v.replace('W', '')
      cronValue.value.closestWorkDayOfMonth = Number.parseInt(vv, 10)
    }
    else if (v.endsWith('L')) {
      currentGroup.value = 'lastWeekOfMonth'
      cronValue.value.lastWeekOfMonth = v
    }
    else {
      const vv: string[] = v.split(',')
      currentGroup.value = 'fix'
      cronValue.value.fix = vv
    }
  }
  else {
    if (props.type === vCronItem.year)
      currentGroup.value = 'noContent'
  }
}
function initType() {
  switch (props.type) {
    case vCronItem.second:{
      maxLimit.value = 59
      maxNum.value = 60
      typeString.value = '秒'
      break
    }
    case vCronItem.minute:{
      maxLimit.value = 59
      maxNum.value = 60
      typeString.value = '分'
      break
    }
    case vCronItem.hour:{
      maxLimit.value = 23
      maxNum.value = 24
      typeString.value = '小时'
      break
    }
    case vCronItem.day:{
      maxLimit.value = 30
      maxNum.value = 31
      typeString.value = '天'
      break
    }
    case vCronItem.month:{
      maxLimit.value = 11
      maxNum.value = 12
      typeString.value = '月'
      break
    }
    case vCronItem.week:{
      maxLimit.value = 6
      maxNum.value = 7
      typeString.value = '周'
      break
    }
    case vCronItem.year:{
      maxLimit.value = currentYear
      maxNum.value = currentYear + 10
      cronValue.value.cycle.from = currentYear
      cronValue.value.cycle.to = currentYear + 10
      cronValue.value.interval.begin = currentYear + 10
      typeString.value = '年'
      break
    }
  }
}

onMounted(() => {
  initType()
  getCronValue()
})
</script>

<template>
  <div>
    <div>
      <span class="m-l-20px">{{ typeString }}:允许的通配符[, - * /]</span>
    </div>
    <a-radio-group v-model:model-value="currentGroup" direction="vertical" class="m-t-10px">
      <!--      不填 只有年才显示 -->
      <a-radio v-if="type === vCronItem.year" value="noContent">
        不填
      </a-radio>
      <!--      每一 全部显示  -->
      <a-radio value="every">
        每{{ typeString }}
      </a-radio>
      <!--      不指定，只能在 天 和 周 使用 -->
      <a-radio v-if="type === vCronItem.day || type === vCronItem.week" value="noFix">
        不指定
      </a-radio>
      <!--      周期 所有都可以使用，但是年和周显示不一样单独的模板   -->
      <!--      年 -->
      <a-radio v-if="type === vCronItem.year" value="cycle" class="flex justify-start m-t-10px">
        周期
        <span class="mx-10px">从</span>
        <a-input-number
          v-model:model-value="cronValue.cycle.from"
          style="width:120px"
          :min="currentYear"
          mode="button"
          :max="currentYear + 10"
        />
        <span class="mx-10px">{{ typeString }}到</span>
        <a-input-number
          v-model:model-value="cronValue.cycle.to"
          style="width:120px"
          :min="0"
          mode="button"
          :max="10"
        />
        <span class="mx-10px">{{ typeString }}周期执行</span>
      </a-radio>
      <!--      周 -->
      <a-radio v-else-if="type === vCronItem.week" value="cycle" class="flex justify-start m-t-10px">
        周期
        <span class="mx-10px">从</span>
        <a-select v-model="cronValue.cycle.from" :style="{ width: '100px' }" allow-clear>
          <a-option v-for="it in weekArray" :key="it.value" :value="it.value" :disabled="it.value > cronValue.cycle.to">
            {{ it.label }}
          </a-option>
        </a-select>
        <span class="mx-10px">到</span>
        <a-select v-model="cronValue.cycle.to" :style="{ width: '100px' }" allow-clear>
          <a-option v-for="it in weekArray" :key="it.value" :value="it.value" :disabled="it.value < cronValue.cycle.from">
            {{ it.label }}
          </a-option>
        </a-select>
        <span class="mx-10px">周期执行</span>
      </a-radio>
      <!--      秒 分 小时 月 -->
      <a-radio v-else value="cycle" class="flex justify-start m-t-10px">
        周期
        <span class="mx-10px">从</span>
        <a-input-number
          v-model:model-value="cronValue.cycle.from"
          style="width:100px"
          :min="0"
          mode="button"
          :max="maxLimit - cronValue.cycle.to"
        />
        <span class="mx-10px">{{ typeString }}到</span>
        <a-input-number
          v-model:model-value="cronValue.cycle.to"
          style="width:100px"
          :min="0"
          mode="button"
          :max="maxLimit - cronValue.cycle.from "
        />
        <span class="mx-10px">{{ typeString }}周期执行</span>
      </a-radio>
      <!--      间隔 所有都可以使用，但是年和周显示不一样单独的模板   -->
      <!--      年 -->
      <a-radio v-if="type === vCronItem.year" value="interval" class="flex justify-start m-t-10px">
        间隔
        <span class="mx-10px">从</span>
        <a-input-number
          v-model:model-value="cronValue.interval.begin"
          style="width:120px"
          :min="currentYear"
          mode="button"
          :max="currentYear + 10"
        />
        <span class="mx-10px">{{ typeString }}开始,每</span>
        <a-input-number
          v-model:model-value="cronValue.interval.every"
          style="width:100px"
          :min="0"
          mode="button"
          :max="10 "
        />
        <span class="mx-10px">{{ typeString }}执行一次</span>
      </a-radio>
      <!--      周 -->
      <a-radio v-if="type === vCronItem.week" value="interval" class="flex justify-start m-t-10px">
        间隔
        <span class="mx-10px">从</span>
        <a-select v-model="cronValue.interval.begin" :style="{ width: '100px' }" allow-clear>
          <a-option v-for="it in weekArray" :key="it.value" :value="it.value" :disabled="it.value > cronValue.cycle.to">
            {{ it.label }}
          </a-option>
        </a-select>
        <span class="mx-10px">开始,每</span>
        <a-input-number
          v-model:model-value="cronValue.interval.every"
          style="width:100px"
          :min="0"
          mode="button"
          :max="20 "
        />
        <span class="mx-10px">{{ typeString }}执行一次</span>
      </a-radio>
      <!--      秒 分 小时 月 -->
      <a-radio
        v-if="type === vCronItem.second
          || type === vCronItem.minute
          || type === vCronItem.hour
          || type === vCronItem.month"
        value="interval"
        class="flex justify-start m-t-10px"
      >
        间隔
        <span class="mx-10px">从</span>
        <a-input-number
          v-model:model-value="cronValue.interval.begin"
          style="width:100px"
          :min="type === vCronItem.month ? 1 : 0"
          mode="button"
          :max="maxLimit - cronValue.interval.every"
        />
        <span class="mx-10px">{{ typeString }}开始,每</span>
        <a-input-number
          v-model:model-value="cronValue.interval.every"
          style="width:100px"
          :min="type === vCronItem.month ? 1 : 0"
          mode="button"
          :max="maxLimit - cronValue.interval.begin "
        />
        <span class="mx-10px">{{ typeString }}执行一次</span>
      </a-radio>
      <!--      每月的第几周星期几 -->
      <a-radio v-if="type === vCronItem.week" value="fixWeekDayOfMonth" class="flex justify-start m-t-10px">
        周几
        <span class="mx-10px">每月的第</span>
        <a-input-number
          v-model:model-value="cronValue.fixWeekDayOfMonth.week"
          style="width:100px"
          :min="1"
          mode="button"
          :max="5"
        />
        <span class="mx-10px">周</span>
        <a-select v-model="cronValue.fixWeekDayOfMonth.day" :style="{ width: '100px' }" allow-clear>
          <a-option v-for="it in weekArray" :key="it.value" :value="it.value">
            {{ it.label }}
          </a-option>
        </a-select>
        <span class="mx-10px">执行</span>
      </a-radio>
      <!--      每月的最后一个周几 -->
      <a-radio v-if="type === vCronItem.week" value="lastWeekOfMonth" class="flex justify-start m-t-10px">
        最后
        <span class="mx-10px">每月的最后一个</span>
        <a-select v-model="cronValue.lastWeekOfMonth" :style="{ width: '100px' }" allow-clear>
          <a-option v-for="it in weekArray" :key="it.value" :value="`${it.value}L`">
            {{ it.label }}
          </a-option>
        </a-select>
        <span class="mx-10px">执行</span>
      </a-radio>
      <!--      每月的最后一个一天 -->
      <a-radio v-if="type === vCronItem.day" value="lastDayOfMonth" class="flex justify-start m-t-10px">
        最后
        <span class="mx-10px">每月的最后一天执行</span>
      </a-radio>
      <!--      最近的工作日 -->
      <a-radio v-if="type === vCronItem.day" value="closestWorkDayOfMonth" class="flex justify-start m-t-10px">
        工作日
        <span class="mx-10px">每月</span>
        <a-input-number
          v-model:model-value="cronValue.closestWorkDayOfMonth"
          style="width:100px"
          :min="1"
          mode="button"
          :max="31"
        />
        <span class="mx-10px">日最靠近的工作日执行</span>
      </a-radio>
      <!--      固定时间 -->
      <a-radio value="fix" class="flex justify-start m-t-10px">
        <span>固定</span>
        <a-button
          class="m-l-20px"
          type="text"
          shape="round"
          @click="() => cronValue.fix = []"
        >
          重置
        </a-button>
      </a-radio>
      <!--      固定选项组 -->
      <a-checkbox-group v-model:model-value="cronValue.fix" class="m-l-50px">
        <!--        秒 分 小时  -->
        <template v-if="type === vCronItem.second || type === vCronItem.minute || type === vCronItem.hour">
          <a-grid :cols="12">
            <a-grid-item v-for="i in maxNum" :key="i">
              <a-checkbox :value="(i - 1).toString()">
                {{ i - 1 < 10
                  ? `0${i - 1}`
                  : i - 1 }}
              </a-checkbox>
            </a-grid-item>
          </a-grid>
        </template>
        <!--        天 月 -->
        <template v-if="type === vCronItem.day || type === vCronItem.month">
          <a-grid :cols="type === vCronItem.day ? 8 : 6">
            <a-grid-item v-for="i in maxNum" :key="i">
              <a-checkbox :value="i.toString()">
                {{ i < 10
                  ? `0${i}`
                  : i }}
              </a-checkbox>
            </a-grid-item>
          </a-grid>
        </template>
        <!--        周 -->
        <template v-if="type === vCronItem.week">
          <a-grid :cols="7">
            <a-grid-item v-for="i in weekArray" :key="i.value">
              <a-checkbox :value="i.value.toString()">
                {{ i.label }}
              </a-checkbox>
            </a-grid-item>
          </a-grid>
        </template>
        <!--        年 -->
        <template v-if="type === vCronItem.year">
          <a-grid :cols="10">
            <a-grid-item v-for="i in 20" :key="i">
              <a-checkbox :value="(i + currentYear - 1).toString()">
                {{ i + currentYear - 1 }}
              </a-checkbox>
            </a-grid-item>
          </a-grid>
        </template>
      </a-checkbox-group>
    </a-radio-group>
  </div>
</template>

<style scoped lang="scss">

</style>
