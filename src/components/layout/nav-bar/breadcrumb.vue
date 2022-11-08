<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-01 20:20:03
 * @LastEditors: lingdu waong2005@126.com
 * @FilePath: \IUI314\src\components\layout\nav-bar\breadcrumb.vue
 * @Description: 
-->
<template>
  <el-breadcrumb class="m-l-10px font-900" :separator-icon="ArrowRight">
    <el-breadcrumb-item v-for="item in levelList" :key="item.path">
      <div class="no-redirect">
        <el-icon>
          <SvgIcon :name="item.meta! && item.meta.icon!" />
        </el-icon>
        <span v-if="!appStore.device.isMobile" class="m-l-5px">
          {{
            item.meta.i18n === undefined ||
            item.meta.i18n === null ||
            item.meta.i18n === ''
              ? item.meta.title
              : t(`route.${item.meta.i18n}`)
          }}
        </span>
      </div>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang="ts" setup name="breadcrumb">
import { ArrowRight } from '@element-plus/icons-vue'
import { ElBreadcrumb, ElBreadcrumbItem, ElIcon } from 'element-plus'
import { ref, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { type RouteLocationMatched, useRoute } from 'vue-router'

import SvgIcon from '@/components/common/svg-icon.vue'
import type { MessageSchema } from '@/i18n'
import { useAppStore } from '@/stores'

const appStore = useAppStore()
const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
const route = useRoute()
const levelList = ref<RouteLocationMatched[]>([])

function getBreadcrumb() {
  let matched = route.matched.filter((item) => item.meta && item.meta.title)

  levelList.value = matched.filter(
    (item) => item.meta && item.meta.title && item.meta.breadcrumb !== false
  )
}
watchEffect(() => {
  if (route.path.startsWith('/redirect/')) {
    return
  }
  getBreadcrumb()
})
getBreadcrumb()
</script>

<style lang="scss" scoped>
.no-redirect {
  color: #97a8be;
  cursor: text;
}
</style>
