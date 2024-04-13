<script setup>
import { useOnline } from '@vueuse/core'

import { useTime } from '@/hooks'
import IuiIcon from '@/components/svg-icon/iui-icon.vue'

defineOptions({ name: 'LockScreenTime' })

const { month, day, hour, minute, second, week } = useTime()
const online = useOnline()
</script>

<template>
  <a-row class="local-time">
    <a-col :span="24" :md="8" :gutter="10">
      <div class="date flex justify-center items-center">
        {{ month }}月{{ day }}号，星期{{ week }}
      </div>
    </a-col>
    <a-col :span="24" :md="8">
      <div class="time flex justify-center items-center">
        {{ hour }}:{{ minute }}:{{ second }}
      </div>
    </a-col>
    <a-col :span="24" :md="8">
      <div class="flex justify-center items-center">
        <div>
          <IuiIcon
            :name="online ? 'online' : 'offline'"
            class="h-32px w-32px"
          />
        </div>
      </div>
    </a-col>
  </a-row>
</template>

<style lang="scss" scoped>
.local-time {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 20px;
  backdrop-filter: blur(10px);
  border-radius: 30px;
  padding: 15px 30px;
  box-shadow:
    inset 8px 8px 12px var(--second-bg-color),
    inset -8px -8px 12px var(--login-white);

  .time {
    font-size: 70px;
  }

  .date {
    font-size: 30px;
  }
}
</style>
