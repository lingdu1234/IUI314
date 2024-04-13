<script setup lang="ts">
import { type PropType, computed, h, ref } from 'vue'
import { IconEdit } from '@arco-design/web-vue/es/icon'
import type { Tree } from '@arco-design/web-vue'
import { Message } from '@arco-design/web-vue'
import IuModal from '@/components/iui/iu-modal.vue'
import { FormItemType, type IuFormField } from '@/types/base/iu-form'
import type { dictUse } from '@/types/system/dict'
import { filterObjectArray, useGet, usePut } from '@/hooks'
import { ApiSysDept, ApiSysRole } from '@/api/sysApis'
import { ErrorFlag } from '@/api/apis'
import type { menu } from '@/types/system/menu'
import type { role } from '@/types/system/role'

defineOptions({ name: 'RoleManageModal' })

const props = defineProps({
  ids: {
    type: Array as PropType<string[]>,
    required: true,
  },
  dicts: {
    type: Object as PropType<Record<string, dictUse[]>>,
    required: true,
  },
})

const emits = defineEmits(['getList'])

const iuModalRef = ref<InstanceType<typeof IuModal>>()

const menuTree = ref()
const menuTreeRef = ref<InstanceType<typeof Tree>>()
const checkStrictly = ref<boolean>(true)

const modalIcon = ref()
const open = ref(false)
const title = ref('')
const form = ref<role>({})

const dataScopeOptions = ref([
  { value: '1', label: '全部数据权限' },
  { value: '2', label: '自定数据权限' },
  { value: '3', label: '本部门数据权限' },
  { value: '4', label: '本部门及以下数据权限' },
  { value: '5', label: '仅本人数据权限' },
])

const vShow = computed(() => form.value.data_scope === '2')

const modalFormItems = ref<IuFormField[]>([
  {
    field: 'role_name',
    label: '角色名称',
    type: FormItemType.input,
    disabled: true,
  },
  {
    field: 'role_key',
    label: '角色标志',
    type: FormItemType.input,
    disabled: true,
  },
  {
    field: 'data_scope',
    label: '数据权限',
    type: FormItemType.select,
    placeholder: '请选择激活角色',
    selectOption: {
      dataOption: dataScopeOptions,
      dataOptionKey: {
        title: 'label',
        key: 'value',
      },
      allowClear: true,
      allowSearch: true,
      multiple: false,
    },
  },
  {
    field: 'checkOption',
    label: '操作选项',
    type: FormItemType.slot,
    slotName: 'checkOption',
    defaultCol: 2,
    fullScreenCol: 2,
    fullScreenIsOnlyOne: true,
    defaultIsOnlyOne: true,
    vShow,
  },
  {
    field: 'treeSlot',
    label: '数据权限',
    type: FormItemType.slot,
    slotName: 'treeSlot',
    fullScreenIsOnlyOne: true,
    defaultIsOnlyOne: true,
    vShow,
  },
  {
    field: 'remark',
    label: '备注',
    type: FormItemType.textarea,
    placeholder: '请输入字典备注',
    fullScreenIsOnlyOne: true,
    defaultIsOnlyOne: true,
  },
])

async function handleUpdate(row?: role) {
  modalIcon.value = h(IconEdit)

  const role_id = (row && row.role_id) || props.ids[0]
  const { data, execute } = useGet<role>(ApiSysRole.getById, { role_id })
  await execute()
  form.value = data.value as role
  title.value = `更新角色-${form.value.role_name}-数据权限`
  open.value = true
  // 查询权限并勾选
  await checkedMenu(form.value.role_id as string)
}

async function submitForm() {
  if (form.value.data_scope !== '2')
    form.value.dept_ids = []

  const { execute, data } = usePut(ApiSysRole.setDataScope, form)
  await execute()
  if (data.value === ErrorFlag)
    return
  Message.success(`更新 ${form.value.role_name}的数据权限成功`)
  open.value = false
  emits('getList')
}

async function getMenuTree() {
  const { data, execute } = useGet<menu[]>(
    ApiSysDept.getDeptTree,
  )
  await execute()
  menuTree.value = filterObjectArray(
    data.value!,
    ['dept_id', 'dept_name'],
    'children',
  )
}

getMenuTree()

async function checkedMenu(role_id: string) {
  // 获取角色的菜单权限
  const { data, execute } = useGet<string[]>(
    ApiSysRole.getRoleDepts,
    { role_id },
  )
  await execute()
  // 设置选择节点
  form.value.dept_ids = data.value!
}

const fieldNames = {
  key: 'dept_id',
  title: 'dept_name',
  children: 'children',
}

function changeMenuExpand(v: boolean | (string | number | boolean)[]) {
  menuTreeRef.value?.expandAll(v as boolean)
}

function changeMenuCheckAll(v: boolean | (string | number | boolean)[]) {
  menuTreeRef.value?.checkAll(v as boolean)
}

defineExpose({ handleUpdate })
</script>

<template>
  <IuModal
    ref="iuModalRef"
    v-model:visible="open"
    v-model:form-value="form"
    :form-items="modalFormItems"
    :icon="modalIcon"
    :title="title"
    :item-width="250"
    :default-col="1"
    :full-screen-col="1"
    @handle-ok="submitForm"
  >
    <template #checkOption>
      <a-space direction="horizontal">
        <a-checkbox @change="changeMenuExpand">
          展开/折叠
        </a-checkbox>
        <a-checkbox @change="changeMenuCheckAll">
          全选/全不选
        </a-checkbox>
      </a-space>
    </template>
    <template #treeSlot>
      <a-tree
        ref="menuTreeRef"
        v-model:checked-keys="form.dept_ids"
        :checkable="true"
        :field-names="fieldNames"
        :check-strictly="!checkStrictly"
        show-line
        :data="menuTree"
      />
    </template>
  </IuModal>
</template>

<style scoped lang="scss">

</style>
