<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import type { FieldRule, FormInstance } from '@arco-design/web-vue'
import { IconLock, IconUser } from '@arco-design/web-vue/es/icon'
import { useI18n } from 'vue-i18n'
import { ApiSysLogin } from '@/api/sysApis'
import logo from '@/assets/logo.svg'
import { useFormUtil, useGet, useTheme } from '@/hooks'
import type { MessageSchema } from '@/i18n'
import { useUserStore } from '@/stores'
import type { LoginFormLocal, codeData } from '@/types/base/login'

defineOptions({ name: 'LoginRight' })

const userStore = useUserStore()
const router = useRouter()
const { formValidate, formReset } = useFormUtil()

const loginFormRef = ref<FormInstance>()

const loginForm = ref<LoginFormLocal>({
  user_name: '',
  user_password: '',
  rememberMe: false,
  code: '',
  uuid: '',
})

const isDark = useTheme().get_is_dark()
const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })

// 验证码获取
const { data: captchaData, execute: getCaptcha } = useGet<codeData>(ApiSysLogin.getCaptcha, null, { immediate: true })

//  验证规则
const loginRules = ref<{ [key: string]: FieldRule[] }>({
  user_name: [
    { required: true, message: t('sys.loginUserNameValidateTipA') },
    { minLength: 4, maxLength: 20, message: t('sys.loginUserNameValidateTipB') },
  ],
  user_password: [
    { required: true, message: t('sys.loginUserPasswordValidateTipA') },
  ],
  code: [
    { required: true, message: t('sys.loginCodeValidateTipA') },
    { minLength: 1, maxLength: 10, message: t('sys.loginCodeValidateTipB') },
  ],
})

loginForm.value.rememberMe = userStore.rememberMe

// 提交登录
async function submitLogin(formRef: FormInstance | undefined) {
  if (!(await formValidate(formRef)))
    return
  loginForm.value.uuid = captchaData.value!.uuid
  await userStore.login(loginForm.value)
  const redirect = router.currentRoute.value.query.redirect
    ? (router.currentRoute.value.query.redirect as string)
    : '/index'
  await router.push({ path: redirect })
}
// 获取本地用户信息
function getLocalUserInfo() {
  if (loginForm.value.rememberMe) {
    const { user_name, user_password } = userStore.getLocalUserInfo()
    loginForm.value.user_name = user_name
    loginForm.value.user_password = user_password
  }
}

getLocalUserInfo()
</script>

<template>
  <div class="w-100% flex justify-center items-center m-t-30px">
    <div
      class="login-son-container h-450px w-400px flex justify-center b-rd-20px"
    >
      <a-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-align="left"
        hide-label="true"
        class="p-l-20px p-r-20px"
      >
        <div class="flex items-center justify-center m-t-20px">
          <div
            class="logo_circle flex items-center justify-center w-72px h-72px"
          >
            <img :src="logo" alt="logo" class="w-48px h-48px">
          </div>
        </div>
        <h2 class="m-t-10px m-b-10px text-center">
          π {{ t("app.APP") }}
        </h2>
        <a-form-item
          field="user_name"
          validate-trigger="blur"
          hide-label
        >
          <a-input
            v-model="loginForm.user_name"
            :placeholder="t('sys.userName')"
            size="large"
            type="text"
          >
            <template #prefix>
              <IconUser />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item
          field="user_password"
          validate-trigger="blur"
          hide-label
        >
          <a-input
            v-model="loginForm.user_password"
            size="large"
            :placeholder="t('sys.passWord')"
            type="password"
          >
            <template #prefix>
              <IconLock />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item
          v-model="loginForm.code"
          field="code"
          validate-trigger="blur"

          hide-label
        >
          <a-input
            v-model="loginForm.code"
            :placeholder="t('sys.validateCode')"
            size="large"
            type="text"
            @keyup.enter="submitLogin(loginFormRef)"
          >
            <template #prefix>
              <IconUnlock />
            </template>
          </a-input>
          <img
            :class="
              isDark ? 'filter-invert-90' : 'filter-invert-0'
            "
            :src="captchaData?.img"
            alt="code"
            class="h-40px w-130px b-rd-6px m-l-5px"
            @click="() => getCaptcha()"
          >
        </a-form-item>
        <a-checkbox v-model="loginForm.rememberMe" class="w-350px">
          {{ t('sys.rememberMe') }}
        </a-checkbox>
        <div class="flex justify-around m-t-30px">
          <a-button type="primary" @click="submitLogin(loginFormRef)">
            {{ t('sys.login') }}
          </a-button>
          <a-button type="secondary" @click="formReset(loginFormRef)">
            {{ t('sys.reset') }}
          </a-button>
        </div>
      </a-form>
    </div>
  </div>
</template>
