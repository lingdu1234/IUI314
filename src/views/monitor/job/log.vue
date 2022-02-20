<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="任务组名" prop="job_group">
        <el-select
          v-model="queryParams.job_group"
          placeholder="请任务组名"
          clearable

          style="width: 240px"
          @change="job_group_changed"
        >
          <el-option
            v-for="dict in sys_job_group"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="任务名称" prop="job_name">
        <el-select
          v-model="queryParams.job_name"
          placeholder="请输入任务名称"
          clearable

          style="width: 240px"
          @change="getList"
        >
          <el-option
            v-for="dict in jobs"
            :key="dict.job_id"
            :label="dict.job_name"
            :value="dict.job_name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="执行状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择执行状态"
          clearable

          style="width: 240px"
        >
          <el-option
            v-for="dict in sys_common_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="任务属性" prop="is_once">
        <el-select
          v-model="queryParams.is_once"
          placeholder="请选择任务属性"
          clearable

          style="width: 240px"
        >
          <el-option
            v-for="dict in sys_task_is_once"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="执行时间">
        <el-date-picker
          v-model="dateRange"

          style="width: 240px"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search"   @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="Refresh"   @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

     <el-row :gutter="10" class="mb8" style="height: 35px;">
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"

          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['monitor:job:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"

          @click="handleClean"
          v-hasPermi="['monitor:job:remove']"
          >清空</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"

          @click="handleExport"
          v-hasPermi="['monitor:job:export']"
          >导出</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Close"

          @click="handleClose"
          >关闭</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-checkbox
          border
          v-model="fresh_enabled"
          label="自动刷新"

          @change="fresh_option_changed"
        ></el-checkbox>
      </el-col>
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="jobLogList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="日志编号"
        width="80"
        align="center"
        prop="job_log_id"
        show-overflow-tooltip
      />
      <el-table-column
        label="任务名称"
        align="center"
        prop="job_name"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="任务组名"
        align="center"
        prop="job_group"
        :show-overflow-tooltip="true"
      >
        <template #default="scope">
          <dict-tag :options="sys_job_group" :value="scope.row.job_group" />
        </template>
      </el-table-column>
      <el-table-column
        label="批ID"
        align="center"
        prop="lot_id"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="批内序"
        align="center"
        prop="lot_order"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="调用目标字符串"
        align="center"
        prop="invoke_target"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="日志信息"
        align="center"
        prop="job_message"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="执行状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="sys_common_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="任务属性" align="center" prop="is_once">
        <template #default="scope">
          <dict-tag :options="sys_task_is_once" :value="scope.row.is_once" />
        </template>
      </el-table-column>
      <el-table-column
        label="执行时间"
        align="center"
        prop="created_at"
        width="180"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.created_at) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button

            type="text"
            icon="View"
            @click="handleView(scope.row)"
            v-hasPermi="['monitor:job:query']"
            >详细</el-button
          >
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

    <!-- 调度日志详细 -->
    <el-dialog title="调度日志详细" v-model="open" width="700px" append-to-body>
      <el-form :model="form" label-width="100px"  >
        <el-row>
          <el-col :span="12">
            <el-form-item label="日志序号：">
              <el-tooltip
                class="box-item"
                effect="dark"
                :content="form.job_log_id"
                placement="top-start"
              >
                <span> {{ form.job_log_id.slice(0, 10) + ' ...' }}</span>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务分组："
              ><dict-tag :options="sys_job_group" :value="form.job_group"
            /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务名称：">{{ form.job_name }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="执行时间：">{{
              form.created_at
            }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="执行状态：">
              <dict-tag :options="sys_common_status" :value="form.status" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务属性：">
              <dict-tag :options="sys_task_is_once" :value="form.is_once" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="调用方法：">{{
              form.invoke_target
            }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="消耗时间：">{{
              form.elapsed_time + ' ms'
            }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="调用参数：">{{
              form.job_params
            }}</el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="日志信息：">{{
              form.job_message
            }}</el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="异常信息：" v-if="form.status == 1">{{
              form.exception_info
            }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="open = false">关 闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="JobLog">
import { onActivated, onDeactivated } from 'vue';
import { getJob, listJob } from '@/api/monitor/job';
import { listJobLog, delJobLog, cleanJobLog } from '@/api/monitor/jobLog';

const { proxy } = getCurrentInstance();
const { sys_common_status, sys_job_group, sys_task_is_once } = proxy.useDict(
  'sys_common_status',
  'sys_job_group',
  'sys_task_is_once'
);

const jobLogList = ref([]);
const open = ref(false);
const jobId = ref('');
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const multiple = ref(true);
const total = ref(0);
const dateRange = ref([]);
const route = useRoute();
const fresh_enabled = ref(false);
const timer = ref(null);
const jobs = ref([]);
const jobs_map = ref({});

onActivated(() => {
  init();
  fresh_option_changed(fresh_enabled.value);
});
onDeactivated(() => {
  clearInterval(proxy.timer);
  timer.value = null;
});

const data = reactive({
  form: {},
  queryParams: {
    page_num: 1,
    page_size: 10,
    is_once: undefined,
    job_name: undefined,
    job_group: undefined,
    status: undefined,
  },
});

const { queryParams, form } = toRefs(data);

/** 查询调度日志列表 */
function getList() {
  loading.value = true;
  listJobLog(proxy.addDateRange(queryParams.value, dateRange.value)).then(
    (response) => {
      jobLogList.value = response.list;
      total.value = response.total;
      loading.value = false;
    }
  );
}
// 返回按钮
function handleClose() {
  proxy.$router.back();
  proxy.$tab.closeOpenPage();
  //   const obj = { path: "/monitor/job" };
  //   proxy.$tab.closeOpenPage(obj);
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.page_num = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = [];
  proxy.resetForm('queryRef');
  handleQuery();
}
// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.job_log_id);
  multiple.value = !selection.length;
}
/** 详细按钮操作 */
function handleView(row) {
  open.value = true;
  form.value = row;
}
/** 删除按钮操作 */
function handleDelete(row) {
  let job_log_ids = row.job_log_id ? [row.job_log_id] : ids.value;
  const msg = '';
  proxy.$modal
    .confirm('是否确认删除调度日志编号为"' + job_log_ids + '"的数据项?')
    .then(function () {
      return delJobLog({ job_log_ids });
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess('删除成功');
    })
    .catch(() => {});
}
/** 清空按钮操作 */
function handleClean() {
  let job_id = jobId.value;
  proxy.$modal
    .confirm('是否确认清空当前任务调度日志数据项?')
    .then(function () {
      return cleanJobLog({ job_id });
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess('清空成功');
    })
    .catch(() => {});
}

function fresh_option_changed(v) {
  if (v) {
    proxy.timer = setInterval(() => {
      setTimeout(getList, 0);
    }, 1000 * 5);
  } else {
    clearInterval(proxy.timer);
    timer.value = null;
  }
}
/** 导出按钮操作 */
function handleExport() {
  proxy.download(
    'monitor/jobLog/export',
    {
      ...queryParams.value,
    },
    `job_log_${new Date().getTime()}.xlsx`
  );
}
async function get_all_job() {
  const queryParams = {
    page_num: 1,
    page_size: Number.MAX_SAFE_INTEGER,
  };
  let { list: jobs } = await listJob(queryParams);
  return jobs;
}

async function get_job_map() {
  const jobs_data = await get_all_job();
  const job_groups = [];
  const job_map = {};

  jobs_data.forEach((item) => {
    if (!job_groups.includes(item.job_group)) {
      job_groups.push(item.job_group);
      let jobs = [];
      const job = {
        job_name: item.job_name,
        job_id: item.job_id,
      };
      jobs.push(job);
      job_map[item.job_group] = jobs;
    } else {
      const job = {
        job_name: item.job_name,
        job_id: item.job_id,
      };
      job_map[item.job_group].push(job);
    }
  });
  jobs_map.value = job_map;
  jobs.value = jobs_map.value[queryParams.value.job_group];
}
function job_group_changed(v) {
  if (v == '') {
    queryParams.value.job_name = undefined;
  } else {
    jobs.value = jobs_map.value[v];
    queryParams.value.job_name = jobs.value[0].job_name;
  }
  getList();
}

function init() {
  const job_id = route.query.job_id;
  if (job_id !== 'all') {
    getJob({ job_id }).then((res) => {
      // queryParams.value.job_id = job_id;
      jobId.value = job_id;
      queryParams.value.job_name = res.job_name;
      queryParams.value.job_group = res.job_group;
      queryParams.value.is_once = undefined;
      getList();
    });
  } else {
    getList();
  }
}
init();
get_job_map();
// getList();
</script>
