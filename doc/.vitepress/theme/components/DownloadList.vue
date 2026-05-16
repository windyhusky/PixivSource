<script setup>
/**
 * DownloadPage.vue
 * 软件下载页面组件，负责：
 *   - 从 frontmatter 读取 repos / manual 配置
 *   - 并发拉取 GitHub / Gitee API 数据
 *   - 提供「显示全部」「GitHub 加速」两个全局开关
 *   - 将格式化后的数据 + getDownloadUrl 函数传递给 DownloadCard 子组件
 *
 * 与 DownloadCard.vue 配合使用，放置在同一目录下即可。
 *
 * frontmatter 格式：
 *   repos:
 *     - name: 阅读 Sigma
 *       desc: 极致阅读体验
 *       icon: /img/LegadoSigma.png
 *       link: https://github.com/Luoyacheng/legado
 *       recommend: plus_releaseS    # 推荐关键词（匹配 asset 文件名）
 *       show_assets: 2              # 默认折叠后显示几个
 *       prerelease: false           # 取最新正式版还是最新预发布版
 *       hide: true                  # 不展开「显示所有」时隐藏
 *
 *   manual:                         # 手动维护的直链卡片
 *     - name: 某 APK
 *       desc: 说明
 *       icon: /img/xxx.png
 *       url: https://example.com/xxx.apk
 *       label: 立即下载
 *       version: "3.26"
 *       date: "2025/01/01"
 *       size: "12.3 MB"
 *       recommend: true
 *       changelog: "- 修复了 xxx\n- 新增了 yyy"
 */

import { ref, computed, onMounted } from 'vue'
import { useData } from 'vitepress'
import DownloadCard from './DownloadCard.vue'

const { frontmatter } = useData()

// ---------- 配置读取 ----------
const rawRepos   = computed(() => frontmatter.value.repos   || [])
const manualList = computed(() => frontmatter.value.manual  || [])

// ---------- 全局开关 ----------
const showAllRepos    = ref(false)
const useGithubProxy  = ref(true)

// ---------- Cloudflare Worker 代理域名（可在 .env 中配置 VITE_CF_WORKER_URL）----------
const CF_PROXY_DOMAIN = computed(() => {
  const raw = import.meta.env.VITE_CF_WORKER_URL || ''
  return raw.endsWith('/') ? raw.slice(0, -1) : raw
})

// ---------- 按需过滤仓库列表 ----------
const filteredRepos = computed(() =>
    showAllRepos.value ? rawRepos.value : rawRepos.value.filter(r => !r.hide)
)

// ---------- API 数据存储 ----------
const apiDataMap  = ref({})   // { repoKey: Release[] }
const loadingMap  = ref({})   // { repoKey: boolean }

// ---------- Markdown 渲染（轻量，无需引入第三方库）----------
const renderMarkdown = (md) => {
  if (!md) return ''
  let html = md
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\r\n/g, '\n').replace(/\r/g, '\n')

  html = html.replace(/^(#{1,6})\s+(.+?)(?=\n|$)/gm, (_, hashes, content) => {
    const lv = hashes.length
    return `<h${lv} style="margin:12px 0 8px 0;font-weight:700;font-size:${1.4 - lv * 0.1}rem;color:var(--vp-c-text-1);">${content}</h${lv}>`
  })
  html = html.replace(/(?:^([*+-])\s+(.+?)(?:\n|$))+/gm, (match) => {
    const items = match.trim().split('\n')
        .map(line => { const m = line.match(/^[*+-]\s+(.+)$/); return m ? `<li style="margin:4px 0;list-style-type:disc;">${m[1]}</li>` : '' })
        .join('')
    return `<ul style="padding-left:20px;margin:8px 0;">${items}</ul>`
  })
  html = html
      .replace(/`([^`\n]+)`/g, '<code style="background:var(--vp-c-bg-alt);padding:2px 6px;border-radius:4px;font-family:var(--vp-font-family-mono);font-size:0.85em;color:var(--vp-c-brand-1);border:1px solid var(--vp-c-divider)">$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong style="font-weight:700;color:var(--vp-c-text-1);">$1</strong>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color:var(--vp-c-brand-1);text-decoration:underline;">$1</a>')
  return html.split('\n').map(line => {
    if (/^<(ul|li|\/ul|h\d)/.test(line.trim())) return line
    return line ? line + '<br>' : ''
  }).join('\n')
}

// ---------- 格式化 API 数据 ----------
const transformReleases = (rawData, platform) => {
  if (!Array.isArray(rawData)) return []
  const data = platform === 'gitee' ? [...rawData].reverse() : rawData
  return data.map(item => {
    const rawAssets = (item.assets || []).filter(a => {
      const n = (a.name || '').toLowerCase()
      return !n.endsWith('.zip') && !n.endsWith('.tar.gz')
    })
    const isPre = platform === 'gitee'
        ? (item.prerelease || ['beta', 'alpha', 'pre'].some(k => String(item.tag_name).toLowerCase().includes(k)))
        : item.prerelease
    let tag = item.tag_name
    if (String(item.tag_name).toLowerCase() === 'beta' && item.name) {
      tag = item.name.replace(/^legado_app_/, '')
    }
    return {
      tag_name: tag,
      prerelease: isPre,
      published_at: formatDate(platform === 'gitee' ? item.created_at : item.published_at),
      body: renderMarkdown(item.body || ''),
      html_url: platform === 'gitee'
          ? `https://gitee.com/${item.author?.login}/${item.name?.replace('legado_app_', '')}/releases`
          : item.html_url,
      assets: rawAssets.map(a => ({
        id: platform === 'gitee' ? a.browser_download_url : a.id,
        name: a.name,
        browser_download_url: a.browser_download_url,
        size: platform === 'gitee' ? null : a.size,
      }))
    }
  })
}

// ---------- 解析仓库元信息 ----------
const resolveRepoMeta = (url) => {
  if (!url) return null
  url = url.trim()
  if (url.includes('gitee.com/')) {
    const path = url.split('gitee.com/')[1].replace(/\/releases\/?$/, '').replace(/\/$/, '')
    return { platform: 'gitee', apiUrl: `https://gitee.com/api/v5/repos/${path}/releases` }
  }
  if (url.includes('github.com/')) {
    const path = url.split('github.com/')[1].replace(/\/releases\/?$/, '').replace(/\/$/, '')
    return { platform: 'github', apiUrl: `https://api.github.com/repos/${path}/releases` }
  }
  return null
}

// ---------- 工具 ----------
const formatDate = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`
}

// ---------- 下载链接转换（传递给 DownloadCard）----------
const getDownloadUrl = (assetUrl, repoItem) => {
  if (!assetUrl) return ''
  const repoLink = repoItem.link || repoItem.github || ''
  if (repoLink.includes('gitee.com')) return assetUrl
  if (useGithubProxy.value && CF_PROXY_DOMAIN.value && assetUrl.includes('github.com')) {
    return `${CF_PROXY_DOMAIN.value}/${assetUrl}`
  }
  return assetUrl
}

// ---------- 取目标 Release ----------
const getTargetRelease = (repoItem) => {
  const releases = apiDataMap.value[repoItem.link || repoItem.github]
  if (!releases?.length) return null
  return repoItem.prerelease
      ? releases[0]
      : (releases.find(r => !r.prerelease) || releases[0])
}

// ---------- 挂载时并发拉取所有仓库数据 ----------
onMounted(() => {
  rawRepos.value.forEach(async (repo) => {
    const link = repo.link || repo.github
    const meta = resolveRepoMeta(link)
    if (!meta) return
    loadingMap.value[link] = true
    try {
      const res = await fetch(meta.apiUrl)
      if (res.ok) {
        apiDataMap.value[link] = transformReleases(await res.json(), meta.platform)
      }
    } catch (e) {
      console.error(`[DownloadPage] 拉取失败: ${link}`, e)
    } finally {
      loadingMap.value[link] = false
    }
  })
})
</script>

<template>
  <div class="vp-download-container">
    <h1 class="vp-h1">⬇️ 开源阅读 软件下载</h1>

    <!-- 全局控制条 -->
    <div class="global-filter-bar">
      <label class="filter-checkbox-label">
        <input type="checkbox" v-model="showAllRepos" class="filter-checkbox" />
        <span class="checkbox-custom-text">显示所有阅读分支版本</span>
      </label>
      <label class="filter-checkbox-label">
        <input type="checkbox" v-model="useGithubProxy" class="filter-checkbox proxy-checkbox" />
        <span class="checkbox-custom-text">
          启用 GitHub 下载加速
          <span class="speed-badge" v-if="useGithubProxy && CF_PROXY_DOMAIN">
            (由 Cloudflare 支持)
          </span>
        </span>
      </label>
    </div>

    <!-- 卡片网格 -->
    <div class="download-grid">
      <!-- GitHub / Gitee 仓库卡片 -->
      <DownloadCard
          v-for="(item, index) in filteredRepos"
          :key="'repo-' + index"
          :item="item"
          :release="getTargetRelease(item)"
          :loading="!!loadingMap[item.link || item.github]"
          :get-download-url="getDownloadUrl"
      />

      <!-- 手动维护直链卡片 -->
      <!--
        manual 列表的卡片不依赖 API，release 留空，
        DownloadCard 内部会走 item.url / item.label 分支渲染。
      -->
      <DownloadCard
          v-for="(item, index) in manualList"
          :key="'manual-' + index"
          :item="item"
          :release="null"
          :loading="false"
          :get-download-url="getDownloadUrl"
      />
    </div>
  </div>

  <!-- 底部引导 -->
  <div class="bottom-info-banner">
    <p class="more-link-text">
      更多平台更多软件，详见：
      <a href="Download.md" class="banner-link"><span>📚 软件合集</span></a>
    </p>
    <p class="copyright-text">本页面仅为软件聚合下载，应用版权归原作者所有</p>
  </div>
</template>

<style scoped>
.vp-download-container { margin-top: 2rem; width: 100%; }

.vp-h1 {
  font-size: 30px;
  font-weight: 800;
  text-align: center;
  display: block;
  margin: 0 auto 32px;
  padding-top: 40px;
}

/* ===== 全局控制条 ===== */
.global-filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 12px 16px;
  background-color: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}
.filter-checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}
.filter-checkbox { width: 16px; height: 16px; accent-color: var(--vp-c-brand-1); cursor: pointer; }
.proxy-checkbox  { accent-color: #f38020; }
.checkbox-custom-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  display: flex;
  align-items: center;
  gap: 6px;
}
.speed-badge {
  font-size: 11px;
  background-color: rgba(243, 128, 32, 0.15);
  color: #f38020;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: bold;
}

/* ===== 卡片网格 ===== */
.download-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 1.5rem;
}

/* ===== 底部引导 ===== */
.bottom-info-banner {
  margin-top: 3.5rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  text-align: center;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
}
.more-link-text {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 12px 0 !important;
}
.banner-link {
  color: var(--vp-c-brand-1) !important;
  text-decoration: none !important;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: inline-block;
}
.banner-link:hover {
  color: var(--vp-c-brand-2) !important;
  background-color: var(--vp-c-brand-dimm);
  transform: translateY(-1px);
}
.copyright-text {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  margin: 0 !important;
  letter-spacing: 0.5px;
}

/* ===== 响应式 ===== */
@media (max-width: 580px) {
  .global-filter-bar { flex-direction: column; align-items: flex-start; gap: 0.8rem; }
}
</style>