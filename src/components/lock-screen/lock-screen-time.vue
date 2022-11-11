<template>
  <el-row class="local-time">
    <el-col :span="24" :md="8" :gutter="10">
      <div class="date flex justify-center items-center">
        {{ month }}月{{ day }}号，星期{{ week }}
      </div>
    </el-col>
    <el-col :span="24" :md="8">
      <div class="time flex justify-center items-center">
        {{ hour }}:{{ minute }}:{{ second }}
      </div>
    </el-col>
    <el-col :span="24" :md="8">
      <div class="flex justify-center items-center">
        <div>
          <SvgIcon
            :name="online ? 'online' : 'offline'"
            class="h-32px w-32px"
          />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script setup name="lock-screen-time">
import { useOnline } from '@vueuse/core'
import { ElCol, ElRow } from 'element-plus'

import { useTime } from '@/hooks'

import SvgIcon from '../common/svg-icon.vue'
const { month, day, hour, minute, second, week } = useTime()
const online = useOnline()
</script>

<style lang="scss" scoped>
.local-time {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px;
  font-family: helvetica;
  backdrop-filter: blur(10px);
  border-radius: 30px;
  padding: 15px 30px;
  box-shadow: inset 8px 8px 12px var(--second-bg-color),
    inset -8px -8px 12px var(--login-white);

  .time {
    font-size: 70px;
  }

  .date {
    font-size: 30px;
  }
}
</style>
