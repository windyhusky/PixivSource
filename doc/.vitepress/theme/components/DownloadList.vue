<script setup>
import { ref, onMounted, computed } from 'vue'
import { useData } from 'vitepress'

const { frontmatter } = useData()

// 基础配置列表
const rawRepos = computed(() => frontmatter.value.repos || [])
const manualList = computed(() => frontmatter.value.manual || [])

// 【新增控制】：顶层是否展示所有阅读版本的全局开关
const showAllRepos = ref(false)

// 【核心修改】：过滤卡片逻辑。如果没勾选“展示所有”，则过滤掉配置了 hide: true 的卡片
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

    // 针对阅读 Beta/官方的特定解析
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
  // 注意：后台拉取依然使用原始完整的列表，提前在内存准备好，这样用户一勾选就能秒出数据
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

const toggleLog = (key) => {
  expandedMap.value[key] = !expandedMap.value[key]
}

const toggleAssets = (key) => {
  expandedAssetsMap.value[key] = !expandedAssetsMap.value[key]
}

const navToRepo = (url) => { url && window.open(url.trim(), '_blank') }
</script>

<template>
  <div class="vp-download-container">

    <div class="global-filter-bar">
      <label class="filter-checkbox-label">
        <input
            type="checkbox"
            v-model="showAllRepos"
            class="filter-checkbox"
        />
        <span class="checkbox-custom-text">显示所有阅读分支版本</span>
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
              <a v-for="asset in getSortedAssets(getTargetRelease(item), item, expandedAssetsMap['repo-'+index])" :key="asset.id" :href="asset.browser_download_url"
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
              <a :href="item.url" target="_blank" :class="['btn', item.recommend ? 'is-recommend' : 'primary']">
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
/* ========================================================
   精细化排版布局与 VitePress 主题无缝适配样式（完全保留先前样式）
   ======================================================== */
.vp-download-container {
  margin-top: 2rem;
  width: 100%;
}
.download-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 1.5rem;
}
.download-card {
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-elv);
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0;
  transition: all 0.25s ease;
  position: relative;
  box-sizing: border-box;
}
.download-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.06);
}
.main-link-area {
  display: flex;
  gap: 1.2rem;
  cursor: pointer;
  margin-bottom: 1rem;
  width: 100%;
}
.card-icon {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  object-fit: cover;
  background-color: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  flex-shrink: 0;
}
.header-main {
  flex: 1;
  min-width: 0;
}
.header-main h4 {
  margin: 0 0 0.4rem 0;
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  transition: color 0.2s ease;
}
.main-link-area:hover h4 {
  color: var(--vp-c-brand-1);
}
.desc {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.5;
  min-height: 42px;
}
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
  width: 100%;
}
.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.tag {
  color: var(--vp-c-brand-1);
  font-weight: 600;
  font-size: 0.95rem;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  text-decoration: none !important;
}
.clickable-tag:hover {
  color: var(--vp-c-brand-2);
  text-decoration: underline !important;
  cursor: pointer;
}
.pre-badge {
  font-size: 11px;
  color: var(--vp-c-danger-1);
  font-weight: 500;
}
.static-tag { color: #34c759; }
.date { color: var(--vp-c-text-3); }
.card-actions {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-top: auto;
  width: 100%;
  align-items: flex-start;
}
.btn {
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  text-decoration: none !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  flex-wrap: wrap;
  transition: all 0.2s ease, transform 0.1s;
  cursor: pointer;
  box-sizing: border-box;
  width: 100%;
}
.btn.is-recommend {
  background: var(--vp-c-brand-1);
  color: white !important;
  font-weight: 600;
  border: 1px solid transparent;
  box-shadow: 0 4px 12px var(--vp-c-brand-3);
}
.btn.is-recommend:hover {
  background: var(--vp-c-brand-2);
  box-shadow: 0 4px 16px var(--vp-c-brand-3);
}
.btn.secondary {
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1) !important;
  border: 1px solid var(--vp-c-divider);
}
.btn.secondary:hover { background: var(--vp-c-divider); }
.btn.primary { background: var(--vp-c-brand-1); color: white !important; }
.btn.primary:hover { background: var(--vp-c-brand-2); }
.btn:active { transform: scale(0.99); }
.btn-left-content {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}
.star-icon-slot {
  width: 18px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
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
  font-size: 11.5px;
  opacity: 0.85;
  font-family: var(--vp-font-family-mono);
  white-space: nowrap;
  flex-shrink: 0;
  text-align: right;
}
.nested-changelog-box {
  background: var(--vp-c-bg-alt);
  border-radius: 8px;
  border: 1px dashed var(--vp-c-divider);
  margin-bottom: 1rem;
  overflow: hidden;
  width: 100%;
}
.changelog-bar {
  padding: 6px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
}
.bar-title {
  font-size: 11.5px;
  font-weight: bold;
  color: var(--vp-c-text-2);
  display: flex;
  align-items: center;
  gap: 4px;
}
.indicator-emoji {
  font-size: 10px;
  transition: all 0.2s ease;
  display: inline-block;
}
.fold-arrow {
  font-size: 10px;
  color: var(--vp-c-text-3);
  transition: transform 0.25s;
}
.changelog-body {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out, padding 0.3s;
}
.download-card.is-expanded .changelog-body {
  max-height: 260px;
  padding: 8px 12px;
  overflow-y: auto;
  border-top: 1px dashed var(--vp-c-divider);
}
.download-card.is-expanded .fold-arrow { transform: rotate(180deg); }
.markdown-render { font-size: 12.5px; color: var(--vp-c-text-2); line-height: 1.6; }

/* 骨架模拟屏 */
.skeleton-text {
  height: 12px;
  background: linear-gradient(90deg, var(--vp-c-bg-alt) 25%, var(--vp-c-divider) 37%, var(--vp-c-bg-alt) 63%);
  background-size: 400% 100%;
  animation: skeleton-loading 1.4s ease infinite;
  border-radius: 4px;
}
.skeleton-btn { height: 38px; background: var(--vp-c-bg-alt); border-radius: 8px; width: 100%; }
@keyframes skeleton-loading {
  0% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.toggle-more-assets-btn {
  width: 100%;
  text-align: center;
  font-size: 12px;
  color: var(--vp-c-brand-1);
  padding: 6px 0;
  cursor: pointer;
  user-select: none;
  font-weight: 500;
  transition: color 0.2s;
  margin-top: 2px;
}
.toggle-more-assets-btn:hover {
  color: var(--vp-c-brand-2);
  text-decoration: underline;
}

.global-filter-bar {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 10px 14px;
  background-color: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}
.filter-checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}
.filter-checkbox {
  width: 16px;
  height: 16px;
  accent-color: var(--vp-c-brand-1);
  cursor: pointer;
}
.checkbox-custom-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
}
.toggle-more-assets-btn {
  width: 100%;
  text-align: center;
  font-size: 12px;
  color: var(--vp-c-brand-1);
  padding: 6px 0;
  cursor: pointer;
  user-select: none;
  font-weight: 500;
  transition: color 0.2s;
  margin-top: 2px;
}
.toggle-more-assets-btn:hover {
  color: var(--vp-c-brand-2);
  text-decoration: underline;
}

/* 手机端响应 */
@media (max-width: 420px) {
  .main-link-area { flex-direction: row !important; gap: 1rem; }
  .card-icon { width: 46px; height: 46px; }
  .desc { min-height: auto; }
  .btn { padding: 10px; }
  .file-name { min-width: 100%; margin-bottom: 2px; }
  .size-text { width: 100%; text-align: left; opacity: 0.6; font-size: 11px; }
}
</style>