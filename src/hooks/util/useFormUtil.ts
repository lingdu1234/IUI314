import { type FormInstance, Message } from '@arco-design/web-vue'
import { useSetupI18n } from '@/i18n'

export function useFormUtil() {
  return {
    formReset,
    formValidate,
  }
}

/**
 * @description: 重置表单
 * @param {FormInstance} formRef
 */
function formReset(formRef: FormInstance | null) {
  if (!formRef)
    return
  formRef.resetFields()
}

/**
 * @description: 验证表单
 * @param {FormInstance} formRef
 */
async function formValidate(formRef: FormInstance | null) {
  let flag = false
  if (!formRef)
    return flag
  const { i18n } = useSetupI18n()
  const { t } = i18n.global
  await formRef.validate((errors) => {
    if (errors)
      Message.warning(t('commonTip.submitInvalid'))
    else
      flag = true
  })
  return flag
}
