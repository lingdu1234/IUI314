<template>
  <el-dialog
    v-model="open"
    :title="title"
    width="680px"
    :before-close="cancel"
    append-to-body
  >
    <el-form ref="menuRef" :model="form" :rules="rules" label-width="100px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="上级菜单">
            <el-tree-select
              class="w-300px"
              v-model="form.pid"
              :data="menuSelectTree"
              :props="menuSelectTreeProps"
              check-strictly
              :render-after-expand="false"
              placeholder="请选择上级目录,不填为主目录"
              clearable
              filterable
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="菜单类型" prop="menu_type">
            <el-radio-group v-model="form.menu_type">
              <el-radio label="M"> 目录 </el-radio>
              <el-radio label="C"> 菜单 </el-radio>
              <el-radio label="F"> api/按钮 </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="form.menu_type != 'F'" :span="24">
          <el-form-item label="菜单图标" prop="icon">
            <el-popover
              v-model:visible="showChooseIcon"
              placement="bottom-start"
              :width="540"
              trigger="click"
              @show="showSelectIcon"
            >
              <template #reference>
                <el-input
                  v-model="form.icon"
                  placeholder="点击选择图标"
                  readonly
                  @click="showSelectIcon"
                >
                  <template #prefix>
                    <SvgIcon
                      v-if="form.icon"
                      :name="form.icon"
                      class="el-input__icon"
                      style="height: 32px; width: 16px"
                    />
                    <el-icon v-else style="height: 32px; width: 16px">
                      <Search />
                    </el-icon>
                  </template>
                </el-input>
              </template>
              <icon-select ref="iconSelectRef" @selected="selected" />
            </el-popover>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单名称" prop="menu_name">
            <el-input v-model="form.menu_name" placeholder="请输入菜单名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示排序" prop="order_sort">
            <el-input-number
              v-model="form.order_sort"
              controls-position="right"
              :min="0"
            />
          </el-form-item>
        </el-col>
        <el-col v-if="form.menu_type != 'F'" :span="12">
          <el-form-item>
            <template #label>
              <span>
                <el-tooltip
                  content="选择是外链则路由地址需要以`http(s)://`开头"
                  placement="top"
                  effect="light"
                >
                  <el-icon><InfoFilled /></el-icon> </el-tooltip
                >是否外链
              </span>
            </template>
            <el-radio-group v-model="form.is_frame">
              <el-radio label="1"> 是 </el-radio>
              <el-radio label="0"> 否 </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="form.menu_type != 'F'" :span="12">
          <el-form-item prop="path">
            <template #label>
              <span>
                <el-tooltip
                  content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头"
                  placement="top"
                  effect="light"
                >
                  <el-icon><InfoFilled /></el-icon>
                </el-tooltip>
                路由地址
              </span>
            </template>
            <el-input v-model="form.path" placeholder="请输入路由地址" />
          </el-form-item>
        </el-col>
        <el-col v-if="form.menu_type == 'C'" :span="12">
          <el-form-item prop="component">
            <template #label>
              <span>
                <el-tooltip
                  content="访问的组件路径，如：`system/user/index`，默认在`views`目录下"
                  placement="top"
                  effect="light"
                >
                  <el-icon><InfoFilled /></el-icon>
                </el-tooltip>
                组件路径
              </span>
            </template>
            <el-input v-model="form.component" placeholder="请输入组件路径" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="api">
            <el-input
              v-model="form.api"
              placeholder="请输入唯一标识"
              maxlength="100"
            />
            <template #label>
              <span>
                <el-tooltip
                  v-if="form.menu_type == 'M'"
                  content="目录的唯一标志，建议格式M-name，如：`M-sys`,`M-system-menu`"
                  placement="top"
                  effect="light"
                >
                  <el-icon><InfoFilled /></el-icon>
                </el-tooltip>
                <el-tooltip
                  v-else-if="form.menu_type == 'C'"
                  content="菜单唯一标志，同目录标志，如：`M-system-menu`"
                  placement="top"
                  effect="light"
                >
                  <el-icon><InfoFilled /></el-icon>
                </el-tooltip>
                <el-tooltip
                  v-else-if="form.menu_type == 'F'"
                  content="API/按钮的唯一标志，可为API,如：`system/user/add`,若只是单纯控制按钮显示，建议B-name，如：`B-export`"
                  placement="top"
                  effect="light"
                >
                  <el-icon><InfoFilled /></el-icon>
                </el-tooltip>
                <span v-if="form.menu_type == 'M'">目录标志</span>
                <span v-else-if="form.menu_type == 'C'">菜单API</span>
                <span v-else-if="form.menu_type == 'F'">api标志</span>
              </span>
            </template>
          </el-form-item>
        </el-col>
        <el-col v-if="form.menu_type == 'F'" :span="12">
          <el-form-item prop="method">
            <template #label>
              <span>
                <el-tooltip
                  content="API 请求方法，如：`GET`,`POST`，`PUT`,`DELETE`"
                  placement="top"
                  effect="light"
                >
                  <el-icon><InfoFilled /></el-icon>
                </el-tooltip>
                请求方法
              </span>
            </template>
            <el-select v-model="form.method" placeholder="请求方法" clearable>
              <el-option
                v-for="dict in dicts[dictKey.sysApiMethod]"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="form.menu_type == 'F' && form.method == 'GET'" :span="12">
          <el-form-item>
            <template #label>
              <span>
                <el-tooltip placement="top" effect="light">
                  <template #content>
                    <div>
                      日志记录方式:
                      <br />分为三种方式:
                      <br />不缓存:每次都从数据库获取，用于经常更新的数据
                      <br />按访问人:用于缓存每个人访问数据都不同的数据
                      <br />公共缓存:用于数据更新较少，不区分个人的数据
                    </div>
                  </template>
                  <el-icon><InfoFilled /></el-icon>
                </el-tooltip>
                缓存方式
              </span>
            </template>
            <el-select v-model="form.data_cache_method" placeholder="请求方法">
              <el-option
                v-for="dict in dicts[dictKey.apiCacheMethod]"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="form.menu_type == 'F'" :span="12">
          <el-form-item>
            <template #label>
              <span>
                <el-tooltip placement="top" effect="light">
                  <template #content>
                    <div>
                      日志记录方式:
                      <br />分为四种方式: <br />不记录 <br />文件记录
                      <br />数据库记录 <br />文件+数据库记录
                    </div>
                  </template>
                  <el-icon><InfoFilled /></el-icon>
                </el-tooltip>
                日志记录
              </span>
            </template>
            <el-select v-model="form.log_method" placeholder="请求方法">
              <el-option
                v-for="dict in dicts[dictKey.apiLogMethod]"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="form.menu_type == 'C'" :span="12">
          <el-form-item>
            <el-input
              v-model="form.query"
              placeholder="请输入路由参数"
              maxlength="255"
            />
            <template #label>
              <span>
                <el-tooltip
                  content='访问路由的默认传递参数，如：`{id: 1, name: "\i"}`'
                  placement="top"
                  effect="light"
                >
                  <el-icon><InfoFilled /></el-icon>
                </el-tooltip>
                路由参数
              </span>
            </template>
          </el-form-item>
        </el-col>
        <el-col v-if="form.menu_type == 'C'" :span="12">
          <el-form-item>
            <template #label>
              <span>
                <el-tooltip
                  content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致"
                  placement="top"
                  effect="light"
                >
                  <el-icon><InfoFilled /></el-icon>
                </el-tooltip>
                是否缓存
              </span>
            </template>
            <el-radio-group v-model="form.is_cache">
              <el-radio label="1"> 缓存 </el-radio>
              <el-radio label="0"> 不缓存 </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="form.menu_type == 'F' && form.method == 'GET'" :span="12">
          <el-form-item>
            <template #label>
              <span>
                <el-tooltip
                  content="是否开启数据权限,开启后可以设置数据权限"
                  placement="top"
                  effect="light"
                >
                  <el-icon><InfoFilled /></el-icon>
                </el-tooltip>
                数据权限
              </span>
            </template>
            <el-radio-group v-model="form.data_scope">
              <el-radio label="0"> 关闭 </el-radio>
              <el-radio label="1"> 开启 </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="form.menu_type != 'F'" :span="12">
          <el-form-item>
            <template #label>
              <span>
                <el-tooltip
                  content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问"
                  placement="top"
                  effect="light"
                >
                  <el-icon><InfoFilled /></el-icon>
                </el-tooltip>
                显示状态
              </span>
            </template>
            <el-radio-group v-model="form.visible">
              <el-radio
                v-for="dict in dicts[dictKey.sysShowHide]"
                :key="dict.value"
                :label="dict.value"
              >
                {{ dict.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="form.menu_type != 'F'" :span="12">
          <el-form-item>
            <template #label>
              <span>
                <el-tooltip
                  content="选择停用则路由将不会出现在侧边栏，也不能被访问"
                  placement="top"
                  effect="light"
                >
                  <el-icon><InfoFilled /></el-icon>
                </el-tooltip>
                菜单状态
              </span>
            </template>
            <el-radio-group v-model="form.status">
              <el-radio
                v-for="dict in dicts[dictKey.sysNormalDisable]"
                :key="dict.value"
                :label="dict.value"
              >
                {{ dict.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="form.remark"
              type="textarea"
              placeholder="请输入备注"
            />
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
import { InfoFilled, Search } from '@element-plus/icons-vue'
import { type FormInstance, type FormRules, ElMessage } from 'element-plus'
import { type PropType, ref, watch } from 'vue'

import { ApiSysMenu, ErrorFlag } from '@/api/apis'
import type IconSelect from '@/components/common/icon-select.vue'
import SvgIcon from '@/components/common/svg-icon.vue'
import { useDicts, useFormUtil, usePost, usePut } from '@/hooks'
import { MenuType } from '@/types/base/router'
import { dictKey } from '@/types/system/dict'
import type { menu } from '@/types/system/menu'

const props = defineProps({
  formData: {
    type: Object as PropType<menu>,
    required: true,
  },
  menuSelectTree: {
    type: Array as PropType<menu[]>,
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
const { formReset, formValidate } = useFormUtil()
const emits = defineEmits(['closeDialog', 'getList', 'updateDom'])
const form = ref<menu>({})
const showChooseIcon = ref(false)
const iconSelectRef = ref<InstanceType<typeof IconSelect>>()
const menuRef = ref<FormInstance>()

watch(
  () => props.formData,
  (v) => {
    form.value = { ...v }
  },
  { deep: true }
)

const checkApi = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('菜单唯一标志不能为空'))
  } else if (form.value.menu_type !== MenuType.F && value.indexOf('/') !== -1) {
    callback(new Error('格式错误!不能为api路径,不能包含"/"!'))
  } else {
    callback()
  }
}
const rules = ref<FormRules>({
  menu_name: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
  order_sort: [
    { required: true, message: '菜单顺序不能为空', trigger: 'blur' },
  ],
  path: [{ required: true, message: '路由地址不能为空', trigger: 'blur' }],
  api: [{ validator: checkApi, required: true, trigger: 'blur' }],
})

const menuSelectTreeProps = ref({
  value: 'id',
  label: 'menu_name',
  checkStrictly: true,
  disabled: 'disabled',
})

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
  if (!(await formValidate(menuRef.value))) return
  if (form.value.id === undefined || form.value.id === '') {
    const { execute, data } = usePost(ApiSysMenu.add, form)
    await execute()
    if (data.value === ErrorFlag) return
    emits('updateDom', form.value.pid)
    cancel()
    ElMessage.success('新增成功')
  } else {
    const { execute, data } = usePut(ApiSysMenu.edit, form)
    await execute()
    if (data.value === ErrorFlag) return
    emits('updateDom', form.value.pid)
    cancel()
    ElMessage.success('修改成功')
  }
}

const showSelectIcon = () => {
  iconSelectRef.value?.reset()
  showChooseIcon.value = true
}
const selected = (name: string) => {
  form.value.icon = name
  showChooseIcon.value = false
}
const resetMenuForm = () => formReset(menuRef.value)
const cancel = () => {
  emits('closeDialog')
  showChooseIcon.value = false
}
defineExpose({ resetMenuForm })
</script>
