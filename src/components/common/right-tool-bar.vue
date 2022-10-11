<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-09 20:32:13
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-09 20:46:43
 * @FilePath: \IUI314\src\components\common\right-tool-bar.vue
 * @Description: 
-->
<template>
  <div class="top-right-btn">
    <el-row>
      <el-tooltip
        class="item"
        effect="light"
        :content="showSearch ? '隐藏搜索' : '显示搜索'"
        placement="top"
      >
        <el-button circle :icon="Search" @click="toggleSearch()" />
      </el-tooltip>
      <el-tooltip class="item" effect="light" content="刷新" placement="top">
        <el-button circle :icon="Refresh" @click="refresh()" />
      </el-tooltip>
    </el-row>
  </div>
</template>
<script setup lang="ts" name="right-tool-bar">
import { Refresh, Search } from '@element-plus/icons-vue'
const props = defineProps({
  showSearch: {
    type: Boolean,
    default: true,
  },
})
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
