import vue from '@vitejs/plugin-vue'

import createSvgIcon from './svg-icon'
import createCompression from './compression'
import createSetupExtend from './setup-extend'
import createImportToCDN from './importToCDN'

export default function createVitePlugins(viteEnv, isBuild = false) {
    const vitePlugins = [vue()]
	vitePlugins.push(createSetupExtend())
    vitePlugins.push(createSvgIcon(isBuild))
	vitePlugins.push(createImportToCDN())
	isBuild && vitePlugins.push(...createCompression(viteEnv))
    return vitePlugins
}
