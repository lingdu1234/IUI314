import type { TableColumnData } from '@arco-design/web-vue'
import { computed, h, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { IuFormField, IuQueryFormField } from '@/types/base/iu-form'
import { FormItemType } from '@/types/base/iu-form'
import type { dictData, dictDataQueryParam, dictType } from '@/types/system/dict'
import { dictKey } from '@/types/system/dict'
import type { listType } from '@/hooks'
import { parseTime, useDicts, useGet } from '@/hooks'
import { ApiSysDictData, ApiSysDictType } from '@/api/sysApis'
import DictTag from '@/components/common/dict-tag.vue'

export function useDictData() {
  const dicts = useDicts(dictKey.sysNormalDisable)
  const route = useRoute()

  const queryParams = ref<dictDataQueryParam>({
    page_num: 1,
    page_size: 10,
    dict_type: route.query.dict_type as string,
  })

  //   获取全部字典类型数据
  const {
    data: dictTypeList,
    execute: getTypeList,
  } = useGet<listType<dictType>>(
    ApiSysDictType.getList,
    { page_size: Number.MAX_SAFE_INTEGER },
  )
  //   获取查询字典数据
  const {
    isFetching: isLoading,
    data: dictDataList,
    execute: getList,
  } = useGet<listType<dictData>>(
    ApiSysDictData.getList,
    queryParams.value,
    { immediate: true },
  )

  const columns: TableColumnData[] = [
    {
      title: '字典编码',
      dataIndex: 'dict_data_id',
      ellipsis: true,
      tooltip: true,
      width: 200,
      align: 'center',
    },
    {
      title: '字典标签',
      slotName: 'dictLabel',
      width: 100,
      align: 'center',
    },
    {
      title: '字典键值',
      dataIndex: 'dict_value',
      width: 100,
      align: 'center',
    },
    {
      title: '字典排序',
      dataIndex: 'dict_sort',
      width: 100,
      align: 'center',
    },
    {
      title: '状态',
      width: 100,
      align: 'center',
      render: ({ record }) => h(DictTag, {
        options: dicts.value[dictKey.sysNormalDisable],
        value: record.status,
      }),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 100,
      align: 'center',
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
      width: 200,
      // fixed: 'right',
      align: 'center',
    },
  ]
  const queryFormItems = ref<IuQueryFormField[]>([
    {
      field: 'dict_type',
      label: '字典名称',
      type: FormItemType.select,
      placeholder: '请输入字典名称',
      selectOption: {
        dataOption: computed(() => dictTypeList.value?.list as any[]),
        dataOptionKey: {
          label: 'dict_name',
          value: 'dict_type',
        },
        allowClear: true,
        allowSearch: true,
      },
    },
    {
      field: 'dict_label',
      label: '字典标签',
      type: FormItemType.input,
      placeholder: '请输入字典标签',
    },
    {
      field: 'status',
      label: '字典状态',
      type: FormItemType.select,
      placeholder: '请输入字典状态',
      selectOption: {
        dataOption: computed(() => dicts.value[dictKey.sysNormalDisable]),
        dataOptionKey: {
          label: 'label',
          value: 'value',
        },
        allowClear: true,
        allowSearch: true,
      },
    },
  ])
  const colors = [
    'orangered',
    'orange',
    'gold',
    'lime',
    'green',
    'cyan',
    'blue',
    'arcoblue',
    'purple',
    'pinkpurple',
    'magenta',
    'gray',
  ]
  const listClassOptions = computed(() =>
    colors.map((item) => {
      return {
        label: item,
        value: item,
      }
    }))
  const editFormItems = ref<IuFormField[]>([
    {
      field: 'dict_type',
      label: '字典类型',
      type: FormItemType.input,
      placeholder: '请输入字典类型',
      disabled: true,
    },
    {
      field: 'dict_label',
      label: '字典标签',
      type: FormItemType.input,
      placeholder: '请输入数据标签',
      rule: [
        { required: true, message: '数据标签不能为空' },
        { type: 'string', minLength: 1, maxLength: 20, message: '数据标签1~20个字符' },
      ],
      validateTrigger: 'blur',
    },
    {
      field: 'dict_value',
      label: '字典键值',
      type: FormItemType.input,
      placeholder: '请输入字典键值',
      rule: [
        { required: true, message: '字典键值不能为空' },
        { type: 'string', minLength: 1, maxLength: 20, message: '字典键值1~20个字符' },
      ],
      validateTrigger: 'blur',
    },
    {
      field: 'dict_sort',
      label: '显示排序',
      type: FormItemType.inputNumber,
      inputNumberMode: 'button',
      placeholder: '请输入显示排序',
      rule: [
        { required: true, message: '显示排序不能为空' },
      ],
    },
    {
      field: 'css_class',
      label: '样式属性',
      type: FormItemType.input,
      placeholder: '请输入样式属性',
    },
    {
      field: 'list_class',
      label: '回显样式',
      type: FormItemType.select,
      placeholder: '请输入回显样式',
      selectOption: {
        dataOption: listClassOptions,
        dataOptionKey: {
          label: 'label',
          value: 'value',
        },
        allowClear: true,
        allowSearch: true,
      },
    },
    {
      field: 'status',
      label: '字典状态',
      type: FormItemType.radio,
      placeholder: '请输入字典状态',
      selectOption: {
        dataOption: computed(() => dicts.value[dictKey.sysNormalDisable]),
        dataOptionKey: {
          label: 'label',
          value: 'value',
        },
      },
      rule: [
        { required: true, message: '字典状态必须选择' },
      ],
      validateTrigger: 'blur',
    },
    {
      field: 'remark',
      label: '备注',
      type: FormItemType.textarea,
      placeholder: '请输入字典备注',
    },
  ])
  return {
    dicts,
    queryFormItems,
    editFormItems,
    queryParams,
    columns,
    dictTypeList,
    getTypeList,
    isLoading,
    dictDataList,
    getList,
  }
}
