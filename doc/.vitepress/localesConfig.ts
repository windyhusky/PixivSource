import { cnNav, cnSidebar, twNav, twSideBar } from './navSideBar.js'
import { cnThemeConfig, twThemeConfig, enThemeConfig } from "./themeConfig.js"


export const localesConfig = {
    root: {
        label: '简体中文',
        lang: 'zh-CN',
        title: "Pixiv 书源",
        description: "适配 开源阅读 Legado 3.0 的 Pixiv 书源",
        themeConfig: {
            nav: cnNav,
            sidebar: cnSidebar,
            ...cnThemeConfig
        }
    },
    "zh-TW": {
        label: '繁體中文',
        lang: 'zh-TW',
        link: '/zh-TW/',
        title: "Pixiv 書源",
        description: "適配 開源閲讀 Legado 3.0 的 Pixiv 書源",
        themeConfig: {
            nav: twNav,
            sidebar: twSideBar,
            ...twThemeConfig
        }
    },
    "en": {
        label: 'English',
        lang: 'en-US',
        link: '/en/',
        title: "Pixiv Souse",
        description: "Pixiv BookSource for Legado 3.0",
        themeConfig: {
            nav: "",
            sidebar: "",
            ...enThemeConfig
        }
    }
}