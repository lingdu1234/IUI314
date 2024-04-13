<script lang="ts" setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { ref, toRaw, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import type { MessageSchema } from '@/i18n'
import { useAppStore, usePermissionStore } from '@/stores'
import type { AppRouteRecordRaw } from '@/types/base/router'
import BreadcrumbDropdown from '@/components/layout/nav-bar/breadcrumb-dropdown.vue'
import IuiIcon from '@/components/svg-icon/iui-icon.vue'

defineOptions({ name: 'Breadcrumb' })

const appStore = useAppStore()
const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
const route = useRoute()
const levelList = ref<AppRouteRecordRaw[]>()

const pRoute = usePermissionStore().getPermissionRoutes

function getTarget(pathList: string[], route: AppRouteRecordRaw[], index: number = 0, result: AppRouteRecordRaw[] = []) {
  if (index < pathList.length) {
    const r = route.find(item => item.name === pathList[index])
    if (r)
      result.push(r)
    if (r?.children)
      route = r.children
    getTarget(pathList, route, index + 1, result)
  }
  return result
}
function getBreadcrumbX() {
  const path = route.matched[1].path
  const pathList = path.split('/').filter(item => item !== '')
  const rt = toRaw(pRoute)
  levelList.value = getTarget(pathList, rt)
}

watchEffect(() => {
  if (route.path.startsWith('/redirect/'))
    return
  getBreadcrumbX()
})
</script>

<template>
  <a-breadcrumb class="m-l-10px font-900" :separator-icon="ArrowRight">
    <template #separator>
      <IconRight />
    </template>
    <a-breadcrumb-item v-for="item in levelList" :key="item.path">
      <div class="no-redirect">
        <IuiIcon :name="item.meta && item.meta.icon || ''" />

        <span v-if="!appStore.device.isMobile" class="m-l-5px">
          <template v-if="!item.children || item.children.length === 0">
            {{
              item.meta
                ? (item.meta.i18n && item.meta.i18n !== ''
                  ? t(`route.${item.meta.i18n}`)
                  : item.meta.title)
                : item.name

            }}
          </template>
          <template v-else>
            <BreadcrumbDropdown :list="item" />
            <!--            <a-dropdown trigger="hover"> -->
            <!--              <span> -->
            <!--                {{ -->
            <!--                  item.meta -->
            <!--                    ? (item.meta.i18n && item.meta.i18n !== '' -->
            <!--                      ? t(`route.${item.meta.i18n}`) -->
            <!--                      : item.meta.title) -->
            <!--                    : item.name -->

            <!--                }} -->
            <!--              </span> -->
            <!--              <template #content> -->
            <!--                <div v-for="child in item.children" :key="child.path"> -->
            <!--                  <a-doption v-if="!child.children || child.children.length === 0"> -->
            <!--                    <span @click="router.push({ name: child.name })"> -->
            <!--                      {{ -->
            <!--                        child.meta -->
            <!--                          ? (child.meta.i18n && child.meta.i18n !== '' -->
            <!--                            ? t(`route.${child.meta.i18n}`) -->
            <!--                            : child.meta.title) -->
            <!--                          : child.name -->
            <!--                      }} -->
            <!--                    </span> -->
            <!--                  </a-doption> -->
            <!--                  <a-dsubmenu v-else trigger="hover"> -->
            <!--                    <template #default> -->
            <!--                      {{ -->
            <!--                        child.meta -->
            <!--                          ? (child.meta.i18n && child.meta.i18n !== '' -->
            <!--                            ? t(`route.${child.meta.i18n}`) -->
            <!--                            : child.meta.title) -->
            <!--                          : child.name -->

            <!--                      }} -->
            <!--                    </template> -->
            <!--                    <template #content> -->
            <!--                      <a-doption v-for="it in child.children" :key="it.path"> -->
            <!--                        <span @click="router.push({ name: it.name })"> -->
            <!--                          {{ -->
            <!--                            it.meta -->
            <!--                              ? (it.meta.i18n && it.meta.i18n !== '' -->
            <!--                                ? t(`route.${it.meta.i18n}`) -->
            <!--                                : it.meta.title) -->
            <!--                              : it.name -->

            <!--                          }} -->
            <!--                        </span> -->
            <!--                      </a-doption> -->
            <!--                    </template> -->
            <!--                  </a-dsubmenu> -->
            <!--                </div> -->
            <!--              </template> -->
            <!--            </a-dropdown> -->

          </template>
        </span>
      </div>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<style lang="scss" scoped>
.no-redirect {
  color: #97a8be;
  cursor: pointer;
}
</style>
