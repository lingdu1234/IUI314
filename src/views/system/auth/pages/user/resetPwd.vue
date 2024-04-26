<script setup lang="ts">
import { ref } from 'vue'
import type { FormInstance } from '@arco-design/web-vue'

interface formValueType {
  password: string
}
defineOptions({ name: 'ResetPwd' })
const modalFormRef = ref<FormInstance>()
const formValue = defineModel<formValueType>('formValue', { required: true })
</script>

<template>
  <a-form ref="modalFormRef" layout="inline" :model="formValue">
    <a-form-item
      field="password"
      label="新密码"
      :rules="[
        { required: true, message: '请输入您的密码' },
        { minLength: 6, maxLength: 32, message: '用户名为6-32位长度' },
      ]"
      :validate-trigger="['blur']"
    >
      <a-input-password v-model:modelValue="formValue.password" type="password" placeholder="请输入新密码" />
    </a-form-item>
  </a-form>
</template>
