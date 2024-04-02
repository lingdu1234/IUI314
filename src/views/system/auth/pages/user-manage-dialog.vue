<script lang="ts" setup>
import md5 from 'blueimp-md5'
import {
  ElButton,
  ElCol,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElOption,
  ElRadio,
  ElRadioGroup,
  ElRow,
  ElSelect,
  ElTreeSelect,
  type FormInstance,
  type FormRules,
} from 'element-plus'
import { inject, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { ApiSysPost, ApiSysRole, ApiSysUser, ErrorFlag } from '@/api/apis'
import { useDicts, useFormUtil, useGet, usePost, usePut } from '@/hooks'
import type { MessageSchema } from '@/i18n'
import type { ElSelectOptionInterface } from '@/types/base/elmentplus'
import type { dept } from '@/types/system/dept'
import { dictKey } from '@/types/system/dict'
import type { postList } from '@/types/system/post'
import type { roleList } from '@/types/system/role'
import type { userInfo, userInformation } from '@/types/system/userInformation'

const props = defineProps({
  userId: {
    type: String,
    default: '',
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
const form = ref<userInformation>({})
const deptTree = inject<dept[]>('deptTree')
const roleOptions = ref<ElSelectOptionInterface[]>([])
const postOptions = ref<ElSelectOptionInterface[]>([])
const userRef = ref<FormInstance>()
const { formValidate } = useFormUtil()
const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })

const deptTreeProps = {
  value: 'dept_id',
  label: 'dept_name',
  checkStrictly: true,
}
// 字典数据
const dicts = useDicts(
  dictKey.sysNormalDisable,
  dictKey.isAdmin,
  dictKey.sysUserSex,
)
//  自定义验证规则
function checkDeptId(_rule: any, value: any, callback: any) {
  if (value === '')
    callback(new Error('激活部门不能为空'))
  else if (!form.value.dept_ids!.includes(form.value.dept_id!))
    callback(new Error('激活部门必须在已选择部门内选择'))
  else
    callback()
}
function checkDeptIds(_rule: any, value: any, callback: any) {
  if (value === '' || value.length === 0) {
    callback(new Error('用户部门不能为空'))
  }
  else {
    if (form.value.dept_id)
      userRef.value?.validateField('dept_id', () => null)

    callback()
  }
}
function checkRoleId(_rule: any, value: any, callback: any) {
  if (value === '')
    callback(new Error('激活角色不能为空'))
  else if (!form.value.role_ids!.includes(form.value.role_id!))
    callback(new Error('激活角色必须在已选择角色内选择'))
  else
    callback()
}
function checkRoleIds(_rule: any, value: any, callback: any) {
  if (value === '' || value.length === 0) {
    callback(new Error('用户角色不能为空'))
  }
  else {
    if (form.value.role_id)
      userRef.value?.validateField('role_id', () => null)

    callback()
  }
}

const rules = ref<FormRules>({
  user_name: [
    { required: true, message: '用户名称不能为空', trigger: 'blur' },
    {
      min: 2,
      max: 20,
      message: '用户名称长度必须介于 2 和 20 之间',
      trigger: 'blur',
    },
  ],
  user_nickname: [
    { required: true, message: '用户昵称不能为空', trigger: 'blur' },
  ],
  user_password: [
    { required: true, message: '用户密码不能为空', trigger: 'blur' },
    {
      min: 5,
      max: 32,
      message: '用户密码长度必须介于 5 和 32 之间',
      trigger: 'blur',
    },
  ],
  user_email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
  ],
  sex: [{ required: true, message: '用户性别不能为空', trigger: 'change' }],
  post_ids: [
    { required: true, message: '用户岗位不能为空', trigger: 'change' },
  ],
  dept_ids: [{ validator: checkDeptIds, required: true, trigger: 'change' }],
  dept_id: [{ validator: checkDeptId, required: true, trigger: 'change' }],
  role_ids: [{ validator: checkRoleIds, required: true, trigger: 'change' }],
  role_id: [{ validator: checkRoleId, required: true, trigger: 'change' }],
})

//  提交按钮函数
async function submitForm(formRef: FormInstance | undefined) {
  if (!(await formValidate(formRef)))
    return
  if (form.value.id) {
    const data = { ...form.value }
    data.user_password = md5(form.value.user_password!)
    const { data: dataRes, execute } = usePut(ApiSysUser.edit, data)
    await execute()
    if (dataRes.value === ErrorFlag)
      return
    ElMessage.success(`成功更新用户 ${form.value.user_name}`)
    cancel()
  }
  else {
    const data = { ...form.value }
    data.user_password = md5(form.value.user_password!)
    const { data: dataRes, execute } = usePost(ApiSysUser.add, data)
    await execute()
    if (dataRes.value === ErrorFlag)
      return
    ElMessage.success(`成功新增用户 ${form.value.user_name}`)
    cancel()
  }
}
// 选项初始化
async function optionsInit() {
  const queryParams = {
    page_num: 1,
    page_size: Number.MAX_SAFE_INTEGER,
  }
  const { data: b, execute: be } = useGet<roleList>(
    ApiSysRole.getList,
    queryParams,
  )
  const { data: c, execute: ce } = useGet<postList>(
    ApiSysPost.getList,
    queryParams,
  )
  await Promise.all([be(), ce()])

  const _roleOptions: ElSelectOptionInterface[] = []
  const _postOptions: ElSelectOptionInterface[] = []

  b.value?.list!.forEach((it) => {
    const item: ElSelectOptionInterface = {
      key: it.role_id!,
      label: it.role_name!,
      value: it.role_id!,
      disabled: it.status === '0',
    }
    _roleOptions.push(item)
  })
  c.value?.list!.forEach((it) => {
    const item: ElSelectOptionInterface = {
      key: it.post_id!,
      label: it.post_name!,
      value: it.post_id!,
      disabled: it.status === '0',
    }
    _postOptions.push(item)
  })

  roleOptions.value = _roleOptions
  postOptions.value = _postOptions
  // 清除验证
  userRef.value?.clearValidate()
}
//  formData数据初始化
async function formDataInit() {
  if (props.userId === '') {
    form.value = {
      user_status: '1',
      is_admin: '1',
    }
  }
  else {
    const { data, execute } = useGet<userInfo>(ApiSysUser.getById, {
      user_id: props.userId,
    })
    await execute()
    form.value = data.value?.user_info!
    form.value.post_ids = data.value?.post_ids
    form.value.role_ids = data.value?.role_ids
    form.value.dept_ids = data.value?.dept_ids
  }
}
formDataInit()
optionsInit()
function cancel() {
  emits('closeDialog')
}
</script>

<template>
  <ElDialog
    :model-value="open"
    :title="title"
    width="680px"
    :before-close="cancel"
    append-to-body
  >
    <ElForm
      ref="userRef"
      :model="form"
      :rules="rules"
      label-width="80px"
      class="base-form"
    >
      <ElRow :gutter="20">
        <ElCol :span="12">
          <ElFormItem
            v-if="form.id === undefined"
            label="用户名称"
            prop="user_name"
          >
            <ElInput
              v-model="form.user_name"
              placeholder="请输入用户名称"
              maxlength="30"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem
            v-if="form.id === undefined"
            label="用户密码"
            prop="user_password"
          >
            <ElInput
              v-model="form.user_password"
              placeholder="请输入用户密码"
              type="password"
              maxlength="32"
              show-password
            />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow :gutter="20">
        <ElCol :span="12">
          <ElFormItem label="用户昵称" prop="user_nickname">
            <ElInput
              v-model="form.user_nickname"
              placeholder="请输入用户昵称"
              maxlength="30"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="用户性别" prop="sex">
            <ElSelect v-model="form.sex" placeholder="请选择用户性别">
              <ElOption
                v-for="dict in dicts[dictKey.sysUserSex]"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow :gutter="20">
        <ElCol :span="12">
          <ElFormItem label="用户部门" prop="dept_ids">
            <ElTreeSelect
              v-model="form.dept_ids"
              :data="deptTree"
              :props="deptTreeProps"
              check-strictly
              :render-after-expand="false"
              placeholder="请选择部门"
              filterable
              multiple
              collapse-tags
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="激活部门" prop="dept_id">
            <ElTreeSelect
              v-model="form.dept_id"
              :data="deptTree"
              :props="deptTreeProps"
              check-strictly
              :render-after-expand="false"
              placeholder="请选择激活部门"
              clearable
              filterable
            />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow :gutter="20">
        <ElCol :span="12">
          <ElFormItem label="用户角色" prop="role_ids">
            <ElSelect
              v-model="form.role_ids"
              multiple
              collapse-tags
              placeholder="请选择用户角色"
            >
              <ElOption
                v-for="item in roleOptions"
                :key="item.key"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled!"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="激活角色" prop="role_id">
            <ElSelect v-model="form.role_id" placeholder="请选择激活角色">
              <ElOption
                v-for="item in roleOptions"
                :key="item.key"
                :label="item.label"
                :value="item.value"
                :disabled="!form.role_ids!.includes(item.value!)"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow :gutter="20">
        <ElCol :span="12">
          <ElFormItem label="手机号码" prop="phone_num">
            <ElInput
              v-model="form.phone_num"
              placeholder="请输入手机号码"
              maxlength="11"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="用户邮箱" prop="email">
            <ElInput
              v-model="form.user_email"
              placeholder="请输入邮箱"
              maxlength="50"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow :gutter="20">
        <ElCol :span="12">
          <ElFormItem label="用户岗位" prop="post_ids">
            <ElSelect
              v-model="form.post_ids"
              multiple
              collapse-tags
              placeholder="请选择用户岗位"
            >
              <ElOption
                v-for="item in postOptions"
                :key="item.key"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled!"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow :gutter="20">
        <ElCol :span="12">
          <ElFormItem label="后台用户">
            <ElRadioGroup v-model="form.is_admin">
              <ElRadio
                v-for="dict in dicts[dictKey.isAdmin]"
                :key="dict.value"
                :label="dict.value"
              >
                {{ dict.label }}
              </ElRadio>
            </ElRadioGroup>
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="用户状态">
            <ElRadioGroup v-model="form.user_status">
              <ElRadio
                v-for="dict in dicts[dictKey.sysNormalDisable]"
                :key="dict.value"
                :label="dict.value"
              >
                {{ dict.label }}
              </ElRadio>
            </ElRadioGroup>
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="24">
          <ElFormItem label="备注">
            <ElInput
              v-model="form.remark"
              type="textarea"
              placeholder="请输入内容"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>
    <template #footer>
      <div class="dialog-footer">
        <ElButton type="primary" @click="submitForm(userRef)">
          {{ t('common.submit') }}
        </ElButton>
        <ElButton @click="cancel">
          {{ t('common.cancel') }}
        </ElButton>
      </div>
    </template>
  </ElDialog>
</template>
