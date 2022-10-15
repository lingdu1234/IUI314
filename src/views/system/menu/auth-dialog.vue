<template>
  <el-dialog
    v-model="open"
    :title="title"
    width="680px"
    :before-close="cancel"
    append-to-body
  >
    <el-form ref="menuRef" label-width="100px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="关联数据表">
            <el-checkbox-group v-model="form.dbs">
              <el-checkbox
                v-for="dict in dicts[dictKey.db]"
                :key="dict.value"
                style="width: 150px"
                :label="dict.value"
              >
                <el-tooltip
                  :content="dict.label + ' : ' + dict.value"
                  placement="top"
                >
                  {{ dict.value }}
                </el-tooltip>
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item>
            <template #label>
              <span>
                <el-tooltip placement="top">
                  <template #content>
                    <div>
                      日志记录方式:
                      <br />分为四种方式: <br />不记录 <br />文件记录
                      <br />数据库记录 <br />文件+数据库记录
                    </div>
                  </template>
                  <el-icon><info-filled /></el-icon>
                </el-tooltip>
                日志记录
              </span>
            </template>
            <el-select v-model="form.log_method" placeholder="日志记录方式">
              <el-option
                v-for="dict in dicts[dictKey.apiLogMethod]"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="form.method === 'GET'" :span="12">
          <el-form-item>
            <template #label>
              <span>
                <el-tooltip placement="top">
                  <template #content>
                    <div>
                      日志记录方式:
                      <br />分为三种方式:
                      <br />不缓存:每次都从数据库获取，用于经常更新的数据
                      <br />按访问人:用于缓存每个人访问数据都不同的数据
                      <br />公共缓存:用于数据更新较少，不区分个人的数据
                    </div>
                  </template>
                  <el-icon><info-filled /></el-icon>
                </el-tooltip>
                缓存方式
              </span>
            </template>
            <el-select
              v-model="formData.data_cache_method"
              placeholder="缓存方式"
            >
              <el-option
                v-for="dict in dicts[dictKey.apiCacheMethod]"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm"> 确 定 </el-button>
        <el-button @click="cancel"> 取 消 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup name="menu-dialog">
import { InfoFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { type PropType, ref, watch } from 'vue'

import { ApiSysDb, ApiSysMenu } from '@/api/apis'
import { useDicts, usePost, usePut } from '@/hooks'
import { dictKey } from '@/types/system/dict'
import type { authMenu } from '@/types/system/menu'

const props = defineProps({
  formData: {
    type: Object as PropType<authMenu>,
    required: true,
  },
  open: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
})
const emits = defineEmits(['closeDialog'])
const form = ref<authMenu>({})

watch(
  () => props.formData,
  (v) => {
    form.value = { ...v }
  },
  { deep: true }
)
// 字典数据
const dicts = useDicts(
  dictKey.sysNormalDisable,
  dictKey.sysApiMethod,
  dictKey.apiCacheMethod,
  dictKey.apiLogMethod,
  dictKey.sysShowHide,
  dictKey.db
)

//  提交按钮函数
const submitForm = async () => {
  const api_data = {
    api_id: form.value.id,
    dbs: form.value.dbs,
  }
  const cache_log_data = {
    id: form.value.id,
    data_cache_method: form.value.data_cache_method,
    log_method: form.value.log_method,
  }
  await Promise.all([
    usePost(ApiSysDb.edit, api_data, { immediate: true }),
    usePut(ApiSysMenu.updateLogCache, cache_log_data, { immediate: true }),
  ])
  ElMessage.success('数据关联更新成功')
  cancel()
}

const cancel = () => {
  emits('closeDialog')
}
</script>
