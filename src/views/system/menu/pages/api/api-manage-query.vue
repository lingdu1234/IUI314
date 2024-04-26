<script setup lang="ts">
import { type PropType, computed, ref } from 'vue'
import { ApiSysMenu } from '@/api/sysApis'
import IuQueryForm from '@/components/iui/iu-query-form.vue'
import { filterObjectArray, type listType, useGet } from '@/hooks'
import { FormItemType, type IuQueryFormField } from '@/types/base/iu-form'
import { MenuType } from '@/types/base/router'
import { dictKey, type dictUse } from '@/types/system/dict'
import type { menu, menuQueryParam } from '@/types/system/menu'
import type { userQueryParam } from '@/types/system/userInformation'

defineOptions({ name: 'ApiManageQuery' })

const props = defineProps({
  dicts: {
    type: Object as PropType<Record<string, dictUse[]>>,
    required: true,
  },
})

const emits = defineEmits(['getList'])

const queryParams = defineModel<userQueryParam>('queryParams', { required: true })
const showSearch = defineModel<boolean>('showSearch', { required: true })

const menuSelect = ref<menu[]>([])

async function getMenuSelect() {
  const queryParam: menuQueryParam = {
    // 查询所有菜单，用于查询API
    menu_type: MenuType.C,
  }
  const { data, execute } = useGet<listType<menu>>(
    ApiSysMenu.getList,
    queryParam,
  )
  await execute()
  // 对菜单警醒筛选
  menuSelect.value = filterObjectArray(data.value?.list as menu[], ['id', 'menu_name'], 'children')
}
getMenuSelect()

const queryFormItems = ref<IuQueryFormField[]>([
  {
    field: 'pid',
    label: '菜单名称',
    type: FormItemType.select,
    select: {
      placeholder: '请输入菜单名称',
      options: menuSelect,
      fieldNames: {
        label: 'menu_name',
        value: 'id',
      },
      allowClear: true,
      allowSearch: true,
    },
  },
  {
    field: 'method',
    label: '请求方法',
    type: FormItemType.select,
    select: {
      placeholder: '请选择请求方法',
      options: computed(() => props.dicts[dictKey.sysApiMethod]),
      fieldNames: {
        label: 'label',
        value: 'value',
      },
      allowClear: true,
      allowSearch: true,
    },
  },
  {
    field: 'status',
    label: '菜单状态',
    type: FormItemType.select,
    select: {
      placeholder: '请输入菜单状态',
      options: computed(() => props.dicts[dictKey.sysNormalDisable]),
      fieldNames: {
        label: 'label',
        value: 'value',
      },
      allowClear: true,
      allowSearch: true,
    },
  },
])
</script>

<template>
  <IuQueryForm
    v-show="showSearch"
    v-model:form-value="queryParams"
    v-model:form-items="queryFormItems"
    @query="emits('getList')"
  />
</template>

<style scoped lang="scss">

</style>
