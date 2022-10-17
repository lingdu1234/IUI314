<template>
  <el-dialog
    v-model="open"
    :before-close="cancel"
    :title="title"
    append-to-body
    width="600px"
  >
    <el-form
      ref="roleFormRef"
      :model="form"
      :rules="rules"
      class="base-form"
      label-width="100px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="角色名称" prop="role_name">
            <el-input v-model="form.role_name" placeholder="请输入角色名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色标志" prop="role_key">
            <el-input
              v-model="form.role_key"
              maxlength="20"
              placeholder="请输入角色标志"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="角色排序" prop="list_order">
            <el-input-number
              v-model="form.list_order"
              :min="0"
              controls-position="right"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="角色状态">
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
          <el-form-item label="菜单权限">
            <el-col :span="24">
              <el-row>
                <el-col :span="8">
                  <el-checkbox
                    v-model="menuExpand"
                    @change="handleCheckedTreeExpand"
                  >
                    展开/折叠
                  </el-checkbox>
                </el-col>
                <el-col :span="8">
                  <el-checkbox
                    v-model="menuNodeAll"
                    @change="handleCheckedTreeNodeAll"
                  >
                    全选/全不选
                  </el-checkbox>
                </el-col>
                <el-col :span="8">
                  <el-checkbox v-model="menuCheckStrictly">
                    父子联动
                  </el-checkbox>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-scrollbar max-height="200px">
                    <el-tree
                      ref="menuTreeRef"
                      :data="menuTree"
                      show-checkbox
                      node-key="id"
                      :check-strictly="!menuCheckStrictly"
                      empty-text="加载中，请稍候"
                      :props="menuTreeProps"
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
        <el-button type="primary" @click="submitForm(roleFormRef)">
          确 定
        </el-button>
        <el-button @click="cancel"> 取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import type { ElTree, FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import type node from 'element-plus/es/components/tree/src/model/node'
import { type PropType, nextTick, ref } from 'vue'

import { ApiSysMenu, ApiSysRole } from '@/api/apis'
import { useDicts, useFormUtil, useGet, usePost, usePut } from '@/hooks'
import { dictKey } from '@/types/system/dict'
import type { menu } from '@/types/system/menu'
import type { role } from '@/types/system/role'

const props = defineProps({
  roleData: {
    type: Object as PropType<role>,
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
const form = ref<role>({ ...props.roleData })
const roleFormRef = ref<FormInstance>()
const menuTreeRef = ref<InstanceType<typeof ElTree>>()
const { formValidate } = useFormUtil()
// 菜单权限相关
const menuTree = ref<menu[]>([])
const menuExpand = ref(false)
const menuNodeAll = ref(false)
const menuCheckStrictly = ref(true)

const menuTreeProps = ref({
  label: 'menu_name',
  children: 'children',
})

// 字典数据
const dicts = useDicts(dictKey.sysNormalDisable)

const rules = ref<FormRules>({
  role_name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
  role_key: [{ required: true, message: '角色标志不能为空', trigger: 'blur' }],
  list_order: [
    { required: true, message: '角色顺序不能为空', trigger: 'blur' },
  ],
})

//  提交按钮函数
const submitForm = async (formRef: FormInstance | undefined) => {
  if (!(await formValidate(formRef))) return
  // 获取选择的节点
  const menu_ids = menuTreeRef.value?.getCheckedKeys(false)
  if (form.value.role_id) {
    let data = { ...form.value }
    data.menu_ids = menu_ids as string[]
    const { execute } = usePut(ApiSysRole.edit, data)
    await execute()
    ElMessage.success(`更新 ${form.value.role_name} 成功`)
  } else {
    let data = { ...form.value }
    data.menu_ids = menu_ids as string[]
    const { execute } = usePost(ApiSysRole.add, data)
    await execute()
    ElMessage.success(`新增 ${form.value.role_name} 成功`)
  }
  cancel()
}
// 展开
const handleCheckedTreeExpand = (v: boolean) => {
  const list = menuTree.value!
  for (let i = 0; i < list.length; i++) {
    menuTreeRef.value!.store.nodesMap[list[i].id!].expanded = v
  }
}
// 全选 全不选
const handleCheckedTreeNodeAll = (v: boolean) => {
  const list = menuTree.value! as unknown as node[]
  menuTreeRef.value!.setCheckedNodes(v ? list : [])
}
/**
 * 获取菜单数据数据
 */
const getMenuTree = async () => {
  // 获取数据
  const { data: tree, execute: treeExc } = useGet<menu[]>(
    ApiSysMenu.getEnabledTree
  )
  // 获取角色的菜单权限
  const { data: menuIds, execute: menuIdsExc } = useGet<string[]>(
    ApiSysRole.getRoleMenus,
    { role_id: props.roleData.role_id }
  )
  await Promise.all([treeExc(), menuIdsExc()])

  menuTree.value = tree.value!

  // 设置选择节点
  // menuIds.value!.forEach((v) => {
  //   nextTick(() => {
  //     menuTreeRef.value?.setChecked(v, true, false)
  //   })
  // })
  nextTick(() => {
    menuTreeRef.value?.setCheckedKeys(menuIds.value!)
  })
}
getMenuTree()
const cancel = () => {
  emits('closeDialog')
}
</script>
