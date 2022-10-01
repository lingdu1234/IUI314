import type { defineComponent } from 'vue';

export type Component<T = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>);

export interface AppRouteRecordRaw {
  path: string;
  name?: string | symbol;
  component: Component | string;
  hidden?: boolean;
  meta?: AppRouteMeta;
  redirect?: string;
  children?: AppRouteRecordRaw[];
  props?: Record<string, any>;
  query?: string;
  noShowingChildren?: boolean;
  always_show?: boolean;
}

export interface AppRouteMeta {
  title: string;
  icon?: string;
  activeMenu?: string;
  no_cache?: boolean;
}
