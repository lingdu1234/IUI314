<template>
  <div>
    <el-form>
      <el-form-item>
        <el-radio
          v-model="groupV"
          :label="DayGroup.EVERY"
          :key="cronTypeV + DayGroup.EVERY + ''"
        >
          <span class="font-bold">
            {{ t('vueCron.t.month') }}
          </span>
          <span class="m-l-10px">{{ t('vueCron.allowed') }} [ , - * / ]</span>
        </el-radio>
      </el-form-item>
      <el-form-item>
        <el-radio
          v-model="groupV"
          :label="DayGroup.CYCLE"
          :key="cronTypeV + DayGroup.CYCLE + ''"
        >
          <span class="font-bold"> {{ t('vueCron.second.cycle') }} </span>
          <span class="m-l-10px">
            {{ t('vueCron.from') }}
            <el-input-number v-model="cycle.from" :min="1" :max="11" />
          </span>
          {{ t('vueCron.to') }}
          <el-input-number v-model="cycle.to" :min="cycle.from + 1" :max="12" />
          {{ t('vueCron.monthTitle') }}
        </el-radio>
      </el-form-item>
      <el-form-item>
        <el-radio
          v-model="groupV"
          :label="DayGroup.INTERVAL"
          :key="cronTypeV + DayGroup.INTERVAL + ''"
        >
          <span class="font-bold"> {{ t('vueCron.second.interval') }} </span>
          <span class="m-l-10px">
            {{ t('vueCron.from') }}
            <el-input-number v-model="cycle.from" :min="1" :max="11" />
          </span>
          {{ t('vueCron.monthTitle') }}
          {{ t('vueCron.toInterval') }}
          <el-input-number
            v-model="cycle.every"
            :min="1"
            :max="12 - cycle.from"
          />
          {{ t('vueCron.monthTitle2') }}
          {{ t('vueCron.runOneTime') }}
        </el-radio>
      </el-form-item>
      <el-form-item>
        <el-col>
          <el-row>
            <el-radio
              v-model="groupV"
              :label="DayGroup.FIX"
              :key="cronTypeV + DayGroup.FIX + ''"
            >
              <span class="font-bold">{{ t('vueCron.second.fix') }}</span>
              <el-button
                round
                type="warning"
                class="m-l-30px"
                @click="() => (fixData = [])"
              >
                {{ t('vueCron.resetCheckBox') }}
              </el-button>
            </el-radio>
          </el-row>
          <el-row class="m-l-30px">
            <el-checkbox-group
              v-model="fixData"
              @change="fixDataChange(fixData)"
            >
              <el-col>
                <el-row v-for="i in 2" :key="i">
                  <el-checkbox
                    style="width: 50px"
                    v-for="j in 6"
                    :key="j"
                    :label="
                      (i - 1) * 6 + j < 10
                        ? '0' + ((i - 1) * 6 + j)
                        : (i - 1) * 6 + j
                    "
                  ></el-checkbox>
                </el-row>
              </el-col>
            </el-checkbox-group>
          </el-row>
        </el-col>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts" setup name="vue-cron-month">
import {
  ElButton,
  ElCheckbox,
  ElCheckboxGroup,
  ElCol,
  ElForm,
  ElFormItem,
  ElInputNumber,
  ElRadio,
  ElRow,
} from 'element-plus'
import { type PropType, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import type { MessageSchema } from '@/i18n'
import { CronType, DayGroup } from '@/types/system/cron'

const props = defineProps({
  cronTypeV: {
    type: Number as PropType<CronType>,
    required: true,
  },
})
const cycle = ref({
  from: 1,
  to: 5,
  every: 1,
  closest: 1,
})
const emits = defineEmits(['setCronData'])
const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
const groupV = ref(DayGroup.EVERY)
const fixData = ref([])
const fixDataString = ref('')

const fixDataChange = (v: string[]) => {
  groupV.value = DayGroup.FIX
  if (v.length === 0) return
  const data = v.sort()
  fixDataString.value = data.map((x) => parseInt(x)).join(',')
}
// 监控cycle的变化
watch(
  () => cycle.value,
  (v) => {
    if (v.from >= v.to) {
      cycle.value.to = cycle.value.from + 5 <= 30 ? cycle.value.from + 5 : 30
    }
    if (v.from + v.every >= 31) {
      cycle.value.every = 30 - cycle.value.from
    }
  },
  { deep: true },
)
// 监控相关值的变化，生成表达式,并提交给父组件
watch(
  [fixDataString, () => cycle.value, groupV],
  () => {
    switch (groupV.value) {
      case DayGroup.EVERY:
        emits('setCronData', props.cronTypeV, '*')
        break
      case DayGroup.CYCLE: {
        const data = cycle.value.from + '-' + cycle.value.to
        emits('setCronData', props.cronTypeV, data)
        break
      }
      case DayGroup.INTERVAL: {
        const data = cycle.value.from + '/' + cycle.value.every
        emits('setCronData', props.cronTypeV, data)
        break
      }
      case DayGroup.FIX:
        emits('setCronData', props.cronTypeV, fixDataString.value)
        break
    }
  },
  { deep: true },
)
</script>
