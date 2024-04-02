<script lang="ts"  setup>
import { useI18n } from 'vue-i18n'

import { ref } from 'vue'
import type { MessageSchema } from '@/i18n'

defineOptions({ name: 'RightToolBar' })

const emits = defineEmits(['queryTable'])
const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
// 搜索

const showSearch = defineModel('showSearch', { type: Boolean, default: true })
const spin = ref(false)
// 刷新
function refresh() {
  spin.value = true
  emits('queryTable')
  setTimeout(() => spin.value = false, 1000)
}
</script>

<template>
  <div class="top-right-btn">
    <a-row>
      <a-space size="large">
        <a-popover position="top">
          <template #content>
            {{ showSearch
              ? t('common.hidden') + t('common.search')
              : t('common.show') + t('common.search') }}
          </template>
          <a-button shape="circle">
            <icon-search @click="showSearch = !showSearch" />
          </a-button>
        </a-popover>
        <a-popover position="top">
          <template #content>
            {{ t('common.reFresh') }}
          </template>
          <a-button shape="circle">
            <icon-sync :spin="spin" @click="refresh()" />
          </a-button>
        </a-popover>
      </a-space>
    </a-row>
  </div>
</template>

<style lang="scss" scoped>
.top-right-btn {
  margin-left: auto;
  margin-right: 20px;
}
</style>
