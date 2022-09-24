<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="appStore.sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <breadcrumb v-if="!settingsStore.topNav" id="breadcrumb-container" class="breadcrumb-container" />
    <top-nav v-if="settingsStore.topNav" id="topmenu-container" class="topmenu-container" />

    <div class="right-menu">
      <template v-if="appStore.device !== 'mobile'">
        <header-search id="header-search" class="right-menu-item" />

        <el-tooltip content="源码地址" effect="dark" placement="bottom">
          <ruo-yi-git id="ruoyi-git" class="right-menu-item hover-effect" />
        </el-tooltip>

        <el-tooltip content="主题切换" effect="light" placement="bottom">
          <theme id="ruoyi-doc" class="right-menu-item hover-effect" />
        </el-tooltip>

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>
      </template>
      <div class="avatar-container">
        <el-dropdown class="right-menu-item hover-effect" trigger="click" @command="handleCommand">
          <div class="avatar-wrapper">
            <img :src="userStore.avatar" class="user-avatar">
            <el-icon><caret-bottom /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-popover placement="left-start" :width="width">
                <template #reference>
                  <span><el-dropdown-item>角色切换</el-dropdown-item></span>
                </template>
                <el-radio-group v-model="role_id" @change="roleChanged">
                  <el-row>
                    <el-col v-for="item in roleOptions" :key="item.role_id">
                      <el-radio :label="item.role_id" :value="item.role_id">
                        {{
                          item.role_name
                        }}
                      </el-radio>
                    </el-col>
                  </el-row>
                </el-radio-group>
              </el-popover>
              <el-popover placement="left-start" :width="width">
                <template #reference>
                  <span><el-dropdown-item>部门切换</el-dropdown-item></span>
                </template>
                <el-radio-group v-model="dept_id" @change="deptChanged">
                  <el-row>
                    <el-col v-for="item in deptOptions" :key="item.dept_id">
                      <el-radio :label="item.dept_id" :value="item.dept_id">
                        {{
                          (item.parent_id != '0'
                            ? deptMapOptions[item.parent_id] + '-'
                            : '') + item.dept_name
                        }}
                      </el-radio>
                    </el-col>
                  </el-row>
                </el-radio-group>
              </el-popover>
              <router-link to="/user/profile">
                <el-dropdown-item divided>
                  个人中心
                </el-dropdown-item>
              </router-link>
              <el-dropdown-item command="setLayout">
                <span>布局设置</span>
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElMessageBox } from "element-plus";
import { getCurrentInstance,ref } from "vue";

import { listDept } from "@/api/system/dept";
import { listRole } from "@/api/system/role";
import { changeUserDept,changeUserRole } from "@/api/system/user";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import HeaderSearch from "@/components/HeaderSearch";
import RuoYiGit from "@/components/RuoYi/Git";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
import Theme from "@/components/theme/index.vue";
import TopNav from "@/components/TopNav";
import useAppStore from "@/store/modules/app"
import useSettingsStore from "@/store/modules/settings"
import useUserStore from "@/store/modules/user"

const appStore = useAppStore()
const userStore = useUserStore()
const settingsStore = useSettingsStore()

const { proxy } = getCurrentInstance();

const role_id = ref(null);
const roleOptions = ref([]);
const dept_id = ref(null);
const deptOptions = ref([]);
const deptMapOptions = ref([]);
const width = ref(0);

async function get_options() {
  let queryParams = {
    page_num: 1,
    page_size: Number.MAX_SAFE_INTEGER,
  };
  const [{ list: roles }, { list: depts }] = await Promise.all([
    listRole(queryParams),
    listDept(queryParams),
  ]);
  const map = {};
  let max_length = 0;
  let r = roles.filter((item, _index, _arr) => {
    max_length = Math.max(max_length, item.role_name.length);
    return userStore.roles.includes(item.role_id);
  });
  let d = depts.filter((item, _index, _arr) => {
    map[item.dept_id] = item.dept_name;
    max_length = Math.max(max_length, item.dept_name.length);
    return userStore.depts.includes(item.dept_id);
  });
  width.value = max_length * 16 + 22;
  roleOptions.value = r;
  role_id.value = userStore.role;
  deptOptions.value = d;
  deptMapOptions.value = map;
  dept_id.value = userStore.dept;
}

get_options();

async function roleChanged(v) {
  await changeUserRole(userStore.uid, v);
  proxy.$modal.msgSuccess("角色切换成功,马上重载界面");

  setTimeout(() => {
    window.location.reload(false);
  }, 1000);
}

async function deptChanged(v) {
  await changeUserDept(userStore.uid, v);
  proxy.$modal.msgSuccess("部门切换成功,马上重载界面");

  setTimeout(() => {
    window.location.reload(false);
  }, 1000);
}
function toggleSideBar() {
  appStore.toggleSideBar()
}

function handleCommand(command) {
  switch (command) {
    case "setLayout":
      setLayout();
      break;
    case "logout":
      logout();
      break;
    default:
      break;
  }
}

function logout() {
  ElMessageBox.confirm("确定注销并退出系统吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    userStore.logOut().then(() => {
      location.href = "";
    })
  }).catch(() => { });
}

const emits = defineEmits(["setLayout"])
function setLayout() {
  emits("setLayout");
}
</script>

<style lang='scss' scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: flex;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 40px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        i {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
