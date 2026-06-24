<script setup>
/**
 * DownloadList.vue
 * 软件下载页面组件，负责：
 * - 从 frontmatter.legadoRepos / thirdPartyRepos 读取下载卡片配置
 * - 并发拉取 GitHub / Gitee API Release 数据（支持翻页、重试、过期缓存兜底）
 * - 提供「显示全部」全局开关
 * - 将格式化后的数据 + getDownloadUrl 函数传递给 DownloadCard 子组件
 *
 * 与 DownloadCard.vue 配合使用，放置在同一目录下即可。
 *
 * frontmatter 格式：
 * legadoRepos:
 *   - name: 阅读 Sigma
 *     desc: 极致阅读体验
 *     icon: /img/LegadoSigma.png
 *     link: https://github.com/Luoyacheng/legado
 *     recommend: plus_releaseS    # 推荐关键词（匹配 asset 文件名）
 *     show_assets: 2              # 默认折叠后显示几个
 *     prerelease: false           # 取最新正式版还是最新预发布版
 *     hide: true                  # 不展开「显示所有」时隐藏
 *
 * # 如需直链卡片，url 字段替代 link：
 * - name: 某 APK
 *   desc: 说明
 *   icon: /img/xxx.png
 *   url: https://example.com/xxx.apk
 *   label: 立即下载
 *   version: "3.26"
 *   date: "2025/01/01"
 *   size: "12.3 MB"
 *   recommend: true
 *   changelog: "- 修复了 xxx\n- 新增了 yyy"
 */

import { computed, onMounted, ref } from 'vue'
import { useData } from 'vitepress'
import DownloadCard from './DownloadCard.vue'
import {
  resolveRepoMeta,
  transformReleases,
  fetchAllReleases,
  getTargetRelease,
  readStaleCache,
  writeCache,
  CACHE_TTL,
} from '../utils/releases'

const { frontmatter } = useData()

// ---------- 配置读取 ----------
const legadoList = computed(() => frontmatter.value.legadoRepos || [])
const thirdPartyList = computed(() => frontmatter.value.thirdPartyRepos || [])
const repoList = computed(() => [...legadoList.value, ...thirdPartyList.value])

// ---------- 全局开关 ----------
const showAllRepos = ref(false)

// GitHub / CF 下载加速暂时关闭：CF dev 域名无法稳定加速，先保留代码便于后续恢复。
// const useGithubProxy = ref(true)
// const CF_PROXY_DOMAIN = computed(() => {
//   const raw = import.meta.env.VITE_CF_WORKER_URL || ''
//   return raw.endsWith('/') ? raw.slice(0, -1) : raw
// })

// ---------- 按需过滤卡片列表 ----------
const visibleLegadoList = computed(() =>
    showAllRepos.value ? legadoList.value : legadoList.value.filter(item => !item.hide)
)
const visibleThirdPartyList = computed(() =>
    showAllRepos.value ? thirdPartyList.value : thirdPartyList.value.filter(item => !item.hide)
)

// ---------- API 数据存储 ----------
const releaseMap = ref({}) // { repoKey: Release[] }
const loadingMap = ref({}) // { repoKey: boolean }

const getRepoKey = (item) => item?.link || item?.github || ''

// ---------- 下载链接转换（传递给 DownloadCard）----------
const getDownloadUrl = (assetUrl) => {
  if (!assetUrl) return ''
  // GitHub / CF 下载加速暂时关闭：CF dev 域名无法稳定加速，先直接返回原始下载链接。
  // if (useGithubProxy.value && CF_PROXY_DOMAIN.value && assetUrl.includes('github.com')) {
  //   return `${CF_PROXY_DOMAIN.value}/${assetUrl}`
  // }
  return assetUrl
}

// ---------- 取目标 Release ----------
const getTargetReleaseForItem = (repoItem) => {
  const releases = releaseMap.value[getRepoKey(repoItem)]
  return getTargetRelease(releases, repoItem)
}

// ---------- 拉取单个仓库的 Release 数据 ----------
const fetchRepoRelease = async (repoItem) => {
  const repoKey = getRepoKey(repoItem)
  const meta = resolveRepoMeta(repoKey)
  if (!repoKey || !meta) return

  loadingMap.value[repoKey] = true
  const cacheKey = meta.apiUrl
  const ttl = CACHE_TTL[meta.platform] || CACHE_TTL.github

  try {
    const rawData = await fetchAllReleases(meta.apiUrl)
    const releases = transformReleases(rawData, meta.platform, meta.webUrl)
    writeCache(cacheKey, releases, ttl)
    releaseMap.value[repoKey] = releases
  } catch (error) {
    console.error(`[DownloadList] 拉取失败: ${repoKey}`, error)
    // 降级到过期缓存，保证页面有内容可显示
    const stale = readStaleCache(cacheKey)
    if (stale) releaseMap.value[repoKey] = stale
  } finally {
    loadingMap.value[repoKey] = false
  }
}

// ---------- 挂载时并发拉取所有仓库数据 ----------
onMounted(() => {
  Promise.all(repoList.value.map(fetchRepoRelease))
})
</script>

<template>
  <div class="vp-download-container">
    <h1 class="vp-h1">⬇️ 开源阅读 软件下载</h1>

    <div class="category-section" v-if="visibleLegadoList.length">
      <h2 class="category-title">🏛️ 开源阅读及其分支</h2>
      <div class="global-filter-bar">
        <label class="filter-checkbox-label">
          <input v-model="showAllRepos" type="checkbox" class="filter-checkbox" />
          <span class="checkbox-custom-text">显示所有隐藏分支/版本</span>
        </label>
      </div>

      <div class="download-grid">
        <DownloadCard
            v-for="(item, index) in visibleLegadoList"
            :key="getRepoKey(item) || item.url || `legado-${index}`"
            :item="item"
            :release="getTargetReleaseForItem(item)"
            :loading="!!loadingMap[getRepoKey(item)]"
            :get-download-url="getDownloadUrl"
        />
      </div>
    </div>

    <div class="category-section" v-if="visibleThirdPartyList.length">
      <h2 class="category-title">🎀 第三方阅读软件</h2>
      <div class="download-grid">
        <DownloadCard
            v-for="(item, index) in visibleThirdPartyList"
            :key="getRepoKey(item) || item.url || `third-${index}`"
            :item="item"
            :release="getTargetReleaseForItem(item)"
            :loading="!!loadingMap[getRepoKey(item)]"
            :get-download-url="getDownloadUrl"
        />
      </div>
    </div>
  </div>

  <!-- 底部引导 -->
  <div class="bottom-info-banner">
    <p class="more-link-text">
      更多平台更多软件，详见：
      <a href="Download" class="banner-link"><span>📚 软件合集</span></a>
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

/* GitHub / CF 下载加速暂时关闭，先保留样式便于后续恢复。 */
/* .proxy-checkbox { accent-color: #f38020; } */

.checkbox-custom-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  display: flex;
  align-items: center;
  gap: 6px;
}

/* ===== 卡片网格 ===== */
.download-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 1.5rem;
}

/* 修正行间距冲突 */
.download-grid :deep(.download-card) {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

/* ===== 底部引导 ===== */
.bottom-info-banner {
  margin-top: 1rem;
  margin-bottom: 1rem;
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