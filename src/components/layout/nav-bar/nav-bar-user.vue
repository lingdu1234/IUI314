<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { Message } from '@arco-design/web-vue'
import { ErrorFlag } from '@/api/apis'
import { ApiSysDept, ApiSysRole, ApiSysUser } from '@/api/sysApis'
import { useGet, usePut } from '@/hooks'
import type { MessageSchema } from '@/i18n'
import { router } from '@/router'
import { useUserStore } from '@/stores'
import type { dept, deptList } from '@/types/system/dept'
import type { role, roleList } from '@/types/system/role'

defineOptions({ name: 'NavBarUser' })

const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
const userStore = useUserStore()
const role_id = ref('')
const roleOptions = ref<role[]>([])
const dept_id = ref('')
const deptOptions = ref<dept[]>([])
const deptMapOptions = ref<Record<string, string>>({})

const visible = ref(false)

async function get_options() {
  const queryParams = {
    page_num: 1,
    page_size: Number.MAX_SAFE_INTEGER,
  }

  const { data: roles, execute: e_roles } = useGet<roleList>(
    ApiSysRole.getList,
    queryParams,
  )
  const { data: depts, execute: e_depts } = useGet<deptList>(
    ApiSysDept.getList,
    queryParams,
  )
  await Promise.all([e_roles(), e_depts()])
  const map: Record<string, string> = {}
  const r = roles.value?.list.filter((item) => {
    return userStore.user.roles.includes(item.role_id!)
  })
  const d = depts.value?.list.filter((item) => {
    map[item.dept_id!] = item.dept_name!
    return userStore.user.depts.includes(item.dept_id!)
  })
  roleOptions.value = r!
  role_id.value = userStore.user.role
  deptOptions.value = d!
  deptMapOptions.value = map
  dept_id.value = userStore.user.dept
}
async function roleChanged(v: string | number | boolean) {
  const { data, execute } = usePut(ApiSysUser.changeRole, {
    user_id: userStore.user.uid,
    role_id: v,
  })
  await execute()
  if (data.value === ErrorFlag)
    return
  Message.success(t('nav.changeRoleTip'))

  setTimeout(() => {
    window.location.reload()
  }, 1000)
}
async function deptChanged(v: string | number | boolean) {
  const { data, execute } = usePut(ApiSysUser.changeDept, {
    user_id: userStore.user.uid,
    dept_id: v,
  })
  await execute()
  if (data.value === ErrorFlag)
    return
  Message.success(t('nav.changeDeptTip'))

  setTimeout(() => {
    window.location.reload()
  }, 1000)
}

async function logout() {
  const currentRoute = router.currentRoute

  await userStore.logOut()
  router.push(`/login?redirect=${currentRoute.value.fullPath}`)
}
get_options()
</script>

<template>
  <div>
    <a-dropdown trigger="click">
      <div class="m-t-2px cursor-pointer">
        <img
          :src="userStore.user.avatar"
          class="w-32px h-32px cursor-pointer b-rd-30px"
          alt="user"
        >
      </div>
      <template #content>
        <a-doption>
          <a-popover position="lt">
            <span class="m-l--20px">
              <span class="m-l-20px">
                {{ t('nav.changeRole') }}
              </span>
            </span>
            <template #content>
              <a-radio-group v-model="role_id" direction="vertical" @change="roleChanged">
                <a-radio
                  v-for="item in roleOptions"
                  :key="item.role_id"
                  :value="item.role_id"
                >
                  {{ item.role_name }}
                </a-radio>
              </a-radio-group>
            </template>
          </a-popover>
        </a-doption>
        <a-doption>
          <a-popover position="lt">
            <span class="m-l--20px">
              <span class="m-l-20px">
                {{ t('nav.changeDept') }}
              </span>
            </span>
            <template #content>
              <a-radio-group v-model="dept_id" direction="vertical" @change="deptChanged">
                <a-radio
                  v-for="item in deptOptions"
                  :key="item.dept_id"
                  :value="item.dept_id"
                >
                  <span class="m-l-20px">
                    {{ item.dept_name }}
                  </span>
                  {{
                    (item.parent_id !== '0'
                      ? `${deptMapOptions[item.parent_id!]}-`
                      : '')
                      + item.dept_name
                  }}
                </a-radio>
              </a-radio-group>
            </template>
          </a-popover>
        </a-doption>
        <a-divider />
        <a-doption>
          <router-link to="/user/profile" class="decoration-none">
            {{ t('route.userCenter') }}
          </router-link>
        </a-doption>
        <a-divider />
        <a-doption @click="visible = true">
          {{ t('nav.Logout') }}
        </a-doption>
      </template>
    </a-dropdown>
  </div>
  <a-modal v-model:visible="visible" @ok="logout" @cancel="visible = false">
    <template #title>
      提示
    </template>
    <div>你确定要注销退出系统吗？</div>
  </a-modal>
</template>

<style lang="scss" scoped>
.arco-divider-horizontal{
  margin: 1px 0 !important;
}
</style>
