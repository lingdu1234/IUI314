<template>
   <div class="app-container">
      <el-row :gutter="20">
         <el-col :span="8" :xs="24" >
            <el-card class="box-card">
               <template v-slot:header>
                 <div class="clearfix">
                   <span>个人信息</span>
                 </div>
               </template>
               <div>
                  <div class="text-center">
                     <userAvatar  />
                  </div>
                  <ul class="list-group list-group-striped">
                     <li class="list-group-item">
                        <svg-icon icon-class="user" />用户名称
                        <div class="pull-right">{{ state.user.user_name }}</div>
                     </li>
                     <li class="list-group-item">
                        <svg-icon icon-class="phone" />手机号码
                        <div class="pull-right">{{ state.user.phone_num }}</div>
                     </li>
                     <li class="list-group-item">
                        <svg-icon icon-class="email" />用户邮箱
                        <div class="pull-right">{{ state.user.user_email }}</div>
                     </li>
                     <li class="list-group-item">
                        <svg-icon icon-class="tree" />所属部门
                        <div class="pull-right" v-if="state.user.dept">{{ state.user.dept.dept_name }} / {{ state.postGroup }}</div>
                     </li>
                     <li class="list-group-item">
                        <svg-icon icon-class="peoples" />所属角色
                        <div class="pull-bottom"><el-tag :type="v==roleOptions[state.user.role_id]?'':'info'" style="margin-left: 2px; margin-top: 3px;" v-for="v in state.roleGroup" :key="v">{{v}}</el-tag></div>
                     </li>
                     <li class="list-group-item">
                        <svg-icon icon-class="date" />创建日期
                        <div class="pull-right">{{ parseTime(state.user.created_at) }}</div>
                     </li>
                  </ul>
               </div>
            </el-card>
         </el-col>
         <el-col :span="16" :xs="24">
            <el-card>
               <template v-slot:header>
                 <div class="clearfix">
                   <span>基本资料</span>
                 </div>
               </template>
               <el-tabs v-model="activeTab">
                  <el-tab-pane label="基本资料" name="userinfo">
                     <userInfo :user="state.user" />
                  </el-tab-pane>
                  <el-tab-pane label="修改密码" name="resetPwd">
                     <resetPwd />
                  </el-tab-pane>
               </el-tabs>
            </el-card>
         </el-col>
      </el-row>
   </div>
</template>

<script setup name="Profile">
import userAvatar from "./userAvatar";
import userInfo from "./userInfo";
import resetPwd from "./resetPwd";
import { listPost } from '@/api/system/post';
import { listRole } from '@/api/system/role';
import { getUserProfile } from "@/api/system/user";

const activeTab = ref("userinfo");
const postOptions = ref({});
const roleOptions = ref([]);
const state = reactive({
  user: {},
  roleGroup: [],
  postGroup: "",
});

async function get_options() {
  let queryParams = {
    page_num: 1,
    page_size: Number.MAX_SAFE_INTEGER,
  };
  const { list: posts } = await listPost(queryParams);
  const { list: roles } = await listRole(queryParams);
  posts.forEach(ele => {
     postOptions.value[ele.post_id] = ele.post_name;
  });
  roles.forEach(ele => {
     roleOptions.value[ele.role_id] = ele.role_name;
  });;
}

async function getUser() {
  await get_options();
  getUserProfile().then(response => {
    state.user = response.user_info;
    state.roleGroup = response.role_ids.map(ele => roleOptions.value[ele]);
    state.postGroup = response.post_ids.map(ele => postOptions.value[ele]).join(",");
  });
};
getUser();
</script>
