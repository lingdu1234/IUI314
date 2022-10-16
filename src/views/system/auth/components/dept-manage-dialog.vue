<template>
  <el-dialog
    v-model="open"
    :before-close="cancel"
    :title="title"
    append-to-body
    width="600px"
  >
    <el-form
      ref="userRef"
      :model="form"
      :rules="rules"
      class="base-form"
      label-width="100px"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="上级部门" prop="parent_id">
            <el-tree-select
              v-model="form.parent_id"
              :data="deptTree"
              :props="deptTreeProps"
              :render-after-expand="false"
              check-strictly
              collapse-tags
              filterable
              placeholder="请选择部门"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="部门名称" prop="dept_name">
            <el-input v-model="form.dept_name" placeholder="请输入部门名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示排序" prop="order_num">
            <el-input-number
              v-model="form.order_num"
              :min="0"
              controls-position="right"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="负责人" prop="leader">
            <el-input
              v-model="form.leader"
              maxlength="20"
              placeholder="请输入负责人"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" prop="phone">
            <el-input
              v-model="form.phone"
              maxlength="11"
              placeholder="请输入联系电话"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="form.email"
              maxlength="50"
              placeholder="请输入邮箱"
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
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm(userRef)">
          确 定
        </el-button>
        <el-button @click="cancel"> 取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" name="dept-manage-dialog" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { type PropType, ref } from 'vue'

import { ApiSysDept } from '@/api/apis'
import { useDicts, useFormUtil, usePost, usePut } from '@/hooks'
import type { dept } from '@/types/system/dept'
import { dictKey } from '@/types/system/dict'

const props = defineProps({
  deptTree: {
    type: Array as PropType<dept[]>,
    required: true,
  },
  deptData: {
    type: Object as PropType<dept>,
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
const form = ref<dept>({ ...props.deptData })
const userRef = ref<FormInstance>()
const { formValidate } = useFormUtil()

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

const rules = ref<FormRules>({
  parent_id: [{ required: true, message: '上级不能为空', trigger: 'blur' }],
  order_num: [{ required: true, message: '显示顺序不能为空', trigger: 'blur' }],
  dept_name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }],
})

//  提交按钮函数
const submitForm = async (formRef: FormInstance | undefined) => {
  if (!(await formValidate(formRef))) return
  if (form.value.dept_id) {
    const { execute } = usePut(ApiSysDept.edit, form)
    await execute()
    ElMessage.success(`更新 ${form.value.dept_name} 成功`)
  } else {
    const { execute } = usePost(ApiSysDept.add, form)
    await execute()
    ElMessage.success(`新增 ${form.value.dept_name} 成功`)
  }
  cancel()
}
const cancel = () => {
  emits('closeDialog')
}
</script>
