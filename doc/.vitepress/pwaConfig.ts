// .vitepress/pwaConfig.ts
export const getPwaConfig = (base: string) => ({
    outDir: '.vitepress/dist',
    base: base,
    registerType: 'autoUpdate' as const,
    includeAssets: ['favicon.png', 'favicon-180x180.png', 'favicon-192x192.png'],
    manifest: {
        name: 'Pixiv 书源',
        short_name: 'PixivSource',
        description: '适配 开源阅读 Legado 3.0 的 Pixiv 书源',
        theme_color: '#009ff7',
        background_color: '#ffffff',
        display: 'standalone' as const,
        start_url: base,
        scope: base,
        icons: [
            { src: 'favicon-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: 'favicon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
            { src: 'favicon-180x180.png', sizes: '180x180', type: 'image/png' },
            { src: 'favicon-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
        screenshots: [
            { src: 'screenshot-wide.png', sizes: '1280x750', type: 'image/png', form_factor: 'wide' as const, label: 'Pixiv 书源 - 桌面版' },
            { src: 'screenshot-mobile.png', sizes: '390x760', type: 'image/png', form_factor: 'narrow' as const, label: 'Pixiv 书源 - 移动版' },
        ],
    },
    workbox: {
        globPatterns: ['**/*.{css,js,html,svg,png,ico,txt,woff2}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
    },
})