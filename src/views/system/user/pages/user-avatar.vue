<script lang="ts" setup>
import 'vue-cropper/dist/index.css'

import { computed, onActivated, onMounted, ref } from 'vue'
import { VueCropper } from 'vue-cropper'
import { useI18n } from 'vue-i18n'

import { Message } from '@arco-design/web-vue'
import type { IconRotateLeft, IconUpload } from '@arco-design/web-vue/es/icon'
import { ErrorFlag } from '@/api/apis'
import { ApiSysUser } from '@/api/sysApis'
import { usePost } from '@/hooks'
import type { MessageSchema } from '@/i18n'
import { useUserStore } from '@/stores'

defineOptions({ name: 'UserAvatar' })

const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })

const userStore = useUserStore()
const openCropper = ref(false)
const title = ref(t('avatar.edit'))

const cropper = ref <InstanceType<typeof VueCropper>>()

const options = ref({
  img: userStore.user.avatar, // 裁剪图片的地址
  autoCrop: true, // 是否默认生成截图框
  autoCropWidth: 200, // 默认生成截图框宽度
  autoCropHeight: 200, // 默认生成截图框高度
  fixedBox: true, // 固定截图框大小 不允许改变
  previews: {
    url: '',
    img: {},
  }, // 预览数据
})

const width = ref()

function getVw() {
  const vW = window.innerWidth
  width.value = `${vW >= 992 ? 840 : 460}px`
}

window.addEventListener('resize', () => getVw())

onMounted(() => getVw())
onActivated(() => getVw())

openCropper.value = false
function realTime(data: any) {
  options.value.previews = data
}
function changeScale(value: number) {
  cropper.value?.changeScale(value)
}
function rotateLeft() {
  cropper.value?.rotateLeft()
}
function rotateRight() {
  cropper.value?.rotateRight()
}

function reFresh() {
  cropper.value?.refresh()
}

/** 上传预处理 */
function beforeUpload(file: File) {
  if (!file.type.includes('image/')) {
    Message.error(t('avatar.errorTip'))
    return false
  }
  else {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      options.value.img = reader.result as string
    }
    return true
  }
}
/** 上传图片 */
async function uploadImg() {
  cropper.value?.getCropBlob(async (v: Blob) => {
    const formData = new FormData()
    const old_url = userStore.user.avatar.replace(
      import.meta.env.VITE_API_BASE_URL,
      '',
    )
    formData.append('avatarfile', v, old_url)
    const { data, execute } = usePost<string>(ApiSysUser.updateAvatar, formData)
    await execute()
    if (data.value === ErrorFlag)
      return

    openCropper.value = false
    options.value.img = import.meta.env.VITE_API_BASE_URL + data.value!
    userStore.user.avatar = options.value.img
    Message.success(t('avatar.success'))
  })
}
const contentHeight = computed(() => 'calc(calc(var(--vh) * 100) - 200px')
</script>

<template>
  <div>
    <div class="user-info-head" @click="openCropper = true">
      <img
        :src="options.img"
        :title="t('avatar.title')"
        class="b-rd-50% w-120px h-120px"
      >
    </div>
    <a-modal
      v-model:visible="openCropper"
      :title="title"
      :footer="false"
      :draggable="true"
      :width="width"
      class="iu-modal"
      @before-open="reFresh"
    >
      <a-scrollbar :style="`max-height:${contentHeight};overflow: auto;`" class="flex justify-center m-5px">
        <a-grid
          :cols="{ xs: 1, sm: 1, md: 1, lg: 2, xl: 2, xxl: 2 }" :col-gap="10" :row-gap="10"
        >
          <a-grid-item class="w-420px h-480px">
            <a-col class="w-400px h-400px">
              <a-row class="w-400px h-400px">
                <VueCropper
                  ref="cropper"
                  :img="options.img"
                  :info="true"
                  :auto-crop="options.autoCrop"
                  :auto-crop-width="options.autoCropWidth"
                  :auto-crop-height="options.autoCropHeight"
                  :fixed-box="options.fixedBox"
                  @real-time="realTime"
                />
              </a-row>
              <a-row class="w-400px h-30px m-t-10px" align="center" justify="center">
                <a-space>
                  <a-upload
                    :auto-upload="false"
                    :show-file-list="false"
                    @before-upload="beforeUpload"
                  >
                    <template #upload-button>
                      <a-button type="dashed" status="success" size="mini">
                        {{ t('sys.select') }}
                        <template #icon>
                          <IconUpload />
                        </template>
                      </a-button>
                    </template>
                  </a-upload>
                  <a-button type="primary" status="success" size="mini" @click="uploadImg">
                    {{ t('sys.submit') }}
                    <template #icon>
                      <IconCheck />
                    </template>
                  </a-button>

                  <a-button type="dashed" status="success" shape="circle" size="small" class="m-l-20px" @click="changeScale(1)">
                    <template #icon>
                      <IconPlus />
                    </template>
                  </a-button>
                  <a-button type="dashed" status="success" shape="circle" size="small" @click="changeScale(-1)">
                    <template #icon>
                      <IconMinus />
                    </template>
                  </a-button>
                  <a-button type="dashed" status="warning" shape="circle" size="small" @click="rotateLeft">
                    <template #icon>
                      <IconRotateLeft />
                    </template>
                  </a-button>
                  <a-button type="dashed" status="warning" shape="circle" size="small" @click="rotateRight">
                    <template #icon>
                      <IconRotateRight />
                    </template>
                  </a-button>
                  <a-button type="dashed" status="success" shape="circle" size="small" @click="reFresh">
                    <template #icon>
                      <IconRefresh />
                    </template>
                  </a-button>
                </a-space>
              </a-row>
            </a-col>
          </a-grid-item>
          <a-grid-item class="w-400px h-400px">
            <a-row class="w-400px h-400px">
              <div class="translate-50% w-200px h-200px b-rd-50% overflow-hidden">
                <img :src="options.previews.url" :style="options.previews.img">
              </div>
            </a-row>
          </a-grid-item>
        </a-grid>
      </a-scrollbar>
    </a-modal>
  </div>
</template>

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
