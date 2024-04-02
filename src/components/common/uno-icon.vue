<!--
 * 采用了一个奇怪的方案,将所有svg都放到public下的icons文件夹下
 * 打包时直接将public下的文件作为静态文件打包
 * 子文件夹c下为彩色图表
 * 其他文件夹下都为单色图标,一般就一个s文件夹即可
 * 单色图表可以使用fill设置颜色，默认为currentColor
 * 使用图标时直接将路径填入name即可
-->
<script setup lang="ts">
import { computed, defineOptions } from 'vue'

defineOptions({ name: 'UnoIcon' })
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    default: 16,
  },
  fill: {
    type: String,
    default: 'currentColor',
  },
})
const iconSize = computed(() => `${props.size}px`)
const iconName = computed(() => `url(/icons/${props.name}.svg)`)
const fill = computed(() => props.fill)
const isColorIcon = computed(() => props.name?.startsWith('c'))
</script>

<template>
  <span :class="isColorIcon ? 'color-icon' : 'mask-icon'" class="display-class" />
</template>

<style scoped lang="scss">
.display-class{
  display: inline-block;
  width: v-bind(iconSize);
  height: v-bind(iconSize);
}
.mask-icon {
  /* Add background color */
  background-color: v-bind(fill);
  /* Add mask image, use variable to reduce duplication */
  --svg: v-bind(iconName);
  -webkit-mask-image: var(--svg);
  mask-image: var(--svg);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
}
.color-icon {
  content: v-bind(iconName);
  background-color: transparent;
}
</style>
