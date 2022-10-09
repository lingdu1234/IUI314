<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-03 23:56:33
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-09 20:16:37
 * @FilePath: \IUI314\src\views\system\dict\index.vue
 * @Description: 字典类型数据
-->
<template>
  <div class="m-20px">
    <el-form
      ref="queryRef"
      :inline="true"
      :model="queryParams"
      label-width="68px"
    >
      <el-form-item label="字典名称" prop="dict_name">
        <el-input
          v-model="queryParams.dict_name"
          clearable
          placeholder="请输入字典名称"
          @keyup.enter="getList"
        />
      </el-form-item>
      <el-form-item label="字典类型" prop="dict_type">
        <el-input
          v-model="queryParams.dict_type"
          clearable
          placeholder="请输入字典类型"
          @keyup.enter="getList"
        />
      </el-form-item>
      <el-form-item label="字典状态" prop="status">
        <el-select
          v-model="queryParams.status"
          :clearable="true"
          placeholder="字典状态"
        >
          <el-option
            v-for="dict in dicts[dictKey.sysNormalDisable]"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
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
          搜索
        </el-button>
        <el-button :icon="Refresh" @click="formReset(queryRef)">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 操作区域 -->
    <el-row :gutter="10" class="m-b-8px" style="height: 35px">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd">
          新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="!single"
          @click="handleUpdate"
        >
          修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="!slected"
          @click="handleDelete"
        >
          删除
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>

    <!-- 表格区域 -->
    <el-table :data="dictTypeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="字典编号"
        align="center"
        prop="dict_type_id"
        width="100"
        show-overflow-tooltip
      />
      <el-table-column
        label="字典名称"
        align="center"
        prop="dict_name"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="字典类型"
        align="center"
        :show-overflow-tooltip="true"
      >
        <template #default="scope">
          <router-link
            :to="'/system/dict-data/index/' + scope.row.dict_type_id"
            class="link-type"
          >
            <span>{{ scope.row.dict_type }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <DictTag
            :options="dicts[dictKey.sysNormalDisable]"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="备注"
        align="center"
        prop="remark"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="created_at"
        width="180"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.created_at) }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        v-hasPermi="['system/dict/type/edit', 'system/dict/type/delete']"
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button
            v-hasPermi="['system/dict/type/edit']"
            link
            icon="Edit"
            @click="handleUpdate(scope.row)"
          >
            修改
          </el-button>
          <el-button
            v-hasPermi="['system/dict/type/delete']"
            link
            icon="Delete"
            @click="handleDelete(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <pagination
      v-show="total > 0"
      v-model:page="queryParams.page_num"
      v-model:limit="queryParams.page_size"
      :total="total"
      @pagination="getList"
    />
  </div>
</template>
<script lang="ts" name="dict" setup>
import { Refresh, Search } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ref } from 'vue'

import DictTag from '@/components/common/dict-tag.vue'
import { parseTime, useDicts, useFormUtil, useTableUtil } from '@/hooks'
import {
  type dictType,
  type dictTypeQueryParam,
  dictKey,
} from '@/types/system/dict'

import { getDictTypeList } from './useDictType'

const queryRef = ref<FormInstance>()
//  字典数据
const dicts = useDicts(dictKey.sysNormalDisable)
const { formValidate, formReset } = useFormUtil()
const { useTableSelectChange } = useTableUtil()
const { handleSelectionChangeFn, ids, values, single, slected } =
  useTableSelectChange()

const handleSelectionChange = (v: dictType[]) =>
  handleSelectionChangeFn(v, 'dict_type_id', 'dict_name')

const queryParams = ref<dictTypeQueryParam>({
  page_num: 1,
  page_size: 10,
})
const dateRange = ref()

const {
  dictTypeList,
  getDictTypeListFn: getList,
  total,
} = getDictTypeList(queryParams)

const rules = ref<FormRules>({
  dict_name: [{ required: true, message: '字典名称不能为空', trigger: 'blur' }],
  dict_type: [{ required: true, message: '字典类型不能为空', trigger: 'blur' }],
})
</script>
