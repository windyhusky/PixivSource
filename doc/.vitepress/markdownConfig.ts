import timeline from "vitepress-markdown-timeline"
import type { MarkdownOption } from 'vitepress'

export const markdownConfig: MarkdownOption = {
    lineNumbers: true,
    anchor: { slugify: (s: string) => s, permalink: false },
    config: (md) => {
        md.use(timeline)

        // 网页端自动滤除 GitHub 特属警告横幅
        const originalParse = md.parse
        md.parse = (src, env) => {
            const targetRegex1 = />\s*\[!WARNING\][\s\S]*?你正在\s*GitHub\s*上浏览此文档[\s\S]*?排版更精美\*\*/g
            const targetRegex2 = />\s*\[!WARNING\][\s\S]*?你正在\s*GitHub\s*上瀏覽此文件[\s\S]*?排版更精美\*\*/g
            return originalParse.call(md, src.replace(targetRegex1, '').replace(targetRegex2, ''), env)
        }

        // 图片渲染：懒加载 & 异步解码
        md.renderer.rules.image = (tokens, idx, options, env, self) => {
            const token = tokens[idx]
            token.attrSet('loading', 'lazy')
            token.attrSet('decoding', 'async')
            return self.renderToken(tokens, idx, options)
        }

        // 站内链接过滤器
        const defaultRender = md.renderer.rules.link_open || ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options))
        md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
            const hrefIndex = tokens[idx].attrIndex("href")
            if (hrefIndex >= 0) {
                const hrefAttr = tokens[idx].attrs![hrefIndex]
                if (hrefAttr[1].startsWith("https://loyc.xyz/b/cdx.html?src=")) {
                    hrefAttr[1] = hrefAttr[1].replace("https://loyc.xyz/b/cdx.html?src=", "")
                }
            }
            return defaultRender(tokens, idx, options, env, self)
        }
    }
}