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
}

const _headers  = `
/sitemap.xml
Content-Type: application/xml; charset=utf-8
`.trim()

// 构建结束自动化生成 (Robots & 重定向)
export function getBuildEndHook(isCF: boolean, isGitHub: boolean) {
    return (siteConfig: SiteConfig) => {
        const outDir = siteConfig.outDir
        fs.writeFileSync(join(outDir, '_headers'), _headers, 'utf8')

        // 1. 生成 robots.txt
        const robots = isCF
            ? 'User-agent: *\nAllow: /\n\nSitemap: https://pixivsource.pages.dev/sitemap.xml\n'
            : 'User-agent: *\nDisallow: /\n'
        fs.writeFileSync(join(outDir, 'robots.txt'), robots)
        if (!isCF) return

        // CF 环境下处理大小写重定向
        const rules = [
            '/sitemap.xml  /sitemap.xml  200',
            '/robots.txt  /robots.txt  200',  // 顺手也加上
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
                    if (url !== lower) rules.push(`${lower}  ${url}  301`)
                }
            }
        }

        scan(outDir)
        fs.writeFileSync(join(outDir, '_redirects'), rules.join('\n'))
        console.log(`✅ 已成功生成 _redirects 文件，包含 ${rules.length} 条大小写重定向规则。`)
    }
}