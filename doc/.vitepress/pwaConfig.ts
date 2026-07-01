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
        globPatterns: ['**/*.{css,js,svg,png,ico,txt,woff2}'], // 【修改】移除 html，不预缓存 HTML
        navigateFallback: '/index.html', // 确保 SPA 路由跳转正常
        runtimeCaching: [
            {
                // 【新增】针对 HTML 页面使用 NetworkFirst 策略
                urlPattern: ({ request }) => request.destination === 'document',
                handler: 'NetworkFirst',
                options: {
                    cacheName: 'html-cache',
                    expiration: {
                        maxEntries: 10,
                        maxAgeSeconds: 60 * 60 * 24 // 24小时后过期
                    },
                    networkTimeoutSeconds: 5, // 5秒内没网才用缓存
                }
            },
            {
                // 静态资源保持缓存优先
                urlPattern: ({ request }) =>
                    request.destination === 'style' ||
                    request.destination === 'script' ||
                    request.destination === 'image',
                handler: 'StaleWhileRevalidate',
                options: {
                    cacheName: 'static-resources',
                }
            }
        ],
    },
})