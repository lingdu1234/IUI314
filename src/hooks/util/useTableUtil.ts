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
  const handleSelectionChangeFnX = (
    keys: (string | number)[],
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
    ids.value = keys as string[]
    single.value = keys.length === 1
    selected.value = keys.length !== 0
  }

  return {
    handleSelectionChangeFnX,
    ids,
    values,
    single,
    selected,
  }
}
