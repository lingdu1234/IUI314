<template>
  <el-breadcrumb class="m-l-10px font-900" :separator-icon="ArrowRight">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="item in levelList" :key="item.path">
        <div class="no-redirect">
          <el-icon>
            <SvgIcon :name="item.meta! && item.meta.icon!" />
          </el-icon>
          <span class="m-l-5px">{{ item.meta.title }}</span>
        </div>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script lang="ts" setup name="breadcrumb">
import { ArrowRight } from '@element-plus/icons-vue';
import { ref, watchEffect } from 'vue';
import {
  type RouteLocationMatched,
  //   type RouteRecordRaw,
  useRoute,
  //   useRouter,
} from 'vue-router';

const route = useRoute();
// const router = useRouter();
const levelList = ref<RouteLocationMatched[]>([]);

function getBreadcrumb() {
  let matched = route.matched.filter((item) => item.meta && item.meta.title);

  levelList.value = matched.filter(
    (item) => item.meta && item.meta.title && item.meta.breadcrumb !== false
  );
  console.log('object :>> ', levelList.value);
}

// function handleLink(item: RouteLocationMatched) {
//   const { redirect, path } = item;
//   if (redirect) {
//     router.push(redirect as RouteRecordRaw);
//     return;
//   }
//   router.push(path);
// }

watchEffect(() => {
  if (route.path.startsWith('/redirect/')) {
    return;
  }
  getBreadcrumb();
});
getBreadcrumb();
</script>

<style lang="scss" scoped>
.no-redirect {
  color: #97a8be;
  cursor: text;
}
</style>
