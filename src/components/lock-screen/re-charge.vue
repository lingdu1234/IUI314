<template>
  <div class="container">
    <div class="number">{{ 100 * level }}%</div>
    <div class="contrast">
      <div class="circle" />
      <ul class="bubbles">
        <li v-for="i in 15" :key="i" />
      </ul>
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
.container {
  position: absolute;
  bottom: calc(var(--vh) * 20);
  top: calc(var(--vh) * 30);
  left: 50vw;
  width: 300px;
  height: 500px;
  transform: translateX(-50%);

  .number {
    position: absolute;
    top: 20%;
    z-index: 10;
    width: 300px;
    font-size: 32px;
    text-align: center;
  }

  .contrast {
    width: 300px;
    height: 400px;
    overflow: hidden;
    filter: contrast(15) hue-rotate(0);
    animation: hueRotate 10s infinite linear;

    .circle {
      position: relative;
      width: 300px;
      height: 300px;
      filter: blur(8px);
      box-sizing: border-box;

      &::after {
        position: absolute;
        top: 40%;
        left: 50%;
        width: 200px;
        height: 200px;
        background-color: #00ff6f;
        border-radius: 42% 38% 62% 49% / 45%;
        content: '';
        transform: translate(-50%, -50%) rotate(0);
        animation: rotate 10s infinite linear;
      }

      &::before {
        position: absolute;
        top: 40%;
        left: 50%;
        z-index: 10;
        width: 176px;
        height: 176px;
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 50%;
        content: '';
        transform: translate(-50%, -50%);
      }
    }

    .bubbles {
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 100px;
      height: 40px;
      background-color: #00ff6f;
      border-radius: 100px 100px 0 0;
      filter: blur(5px);
      transform: translate(-50%, 0);

      li {
        position: absolute;
        background: #00ff6f;
        border-radius: 50%;
      }
    }
  }

  .charging {
    font-size: 20px;
    text-align: center;
    backdrop-filter: blur(10px);
    border-radius: 10px;
    padding: 10px;
  }
}

@keyframes rotate {
  50% {
    border-radius: 45% / 42% 38% 58% 49%;
  }

  100% {
    transform: translate(-50%, -50%) rotate(720deg);
  }
}

@keyframes moveToTop {
  90% {
    opacity: 1;
  }

  100% {
    opacity: 0.1;
    transform: translate(-50%, -180px);
  }
}

@keyframes hueRotate {
  100% {
    filter: contrast(15) hue-rotate(360deg);
  }
}
</style>
