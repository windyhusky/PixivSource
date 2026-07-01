import timeline from "vitepress-markdown-timeline"
import type { MarkdownOption } from 'vitepress'

// 匹配定义的 Emoji 范围
const EMOJI_REGEX = /([\u{1F000}-\u{1FFFF}\u{2600}-\u{27FF}])/gu

export const markdownConfig: MarkdownOption = {
    lineNumbers: true,
    anchor: { slugify: (s: string) => s, permalink: false },
    config: (md) => {
        md.use(timeline)

        // 安全替换文本中的 Emoji：仅拦截 text token，绝不污染属性和标签
        const defaultTextRender = md.renderer.rules.text || ((tokens, idx) => tokens[idx].content)
        md.renderer.rules.text = (tokens, idx, options, env, self) => {
            const content = defaultTextRender(tokens, idx, options, env, self)
            if (EMOJI_REGEX.test(content)) {
                // 这里用 v-pre 阻止 Vue 编译内联内容，确保安全
                return content.replace(EMOJI_REGEX, '<span class="emoji-box" v-pre>$1</span>')
            }
            return content
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