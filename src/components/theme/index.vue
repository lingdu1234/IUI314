<template>
  <div>
    <el-icon v-if="colorMode == 'dark'" @click="nextColor()">
      <Moon />
    </el-icon>
    <el-icon v-if="colorMode == 'light'" @click="nextColor()">
      <Sunny />
    </el-icon>
    <el-icon v-if="colorMode == 'classic'" @click="nextColor()">
      <QuartzWatch />
    </el-icon>
  </div>
</template>
  
  <script setup>
    import { Moon, QuartzWatch,Sunny } from "@element-plus/icons-vue";

    import useTheme from "@/hooks/useTheme";


    const { colorMode, nextColor } = useTheme();
    


  
  </script>
  
  <style lang='scss' scoped>
  .screenfull-svg {
    display: inline-block;
    cursor: pointer;
    fill: #5a5e66;
    width: 20px;
    height: 20px;
    vertical-align: 10px;
  }
  </style>