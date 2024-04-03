import { ref } from 'vue'

export function useTableUtil() {
  return {
    useTableSelectChange,
  }
}

function useTableSelectChange() {
  const ids = ref<string[]>([])
  const values = ref<any[]>([])
  const single = ref<boolean>(false)
  const selected = ref<boolean>(false)
  //   handler
  const handleSelectionChangeFn = (
    selection: { [x: string]: any }[],
    idKey: string,
    valueKey: string,
  ) => {
    ids.value = selection.map(item => item[idKey])
    values.value = selection.map(item => item[valueKey])
    single.value = selection.length === 1
    selected.value = selection.length !== 0
  }
  const handleSelectionChangeFnX = (
    keys: string[],
    dataList: { [x: string]: any }[] | undefined,
    idKey: string,
    valueKey: string,
  ) => {
    values.value = (keys
      .map(key =>
        dataList?.find(item =>
          item[idKey] === key),
      ))
      .map(it =>
        it && it[valueKey])
    ids.value = keys
    single.value = keys.length === 1
    selected.value = keys.length !== 0
  }

  return {
    handleSelectionChangeFn,
    handleSelectionChangeFnX,
    ids,
    values,
    single,
    selected,
  }
}
