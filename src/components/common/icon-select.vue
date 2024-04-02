<script lang="ts" name="icon-select" setup>
import { ElInput, ElScrollbar } from 'element-plus'
import { ref } from 'vue'

import { useIcons } from './icon-select'
import SvgIcon from './svg-icon.vue'

const emit = defineEmits(['selected'])

const iconName = ref('')

const { icons } = useIcons()

const iconList = ref(icons)

function filterIcons() {
  iconList.value = icons
  if (iconName.value)
    iconList.value = icons.filter(item => item.includes(iconName.value))
}

function selectedIcon(name: string) {
  emit('selected', name)
  document.body.click()
}

function reset() {
  iconName.value = ''
  iconList.value = icons
}

defineExpose({
  reset,
})
</script>

<template>
  <div class="icon-body">
    <ElInput
      v-model="iconName"
      clearable
      placeholder="请输入图标名称"
      style="position: relative"
      @clear="filterIcons"
      @input="filterIcons"
    >
      <template #suffix>
        <i class="el-icon-search el-input__icon" />
      </template>
    </ElInput>
    <ElScrollbar class="icon-list" height="200px">
      <div
        v-for="(item, index) in iconList"
        :key="index"
        @click="selectedIcon(item)"
      >
        <SvgIcon :name="item" class="w-16px h-25px" />
        <span class="m-l-5px">{{ item }}</span>
      </div>
    </ElScrollbar>
  </div>
</template>

<style lang="scss" scoped>
.icon-body {
  width: 100%;
  padding: 10px;

  .icon-list {
    div {
      height: 30px;
      line-height: 30px;
      margin-bottom: -5px;
      cursor: pointer;
      width: 33%;
      float: left;
    }

    span {
      display: inline-block;
      vertical-align: -0.15em;
      fill: currentColor;
      overflow: hidden;
    }
  }
}
</style>
