import { cnNav, cnSidebar } from './navSideBar.js'
import { cnThemeConfig, twThemeConfig } from "./themeConfig.js"
import twConfig from '../zh-TW/config.zh-TW.json' with { type: 'json' }

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
            nav: twConfig.nav,
            sidebar: twConfig.sidebar,
            ...twThemeConfig
        }
    }
}