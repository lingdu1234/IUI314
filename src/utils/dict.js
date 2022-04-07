import { getDicts } from '@/api/system/dict/data'
import { toRefs,ref } from 'vue';
/**
 * 获取字典数据
 */
export function useDict(...args) {
  const res = ref({});
  return (() => {
    args.forEach((d, index) => {
      res.value[d] = [];
      getDicts({dict_type:d}).then(resp => {
        res.value[d] = resp.map(p => ({ label: p.dict_label, value: p.dict_value, elTagType: p.list_class }))
      })
    })
    return toRefs(res.value);
  })()
}