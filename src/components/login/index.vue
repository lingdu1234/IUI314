<template>
  <div class="login-container">
    <div v-for="item of 50" :key="item" class="snowflake" />
    <div class="login-main">
      <div class="login-tip">
        <LoginSwich />
      </div>
      <SignIn />
    </div>
  </div>
</template>

<script setup lang="ts" name="login">
import { useWindowSize } from '@vueuse/core'
import { watch } from 'vue'

import LoginSwich from './login-swich.vue'
import SignIn from './sign-in.vue'

const { width } = useWindowSize()

watch(
  () => width.value,
  (v) => {
    if (v > 800) {
      let node = document.getElementById('b-container')
      node?.classList.add('b-container')
    } else {
      let node = document.getElementById('b-container')
      node?.classList.remove('b-container')
    }
  }
)
</script>

<style lang="scss" scoped>
*,
*::after,
*::before {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  user-select: none;
}

.login-container {
  width: 100%;
  min-width: 630px;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  background-color: var(--login-neu-1);
  color: var(--login-gray);
}

.login-main {
  position: relative;
  width: 1000px;
  // min-width: 1000px;
  // min-height: 600px;
  height: 600px;
  padding: 25px;
  justify-content: center;
  align-items: center;
  background-color: var(--login-neu-1);
  box-shadow: 10px 10px 10px var(--login-neu-2),
    -10px -10px 10px var(--login-white);
  border-radius: 12px;
  overflow: hidden;
}

html.dark {
  .body {
    background-color: rgb(13, 17, 23);
    color: #ffffff;
  }
  .main {
    background-color: rgb(22, 27, 34);
    box-shadow: 10px 10px 10px rgb(41, 45, 49), -10px -10px 10px rgb(41, 45, 49);
  }
}

@media (max-width: 1200px) {
  .login-main {
    transform: scale(0.9);
  }
}
@media (max-width: 1000px) {
  .login-tip {
    display: none;
  }
  .login-main {
    width: 620px !important;
  }
}

.snowflake {
  --size: 1vw;
  width: var(--size);
  height: var(--size);
  //   background: var(--background);
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
    // 随机显示树叶
    // --background:url('@/assets/shuye_#{random(4)}.svg') no-repeat;
    //雪花初始位置
    left: #{random(150)}vw;
    filter: hue-rotate(#{random(360)}deg);
    //雪花从顶到底移动的动画 动画时间可以调整雪花速度
    animation: snowfall #{5 + random(8)}s linear infinite;
    animation-delay: -#{random(10)}s;
  }
}
</style>
