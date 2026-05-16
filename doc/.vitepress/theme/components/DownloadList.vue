<script setup>
import { ref, onMounted, computed } from 'vue'
import { useData } from 'vitepress'

const { frontmatter } = useData()

// 基础配置列表
const rawRepos = computed(() => frontmatter.value.repos || [])
const manualList = computed(() => frontmatter.value.manual || [])

// 【控制开关一】：顶层是否展示所有阅读版本的全局开关
const showAllRepos = ref(false)

// 【控制开关二】：是否启用 GitHub 代理加速的全局开关（默认开启，方便国内用户）
const useGithubProxy = ref(true)
const CF_PROXY_DOMAIN = import.meta.env.VITE_CF_PROXY_DOMAIN || ''

// 过滤卡片逻辑。如果没勾选“展示所有”，则过滤掉配置了 hide: true 的卡片
const filteredRepos = computed(() => {
  if (showAllRepos.value) {
    return rawRepos.value
  }
  return rawRepos.value.filter(repo => !repo.hide)
})

// 存储标准格式化后的数据
const apiDataMap = ref({})
const loadingMap = ref({})

// 独立折叠状态存储：更新内容折叠
const expandedMap = ref({})
// 独立折叠状态存储：更多资产按钮折叠
const expandedAssetsMap = ref({})

/**
 * 智能下载链接转换器
 * 根据全局加速开关状态，决定是否拼接 Cloudflare 代理前缀
 */
const getDownloadUrl = (assetUrl, repoItem) => {
  if (!assetUrl) return ''

  // 1. 如果是 Gitee 仓库，国内直连很快，不需要也不支持 GitHub 加速，直接返回原链接
  if (repoItem.link && repoItem.link.includes('gitee.com')) {
    return assetUrl
  }

  // 2. 如果是 GitHub 仓库，且用户勾选了“启用 GitHub 加速”
  if (useGithubProxy.value && assetUrl.includes('github.com')) {
    return `${CF_PROXY_DOMAIN}${assetUrl}`
  }

  // 3. 未勾选加速，或非 GitHub 资源，返回原官方链接
  return assetUrl
}

/**
 * 高级轻量 Markdown 解析器
 */
const renderMarkdown = (mdText) => {
  if (!mdText) return ''

  let html = mdText
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

  html = html.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

  // 解析标题
  html = html.replace(/^(#{1,6})\s+(.+?)(?=\n|$)/gm, (match, hashes, content) => {
    const level = hashes.length
    return `<h${level} style="margin:12px 0 8px 0;font-weight:700;font-size:${1.4 - level*0.1}rem;color:var(--vp-c-text-1);">${content}</h${level}>`
  })

  // 解析无序列表 (* 或 -)
  html = html.replace(/(?:^([*+-])\s+(.+?)(?:\n|$))+/gm, (match) => {
    const items = match.trim().split('\n')
        .map(line => {
          const m = line.match(/^[*+-]\s+(.+)$/)
          return m ? `<li style="margin:4px 0;list-style-type:disc;">${m[1]}</li>` : ''
        })
        .join('')
    return `<ul style="padding-left:20px;margin:8px 0;">${items}</ul>`
  })

  // 基础样式解析
  html = html.replace(/`([^`\n]+)`/g, '<code style="background:var(--vp-c-bg-alt);padding:2px 6px;border-radius:4px;font-family:var(--vp-font-family-mono);font-size:0.85em;color:var(--vp-c-brand-1);border:1px solid var(--vp-c-divider)">$1</code>')
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong style="font-weight:700;color:var(--vp-c-text-1);">$1</strong>')
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color:var(--vp-c-brand-1);text-decoration:underline;">$1</a>')

  // 处理剩余换行
  return html.split('\n').map(line => {
    if (line.trim().startsWith('<ul') || line.trim().startsWith('<li') || line.trim().startsWith('</ul') || line.trim().startsWith('<h')) return line
    return line ? line + '<br>' : ''
  }).join('\n')
}

/**
 * 统一数据清洗适配器
 */
const transformReleases = (rawData, platform) => {
  if (!Array.isArray(rawData)) return []

  const normalizedRawData = platform === 'gitee' ? [...rawData].reverse() : rawData

  return normalizedRawData.map(item => {
    const rawAssets = item.assets || []
    const filteredAssets = rawAssets.filter(a => {
      const n = (a.name || '').toLowerCase()
      return !n.endsWith('.zip') && !n.endsWith('.tar.gz')
    })

    const isPre = platform === 'gitee'
        ? (item.prerelease || ['beta', 'alpha', 'pre'].some(k => String(item.tag_name).toLowerCase().includes(k)))
        : item.prerelease

    // 针对阅读 Beta / 官方特殊 tag 解析
    let finalTagName = item.tag_name
    if (String(item.tag_name).toLowerCase() === 'beta' && item.name) {
      finalTagName = item.name.replace(/^legado_app_/, '')
    }

    return {
      tag_name: finalTagName,
      prerelease: isPre,
      published_at: platform === 'gitee' ? item.created_at : item.published_at,
      body: renderMarkdown(item.body || ''),
      html_url: platform === 'gitee' ? `https://gitee.com/${item.author?.login}/${item.name?.replace('legado_app_', '')}/releases` : item.html_url,
      assets: filteredAssets.map(a => ({
        id: platform === 'gitee' ? a.browser_download_url : a.id,
        name: a.name,
        browser_download_url: a.browser_download_url,
        size: platform === 'gitee' ? null : a.size
      }))
    }
  })
}

const resolveRepoMeta = (urlField) => {
  if (!urlField) return null
  const url = urlField.trim()
  if (url.includes('gitee.com/')) {
    let path = url.split('gitee.com/')[1].replace(/\/releases\/?$/, '').replace(/\/$/, '')
    return { platform: 'gitee', apiUrl: `https://gitee.com/api/v5/repos/${path}/releases` }
  } else if (url.includes('github.com/')) {
    let path = url.split('github.com/')[1].replace(/\/releases\/?$/, '').replace(/\/$/, '')
    return { platform: 'github', apiUrl: `https://api.github.com/repos/${path}/releases` }
  }
  return null
}

const formatSize = (bytes) => {
  if (!bytes) return ''
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const formatDate = (isoString) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`
}

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
      console.error(e)
    } finally {
      loadingMap.value[link] = false
    }
  })
})

const getTargetRelease = (repoItem) => {
  const releases = apiDataMap.value[repoItem.link || repoItem.github]
  if (!releases || !releases.length) return null
  return (repoItem.prerelease ? releases[0] : (releases.find(r => !r.prerelease) || releases[0]))
}

const getSortedAssets = (releaseItem, repoItem, isViewAll = false) => {
  if (!releaseItem || !releaseItem.assets) return []
  const recommendKeyword = repoItem.recommend

  const sorted = [...releaseItem.assets].sort((a, b) => {
    const aRec = recommendKeyword && a.name.toLowerCase().includes(recommendKeyword.toLowerCase())
    const bRec = recommendKeyword && b.name.toLowerCase().includes(recommendKeyword.toLowerCase())
    return bRec - aRec
  })

  if (isViewAll || !repoItem.show_assets) {
    return sorted
  }
  return sorted.slice(0, Number(repoItem.show_assets))
}

const toggleLog = (key) => { expandedMap.value[key] = !expandedMap.value[key] }
const toggleAssets = (key) => { expandedAssetsMap.value[key] = !expandedAssetsMap.value[key] }
const navToRepo = (url) => { url && window.open(url.trim(), '_blank') }
</script>

<template>
  <div class="vp-download-container">

    <div class="global-filter-bar">
      <label class="filter-checkbox-label">
        <input type="checkbox" v-model="showAllRepos" class="filter-checkbox" />
        <span class="checkbox-custom-text">显示所有阅读分支版本</span>
      </label>

      <label class="filter-checkbox-label">
        <input type="checkbox" v-model="useGithubProxy" class="filter-checkbox proxy-checkbox" />
        <span class="checkbox-custom-text">
          启用 GitHub 下载加速
          <span class="speed-badge" v-if="useGithubProxy">(由 Cloudflare 支持)</span>
        </span>
      </label>
    </div>

    <div class="download-grid">
      <div v-for="(item, index) in filteredRepos" :key="'repo-'+index" class="download-card" :class="{'is-expanded': expandedMap['repo-'+index]}">
        <div class="main-link-area" @click="navToRepo(item.link || item.github)">
          <img :src="item.icon" class="card-icon" />
          <div class="header-main">
            <h4>{{ item.name }}</h4>
            <p class="desc">{{ item.desc }}</p>
          </div>
        </div>
        <div class="card-footer-flow">
          <div class="card-content" v-if="loadingMap[item.link || item.github]">
            <div class="skeleton-text" style="width:100%; height:12px; margin-bottom:1.2rem;"></div>
            <div class="skeleton-btn" style="height:38px;"></div>
          </div>
          <div class="card-content" v-else-if="getTargetRelease(item)">
            <div class="release-info">
              <div class="meta">
                <a :href="getTargetRelease(item).html_url" target="_blank" class="tag clickable-tag" @click.stop>
                  {{ getTargetRelease(item).tag_name }}
                  <span v-if="getTargetRelease(item).prerelease" class="pre-badge">(Pre-release)</span>
                </a>
                <span class="date">{{ formatDate(getTargetRelease(item).published_at) }}</span>
              </div>
            </div>

            <div v-if="getTargetRelease(item).body" class="nested-changelog-box">
              <div class="changelog-bar" @click="toggleLog('repo-'+index)">
                <span class="bar-title">更新内容 <span class="indicator-emoji">{{ expandedMap['repo-'+index] ? '🔼' : '🔽' }}</span></span>
              </div>
              <div class="changelog-body">
                <div class="markdown-render" v-html="getTargetRelease(item).body"></div>
              </div>
            </div>

            <div class="card-actions">
              <a v-for="asset in getSortedAssets(getTargetRelease(item), item, expandedAssetsMap['repo-'+index])"
                 :key="asset.id"
                 :href="getDownloadUrl(asset.browser_download_url, item)"
                 :class="['btn', item.recommend && asset.name.toLowerCase().includes(item.recommend.toLowerCase()) ? 'is-recommend' : 'secondary']">
                <div class="btn-left-content">
                  <div class="star-icon-slot"><span v-if="item.recommend && asset.name.toLowerCase().includes(item.recommend.toLowerCase())">🌟</span></div>
                  <span class="file-name">{{ asset.name }}</span>
                </div>
                <span v-if="asset.size" class="size-text">{{ formatSize(asset.size) }}</span>
              </a>

              <div
                  v-if="item.show_assets && getTargetRelease(item).assets.length > Number(item.show_assets)"
                  class="toggle-more-assets-btn"
                  @click="toggleAssets('repo-'+index)"
              >
                {{ expandedAssetsMap['repo-'+index] ? '收起部分版本 🔼' : `展开更多版本 (${getTargetRelease(item).assets.length - item.show_assets}+) 🔽` }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-for="(item, index) in manualList" :key="'manual-'+index" class="download-card" :class="{'is-expanded': expandedMap['manual-'+index]}">
        <div class="main-link-area" @click="item.url && navToRepo(item.url)">
          <img :src="item.icon" class="card-icon" />
          <div class="header-main">
            <h4>{{ item.name }}</h4>
            <p class="desc">{{ item.desc }}</p>
          </div>
        </div>
        <div class="card-footer-flow">
          <div class="card-content">
            <div class="release-info">
              <div class="meta">
                <span class="tag">{{ item.version || '手动维护' }}</span>
                <span class="date">{{ item.date || '' }}</span>
              </div>
            </div>
            <div v-if="item.changelog" class="nested-changelog-box">
              <div class="changelog-bar" @click="toggleLog('manual-'+index)">
                <span class="bar-title">更新内容 <span class="indicator-emoji">{{ expandedMap['manual-'+index] ? '🔼' : '🔽' }}</span></span>
              </div>
              <div class="changelog-body">
                <div class="markdown-render" v-html="renderMarkdown(item.changelog)"></div>
              </div>
            </div>
            <div class="card-actions">
              <a :href="getDownloadUrl(item.url, item)" target="_blank" :class="['btn', item.recommend ? 'is-recommend' : 'primary']">
                <div class="btn-left-content">
                  <div class="star-icon-slot"><span v-if="item.recommend">🌟</span></div>
                  <span class="file-name">{{ item.label || '立即下载' }}</span>
                </div>
                <span v-if="item.size" class="size-text">{{ item.size }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ==========================================================================
   1. 基础容器与网格布局 (Container & Grid)
   ========================================================================== */
.vp-download-container {
  margin-top: 2rem;
  width: 100%;
}

.download-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 1.5rem;
}

/* ==========================================================================
   2. 全局双联动顶栏控制条 (Top Filter Bar)
   ========================================================================== */
.global-filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-top: 12px;
  padding-right: 16px;
  padding-bottom: 12px;
  padding-left: 16px;
  background-color: var(--vp-c-bg-alt);
  border-top-width: 1px;
  border-right-width: 1px;
  border-bottom-width: 1px;
  border-left-width: 1px;
  border-top-style: solid;
  border-right-style: solid;
  border-bottom-style: solid;
  border-left-style: solid;
  border-top-color: var(--vp-c-divider);
  border-right-color: var(--vp-c-divider);
  border-bottom-color: var(--vp-c-divider);
  border-left-color: var(--vp-c-divider);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
}

.filter-checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.filter-checkbox {
  width: 16px;
  height: 16px;
  accent-color: var(--vp-c-brand-1);
  cursor: pointer;
}

.proxy-checkbox {
  accent-color: #f38020; /* Cloudflare 专属橙色 */
}

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
  padding-top: 1px;
  padding-right: 6px;
  padding-bottom: 1px;
  padding-left: 6px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
  font-weight: bold;
}

/* ==========================================================================
   3. 下载卡片基础样式 (Download Card)
   ========================================================================== */
.download-card {
  border-top-width: 1px;
  border-right-width: 1px;
  border-bottom-width: 1px;
  border-left-width: 1px;
  border-top-style: solid;
  border-right-style: solid;
  border-bottom-style: solid;
  border-left-style: solid;
  border-top-color: var(--vp-c-divider);
  border-right-color: var(--vp-c-divider);
  border-bottom-color: var(--vp-c-divider);
  border-left-color: var(--vp-c-divider);
  background-color: var(--vp-c-bg-elv);
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  border-bottom-left-radius: 12px;
  padding-top: 1.5rem;
  padding-right: 1.5rem;
  padding-bottom: 1.5rem;
  padding-left: 1.5rem;
  display: flex;
  flex-direction: column;
  transition-property: all;
  transition-duration: 0.25s;
  transition-timing-function: ease;
  position: relative;
}

.download-card:hover {
  border-top-color: var(--vp-c-brand-1);
  border-right-color: var(--vp-c-brand-1);
  border-bottom-color: var(--vp-c-brand-1);
  border-left-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
}

/* ==========================================================================
   4. 卡片头部与图标 (Card Header & Icon)
   ========================================================================== */
.main-link-area {
  display: flex;
  gap: 1.2rem;
  cursor: pointer;
  margin-bottom: 1rem;
}

.card-icon {
  width: 52px;
  height: 52px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  object-fit: cover;
  background-image: none;
  background-color: var(--vp-c-bg-alt);
  border-top-width: 1px;
  border-right-width: 1px;
  border-bottom-width: 1px;
  border-left-width: 1px;
  border-top-style: solid;
  border-right-style: solid;
  border-bottom-style: solid;
  border-left-style: solid;
  border-top-color: var(--vp-c-divider);
  border-right-color: var(--vp-c-divider);
  border-bottom-color: var(--vp-c-divider);
  border-left-color: var(--vp-c-divider);
  flex-shrink: 0;
}

.header-main {
  flex: 1;
  min-width: 0;
}

.header-main h4 {
  margin-top: 0px;
  margin-right: 0px;
  margin-bottom: 0.4rem;
  margin-left: 0px;
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.desc {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  margin-top: 0px;
  margin-right: 0px;
  margin-bottom: 0px;
  margin-left: 0px;
  line-height: 1.5;
  min-height: 42px;
}

/* ==========================================================================
   5. 数据流布局与版本信息 (Content Flow & Meta)
   ========================================================================== */
.card-footer-flow {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.release-info {
  margin-bottom: 1.2rem;
  font-size: 0.85rem;
}

.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tag {
  color: var(--vp-c-brand-1);
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none !important;
  display: flex;
  align-items: center;
  gap: 6px;
}

.clickable-tag:hover {
  color: var(--vp-c-brand-2);
  text-decoration: underline !important;
}

.pre-badge {
  font-size: 11px;
  color: var(--vp-c-danger-1);
  font-weight: 500;
}

.date {
  color: var(--vp-c-text-3);
}

/* ==========================================================================
   6. 折叠更新日志内容区域 (Changelog Box)
   ========================================================================== */
.nested-changelog-box {
  background-color: var(--vp-c-bg-alt);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  border-top-width: 1px;
  border-right-width: 1px;
  border-bottom-width: 1px;
  border-left-width: 1px;
  border-top-style: dashed;
  border-right-style: dashed;
  border-bottom-style: dashed;
  border-left-style: dashed;
  border-top-color: var(--vp-c-divider);
  border-right-color: var(--vp-c-divider);
  border-bottom-color: var(--vp-c-divider);
  border-left-color: var(--vp-c-divider);
  margin-bottom: 1rem;
  overflow: hidden;
  width: 100%;
}

.changelog-bar {
  padding-top: 6px;
  padding-right: 12px;
  padding-bottom: 6px;
  padding-left: 12px;
  cursor: pointer;
  user-select: none;
}

.bar-title {
  font-size: 11.5px;
  font-weight: bold;
  color: var(--vp-c-text-2);
}

.changelog-body {
  max-height: 0px;
  overflow: hidden;
  transition-property: max-height;
  transition-duration: 0.3s;
  transition-timing-function: ease-out;
}

.is-expanded .changelog-body {
  max-height: 300px;
  padding-top: 8px;
  padding-right: 12px;
  padding-bottom: 8px;
  padding-left: 12px;
  overflow-y: auto;
  border-top-width: 1px;
  border-top-style: dashed;
  border-top-color: var(--vp-c-divider);
}

.markdown-render {
  font-size: 12.5px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

/* ==========================================================================
   7. 动作按钮组与单卡包折叠 (Action Buttons & Inner Assets Toggle)
   ========================================================================== */
.card-actions {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-top: auto;
  align-items: flex-start;
  width: 100%;
}

.btn {
  padding-top: 10px;
  padding-right: 14px;
  padding-bottom: 10px;
  padding-left: 14px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  text-decoration: none !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  width: 100%;
  transition-property: all;
  transition-duration: 0.2s;
  box-sizing: border-box;
}

.btn.is-recommend {
  background-color: var(--vp-c-brand-1);
  color: white !important;
  box-shadow: 0 4px 12px var(--vp-c-brand-3);
}

.btn.secondary {
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1) !important;
  border-top-width: 1px;
  border-right-width: 1px;
  border-bottom-width: 1px;
  border-left-width: 1px;
  border-top-style: solid;
  border-right-style: solid;
  border-bottom-style: solid;
  border-left-style: solid;
  border-top-color: var(--vp-c-divider);
  border-right-color: var(--vp-c-divider);
  border-bottom-color: var(--vp-c-divider);
  border-left-color: var(--vp-c-divider);
}

.btn.primary {
  background-color: var(--vp-c-brand-1);
  color: white !important;
}

.btn-left-content {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.star-icon-slot {
  width: 18px;
  flex-shrink: 0;
  font-size: 13px;
}

.file-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
}

.size-text {
  font-size: 11px;
  opacity: 0.85;
  font-family: var(--vp-font-family-mono);
  flex-shrink: 0;
}

/* 展开更多变体 APK 按钮 */
.toggle-more-assets-btn {
  width: 100%;
  text-align: center;
  font-size: 12px;
  color: var(--vp-c-brand-1);
  padding-top: 6px;
  padding-right: 0px;
  padding-bottom: 6px;
  padding-left: 0px;
  cursor: pointer;
  user-select: none;
  font-weight: 500;
  transition-property: color;
  transition-duration: 0.2s;
  margin-top: 2px;
}

.toggle-more-assets-btn:hover {
  color: var(--vp-c-brand-2);
  text-decoration: underline;
}

/* ==========================================================================
   8. 异步加载骨架屏动画 (Skeleton Loading)
   ========================================================================== */
.skeleton-text {
  background: linear-gradient(90deg, var(--vp-c-bg-alt) 25%, var(--vp-c-divider) 37%, var(--vp-c-bg-alt) 63%);
  background-size: 400% 100%;
  animation-name: skeleton-loading;
  animation-duration: 1.4s;
  animation-iteration-count: infinite;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
}

@keyframes skeleton-loading {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* ==========================================================================
   9. 响应式媒体查询断点 (Responsive Media Queries)
   ========================================================================== */
@media (max-width: 580px) {
  .global-filter-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
  }
}

@media (max-width: 420px) {
  .main-link-area {
    flex-direction: row !important;
  }

  .card-icon {
    width: 46px;
    height: 46px;
  }

  .btn {
    padding-top: 10px;
    padding-right: 10px;
    padding-bottom: 10px;
    padding-left: 10px;
    flex-wrap: wrap;
  }

  .file-name {
    min-width: 100%;
    margin-bottom: 2px;
  }

  .size-text {
    width: 100%;
    text-align: left;
    opacity: 0.6;
  }
}
</style>