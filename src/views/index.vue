<template>
  <div class="app-container home">
    <el-row :gutter="2">
      <el-col :sm="24" :lg="12">
          <el-card style="margin: 10px">
            <template #header>
              <div class="card-header">
                <span style="font-size: 22px; font-weight: bold; color: red"
                  >LingDu后台管理框架</span
                >
              </div>
            </template>
            <el-col style="padding-left: 10px">
              <h4><b>请无随意修改配置选项</b></h4>
            <h3><b>简介</b></h3>
              <p>
                以 若依Vue3 作为前端基础开发的，后端以poem为框架进行开发；
                目标是简单实用的单机程序，缓存采用本机内存缓存，不采用redis缓存，
              </p>
              <h3><b>技术依赖</b></h3>
              后端语言：<a href="https://www.rust-lang.org/">rust</a> <br/>
              后端框架：<a href="https://github.com/poem-web/poem">poem</a> <br/>
              <br/>
              前端框架：<a href="https://vuejs.org/">vue</a> <br/>
              基础框架：<a href="https://github.com/yangzongzhuan/RuoYi-Vue3">若依Vue3</a>
              <p>
                <b>当前版本:</b> <span>v{{ version }}</span>
              </p>
              <p></p>
              <p>
                <el-button
                  type="primary"
                  icon="Cloudy"
                  plain
                  @click="
                    goTarget('https://github.com/yangzongzhuan/RuoYi-Vue3')
                  "
                  >访问 若依Vue3</el-button
                >
                <el-button
                  icon="HomeFilled"
                  plain
                  @click="goTarget('https://github.com/poem-web/poem')"
                  >访问 Poem</el-button
                >
              </p>
            </el-col>
          </el-card>
      </el-col>

      <el-col :sm="24" :lg="12">
        <el-card style="margin: 10px; min-height: calc(100vh - 110px)">
          <template #header>
            <div class="card-header">
              <span style="font-size: 22px; font-weight: bold; color: red"
                >更新日志</span
              >
              <el-radio-group v-model="reverse" style="margin-left: 20px">
                <el-radio :label="true">倒序</el-radio>
                <el-radio :label="false">正序</el-radio>
              </el-radio-group>
              <el-button
              v-hasPermi="['system/update_log/add']"
                style="float: right; padding: 3px 0"
                type="text"
                @click="addUpdateLog"
                >添加
              </el-button>
            </div>
          </template>
          <el-timeline :reverse="reverse">
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="activity.id"
              :timestamp="activity.created_at"
              type="success"
              placement="top"
            >
              <el-card style="margin-right: 10px">
                <template #header>
                  <div class="card-header">
                    <span
                      ><span class="spanFont">标题: </span>{{ activity.title }}
                      <span class="spanFont">web版本: </span
                      >{{ activity.app_version }}
                      <span class="spanFont">后端版本: </span
                      >{{ activity.backend_version }}
                      <span class="spanFont">时间: </span
                      >{{ activity.updated_at }}</span
                    >
                    <el-button
                    v-hasPermi="['system/update_log/add']"
                      class="button"
                      type="text"
                      @click="editUpdateLog(activity)"
                      >编辑
                    </el-button>
                  </div>
                </template>
                <div>
                  <MdEditorV3
                    v-model="activity.content"
                    :previewOnly="true"
                  ></MdEditorV3>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>

    <!-- 添加或修改日志对话框 -->
    <el-dialog :title="title" v-model="open" width="1000px" append-to-body>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="标题" />
        </el-form-item>
        <el-form-item label="后端版本" prop="backend_version">
          <el-input v-model="form.backend_version" placeholder="后端版本号" />
        </el-form-item>
        <el-form-item label="web版本" prop="app_version">
          <el-input v-model="form.app_version" placeholder="web版本号" />
        </el-form-item>
        <el-form-item label="日志" prop="content">
          <MdEditorV3 v-model="form.content"></MdEditorV3>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Index">
import { getCurrentInstance,ref,watch,toRefs,reactive } from 'vue';
import {
  getAllUpdateInfo,
  addUpdateInfo,
  updateUpdateInfo,
} from '@/api/system/updateLog';
import MdEditorV3 from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

const { proxy } = getCurrentInstance();

const reverse = ref(true);
const open = ref(false);
const title = ref('');
const activities = ref([]);
const version = ref('');

watch(reverse, () => {
  activities.value.reverse();
});
const data = reactive({
  form: {
    title: '',
    app_version: '',
    backend_version: '',
    content: '',
  },

  rules: {
    app_version: [
      { required: true, message: '版本号不能为空', trigger: 'blur' },
    ],
    backend_version: [
      { required: true, message: '版本号不能为空', trigger: 'blur' },
    ],
    title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
    content: [{ required: true, message: '日志不能为空', trigger: 'blur' }],
  },
});

const { form, rules } = toRefs(data);

function goTarget(url) {
  window.open(url, '__blank');
}

async function get_all_update_info() {
  const list = await getAllUpdateInfo();
  version.value = list[0].app_version;
  activities.value = list;
}
function submitForm() {
  proxy.$refs['formRef'].validate((valid) => {
    if (valid) {
      console.log('first', form.value.id)
      if (form.value.id !== undefined) {
        updateUpdateInfo(form.value).then(async (response) => {
          proxy.$modal.msgSuccess('修改成功');
          open.value = false;
          await get_all_update_info();
        });
      } else {
        addUpdateInfo(form.value).then(async (response) => {
          proxy.$modal.msgSuccess('新增成功');
          open.value = false;
          await get_all_update_info();
        });
      }
    }
  });
}
function cancel() {
  form.value = {};
  open.value = false;
  title.value = '';
}
function addUpdateLog() {
  cancel();
  const v = activities.value[activities.value.length - 1];

  form.value.app_version = v.app_version;
  form.value.backend_version = v.backend_version;
  form.value.title = v.title;
  form.value.id = undefined;
  form.value.content = '### 后端  \n \n### 前端web  \n';
  open.value = false;
  title.value = '';
  open.value = true;
  title.value = '添加更新日志';
}
function editUpdateLog(v) {
  form.value.id = v.id;
  form.value.app_version = v.app_version;
  form.value.backend_version = v.backend_version;
  form.value.title = v.title;
  form.value.content = v.content;
  open.value = true;
  title.value = '编辑更新日志:' + form.value.title;
}
get_all_update_info();
</script>
<style scoped>
.spanFont {
  font-weight: bold;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
