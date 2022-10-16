<template>
  <el-dialog
    v-model="open"
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
                  <el-scrollbar height="200px">
                    <el-tree
                      ref="menuTreeRef"
                      :data="menuTree"
                      show-checkbox
                      node-key="id"
                      :check-strictly="!menuCheckStrictly"
                      empty-text="加载中，请稍候"
                      :props="{ label: 'menu_name', children: 'children' }"
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
<script lang="ts" setup name="role-manage-dialog">
import type { ElTree, FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import type node from 'element-plus/es/components/tree/src/model/node'
import { type PropType, ref } from 'vue'

import { ApiSysMenu, ApiSysPost } from '@/api/apis'
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
  if (form.value.role_id) {
    const { execute } = usePut(ApiSysPost.edit, form)
    await execute()
    ElMessage.success(`更新 ${form.value.role_name} 成功`)
  } else {
    const { execute } = usePost(ApiSysPost.add, form)
    await execute()
    ElMessage.success(`新增 ${form.value.role_name} 成功`)
  }
  cancel()
}
const handleCheckedTreeExpand = (v: boolean) => {
  const list = menuTree.value!
  for (let i = 0; i < list.length; i++) {
    menuTreeRef.value!.store.nodesMap[list[i].id!].expanded = v
  }
}
const handleCheckedTreeNodeAll = (v: boolean) => {
  const list = menuTree.value! as unknown as node[]
  menuTreeRef.value!.setCheckedNodes(v ? list : [])
}
const getMenuTree = async () => {
  const { data, execute } = useGet<menu[]>(ApiSysMenu.getEnabledTree)
  await execute()
  menuTree.value = data.value!
}
getMenuTree()
const cancel = () => {
  emits('closeDialog')
}
</script>
