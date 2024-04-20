import { type Ref, ref } from 'vue'

import { Message, Modal } from '@arco-design/web-vue'
import { useDelete } from '@/hooks'
import type { APIS } from '@/api/apis'
import { useSetupI18n } from '@/i18n'
import type { operateInfo, pageData } from '@/types/base/apis'

export interface listType<V extends operateInfo> extends pageData {
  list: V[]
}

export async function useDeleteFn(
  api: APIS,
  idsKey: string,
  ids: Ref<string[]>,
  valuesKey: string,
  values: Ref<any[]>,
  deleteKey: string,
  row?: { [key: string]: any },
  fn?: () => Promise<void>,
) {
  const { i18n } = useSetupI18n()
  const { t } = i18n.global
  const _ids = row?.[idsKey] ? [row?.[idsKey]] : ids.value
  const names = row?.[valuesKey] ? row?.[valuesKey] : values.value
  Modal.warning({
    title: '删除确认',
    hideCancel: false,
    titleAlign: 'start',
    content: `${t('commonTip.delete') + names}`,
    okText: '确认',
    cancelText: '取消',
    draggable: true,
    onOk: async () => {
      const query = ref<{ [key: string]: any }>({})
      query.value[deleteKey] = _ids
      const { execute } = useDelete(api, query)
      await execute()
      Message.success(t('commonTip.deleteSuccess'))
      fn && await fn()
    },
    onCancel: async () => Message.info(t('commonTip.deleteCancel')),
  })
}
