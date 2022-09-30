<template>
  <div>
    <el-container>
      <el-aside>
        <SideBar></SideBar>
      </el-aside>
      <el-container>
        <el-header>Header</el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script lang="ts" setup>
import SideBar from "./side-bar/index.vue";
</script>

<style lang="scss" scoped>
.el-aside {
  width: var(--sider-bar-width);
  background-color: var(--sider-bar-bg-color);
  color: var(--sider-bar-font-color);
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  justify-content: start;

  ul {
    background-color: rgb(235, 235, 235);
  }

  img {
    height: 32px;
    width: 32px;
    padding-left: 10px;
  }
}
.el-header {
  height: var(--header-bar-height);
  background-color: var(--header-bar-bg-color);
  color: var(--header-bar-font-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}
.el-main {
  background-color: var(--main-container-bg-color);
  color: var(--main-container-font-color);
  height: calc(100vh - var(--header-bar-height));
  padding: 0;
  overflow: hidden;

  .main-content {
    padding: 20px;
  }
}
</style>
