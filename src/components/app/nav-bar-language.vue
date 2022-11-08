<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-02 07:44:59
 * @LastEditors: lingdu waong2005@126.com
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
import { ElDropdown, ElDropdownItem, ElIcon } from 'element-plus'
import { useI18n } from 'vue-i18n'

import { langList } from '@/i18n'
import { useAppStore } from '@/stores'

import SvgIcon from '../common/svg-icon.vue'

const appStore = useAppStore()
const { locale } = useI18n()
const setLang = (v: string) => {
  appStore.setLang(v)
  locale.value = v
}
</script>
