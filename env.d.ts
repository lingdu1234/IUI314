/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />
declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<object, object, any>
  export default component
}
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
}

// 阻止报错
declare module 'blueimp-md5';
