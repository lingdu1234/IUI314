<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="任务名称" prop="job_name">
        <el-input
          v-model="queryParams.job_name"
          placeholder="请输入任务名称"
          clearable
          size="small"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="任务组名" prop="job_group">
        <el-select
          v-model="queryParams.job_group"
          placeholder="请选择任务组名"
          clearable
        >
          <el-option
            v-for="dict in sys_job_group"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="任务状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择任务状态"
          clearable
        >
          <el-option
            v-for="dict in sys_job_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" size="mini" @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="Refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['monitor:job:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['monitor:job:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['monitor:job:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['monitor:job:export']"
          >导出</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="Operation"
          size="mini"
          @click="handleJobLog"
          v-hasPermi="['monitor:job:query']"
          >日志</el-button
        >
      </el-col>
      <el-col :span="1.5">
<el-checkbox border v-model="fresh_enabled" label="自动刷新" size="mini" @change="fresh_option_changed"></el-checkbox>
      </el-col>
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="jobList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="任务ID"
        width="100"
        align="center"
        show-overflow-tooltip
      >
        <template #default="scope">
          <el-tag type="warning" @click="handleJobLog(scope.row)"
            ><el-link type="warning">{{ scope.row.task_id }}</el-link></el-tag
          >
        </template>
      </el-table-column>
      <el-table-column
        label="任务名称"
        align="center"
        prop="job_name"
        :show-overflow-tooltip="true"
      >
        <template #default="scope">
          <el-link type="success" @click="handleView(scope.row)">{{
            scope.row.job_name
          }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="任务组名" align="center" prop="job_group">
        <template #default="scope">
          <dict-tag :options="sys_job_group" :value="scope.row.job_group" />
        </template>
      </el-table-column>
      <el-table-column
        label="调用目标字符串"
        align="center"
        prop="invoke_target"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="cron执行表达式"
        align="center"
        prop="cron_expression"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="下次执行时间"
        align="center"
        :show-overflow-tooltip="true"
      >
        <template #default="scope">
          <span v-if="scope.row.status == '0'">任务未运行</span>
          <span v-else>{{ scope.row.next_time }}</span>
        </template>
      </el-table-column>
            <el-table-column
        label="批次数"
        align="center"
        :show-overflow-tooltip="true"
      >
        <template #default="scope">
          <span v-if="scope.row.task_count == '0'">无限</span>
          <span v-else>{{ scope.row.task_count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="1"
            inactive-value="0"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <!-- <el-table-column label="状态" align="center">
        <template #default="scope">
          <el-icon color="green" v-if="scope.row.status == 0" :size="900"
            ><video-play
          /></el-icon>
          <el-icon v-else-if="scope.row.status == 1"><video-pause /></el-icon>
        </template>
      </el-table-column> -->
      <el-table-column
        label="操作"
        align="center"
        width="200"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button
            size="mini"
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['monitor:job:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['monitor:job:remove']"
            >删除</el-button
          >
          <el-dropdown
            size="mini"
            @command="(command) => handleCommand(command, scope.row)"
          >
            <span
              class="el-dropdown-link"
              v-hasPermi="['monitor:job:changeStatus', 'monitor:job:query']"
            >
              <i class="el-icon-d-arrow-right el-icon--right"></i>更多
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  command="handleRun"
                  icon="CaretRight"
                  v-hasPermi="['monitor:job:changeStatus']"
                  >执行一次</el-dropdown-item
                >
                <el-dropdown-item
                  command="handleView"
                  icon="View"
                  v-hasPermi="['monitor:job:query']"
                  >任务详细</el-dropdown-item
                >
                <el-dropdown-item
                  command="handleJobLog"
                  icon="Operation"
                  v-hasPermi="['monitor:job:query']"
                  >调度日志</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.page_num"
      v-model:limit="queryParams.page_size"
      @pagination="getList"
    />

    <!-- 添加或修改定时任务对话框 -->
    <el-dialog :title="title" v-model="open" width="800px" append-to-body>
      <el-form ref="jobRef" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="任务名称" prop="job_name">
              <el-input v-model="form.job_name" placeholder="请输入任务名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务分组" prop="job_group">
              <el-select v-model="form.job_group" placeholder="请选择">
                <el-option
                  v-for="dict in sys_job_group"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="invoke_target">
              <template #label>
                <span>
                  调用方法
                  <el-tooltip placement="top">
                    <template #content>
                      <div>
                        Bean调用示例：ryTask.ryParams('ry')
                        <br />Class类调用示例：com.ruoyi.quartz.task.RyTask.ryParams('ry')
                        <br />参数说明：支持字符串，布尔类型，长整型，浮点型，整型
                      </div>
                    </template>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </span>
              </template>
              <el-input
                v-model="form.invoke_target"
                placeholder="请输入调用目标字符串"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item prop="task_count">
              <template #label>
                <span>
                  运行次数
                  <el-tooltip placement="top">
                    <template #content>
                      <div>
                        运行次数：
                        <br />0 -> 无限循环运行 <br />n -> 循环运行n次
                      </div>
                    </template>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </span>
              </template>
              <el-input-number
                v-model="form.task_count"
                controls-position="right"
                :min="0"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="job_params">
              <template #label>
                <span>
                  调用参数
                  <el-tooltip placement="top">
                    <template #content>
                      <div>
                        调用参数,均为字符串，
                        <br />基础类型：字符串，布尔类型，长整型，浮点型，整型
                        <br />复查类型：json字符串 {"a":11,"b":"你好"}
                      </div>
                    </template>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </span>
              </template>
              <el-input
                v-model="form.job_params"
                placeholder="请输入调用参数"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="task_id">
              <template #label>
                <span>
                  任务ID
                  <el-tooltip placement="top">
                    <template #content>
                      <div>
                        任务ID,非常重要，请谨慎修改
                        <br />整数类型 <br />为任务运行时的唯一标识
                      </div>
                    </template>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </span>
              </template>
              <el-input-number
                v-model="form.task_id"
                controls-position="right"
                :min="0"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="cron表达式" prop="cron_expression">
              <el-input
                v-model="form.cron_expression"
                placeholder="请输入cron执行表达式"
              >
                <template #append>
                  <el-button type="primary" @click="handleShowCron">
                    生成表达式
                    <i class="el-icon-time el-icon--right"></i>
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="执行策略" prop="misfire_policy">
              <el-radio-group v-model="form.misfire_policy" size="small">
                <el-radio-button label="1">立即执行</el-radio-button>
                <el-radio-button label="2">执行一次</el-radio-button>
                <el-radio-button label="3">放弃执行</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="是否并发" prop="concurrent">
              <el-radio-group v-model="form.concurrent" size="small">
                <el-radio-button label="0">允许</el-radio-button>
                <el-radio-button label="1">禁止</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio-button
                  v-for="dict in sys_job_status"
                  :key="dict.value"
                  :label="dict.value"
                  >{{ dict.label }}</el-radio-button
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 任务日志详细 -->
    <el-dialog title="任务详细" v-model="openView" width="700px" append-to-body>
      <el-form :model="form" label-width="120px" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label="任务ID：">{{ form.task_id }}</el-form-item>
            <el-form-item label="任务名称：">{{ form.job_name }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务分组：">{{
              job_groupFormat(form)
            }}</el-form-item>
            <el-form-item label="创建时间：">{{
              form.created_at
            }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="cron表达式：">{{
              form.cron_expression
            }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="执行次数">{{ form.task_count }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上次执行时间：">{{
              parseTime(form.last_time)
            }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="调用目标方法：">{{
              form.invoke_target
            }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="下次执行时间：">{{
              parseTime(form.next_time)
            }}</el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="调用目标参数：">{{
              form.job_params
            }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务状态：">
              <div v-if="form.status == 1">正常</div>
              <div v-else-if="form.status == 0">暂停</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否并发：">
              <div v-if="form.concurrent == 1">允许</div>
              <div v-else-if="form.concurrent == 0">禁止</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="执行策略：">
              <div v-if="form.misfire_policy == 0">默认策略</div>
              <div v-else-if="form.misfire_policy == 1">立即执行</div>
              <div v-else-if="form.misfire_policy == 2">执行一次</div>
              <div v-else-if="form.misfire_policy == 3">放弃执行</div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注：">{{ form.remark }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="openView = false">关 闭</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- Cron表达式生成器 对话框 -->
    <!-- <el-dialog title="Cron表达式生成器" :visible.sync="openCron" append-to-body destroy-on-close class="scrollbar">
      <crontab @hide="openCron=false" @fill="crontabFill" :expression="expression"></crontab>
    </el-dialog> -->
  </div>
</template>

<script setup name="Job">
import {
  listJob,
  getJob,
  delJob,
  addJob,
  updateJob,
  runJob,
  changeJobStatus,
} from '@/api/monitor/job';

const router = useRouter();
const { proxy } = getCurrentInstance();
const { sys_job_group, sys_job_status } = proxy.useDict(
  'sys_job_group',
  'sys_job_status'
);

const jobList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const names = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref('');
const openView = ref(false);
const openCron = ref(false);
const expression = ref('');
const fresh_enabled = ref(false);
const timer = ref(null);

const data = reactive({
  form: {},
  queryParams: {
    page_num: 1,
    page_size: 10,
    job_name: undefined,
    job_group: undefined,
    status: undefined,
  },
  rules: {
    job_name: [
      { required: true, message: '任务名称不能为空', trigger: 'blur' },
    ],
    invoke_target: [
      { required: true, message: '调用目标字符串不能为空', trigger: 'blur' },
    ],
    cron_expression: [
      { required: true, message: 'cron执行表达式不能为空', trigger: 'blur' },
    ],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询定时任务列表 */
function getList() {
  loading.value = true;
  listJob(queryParams.value).then((response) => {
    jobList.value = response.list;
    total.value = response.total;
    loading.value = false;
  });
}
/** 任务组名字典翻译 */
function job_groupFormat(row, column) {
  return proxy.selectDictLabel(sys_job_group.value, row.job_group);
}
/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}
/** 表单重置 */
function reset() {
  form.value = {
    job_id: undefined,
    job_name: undefined,
    job_group: undefined,
    invoke_target: undefined,
    cron_expression: undefined,
    misfire_policy: '1',
    task_count: 0,
    task_id: 0,
    concurrent: '1',
    status: '0',
  };
  proxy.resetForm('jobRef');
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.page_num = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm('queryRef');
  handleQuery();
}
// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.job_id);
  names.value = selection.map((item) => item.job_name);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}
// 更多操作触发
function handleCommand(command, row) {
  switch (command) {
    case 'handleRun':
      handleRun(row);
      break;
    case 'handleView':
      handleView(row);
      break;
    case 'handleJobLog':
      handleJobLog(row);
      break;
    default:
      break;
  }
}
// 任务状态修改
function handleStatusChange(row) {
  let text = row.status === '1' ? '启用' : '停用';
  const status = row.status;
  const job_id = row.job_id;
  proxy.$modal
    .confirm('确认要"' + text + '""' + row.job_name + '"任务吗?')
    .then(function () {
      return changeJobStatus({ job_id, status });
    })
    .then(() => {
      proxy.$modal.msgSuccess(text + '成功');
    })
    .catch(function () {
      row.status = row.status === '0' ? '1' : '0';
    });
}
/* 立即执行一次 */
function handleRun(row) {
  proxy.$modal
    .confirm('确认要立即执行一次"' + row.job_name + '"任务吗?')
    .then(function () {
      return runJob(row.job_id, row.task_id);
    })
    .then(() => {
      proxy.$modal.msgSuccess('执行成功');
    })
    .catch(() => {});
}
/** 任务详细信息 */
function handleView(row) {
  const job_id = row.job_id;
  getJob({ job_id }).then((response) => {
    form.value = response;
    openView.value = true;
  });
}
/** cron表达式按钮操作 */
function handleShowCron() {
  expression.value = form.value.cron_expression;
  openCron.value = true;
}
/** 确定后回传值 */
function crontabFill(value) {
  form.value.cron_expression = value;
}
/** 任务日志列表查询 */
function handleJobLog(row) {
  const job_id = row.job_id || 0;
  const rand_key = new Date().getTime();
  router.push({ path: '/monitor/job-log/index/' + job_id + '/' + rand_key });
}
/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = '添加任务';
}
/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const job_id = row.job_id || ids.value[0];
  getJob({ job_id }).then((response) => {
    form.value = response;
    open.value = true;
    title.value = '修改任务';
  });
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs['jobRef'].validate((valid) => {
    if (valid) {
      if (form.value.job_id != undefined) {
        updateJob(form.value).then((response) => {
          proxy.$modal.msgSuccess('修改成功');
          open.value = false;
          getList();
        });
      } else {
        addJob(form.value).then((response) => {
          proxy.$modal.msgSuccess('新增成功');
          open.value = false;
          getList();
        });
      }
    }
  });
}
/** 删除按钮操作 */
function handleDelete(row) {
  const job_ids = row.job_id ? [row.job_id] : ids.value;
  const job_names = row.job_id ? [row.job_name] : names.value;
  proxy.$modal
    .confirm('是否确认删除定时任务名称为"' + job_names + '"的数据项?')
    .then(function () {
      return delJob({ job_ids });
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess('删除成功');
    })
    .catch(() => {});
}

function fresh_option_changed(v){
  if(v){
    proxy.timer = setInterval(() => {
       setTimeout(getList, 0)
   }, 1000*5)
  }else{
    clearInterval(proxy.timer)
    timer.value = null
  }
}
/** 导出按钮操作 */
function handleExport() {
  proxy.download(
    'monitor/job/export',
    {
      ...queryParams.value,
    },
    `job_${new Date().getTime()}.xlsx`
  );
}

getList();
</script>
