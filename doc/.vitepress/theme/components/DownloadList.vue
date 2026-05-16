<script setup>
import { ref, onMounted, computed } from 'vue'
import { useData } from 'vitepress'

const { frontmatter } = useData()

// 基础配置列表
const rawRepos = computed(() => frontmatter.value.repos || [])
const manualList = computed(() => frontmatter.value.manual || [])

// 存储各个动态仓库的 GitHub 完整 Release 列表数据
const apiDataMap = ref({})
const loadingMap = ref({})

// 智能解析 GitHub 字段：兼容 "Owner/Repo" 或 "https://github.com/Owner/Repo..."
const parseRepoPath = (githubField) => {
  if (!githubField) return ''
  let path = githubField.trim()
  if (path.includes('github.com/')) {
    path = path.split('github.com/')[1]
  }
  path = path.replace(/\/releases\/?$/, '').replace(/\/$/, '')
  return path
}

// 字节转换为可读大小
const formatSize = (bytes) => {
  if (!bytes) return ''
  const mb = bytes / (1024 * 1024)
  return mb.toFixed(1) + ' MB'
}

// 格式化 ISO 时间为 YYYY/MM/DD
const formatDate = (isoString) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`
}

// 轻量 Markdown 解释器
const renderMarkdown = (mdText) => {
  if (!mdText) return ''
  let html = mdText
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

  html = html.replace(/\r\n/g, '<br>').replace(/\n/g, '<br>')

  html = html.replace(/^(#{1,6})\s+(.+?)(?=<br>|$)/gm, (match, hashes, content) => {
    const level = hashes.length
    return `<h${level} style="margin:8px 0;font-weight:700;font-size:${1.4 - level*0.1}rem;">${content}</h${level}>`
  })

  html = html.replace(/`([^`]+)`/g, '<code style="background:var(--vp-c-bg-alt);padding:2px 4px;border-radius:4px;font-family:var(--vp-font-family-mono);font-size:0.9em;color:var(--vp-c-brand-1)">$1</code>')
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong style="font-weight:700;color:var(--vp-c-text-1);">$1</strong>')
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color:var(--vp-c-brand-1);text-decoration:underline;">$1</a>')
  html = html.replace(/^([*+-])\s+(.+?)(?=<br>|$)/gm, '<div style="padding-left:12px;margin:2px 0;">• $2</div>')

  return html.replace(/(<\/div>)<br>/g, '$1')
}

// 异步拉取 GitHub Releases 列表数据
onMounted(() => {
  rawRepos.value.forEach(async (repo) => {
    const repoPath = parseRepoPath(repo.github)
    if (!repoPath) return

    loadingMap.value[repo.github] = true

    try {
      const res = await fetch(`https://api.github.com/repos/${repoPath}/releases`)
      if (res.ok) {
        const data = await res.json()
        apiDataMap.value[repo.github] = data
      }
    } catch (e) {
      console.error(`Failed to fetch GitHub API for ${repoPath}:`, e)
    } finally {
      loadingMap.value[repo.github] = false
    }
  })
})

// 根据 Frontmatter 的 prerelease 配置，动态筛选出最符合条件的 Release 版本
const getTargetRelease = (repoItem) => {
  const releases = apiDataMap.value[repoItem.github]
  if (!releases || !releases.length) return null

  if (repoItem.prerelease) {
    return releases[0]
  }

  const stableRelease = releases.find(r => !r.prerelease && !r.draft)
  return stableRelease || releases[0]
}

// 控制日志折叠状态
const expandedKey = ref(null)
const toggleLog = (key) => {
  expandedKey.value = expandedKey.value === key ? null : key
}

// 标题区域跳转 GitHub 主页
const navToRepo = (githubField) => {
  const repoPath = parseRepoPath(githubField)
  if (repoPath) {
    window.open(`https://github.com/${repoPath}`, '_blank')
  }
}
</script>

<template>
  <div class="vp-download-container">
    <div class="download-grid">

      <div
          v-for="(item, index) in rawRepos"
          :key="'repo-' + index"
          class="download-card"
          :class="{ 'is-expanded': expandedKey === 'repo-' + index }"
      >
        <div class="main-link-area" @click="navToRepo(item.github)" title="前往项目仓库">
          <img :src="item.icon" class="card-icon" :alt="item.name" />
          <div class="header-main">
            <h4>{{ item.name }}</h4>
            <p class="desc">{{ item.desc }}</p>
          </div>
        </div>

        <div class="card-footer-flow">
          <div class="card-content" v-if="loadingMap[item.github]">
            <div class="release-info">
              <div class="skeleton-text" style="width: 100%"></div>
            </div>
            <div class="card-actions">
              <div class="skeleton-btn"></div>
            </div>
          </div>

          <div class="card-content" v-else-if="getTargetRelease(item)">
            <div class="release-info">
              <div class="meta">
                <a
                    :href="getTargetRelease(item).html_url"
                    target="_blank"
                    class="tag clickable-tag"
                    @click.stop
                    title="查看当前版本发布页面"
                >
                  {{ getTargetRelease(item).tag_name }}
                  <span v-if="getTargetRelease(item).prerelease" class="pre-badge">(Pre)</span>
                </a>
                <span class="date">{{ formatDate(getTargetRelease(item).published_at) }}</span>
              </div>
            </div>

            <div
                v-if="getTargetRelease(item).body"
                class="nested-changelog-box"
            >
              <div class="changelog-bar" @click="toggleLog('repo-' + index)">
                <span class="bar-title">
                  更新内容
                  <span class="indicator-emoji">{{ expandedKey === 'repo-' + index ? '🔼' : '🔽' }}</span>
                </span>
                <i class="fas fa-chevron-down fold-arrow"></i>
              </div>
              <div class="changelog-body">
                <div class="markdown-render" v-html="renderMarkdown(getTargetRelease(item).body)"></div>
              </div>
            </div>

            <div class="card-actions" v-if="getTargetRelease(item).assets">
              <a
                  v-for="(asset, aIdx) in getTargetRelease(item).assets"
                  :key="asset.id"
                  :href="asset.browser_download_url"
                  :class="['btn', aIdx === 0 ? 'primary' : 'secondary']"
              >
                <span class="file-name" :title="asset.name">{{ asset.name }}</span>
                <span class="size-text">{{ formatSize(asset.size) }}</span>
              </a>

              <a
                  v-if="getTargetRelease(item).assets.length === 0"
                  :href="getTargetRelease(item).html_url"
                  target="_blank"
                  class="btn primary"
              >
                <span class="file-name">前往网页端下载</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div
          v-for="(item, index) in manualList"
          :key="'manual-' + index"
          class="download-card"
          :class="{ 'is-expanded': expandedKey === 'manual-' + index }"
      >
        <div class="main-link-area" @click="item.url && window.open(item.url, '_blank')" :class="{ 'has-link': item.url }">
          <img :src="item.icon" class="card-icon" :alt="item.name" />
          <div class="header-main">
            <h4>{{ item.name }}</h4>
            <p class="desc">{{ item.desc }}</p>
          </div>
        </div>

        <div class="card-footer-flow">
          <div class="card-content">
            <div class="release-info">
              <div class="meta">
                <a v-if="item.url" :href="item.url" target="_blank" class="tag static-tag clickable-tag" @click.stop>
                  {{ item.version || '手动维护' }}
                </a>
                <span v-else class="tag static-tag">{{ item.version || '手动维护' }}</span>
                <span class="date">{{ item.date || '未知时间' }}</span>
              </div>
            </div>

            <div v-if="item.changelog" class="nested-changelog-box">
              <div class="changelog-bar" @click="toggleLog('manual-' + index)">
                <span class="bar-title">
                  更新内容
                  <span class="indicator-emoji">{{ expandedKey === 'manual-' + index ? '🔼' : '🔽' }}</span>
                </span>
                <i class="fas fa-chevron-down fold-arrow"></i>
              </div>
              <div class="changelog-body">
                <div class="markdown-render" v-html="renderMarkdown(item.changelog)"></div>
              </div>
            </div>

            <div class="card-actions">
              <a :href="item.url" target="_blank" class="btn primary">
                <span class="file-name">{{ item.label || '立即下载' }}</span>
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
   精细化排版布局与 VitePress 主题无缝适配
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

/* 专属跳转点击热区：始终保持横向布局 */
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
  gap: 4px;
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
  font-weight: normal;
}

.static-tag {
  color: #34c759;
}

.date {
  color: var(--vp-c-text-3);
}

.card-actions {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-top: auto;
  width: 100%;
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
  transition: background-color 0.2s, transform 0.1s;
  cursor: pointer;
  box-sizing: border-box;
  width: 100%;
}

.btn.primary { background: var(--vp-c-brand-1); color: white !important; }
.btn.primary:hover { background: var(--vp-c-brand-2); }
.btn.secondary { background: var(--vp-c-bg-alt); color: var(--vp-c-text-1) !important; border: 1px solid var(--vp-c-divider); }
.btn.secondary:hover { background: var(--vp-c-divider); }
.btn:active { transform: scale(0.99); }

.file-name {
  flex: 1;
  min-width: 120px;
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

/* 折叠日志容器 */
.nested-changelog-box {
  background: var(--vp-c-bg-alt);
  border-radius: 8px;
  border: 1px dashed var(--vp-c-divider);
  margin-bottom: 1rem;
  overflow: hidden;
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

.download-card.is-expanded .fold-arrow {
  transform: rotate(180deg);
}

.markdown-render {
  font-size: 12.5px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

/* 骨架屏 */
.skeleton-text {
  height: 12px;
  background: linear-gradient(90deg, var(--vp-c-bg-alt) 25%, var(--vp-c-divider) 37%, var(--vp-c-bg-alt) 63%);
  background-size: 400% 100%;
  animation: skeleton-loading 1.4s ease infinite;
  border-radius: 4px;
}
.skeleton-btn {
  height: 38px;
  background: var(--vp-c-bg-alt);
  border-radius: 8px;
  width: 100%;
}
@keyframes skeleton-loading {
  0% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* 针对移动手机终端专门优化（保留 .main-link-area 左右对齐，仅处理按钮） */
@media (max-width: 420px) {
  /* 【核心优化点】移除 flex-direction: column，让 logo 和名称描述保持左右分布 */
  .main-link-area {
    flex-direction: row !important;
    gap: 1rem;
  }
  .card-icon {
    width: 46px; /* 移动端微调减小一点点，留出更多空间给右侧文本 */
    height: 46px;
  }
  .desc {
    min-height: auto; /* 移除最小高度限制，让流式排版自然包裹 */
  }
  .btn { padding: 10px; }
  .file-name { min-width: 100%; margin-bottom: 2px; }
  .size-text { width: 100%; text-align: left; opacity: 0.6; font-size: 11px; }
}
</style>