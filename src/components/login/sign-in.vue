<!-- sign_in -->
<template>
  <div id="b-container" class="sign-in-container b-container">
    <el-form
      id="b-form"
      ref="loginFormRef"
      :model="loginForm"
      :rules="loginRules"
      class="formClass"
    >
      <div class="w-96px flex items-center justify-center">
        <img :src="logo" alt="logo" class="w-96px h-96px" />
      </div>
      <h2 class="title m-t-1px m-b-1px">π 数据管理系统</h2>
      <el-form-item prop="user_name">
        <el-input
          v-model="loginForm.user_name"
          placeholder="用户名"
          style="width: 350px; height: 40px"
          type="text"
        />
      </el-form-item>
      <el-form-item prop="user_password">
        <el-input
          v-model="loginForm.user_password"
          placeholder="密码"
          style="width: 350px; height: 40px"
          type="password"
        />
      </el-form-item>
      <el-form-item v-model="loginForm.code" prop="code">
        <el-input
          v-model="loginForm.code"
          placeholder="验证码"
          style="width: 220px; height: 40px"
          type="text"
          @keyup.enter="submitLogin(loginFormRef)"
        />
        <img
          :class="appStore.app.isDark ? 'filter-invert-90' : 'filter-invert-0'"
          :src="captchaData?.img"
          alt="code"
          class="h-40px w-130px b-rd-6px"
          @click="getCaptcha"
        />
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" class="w-350px">
        记住密码
      </el-checkbox>
      <el-form-item>
        <el-button class="button" @click="submitLogin(loginFormRef)">
          SIGN IN
        </el-button>
        <el-button class="button" @click="formReset(loginFormRef)">
          RESET
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts" name="sign-in" setup>
import { usePreferredColorScheme } from '@vueuse/core'
import type { FormInstance, FormRules } from 'element-plus'
import { computed, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { useCaptcha } from '@/api/system/login'
import logo from '@/assets/logo.svg'
import { useFormUtil, useTheme } from '@/hooks'
import { useAppStore, useUserStore } from '@/stores'
import type { LoginFormLocal } from '@/types/base/login'

const userStore = useUserStore()
const appStore = useAppStore()
const router = useRouter()
const { captchaData, getCaptcha } = useCaptcha()
const { formValidate, formReset } = useFormUtil()

const { init_theme } = useTheme()
const color = computed(
  () => appStore.app.theme || usePreferredColorScheme().value
)
watch(
  () => color.value,
  (v, pv) => {
    init_theme(v, pv)
  }
)
init_theme(color.value! || appStore.app.theme)

const loginFormRef = ref<FormInstance>()

const loginForm = ref<LoginFormLocal>({
  user_name: '',
  user_password: '',
  rememberMe: false,
  code: '',
  uuid: '',
})

//  验证规则
const loginRules = reactive<FormRules>({
  user_name: [
    { required: true, trigger: 'blur', message: '请输入您的账号' },
    { min: 3, max: 20, message: '用户名为4-20位长度', trigger: 'blur' },
  ],
  user_password: [
    { required: true, message: '请输入用户密码', trigger: 'blur' },
  ],
  code: [
    { required: true, trigger: 'blur', message: '请输入验证码' },
    { min: 4, max: 4, message: '验证码为4位字符', trigger: 'blur' },
  ],
})

loginForm.value.rememberMe = userStore.rememberMe

// 提交登录
const submitLogin = async (formRef: FormInstance | undefined) => {
  if (!(await formValidate(formRef))) return
  loginForm.value.uuid = captchaData.value?.uuid!
  await userStore.login(loginForm.value)
  const redirect = router.currentRoute.value.query.redirect as string
  await router.push({ path: redirect })
}
// 获取本地用户信息
const getLocalUserInfo = () => {
  if (loginForm.value.rememberMe) {
    const { user_name, user_password } = userStore.getLocalUserInfo()
    loginForm.value.user_name = user_name
    loginForm.value.user_password = user_password
  }
}

getLocalUserInfo()
</script>
<style lang="scss" scoped>
.sign-in-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  margin: auto auto;

  top: 0;
  width: 600px;
  height: 100%;
  padding: 25px;

  background-color: var(--login-neu-1);
  transition: var(--login-neu-transition);
}

.title {
  font-size: 34px;
  font-weight: 700;
  line-height: 3;
  color: var(--login-black);
}

.button {
  width: 180px;
  height: 50px;
  border-radius: 25px;
  margin-top: 50px;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 1.15px;

  background-color: var(--login-purple);
  color: var(--login-white-fff);
  box-shadow: 8px 8px 16px var(--login-neu-2), -8px -8px 16px var(--login-white);

  border: none;
  outline: none;
}

.formClass {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .el-input {
    --el-input-bg-color: var(--login-neu-1);
  }
}

.b-container {
  left: calc(100% - 600px);
  z-index: 0;
}
</style>
