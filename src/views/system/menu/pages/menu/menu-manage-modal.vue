<script setup lang="ts">
import { computed, h, ref } from 'vue'
import { IconEdit, IconPlus } from '@arco-design/web-vue/es/icon'
import { Message } from '@arco-design/web-vue'
import { useI18n } from 'vue-i18n'
import IuModal from '@/components/iui/iu-modal.vue'
import { FormItemType, type IuFormField, type SelectOptionInterface } from '@/types/base/iu-form'
import { dictKey, type dictUse } from '@/types/system/dict'
import { usePost, usePut } from '@/hooks'
import { ApiSysMenu } from '@/api/sysApis'
import { ErrorFlag } from '@/api/apis'
import type { MessageSchema } from '@/i18n'
import { MenuType } from '@/types/base/router'
import type { menu } from '@/types/system/menu'
import IuIconSelect from '@/components/svg-icon/iu-icon-select.vue'
import { constMenus } from '@/router'

defineOptions({ name: 'MenuManageModal' })
const props = withDefaults(defineProps<MenuManageModalProps>(), {})
const emits = defineEmits(['getList'])

interface MenuManageModalProps {
  dicts: Record<string, dictUse[]>
  menuTree: menu[]
}
const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })

const iuModalRef = ref<InstanceType<typeof IuModal>>()
const menuSelectTree = computed(() => props.menuTree)

const modalIcon = ref()
const open = ref(false)
const title = ref('')
const form = ref<menu>({})
const menuTypeOptions = ref<SelectOptionInterface[]>([
  { label: '目录', value: MenuType.M, disabled: false },
  { label: '菜单', value: MenuType.C, disabled: false },
  { label: 'API', value: MenuType.F, disabled: false },
])

const modalFormItems = ref<IuFormField[]>([
  {
    field: 'pid',
    label: '上级菜单',
    type: FormItemType.treeSelect,
    placeholder: '请选择上级菜单',
    selectOption: {
      dataOption: menuSelectTree,
      dataOptionKey: {
        title: 'menu_name',
        key: 'id',
        disabled: 'disabled',
      },
      allowClear: true,
      allowSearch: true,
    },
    rule: [
      { required: true, message: '上级菜单不能为空' },
    ],
    validateTrigger: ['blur', 'change'],
  },
  {
    field: 'menu_type',
    label: '菜单类型',
    type: FormItemType.radio,
    selectOption: {
      dataOption: menuTypeOptions,
      dataOptionKey: {
        label: 'label',
        value: 'value',
        disabled: 'disabled',
      },
    },
    rule: [
      { required: true, message: '岗位状态必须选择' },
    ],
    validateTrigger: 'blur',
  },
  {
    field: 'icon',
    label: '菜单图标',
    slotName: 'menuIconSlot',
    type: FormItemType.slot,
    rule: [
      { required: true, message: '菜单图标必须选择' },
    ],
    validateTrigger: ['change'],
  },
  {
    field: 'menu_name',
    label: '菜单名称',
    type: FormItemType.input,
    placeholder: '请输入菜单名称',
    rule: [
      { required: true, message: '菜单名称不能为空' },
      { type: 'string', minLength: 2, maxLength: 20, message: '菜单名称2~20个字符' },
    ],
    validateTrigger: 'blur',
  },
  {
    field: 'i18n',
    label: 'i18n标识',
    type: FormItemType.input,
    vShow: computed(() => form.value.menu_type !== MenuType.F),
    tooltip: '国际化标志,前缀为(route.)无需输入,需在语言文件中配置',
    placeholder: 'i18n标识',
  },
  {
    field: 'order_sort',
    label: '显示排序',
    type: FormItemType.inputNumber,
    inputNumberMode: 'button',
    placeholder: '请输入显示排序',
    rule: [
      { required: true, message: '显示排序不能为空' },
    ],
  },
  {
    field: 'is_frame',
    label: '是否外量',
    type: FormItemType.radio,
    vShow: computed(() => form.value.menu_type !== MenuType.F),
    selectOption: {
      dataOption: [{
        label: '是',
        value: '1',
      }, {
        label: '否',
        value: '0',
      }],
      dataOptionKey: {
        label: 'label',
        value: 'value',
      },
    },
    rule: [
      { required: true, message: '岗位状态必须选择' },
    ],
    validateTrigger: 'blur',
  },
  {
    field: 'visible',
    label: '是否隐藏',
    type: FormItemType.radio,
    vShow: computed(() => form.value.menu_type !== MenuType.F),
    selectOption: {
      dataOption: computed(() => props.dicts[dictKey.sysShowHide]),
      dataOptionKey: {
        label: 'label',
        value: 'value',
      },
    },
    rule: [
      { required: true, message: '岗位状态必须选择' },
    ],
    validateTrigger: 'blur',
  },
  {
    field: 'path',
    label: '路由地址',
    type: FormItemType.select,
    vShow: computed(() => form.value.menu_type !== MenuType.F),
    tooltip: '访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头,需要与组件名称匹配,尤其是需要keep-live的组件，否则keep-live会无效！',
    placeholder: '请选择或者输入路由地址',
    selectOption: {
      dataOption: getConstMenus(),
      dataOptionKey: {
        value: 'value',
        label: 'label',
      },
      allowClear: true,
      allowSearch: true,
      allowCreate: true,
    },
    rule: [
      {
        validator(value, callback) {
          if (form.value.menu_type !== MenuType.F) {
            if (value === undefined || value.length === 0)
              callback('路由地址不能为空')
            else
              callback()
          }
          else {
            callback()
          }
        },
      },
    ],
    validateTrigger: 'blur',
  },
  {
    field: 'component',
    label: '组件路径',
    type: FormItemType.input,
    vShow: computed(() => form.value.menu_type === MenuType.C),
    placeholder: '请输入组件路径',
    rule: [
      {
        validator(value, callback) {
          if (form.value.menu_type === MenuType.C) {
            if (value === undefined || value.length === 0)
              callback('组件路径不能为空')
            else
              callback()
          }
          else {
            callback()
          }
        },
      },
    ],
    validateTrigger: 'blur',
  },
  {
    field: 'api',
    label: 'api',
    type: FormItemType.input,
    tooltip: `
A:目录的唯一标志，建议格式M-name，如：'M-sys','M-system-menu'
B:菜单唯一标志，同目录标志，如：'M-system-menu'
C:API/按钮的唯一标志，可为API,如：'system/user/add',若只是单纯控制按钮显示，建议B-name，如：'B-export'`,
    placeholder: '请输入菜单名称',
    rule: [
      { required: true, message: 'api(唯一标识符)不能为空' },
      { type: 'string', minLength: 2, maxLength: 20, message: 'api(唯一标识符)2~20个字符' },
    ],
    validateTrigger: 'blur',
  },
  {
    field: 'is_cache',
    label: 'keep-alive',
    type: FormItemType.radio,
    vShow: computed(() => form.value.menu_type === MenuType.C),
    selectOption: {
      dataOption: [{
        label: 'keepAlive',
        value: '1',
      }, {
        label: 'noCache',
        value: '0',
      }],
      dataOptionKey: {
        label: 'label',
        value: 'value',
      },
    },
    rule: [
      { required: true, message: '菜单状态必须选择' },
    ],
    validateTrigger: 'blur',
  },
  {
    field: 'status',
    label: '菜单状态',
    type: FormItemType.radio,
    selectOption: {
      dataOption: computed(() => props.dicts[dictKey.sysNormalDisable]),
      dataOptionKey: {
        label: 'label',
        value: 'value',
      },
    },
    rule: [
      { required: true, message: '菜单状态必须选择' },
    ],
    validateTrigger: 'blur',
  },
  {
    field: 'remark',
    label: '备注',
    type: FormItemType.textarea,
    placeholder: '请输入字典备注',
    defaultIsOnlyOne: true,
    fullScreenIsOnlyOne: true,
    fullScreenCol: 2,
    defaultCol: 2,
  },
])
function handleAdd(row?: menu, pid?: string) {
  modalIcon.value = h(IconPlus)
  open.value = true
  form.value = {
    menu_type: MenuType.M,
    status: '1',
    is_frame: '0',
    visible: '1',
    order_sort: 0,
    data_scope: '0',
    remark: '',
    log_method: '3',
    is_cache: '1',
    data_cache_method: '1',
  }
  if (row)
    form.value.pid = row.id
  else
    form.value.pid = '0'
  if (pid)
    form.value.pid = pid

  title.value = '添加菜单'
}
async function handleUpdate(row: menu) {
  modalIcon.value = h(IconEdit)
  form.value = { ...row }

  title.value = `更新-${form.value.menu_name}`
  open.value = true
}

async function handleAddByCopy(row: menu) {
  modalIcon.value = h(IconPlus)
  form.value = { ...row }
  form.value.id = undefined
  title.value = `通过复制-${form.value.menu_name}-添加`
  open.value = true
}

function getConstMenus() {
  const menu: { value: string, label: string }[] = []
  for (const key in constMenus) {
    menu.push({
      value: constMenus[key].path,
      label: `${constMenus[key].name}(${constMenus[key].path})`,
    })
  }
  return menu
}

async function submitForm() {
  if (form.value.id !== undefined) {
    const { execute, data } = usePut(ApiSysMenu.edit, form)

    await execute()
    if (data.value === ErrorFlag)
      return
    Message.success(t('commonTip.updateSuccess'))
  }
  else {
    const { execute, data } = usePost(ApiSysMenu.add, form)
    await execute()
    if (data.value === ErrorFlag)
      return
    Message.success(t('commonTip.addSuccess'))
  }
  open.value = false
  emits('getList')
}

defineExpose({ handleAdd, handleUpdate, handleAddByCopy })
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
    :default-col="2"
    :full-screen-col="2"
    @handle-ok="submitForm"
  >
    <template #menuIconSlot>
      <!--      <a-trigger trigger="focus"> -->
      <!--        <a-input placeholder="点击选择图标" /> -->
      <!--        <template #content> -->
      <IuIconSelect v-model:current-icon="form.icon" />
      <!--        </template> -->
      <!--      </a-trigger> -->
    </template>
  </IuModal>
</template>

<style scoped lang="scss">

</style>
