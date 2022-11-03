<template>
  <div class="login-container flex justify-center items-center w-100% h-100%">
    <div v-for="item of 50" :key="item" class="snowflake" />
    <el-row :gutter="width >= 992 ? 30 : 0">
      <el-col :span="24" :md="12">
        <LoginLeft />
      </el-col>
      <el-col :span="24" :md="12">
        <LoginRight />
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup name="login">
import { usePreferredColorScheme, useWindowSize } from '@vueuse/core'
import { ElCol, ElRow } from 'element-plus'
import { computed, watch } from 'vue'

import { useTheme } from '@/hooks'
import { useAppStore } from '@/stores'

import LoginLeft from './login-left.vue'
import LoginRight from './login-right.vue'

const { width } = useWindowSize()

const { init_theme } = useTheme()
const appStore = useAppStore()
const color = computed(
  () => appStore.app.theme || usePreferredColorScheme().value
)
watch(
  () => color.value,
  (v, pv) => {
    init_theme(v, pv)
  },
  {
    immediate: true,
  }
)
init_theme(color.value! || appStore.app.theme)
//
</script>
<style lang="scss" scoped>
.login-container {
  background-color: var(--login-neu-1);
  color: var(login-black);
  :deep(.circle) {
    border-radius: 50%;
    background-color: var(--login-neu-1);
    box-shadow: inset 8px 8px 12px var(--login-neu-2),
      inset -8px -8px 12px var(--login-white);
  }
  :deep(.login-son-container) {
    background-color: var(--login-neu-1);
    overflow: hidden;
    box-shadow: 4px 4px 10px var(--login-neu-2),
      -4px -4px 10px var(--login-white);
  }
}
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
