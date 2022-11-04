<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-02 07:44:59
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-11-04 21:52:16
 * @FilePath: \IUI314\src\components\app\nav-bar-theme.vue
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
        <SvgIcon name="theme" />
      </el-icon>
      <template #dropdown>
        <el-dropdown-item
          v-for="theme in theme_list"
          :key="theme"
          @click="setTheme(theme)"
        >
          <span
            :class="appStore.app.theme === theme ? 'font-bold' : 'font-normal'"
          >
            {{ t(`theme.${theme}`) }}
          </span>
        </el-dropdown-item>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts" name="nav-bar-theme">
import { ElDropdown, ElDropdownItem, ElIcon } from 'element-plus'
import { useI18n } from 'vue-i18n'

import { useTheme } from '@/hooks'
import type { MessageSchema } from '@/i18n'
import { useAppStore } from '@/stores'

import SvgIcon from '../common/svg-icon.vue'
const appStore = useAppStore()
const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })

const { setTheme, theme_list } = useTheme()
</script>
