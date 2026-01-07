// .vitepress/theme/index.ts
import DefaultTheme from "vitepress/theme";
import "vitepress-markdown-timeline/dist/theme/index.css"; // 引入时间线样式

import { h } from "vue";
import SponsorTable from "./components/SponsorTable.vue";
import DragonChat from './components/DragonChat.vue'
import NotFound from "./components/404.vue";
import HomeUnderline from "./components/HomeUnderline.vue"
import UpdateTime from "./components/UpdateTime.vue"
import BackToTop from "./components/BackToTop.vue";
import './style/index.css'

export default {
    extends: DefaultTheme,
    Layout: () =>
        h(DefaultTheme.Layout, null, {
            "not-found": () => h(NotFound),
            "doc-before": () => h(UpdateTime),
            "doc-footer-before": () => h(BackToTop),
        }),
    enhanceApp({ app }) {
        app.component('SponsorTable', SponsorTable)
        app.component('DragonChat', DragonChat)
        app.component('HomeUnderline', HomeUnderline)
        // app.component('UpdateTime', UpdateTime)
    }
};