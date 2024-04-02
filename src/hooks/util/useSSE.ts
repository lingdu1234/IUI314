import { EventSourcePolyfill, type MessageEvent } from 'event-source-polyfill'
import { type Ref, onDeactivated, onUnmounted, ref } from 'vue'

import { useToken } from '../app'

const baseUrl = import.meta.env.VITE_API_BASE_URL

export function useSSE(_url: string) {
  const data: Ref<string | null> = ref(null)
  const url = `${baseUrl}/${_url}`
  const { token } = useToken()
  const es = new EventSourcePolyfill(url, {
    withCredentials: false,
    headers: {
      Authorization: token,
    },
  })

  es.onmessage = (e: MessageEvent) => {
    data.value = e.data
  }
  onDeactivated(() => {
    es.close()
  })
  onUnmounted(() => {
    es.close()
  })
  return { data }
}
