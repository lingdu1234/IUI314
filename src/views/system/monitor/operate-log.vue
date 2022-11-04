<template>
  <div>
    <el-form
      v-show="showSearch"
      ref="queryRef"
      :inline="true"
      :model="queryParams"
      label-width="68px"
      class="base-form"
    >
      <el-form-item label="系统模块" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入系统模块"
          clearable
          style="width: 240px"
          @keyup.enter="getList"
        />
      </el-form-item>
      <el-form-item label="操作人员" prop="oper_name">
        <el-input
          v-model="queryParams.oper_name"
          placeholder="请输入操作人员"
          clearable
          style="width: 240px"
          @keyup.enter="getList"
        />
      </el-form-item>
      <el-form-item label="操作类型" prop="operator_type">
        <el-select
          v-model="queryParams.operator_type"
          placeholder="操作类型"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="dict in dicts[dictKey.sysOperType]"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="操作状态" prop="status">
        <el-select
          v-model="queryParams.status"
          :clearable="true"
          placeholder="状态"
        >
          <el-option
            v-for="dict in dicts[dictKey.sysCommonStatus]"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="操作时间">
        <el-date-picker
          v-model="dateRange"
          end-placeholder="结束日期"
          range-separator="-"
          start-placeholder="开始日期"
          type="daterange"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item>
        <el-button :icon="Search" type="primary" @click="getList">
          {{ t('common.search') }}
        </el-button>
        <el-button :icon="Refresh" @click="resetQuery">
          {{ t('common.reset') }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 操作区域 -->
    <el-row :gutter="10" class="m-b-8px" style="height: 35px">
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          :icon="Delete"
          :disabled="!selected"
          @click="handleDelete()"
          v-if="hasPermission(ApiSysLoginLog.delete)"
        >
          删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          :icon="Delete"
          @click="handleClean"
          v-if="hasPermission(ApiSysLoginLog.clean)"
        >
          清空
        </el-button>
      </el-col>

      <RightToolBar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>

    <!-- 表格区域 -->
    <el-table
      :data="list"
      @selection-change="handleSelectionChange"
      tooltip-effect="light"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="日志编号"
        align="center"
        prop="oper_id"
        show-overflow-tooltip
      />
      <el-table-column
        label="系统模块"
        align="center"
        prop="title"
        show-overflow-tooltip
      />
      <el-table-column label="操作类型" align="center" prop="operator_type">
        <template #default="scope">
          <DictTag
            :options="dicts[dictKey.sysOperType]"
            :value="scope.row.operator_type"
          />
        </template>
      </el-table-column>
      <el-table-column label="请求方式" align="center" prop="request_method">
        <template #default="scope">
          <DictTag
            :options="dicts[dictKey.sysApiMethod]"
            :value="scope.row.request_method"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="操作人员"
        align="center"
        prop="oper_name"
        :show-overflow-tooltip="true"
        width="120"
      />
      <el-table-column
        label="地址"
        align="center"
        prop="oper_location"
        width="130"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="操作状态" align="center" prop="status">
        <template #default="scope">
          <DictTag
            :options="dicts[dictKey.sysCommonStatus]"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>
      <el-table-column label="耗时(μs)" align="center" prop="duration" />
      <el-table-column
        label="操作日期"
        align="center"
        prop="oper_time"
        width="180"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.oper_time) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button link :icon="View" @click="handleView(scope.row)">
            {{ t('common.detail') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      v-show="total > 0"
      v-model:page="queryParams.page_num"
      v-model:limit="queryParams.page_size"
      :total="total"
      @pagination="getList"
    />

    <!-- 操作日志详细 -->
    <el-dialog
      v-if="open"
      v-model="open"
      title="操作日志详细"
      width="700px"
      append-to-body
    >
      <el-form :model="form" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作模块：">
              {{ form.title }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求方式：">
              {{ form.request_method }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="登录信息：">
              {{ form.oper_name }} / {{ form.oper_ip }} /
              {{ form.oper_location }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="请求地址：">
              {{ form.oper_url }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作方法：">
              {{ form.method }}
            </el-form-item>
          </el-col>
          <el-col v-if="form.request_method != 'GET'" :span="24">
            <el-form-item label="请求参数：">
              {{ form.oper_param }}
            </el-form-item>
          </el-col>
          <el-col v-if="form.request_method == 'GET'" :span="24">
            <el-form-item label="路径参数：">
              {{ form.path_param }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作耗时：">
              {{ form.duration }} 微秒
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="返回参数：">
              {{ form.json_result }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作状态：">
              <div v-if="form.status === '1'">正常</div>
              <div v-else-if="form.status === '0'">失败</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作时间：">
              {{ parseTime(form.oper_time) }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="form.status === '0'" label="异常信息：">
              {{ form.error_msg }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="open = false"> 关 闭 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { Delete, Refresh, Search, View } from '@element-plus/icons-vue'
import {
  type FormInstance,
  ElButton,
  ElCol,
  ElDatePicker,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElMessageBox,
  ElOption,
  ElRow,
  ElSelect,
  ElTable,
  ElTableColumn,
} from 'element-plus'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { ApiSysLoginLog, ApiSysOperateLog } from '@/api/apis'
import DictTag from '@/components/common/dict-tag.vue'
import Pagination from '@/components/common/pagination.vue'
import RightToolBar from '@/components/common/right-tool-bar.vue'
import {
  hasPermission,
  parseTime,
  useDelete,
  useDeleteFn,
  useDicts,
  useFormUtil,
  useListData,
  useTableUtil,
} from '@/hooks'
import type { MessageSchema } from '@/i18n'
import { systemMenus } from '@/router'
import { dictKey } from '@/types/system/dict'
import type {
  operateLog,
  operateLogQueryParam,
} from '@/types/system/operate-log'

const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
const queryRef = ref<FormInstance>()
const showSearch = ref(true)

const form = ref<operateLog>({})
const open = ref(false)
//  字典数据
const dicts = useDicts(
  dictKey.sysCommonStatus,
  dictKey.sysApiMethod,
  dictKey.sysOperType
)
const { formReset } = useFormUtil()
const { useTableSelectChange } = useTableUtil()
const { handleSelectionChangeFn, ids, values, selected } =
  useTableSelectChange()

const handleSelectionChange = (v: operateLog[]) =>
  handleSelectionChangeFn(v, 'oper_id', 'oper_id')

const queryParams = ref<operateLogQueryParam>({
  page_num: 1,
  page_size: 10,
})
const dateRange = ref<string[]>([])

const {
  list,
  getListFn: getList,
  total,
} = useListData<operateLogQueryParam, operateLog>(
  ApiSysOperateLog.getList,
  queryParams,
  dateRange
)

const resetQuery = () => {
  formReset(queryRef.value)
  dateRange.value = []
  getList()
}

// 删除数据
const handleDelete = async (row?: operateLog) => {
  const flag = await useDeleteFn(
    ApiSysOperateLog.delete,
    'oper_id',
    ids,
    'oper_id',
    values,
    'oper_ids',
    row
  )
  if (flag) getList()
}

const handleClean = async () => {
  await ElMessageBox.confirm('是否确认清空所有操作日志数据项?', '清空确认', {
    type: 'warning',
  })
    .then(async () => {
      const { execute } = useDelete(ApiSysOperateLog.clean)
      await execute()
      ElMessage.success('清空操作日志成功')
    })
    .catch(() => {
      ElMessage.info('取消情况操作')
    })
  getList()
}

const handleView = (row: operateLog) => {
  form.value = row
  open.value = true
}

// 导出名称
defineOptions({
  name: systemMenus.scheduledTasks.path,
})
</script>
