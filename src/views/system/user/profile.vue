<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import ResetPassword from './pages/reset-password.vue'
import UserAvatar from './pages/user-avatar.vue'
import UserInformation from './pages/user-information.vue'
import { ApiSysPost, ApiSysRole, ApiSysUser } from '@/api/sysApis'
import { parseTime, useGet } from '@/hooks'
import type { MessageSchema } from '@/i18n'
import type { pageQueryParam } from '@/types/base/apis'
import type { postList } from '@/types/system/post'
import type { roleList } from '@/types/system/role'
import type { userInfo, userInformation } from '@/types/system/userInformation'

defineOptions({ name: 'UserProfile' })

const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
const postOptions = ref<{ [k: string]: string }>({})
const roleOptions = ref<{ [k: string]: string }>({})

const userInfos = ref<userInformation>({})
const roleGroup = ref<string[]>()
const postGroup = ref<string>('')
const activeTab = ref<string>('userInfoTab')

async function get_posts_roles() {
  const q: pageQueryParam = {
    page_num: 1,
    page_size: Number.MAX_SAFE_INTEGER,
  }
  const { data: posts, execute: e_post } = useGet<postList>(
    ApiSysPost.getList,
    q,
  )
  const { data: roles, execute: r_post } = useGet<roleList>(
    ApiSysRole.getList,
    q,
  )
  await Promise.all([e_post(), r_post()])
  posts.value?.list!.forEach(
    it => (postOptions.value[it.post_id!] = it.post_name!),
  )
  roles.value?.list!.forEach(
    it => (roleOptions.value[it.role_id!] = it.role_name!),
  )
}
async function getUser() {
  await get_posts_roles()
  const { data, execute } = useGet<userInfo>(ApiSysUser.getProfile)
  await execute()
  userInfos.value = data.value?.user_info as userInformation
  roleGroup.value = data.value?.role_ids!.map(it => roleOptions.value[it])
  postGroup.value = (data.value
  && data.value.post_ids!.map(it => postOptions.value[it])
    .join(',')
  ) as string
}
getUser()
</script>

<template>
  <div>
    <a-grid :col-gap="20" :cols="{ xs: 1, sm: 1, md: 1, lg: 2, xl: 2, xxl: 2 }">
      <a-grid-item class="m-b-20px">
        <a-card>
          <template #title>
            <div>
              <span>{{ t('sys.user.information') }}</span>
            </div>
          </template>
          <div>
            <div class="text-center">
              <UserAvatar />
            </div>
            <a-form
              :model="userInfos"
              class="drawer-form"
              label-align="left"
              auto-label-width
            >
              <a-form-item>
                <template #label>
                  <IconUser />
                  <span class="m-l-3px">{{ t('sys.user.name') }}</span>
                </template>
                {{ userInfos.user_name }}
              </a-form-item>
              <a-form-item>
                <template #label>
                  <IconPhone />
                  <span class="m-l-3px">{{ t('sys.user.phone') }}</span>
                </template>
                {{ userInfos.phone_num }}
              </a-form-item>
              <a-form-item>
                <template #label>
                  <IconEmail />
                  <span class="m-l-3px">{{ t('sys.user.email') }}</span>
                </template>
                {{ userInfos.user_email }}
              </a-form-item>
              <a-form-item>
                <template #label>
                  <IconOriginalSize />
                  <span class="m-l-3px">{{ t('sys.dept') }}</span>
                </template>
                {{ userInfos.dept?.dept_name }} / {{ postGroup }}
              </a-form-item>
              <a-form-item>
                <template #label>
                  <IconRobot />
                  <span class="m-l-3px">{{ t('sys.role') }}</span>
                </template>
                <a-tag
                  v-for="v in roleGroup"
                  :key="v"
                  :color="v === roleOptions[userInfos.role_id!] ? 'red' : ''"
                  class="m-l-3px m-t-2px"
                >
                  {{ v }}
                </a-tag>
              </a-form-item>
              <a-form-item>
                <template #label>
                  <IconCalendar />
                  <span class="m-l-3px">{{ t('sys.createTime') }}</span>
                </template>
                {{ parseTime(userInfos.created_at) }}
              </a-form-item>
            </a-form>
          </div>
        </a-card>
      </a-grid-item>
      <a-grid-item class="m-b-20px">
        <a-card>
          <template #title>
            <div>
              <span>{{ t('sys.user.basicInfo') }}</span>
            </div>
          </template>
          <a-tabs :default-active-key="activeTab">
            <a-tab-pane key="userInfoTab" :title="t('sys.user.basicInfo')">
              <UserInformation :user="userInfos" />
            </a-tab-pane>
            <a-tab-pane key="resetPwd" :title="t('sys.user.updatePwd')">
              <ResetPassword />
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-grid-item>
    </a-grid>
  </div>
</template>
