/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-02 13:09:40
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-03 21:57:45
 * @FilePath: \IUI314\src\hooks\util\useRequest.ts
 * @Description: useRequest
 */
import {
  type MaybeRef,
  type UseFetchReturn,
  createFetch,
  isObject,
} from '@vueuse/core'
import { ElMessage } from 'element-plus'
import { computed, unref } from 'vue'
import { type LocationQueryRaw, stringifyQuery } from 'vue-router'

import { useToken } from '@/hooks/app/useDevice'
import { router } from '@/router'
import { useUserStore } from '@/stores'

const baseUrl = import.meta.env.VITE_API_BASE_URL
const RequestTimeout = 2000

const useRequest = createFetch({
  baseUrl,
  options: {
    immediate: false,
    timeout: RequestTimeout,
    beforeFetch({ options }) {
      const { token } = useToken()
      options.headers = Object.assign(options.headers || {}, {
        Authorization: token,
      })
      return { options }
    },
    afterFetch({ data, response }) {
      const { isExpiredSoon } = useToken()
      const status = data.code || 200
      if (status === 200) {
        data = data.data || {}
      } else if (status === 500) {
        ElMessage.error(data.msg)
      } else if (status === 401) {
        ElMessage.warning('登录过期')
        setTimeout(() => {
          router.push('/login')
        }, 1500)
      } else if (isExpiredSoon) {
        // 最后验证本地token效期,快过期时,刷新token
        useUserStore().freshToken()
      }
      return { data, response }
    },
    onFetchError({ error }) {
      ElMessage.error(error.message)
      return { error }
    },
  },
})

/**
 * 封装 get 请求
 * @param url 请求地址
 * @param query 请求参数
 */
export function useGet<T = unknown>(
  url: MaybeRef<string>,
  query?: MaybeRef<unknown>
): UseFetchReturn<T> {
  const _url = computed(() => {
    const _url = unref(url)
    const _query = unref(query)
    const queryString = isObject(_query)
      ? stringifyQuery(_query as LocationQueryRaw)
      : _query || ''
    return `${_url}${queryString ? '?' : ''}${queryString}`
  })
  return useRequest<T>(_url).json()
}

/**
 * 封装 post 请求
 * @param url 请求地址
 * @param payload 请求参数
 */
export function usePost<T = unknown>(
  url: MaybeRef<string>,
  payload?: MaybeRef<unknown>
): UseFetchReturn<T> {
  return useRequest<T>(url).post(payload).json()
}

/**
 * 封装 put 请求
 * @param url 请求地址
 * @param payload 请求参数
 */
export function usePut<T = unknown>(
  url: MaybeRef<string>,
  payload?: MaybeRef<unknown>
) {
  return useRequest<T>(url).put(payload).json()
}

/**
 * 封装 delete 请求
 * @param url 请求地址
 * @param payload 请求参数
 */
export function useDelete<T = unknown>(
  url: MaybeRef<string>,
  payload?: MaybeRef<unknown>
): UseFetchReturn<T> {
  return useRequest<T>(url).delete(payload).json()
}

/**
 * 封装获取Blob进行下载
 * @param url 请求地址
 */
export function useBlob(url: MaybeRef<string>): UseFetchReturn<Blob> {
  return useRequest(url).blob()
}
