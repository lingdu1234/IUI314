<template>
  <div>
    <el-icon @click="toggle">
      <SvgIcon :name="isFullscreen ? 'fullscreen-exit' : 'fullscreen'" />
    </el-icon>
  </div>
</template>

<script lang="ts" setup name="screen-full">
import { useFullscreen } from '@vueuse/core';

import SvgIcon from '../common/svg-icon.vue';

const { isFullscreen, toggle } = useFullscreen();
</script>
