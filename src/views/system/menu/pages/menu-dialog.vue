<template>
  <el-dialog
    v-model="open"
    :title="title"
    width="680px"
    :before-close="cancel"
    append-to-body
  >
    <el-form
      ref="menuRef"
      :model="form"
      :rules="rules"
      label-width="120px"
      class="base-form"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item :label="t('menu.parentMenu')">
            <el-tree-select
              v-model="form.pid"
              :data="menuSelectTree"
              :props="menuSelectTreeProps"
              check-strictly
              :render-after-expand="false"
              :placeholder="t('menu.parentMenuTip')"
              clearable
              filterable
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="t('menu.menuType')" prop="menu_type">
            <el-radio-group v-model="form.menu_type">
              <el-radio label="M"> {{ t('menu.catalogs') }} </el-radio>
              <el-radio label="C"> {{ t('menu.menu') }} </el-radio>
              <el-radio label="F"> Api/{{ t('menu.button') }} </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="form.menu_type != 'F'" :span="24">
          <el-form-item :label="t('menu.menu') + t('common.icon')" prop="icon">
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
                  :placeholder="t('menu.menuIconTip')"
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
          <el-form-item :label="t('menu.name')" prop="menu_name">
            <el-input
              v-model="form.menu_name"
              :placeholder="t('menu.nameTip')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.i18n !== MenuType.F">
          <el-form-item prop="i18n">
            <template #label>
              <span>
                <el-tooltip
                  :content="t('menu.i18nFlagTip')"
                  placement="top"
                  effect="light"
                >
                  <el-icon><InfoFilled /></el-icon>
                </el-tooltip>
                {{ t('menu.i18nFlag') }}
              </span>
            </template>
            <el-input
              v-model="form.i18n"
              :placeholder="t('menu.i18nFlagTip2')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="t('common.order')" prop="order_sort">
            <el-input-number
              v-model="form.order_sort"
              controls-position="right"
              :min="0"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.i18n !== MenuType.F">
          <el-form-item>
            <template #label>
              <span>
                <el-tooltip
                  :content="t('menu.isFrameTip')"
                  placement="top"
                  effect="light"
                >
                  <el-icon><InfoFilled /></el-icon>
                </el-tooltip>
                {{ t('menu.isFrame') }}
              </span>
            </template>
            <el-radio-group v-model="form.is_frame">
              <el-radio label="1"> {{ t('common.yes') }} </el-radio>
              <el-radio label="0"> {{ t('common.no') }} </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.i18n !== MenuType.F">
          <el-form-item prop="path">
            <template #label>
              <span>
                <el-tooltip
                  :content="t('menu.pathTip')"
                  placement="top"
                  effect="light"
                >
                  <el-icon><InfoFilled /></el-icon>
                </el-tooltip>
                {{ t('menu.path') }}
              </span>
            </template>
            <el-input v-model="form.path" :placeholder="t('menu.pathTip2')" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.menu_type === MenuType.C">
          <el-form-item prop="component">
            <template #label>
              <span>
                <el-tooltip
                  :content="t('menu.compPathTip')"
                  placement="top"
                  effect="light"
                >
                  <el-icon><InfoFilled /></el-icon>
                </el-tooltip>
                {{ t('menu.compPath') }}
              </span>
            </template>
            <el-input
              v-model="form.component"
              :placeholder="t('menu.compPathTip2')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="api">
            <el-input
              v-model="form.api"
              :placeholder="t('menu.apiTip')"
              maxlength="100"
            />
            <template #label>
              <span>
                <el-tooltip
                  v-if="form.menu_type === MenuType.M"
                  placement="top"
                  effect="light"
                >
                  <template #content>
                    <div>
                      A:{{ t('menu.apiTipM') }}
                      <br />
                      B:{{ t('menu.apiTipC') }}
                      <br />
                      C:{{ t('menu.apiTipF') }}
                    </div>
                  </template>
                  <el-icon><InfoFilled /></el-icon>
                </el-tooltip>
                <span v-if="form.menu_type === MenuType.M">
                  {{ t('menu.catalogsFlag') }}
                </span>
                <span v-else-if="form.menu_type === MenuType.C">
                  {{ t('menu.menuFlag') }}
                </span>
                <span v-else-if="form.menu_type == MenuType.F">
                  {{ t('menu.apiFlag') }}
                </span>
              </span>
            </template>
          </el-form-item>
        </el-col>
        <el-col v-if="form.menu_type === MenuType.F" :span="12">
          <el-form-item prop="method">
            <template #label>
              <span>
                <el-tooltip
                  :content="
                    t('menu.methodTip') + '`GET`,`POST`，`PUT`,`DELETE`'
                  "
                  placement="top"
                  effect="light"
                >
                  <el-icon><InfoFilled /></el-icon>
                </el-tooltip>
                {{ t('menu.method') }}
              </span>
            </template>
            <el-select
              v-model="form.method"
              :placeholder="t('menu.method')"
              clearable
            >
              <el-option
                v-for="dict in dicts[dictKey.sysApiMethod]"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col
          v-if="form.menu_type === MenuType.F && form.method == 'GET'"
          :span="12"
        >
          <el-form-item>
            <template #label>
              <span>
                <el-tooltip placement="top" effect="light">
                  <template #content>
                    <div>
                      {{ t('common.cache') }}
                      <br />
                      {{ t('menu.cacheTipNoCache') }}
                      <br />
                      {{ t('menu.cacheTipByPerson') }}
                      <br />
                      {{ t('menu.cacheTipCommon') }}
                    </div>
                  </template>
                  <el-icon><InfoFilled /></el-icon>
                </el-tooltip>
                {{ t('common.cache') }}
              </span>
            </template>
            <el-select
              v-model="form.data_cache_method"
              :placeholder="t('common.cache')"
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
        <el-col v-if="form.menu_type === MenuType.F" :span="12">
          <el-form-item>
            <template #label>
              <span>
                <el-tooltip placement="top" effect="light">
                  <template #content>
                    <div>
                      {{ t('common.log') }}
                      <br />
                      {{ t('menu.logNo') }}
                      <br />
                      {{ t('menu.logTipFile') }}
                      <br />
                      {{ t('menu.logTipDb') }}
                      <br />
                      {{ t('menu.logTipFile') + '+' + t('menu.logTipDb') }}
                    </div>
                  </template>
                  <el-icon><InfoFilled /></el-icon>
                </el-tooltip>
                {{ t('common.log') }}
              </span>
            </template>
            <el-select v-model="form.log_method">
              <el-option
                v-for="dict in dicts[dictKey.apiLogMethod]"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="form.menu_type === MenuType.C" :span="12">
          <el-form-item>
            <el-input
              v-model="form.query"
              :placeholder="t('menu.routeParam')"
              maxlength="255"
            />
            <template #label>
              <span>
                <el-tooltip
                  :content="t('menu.routeParamTip') + ` {id: 1, name: 'i'} `"
                  placement="top"
                  effect="light"
                >
                  <el-icon><InfoFilled /></el-icon>
                </el-tooltip>
                {{ t('menu.routeParam') }}
              </span>
            </template>
          </el-form-item>
        </el-col>
        <el-col v-if="form.menu_type === MenuType.C" :span="12">
          <el-form-item>
            <template #label>
              <span>
                <el-tooltip
                  content="t('menu.keepAliveTip')"
                  placement="top"
                  effect="light"
                >
                  <el-icon><InfoFilled /></el-icon>
                </el-tooltip>
                keep-alive
              </span>
            </template>
            <el-radio-group v-model="form.is_cache">
              <el-radio label="1"> keepAlive </el-radio>
              <el-radio label="0"> noCache </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col
          v-if="form.menu_type === MenuType.F && form.method == 'GET'"
          :span="12"
        >
          <el-form-item>
            <template #label>
              <span>
                <el-tooltip
                  :content="t('menu.dataScopeTip')"
                  placement="top"
                  effect="light"
                >
                  <el-icon><InfoFilled /></el-icon>
                </el-tooltip>
                {{ t('menu.dataScope') }}
              </span>
            </template>
            <el-radio-group v-model="form.data_scope">
              <el-radio label="0"> {{ t('common.close') }} </el-radio>
              <el-radio label="1"> {{ t('common.enable') }} </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="form.menu_type != 'F'" :span="12">
          <el-form-item>
            <template #label>
              <span>
                <el-tooltip
                  :content="t('menu.isHideTip')"
                  placement="top"
                  effect="light"
                >
                  <el-icon><InfoFilled /></el-icon>
                </el-tooltip>
                {{ t('menu.isHide') }}
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
        <el-col v-if="form.menu_type !== MenuType.F" :span="12">
          <el-form-item>
            <template #label>
              <span>
                <el-tooltip
                  :content="t('menu.isDisableTip')"
                  placement="top"
                  effect="light"
                >
                  <el-icon><InfoFilled /></el-icon>
                </el-tooltip>
                {{ t('menu.menuStatus') }}
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
          <el-form-item :label="t('common.remark')" prop="remark">
            <el-input
              v-model="form.remark"
              type="textarea"
              :placeholder="t('common.remarkTip')"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm">
          {{ t('common.submit') }}
        </el-button>
        <el-button @click="cancel">
          {{ t('common.cancel') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup name="menu-dialog">
import { InfoFilled, Search } from '@element-plus/icons-vue'
import { type FormInstance, type FormRules, ElMessage } from 'element-plus'
import { type PropType, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { ApiSysMenu, ErrorFlag } from '@/api/apis'
import type IconSelect from '@/components/common/icon-select.vue'
import SvgIcon from '@/components/common/svg-icon.vue'
import { useDicts, useFormUtil, usePost, usePut } from '@/hooks'
import type { MessageSchema } from '@/i18n'
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
const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
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
