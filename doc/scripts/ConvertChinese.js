/**
 * ConvertChinese.js
 *
 * 將 doc/ 根目錄下的簡體中文 .md 文件轉換為繁體中文
 * 輸出到 doc/zh-TW/ 目錄，並自動生成繁體導覽列與側邊欄配置
 *
 * 用法：
 *   node scripts/ConvertChinese.js
 *
 * 建议在 package.json 里配置：
 *   "build": "node scripts/ConvertChinese.js && vitepress build docs"
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'fs'
import { join, relative, dirname } from 'path'
import { Converter } from 'opencc-js'

// ─── 引入簡體導覽列與側邊欄配置 ──────────────────────────────────────────────
// 這裡去掉副檔名，讓 Node.js 自動相容 .ts 或 .js
import { cnNav, cnSidebar } from '../.vitepress/navSideBar.ts'

// ─── 配置 ────────────────────────────────────────────────────────────────────

const SOURCE_DIR = 'doc'          // 简体中文文档根目录
const OUTPUT_DIR = 'doc/zh-TW'   // 繁体中文输出目录

// 不需要转换的目录（这些目录下的内容会被跳过）
const SKIP_DIRS = [
  'zh-TW',    // 输出目录本身
  'en',       // 英文目录
  '.vitepress',
  'node_modules',
  'pic',      // 图片目录
  'pic.en',
]

// 不需要转换的文件（文件名完全匹配）
const SKIP_FILES = []

// ─── 初始化转换器 ─────────────────────────────────────────────────────────────

const converter = Converter({ from: 'cn', to: 'twp' })

// ─── 导航/侧边栏配置数据转换逻辑 ──────────────────────────────────────────────────

/**
 * 递归转换 VitePress 的导航栏和侧边栏配置
 */
function convertConfigData(data) {
  if (Array.isArray(data)) {
    return data.map(item => convertConfigData(item));
  } else if (data !== null && typeof data === 'object') {
    const newItem = { ...data };

    // 1. 转换文本
    if (newItem.text) {
      newItem.text = converter(newItem.text);
    }

    // 2. 自动修正繁体版的链接路径
    if (newItem.link && typeof newItem.link === 'string') {
      // 排除外部链接（如 http://, https://）和已经处理过的路径
      if (!newItem.link.startsWith('http') && !newItem.link.startsWith('/zh-TW')) {
        // 根路径 "/" 映射为 "/zh-TW/"，其余普通路径加上 "/zh-TW" 前缀
        newItem.link = newItem.link === '/' ? '/zh-TW/' : `/zh-TW${newItem.link}`;
      }
    }

    // 3. 递归处理嵌套的子项目（items）
    if (newItem.items) {
      newItem.items = convertConfigData(newItem.items);
    }

    return newItem;
  }
  return data;
}

// ─── 转换逻辑 ─────────────────────────────────────────────────────────────────

/**
 * 转换 Markdown 文本
 * 规则：
 *   - 跳过代码块（```...```）
 *   - 跳过行内代码（`...`）
 *   - 跳过链接 URL 和图片路径（不转换括号内的 URL 部分）
 *   - 跳过 HTML 标签属性值（src= href= content= 等）
 *   - 跳过 YAML frontmatter 的 key
 *   - 正常转换所有中文文字内容
 */
function convertMarkdown(text) {
  const lines = text.split('\n')
  let inCodeBlock = false
  let inFrontmatter = false
  let frontmatterCount = 0
  const result = []

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]

    // frontmatter 处理（--- 包裹的 YAML 头部）
    if (i === 0 && line.trim() === '---') {
      inFrontmatter = true
      frontmatterCount++
      result.push(line)
      continue
    }
    if (inFrontmatter) {
      if (line.trim() === '---') {
        frontmatterCount++
        if (frontmatterCount >= 2) inFrontmatter = false
        result.push(line)
        continue
      }
      // frontmatter 内只转换 value 部分（冒号后面的内容）
      result.push(convertFrontmatterValue(line))
      continue
    }

    // 代码块切换
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock
      result.push(line)
      continue
    }

    // 代码块内不转换
    if (inCodeBlock) {
      result.push(line)
      continue
    }

    // 普通行：转换，但保护特殊部分
    result.push(convertLine(line))
  }

  return result.join('\n')
}

/**
 * 转换 frontmatter 的 value（冒号后面的部分）
 * key: value  →  key 不变，value 转换
 */
function convertFrontmatterValue(line) {
  const match = line.match(/^(\s*[\w-]+\s*:\s*)(.*)$/)
  if (!match) return converter(line)
  return match[1] + converter(match[2])
}

/**
 * 转换单行内容，保护以下部分不被转换：
 * - 行内代码 `...`
 * - Markdown 链接/图片的 URL 部分 [...](URL)
 * - HTML 标签
 */
function convertLine(line) {
  // 用占位符保护不需要转换的片段
  const protected_segments = []

  let result = line

  // 1. 保护行内代码 `...`
  result = result.replace(/`[^`]*`/g, (match) => {
    const id = `\x00CODE${protected_segments.length}\x00`
    protected_segments.push(match)
    return id
  })

  // 2. 保护 Markdown 链接/图片的 URL 部分
  result = result.replace(/(\]\()([^)]+)(\))/g, (match, open, url, close) => {
    const id = `\x00URL${protected_segments.length}\x00`
    protected_segments.push(match)
    // 只保护 URL，但转换前面的链接文字已经处理完了
    // 这里整体保护，避免 URL 里的字符被误转换
    return id
  })

  // 3. 保护 HTML 标签
  result = result.replace(/<[^>]+>/g, (match) => {
    const id = `\x00HTML${protected_segments.length}\x00`
    protected_segments.push(match)
    return id
  })

  // 4. 转换剩余文字
  result = converter(result)

  // 5. 还原占位符
  result = result.replace(/\x00(CODE|URL|HTML)(\d+)\x00/g, (match, type, idx) => {
    return protected_segments[parseInt(idx)]
  })

  return result
}

/**
 * 修正图片/链接路径
 * zh-TW/ 目录比根目录深一层，相对路径需要加 ../
 * ./pic/xxx.png  →  ../pic/xxx.png
 * ./QuickStart   →  ../QuickStart  （站内链接不加，由 VitePress 路由处理）
 */
function fixPaths(text) {
  // Markdown 图片/链接：![...](./pic/...)  →  ![...](../pic/...)
  text = text.replace(/\]\(\.\/(pic[^)]*)\)/g, '](../$1)')
  // HTML 标签内的 src 属性：src="./pic/..."  →  src="../pic/..."
  text = text.replace(/src="\.\/pic\//g, 'src="../pic/')
  return text
}

// ─── 文件遍历 ─────────────────────────────────────────────────────────────────

function getAllMdFiles(dir, baseDir = dir) {
  const files = []
  const entries = readdirSync(dir)

  for (const entry of entries) {
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      if (SKIP_DIRS.includes(entry)) continue
      files.push(...getAllMdFiles(fullPath, baseDir))
    } else if (entry.endsWith('.md') && !SKIP_FILES.includes(entry)) {
      files.push(fullPath)
    }
  }

  return files
}

// ─── 主流程 ───────────────────────────────────────────────────────────────────

function main() {
  // 1. 处理 Markdown 文件的转换
  const files = getAllMdFiles(SOURCE_DIR)

  if (files.length === 0) {
    console.log('没有找到 .md 文件')
    return
  }

  console.log(`找到 ${files.length} 个文件，开始转换...\n`)

  let successCount = 0
  let errorCount = 0

  for (const filePath of files) {
    try {
      const relPath = relative(SOURCE_DIR, filePath)
      const outputPath = join(OUTPUT_DIR, relPath)
      const outputDirPath = dirname(outputPath)

      // 确保输出目录存在
      mkdirSync(outputDirPath, { recursive: true })

      // 读取、转换、修正路径、写入
      const source = readFileSync(filePath, 'utf-8')
      const converted = convertMarkdown(source)
      const fixed = fixPaths(converted)

      writeFileSync(outputPath, fixed, 'utf-8')
      console.log(`  ✅  ${relPath}`)
      successCount++
    } catch (err) {
      console.error(`  ❌  ${filePath}: ${err.message}`)
      errorCount++
    }
  }

  // 2. 自动生成繁体導覽列與側邊欄配置
  console.log('\n========================================')
  console.log('⏳ 开始自动转换 nav 和 sidebar 配置...')
  try {
    const twNav = convertConfigData(cnNav)
    const twSidebar = convertConfigData(cnSidebar)

    const configResult = {
      nav: twNav,
      sidebar: twSidebar
    }

    // 写入到 doc/zh-TW/ 目录下
    writeFileSync(
        join(OUTPUT_DIR, 'config.zh-TW.json'),
        JSON.stringify(configResult, null, 2),
        'utf-8'
    )
    console.log('  ✅  繁体配置已成功输出至 doc/zh-TW/config.zh-TW.json')
  } catch (err) {
    console.error(`  ❌  生成繁体配置失败: ${err.message}`)
  }
  console.log('========================================\n')
  console.log(`输出目录：${OUTPUT_DIR}`)
}

main()