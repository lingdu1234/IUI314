<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { vCronItem } from '@/components/v-cron/v-cron-const'
import type { vCronSecondValueType } from '@/components/v-cron/v-cron-type'

defineOptions({ name: 'Second' })
const props = defineProps<dataType>()
interface dataType {
  type: vCronItem.second | vCronItem.minute | vCronItem.hour
}
const data = defineModel<string | undefined>('data', { required: true })
const currentGroup = ref<'every' | 'cycle' | 'interval' | 'fix'>('every')
const maxLimit = ref<number>(0)
const maxNum = ref<number>(24)
const typeString = ref<string>('秒')
const cronValue = ref<vCronSecondValueType>({
  every: '*',
  cycle: {
    from: 0,
    to: 0,
  },
  interval: {
    begin: 0,
    every: 1,
  },
  fix: [],
})

watch(() => [currentGroup.value, cronValue.value], () => {
  switch (currentGroup.value) {
    case 'every':{
      data.value = '*'
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
  }
}, { deep: true })

function getCronValue() {
  const v = data.value
  if (v) {
    if (v === '' || v === '*') {
      currentGroup.value = 'every'
      cronValue.value.every = '*'
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
    else {
      const vv: string[] = v.split(',')
      currentGroup.value = 'fix'
      cronValue.value.fix = vv
    }
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
      <a-radio value="every">
        每{{ typeString }}
      </a-radio>
      <a-radio value="cycle" class="flex justify-start m-t-10px">
        周期
        <span class="mx-10px">从</span>
        <a-input-number
          v-model:model-value="cronValue.cycle.from"
          style="width:100px"
          :min="0"
          :max="maxLimit - cronValue.cycle.to"
        />
        <span class="mx-10px">{{ typeString }}到</span>
        <a-input-number
          v-model:model-value="cronValue.cycle.to"
          style="width:100px"
          :min="0"
          :max="maxLimit - cronValue.cycle.from "
        />
        <span class="mx-10px">{{ typeString }}周期执行</span>
      </a-radio>
      <a-radio value="interval" class="flex justify-start m-t-10px">
        间隔
        <span class="mx-10px">从</span>
        <a-input-number
          v-model:model-value="cronValue.interval.begin"
          style="width:100px"
          :min="0"
          :max="maxLimit - cronValue.interval.every"
        />
        <span class="mx-10px">{{ typeString }}开始,每</span>
        <a-input-number
          v-model:model-value="cronValue.interval.every"
          style="width:100px"
          :min="0"
          :max="maxLimit - cronValue.interval.begin "
        />
        <span class="mx-10px">{{ typeString }}执行一次</span>
      </a-radio>
      <a-radio value="fix" class="flex justify-start m-t-10px">
        <span>固定</span>
      </a-radio>
      <a-checkbox-group v-model="cronValue.fix" class="m-l-50px">
        <a-grid :cols="12">
          <a-grid-item v-for="i in maxNum" :key="i">
            <a-checkbox :value="i - 1">
              {{ i - 1 < 10
                ? `0${i - 1}`
                : i - 1 }}
            </a-checkbox>
          </a-grid-item>
        </a-grid>
      </a-checkbox-group>
    </a-radio-group>
  </div>
</template>

<style scoped lang="scss">

</style>
