<script lang="ts"  setup>
import Exception from './exception.vue'
import Icon403 from '@/components/exception/Icons/icon403.vue'
</script>

<template>
  <Exception>
    <template #exceptionIcon>
      <Icon403 class="w-500px h-500px" />
    </template>
  </Exception>
</template>
