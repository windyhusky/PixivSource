import type { HeadConfig, SiteConfig } from 'vitepress'
import { execSync } from 'child_process'
import fs from 'fs'
import { join } from 'path'


// 繁体版 Git 时间穿透补丁
export async function transformPageData(pageData: any) {
    if (pageData.relativePath && pageData.relativePath.startsWith('zh-TW/')) {
        const cnRelativePath = pageData.relativePath.replace(/^zh-TW\//, '')
        const cnFilePath = join('doc', cnRelativePath)
        let detectedTimestamp = null

        try {
            const gitTimestamp = execSync(`git log -1 --format=%ct "${cnFilePath}"`, { stdio: ['pipe', 'pipe', 'ignore'] })
                .toString()
                .trim()
            if (gitTimestamp) detectedTimestamp = parseInt(gitTimestamp, 10) * 1000
        } catch (e) {}

        if (!detectedTimestamp) {
            try {
                const twFilePath = join('doc', pageData.relativePath)
                detectedTimestamp = fs.statSync(twFilePath).mtime.getTime()
            } catch (e) {}
        }

        if (detectedTimestamp) {
            pageData.lastUpdated = detectedTimestamp
            if (!pageData.frontmatter) pageData.frontmatter = {}
            pageData.frontmatter.lastUpdated = detectedTimestamp
        }
    }
}


// 构建结束自动化生成 (Robots & 重定向)
export function getBuildEndHook(isCF: boolean, isGitHub: boolean) {
    return (siteConfig: SiteConfig) => {
        const robots = isCF
            ? `User-agent: *\nAllow: /\n\nSitemap: https://pixivsource.pages.dev/sitemap.xml\n`
            : `User-agent: *\nDisallow: /\n`
        fs.writeFileSync(join(siteConfig.outDir, 'robots.txt'), robots)

        if (isCF) {
            const rules: string[] = ['/ReadMe  /  301', '/readme  /  301']

            const getFiles = (dir: string) => {
                const files = fs.readdirSync(dir)
                for (const file of files) {
                    const fullPath = join(dir, file)
                    if (fs.statSync(fullPath).isDirectory()) {
                        getFiles(fullPath)
                    } else if (file.endsWith('.html')) {
                        let relPath = fs.relative(siteConfig.outDir, fullPath).replace(/\\/g, '/')
                        relPath = relPath.replace(/index\.html$/, '').replace(/\.html$/, '')

                        let urlPath = relPath.startsWith('/') ? relPath : '/' + relPath
                        if (urlPath.length > 1 && urlPath.endsWith('/')) urlPath = urlPath.slice(0, -1)

                        const lowerPath = urlPath.toLowerCase()
                        if (urlPath !== lowerPath) rules.push(`${lowerPath}  ${urlPath}  301`)
                    }
                }
            }

            getFiles(siteConfig.outDir)
            if (rules.length > 0) {
                fs.writeFileSync(join(siteConfig.outDir, '_redirects'), rules.join('\n'))
                console.log(`\n\x1b[32m✓\x1b[0m 已成功生成 _redirects 文件，包含 ${rules.length} 条大小写重定向规则。`)
            }
        }
    }
}