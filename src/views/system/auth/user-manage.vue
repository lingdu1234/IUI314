<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-15 16:31:23
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-16 14:53:14
 * @FilePath: \IUI314\src\views\system\auth\user-manage.vue
 * @Description: 
-->
<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="4" :xs="24">
        <div>
          <el-input
            v-model="dept_name"
            placeholder="请输入部门名称"
            clearable
            :prefix-icon="Search"
            class="m-b-20px"
          />
        </div>
        <div>
          <el-tree
            ref="deptTreeRef"
            :data="deptTree"
            :props="deptTreeProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <el-col :span="20" :xs="24">
        <!-- 右侧显示区域 -->
        <UserManageForm :dept_id="dept_id" />
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import type { ElTree } from 'element-plus'
import { provide, ref, watch } from 'vue'

import { ApiSysDept } from '@/api/apis'
import { useGet } from '@/hooks'
import { systemMenus } from '@/router'
import type { dept } from '@/types/system/dept'

import UserManageForm from './components/user-manage-form.vue'

const deptTreeProps = {
  label: 'dept_name',
  children: 'children',
}

const dept_name = ref<string>()
const dept_id = ref<string>()
const deptTreeRef = ref<InstanceType<typeof ElTree>>()
const deptTree = ref<dept[]>([])

const getDeptTree = async () => {
  const { data, execute } = useGet<dept[]>(ApiSysDept.getDeptTree)
  await execute()
  deptTree.value = data.value!
}
// 节点点击事件
const handleNodeClick = (data: dept) => {
  dept_id.value = data.dept_id
}
// el-tree 筛选
const filterNode = (value: string, data: dept) => {
  if (!value) return true
  return data.dept_name!.includes(value)
}
watch(dept_name, (val) => {
  deptTreeRef.value!.filter(val)
})
getDeptTree()
//  注入deptTree
provide('deptTree', deptTree)
// 组件名称
defineOptions({
  name: systemMenus.userManage.path,
})
</script>
