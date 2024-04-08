<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import type { TreeInstance } from '@arco-design/web-vue'
import { ApiSysDept } from '@/api/apis'
import { emitter, useGet } from '@/hooks'
import type { MessageSchema } from '@/i18n'
import { systemMenus } from '@/router'
import type { dept } from '@/types/system/dept'
import UserManageForm from '@/views/system/auth/pages/user-manage-form.vue'

// 组件名称
defineOptions({
  name: systemMenus.userManage.path,
})

const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })

const fieldNames = {
  key: 'dept_id',
  title: 'dept_name',
  children: 'children',
}

const searchKey = ref<string>('')
const dept_id = ref<string>()
const deptTreeRef = ref<TreeInstance>()

const { data: deptTree } = useGet<dept[]>(
  ApiSysDept.getDeptTree,
  null,
  { immediate: true },
)

const treeData = computed(() => {
  if (!searchKey.value)
    return deptTree.value
  return searchData(searchKey.value)
})
function searchData(keyword: string) {
  const loop = (data: dept[]) => {
    const result: dept[] = []
    data.forEach((item: dept) => {
      if (item.dept_name && item.dept_name.toLowerCase().includes(keyword.toLowerCase())) {
        result.push({ ...item })
      }
      else if (item.children) {
        const filterData = loop(item.children)
        if (filterData.length) {
          result.push({
            ...item,
            children: filterData,
          })
        }
      }
    })
    return result
  }

  return loop(deptTree.value?.length ? deptTree.value : [])
}

function handleSelect(v: Array<string | number>) {
  dept_id.value = v[0] as string
}

watch(() => deptTree.value, () => {
  emitter.emit('dept_tree', deptTree.value)
})
</script>

<template>
  <div>
    <a-grid :col-gap="20" :cols="24">
      <a-grid-item :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 4, xxl: 3 }">
        <a-input
          v-model="searchKey"
          :placeholder="t('dept.searchTip')"
          class="m-b-20px"
          allow-clear
        >
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
        <a-tree
          v-if="treeData && treeData.length > 0"
          ref="deptTreeRef"
          :data="treeData"
          :field-names="fieldNames"
          show-line
          @select="handleSelect"
        />
      </a-grid-item>

      <a-grid-item :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 20, xxl: 21 }">
        <!-- 右侧显示区域 -->
        <UserManageForm
          v-if="deptTree"
          :dept-id="dept_id"
          :dept-tree="deptTree"
        />
      </a-grid-item>
    </a-grid>
  </div>
</template>
