<script lang="ts" setup>
import { useWindowSize } from '@vueuse/core'

import LoginLeft from './login-left.vue'
import LoginRight from './login-right.vue'
import { useTheme } from '@/hooks'

defineOptions({ name: 'Login' })

const { width } = useWindowSize()

useTheme().init_theme()

//
</script>

<template>
  <div class="login-container flex justify-center items-center w-100% h-100%">
    <div v-for="item of 50" :key="item" class="snowflake" />
    <div>
      <a-grid :col-gap="30" :cols="{ xs: 1, sm: 1, md: 1, lg: 2, xl: 2, xxl: 2 }">
        <a-grid-item v-if="width >= 992">
          <LoginLeft />
        </a-grid-item>
        <a-grid-item>
          <LoginRight />
        </a-grid-item>
      </a-grid>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.snowflake {
  --size: 1vw;
  width: var(--size);
  height: var(--size);
  background: url('@/assets/shuye_1.svg') no-repeat; //雪花图片 也可以画圆
  background-size: 100% 100%;
  position: fixed;
  top: -5vh; //出事高度在屏幕外 效果更真实
  z-index: 1000; //数字越大越上面
}

@keyframes snowfall {
  100% {
    transform: translate3d(var(--end), 100vh, 0);
  }
}

@for $i from 0 through 300 {
  .snowflake:nth-child(#{$i}) {
    //每个雪花的大小
    --size: #{(random(10) + 10) * 0.18}vw;
    //雪花移动目标点 -70后是负数 这样雪花会向左下方飘落
    --end: #{random(120) - 100}vw;
    transform: rotateZ(#{random(360)}deg);
    //雪花初始位置
    left: #{random(150)}vw;
    filter: hue-rotate(#{random(360)}deg);
    //雪花从顶到底移动的动画 动画时间可以调整雪花速度
    animation: snowfall #{5 + random(8)}s linear infinite;
    animation-delay: -#{random(10)}s;
  }
}
</style>
