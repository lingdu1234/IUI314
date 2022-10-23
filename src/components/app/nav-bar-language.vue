<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-02 07:44:59
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-23 10:26:45
 * @FilePath: \IUI314\src\components\app\nav-bar-language.vue
 * @Description: 
-->
<template>
  <div>
    <el-dropdown trigger="click">
      <el-icon
        size="large"
        color="var(--drop-down-icon-color)"
        class="cursor-pointer"
      >
        <SvgIcon name="language" />
      </el-icon>
      <template #dropdown>
        <el-dropdown-item
          v-for="lang in langList"
          :key="lang.k"
          @click="setLang(lang.k)"
        >
          <span
            :class="appStore.app.lang === lang.k ? 'font-bold' : 'font-normal'"
          >
            {{ lang.v }}
          </span>
        </el-dropdown-item>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts" name="nav-bar-language">
import { useI18n } from 'vue-i18n'

import { langList } from '@/i18n'
import { useAppStore } from '@/stores'
const appStore = useAppStore()
const { locale } = useI18n()
const setLang = (v: string) => {
  appStore.setLang(v)
  locale.value = v
}
</script>
