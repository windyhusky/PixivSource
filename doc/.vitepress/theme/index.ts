// .vitepress/theme/index.ts
import DefaultTheme from "vitepress/theme"; // 1. 引入默认主题
import { h } from "vue";

import SponsorTable from "./components/SponsorTable.vue";
import DragonChat from './components/DragonChat.vue'
import NotFound from "./components/404.vue";

export default {
    extends: DefaultTheme, // 2. 继承默认主题
    Layout: () =>
        h(DefaultTheme.Layout, null, {
            "not-found": () => h(NotFound), // 你的 404 组件
        }),
    enhanceApp({ app }) {
        app.component('SponsorTable', SponsorTable)
        app.component('DragonChat', DragonChat)
    }
};