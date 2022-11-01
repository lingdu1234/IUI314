<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-06 15:41:35
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-11-01 20:44:06
 * @FilePath: \IUI314\src\components\exception\exception.vue
 * @Description: 
-->
<template>
  <div class="flex m-t-10vh items-center flex-col w-full h-full">
    <div class="text-400px text-70px">
      <el-icon size="500px">
        <SvgIcon v-if="type === '401'" name="exception401" />
        <SvgIcon v-if="type === '403'" name="exception403" />
        <SvgIcon v-if="type === '404'" name="exception404" />
        <SvgIcon v-if="type === '500'" name="exception500" />
      </el-icon>
    </div>
    <div>
      <router-link :to="routeHomePath" class="decoration-none">
        <el-button class="m-20px" type="primary" @click="back">
          {{ t('common.back') }}
        </el-button>
      </router-link>
      <router-link :to="routeHomePath" class="decoration-none">
        <el-button class="m-20px" type="primary">
          {{ t('common.home') }}
        </el-button>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElButton, ElIcon } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import type { MessageSchema } from '@/i18n'
import { router } from '@/router'

import SvgIcon from '../common/svg-icon.vue'
type ExceptionType = '401' | '403' | '404' | '500'
interface Props {
  type: ExceptionType
}
defineProps<Props>()

const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
const route = useRoute()
const routeHomePath = '/index'
const back = () => {
  if (route.query.noGoBack) {
    router.push({ path: '/' })
  } else {
    router.go(-1)
  }
}
defineOptions({
  name: 'exception',
})
</script>
