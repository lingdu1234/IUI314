/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-02 13:09:40
 * @LastEditors: lingdu waong2005@126.com
 * @FilePath: \IUI314\src\hooks\util\useRequest.ts
 * @Description: useRequest
 */
import {
  createFetch,
  isObject,
  type MaybeRef,
  type UseFetchOptions,
  type UseFetchReturn,
} from '@vueuse/core'
import { ElMessage } from 'element-plus'
import { computed, unref } from 'vue'
import { type LocationQueryRaw, stringifyQuery } from 'vue-router'

import { ErrorFlag } from '@/api/apis'
import { useToken } from '@/hooks'
import { useSetupI18n } from '@/i18n'
import { router } from '@/router'
import { useUserStore } from '@/stores'

const baseUrl = import.meta.env.VITE_API_BASE_URL
const RequestTimeout = 1000 * 60 * 10
// const RepeatTime = 1000 //单位毫秒
// const RepeatValidateKey = 'efewfew22ew2fsfsd32'

// interface RepeatValidateData {
//   url: string
//   data?: string
//   timeout: number
// }

export const useRequest = createFetch({
  baseUrl,
  options: {
    immediate: false,
    timeout: RequestTimeout,
    beforeFetch({ options }) {
      // 添加节流 没啥用处
      // 如果是get方法
      // if (options.method === 'GET') {
      //   const x = window.sessionStorage.getItem(RepeatValidateKey)
      //   const v: RepeatValidateData = {
      //     url: url,
      //     timeout: new Date().getTime(),
      //   }
      //   if (x === null) {
      //     // 如果x值为空值，存储该请求
      //     window.sessionStorage.setItem(RepeatValidateKey, JSON.stringify(v))
      //   } else {
      //     // x不能空值对比该请求
      //     const y: RepeatValidateData = JSON.parse(x)
      //     if (y.url === url && v.timeout - y.timeout < RepeatTime) {
      //       cancel()
      //     } else {
      //       window.sessionStorage.setItem(RepeatValidateKey, JSON.stringify(v))
      //     }
      //   }
      // }
      //  添加token
      const { token } = useToken()
      options.headers = Object.assign(options.headers || {}, {
        Authorization: token,
      })
      return { options }
    },
    afterFetch: function ({ data, response }) {
      const { isExpiredSoon } = useToken()
      const status = data.code || 200
      if (status === 200) {
        data = data.data || {}
      } else if (status === 500) {
        ElMessage.error(data.msg)
        data = ErrorFlag
      } else if (isExpiredSoon) {
        // 最后验证本地token效期,快过期时,刷新token
        useUserStore().freshToken()
      }
      return { data, response }
    },
    onFetchError({ response, error }) {
      if (response?.status === 401) {
        const { i18n } = useSetupI18n()
        const { t } = i18n.global
        ElMessage.warning(t('commonTip.loginExpired'))
        useUserStore().frontEndLogout()
        setTimeout(() => {
          router.push('/login')
        }, 500)
      }
      return { error }
    },
  },
})

/**
 * 获取get请求Url地址
 * @param url 请求地址
 * @param query 请求参数
 */
export const getQueryUrl = (
  url: MaybeRef<string>,
  query?: MaybeRef<unknown>
) => {
  return computed(() => {
    const _url = unref(url)
    const _query = unref(query)
    const queryString = isObject(_query)
      ? stringifyQuery(_query as LocationQueryRaw)
      : _query || ''
    return `${_url}${queryString ? '?' : ''}${queryString}`
  })
}

/**
 * 封装 get 请求
 * @param url 请求地址
 * @param query 请求参数
 * @param options 请求选项
 */
export function useGet<T = unknown>(
  url: MaybeRef<string>,
  query?: MaybeRef<unknown>,
  options?: UseFetchOptions
): UseFetchReturn<T> {
  return useRequest<T>(getQueryUrl(url, query), { ...options }).json()
}

/**
 * 封装 post 请求
 * @param url 请求地址
 * @param payload 请求参数
 * @param options 请求选项
 */
export function usePost<T = unknown>(
  url: MaybeRef<string>,
  payload?: MaybeRef<unknown>,
  options?: UseFetchOptions
): UseFetchReturn<T> {
  return useRequest<T>(url, { ...options })
    .post(payload)
    .json()
}

/**
 * 封装 put 请求
 * @param url 请求地址
 * @param payload 请求参数
 * @param options 请求选项
 */
export function usePut<T = unknown>(
  url: MaybeRef<string>,
  payload?: MaybeRef<unknown>,
  options?: UseFetchOptions
) {
  return useRequest<T>(url, { ...options })
    .put(payload)
    .json()
}

/**
 * 封装 delete 请求
 * @param url 请求地址
 * @param payload 请求参数
 * @param options 请求选项
 */
export function useDelete<T = unknown>(
  url: MaybeRef<string>,
  payload?: MaybeRef<unknown>,
  options?: UseFetchOptions
): UseFetchReturn<T> {
  return useRequest<T>(url, { ...options })
    .delete(payload)
    .json()
}

/**
 * 封装获取Blob进行下载
 * @param url 请求地址
 * @param options 请求选项
 */
export function useBlob(
  url: MaybeRef<string>,
  options?: UseFetchOptions
): UseFetchReturn<Blob> {
  return useRequest(url, { ...options }).blob()
}
