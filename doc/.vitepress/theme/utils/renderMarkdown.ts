/**
 * 高级轻量 Markdown 解析器。
 *
 * 支持来自 JSON/API 文本中常见的两种换行形式：
 * - 真实换行：`\r\n`、`\r`、`\n`
 * - 字面量转义换行：`\\r\\n`、`\\r`、`\\n`
 */
export const renderMarkdown = (mdText?: string | null) => {
    if (!mdText) return ''

    // 0. 预处理 Markdown 原文，避免包含字面量 \r\n 的更新日志被当成单行解析。
    let normalizedText = normalizeMarkdownText(mdText)

    // 1. 基础 HTML 实体转义
    let html = normalizedText
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')

    // 2. 基础行内样式解析（优先在单行切分前处理完加粗和代码块）
    html = html.replace(/`([^`\n]+)`/g, '<code style="background:var(--vp-c-bg-alt);padding:2px 6px;border-radius:4px;font-family:var(--vp-font-family-mono);font-size:0.85em;color:var(--vp-c-brand-1);border:1px solid var(--vp-c-divider)">$1</code>')
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong style="font-weight:700;color:var(--vp-c-text-1);">$1</strong>')
    // 严格限制超链接不跨行
    html = html.replace(/\[([^\]\n]+)]\(([^)\n]+)\)/g, '<a href="$2" target="_blank" style="color:var(--vp-c-brand-1);text-decoration:underline;">$1</a>')

    // 3. 核心：按行隔离扫描，从根本上杜绝跨行正则的误杀和吞噬
    const lines = html.split('\n')
    // listStack 记录当前已打开的 <ul> 层级对应的缩进宽度（每个元素是该层级列表项的缩进空格数）
    const listStack: number[] = []
    const processedLines: string[] = []

    /**
     * 将 tab 视为等宽缩进（这里按 4 个空格计算），返回该行的缩进宽度
     */
    const getIndentWidth = (raw: string) => {
        const match = raw.match(/^[ \t]*/)
        if (!match) return 0
        return match[0].replace(/\t/g, '    ').length
    }

    /**
     * 关闭所有已打开的 <ul>
     */
    const closeAllLists = () => {
        while (listStack.length > 0) {
            processedLines.push('</ul>')
            listStack.pop()
        }
    }

    /**
     * 根据新行的缩进宽度，关闭比它更深（缩进更大）的列表层级
     */
    const closeDeeperLists = (indentWidth: number) => {
        while (listStack.length > 0 && listStack[listStack.length - 1] > indentWidth) {
            processedLines.push('</ul>')
            listStack.pop()
        }
    }

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const trimmed = line.trim()

        // 遇到空行
        if (!trimmed) {
            closeAllLists()
            processedLines.push('')
            continue
        }

        // A. 判定是否为标题：行首允许有空格，紧跟 1~6 个 #
        const headingMatch = line.match(/^[ \t]*(#{1,6})\s+(.+)$/)
        if (headingMatch) {
            closeAllLists()
            const level = headingMatch[1].length
            const content = headingMatch[2]
            processedLines.push(`<h${level} style="margin:12px 0 8px 0;font-weight:700;font-size:${1.4 - level * 0.1}rem;color:var(--vp-c-text-1);">${content}</h${level}>`)
            continue
        }

        // B. 判定是否为无序列表项。
        // 不管前面有多少个空格，只要看到 * 或 - 或 + 后面跟着空格，就判定为列表项。
        const listMatch = line.match(/^([ \t]*)[*+-]\s+(.+)$/)
        if (listMatch) {
            const indentWidth = getIndentWidth(line)
            const content = listMatch[2]

            // 先关闭比当前缩进更深的层级
            closeDeeperLists(indentWidth)

            // 如果当前缩进比栈顶更深，说明是新的嵌套层级，开启新的 <ul>
            if (listStack.length === 0 || listStack[listStack.length - 1] < indentWidth) {
                processedLines.push('<ul style="padding-left:20px;margin:8px 0;display:block !important;list-style-type:disc !important;">')
                listStack.push(indentWidth)
            }

            processedLines.push(`<li style="margin:4px 0;list-style-type:disc !important;display:list-item !important;">${content}</li>`)
            continue
        }

        // C. 普通文本行（如果当前在列表里，说明列表断开了，需要全部闭合）
        closeAllLists()

        // 对于形如 [新增] 但前面没有 ### 的行进行兜底加粗（如果有的话）
        if (/^\[.+]$/.test(trimmed)) {
            processedLines.push(`<strong style="display:block;margin:10px 0 4px;color:var(--vp-c-text-1);">${trimmed}</strong>`)
        } else {
            // 普通文本追加原生换行标签
            processedLines.push(`${line}<br>`)
        }
    }

    // 兜底：关闭所有未闭合的 <ul>
    closeAllLists()

    // 4. 合并最终的 HTML。过滤掉由于空行产生的无用碎片，保证 DOM 的连续纯净
    return processedLines.filter(line => line !== '').join('\n')
}

const normalizeMarkdownText = (mdText: string) => {
    let normalizedText = mdText.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

    // JSON/API 中的 Markdown 有时会以字面量 "\\r\\n" 传入；这种情况下需要先还原成真实换行。
    if (!normalizedText.includes('\n') && /\\[rn]/.test(normalizedText)) {
        normalizedText = normalizedText
            .replace(/\\r\\n/g, '\n')
            .replace(/\\n/g, '\n')
            .replace(/\\r/g, '\n')
    }

    return stripSingleMarkdownFence(normalizedText)
}

const stripSingleMarkdownFence = (mdText: string) => {
    const trimmed = mdText.trim()
    const fenceMatch = trimmed.match(/^```[\w-]*\n([\s\S]*?)\n```$/)

    return fenceMatch ? fenceMatch[1] : mdText
}

export default renderMarkdown