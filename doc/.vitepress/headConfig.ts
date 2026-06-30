import type { HeadConfig } from 'vitepress'

export const getHeadConfig = (base: string): HeadConfig[] => [
    ['meta', { name: 'keywords', content: 'Pixiv 小说, Pixiv 阅读, Pixiv 书源, 阅读书源, Legado 书源, 开源阅读 Pixiv 书源, Pixiv 小说阅读器, 阅读3书源, Pixiv Source, Pixiv BookSource' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '64x64', href: `${base}favicon.png` }],
    ["link", { rel: "apple-touch-icon", sizes: '180x180', href: `${base}favicon-180x180.png` }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '192x192', href: `${base}favicon-192x192.png` }],
    ["link", { rel: "preconnect", href: "https://www.googletagmanager.com" }],
    ["link", { rel: "preconnect", href: "https://www.google-analytics.com" }],
    ["script", { async: "", src: "https://www.googletagmanager.com/gtag/js?id=G-MJW9QDKTDH" }],
    ["script", {}, `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag("js", new Date()); gtag("config", "G-MJW9QDKTDH");`],
]

export const getTransformHead = (isCF: boolean, isGitHub: boolean, canonicalBase: string) => {
    return ({ pageData }) => {
        const path = pageData.relativePath
            .replace(/index\.md$/, '')
            .replace(/\.md$/, '')

        const canonicalUrl = `${canonicalBase}${path}`
        const ogTitle = pageData.frontmatter.title ?? 'Pixiv 书源 - PixivSource'
        const ogDesc = pageData.frontmatter.description ?? '用 Legado 开源阅读 App，像看网文一样阅读 Pixiv 上的小说'
        const heads: HeadConfig[] = [
            ['link', { rel: 'canonical', href: canonicalUrl }],
            ['meta', { property: 'og:title', content: ogTitle }],
            ['meta', { property: 'og:description', content: ogDesc }],
        ]

        if (isGitHub && !isCF) {
            heads.push(
                ['meta', { 'http-equiv': 'refresh', content: `0; url=${canonicalUrl}` }],
                ['script', {}, `window.location.replace("${canonicalUrl}")`]
            )
        }
        return heads
    }
}