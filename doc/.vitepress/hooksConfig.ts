import type {SiteConfig} from 'vitepress'
import {execSync} from 'child_process'
import fs from 'fs'
import {join, relative} from 'path'

// 繁体版 Git 时间穿透补丁
export async function transformPageData(pageData: any) {
    const { relativePath } = pageData
    if (relativePath?.startsWith('zh-TW/')) {
        const cnPath = join('doc', relativePath.replace(/^zh-TW\//, ''))
        let time: number | null = null

        try {
            const gitTime = execSync(`git log -1 --format=%ct "${cnPath}"`, { stdio: ['pipe', 'pipe', 'ignore'] }).toString().trim()
            if (gitTime) time = parseInt(gitTime, 10) * 1000
        } catch {}

        if (!time) {
            try { time = fs.statSync(join('doc', relativePath)).mtimeMs } catch {}
        }

        if (time && pageData.frontmatter.lastUpdated !== false) {
            pageData.frontmatter = {...pageData.frontmatter, lastUpdated: time}
        }
    }

    // 暴露所有页面路径
    if (!pageData.frontmatter) pageData.frontmatter = {}
    pageData.frontmatter.allPages = true
}

const _headers = `
# 1. 网页 HTML 文件：禁止缓存，确保每次访问都是最新版本
/*.html
  Cache-Control: no-cache, no-store, must-revalidate
  Pragma: no-cache
  Expires: 0

# 2. 静态资源（哈希后的文件）：允许长期缓存
# VitePress 默认会给 CSS/JS 加上哈希值，更新内容即更新文件名
/*.js
  Cache-Control: public, max-age=31536000, immutable
/*.css
  Cache-Control: public, max-age=31536000, immutable
/*.png
/*.jpg
/*.svg
  Cache-Control: public, max-age=31536000, immutable

# 3. 特殊资源（如 sitemap）
/sitemap.xml
  Content-Type: application/xml; charset=utf-8
  Cache-Control: no-cache, no-store, must-revalidate
`.trim()


const githubRobots = `
User-agent: *
Disallow: /
`.trim()

const cfRobots = `
User-agent: *
Allow: /

# 禁止爬虫访问以 Common 开头的页面（包括各语言版本）
Disallow: /Common
Disallow: /en/Common
Disallow: /zh-TW/Common

# Sitemap
Sitemap: https://pixivsource.pages.dev/sitemap.xml
`.trim()

const getRobotsTxt = (isCF: boolean) => {
    if (isCF) return cfRobots
    else return githubRobots
}


export function getBuildEndHook(isCF: boolean, isGitHub: boolean) {
    return (siteConfig: SiteConfig) => {
        const outDir = siteConfig.outDir

        // 生成 _headers
        fs.writeFileSync(join(outDir, '_headers'), _headers, 'utf8')
        console.log('✅  已生成 headers.txt ')

        // 生成 robots.txt
        const robotsContent = getRobotsTxt(isCF)
        fs.writeFileSync(join(outDir, 'robots.txt'), robotsContent, 'utf8')
        console.log('✅  已生成 robots.txt ')

        // 网址重定向
        const rules = [
            '/sitemap.xml  /sitemap.xml  200',
            '/robots.txt  /robots.txt  200',

            // 旧路径迁移
            `/DownloadLegado  /Download  301`,
            `/downloadlegado  /Download  301`,
            `/zh-TW/DownloadLegado  /zh-TW/Download  301`,
            `/zh-TW/downloadlegado  /zh-TW/Download  301`,
            `/en/DownloadLegado  /en/Download  301`,
            `/en/downloadlegado  /en/Download  301`,

            '/ReadMe  /  301',
            '/readme  /  301'
        ]

        const scan = (dir: string) => {
            for (const file of fs.readdirSync(dir)) {
                const fullPath = join(dir, file)
                const stat = fs.statSync(fullPath)

                if (stat.isDirectory()) {
                    scan(fullPath)
                } else if (file.endsWith('.html')) {
                    let url = '/' + relative(outDir, fullPath).replace(/\\/g, '/').replace(/(index)?\.html$/, '')
                    if (url.length > 1 && url.endsWith('/')) url = url.slice(0, -1)

                    const lower = url.toLowerCase()
                    if (url !== lower) {
                        // 检查是否已有手动规则覆盖这个小写路径，避免冲突
                        const alreadyHandled = rules.some(r => r.startsWith(`${lower}  `))
                        if (!alreadyHandled) {
                            rules.push(`${lower}  ${url}  301`)
                        }
                    }
                }
            }
        }

        scan(outDir)
        fs.writeFileSync(join(outDir, '_redirects'), rules.join('\n'))
        console.log(`✅  已生成 redirects 文件，包含 ${rules.length} 条大小写重定向规则。`)
    }
}