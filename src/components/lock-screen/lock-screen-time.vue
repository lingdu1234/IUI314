<template>
  <div class="local-time">
    <div class="time">{{ hour }}:{{ minute }}:{{ second }}</div>
    <div class="date">{{ month }}月{{ day }}号，星期{{ week }}</div>
  </div>
</template>

<script setup name="lock-screen-time">
import { useTime } from '@/hooks'
const { month, day, hour, minute, second, week } = useTime()
</script>

<style lang="scss" scoped>
.local-time {
  position: absolute;
  bottom: 60px;
  left: 60px;
  font-family: helvetica;
  backdrop-filter: blur(10px);
  border-radius: 30px;
  padding: 10px;

  .time {
    font-size: 70px;
  }

  .date {
    font-size: 40px;
  }
}
</style>
