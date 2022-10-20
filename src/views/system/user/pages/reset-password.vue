<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-20 17:37:13
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-20 17:52:41
 * @FilePath: \IUI314\src\views\system\user\pages\reset-password.vue
 * @Description: 
-->
<template>
  <el-form ref="pwdRef" :model="user" :rules="rules" label-width="80px">
    <el-form-item label="旧密码" prop="oldPassword">
      <el-input
        v-model="user.oldPassword"
        placeholder="请输入旧密码"
        type="password"
        show-password
      />
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input
        v-model="user.newPassword"
        placeholder="请输入新密码"
        type="password"
        show-password
      />
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input
        v-model="user.confirmPassword"
        placeholder="请确认密码"
        type="password"
        show-password
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit"> 保存 </el-button>
      <el-button type="danger" @click="handleClose"> 关闭 </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup name="reset-password">
import md5 from 'blueimp-md5'
import { type FormInstance, type FormRules, ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'

import { ApiSysUser, ErrorFlag } from '@/api/apis'
import { Eaction } from '@/components/layout/tab-bar/useTabBar'
import { setTabBarEmitter, useFormUtil, usePut } from '@/hooks'
import { router } from '@/router'
import { useUserStore } from '@/stores'

const { formValidate } = useFormUtil()
const userStore = useUserStore()

const user = reactive({
  oldPassword: undefined,
  newPassword: undefined,
  confirmPassword: undefined,
})

const pwdRef = ref<FormInstance>()

const equalToPassword = (rule: any, value: any, callback: any) => {
  if (user.newPassword !== value) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}
const rules = ref<FormRules>({
  oldPassword: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '新密码不能为空', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '确认密码不能为空', trigger: 'blur' },
    { required: true, validator: equalToPassword, trigger: 'blur' },
  ],
})

/** 提交按钮 */
const submit = async () => {
  if (!(await formValidate(pwdRef.value))) return
  const v = {
    old_passwd: md5(user.oldPassword!),
    new_passwd: md5(user.newPassword!),
  }
  const { execute, data } = usePut(ApiSysUser.updatePwd, v)
  await execute()
  if (data.value === ErrorFlag) return
  ElMessage.success('修改成功,请重新登录,秒钟后将自动退出并转入登录界面')
  await userStore.logOut()
  setTimeout(
    () => router.push(`/login?redirect=${router.currentRoute.value.fullPath}`),
    1000
  )
}
/** 关闭按钮 */
const handleClose = () => {
  // 路由回退
  router.back()
  // 关闭当前便签
  setTabBarEmitter(Eaction.current)
}
</script>
