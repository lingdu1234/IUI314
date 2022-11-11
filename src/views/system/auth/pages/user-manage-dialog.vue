<template>
  <el-dialog
    :model-value="open"
    :title="title"
    width="680px"
    :before-close="cancel"
    append-to-body
  >
    <el-form
      ref="userRef"
      :model="form"
      :rules="rules"
      label-width="80px"
      class="base-form"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            v-if="form.id === undefined"
            label="用户名称"
            prop="user_name"
          >
            <el-input
              v-model="form.user_name"
              placeholder="请输入用户名称"
              maxlength="30"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            v-if="form.id === undefined"
            label="用户密码"
            prop="user_password"
          >
            <el-input
              v-model="form.user_password"
              placeholder="请输入用户密码"
              type="password"
              maxlength="32"
              show-password
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用户昵称" prop="user_nickname">
            <el-input
              v-model="form.user_nickname"
              placeholder="请输入用户昵称"
              maxlength="30"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户性别" prop="sex">
            <el-select v-model="form.sex" placeholder="请选择用户性别">
              <el-option
                v-for="dict in dicts[dictKey.sysUserSex]"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用户部门" prop="dept_ids">
            <el-tree-select
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
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="激活部门" prop="dept_id">
            <el-tree-select
              v-model="form.dept_id"
              :data="deptTree"
              :props="deptTreeProps"
              check-strictly
              :render-after-expand="false"
              placeholder="请选择激活部门"
              clearable
              filterable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用户角色" prop="role_ids">
            <el-select
              v-model="form.role_ids"
              multiple
              collapse-tags
              placeholder="请选择用户角色"
            >
              <el-option
                v-for="item in roleOptions"
                :key="item.role_id"
                :label="item.role_name"
                :value="item.role_id"
                :disabled="item.status == '0'"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="激活角色" prop="role_id">
            <el-select v-model="form.role_id" placeholder="请选择激活角色">
              <el-option
                v-for="item in roleOptions"
                :key="item.role_id"
                :label="item.role_name"
                :value="item.role_id"
                :disabled="!form.role_ids!.includes(item.role_id!)"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="手机号码" prop="phone_num">
            <el-input
              v-model="form.phone_num"
              placeholder="请输入手机号码"
              maxlength="11"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户邮箱" prop="email">
            <el-input
              v-model="form.user_email"
              placeholder="请输入邮箱"
              maxlength="50"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用户岗位" prop="post_ids">
            <el-select
              v-model="form.post_ids"
              multiple
              collapse-tags
              placeholder="请选择用户岗位"
            >
              <el-option
                v-for="item in postOptions"
                :key="item.post_id"
                :label="item.post_name"
                :value="item.post_id"
                :disabled="item.status == '0'"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="后台用户">
            <el-radio-group v-model="form.is_admin">
              <el-radio
                v-for="dict in dicts[dictKey.isAdmin]"
                :key="dict.value"
                :label="dict.value"
              >
                {{ dict.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户状态">
            <el-radio-group v-model="form.user_status">
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
          <el-form-item label="备注">
            <el-input
              v-model="form.remark"
              type="textarea"
              placeholder="请输入内容"
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
import md5 from 'blueimp-md5'
import {
  type FormInstance,
  type FormRules,
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
} from 'element-plus'
import { inject, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { ApiSysPost, ApiSysRole, ApiSysUser, ErrorFlag } from '@/api/apis'
import { useDicts, useFormUtil, useGet, usePost, usePut } from '@/hooks'
import type { MessageSchema } from '@/i18n'
import type { dept } from '@/types/system/dept'
import { dictKey } from '@/types/system/dict'
import type { post, postList } from '@/types/system/post'
import type { role, roleList } from '@/types/system/role'
import type { user, userInfo } from '@/types/system/user'

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
const form = ref<user>({})
const deptTree = inject<dept[]>('deptTree')
const roleOptions = ref<role[]>([])
const postOptions = ref<post[]>([])
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
  dictKey.sysUserSex
)
//  自定义验证规则
const checkDeptId = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('激活部门不能为空'))
  } else if (!form.value.dept_ids!.includes(form.value.dept_id!)) {
    callback(new Error('激活部门必须在已选择部门内选择'))
  } else {
    callback()
  }
}
const checkDeptIds = (rule: any, value: any, callback: any) => {
  if (value === '' || value.length === 0) {
    callback(new Error('用户部门不能为空'))
  } else {
    if (form.value.dept_id) {
      userRef.value?.validateField('dept_id', () => null)
    }
    callback()
  }
}
const checkRoleId = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('激活角色不能为空'))
  } else if (!form.value.role_ids!.includes(form.value.role_id!)) {
    callback(new Error('激活角色必须在已选择角色内选择'))
  } else {
    callback()
  }
}
const checkRoleIds = (rule: any, value: any, callback: any) => {
  if (value === '' || value.length === 0) {
    callback(new Error('用户角色不能为空'))
  } else {
    if (form.value.role_id) {
      userRef.value?.validateField('role_id', () => null)
    }
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
const submitForm = async (formRef: FormInstance | undefined) => {
  if (!(await formValidate(formRef))) return
  if (form.value.id) {
    let data = { ...form.value }
    data.user_password = md5(form.value.user_password!)
    const { data: dataRes, execute } = usePut(ApiSysUser.edit, data)
    await execute()
    if (dataRes.value === ErrorFlag) return
    ElMessage.success(`成功更新用户 ${form.value.user_name}`)
    cancel()
  } else {
    let data = { ...form.value }
    data.user_password = md5(form.value.user_password!)
    const { data: dataRes, execute } = usePost(ApiSysUser.add, data)
    await execute()
    if (dataRes.value === ErrorFlag) return
    ElMessage.success(`成功新增用户 ${form.value.user_name}`)
    cancel()
  }
}
// 选项初始化
const optionsInit = async () => {
  let queryParams = {
    page_num: 1,
    page_size: Number.MAX_SAFE_INTEGER,
  }
  const { data: b, execute: be } = useGet<roleList>(
    ApiSysRole.getList,
    queryParams
  )
  const { data: c, execute: ce } = useGet<postList>(
    ApiSysPost.getList,
    queryParams
  )
  await Promise.all([be(), ce()])

  roleOptions.value = b.value?.list!
  postOptions.value = c.value?.list!
  // 清除验证
  userRef.value?.clearValidate()
}
//  formData数据初始化
const formDataInit = async () => {
  if (props.userId === '') {
    form.value = {
      user_status: '1',
      is_admin: '1',
    }
  } else {
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
const cancel = () => {
  emits('closeDialog')
}
</script>
