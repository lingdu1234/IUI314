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
    <a-row :gutter="20">
      <a-col :span="24" :md="12" class="m-b-20px">
        <a-card class="box-card">
          <template #header>
            <div>
              <span>{{ t('profile.personalInformation') }}</span>
            </div>
          </template>
          <div>
            <div class="text-center">
              <UserAvatar />
            </div>
            <a-form
              class="drawer-form"
              label-align="left"
              auto-label-width
            >
              <a-form-item>
                <template #label>
                  <IconUser />
                  <span class="m-l-3px">{{ t('profile.name') }}</span>
                </template>
                {{ userInfos.user_name }}
              </a-form-item>
              <a-form-item>
                <template #label>
                  <IconPhone />
                  <span class="m-l-3px">{{ t('common.phoneNum') }}</span>
                </template>
                {{ userInfos.phone_num }}
              </a-form-item>
              <a-form-item>
                <template #label>
                  <IconEmail />
                  <span class="m-l-3px">{{ t('common.email') }}</span>
                </template>
                {{ userInfos.user_email }}
              </a-form-item>
              <a-form-item>
                <template #label>
                  <IconOriginalSize />
                  <span class="m-l-3px">{{ t('profile.dept') }}</span>
                </template>
                {{ userInfos.dept?.dept_name }} / {{ postGroup }}
              </a-form-item>
              <a-form-item>
                <template #label>
                  <IconRobot />
                  <span class="m-l-3px">{{ t('profile.role') }}</span>
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
                  <span class="m-l-3px">{{ t('common.createTime') }}</span>
                </template>
                {{ parseTime(userInfos.created_at) }}
              </a-form-item>
            </a-form>
          </div>
        </a-card>
      </a-col>
      <a-col :span="24" :md="12" class="m-b-20px">
        <a-card>
          <template #header>
            <div>
              <span>{{ t('profile.basicInfo') }}</span>
            </div>
          </template>
          <a-tabs :default-active-key="activeTab">
            <a-tab-pane key="userInfoTab" :title="t('profile.basicInfo')">
              <UserInformation :user="userInfos" />
            </a-tab-pane>
            <a-tab-pane key="resetPwd" :title="t('common.updatePwd')">
              <ResetPassword />
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
