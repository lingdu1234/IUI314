<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-20 16:05:46
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-11-01 14:48:46
 * @FilePath: \IUI314\src\views\system\user\profile.vue
 * @Description: 
-->
<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="24" :md="12" class="m-b-20px">
        <el-card class="box-card">
          <template #header>
            <div>
              <span>{{ t('profile.personalInformation') }}</span>
            </div>
          </template>
          <div>
            <div class="text-center">
              <UserAvatar />
            </div>
            <el-form
              class="drawer-form"
              label-width="120px"
              label-position="left"
            >
              <el-form-item>
                <template #label>
                  <el-icon class="m-t-10px">
                    <svg-icon name="user" />
                  </el-icon>
                  <span class="m-l-3px">{{ t('profile.name') }}</span>
                </template>
                {{ userInfos.user_name }}
              </el-form-item>
              <el-form-item>
                <template #label>
                  <el-icon class="m-t-10px">
                    <svg-icon name="phone" />
                  </el-icon>
                  <span class="m-l-3px">{{ t('common.phoneNum') }}</span>
                </template>
                {{ userInfos.phone_num }}
              </el-form-item>
              <el-form-item>
                <template #label>
                  <el-icon class="m-t-10px">
                    <svg-icon name="email" />
                  </el-icon>
                  <span class="m-l-3px">{{ t('common.email') }}</span>
                </template>
                {{ userInfos.user_email }}
              </el-form-item>
              <el-form-item>
                <template #label>
                  <el-icon class="m-t-10px">
                    <svg-icon name="tree" />
                  </el-icon>
                  <span class="m-l-3px">{{ t('profile.dept') }}</span>
                </template>
                {{ userInfos.dept?.dept_name }} / {{ postGroup }}
              </el-form-item>
              <el-form-item>
                <template #label>
                  <el-icon class="m-t-10px">
                    <svg-icon name="peoples" />
                  </el-icon>
                  <span class="m-l-3px">{{ t('profile.role') }}</span>
                </template>
                <el-tag
                  v-for="v in roleGroup"
                  :key="v"
                  :type="v == roleOptions[userInfos.role_id!] ? '' : 'info'"
                  class="m-l-3px m-t-2px"
                >
                  {{ v }}
                </el-tag>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <el-icon class="m-t-10px">
                    <svg-icon name="date" />
                  </el-icon>
                  <span class="m-l-3px">{{ t('common.createTime') }}</span>
                </template>
                {{ parseTime(userInfos.created_at) }}
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
      <el-col :span="24" :md="12" class="m-b-20px">
        <el-card>
          <template #header>
            <div>
              <span>{{ t('profile.basicInfo') }}</span>
            </div>
          </template>
          <el-tabs v-model="activeTab" type="border-card">
            <el-tab-pane :label="t('profile.basicInfo')" name="userInfoTab">
              <UserInformation :user="userInfos" />
            </el-tab-pane>
            <el-tab-pane :label="t('common.updatePwd')" name="resetPwd">
              <ResetPassword />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts" setup name="user-profile">
import { ElCol, ElForm, ElFormItem, ElIcon, ElRow } from 'element-plus'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { ApiSysPost, ApiSysRole, ApiSysUser } from '@/api/sysApis'
import { parseTime, useGet } from '@/hooks'
import type { MessageSchema } from '@/i18n'
import type { pageQueryParam } from '@/types/base/apis'
import type { postList } from '@/types/system/post'
import type { roleList } from '@/types/system/role'
import type { user, userInfo } from '@/types/system/user'

import ResetPassword from './pages/reset-password.vue'
import UserAvatar from './pages/user-avatar.vue'
import UserInformation from './pages/user-information.vue'

const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
const postOptions = ref<{ [k: string]: string }>({})
const roleOptions = ref<{ [k: string]: string }>({})

const userInfos = ref<user>({})
const roleGroup = ref<string[]>()
const postGroup = ref<string>('')
const activeTab = ref<string>('userInfoTab')

const get_posts_roles = async () => {
  const q: pageQueryParam = {
    page_num: 1,
    page_size: Number.MAX_SAFE_INTEGER,
  }
  const { data: posts, execute: e_post } = useGet<postList>(
    ApiSysPost.getList,
    q
  )
  const { data: roles, execute: r_post } = useGet<roleList>(
    ApiSysRole.getList,
    q
  )
  await Promise.all([e_post(), r_post()])
  posts.value?.list!.forEach(
    (it) => (postOptions.value[it.post_id!] = it.post_name!)
  )
  roles.value?.list!.forEach(
    (it) => (roleOptions.value[it.role_id!] = it.role_name!)
  )
}
const getUser = async () => {
  await get_posts_roles()
  const { data, execute } = useGet<userInfo>(ApiSysUser.getProfile)
  await execute()
  userInfos.value = data.value?.user_info!
  roleGroup.value = data.value?.role_ids!.map((it) => roleOptions.value[it])
  postGroup.value = data.value
    ?.post_ids!.map((it) => postOptions.value[it])
    .join(',')!
}
getUser()
</script>
