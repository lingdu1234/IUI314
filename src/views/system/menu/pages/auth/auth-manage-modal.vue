<script setup lang="ts">
import { computed, h, ref } from 'vue'
import { IconEdit } from '@arco-design/web-vue/es/icon'
import { Message } from '@arco-design/web-vue'
import IuModal from '@/components/iui/iu-modal.vue'
import { FormItemType, type IuFormField } from '@/types/base/iu-form'
import { dictKey, type dictUse } from '@/types/system/dict'
import { usePost, usePut } from '@/hooks'
import { ApiSysDbApi, ApiSysMenu } from '@/api/sysApis'
import { ErrorFlag } from '@/api/apis'
import type { authMenu } from '@/types/system/menu'

defineOptions({ name: 'AuthManageModal' })
const props = defineProps<propsType>()
const emits = defineEmits(['getList'])
interface propsType {
  dicts: Record<string, dictUse[]>
}
const iuModalRef = ref<InstanceType<typeof IuModal>>()

const modalIcon = ref()
const open = ref(false)
const title = ref('')
const form = ref<authMenu>({})

const modalFormItems = ref<IuFormField[]>([
  {
    field: 'dbs',
    label: '关联数据表',
    type: FormItemType.slot,
    slotName: 'dbs',
    defaultIsOnlyOne: true,
    defaultCol: 2,
    fullScreenIsOnlyOne: true,
    fullScreenCol: 2,
  },
  {
    field: 'log_method',
    label: '日志记录方式',
    type: FormItemType.radioGroup,
    radioGroup: {
      options: computed(() => props.dicts[dictKey.apiLogMethod]),
    },
    defaultIsOnlyOne: true,
    defaultCol: 2,
    fullScreenIsOnlyOne: true,
    fullScreenCol: 2,
  },
  {
    field: 'data_cache_method',
    label: '数据缓存方式',
    vShow: computed(() => form.value.method === 'GET'),
    type: FormItemType.radioGroup,
    radioGroup: {
      options: computed(() => props.dicts[dictKey.apiCacheMethod]),
    },
    defaultIsOnlyOne: true,
    defaultCol: 2,
    fullScreenIsOnlyOne: true,
    fullScreenCol: 2,
  },
])
async function handleUpdate(row: authMenu) {
  modalIcon.value = h(IconEdit)
  form.value = { ...row }
  title.value = `数据库关联+日志+缓存(${form.value.menu_name})`
  open.value = true
}
async function submitForm() {
  const api_data = {
    api_id: form.value.id,
    dbs: form.value.dbs,
  }
  const cache_log_data = {
    id: form.value.id,
    data_cache_method: form.value.data_cache_method,
    log_method: form.value.log_method,
  }
  const { data: a, execute: ae } = usePost(ApiSysDbApi.edit, api_data)
  const { data: b, execute: be } = usePut(
    ApiSysMenu.updateLogCache,
    cache_log_data,
  )
  await Promise.all([ae(), be()])
  if (a.value === ErrorFlag || b.value === ErrorFlag)
    return
  Message.success('数据关联更新成功')
  emits('getList')
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
    :default-col="2"
    :full-screen-col="2"
    @handle-ok="submitForm"
  >
    <template #dbs>
      <a-checkbox-group v-model="form.dbs">
        <a-grid :cols="3" :col-gap="20" :row-gap="15">
          <a-grid-item
            v-for="dict in dicts[dictKey.db]"
            :key="dict.value"
          >
            <a-tooltip :content="`${dict.label}:${dict.value}`">
              <a-checkbox :value="dict.value">
                {{ dict.value }}
              </a-checkbox>
            </a-tooltip>
          </a-grid-item>
        </a-grid>
      </a-checkbox-group>
    </template>
  </IuModal>
</template>
