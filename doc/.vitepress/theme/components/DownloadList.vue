<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

// 隐式读取当前页面的 Frontmatter 数据
const { frontmatter } = useData()

const downloadData = computed(() => {
  const repos = frontmatter.value.repos || []
  const manual = frontmatter.value.manual || []
  return [...manual, ...repos]
})
</script>

<template>
  <div class="vp-download-container" v-if="downloadData.length">
    <div class="download-grid">
      <div
          v-for="(item, index) in downloadData"
          :key="index"
          class="download-card"
      >
        <img :src="item.icon" class="card-icon" :alt="item.name" />

        <div class="card-content">
          <h4>{{ item.name }}</h4>
          <p class="desc">{{ item.desc }}</p>

          <div class="release-info">
            <div class="meta">
              <span class="tag">{{ item.version || item.label || 'latest' }}</span>
              <span class="date">{{ item.date || '未知时间' }}</span>
            </div>
          </div>

          <div class="card-actions">
            <template v-if="Array.isArray(item.assets)">
              <a
                  v-for="(asset, aIdx) in item.assets"
                  :key="aIdx"
                  :href="asset.url"
                  :class="['btn', aIdx === 0 ? 'primary' : 'secondary']"
              >
                {{ asset.name }} <span v-if="asset.size" class="size-text">({{ asset.size }})</span>
              </a>
            </template>

            <template v-else>
              <a :href="item.url" target="_blank" class="btn primary">
                {{ item.label || '立即下载' }} <span v-if="item.size" class="size-text">({{ item.size }})</span>
              </a>
              <a v-if="item.github" :href="`https://github.com/${item.github}`" target="_blank" class="btn secondary">
                源码
              </a>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vp-download-container {
  margin-top: 2rem;
  width: 100%;
}

.download-grid {
  display: grid;
  /* 精确复刻原版的自适应列宽 */
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 1.5rem;
}

/* 卡片基础骨架：横向 Flex 排版 */
.download-card {
  border: 1px solid var(--vp-c-bg-alt);
  background-color: var(--vp-c-bg-elv);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  border-radius: 12px; /* 映射原版 --border-radius */
  padding: 1.5rem;
  display: flex;
  gap: 1.2rem;
  transition: all 0.25s ease;
  position: relative;
  box-sizing: border-box;
}

/* 夜间模式卡片阴影微调 */
:deep(.dark) .download-card {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.download-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
}

:deep(.dark) .download-card:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
}

/* 左侧图标 */
.card-icon {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  object-fit: cover;
  background-color: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  flex-shrink: 0;
}

/* 右侧主栏 */
.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0; /* 防止长文本撑破弹性盒 */
}

.card-content h4 {
  margin: 0 0 0.4rem 0;
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.3;
}

.desc {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  margin: 0 0 1rem 0;
  line-height: 1.5;
  min-height: 42px;
}

/* 标签区 */
.release-info {
  margin-bottom: 1.2rem;
  font-size: 0.85rem;
}

.meta {
  display: flex;
  gap: 0.6rem;
  align-items: center;
}

.tag {
  background: var(--vp-c-brand-3, rgba(62, 175, 124, 0.15));
  color: var(--vp-c-brand-1);
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
  font-family: var(--vp-font-family-mono, monospace);
}

.date {
  color: var(--vp-c-text-3);
}

/* 按钮组与排版 */
.card-actions {
  display: flex;
  gap: 0.6rem;
  margin-top: auto; /* 确保在描述字数不同时按钮依然底部对齐 */
}

.btn {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  text-decoration: none !important;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s, border-color 0.2s;
  cursor: pointer;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn.primary {
  background: var(--vp-c-brand-1);
  color: var(--vp-c-bg) !important; /* 确保在日夜切换时文字与背景形成高对比度 */
  flex: 2;
}
.btn.primary:hover {
  background: var(--vp-c-brand-2);
}

.btn.secondary {
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
  flex: 1;
}
.btn.secondary:hover {
  background: var(--vp-c-divider);
}

.size-text {
  font-size: 11px;
  opacity: 0.8;
  margin-left: 4px;
}

/* 响应式断点：当屏幕极其狭窄时，无缝由横向转为纵向卡片，防止挤压 */
@media (max-width: 415px) {
  .download-card {
    flex-direction: column;
    gap: 0.8rem;
  }
  .card-icon {
    width: 48px;
    height: 48px;
  }
}
</style>