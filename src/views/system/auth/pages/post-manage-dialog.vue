<template>
  <el-dialog
    :model-value="open"
    :before-close="cancel"
    :title="title"
    append-to-body
    width="600px"
  >
    <el-form
      ref="postFormRef"
      :model="form"
      :rules="rules"
      class="base-form"
      label-width="100px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="岗位名称" prop="post_name">
            <el-input v-model="form.post_name" placeholder="请输入部门名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="岗位编码" prop="post_code">
            <el-input
              v-model="form.post_code"
              maxlength="20"
              placeholder="请输入负责人"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="岗位排序" prop="post_sort">
            <el-input-number
              v-model="form.post_sort"
              :min="0"
              controls-position="right"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="部门状态">
            <el-radio-group v-model="form.status">
              <el-radio
                v-for="dict in dicts[dictKey.sysNormalDisable]"
                :key="dict.value"
                :label="dict.value"
              >
                {{ dict.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="form.remark"
              maxlength="50"
              placeholder="请输入邮箱"
              type="textarea"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm(userRef)">
          {{ t('common.submit') }}
        </el-button>
        <el-button @click="cancel">
          {{ t('common.cancel') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import {
  ElButton,
  ElCol,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElMessage,
  ElRadio,
  ElRadioGroup,
  ElRow,
  type FormInstance,
  type FormRules,
} from 'element-plus'
import { type PropType, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { ApiSysPost, ErrorFlag } from '@/api/apis'
import { useDicts, useFormUtil, usePost, usePut } from '@/hooks'
import type { MessageSchema } from '@/i18n'
import { dictKey } from '@/types/system/dict'
import type { post } from '@/types/system/post'

const props = defineProps({
  postData: {
    type: Object as PropType<post>,
    required: true,
  },
  open: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
})
const emits = defineEmits(['closeDialog'])
const form = ref<post>({ ...props.postData })
const userRef = ref<FormInstance>()
const { formValidate } = useFormUtil()
const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
// 字典数据
const dicts = useDicts(dictKey.sysNormalDisable)

const rules = ref<FormRules>({
  post_name: [{ required: true, message: '岗位名称不能为空', trigger: 'blur' }],
  post_code: [{ required: true, message: '岗位编码不能为空', trigger: 'blur' }],
  post_sort: [{ required: true, message: '岗位顺序不能为空', trigger: 'blur' }],
})

//  提交按钮函数
const submitForm = async (formRef: FormInstance | undefined) => {
  if (!(await formValidate(formRef))) return
  if (form.value.post_id) {
    const { data, execute } = usePut(ApiSysPost.edit, form)
    await execute()
    if (data.value === ErrorFlag) return
    ElMessage.success(`更新 ${form.value.post_name} 成功`)
  } else {
    const { data, execute } = usePost(ApiSysPost.add, form)
    await execute()
    if (data.value === ErrorFlag) return
    ElMessage.success(`新增 ${form.value.post_name} 成功`)
  }
  cancel()
}
const cancel = () => {
  emits('closeDialog')
}
</script>
