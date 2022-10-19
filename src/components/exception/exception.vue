<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-06 15:41:35
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-18 18:29:03
 * @FilePath: \IUI314\src\components\exception\exception.vue
 * @Description: 
-->
<template>
  <div class="flex m-t-10vh items-center flex-col w-full h-full">
    <div class="text-400px text-70px">
      <el-icon size="500px">
        <svg-icon v-if="type === '401'" name="exception401" />
        <svg-icon v-if="type === '403'" name="exception403" />
        <svg-icon v-if="type === '404'" name="exception404" />
        <svg-icon v-if="type === '500'" name="exception500" />
      </el-icon>
    </div>
    <div>
      <router-link :to="routeHomePath">
        <el-button class="m-20px" type="primary" @click="back">返回</el-button>
      </router-link>
      <router-link :to="routeHomePath">
        <el-button class="m-20px" type="primary">首页</el-button>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type ComponentInternalInstance, getCurrentInstance } from 'vue'

import SvgIcon from '../common/svg-icon.vue'

let { proxy } = getCurrentInstance() as ComponentInternalInstance
type ExceptionType = '401' | '403' | '404' | '500'
interface Props {
  type: ExceptionType
}
defineProps<Props>()
const routeHomePath = '/index'
function back() {
  if (proxy?.$route.query.noGoBack) {
    proxy.$router.push({ path: '/' })
  } else {
    proxy?.$router.go(-1)
  }
}
defineOptions({
  name: 'exception',
})
</script>
