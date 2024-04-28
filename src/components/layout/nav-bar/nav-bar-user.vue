<script lang="ts" setup>
import { h, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { Message, Modal } from '@arco-design/web-vue'
import ChangeCom from './changeCom.vue'
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
  Message.success(t('app.nav.changeRoleTip'))

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
  Message.success(t('app.nav.changeDeptTip'))

  setTimeout(() => {
    window.location.reload()
  }, 1000)
}

function logoutModal() {
  Modal.info({
    title: t('app.info'),
    hideCancel: false,
    titleAlign: 'start',
    content: t('app.nav.logoutTip'),
    okText: t('app.confirm'),
    cancelText: t('app.cancel'),
    draggable: true,
    onOk: logout,
  })
}

function roleChangeCom() {
  return h(ChangeCom, {
    id: role_id.value,
    keyKey: 'role_id',
    valueKey: 'role_id',
    labelKey: 'role_name',
    options: roleOptions.value,
    onOptionChange: roleChanged,
  })
}

function deptChangeCom() {
  return h(ChangeCom, {
    id: dept_id.value,
    keyKey: 'dept_id',
    valueKey: 'dept_id',
    labelKey: 'dept_name',
    options: deptOptions.value,
    mapOptions: deptMapOptions.value,
    onOptionChange: deptChanged,
  })
}

function roleChangeModal() {
  Modal.info({
    title: t('app.nav.changeRole'),
    hideCancel: false,
    titleAlign: 'start',
    content: roleChangeCom,
    footer: false,
    draggable: true,
  })
}

function deptChangeModal() {
  Modal.info({
    title: t('app.nav.changeDept'),
    hideCancel: false,
    titleAlign: 'start',
    content: deptChangeCom,
    footer: false,
    draggable: true,
  })
}

async function logout() {
  const currentRoute = router.currentRoute
  Message.success(t('app.nav.logoutSuccessTip'))
  await userStore.logOut()
  await router.push(`/login?redirect=${currentRoute.value.fullPath}`)
}

function go_to_profile() {
  router.push('/user/profile')
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
            <span class="m-l--20px" @click="roleChangeModal">
              <span class="m-l-20px">
                {{ t('app.nav.changeRole') }}
              </span>
            </span>
            <template #content>
              <roleChangeCom />
            </template>
          </a-popover>
        </a-doption>
        <a-doption>
          <a-popover position="lt">
            <span class="m-l--20px" @click="deptChangeModal">
              <span class="m-l-20px">
                {{ t('app.nav.changeDept') }}
              </span>
            </span>
            <template #content>
              <deptChangeCom />
            </template>
          </a-popover>
        </a-doption>
        <a-divider />
        <a-doption>
          <span @click="go_to_profile">
            {{ t('route.userCenter') }}
          </span>
        </a-doption>
        <a-divider />
        <a-doption
          @click="logoutModal"
        >
          {{ t('app.nav.logout') }}
        </a-doption>
      </template>
    </a-dropdown>
  </div>
</template>

<style lang="scss" scoped>
.arco-divider-horizontal{
  margin: 1px 0 !important;
}
</style>
