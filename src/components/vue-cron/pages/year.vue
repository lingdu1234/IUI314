<template>
  <div>
    <el-form>
      <el-form-item>
        <el-radio
          v-model="groupV"
          :label="DayGroup.NONE"
          :key="cronTypeV + DayGroup.NONE + ''"
        >
          <span class="font-bold">
            {{ t('vueCron.t.none') }}
          </span>
          <span class="m-l-10px">{{ t('vueCron.allowed') }} [ , - * / ]</span>
        </el-radio>
      </el-form-item>
      <el-form-item>
        <el-radio
          v-model="groupV"
          :label="DayGroup.EVERY"
          :key="cronTypeV + DayGroup.EVERY + ''"
        >
          <span class="font-bold">
            {{ t('vueCron.t.year') }}
          </span>
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
            <el-input-number v-model="cycle.from" />
          </span>
          {{ t('vueCron.to') }}
          <el-input-number v-model="cycle.to" />
          {{ t('vueCron.yearTitle') }}
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
            <el-input-number v-model="cycle.from" />
          </span>
          {{ t('vueCron.yearTitle') }}
          {{ t('vueCron.toInterval') }}
          <el-input-number v-model="cycle.every" :min="1" :max="10" />
          {{ t('vueCron.yearTitle2') }}
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
                <el-row v-for="i in 3" :key="i">
                  <el-checkbox
                    style="width: 40px"
                    v-for="j in 10"
                    :key="j + currentYear"
                    :label="(i - 1) * 10 + (j + currentYear - 1)"
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
<script lang="ts" setup name="vue-cron-year">
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
const currentYear = new Date().getFullYear()
const cycle = ref({
  from: currentYear,
  to: currentYear + 10,
  every: 1,
  closest: 1,
})
const emits = defineEmits(['setCronData'])
const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
const groupV = ref(DayGroup.NONE)
const fixData = ref([])
const fixDataString = ref('')

const fixDataChange = (v: string[]) => {
  groupV.value = DayGroup.FIX
  if (v.length === 0) return
  const data = v.sort()
  fixDataString.value = data.map((x) => parseInt(x)).join(',')
}

// 监控相关值的变化，生成表达式,并提交给父组件
watch(
  [fixDataString, () => cycle.value, groupV],
  () => {
    switch (groupV.value) {
      case DayGroup.NONE:
        emits('setCronData', props.cronTypeV, '')
        break
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
