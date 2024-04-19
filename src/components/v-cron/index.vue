<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { parseTime, usePost } from '@/hooks'
import { Day, Month, Second, Week, Year } from '@/components/v-cron/pages'

import { cronArrayX, vCronItem, vCronTableColumn, vCronTableWidth } from '@/components/v-cron/v-cron-const'
import type { vCronData, vCronPropsType, vCronTableData } from '@/components/v-cron/v-cron-type'
import type { validateRes } from '@/types/system/scheduled-tasks'
import { ApiSysScheduledTasks } from '@/api/sysApis'
import { ErrorFlag } from '@/api/apis'

defineOptions({ name: 'VCron' })
withDefaults(defineProps<vCronPropsType>(), {
  title: 'cron表达式生成器',
  okText: '确定',
  cancelText: '取消',
  titleAlign: 'center',
  labelWidth: 80,
  itemWidth: 300,
})

const visible = defineModel('visible', { required: true, default: false })
const cronValue = defineModel('cronValue', { required: true, type: String })
const isFullscreen = ref(false)
const cronIsValid = ref(false)

const activeTab = ref<string>('second')
const next_ten = ref<string[]>([])
const cronData = ref<vCronData>({})

watch(() => cronValue.value, (v) => {
  validateCron()
  getCronData(v)
}, { immediate: true })

// 将cron表达式转换为值
function getCronData(data: string) {
  const cronDataV: vCronData = {}
  const v: string[] = data.split(' ')
  cronDataV.second = v.length > 0 && v[0] !== '' ? v[0] : '*'
  cronDataV.minute = v.length > 1 && v[1] !== '' ? v[1] : '*'
  cronDataV.hour = v.length > 2 && v[2] !== '' ? v[2] : '*'
  cronDataV.day = v.length > 3 && v[3] !== '' ? v[3] : '*'
  cronDataV.month = v.length > 4 && v[4] !== '' ? v[4] : '*'
  cronDataV.week = v.length > 5 && v[5] !== '' ? v[5] : '?'
  cronDataV.year = v.length > 6 ? v[6] : ''
  cronData.value = cronDataV
}

const cronTableData = computed<vCronTableData[]>(() => ([
  {
    id: '字段值',
    ...cronData.value,
  },
  {
    id: '表达式',
    second: cronValue.value,
  },
]))

const contentHeight = computed(() => 'calc(calc(var(--vh) * 100) - 400px')

function handleCancel() {
  visible.value = false
}

function toggleFullScreen() {
  isFullscreen.value = !isFullscreen.value
}

function spanMethod({ rowIndex, columnIndex }: { rowIndex: number, columnIndex: number }) {
  if (rowIndex === 1 && columnIndex === 1) {
    return {
      colspan: 7,
    }
  }
}

async function validateCron() {
  cronIsValid.value = false
  const { data, execute } = usePost<validateRes>(
    ApiSysScheduledTasks.validateCronStr,
    {
      cron_str: cronValue.value,
    },
  )
  await execute()
  if (data.value as unknown as string === ErrorFlag) {
    next_ten.value = []
    return
  }
  cronIsValid.value = true
  next_ten.value = data.value?.next_ten as string[]
}

function submit() {
  if (!cronIsValid.value)
    return validateCron()
}

const tableWidth = computed(() => `width:${vCronTableWidth * 8 + 8}px;`)
</script>

<template>
  <a-modal
    v-model:visible="visible"
    width="auto"
    :ok-text="okText"
    :cancel-text="cancelText"
    :title-align="titleAlign"
    draggable
    :fullscreen="isFullscreen"
    class="iu-modal"
  >
    <template v-if="titleAlign === 'start'" #title>
      <div>
        <IconSchedule />
        <span class="m-l-10px">{{ title }}</span>
      </div>
      <div>
        <span class="m-r-30px  arco-icon-hover">
          <IconFullscreen v-if="!isFullscreen" size="15" @click="toggleFullScreen" />
          <IconFullscreenExit v-if="isFullscreen" size="15" @click="toggleFullScreen" />
        </span>
      </div>
    </template>
    <template v-else #title>
      <div>
        <span class="arco-icon-hover">
          <IconFullscreen v-if="!isFullscreen" size="15" @click="toggleFullScreen" />
          <IconFullscreenExit v-if="isFullscreen" size="15" @click="toggleFullScreen" />
        </span>
      </div>
      <div>
        <IconSchedule />
        <span class="m-l-10px">{{ title }}</span>
      </div>
      <div />
    </template>
    <div class="flex flex-col justify-center  my-10px m-l-10px">
      <div class="flex justify-center">
        <a-tabs v-model:active-key="activeTab">
          <a-tab-pane v-for="item in cronArrayX" :key="item.value" :title="item.label" />
        </a-tabs>
      </div>
      <div>
        <a-scrollbar :style="`max-height:${contentHeight};overflow: auto;`" class="flex justify-center mx-20px my-5px">
          <a-grid :cols="1">
            <a-grid-item>
              <Second
                v-if="activeTab === vCronItem.second"
                v-model:data="cronData.second"
                :type="vCronItem.second"
              />
              <Second
                v-if="activeTab === vCronItem.minute"
                v-model:data="cronData.minute"
                :type="vCronItem.minute"
              />
              <Second
                v-if="activeTab === vCronItem.hour"
                v-model:data="cronData.hour"
                :type="vCronItem.hour"
              />
              <Day v-if="activeTab === vCronItem.day" />
              <Month v-if="activeTab === vCronItem.month" />
              <Week v-if="activeTab === vCronItem.week" />
              <Year v-if="activeTab === vCronItem.year" />
              <a-grid-item>
                <a-table
                  :columns="vCronTableColumn"
                  :data="cronTableData"
                  :bordered="{ wrapper: true, cell: true }"
                  row-key="id"
                  :pagination="false"
                  :span-method="spanMethod"
                  :style="tableWidth"
                />
              </a-grid-item>
              <a-grid-item>
                <a-card title="next run time" :style="tableWidth" class="m-t-5px">
                  <template v-if="next_ten.length > 0">
                    <a-grid :cols="4">
                      <a-grid-item v-for="(item, index) in next_ten" :key="index">
                        {{ parseTime(item) }}
                      </a-grid-item>
                    </a-grid>
                  </template>
                  <template v-else>
                    下12次运行时间
                  </template>
                </a-card>
              </a-grid-item>
            </a-grid-item>
          </a-grid>
        </a-scrollbar>
      </div>
    </div>
    <template #footer>
      <a-button status="warning" @click="validateCron">
        验证
      </a-button>
      <a-button type="primary" @click="submit">
        {{ okText }}
      </a-button>
      <a-button @click="handleCancel">
        {{ cancelText }}
      </a-button>
    </template>
  </a-modal>
</template>

<style scoped lang="scss">

</style>
