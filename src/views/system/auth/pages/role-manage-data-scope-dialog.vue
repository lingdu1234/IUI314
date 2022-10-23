<template>
  <el-dialog
    v-model="openDataScope"
    :before-close="cancel"
    :title="title"
    append-to-body
    width="450px"
  >
    <el-form
      ref="dataScopeFormRef"
      :model="form"
      class="base-form"
      label-width="100px"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="角色名称" prop="role_name">
            <el-input v-model="form.role_name" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="角色标志" prop="role_key">
            <el-input v-model="form.role_key" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="权限范围">
            <el-select v-model="form.data_scope" @change="setDeptTree">
              <el-option
                v-for="item in dataScopeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="form.data_scope === '2'">
        <el-col :span="24">
          <el-form-item label="数据权限">
            <el-col :span="24">
              <el-row>
                <el-col :span="8">
                  <el-checkbox
                    v-model="isExpandAll"
                    @change="handleCheckedTreeExpand"
                  >
                    展开/折叠
                  </el-checkbox>
                </el-col>
                <!-- <el-col :span="8">
                  <el-checkbox
                    v-model="menuNodeAll"
                    @change="handleCheckedTreeNodeAll"
                  >
                    全选/全不选
                  </el-checkbox>
                </el-col>
                <el-col :span="8">
                  <el-checkbox v-model="menuCheckStrictly" disabled>
                    父子联动
                  </el-checkbox>
                </el-col> -->
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-scrollbar max-height="200px">
                    <el-tree
                      ref="deptTreeRef"
                      :data="deptTree"
                      show-checkbox
                      node-key="dept_id"
                      :check-strictly="!menuCheckStrictly"
                      :default-expand-all="isExpandAll"
                      empty-text="加载中，请稍候"
                      :props="deptTreeProps"
                    />
                  </el-scrollbar>
                </el-col>
              </el-row>
            </el-col>
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
        <el-button type="primary" @click="submitForm(dataScopeFormRef)">
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
import type { ElTree, FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
// import type node from 'element-plus/es/components/tree/src/model/node'
import { type PropType, nextTick, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { ApiSysDept, ApiSysRole } from '@/api/apis'
import { useFormUtil, useGet, usePut } from '@/hooks'
import type { MessageSchema } from '@/i18n'
import type { dept } from '@/types/system/dept'
import type { role } from '@/types/system/role'

const props = defineProps({
  roleData: {
    type: Object as PropType<role>,
    required: true,
  },
  openDataScope: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
})
const emits = defineEmits(['closeDialog'])
const form = ref<role>({ ...props.roleData })
const dataScopeFormRef = ref<FormInstance>()
const deptTreeRef = ref<InstanceType<typeof ElTree>>()
const { formValidate } = useFormUtil()
const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
// 菜单权限相关
const deptTree = ref<dept[]>([])
const isExpandAll = ref(true)
// const menuNodeAll = ref(false)
const menuCheckStrictly = ref(false)

const deptTreeProps = ref({
  label: 'dept_name',
  children: 'children',
})

/** 数据范围选项*/
const dataScopeOptions = ref([
  { value: '1', label: '全部数据权限' },
  { value: '2', label: '自定数据权限' },
  { value: '3', label: '本部门数据权限' },
  { value: '4', label: '本部门及以下数据权限' },
  { value: '5', label: '仅本人数据权限' },
])

//  提交按钮函数
const submitForm = async (formRef: FormInstance | undefined) => {
  if (!(await formValidate(formRef))) return
  // 获取选择的节点
  const deptIds = deptTreeRef.value?.getCheckedKeys(false)
  let data = { ...form.value }
  data.dept_ids = data.data_scope === '2' ? (deptIds as string[]) : []
  const { execute } = usePut(ApiSysRole.setDataScope, data)
  await execute()
  ElMessage.success(`更新 ${form.value.role_name} 数据权限成功`)
  cancel()
}
// 展开
const handleCheckedTreeExpand = (v: boolean) => {
  const list = deptTree.value!
  for (let i = 0; i < list.length; i++) {
    deptTreeRef.value!.store.nodesMap[list[i].dept_id!].expanded = v
  }
}
// 全选 全不选
// const handleCheckedTreeNodeAll = (v: boolean) => {
//   const list = deptTree.value! as unknown as node[]
//   deptTreeRef.value!.setCheckedNodes(v ? list : [])
// }
/**
 * 获取菜单数据数据
 */
const getDeptTree = async () => {
  // 获取数据
  const { data: tree, execute: treeExc } = useGet<dept[]>(
    ApiSysDept.getDeptTree
  )
  await treeExc()
  deptTree.value = tree.value!
}

const setDeptTree = async (value: string) => {
  let dept_ids: string[] = []
  // 获取角色的数据权限
  if (value === '2') {
    const { data, execute: menuIdsExc } = useGet<string[]>(
      ApiSysRole.getRoleDepts,
      { role_id: props.roleData.role_id }
    )
    await menuIdsExc()

    dept_ids = data.value!
  }

  nextTick(() => {
    deptTreeRef.value?.setCheckedKeys(dept_ids)
  })
}
// 初始化 获取部门数数据，如果为自定义权限，勾选数据
const init = async () => {
  await getDeptTree()
  if (props.roleData.data_scope === '2') {
    setDeptTree('2')
  }
}
const cancel = () => {
  emits('closeDialog')
}

init()
</script>
