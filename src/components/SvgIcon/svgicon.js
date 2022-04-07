import * as ElmPlusIcons from '@element-plus/icons-vue'

export default {
    install: (app) => {
        for (const key in ElmPlusIcons) {
            const componentConfig = ElmPlusIcons[key];
            app.component(componentConfig.name, componentConfig);
        }
    },
};
