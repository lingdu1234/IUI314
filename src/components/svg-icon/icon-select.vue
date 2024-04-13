<script lang="ts" setup>
import { ElInput, ElScrollbar } from 'element-plus'
import { ref } from 'vue'

import { useIuiIcons } from '@/components/svg-icon/useIuiIcons'
import UnoIcon from '@/components/common/uno-icon.vue'

defineOptions({ name: 'IconSelect' })

const emit = defineEmits(['selected'])

const iconName = ref('')

const { IuiIcons } = useIuiIcons()

const iconList = ref(IuiIcons)

function filterIcons() {
  iconList.value = IuiIcons
  if (iconName.value)
    iconList.value = IuiIcons.filter(item => item.includes(iconName.value))
}

function selectedIcon(name: string) {
  emit('selected', name)
  document.body.click()
}

function reset() {
  iconName.value = ''
  iconList.value = IuiIcons
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
        <UnoIcon :name="item" :size="14" />
        <span class="m-l-10px vertical-middle">{{ item }}</span>
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
      //line-height: 30px;
      //margin-bottom: -5px;
      cursor: pointer;
      width: 33%;
      float: left;
    }

    span {
      display: inline-block;
      //vertical-align: -0.15em;
      fill: currentColor;
      overflow: hidden;
    }
  }
}
</style>
