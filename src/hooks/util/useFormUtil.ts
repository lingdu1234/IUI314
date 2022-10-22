/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-03 15:42:11
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-22 10:08:15
 * @FilePath: \IUI314\src\hooks\util\useFormUtil.ts
 * @Description:
 */

import { type FormInstance, ElMessage } from 'element-plus'

import { useSetupI18n } from '@/i18n'

export const useFormUtil = () => {
  return {
    formReset,
    formValidate,
  }
}

/**
 * @description: 重置表单
 * @param {FormInstance} formRef
 */
const formReset = (formRef: FormInstance | undefined) => {
  if (!formRef) return
  formRef.resetFields()
}

/**
 * @description: 验证表单
 * @param {FormInstance} formRef
 */
const formValidate = async (formRef: FormInstance | undefined) => {
  let flag = false
  if (!formRef) return flag
  const { i18n } = useSetupI18n()
  const { t } = i18n.global
  await formRef.validate((valid) => {
    if (!valid) {
      ElMessage.warning(t('commonTip.submitInvalid'))
    } else {
      flag = true
    }
  })
  return flag
}
