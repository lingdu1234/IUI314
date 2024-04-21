<script lang="ts"  setup>
import Icon404 from '@/components/exception/Icons/icon404.vue'
import Exception from '@/components/exception/exception.vue'
</script>

<template>
  <Exception>
    <template #exceptionIcon>
      <Icon404 class="w-500px h-500px" />
    </template>
  </Exception>
</template>
