// .vitepress/theme/index.ts
import DefaultTheme from "vitepress/theme";
import "vitepress-markdown-timeline/dist/theme/index.css"; // 引入时间线样式

import { h, watch } from "vue";
import DragonChat from './components/DragonChat.vue'
import NotFound from "./components/404.vue";
import HomeUnderline from "./components/HomeUnderline.vue"
import UpdateTime from "./components/UpdateTime.vue"
import BackToTop from "./components/BackToTop.vue";
import Sponsor from "./components/Sponsor.vue";
import './style/index.css'

// 彩虹背景动画样式
let homePageStyle: HTMLStyleElement | undefined

export default {
    extends: DefaultTheme,
    Layout: () =>
        h(DefaultTheme.Layout, null, {
            "not-found": () => h(NotFound),
            "doc-before": () => h(UpdateTime),
            "doc-footer-before": () => h(BackToTop),
        }),

    enhanceApp({app , router }) {
        app.component('DragonChat', DragonChat)
        app.component('HomeUnderline', HomeUnderline)
        // app.component('UpdateTime', UpdateTime)
        app.component('Sponsor', Sponsor)

        // 彩虹背景动画样式
        if (typeof window !== 'undefined') {
            watch(
                () => router.route.data.relativePath,
                () => updateHomePageStyle(location.pathname === "/PixivSource/"),
                { immediate: true },
            )
        }
    }
};

// 彩虹背景动画样式
function updateHomePageStyle(value: boolean) {
    if (value) {
        if (homePageStyle) return

        homePageStyle = document.createElement('style')
        homePageStyle.innerHTML = `
    :root {
      animation: rainbow 12s linear infinite;
    }`
        document.body.appendChild(homePageStyle)
    } else {
        if (!homePageStyle) return

        homePageStyle.remove()
        homePageStyle = undefined
    }
}