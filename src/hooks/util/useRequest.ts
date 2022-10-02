import {
  type MaybeRef,
  type UseFetchReturn,
  createFetch,
  isObject,
} from '@vueuse/core'
import { ElMessage } from 'element-plus'
import { computed, unref } from 'vue'
import { type LocationQueryRaw, stringifyQuery } from 'vue-router'

import { router } from '@/router'

const baseUrl = import.meta.env.VITE_API_BASE_URL
const RequestTimeout = 2000

const useRequest = createFetch({
  baseUrl,
  options: {
    immediate: false,
    timeout: RequestTimeout,
    beforeFetch({ options }) {
      options.headers = Object.assign(options.headers || {}, {
        Authorization: 'Bearer ' + 'get_token',
      })
      return { options }
    },
    afterFetch({ data, response }) {
      const status = data.code || 200
      if (status === 200) {
        data = data.data || {}
      } else if (status === 401) {
        ElMessage.warning('登录过期')
        setTimeout(() => {
          router.push('/login')
        }, 1500)
      }
      return { data, response }
    },
    onFetchError({ data, error }) {
      console.error(error)
      data = undefined
      return { data, error }
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
): UseFetchReturn<T> {
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
