<script lang="ts" setup>
import { Message, Modal, type TableColumnData } from '@arco-design/web-vue'
import { ApiSysOnlineUser } from '@/api/sysApis'
import { hasPermission, parseTime, useDelete } from '@/hooks'
import type { onlineUser } from '@/types/system/online-user'

defineOptions({ name: 'OnlineUserTable' })

const emits = defineEmits([
  'getList',
])

const tableData = defineModel<onlineUser[] | null>('tableData', { required: true })

// 表格列属性
const columns: TableColumnData[] = [
  {
    title: '#',
    width: 30,
    align: 'center',
    render: ({ rowIndex }) => rowIndex + 1,
  },
  {
    title: '会话编号',
    dataIndex: 'id',
    align: 'center',
    width: 100,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '所属部门',
    dataIndex: 'dept_name',
    align: 'center',
    width: 100,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '网络',
    dataIndex: 'net',
    align: 'center',
    width: 100,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: 'IP',
    dataIndex: 'ipaddr',
    align: 'center',
    width: 120,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '登录地点',
    dataIndex: 'login_location',
    ellipsis: true,
    tooltip: true,
    width: 180,
    align: 'center',
  },
  {
    title: '操作系统',
    dataIndex: 'os',
    width: 180,
    align: 'center',
  },
  {
    title: '浏览器',
    dataIndex: 'browser',
    ellipsis: true,
    tooltip: true,
    width: 120,
    align: 'center',
  },
  {
    title: '设备',
    dataIndex: 'device',
    width: 120,
    ellipsis: true,
    tooltip: true,
    align: 'center',
  },
  {
    title: '登录时间',
    width: 180,
    align: 'center',
    render: ({ record }) => parseTime(record.login_time),
  },
  {
    title: '操作',
    slotName: 'operation',
    width: 100,
    fixed: 'right',
    align: 'center',
  },
]

function handleForceLogout(row?: onlineUser) {
  if (row) {
    Modal.warning({
      title: '确认清空',
      hideCancel: false,
      titleAlign: 'start',
      content: `是否确认强退用户 ${row?.user_name}?`,
      okText: '确认',
      cancelText: '取消',
      draggable: true,
      onOk: async () => {
        const ids = [row?.id]
        const { execute } = useDelete(ApiSysOnlineUser.delete, { ids })
        await execute()
        Message.success(`强退用户 ${row?.user_name} 成功!`)
        emits('getList')
      },
      onCancel: async () => Message.info('取消操作'),
    })
  }
  else {
    Message.info('用户不存在')
  }
}
</script>

<template>
  <a-table
    :columns="columns"
    :data="tableData || []"
    row-key="id"
    :scroll="{ minWidth: 800 }"
    :pagination="false"
  >
    <template #operation="{ record }">
      <a-button
        v-if="hasPermission(ApiSysOnlineUser.delete)"
        type="text"
        shape="round"
        status="danger"
        @click="handleForceLogout(record)"
      >
        强制下线
        <template #icon>
          <IconDelete />
        </template>
      </a-button>
    </template>
  </a-table>
</template>
