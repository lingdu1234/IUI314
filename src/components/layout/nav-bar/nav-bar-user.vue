<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-02 11:04:09
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-22 22:06:33
 * @FilePath: \IUI314\src\components\layout\nav-bar\nav-bar-user.vue
 * @Description: 
-->
<!-- eslint-disable max-len -->
<template>
  <div>
    <el-dropdown trigger="click">
      <div class="m-t-2px cursor-pointer">
        <img
          :src="userStore.user.avatar"
          class="w-32px h-32px cursor-pointer b-rd-30px"
          alt="user"
        />
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-popover placement="left-start" :width="width">
            <template #reference>
              <span>
                <el-dropdown-item>{{ t('nav.changeRole') }}</el-dropdown-item>
              </span>
            </template>
            <el-radio-group v-model="role_id" @change="roleChanged">
              <el-row>
                <el-col v-for="item in roleOptions" :key="item.role_id">
                  <el-radio :label="item.role_id" :value="item.role_id">
                    {{ item.role_name }}
                  </el-radio>
                </el-col>
              </el-row>
            </el-radio-group>
          </el-popover>
          <el-popover placement="left-start" :width="width">
            <template #reference>
              <span
                ><el-dropdown-item>
                  {{ t('nav.changeDept') }}</el-dropdown-item
                ></span
              >
            </template>
            <el-radio-group v-model="dept_id" @change="deptChanged">
              <el-row>
                <el-col v-for="item in deptOptions" :key="item.dept_id">
                  <el-radio :label="item.dept_id" :value="item.dept_id">
                    {{
                      (item.parent_id != '0'
                        ? deptMapOptions[item.parent_id!] + '-'
                        : '') + item.dept_name
                    }}
                  </el-radio>
                </el-col>
              </el-row>
            </el-radio-group>
          </el-popover>
          <router-link to="/user/profile" class="decoration-none">
            <el-dropdown-item divided>
              {{ t('route.userCenter') }}
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click="logout">
            {{ t('nav.Logout') }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts" setup name="nav-bar-user">
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { ErrorFlag } from '@/api/apis'
import { ApiSysDept, ApiSysRole, ApiSysUser } from '@/api/sysApis'
import { useGet, usePut } from '@/hooks'
import type { MessageSchema } from '@/i18n'
import { router } from '@/router'
import { useUserStore } from '@/stores'
import type { dept, deptList } from '@/types/system/dept'
import type { role, roleList } from '@/types/system/role'

const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
const userStore = useUserStore()
const width = ref(0)
const role_id = ref('')
const roleOptions = ref<role[]>([])
const dept_id = ref('')
const deptOptions = ref<dept[]>([])
const deptMapOptions = ref<Record<string, string>>({})

const get_options = async () => {
  let queryParams = {
    page_num: 1,
    page_size: Number.MAX_SAFE_INTEGER,
  }

  const { data: roles, execute: e_roles } = useGet<roleList>(
    ApiSysRole.getList,
    queryParams
  )
  const { data: depts, execute: e_depts } = useGet<deptList>(
    ApiSysDept.getList,
    queryParams
  )
  await Promise.all([e_roles(), e_depts()])
  const map: Record<string, string> = {}
  let max_length = 0
  let r = roles.value?.list.filter((item) => {
    max_length = Math.max(max_length, item.role_name!.length)
    return userStore.user.roles.includes(item.role_id!)
  })
  let d = depts.value?.list.filter((item) => {
    map[item.dept_id!] = item.dept_name!
    max_length = Math.max(max_length, item.dept_name!.length)
    return userStore.user.depts.includes(item.dept_id!)
  })
  width.value = max_length * 16 + 22
  roleOptions.value = r!
  role_id.value = userStore.user.role
  deptOptions.value = d!
  deptMapOptions.value = map
  dept_id.value = userStore.user.dept
}
async function roleChanged(v: string) {
  const { data, execute } = usePut(ApiSysUser.changeRole, {
    user_id: userStore.user.uid,
    role_id: v,
  })
  await execute()
  if (data.value === ErrorFlag) return
  ElMessage.success(t('nav.changeRoleTip'))

  setTimeout(() => {
    window.location.reload()
  }, 1000)
}
async function deptChanged(v: string) {
  const { data, execute } = usePut(ApiSysUser.changeDept, {
    user_id: userStore.user.uid,
    dept_id: v,
  })
  await execute()
  if (data.value === ErrorFlag) return
  ElMessage.success(t('nav.changeDeptTip'))

  setTimeout(() => {
    window.location.reload()
  }, 1000)
}

const logout = () => {
  ElMessageBox.confirm(t('nav.loginOutTip'), t('common.tip'), {
    confirmButtonText: t('common.submit'),
    cancelButtonText: t('common.cancel'),
    type: 'warning',
  })
    .then(async () => {
      const currentRoute = router.currentRoute

      await userStore.logOut()
      router.push(`/login?redirect=${currentRoute.value.fullPath}`)
    })
    .catch(() => {})
}
get_options()
</script>
