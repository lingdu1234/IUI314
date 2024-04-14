<script lang="ts" setup>
import { ref } from 'vue'

import { useIuiIcons } from '@/components/svg-icon/useIuiIcons'
import IuiIcon from '@/components/svg-icon/iui-icon.vue'

defineOptions({ name: 'IuIconSelect' })

const iconName = ref('')

const currentIcon = defineModel<string>('currentIcon', { default: '' })

const { IuiIcons } = useIuiIcons()

const iconList = ref(IuiIcons)
function filterIcons() {
  iconList.value = IuiIcons
  if (iconName.value)
    iconList.value = IuiIcons.filter(item => item.includes(iconName.value))
}
function reset() {
  iconName.value = ''
  iconList.value = IuiIcons
}
function selectedIcon(name: string) {
  currentIcon.value = name
}
</script>

<template>
  <a-popover position="bottom">
    <a-input
      v-model="currentIcon"
      placeholder="点击选择图标"
      readonly
    >
      <template #prefix>
        <IuiIcon :name="currentIcon" />
      </template>
    </a-input>
    <template #content>
      <a-input
        v-model="iconName"
        placeholder="图标搜索"
        allow-clear
        @clear="reset"
        @input="filterIcons"
      >
        <template #prefix>
          <IconSearch />
        </template>
      </a-input>
      <a-scrollbar style="max-height: 300px;overflow: auto;">
        <a-grid :cols="3">
          <a-grid-item
            v-for="(item, index) in iconList"
            :key="index"
            class="cursor-pointer m-2px"
          >
            <a-tooltip :content="item">
              <div class="w-150px whitespace-nowrap overflow-x-hidden text-ellipsis" @click="selectedIcon(item)">
                <IuiIcon :name="item" :size="14" />
                <span class="m-l-8px vertical-middle">{{ item }}</span>
              </div>
            </a-tooltip>
          </a-grid-item>
        </a-grid>
      </a-scrollbar>
    </template>
  </a-popover>
</template>
