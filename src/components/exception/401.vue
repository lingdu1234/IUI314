<script lang="ts"  setup>
import Exception from './exception.vue'
import Icon401 from '@/components/exception/Icons/icon401.vue'
</script>

<template>
  <Exception>
    <template #exceptionIcon>
      <Icon401 class="w-500px h-500px" />
    </template>
  </Exception>
</template>
