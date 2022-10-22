<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-20 17:58:25
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-22 23:09:24
 * @FilePath: \IUI314\src\views\system\user\pages\user-avatar.vue
 * @Description: 
-->
<template>
  <div>
    <div class="user-info-head" @click="openCropper = true">
      <img
        :src="options.img"
        :title="t('avatar.title')"
        class="b-rd-50% w-120px h-120px"
      />
    </div>
    <el-dialog
      v-model="openCropper"
      :title="title"
      append-to-body
      class="min-w-440px max-w-800px"
    >
      <el-row>
        <el-col :span="24" :md="12" class="w-420px h-420px">
          <el-row class="w-400px h-400px">
            <vue-cropper
              ref="cropper"
              :img="options.img"
              :info="true"
              :auto-crop="options.autoCrop"
              :auto-crop-width="options.autoCropWidth"
              :auto-crop-height="options.autoCropHeight"
              :fixed-box="options.fixedBox"
              @realTime="realTime"
            />
          </el-row>
          <el-row class="m-t-10px w-400px h-80px">
            <el-col :span="5">
              <el-upload
                action="#"
                :http-request="() => {}"
                :show-file-list="false"
                :before-upload="beforeUpload"
              >
                <el-button size="small">
                  {{ t('common.select') }}
                  <el-icon class="el-icon--right">
                    <Upload />
                  </el-icon>
                </el-button>
              </el-upload>
            </el-col>
            <el-col :span="5">
              <el-button type="primary" @click="uploadImg" size="small">
                {{ t('common.submit') }}
              </el-button>
            </el-col>
            <el-col :span="14">
              <el-button :icon="Plus" @click="changeScale(1)" size="small" />
              <el-button :icon="Minus" @click="changeScale(-1)" size="small" />
              <el-button :icon="RefreshLeft" @click="rotateLeft" size="small" />
              <el-button
                :icon="RefreshRight"
                @click="rotateRight"
                size="small"
              />
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" :md="12" class="w-400px h-400px">
          <el-row class="w-400px h-400px">
            <div class="translate-50% w-200px h-200px b-rd-50% overflow-hidden">
              <img :src="options.previews.url" :style="options.previews.img" />
            </div>
          </el-row>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup name="user-avatar">
import 'vue-cropper/dist/index.css'

import {
  Minus,
  Plus,
  RefreshLeft,
  RefreshRight,
  Upload,
} from '@element-plus/icons-vue'
import { type UploadProps, ElMessage } from 'element-plus'
import { ref } from 'vue'
import { VueCropper } from 'vue-cropper'
import { useI18n } from 'vue-i18n'

import { ErrorFlag } from '@/api/apis'
import { ApiSysUser } from '@/api/sysApis'
import { usePost } from '@/hooks'
import type { MessageSchema } from '@/i18n'
import { useUserStore } from '@/stores'

const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })

const userStore = useUserStore()
const openCropper = ref(false)
const title = ref(t('avatar.edit'))

const cropper = ref<InstanceType<typeof VueCropper>>()

const options = ref({
  img: userStore.user.avatar, // 裁剪图片的地址
  autoCrop: true, // 是否默认生成截图框
  autoCropWidth: 200, // 默认生成截图框宽度
  autoCropHeight: 200, // 默认生成截图框高度
  fixedBox: true, // 固定截图框大小 不允许改变
  previews: {
    h: 0,
    w: 0,
    url: '',
    img: {},
  }, //预览数据
})
function realTime(data: any) {
  options.value.previews = data
}
const changeScale = (value: number) => {
  // @ts-ignore
  cropper.value?.changeScale(value)
}
const rotateLeft = () => {
  // @ts-ignore
  cropper.value?.rotateLeft()
}
const rotateRight = () => {
  // @ts-ignore
  cropper.value?.rotateRight()
}

/** 上传预处理 */
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  if (file.type.indexOf('image/') == -1) {
    ElMessage.error(t('avatar.errorTip'))
  } else {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      options.value.img = reader.result as string
    }
  }
}
/** 上传图片 */
const uploadImg = async () => {
  // @ts-ignore
  cropper.value?.getCropBlob(async (v) => {
    let formData = new FormData()
    const old_url = userStore.user.avatar.replace(
      import.meta.env.VITE_API_BASE_URL,
      ''
    )
    formData.append('avatarfile', v, old_url)
    const { data, execute } = usePost<string>(ApiSysUser.updateAvatar, formData)
    await execute()
    if (data.value === ErrorFlag) return

    openCropper.value = false
    options.value.img = import.meta.env.VITE_API_BASE_URL + data.value!
    userStore.user.avatar = options.value.img
    ElMessage.success(t('avatar.success'))
  })
}
</script>
<style lang="scss" scoped>
.user-info-head {
  position: relative;
  display: inline-block;
  height: 120px;
}

.user-info-head:hover:after {
  content: '+';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  color: #eee;
  background: rgba(0, 0, 0, 0.5);
  font-size: 24px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  cursor: pointer;
  line-height: 110px;
  border-radius: 50%;
}
</style>
