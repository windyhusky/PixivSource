<script setup>
/**
 * DownloadCard.vue
 * 单张下载卡片组件。
 *
 * Props:
 *   - item          {Object}  仓库配置项（name, desc, icon, link, recommend, show_assets, prerelease, ...）
 *   - release       {Object|null}  经过 transformReleases 格式化后的目标 Release 对象
 *   - loading       {Boolean} 是否正在加载 API 数据
 *   - getDownloadUrl {Function} (assetUrl, repoItem) => String  链接转换函数（由父组件注入）
 *
 * 说明：
 *   - 折叠/展开状态（更新日志、更多资产）完全由组件自身管理，不依赖父组件。
 *   - 所有样式均为 scoped，不会污染外部。
 */

import { ref, computed } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  release: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  getDownloadUrl: {
    type: Function,
    required: true,
  },
})

// ---------- 折叠状态（卡片内部自治）----------
const logExpanded    = ref(false)
const assetsExpanded = ref(false)

const toggleLog    = () => { logExpanded.value    = !logExpanded.value }
const toggleAssets = () => { assetsExpanded.value = !assetsExpanded.value }

// ---------- 资产列表排序与截断 ----------
const sortedAssets = computed(() => {
  if (!props.release?.assets) return []
  const keyword = props.item.recommend
  return [...props.release.assets].sort((a, b) => {
    const aRec = keyword && a.name.toLowerCase().includes(keyword.toLowerCase())
    const bRec = keyword && b.name.toLowerCase().includes(keyword.toLowerCase())
    return bRec - aRec
  })
})

const visibleAssets = computed(() => {
  if (assetsExpanded.value || !props.item.show_assets) return sortedAssets.value
  return sortedAssets.value.slice(0, Number(props.item.show_assets))
})

const hiddenCount = computed(() => {
  if (!props.item.show_assets) return 0
  return Math.max(0, sortedAssets.value.length - Number(props.item.show_assets))
})

// ---------- 工具函数 ----------
const formatSize = (bytes) => {
  if (!bytes) return ''
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const isRecommend = (assetName) => {
  const kw = props.item.recommend
  return kw && assetName.toLowerCase().includes(kw.toLowerCase())
}

const navToRepo = () => {
  const url = props.item.link || props.item.github || props.item.url
  if (url) window.open(url.trim(), '_blank')
}
</script>

<template>
  <div class="download-card" :class="{ 'is-expanded': logExpanded }">
    <!-- 卡片头部：点击跳转仓库 -->
    <div class="main-link-area" @click="navToRepo">
      <img :src="item.icon" class="card-icon" :alt="item.name" />
      <div class="header-main">
        <h4>{{ item.name }}</h4>
        <p class="desc">{{ item.desc }}</p>
      </div>
    </div>

    <!-- 加载中骨架屏 -->
    <div class="card-footer-flow" v-if="loading">
      <div class="card-content">
        <div class="skeleton-text" style="width:100%; height:12px; margin-bottom:1.2rem;"></div>
        <div class="skeleton-btn" style="height:38px;"></div>
      </div>
    </div>

    <!-- 有发版数据 -->
    <div class="card-footer-flow" v-else-if="release">
      <div class="card-content">
        <!-- 版本信息行 -->
        <div class="release-info">
          <div class="meta">
            <a :href="release.html_url" target="_blank" class="tag clickable-tag" @click.stop>
              {{ release.tag_name }}
              <span v-if="release.prerelease" class="pre-badge">(Pre-release)</span>
            </a>
            <span class="date">{{ release.published_at }}</span>
          </div>
        </div>

        <!-- 更新日志折叠区 -->
        <div v-if="release.body" class="nested-changelog-box">
          <div class="changelog-bar" @click="toggleLog">
            <span class="bar-title">
              更新内容
              <span class="indicator-emoji">{{ logExpanded ? '🔼' : '🔽' }}</span>
            </span>
          </div>
          <div class="changelog-body" :class="{ 'is-open': logExpanded }">
            <div class="markdown-render" v-html="release.body"></div>
          </div>
        </div>

        <!-- 下载按钮组 -->
        <div class="card-actions">
          <a
              v-for="asset in visibleAssets"
              :key="asset.id"
              :href="getDownloadUrl(asset.browser_download_url, item)"
              :class="['btn', isRecommend(asset.name) ? 'is-recommend' : 'secondary']"
              target="_blank"
              @click.stop
          >
            <div class="btn-left-content">
              <div class="star-icon-slot">
                <span v-if="isRecommend(asset.name)">🌟</span>
              </div>
              <span class="file-name">{{ asset.name }}</span>
            </div>
            <span v-if="asset.size" class="size-text">{{ formatSize(asset.size) }}</span>
          </a>

          <!-- 展开/折叠更多资产 -->
          <div
              v-if="hiddenCount > 0 || assetsExpanded"
              class="toggle-more-assets-btn"
              @click="toggleAssets"
          >
            {{ assetsExpanded ? '收起部分版本 🔼' : `展开更多版本 (${hiddenCount}+) 🔽` }}
          </div>
        </div>
      </div>
    </div>

    <!-- 手动维护卡片（无 API，item.url 直链）-->
    <div class="card-footer-flow" v-else-if="item.url || item.label">
      <div class="card-content">
        <div class="release-info">
          <div class="meta">
            <span class="tag">{{ item.version || '手动维护' }}</span>
            <span class="date">{{ item.date || '' }}</span>
          </div>
        </div>

        <div v-if="item.changelog" class="nested-changelog-box">
          <div class="changelog-bar" @click="toggleLog">
            <span class="bar-title">
              更新内容
              <span class="indicator-emoji">{{ logExpanded ? '🔼' : '🔽' }}</span>
            </span>
          </div>
          <div class="changelog-body" :class="{ 'is-open': logExpanded }">
            <div class="markdown-render" v-html="item.changelog"></div>
          </div>
        </div>

        <div class="card-actions">
          <a
              :href="getDownloadUrl(item.url, item)"
              target="_blank"
              :class="['btn', item.recommend ? 'is-recommend' : 'primary']"
          >
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
</template>

<style scoped>
/* ===== 卡片容器 ===== */
.download-card {
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-elv);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  transition: all 0.25s ease;
  position: relative;
}
.download-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
}

/* ===== 头部 ===== */
.main-link-area {
  display: flex;
  gap: 1.2rem;
  cursor: pointer;
  margin-bottom: 1rem;
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
.header-main { flex: 1; min-width: 0; }
.header-main h4 {
  margin: 0 0 0.4rem 0;
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.desc {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.5;
  min-height: 42px;
}

/* ===== 内容区域 ===== */
.card-footer-flow { display: flex; flex-direction: column; flex: 1; }
.card-content { display: flex; flex-direction: column; flex: 1; }
.release-info { margin-bottom: 1.2rem; font-size: 0.85rem; }
.meta { display: flex; justify-content: space-between; align-items: center; }
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
.pre-badge { font-size: 11px; color: var(--vp-c-danger-1); font-weight: 500; }
.date { color: var(--vp-c-text-3); }

/* ===== 更新日志折叠 ===== */
.nested-changelog-box {
  background-color: var(--vp-c-bg-alt);
  border-radius: 8px;
  border: 1px dashed var(--vp-c-divider);
  margin-bottom: 1rem;
  overflow: hidden;
}
.changelog-bar {
  padding: 6px 12px;
  cursor: pointer;
  user-select: none;
}
.bar-title { font-size: 11.5px; font-weight: bold; color: var(--vp-c-text-2); }
.indicator-emoji { margin-left: 4px; }
.changelog-body {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}
.changelog-body.is-open {
  max-height: 300px;
  padding: 8px 12px;
  overflow-y: auto;
  border-top: 1px dashed var(--vp-c-divider);
}
.markdown-render { font-size: 12.5px; color: var(--vp-c-text-2); line-height: 1.6; }

/* ===== 下载按钮 ===== */
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
  width: 100%;
  transition: all 0.2s;
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
  border: 1px solid var(--vp-c-divider);
}
.btn.primary {
  background-color: var(--vp-c-brand-1);
  color: white !important;
}
.btn-left-content { display: flex; align-items: center; flex: 1; min-width: 0; }
.star-icon-slot { width: 18px; flex-shrink: 0; font-size: 13px; }
.file-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: left; }
.size-text { font-size: 11px; opacity: 0.85; font-family: var(--vp-font-family-mono); flex-shrink: 0; }

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
.toggle-more-assets-btn:hover { color: var(--vp-c-brand-2); text-decoration: underline; }

/* ===== 骨架屏 ===== */
.skeleton-text, .skeleton-btn {
  background: linear-gradient(90deg, var(--vp-c-bg-alt) 25%, var(--vp-c-divider) 37%, var(--vp-c-bg-alt) 63%);
  background-size: 400% 100%;
  animation: skeleton-loading 1.4s infinite;
  border-radius: 4px;
}
@keyframes skeleton-loading {
  0% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* ===== 响应式 ===== */
@media (max-width: 420px) {
  .btn { flex-wrap: wrap; }
  .file-name { min-width: 100%; margin-bottom: 2px; }
  .size-text { width: 100%; text-align: left; opacity: 0.6; }
}
</style>