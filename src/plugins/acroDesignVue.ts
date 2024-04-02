import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ConfigProvider,
  Dropdown,
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutSider,
  Menu,
  MenuItem,
  Message,
  Scrollbar,
  SubMenu,
} from '@arco-design/web-vue'
import type { App } from 'vue'

const acroComponents: any[] = [
  Message,
  ConfigProvider,
  Layout,
  LayoutSider,
  LayoutHeader,
  LayoutContent,
  Menu,
  SubMenu,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Dropdown,
  Scrollbar,
  Button,

]

export function setupAcroDesignVue(app: App) {
  for (const acroComponent of acroComponents)
    app.use(acroComponent)
}
