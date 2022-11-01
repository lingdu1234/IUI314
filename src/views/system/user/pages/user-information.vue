<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-20 17:24:11
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-11-01 16:00:58
 * @FilePath: \IUI314\src\views\system\user\pages\user-information.vue
 * @Description: 
-->
<template>
  <el-form ref="userRef" :model="user" :rules="rules" label-width="80px">
    <el-form-item :label="t('profile.nickName')" prop="user_nickname">
      <el-input v-model="user.user_nickname" maxlength="30" />
    </el-form-item>
    <el-form-item :label="t('common.phoneNum')" prop="phone_num">
      <el-input v-model="user.phone_num" maxlength="11" />
    </el-form-item>
    <el-form-item :label="t('common.email')" prop="user_email">
      <el-input v-model="user.user_email" maxlength="50" />
    </el-form-item>
    <el-form-item :label="t('common.sex')">
      <el-radio-group v-model="user.sex">
        <el-radio label="0"> {{ t('common.sexV.male') }} </el-radio>
        <el-radio label="1"> {{ t('common.sexV.female') }} </el-radio>
        <el-radio label="2"> {{ t('common.sexV.unknown') }} </el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">
        {{ t('common.save') }}
      </el-button>
      <el-button type="danger" @click="handleClose">
        {{ t('common.close') }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup name="user-information">
import {
  type FormInstance,
  type FormRules,
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElRadio,
  ElRadioGroup,
} from 'element-plus'
import { type PropType, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { ErrorFlag } from '@/api/apis'
import { ApiSysUser } from '@/api/sysApis'
import { Eaction } from '@/components/layout/tab-bar/useTabBar'
import { setTabBarEmitter, useFormUtil, usePut } from '@/hooks'
import type { MessageSchema } from '@/i18n'
import { router } from '@/router'
import type { user } from '@/types/system/user'

const props = defineProps({
  user: {
    type: Object as PropType<user>,
    required: true,
  },
})

const { formValidate } = useFormUtil()
const userRef = ref<FormInstance>()
const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })

const rules = ref<FormRules>({
  user_nickname: [
    { required: true, message: '用户昵称不能为空', trigger: 'blur' },
  ],
  user_email: [
    { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
    {
      type: 'email',
      message: '请输入正确的邮箱地址',
      trigger: ['blur', 'change'],
    },
  ],
  phone_num: [
    { required: true, message: '手机号码不能为空', trigger: 'blur' },
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: '请输入正确的手机号码',
      trigger: 'blur',
    },
  ],
})

/** 提交按钮 */
const submit = async () => {
  if (!(await formValidate(userRef.value))) return
  const user = {
    id: props.user.id,
    user_nickname: props.user.user_nickname,
    user_email: props.user.user_email,
    phone_num: props.user.phone_num,
    sex: props.user.sex,
  }
  const { execute, data } = usePut(ApiSysUser.updateProfile, user)
  await execute()
  if (data.value === ErrorFlag) return
  ElMessage.success('用户信息更新成功')
}

/** 关闭按钮 */
const handleClose = () => {
  // 路由回退
  router.back()
  // 关闭当前便签
  setTabBarEmitter(Eaction.current)
}
</script>
