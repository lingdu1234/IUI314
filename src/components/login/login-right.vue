<template>
  <div class="w-100% flex justify-center items-center m-t-30px">
    <div
      class="login-son-container h-450px w-400px flex justify-center b-rd-20px"
    >
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="formClass"
      >
        <div class="flex items-center justify-center m-t-20px">
          <div
            class="logo_circle flex items-center justify-center w-72px h-72px"
          >
            <img :src="logo" alt="logo" class="w-48px h-48px" />
          </div>
        </div>
        <h2 class="m-t-10px m-b-20px text-center">π 数据管理系统</h2>
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
            :class="
              appStore.app.isDark ? 'filter-invert-90' : 'filter-invert-0'
            "
            :src="captchaData?.img"
            alt="code"
            class="h-40px w-130px b-rd-6px"
            @click="getCaptcha"
          />
        </el-form-item>
        <el-checkbox v-model="loginForm.rememberMe" class="w-350px">
          记住密码
        </el-checkbox>
        <div class="flex justify-around m-t-30px">
          <el-button type="success" @click="submitLogin(loginFormRef)">
            登录
          </el-button>
          <el-button type="info" @click="formReset(loginFormRef)">
            重置
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts" setup name="login-right">
import {
  ElButton,
  ElCheckbox,
  ElForm,
  ElFormItem,
  ElInput,
  type FormInstance,
  type FormRules,
} from 'element-plus'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useCaptcha } from '@/api/system/login'
import logo from '@/assets/logo.svg'
import { useFormUtil } from '@/hooks'
import { useAppStore, useUserStore } from '@/stores'
import type { LoginFormLocal } from '@/types/base/login'

const userStore = useUserStore()
const appStore = useAppStore()
const router = useRouter()
const { captchaData, getCaptcha } = useCaptcha()
const { formValidate, formReset } = useFormUtil()

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
  const redirect = router.currentRoute.value.query.redirect
    ? (router.currentRoute.value.query.redirect as string)
    : '/index'
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
.formClass {
  .el-input {
    --el-input-bg-color: var(--main-bg-color);
  }
}
</style>
