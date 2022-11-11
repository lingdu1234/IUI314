<template>
  <div class="flex flex-col items-center justify-center">
    <div class="flex items-center justify-center chargeContainer">
      <div class="flex items-center justify-center chargeContainer2">
        <div class="number">{{ 100 * level }}%</div>
      </div>
    </div>
    <div class="charging">
      <div>{{ charging ? '充电中' : '电源已断开' }}</div>
      <div v-show="Number.isFinite(chargingTime) && dischargingTime != 0">
        剩余可使用时间：{{ dischargingTime }}
      </div>
      <span v-show="Number.isFinite(chargingTime) && chargingTime != 0">
        距离电池充满需要：{{ calcChargingTime }}
      </span>
    </div>
  </div>
</template>
<script lang="ts" setup name="re-charge">
import { useBattery } from '@vueuse/core'
import { computed } from 'vue'

const { charging, chargingTime, dischargingTime, level } = useBattery()

const calcChargingTime = computed(() => {
  const hour = chargingTime.value / 3600
  const minute = (chargingTime.value / 60) % 60
  return `${hour}小时${minute}分钟`
})
</script>
<style lang="scss" scoped>
.chargeContainer {
  height: calc(var(--vh) * 25);
  .number {
    z-index: 10;
    font-size: calc(var(--vh) * 5);
    text-align: center;
    margin-top: calc(var(--vh) * 5);
  }
  .chargeContainer2 {
    height: calc(var(--vh) * 25);
    width: calc(var(--vh) * 25);
    filter: contrast(15);
    animation: hueRotate 5s infinite linear;

    &::after {
      position: absolute;
      top: calc(var(--vh) * 15);
      left: 50%;
      width: calc(var(--vh) * 23);
      height: calc(var(--vh) * 23);
      background-color: #00ff6f;
      border-radius: 42% 38% 62% 49% / 45%;
      content: '';
      filter: drop-shadow(16px 16px 20px blue);
      transform: translate(-50%, -50%) rotate(0);

      animation: rotate 5s infinite linear;
    }
  }
}
.charging {
  z-index: 30;
  font-size: 20px;
  text-align: center;
  backdrop-filter: blur(50px);
  border-radius: 30px;
  padding: 20px 30px;
  margin-top: calc(var(--vh) * 10);
  box-shadow: inset 8px 8px 12px var(--login-neu-2),
    inset -8px -8px 12px var(--login-white);
}

@keyframes rotate {
  50% {
    border-radius: 45% / 42% 38% 58% 49%;
  }

  100% {
    transform: translate(-50%, -50%) rotate(960deg);
  }
}

@keyframes hueRotate {
  50% {
    filter: contrast(55) hue-rotate(180deg);
  }
  100% {
    filter: contrast(15) hue-rotate(360deg);
  }
}
</style>
