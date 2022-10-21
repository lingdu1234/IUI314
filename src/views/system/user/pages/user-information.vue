<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-20 17:24:11
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-20 17:40:59
 * @FilePath: \IUI314\src\views\system\user\pages\user-information.vue
 * @Description: 
-->
<template>
  <el-form ref="userRef" :model="user" :rules="rules" label-width="80px">
    <el-form-item label="用户昵称" prop="user_nickname">
      <el-input v-model="user.user_nickname" maxlength="30" />
    </el-form-item>
    <el-form-item label="手机号码" prop="phone_num">
      <el-input v-model="user.phone_num" maxlength="11" />
    </el-form-item>
    <el-form-item label="邮箱" prop="user_email">
      <el-input v-model="user.user_email" maxlength="50" />
    </el-form-item>
    <el-form-item label="性别">
      <el-radio-group v-model="user.sex">
        <el-radio label="0"> 男 </el-radio>
        <el-radio label="1"> 女 </el-radio>
        <el-radio label="2"> 未知 </el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit"> 保存 </el-button>
      <el-button type="danger" @click="handleClose"> 关闭 </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup name="user-information">
import { type FormInstance, type FormRules, ElMessage } from 'element-plus'
import { type PropType, ref } from 'vue'

import { ErrorFlag } from '@/api/apis'
import { ApiSysUser } from '@/api/sysApis'
import { Eaction } from '@/components/layout/tab-bar/useTabBar'
import { setTabBarEmitter, useFormUtil, usePut } from '@/hooks'
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