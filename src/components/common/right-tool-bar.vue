<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-09 20:32:13
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-11-01 10:53:34
 * @FilePath: \IUI314\src\components\common\right-tool-bar.vue
 * @Description: 
-->
<template>
  <div class="top-right-btn">
    <el-row>
      <el-tooltip
        class="item"
        effect="light"
        :content="
          showSearch
            ? t('common.hidden') + t('common.search')
            : t('common.show') + t('common.search')
        "
        placement="top"
      >
        <el-button circle :icon="Search" @click="toggleSearch()" />
      </el-tooltip>
      <el-tooltip
        class="item"
        effect="light"
        :content="t('common.reFresh')"
        placement="top"
      >
        <el-button circle :icon="Refresh" @click="refresh()" />
      </el-tooltip>
    </el-row>
  </div>
</template>
<script setup lang="ts" name="right-tool-bar">
import { Refresh, Search } from '@element-plus/icons-vue'
import { ElButton, ElRow, ElTooltip } from 'element-plus'
import { useI18n } from 'vue-i18n'

import type { MessageSchema } from '@/i18n'
const props = defineProps({
  showSearch: {
    type: Boolean,
    default: true,
  },
})
const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
const emits = defineEmits(['update:showSearch', 'queryTable'])

// 搜索
function toggleSearch() {
  emits('update:showSearch', !props.showSearch)
}
// 刷新
function refresh() {
  emits('queryTable')
}
</script>
<style lang="scss" scoped>
.top-right-btn {
  margin-left: auto;
  margin-right: 5px;
}
</style>
