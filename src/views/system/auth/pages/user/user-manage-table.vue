<script lang="ts" setup>
import { type PropType, h, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Message, Modal, type TableColumnData, type TableRowSelection } from '@arco-design/web-vue'
import md5 from 'blueimp-md5'
import type { MessageSchema } from '@/i18n'
import DictTag from '@/components/common/dict-tag.vue'
import { dictKey, type dictUse } from '@/types/system/dict'
import { hasPermission, parseTime, usePut } from '@/hooks'
import { ApiSysUser } from '@/api/sysApis'
import type { resetUserPwd, userInformation } from '@/types/system/userInformation'
import ResetPwd from '@/views/system/auth/pages/user/resetPwd.vue'
import { ErrorFlag } from '@/api/apis'

defineOptions({ name: 'UserManageTable' })
const props = defineProps({
  // tableData: {
  //   type: Array as PropType<userInformation[]>,
  //   required: true,
  // },
  isLoading: {
    type: Boolean,
    default: false,
  },
  dicts: {
    type: Object as PropType<Record<string, dictUse[]>>,
    required: true,
  },
})

const emits = defineEmits([
  'handleUpdate',
  'handleDelete',
  'handleSelectionChangeFn',
])

const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })

const tableData = defineModel<userInformation[] | null>('tableData', { required: true })

const rowSelection = ref<TableRowSelection>({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false,
})

// 表格列属性
const columns: TableColumnData[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    ellipsis: true,
    tooltip: true,
    width: 200,
    align: 'center',
  },
  {
    title: t('profile.name'),
    dataIndex: 'user_name',
    align: 'center',
    width: 100,
  },
  {
    title: t('profile.nickName'),
    dataIndex: 'user_nickname',
    align: 'center',
    width: 150,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: t('user.dept'),
    dataIndex: 'dept.dept_name',
    align: 'center',
    width: 100,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '手机号码',
    dataIndex: 'phone_num',
    align: 'center',
    width: 100,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '状态',
    width: 100,
    align: 'center',
    render: ({ record }) => h(DictTag, {
      options: props.dicts[dictKey.sysNormalDisable],
      value: record.user_status,
    }),
  },
  {
    title: '创建时间',
    width: 180,
    align: 'center',
    render: ({ record }) => parseTime(record.created_at),
  },
  {
    title: '操作',
    slotName: 'operation',
    width: 150,
    // fixed: 'right',
    align: 'center',
  },
]

// 密码重置
const resetPwd = ref({
  password: '',
})
function handleResetPwd(row: userInformation) {
  resetPwd.value.password = ''
  Modal.warning({
    title: '密码重置',
    hideCancel: false,
    titleAlign: 'start',
    content: () => h(ResetPwd, { formValue: resetPwd.value }),
    footer: true,
    draggable: true,
    onOk: async () => {
      const data: resetUserPwd = {
        user_id: row.id!,
        new_passwd: md5(resetPwd.value.password),
      }
      const { data: dataRes, execute } = usePut(ApiSysUser.resetPwd, data)
      await execute()
      if (dataRes.value === ErrorFlag)
        return
      Message.success(`用户 ${row.user_name} 的密码成功重置为 ${resetPwd.value.password}`)
    },
    onCancel() {
      Message.info(`你取消了重置用户 ${row.user_name} 的密码操作！`)
    },
  })
}

function handleSelectionChange(keys: (string | number)[]) {
  return emits('handleSelectionChangeFn', keys, tableData.value, 'id', 'user_name')
}
</script>

<template>
  <a-skeleton v-if="isLoading" :animation="true">
    <a-space direction="vertical" :style="{ width: '100%' }" size="large">
      <a-skeleton-line :rows="10" />
    </a-space>
  </a-skeleton>
  <a-table
    v-else
    :columns="columns"
    :data="tableData || []"
    :row-selection="rowSelection"
    row-key="id"
    :scroll="{ minWidth: 800 }"
    :pagination="false"
    @selection-change="handleSelectionChange"
  >
    <template #operation="{ record }">
      <a-button
        v-if="hasPermission(ApiSysUser.edit)"
        type="text"
        shape="round"
        @click="emits('handleUpdate', record)"
      >
        <template #icon>
          <IconEdit />
        </template>
      </a-button>
      <a-button
        v-if="hasPermission(ApiSysUser.delete)"
        type="text"
        shape="round"
        status="danger"
        @click="emits('handleDelete', record)"
      >
        <template #icon>
          <IconDelete />
        </template>
      </a-button>
      <a-button
        v-if="hasPermission(ApiSysUser.resetPwd)"
        type="text"
        shape="round"
        status="danger"
        @click="handleResetPwd(record)"
      >
        <template #icon>
          <IconTool />
        </template>
      </a-button>
    </template>
  </a-table>
</template>
