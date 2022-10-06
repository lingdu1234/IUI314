<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-01 20:20:03
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-06 15:26:13
 * @FilePath: \IUI314\src\components\layout\nav-bar\breadcrumb.vue
 * @Description: 
-->
<template>
  <el-breadcrumb class="m-l-20px font-900" :separator-icon="ArrowRight">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="item in levelList" :key="item.path">
        <div class="no-redirect">
          <el-icon>
            <SvgIcon :name="item.meta! && item.meta.icon!" />
          </el-icon>
          <span class="m-l-5px">{{ item.meta.title }}</span>
        </div>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script lang="ts" setup name="breadcrumb">
import { ArrowRight } from '@element-plus/icons-vue'
import { ref, watchEffect } from 'vue'
import {
  type RouteLocationMatched,
  //   type RouteRecordRaw,
  useRoute,
  //   useRouter,
} from 'vue-router'

const route = useRoute()
// const router = useRouter();
const levelList = ref<RouteLocationMatched[]>([])

function getBreadcrumb() {
  let matched = route.matched.filter((item) => item.meta && item.meta.title)

  levelList.value = matched.filter(
    (item) => item.meta && item.meta.title && item.meta.breadcrumb !== false
  )
}

// function handleLink(item: RouteLocationMatched) {
//   const { redirect, path } = item;
//   if (redirect) {
//     router.push(redirect as RouteRecordRaw);
//     return;
//   }
//   router.push(path);
// }

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
