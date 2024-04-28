<script lang="ts" setup>
import { type PropType, computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { Message } from '@arco-design/web-vue'
import type { FieldRule, FormInstance } from '@arco-design/web-vue/es/form'
import { ErrorFlag } from '@/api/apis'
import { ApiSysUser } from '@/api/sysApis'
import { TabAction } from '@/components/layout/tab-bar/useTabBar'
import { useFormUtil, usePut } from '@/hooks'
import type { MessageSchema } from '@/i18n'
import { router } from '@/router'
import { useTabBarStore } from '@/stores'
import type { userInformation } from '@/types/system/userInformation'

defineOptions({ name: 'UserInformation' })

const props = defineProps({
  user: {
    type: Object as PropType<userInformation>,
    required: true,
  },
})
const tabBarStore = useTabBarStore()
const userIf = computed(() => props.user)
const { formValidate } = useFormUtil()
const userRef = ref<FormInstance>()
const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })

const rules = ref<{ [key: string]: FieldRule[] }>({
  user_nickname: [
    { required: true, message: '用户昵称不能为空' },
  ],
  user_email: [
    { required: true, message: '邮箱地址不能为空' },
    {
      type: 'email',
      message: '请输入正确的邮箱地址',
    },
  ],
  phone_num: [
    { required: true, message: '手机号码不能为空' },
    {
      match: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: '请输入正确的手机号码',
    },
  ],
})

/** 提交按钮 */
async function submit() {
  if (!(await formValidate(userRef.value)))
    return
  const user = {
    id: userIf.value.id,
    user_nickname: userIf.value.user_nickname,
    user_email: userIf.value.user_email,
    phone_num: userIf.value.phone_num,
    sex: userIf.value.sex,
  }
  const { execute, data } = usePut(ApiSysUser.updateProfile, user)
  await execute()
  if (data.value === ErrorFlag)
    return
  Message.success('用户信息更新成功')
}

/** 关闭按钮 */
function handleClose() {
  // 路由回退
  router.back()
  // 关闭当前标签
  tabBarStore.tabActionSelect(tabBarStore.getCurrentRouteTag(), TabAction.current)
}
</script>

<template>
  <a-form ref="userRef" :model="userIf" :rules="rules" auto-label-width>
    <a-form-item :label="t('profile.nickName')" field="user_nickname" validate-trigger="blur">
      <a-input v-model="userIf.user_nickname" />
    </a-form-item>
    <a-form-item :label="t('sys.phone')" field="phone_num" validate-trigger="blur">
      <a-input v-model="userIf.phone_num" />
    </a-form-item>
    <a-form-item :label="t('sys.email')" field="user_email" validate-trigger="blur">
      <a-input v-model="userIf.user_email" />
    </a-form-item>
    <a-form-item :label="t('sys.sex')">
      <a-radio-group v-model="userIf.sex">
        <a-radio value="0">
          {{ t('sys.sexV.male') }}
        </a-radio>
        <a-radio value="1">
          {{ t('sys.sexV.female') }}
        </a-radio>
        <a-radio value="2">
          {{ t('sys.sexV.unknown') }}
        </a-radio>
      </a-radio-group>
    </a-form-item>
    <div class="flex justify-around m-t-30px">
      <a-button type="primary" @click="submit">
        {{ t('common.save') }}
      </a-button>
      <a-button type="secondary" status="danger" @click="handleClose">
        {{ t('common.close') }}
      </a-button>
    </div>
  </a-form>
</template>
