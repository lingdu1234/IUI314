<script lang="ts" setup>
import Icon500 from '@/components/exception/Icons/icon500.vue'
import Exception from '@/components/exception/exception.vue'
</script>

<template>
  <Exception>
    <template #exceptionIcon>
      <Icon500 class="w-500px h-500px" />
    </template>
  </Exception>
</template>
