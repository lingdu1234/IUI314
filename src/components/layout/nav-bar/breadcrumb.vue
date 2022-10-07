<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-01 20:20:03
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-07 14:42:27
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
        <span v-if="!appStore.device.isMobile" class="m-l-5px">{{
          item.meta.title
        }}</span>
      </div>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang="ts" setup name="breadcrumb">
import { ArrowRight } from '@element-plus/icons-vue'
import { ref, watchEffect } from 'vue'
import { type RouteLocationMatched, useRoute } from 'vue-router'

import { useAppStore } from '@/stores'

const appStore = useAppStore()

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
