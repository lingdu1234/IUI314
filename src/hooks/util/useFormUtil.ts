/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-03 15:42:11
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-03 17:55:41
 * @FilePath: \IUI314\src\hooks\util\useFormUtil.ts
 * @Description:
 */

import { type FormInstance, ElMessage } from 'element-plus'

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
  if (!formRef) return false
  return await formRef.validate((valid, fields) => {
    if (!valid) {
      const keys = []
      for (const key in fields) {
        keys.push(key)
      }
      ElMessage.warning(`提交错误,请检查\n ${keys}`)
      return false
    } else {
      return true
    }
  })
}
